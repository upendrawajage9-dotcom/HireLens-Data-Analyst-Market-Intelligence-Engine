import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, compact = false): string {
  if (compact && n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (compact && n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toLocaleString('en-US');
}

export function formatSalary(amount: number, currency: 'USD' | 'INR' = 'USD'): string {
  if (currency === 'INR') {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}
