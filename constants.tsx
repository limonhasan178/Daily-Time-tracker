
import { Category } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.STUDY]: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
  [Category.WORK]: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
  [Category.SOCIAL]: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  [Category.REST]: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700',
  [Category.GAMING]: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
  [Category.OTHER]: 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
};

export const CATEGORY_CHART_COLORS: Record<Category, string> = {
  [Category.STUDY]: '#6366f1',
  [Category.WORK]: '#10b981',
  [Category.SOCIAL]: '#f59e0b',
  [Category.REST]: '#f43f5e',
  [Category.GAMING]: '#8b5cf6',
  [Category.OTHER]: '#64748b',
};
