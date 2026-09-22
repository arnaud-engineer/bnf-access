const shareVersion = 1;
const maxEncodedLength = 120000;

function toBase64Url(bytes) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("Lien de partage invalide.");
  const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/"));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function transformBytes(bytes, StreamType, maxBytes = 250000) {
  const stream = new Blob([bytes]).stream().pipeThrough(new StreamType("gzip"));
  const reader = stream.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("Configuration partagée trop volumineuse.");
    }
    chunks.push(value);
  }
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export async function encodeShareConfig(config) {
  const bytes = new TextEncoder().encode(JSON.stringify(config));
  if (bytes.length > 250000) throw new Error("Configuration trop volumineuse pour un lien.");
  const compressed = typeof CompressionStream === "function";
  const encodedBytes = compressed ? await transformBytes(bytes, CompressionStream) : bytes;
  return `${shareVersion}${compressed ? "z" : "r"}.${toBase64Url(encodedBytes)}`;
}

export async function decodeShareConfig(encoded) {
  if (typeof encoded !== "string" || encoded.length > maxEncodedLength) {
    throw new Error("Lien de partage trop long ou invalide.");
  }
  const match = encoded.match(/^1([zr])\.([A-Za-z0-9_-]+)$/);
  if (!match) throw new Error("Version du lien de partage inconnue.");
  if (match[1] === "z" && typeof DecompressionStream !== "function") {
    throw new Error("Ce navigateur ne peut pas lire le lien compressé.");
  }
  const bytes = fromBase64Url(match[2]);
  const decoded = match[1] === "z" ? await transformBytes(bytes, DecompressionStream) : bytes;
  if (decoded.length > 250000) throw new Error("Configuration partagée trop volumineuse.");
  let config;
  try {
    config = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(decoded));
  } catch {
    throw new Error("Lien de partage illisible.");
  }
  if (config?.v !== shareVersion || !["c", "f"].includes(config.m)
    || !Array.isArray(config.l) || !Array.isArray(config.e)
    || (config.m === "c" && !Array.isArray(config.p))) {
    throw new Error("Configuration partagée invalide.");
  }
  return config;
}

export function packFavoriteLayout(layout) {
  return layout.rows.map((row) => [
    row.id,
    row.name,
    row.items.map((item) => item.type === "folder"
      ? [item.id, item.name, item.resourceIds]
      : item.resourceId),
  ]);
}

export function unpackFavoriteLayout(rows) {
  if (rows.length > 100) throw new Error("Trop de rangées dans le partage.");
  let count = 0;
  const validText = (value) => typeof value === "string" && value.length <= 200;
  return {
    version: 1,
    rows: rows.map((row) => {
      if (!Array.isArray(row) || row.length !== 3 || !validText(row[0])
        || !validText(row[1]) || !Array.isArray(row[2])) {
        throw new Error("Organisation des favoris invalide.");
      }
      count += row[2].length;
      if (count > 1500) throw new Error("Trop de favoris dans le partage.");
      return {
        id: row[0],
        name: row[1],
        items: row[2].map((item) => {
          if (validText(item)) return { type: "resource", resourceId: item };
          if (!Array.isArray(item) || item.length !== 3 || !validText(item[0])
            || !validText(item[1]) || !Array.isArray(item[2])
            || item[2].length > 1500 || !item[2].every(validText)) {
            throw new Error("Dossier de favoris invalide.");
          }
          count += item[2].length;
          if (count > 1500) throw new Error("Trop de favoris dans le partage.");
          return { type: "folder", id: item[0], name: item[1], resourceIds: item[2] };
        }),
      };
    }),
  };
}
