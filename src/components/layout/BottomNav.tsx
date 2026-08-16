import { LayoutDashboard, BookOpen, Dumbbell, TrendingUp } from 'lucide-react';
import type { TabType } from '../../types';
import { cn } from '../../utils/cn';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'study', label: 'Study', icon: BookOpen },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 z-40 safe-bottom">
      <div className="max-w-7xl mx-auto flex items-center justify-around px-2 py-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 min-w-[64px]',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-all duration-200',
                isActive && 'bg-primary-50 dark:bg-primary-900/30'
              )}>
                <Icon className={cn('w-5 h-5', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
