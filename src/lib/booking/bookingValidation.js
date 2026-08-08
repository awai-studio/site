const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const CONTROL_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;

export const BOOKING_LIMITS = {
  requestBytes: 32 * 1024,
  name: 100,
  email: 254,
  message: 2000,
};

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function tokyoDateKey() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function dateParts(dateKey) {
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
  ) return null;
  return { weekday: date.getUTCDay() };
}

export function validateBookingRequest(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return { isValid: false, status: 415, message: "The request format is not supported." };
  }
  const header = request.headers.get("content-length");
  if (header) {
    const length = Number(header);
    if (!Number.isFinite(length) || length < 0) {
      return { isValid: false, status: 400, message: "Please check your request." };
    }
    if (length > BOOKING_LIMITS.requestBytes) {
      return { isValid: false, status: 413, message: "The request is too large." };
    }
  }
  return { isValid: true, status: 200, message: "" };
}

export function isLikelyBotBooking(input) {
  if (text(input?.companyWebsite)) return true;
  const startedAt = Number(input?.formStartedAt);
  return !Number.isFinite(startedAt) || startedAt <= 0 || Date.now() - startedAt < 2000;
}

export function validateBookingInput(input, experience) {
  const values = {
    experienceSlug: text(input?.experienceSlug),
    customerName: text(input?.customerName),
    customerEmail: text(input?.customerEmail).toLowerCase(),
    guestCount: Number(input?.guestCount),
    preferredDate1: text(input?.preferredDate1),
    preferredTime1: text(input?.preferredTime1),
    preferredDate2: text(input?.preferredDate2),
    preferredTime2: text(input?.preferredTime2),
    preferredDate3: text(input?.preferredDate3),
    preferredTime3: text(input?.preferredTime3),
    message: text(input?.message),
  };
  const errors = {};

  if (!experience || values.experienceSlug !== experience.slug) {
    errors.experienceSlug = "Please select a valid experience.";
  }
  if (!values.customerName || values.customerName.length > BOOKING_LIMITS.name || CONTROL_PATTERN.test(values.customerName)) {
    errors.customerName = "Please enter a valid name.";
  }
  if (!EMAIL_PATTERN.test(values.customerEmail) || values.customerEmail.length > BOOKING_LIMITS.email || CONTROL_PATTERN.test(values.customerEmail)) {
    errors.customerEmail = "Please enter a valid email address.";
  }

  const minGuests = Number(experience?.pricing?.minGuests);
  const maxGuests = Number(experience?.pricing?.maxGuests);
  if (!Number.isInteger(values.guestCount) || values.guestCount < minGuests || values.guestCount > maxGuests) {
    errors.guestCount = "Please select a valid number of guests.";
  }
  if (values.message.length > BOOKING_LIMITS.message || CONTROL_PATTERN.test(values.message)) {
    errors.message = `Please keep your message within ${BOOKING_LIMITS.message} characters.`;
  }

  const minimumDate = addDays(tokyoDateKey(), 10);
  const maximumDate = addDays(tokyoDateKey(), 90);
  const availability = experience?.availability || {};
  const dates = new Set();
  for (let index = 1; index <= 3; index += 1) {
    const dateField = `preferredDate${index}`;
    const timeField = `preferredTime${index}`;
    const dateValue = values[dateField];
    const timeValue = values[timeField];

    if (index === 1 && (!dateValue || !timeValue)) {
      errors[dateField] = "Please choose at least one preferred date and time.";
      continue;
    }
    if (!dateValue && !timeValue) continue;
    if (!dateValue || !timeValue) {
      errors[dateField] = "Please choose both a date and time.";
      continue;
    }

    const parsed = dateParts(dateValue);
    if (
      !parsed || dateValue < minimumDate || dateValue > maximumDate ||
      !availability.availableWeekdays?.includes(parsed.weekday) ||
      availability.unavailableDates?.includes(dateValue)
    ) {
      errors[dateField] = "Please choose an available date.";
    }
    if (!availability.timeSlots?.includes(timeValue)) {
      errors[timeField] = "Please choose an available time.";
    }
    if (dates.has(dateValue)) {
      errors[dateField] = "Please choose different dates for each preference.";
    }
    dates.add(dateValue);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    values,
    errors,
    firstError: Object.values(errors)[0] || "",
  };
}
