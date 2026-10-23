import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Search, Moon, Sun, Menu, X, TrendingUp } from 'lucide-react';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenSearch: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenSearch,
  onGoHome,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const navCategories = [
    { id: 'all', label: 'All Calculators' },
    { id: 'investment', label: 'Investment' },
    { id: 'loan', label: 'Loans & EMI' },
    { id: 'other', label: 'Tax & Planning' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#121418]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00D09C] to-[#04B488] flex items-center justify-center text-white shadow-md shadow-[#00D09C]/20 group-hover:scale-105 transition-transform">
              <TrendingUp size={20} className="stroke-[2.5]" />
            </div>
            <div className="text-left">
              <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-1">
                Fin<span className="text-[#00D09C]">Calc</span>
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 block -mt-1 font-medium">
                Groww Inspired
              </span>
            </div>
          </button>

          {/* Search Trigger Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-gray-50 dark:bg-[#181B20] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-400 dark:text-gray-500 hover:border-[#00D09C]/60 hover:bg-white dark:hover:bg-[#14161A] transition-all shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Search size={16} />
                <span>Search 25+ calculators...</span>
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-md">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onGoHome();
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'text-[#00D09C] bg-[#00D09C]/10 font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              title="Search"
            >
              <Search size={20} />
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 px-2 border-t border-gray-100 dark:border-gray-800 space-y-1 animate-in slide-in-from-top-2">
            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onGoHome();
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'text-[#00D09C] bg-[#00D09C]/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
