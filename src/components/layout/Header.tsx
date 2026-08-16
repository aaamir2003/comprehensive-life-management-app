import { Sun, Moon, Printer, BarChart3, Settings, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function Header() {
  const { darkMode, toggleDarkMode, selectedDate, clearAllData } = useStore();
  const [showSettings, setShowSettings] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    clearAllData();
    setConfirmReset(false);
    setShowSettings(false);
  };

  return (
    <>
      <header className="no-print bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40 safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">LifeBoard</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 -mt-0.5">{formatDate(selectedDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Print Report"
            >
              <Printer className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</p>
                <p className="text-xs text-gray-400">Toggle between light and dark themes</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-violet-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Print Report */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Print Report</p>
                <p className="text-xs text-gray-400">Generate a printable report</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => { setShowSettings(false); window.print(); }}>
              Print
            </Button>
          </div>

          {/* Reset Data */}
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3 mb-2">
              <RotateCcw className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Reset All Data</p>
                <p className="text-xs text-red-400 dark:text-red-300/70">This action cannot be undone</p>
              </div>
            </div>
            {confirmReset ? (
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="danger" onClick={handleReset} className="flex-1">
                  Yes, Reset
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setConfirmReset(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setConfirmReset(true)} className="w-full mt-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30">
                Reset Data
              </Button>
            )}
          </div>

          {/* App Info */}
          <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400">LifeBoard v1.0</p>
            <p className="text-[10px] text-gray-300 dark:text-gray-500 mt-0.5">Life & Routine Management System</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
