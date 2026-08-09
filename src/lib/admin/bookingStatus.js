export const BOOKING_STATUSES = {
  new: "新規",
  contacted: "連絡済み",
  confirmed: "予約確定",
  cancelled: "取消",
};

export function isBookingStatus(value) {
  return Object.hasOwn(BOOKING_STATUSES, value);
}

export function formatAdminDateTime(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}
