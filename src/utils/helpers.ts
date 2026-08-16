import type { Priority } from '../types';

export function getWeekDates(dateStr: string): string[] {
  const date = new Date(dateStr);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function formatMinutes(mins: number): string {
  if (mins === 0) return '0m';
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getPercentage(actual: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((actual / target) * 100), 100);
}

export function getLast7Days(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

export function isFuture(dateStr: string): boolean {
  return dateStr > new Date().toISOString().split('T')[0];
}

export function isPast(dateStr: string): boolean {
  return dateStr < new Date().toISOString().split('T')[0];
}

export const SUBJECT_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

export const SUBJECT_ICONS = ['📐', '⚛️', '📚', '🧪', '💻', '🎨', '🌍', '📊', '🎵', '🔬', '📝', '🧮'];

export const SUBJECT_CATEGORIES = ['Science', 'Language', 'Arts', 'Technology', 'History', 'Other'];

export const WORKOUT_TYPE_LABELS: Record<string, string> = {
  cardio: 'Cardio',
  strength: 'Strength',
  endurance: 'Endurance',
  flexibility: 'Flexibility',
};

export const WORKOUT_TYPE_COLORS: Record<string, string> = {
  cardio: '#ef4444',
  strength: '#3b82f6',
  endurance: '#f59e0b',
  flexibility: '#10b981',
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string; icon: string }> = {
  low: { label: 'Low', color: '#10b981', bgColor: '#dcfce7', icon: '○' },
  medium: { label: 'Medium', color: '#f59e0b', bgColor: '#fef3c7', icon: '◐' },
  high: { label: 'High', color: '#ef4444', bgColor: '#fee2e2', icon: '●' },
};

export function sortByPriority<T extends { priority: Priority }>(items: T[]): T[] {
  const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  return [...items].sort((a, b) => order[a.priority] - order[b.priority]);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sortedDates = [...new Set(dates)].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let checkDate = today;
  
  for (const date of sortedDates) {
    if (date === checkDate) {
      streak++;
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split('T')[0];
    } else if (date < checkDate) {
      break;
    }
  }
  return streak;
}
