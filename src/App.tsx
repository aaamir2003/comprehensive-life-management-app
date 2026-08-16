import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { StudyPlanner } from './pages/StudyPlanner';
import { FitnessTracker } from './pages/FitnessTracker';
import { Analytics } from './pages/Analytics';
import type { TabType } from './types';

function App() {
  const { darkMode } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'study': return <StudyPlanner />;
      case 'fitness': return <FitnessTracker />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 pb-24">
        {renderPage()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
