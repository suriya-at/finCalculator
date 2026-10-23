import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HomePage } from './pages/HomePage';
import { CalculatorWrapper } from './components/calculators/CalculatorWrapper';

function parseHash(hash: string): string | null {
  const clean = hash.replace(/^#\/?/, '');
  if (!clean) return null;
  if (clean.startsWith('calculator/')) {
    const id = clean.replace(/^calculator\//, '').replace(/\/$/, '');
    return id || null;
  }
  return clean || null;
}

const AppContent: React.FC = () => {
  const [activeCalcId, setActiveCalcId] = useState<string | null>(() => {
    return parseHash(window.location.hash);
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const calcId = parseHash(window.location.hash);
      setActiveCalcId(calcId);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToCalculator = (id: string) => {
    window.location.hash = `/calculator/${id}`;
    setActiveCalcId(id);
    setIsSearchOpen(false);
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setActiveCalcId(null);
    setSelectedCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (category: string) => {
    window.location.hash = '';
    setActiveCalcId(null);
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/60 dark:bg-[#0F1115] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        activeCategory={selectedCategory}
        onSelectCategory={navigateToCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGoHome={navigateToHome}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {activeCalcId ? (
          <CalculatorWrapper
            calculatorId={activeCalcId}
            onSelectCalculator={navigateToCalculator}
            onBackToHome={navigateToHome}
          />
        ) : (
          <HomePage
            onSelectCalculator={navigateToCalculator}
            onOpenSearch={() => setIsSearchOpen(true)}
            initialCategory={selectedCategory}
          />
        )}
      </div>

      {/* Global Categorized Footer */}
      <Footer onSelectCalculator={navigateToCalculator} />

      {/* Quick Search Modal (Ctrl + K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCalculator={navigateToCalculator}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
