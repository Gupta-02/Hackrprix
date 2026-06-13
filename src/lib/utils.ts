import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getTimeRemaining(createdAt: string, durationHours: number): number {
  const start = new Date(createdAt).getTime();
  const end = start + durationHours * 3600 * 1000;
  const now = Date.now();
  return Math.max(0, (end - now) / 3600000);
}

export function getElapsedHours(createdAt: string): number {
  const start = new Date(createdAt).getTime();
  return (Date.now() - start) / 3600000;
}

export function formatCountdown(remainingHours: number): string {
  if (remainingHours <= 0) return '00:00:00';
  const totalSeconds = Math.floor(remainingHours * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getHealthStatus(completedPct: number, elapsedPct: number): 'green' | 'amber' | 'red' {
  const gap = elapsedPct - completedPct;
  if (gap <= 10) return 'green';
  if (gap <= 20) return 'amber';
  return 'red';
}
