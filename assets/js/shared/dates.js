// Provider requests use local calendar days, not UTC dates. Preserve leap-day
// clamping when calculating the same calendar date in the previous year.
export function formatDate(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getToday() {
  return formatDate(new Date());
}

export function getOneYearAgo() {
  const now = new Date();
  const previousYear = new Date(now);
  previousYear.setFullYear(now.getFullYear() - 1);
  if (previousYear.getMonth() !== now.getMonth()) previousYear.setDate(0);
  return formatDate(previousYear);
}

export function getCompactDate(value) {
  return String(value).replaceAll("-", "");
}
