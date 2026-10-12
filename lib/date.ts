export function getDaysInMs(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

export function getSinceISO(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function getToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getDaysAgo(number: number) {
  const date = new Date();
  return new Date(date.getTime() - getDaysInMs(number));
}
