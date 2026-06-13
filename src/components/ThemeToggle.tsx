import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
        'border border-[var(--border)] hover:border-[var(--border-accent)]',
        'bg-[var(--bg-elevated)] hover:bg-[var(--bg-panel)]',
        'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
        className
      )}
    >
      {theme === 'dark'
        ? <Sun size={15} className="transition-transform hover:rotate-12" />
        : <Moon size={15} className="transition-transform hover:-rotate-12" />
      }
    </button>
  );
}
