const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function getWeekday(dateKey) {
  const match = DATE_PATTERN.exec(dateKey);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date.getUTCDay();
}

export function getAvailableTimesForDate(availability, dateKey) {
  if (!availability || availability.unavailableDates?.includes(dateKey)) {
    return [];
  }

  const specialTimes = availability.specialDateTimeSlots?.[dateKey];
  if (Array.isArray(specialTimes)) return specialTimes;

  const weekday = getWeekday(dateKey);
  if (weekday === null) return [];

  return availability.weeklyTimeSlots?.[weekday] || [];
}

export function isDateAvailable(availability, dateKey) {
  return getAvailableTimesForDate(availability, dateKey).length > 0;
}
