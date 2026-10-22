export function formatDate(value: string | null | undefined): string {
  if (!value) return "Belum tersedia";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu tidak valid";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function formatCoordinate(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "Tidak tersedia";
  return value.toFixed(5);
}

export function formatStatus(value: string | null | undefined): string {
  if (!value) return "Status tidak tersedia";
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
