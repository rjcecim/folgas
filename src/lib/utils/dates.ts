export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function formatDateBR(value: string): string {
  return parseISODate(value).toLocaleDateString("pt-BR");
}

export function formatDateRange(startDate: string, endDate: string): string {
  if (startDate === endDate) {
    return formatDateBR(startDate);
  }
  return `${formatDateBR(startDate)} até ${formatDateBR(endDate)}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function compareISODate(a: string, b: string): number {
  return a.localeCompare(b);
}

export function isDateInRange(date: string, startDate: string, endDate: string) {
  return date >= startDate && date <= endDate;
}

export function eachDateInRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const cursor = parseISODate(startDate);
  const end = parseISODate(endDate);

  while (cursor <= end) {
    dates.push(toISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function addDays(isoDate: string, amount: number): string {
  const date = parseISODate(isoDate);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function startOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

export function endOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

export function isWeekend(isoDate: string): boolean {
  const weekday = parseISODate(isoDate).getDay();
  return weekday === 0 || weekday === 6;
}

export function weekdayMondayIndex(isoDate: string): number {
  const weekday = parseISODate(isoDate).getDay();
  return weekday === 0 ? 6 : weekday - 1;
}

export function daysInMonthGrid(year: number, month: number): (string | null)[] {
  const first = startOfMonth(year, month);
  const last = endOfMonth(year, month);
  const leading = weekdayMondayIndex(toISODate(first));
  const cells: (string | null)[] = Array.from({ length: leading }, () => null);

  for (let day = 1; day <= last.getDate(); day += 1) {
    cells.push(toISODate(new Date(year, month, day)));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}
