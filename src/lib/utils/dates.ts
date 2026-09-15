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

export function daysInMonthGrid(year: number, month: number): (string | null)[] {
  const first = startOfMonth(year, month);
  const last = endOfMonth(year, month);
  const cells: (string | null)[] = [];
  const cursor = saturdayOfWeek(first);
  const lastSaturday = saturdayOfWeek(last);

  while (cursor <= lastSaturday) {
    const saturday = toISODate(cursor);
    const row = [
      saturday,
      addDays(saturday, 2),
      addDays(saturday, 3),
      addDays(saturday, 4),
      addDays(saturday, 5),
      addDays(saturday, 6),
      addDays(saturday, 1),
    ];

    for (const iso of row) {
      const date = parseISODate(iso);
      cells.push(date.getFullYear() === year && date.getMonth() === month ? iso : null);
    }

    cursor.setDate(cursor.getDate() + 7);
  }

  return cells;
}
