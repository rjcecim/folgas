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

export function saturdayOfWeek(date: Date): Date {
  const weekday = date.getDay();
  const daysFromSaturday = (weekday + 1) % 7;
  const saturday = new Date(date);
  saturday.setDate(date.getDate() - daysFromSaturday);
  return saturday;
}

export type MonthGridCell = {
  date: string;
  inMonth: boolean;
};

export function daysInMonthGrid(year: number, month: number): MonthGridCell[] {
  const first = startOfMonth(year, month);
  const last = endOfMonth(year, month);
  const cells: MonthGridCell[] = [];
  const cursor = saturdayOfWeek(first);

  while (cursor <= last) {
    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(cursor);
      date.setDate(cursor.getDate() + offset);
      cells.push({
        date: toISODate(date),
        inMonth: date.getFullYear() === year && date.getMonth() === month,
      });
    }
    cursor.setDate(cursor.getDate() + 7);
  }

  return cells;
}
