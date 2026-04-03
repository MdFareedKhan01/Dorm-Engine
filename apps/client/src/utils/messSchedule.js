const BREAKFAST_WINDOW = [6.5, 10.5];
const LUNCH_WINDOW = [12, 14.5];
const DINNER_WINDOW = [18.5, 21.5];
const BREAKFAST_START = BREAKFAST_WINDOW[0];
const LUNCH_START = LUNCH_WINDOW[0];
const DINNER_START = DINNER_WINDOW[0];

export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getCurrentDayIndex(referenceDate = new Date()) {
  return referenceDate.getDay();
}

export function getCurrentMealSlot(referenceDate = new Date()) {
  const hours = referenceDate.getHours() + referenceDate.getMinutes() / 60;

  if (hours >= BREAKFAST_WINDOW[0] && hours < BREAKFAST_WINDOW[1]) {
    return 'Breakfast';
  }

  if (hours >= LUNCH_WINDOW[0] && hours < LUNCH_WINDOW[1]) {
    return 'Lunch';
  }

  if (hours >= DINNER_WINDOW[0] && hours < DINNER_WINDOW[1]) {
    return 'Dinner';
  }

  return null;
}

export function getCurrentMealState(referenceDate = new Date()) {
  return {
    dayIndex: getCurrentDayIndex(referenceDate),
    mealSlot: getCurrentMealSlot(referenceDate),
    dayLabel: referenceDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
    timeLabel: referenceDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
  };
}

export function getRollingMealState(referenceDate = new Date()) {
  const dayIndex = getCurrentDayIndex(referenceDate);
  const hours = referenceDate.getHours() + referenceDate.getMinutes() / 60;

  if (hours < BREAKFAST_START) {
    return {
      dayIndex: (dayIndex + 6) % 7,
      mealSlot: 'Dinner',
    };
  }

  if (hours < LUNCH_START) {
    return {
      dayIndex,
      mealSlot: 'Breakfast',
    };
  }

  if (hours < DINNER_START) {
    return {
      dayIndex,
      mealSlot: 'Lunch',
    };
  }

  return {
    dayIndex,
    mealSlot: 'Dinner',
  };
}
