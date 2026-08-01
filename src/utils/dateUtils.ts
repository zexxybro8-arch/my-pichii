export interface TimeTogetherResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface AnniversaryCountdownResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isReached: boolean;
  progressPercent: number;
  formattedTargetDate: string;
  targetDate: Date;
  isPaused: boolean;
}

/**
 * DEFAULT RELATIONSHIP START FALLBACK DATE
 */
export const RELATIONSHIP_START = new Date(2025, 2, 21, 11, 20, 43);

/**
 * Safely parse date input in user's local timezone, handling ISO strings, YYYY-MM-DDTHH:mm:ss, or fallback.
 */
export const parseDateString = (rawDateStr?: string, fallbackDate?: Date): Date => {
  const fallback = fallbackDate ? new Date(fallbackDate.getTime()) : new Date(RELATIONSHIP_START.getTime());
  if (!rawDateStr || !rawDateStr.trim()) {
    return fallback;
  }

  // 1. Try native Date parsing
  try {
    const parsed = new Date(rawDateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  } catch {}

  // 2. Try custom string split
  try {
    if (rawDateStr.includes('T')) {
      const parts = rawDateStr.split('T');
      const dateParts = parts[0].split('-').map((p) => parseInt(p, 10));
      const timeParts = parts[1].replace('Z', '').split(':').map((p) => parseInt(p, 10));

      if (dateParts.length >= 3 && !dateParts.some(isNaN)) {
        return new Date(
          dateParts[0],
          dateParts[1] - 1,
          dateParts[2],
          timeParts[0] || 0,
          timeParts[1] || 0,
          timeParts[2] || 0
        );
      }
    } else if (rawDateStr.includes('-')) {
      const dateParts = rawDateStr.split('-').map((p) => parseInt(p, 10));
      if (dateParts.length >= 3 && !dateParts.some(isNaN)) {
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 0, 0, 0);
      }
    }
  } catch {}

  return fallback;
};

export const parseRelationshipStartDate = parseDateString;

/**
 * Format Date object or ISO string to HTML5 datetime-local input string: YYYY-MM-DDTHH:mm:ss
 */
export const formatForDateTimeInput = (dateInput?: string | Date): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? parseDateString(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const formatReadableDate = (dateInput?: string | Date): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? parseDateString(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatReadableTime = (dateInput?: string | Date): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? parseDateString(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Calculates calendar-accurate time together (years, months, days, hours, minutes, seconds)
 */
export const getCalendarTimeTogether = (
  startDateInput?: string | Date,
  nowInput: Date = new Date(),
  isPaused: boolean = false,
  pausedAtInput?: string | Date
): TimeTogetherResult => {
  const startDate = typeof startDateInput === 'string' ? parseDateString(startDateInput) : (startDateInput || RELATIONSHIP_START);

  let effectiveNow = nowInput;
  if (isPaused && pausedAtInput) {
    effectiveNow = typeof pausedAtInput === 'string' ? parseDateString(pausedAtInput) : pausedAtInput;
  }

  if (effectiveNow.getTime() < startDate.getTime()) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let cursor = new Date(startDate.getTime());

  // 1. Years
  let years = 0;
  while (true) {
    const nextYear = new Date(cursor.getTime());
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    if (nextYear.getTime() <= effectiveNow.getTime()) {
      years++;
      cursor = nextYear;
    } else {
      break;
    }
  }

  // 2. Months
  let months = 0;
  while (true) {
    const nextMonth = new Date(cursor.getTime());
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth.getTime() <= effectiveNow.getTime()) {
      months++;
      cursor = nextMonth;
    } else {
      break;
    }
  }

  // 3. Days
  let days = 0;
  while (true) {
    const nextDay = new Date(cursor.getTime());
    nextDay.setDate(nextDay.getDate() + 1);
    if (nextDay.getTime() <= effectiveNow.getTime()) {
      days++;
      cursor = nextDay;
    } else {
      break;
    }
  }

  // 4. Hours, Minutes, Seconds
  const remainingMs = Math.max(0, effectiveNow.getTime() - cursor.getTime());
  const totalSecs = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  return { years, months, days, hours, minutes, seconds };
};

/**
 * Calculates countdown to targetDate with full pause/resume, timezone, and progress bar support.
 */
export const getCalendarAnniversaryCountdown = (
  startDateInput?: string | Date,
  targetDateInput?: string | Date,
  nowInput: Date = new Date(),
  isPaused: boolean = false,
  pausedAtInput?: string | Date,
  pausedRemainingSeconds?: number
): AnniversaryCountdownResult => {
  const startDate = typeof startDateInput === 'string' ? parseDateString(startDateInput) : (startDateInput || RELATIONSHIP_START);

  let targetDate: Date;
  if (targetDateInput) {
    targetDate = typeof targetDateInput === 'string' ? parseDateString(targetDateInput) : targetDateInput;
  } else {
    // Default to 1 year after start date
    targetDate = new Date(startDate.getTime());
    targetDate.setFullYear(targetDate.getFullYear() + 1);
  }

  const formattedTargetDate = formatReadableDate(targetDate);

  let effectiveNow = nowInput;
  if (isPaused && pausedAtInput) {
    effectiveNow = typeof pausedAtInput === 'string' ? parseDateString(pausedAtInput) : pausedAtInput;
  }

  // If paused and we have a snapshot of remaining seconds
  if (isPaused && typeof pausedRemainingSeconds === 'number') {
    const totalSecs = Math.max(0, pausedRemainingSeconds);
    const years = Math.floor(totalSecs / (365 * 86400));
    const remAfterYears = totalSecs % (365 * 86400);
    const months = Math.floor(remAfterYears / (30 * 86400));
    const remAfterMonths = remAfterYears % (30 * 86400);
    const days = Math.floor(remAfterMonths / 86400);
    const hours = Math.floor((remAfterMonths % 86400) / 3600);
    const minutes = Math.floor((remAfterMonths % 3600) / 60);
    const seconds = remAfterMonths % 60;

    const totalCycleMs = targetDate.getTime() - startDate.getTime();
    const elapsedMs = Math.max(0, (targetDate.getTime() - totalSecs * 1000) - startDate.getTime());
    const progressPercent = totalCycleMs > 0 ? Math.min(100, Math.max(0, (elapsedMs / totalCycleMs) * 100)) : 100;

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      isReached: totalSecs === 0,
      progressPercent,
      formattedTargetDate,
      targetDate,
      isPaused: true,
    };
  }

  // Active / unpaused calculation
  const diffMs = targetDate.getTime() - effectiveNow.getTime();

  if (diffMs <= 0) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isReached: true,
      progressPercent: 100,
      formattedTargetDate,
      targetDate,
      isPaused,
    };
  }

  // Real calendar countdown from effectiveNow to targetDate
  let cursor = new Date(effectiveNow.getTime());

  let years = 0;
  while (true) {
    const nextYear = new Date(cursor.getTime());
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    if (nextYear.getTime() <= targetDate.getTime()) {
      years++;
      cursor = nextYear;
    } else {
      break;
    }
  }

  let months = 0;
  while (true) {
    const nextMonth = new Date(cursor.getTime());
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth.getTime() <= targetDate.getTime()) {
      months++;
      cursor = nextMonth;
    } else {
      break;
    }
  }

  let days = 0;
  while (true) {
    const nextDay = new Date(cursor.getTime());
    nextDay.setDate(nextDay.getDate() + 1);
    if (nextDay.getTime() <= targetDate.getTime()) {
      days++;
      cursor = nextDay;
    } else {
      break;
    }
  }

  const remainingMs = Math.max(0, targetDate.getTime() - cursor.getTime());
  const totalSecs = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  // Calculate love journey progress %
  const totalCycleMs = targetDate.getTime() - startDate.getTime();
  const elapsedMs = effectiveNow.getTime() - startDate.getTime();
  const progressPercent =
    totalCycleMs > 0 ? Math.min(100, Math.max(0, (elapsedMs / totalCycleMs) * 100)) : 100;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    isReached: false,
    progressPercent,
    formattedTargetDate,
    targetDate,
    isPaused,
  };
};
