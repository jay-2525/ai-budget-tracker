import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function getCurrentMonth(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}

export function getPreviousMonth(): { start: Date; end: Date } {
  const now = new Date();
  const prevMonth = subMonths(now, 1);
  return {
    start: startOfMonth(prevMonth),
    end: endOfMonth(prevMonth),
  };
}

export function getMonthRange(monthsBack: number = 0): { start: Date; end: Date } {
  const now = new Date();
  const targetMonth = subMonths(now, monthsBack);
  return {
    start: startOfMonth(targetMonth),
    end: endOfMonth(targetMonth),
  };
}

export function isDateInCurrentMonth(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const { start, end } = getCurrentMonth();
  return isWithinInterval(dateObj, { start, end });
}

export function isDateInRange(date: string | Date, start: Date, end: Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isWithinInterval(dateObj, { start, end });
}

export function getMonthName(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function getLastNMonths(n: number): Array<{ start: Date; end: Date; name: string }> {
  const months = [];
  for (let i = 0; i < n; i++) {
    const range = getMonthRange(i);
    months.push({
      ...range,
      name: getMonthName(range.start),
    });
  }
  return months.reverse();
}

export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return `${Math.floor(diffInDays / 365)} years ago`;
}