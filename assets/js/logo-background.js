const prepared = new Map();
const hydrated = new WeakMap();
const colorDistance = (a, b) => Math.max(...a.map((value, index) => Math.abs(value - b[index])));

function perimeterBackground({data, width, height}) {
  if (width < 3 || height < 3) return null;
  const border = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (x && y && x !== width - 1 && y !== height - 1) continue;
    const offset = (y * width + x) * 4;
    if (data[offset + 3] < 250) return null;
    border.push([data[offset], data[offset + 1], data[offset + 2]]);
  }
  const background = [0, 1, 2].map(channel => {
    const values = border.map(pixel => pixel[channel]).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  });
  return border.filter(pixel => colorDistance(pixel, background) <= 12).length / border.length >= 0.98
    ? background
    : null;
}

function unmattedPixel(pixel, background) {
  const alpha = Math.max(...pixel.map((value, channel) => {
    const bg = background[channel];
    return value > bg ? (value - bg) / (255 - bg) : bg ? (bg - value) / bg : 0;
  }));
  return {alpha, color: pixel.map((value, channel) => alpha
    ? (value - background[channel] * (1 - alpha)) / alpha
    : value)};
}

// Conservative color-to-alpha: only accept an opaque, nearly uniform perimeter.
// Interior pixels of the same color are removed too (including holes in letters).
export function removeBackgroundPixels({data, width, height}) {
  const background = perimeterBackground({data, width, height});
  if (!background) return null;
  const output = new Uint8ClampedArray(data);
  let remaining = 0;
  for (let offset = 0; offset < data.length; offset += 4) {
    if (!data[offset + 3]) continue;
    const pixel = [data[offset], data[offset + 1], data[offset + 2]];
    if (colorDistance(pixel, background) <= 12) {
      output[offset + 3] = 0;
      continue;
    }
    // Unmatte antialiased edges rather than leaving a pale fringe around the logo.
    const {alpha, color} = unmattedPixel(pixel, background);
    for (let channel = 0; channel < 3; channel++) {
      output[offset + channel] = color[channel];
    }
    output[offset + 3] = data[offset + 3] * alpha;
    if (output[offset + 3] > 32) remaining++;
  }
  if (remaining < 4) return null;
  return {data: output, width, height, background};
}

// Flood only from the perimeter, preserving enclosed areas that share its color.
export function removeOuterBackgroundPixels({data, width, height}) {
  let background = perimeterBackground({data, width, height});
  if (!background) {
    const whiteBorder = [];
    let perimeterSize = 0;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if (x && y && x !== width - 1 && y !== height - 1) continue;
      perimeterSize++;
      const offset = (y * width + x) * 4;
      if (data[offset + 3] < 250) return null;
      const pixel = [data[offset], data[offset + 1], data[offset + 2]];
      if (Math.min(...pixel) >= 235 && Math.max(...pixel) - Math.min(...pixel) <= 20) whiteBorder.push(pixel);
    }
    if (whiteBorder.length < Math.max(4, perimeterSize * 0.02)) return null;
    background = [0, 1, 2].map(channel => {
      const values = whiteBorder.map(pixel => pixel[channel]).sort((a, b) => a - b);
      return values[Math.floor(values.length / 2)];
    });
  }
  const output = new Uint8ClampedArray(data);
  const visited = new Uint8Array(width * height);
  const queue = [];
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;
    const offset = index * 4;
    const pixel = [data[offset], data[offset + 1], data[offset + 2]];
    const {alpha} = unmattedPixel(pixel, background);
    // Cross only pixels still overwhelmingly made of the perimeter color.
    // A broader threshold can swallow pale logos connected through antialiasing.
    if (alpha >= 0.25) return;
    visited[index] = 1;
    queue.push(index);
  };
  for (let x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
  for (let y = 1; y < height - 1; y++) { enqueue(0, y); enqueue(width - 1, y); }
  let remaining = 0;
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const index = queue[cursor], x = index % width, y = Math.floor(index / width), offset = index * 4;
    const pixel = [data[offset], data[offset + 1], data[offset + 2]];
    const {alpha, color} = unmattedPixel(pixel, background);
    for (let channel = 0; channel < 3; channel++) output[offset + channel] = color[channel];
    output[offset + 3] = data[offset + 3] * alpha;
    enqueue(x - 1, y); enqueue(x + 1, y); enqueue(x, y - 1); enqueue(x, y + 1);
  }
  for (let offset = 3; offset < output.length; offset += 4) if (output[offset] > 32) remaining++;
  if (!queue.length || remaining < 4) return null;
  return {data: output, width, height, background};
}

export function prepareTransparentLogo(url, mode = "all") {
  const key = `${mode}|${url}`;
  if (prepared.has(key)) return prepared.get(key);
  const promise = (async () => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    const timeout = setTimeout(() => { image.src = ""; }, 10000);
    try {
      image.src = url;
      await image.decode();
      // UI-sized derivative only; never change the source asset (including SVGs).
      const scale = Math.min(1, 1024 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d", {willReadFrequently: true});
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = mode === "outer" ? removeOuterBackgroundPixels(pixels) : removeBackgroundPixels(pixels);
      if (!result) return null;
      context.putImageData(new ImageData(result.data, result.width, result.height), 0, 0);
      return canvas.toDataURL("image/png");
    } finally { clearTimeout(timeout); }
  })();
  if (prepared.size >= 64) prepared.delete(prepared.keys().next().value);
  prepared.set(key, promise);
  return promise;
}

export function hydrateLogoBackgrounds(root = document) {
  for (const image of root.querySelectorAll('[data-icon-remove-background="true"] img, [data-icon-remove-outer-background="true"] img')) {
    if (hydrated.has(image)) continue;
    const source = image.src;
    hydrated.set(image, source);
    const apply = async () => {
      try {
        const mode = image.closest('[data-icon-remove-outer-background="true"]') ? "outer" : "all";
        const result = await prepareTransparentLogo(source, mode);
        if (!image.isConnected || hydrated.get(image) !== source || image.src !== source) return;
        if (result) {
          image.dataset.backgroundRemoved = "true";
          image.src = result;
        }
      } catch {
        // Unavailable/CORS-protected or unsuitable images retain the original.
      }
    };
    if (image.complete && image.naturalWidth) void apply();
    else image.addEventListener("load", apply, {once: true});
  }
}

export function restoreLogoBackground(element) {
  for (const image of element.querySelectorAll("img")) {
    const source = hydrated.get(image);
    hydrated.delete(image);
    delete image.dataset.backgroundRemoved;
    if (source) image.src = source;
  }
}

let scheduled = false;
export function scheduleLogoBackgrounds() {
  if (scheduled || typeof document === "undefined") return;
  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    hydrateLogoBackgrounds();
  });
}
