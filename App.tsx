import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { User } from './types';
import { checkAuth } from './services/api';

export type ThemeColor = 'blue' | 'red' | 'green' | 'glass';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme_mode') === 'dark' || 
             (!localStorage.getItem('theme_mode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Color Theme State
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(() => {
    return (localStorage.getItem('theme_color') as ThemeColor) || 'blue';
  });

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await checkAuth();
      setUser(currentUser);
      setLoading(false);
    };
    initAuth();
  }, []);

  // Handle Dark Mode Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_mode', 'light');
    }
  }, [isDarkMode]);

  // Handle Color Theme Effect
  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme_color', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const changeColorTheme = (color: ThemeColor) => setCurrentTheme(color);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {user ? (
        <Dashboard 
          user={user} 
          onLogout={() => setUser(null)} 
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          currentTheme={currentTheme}
          changeColorTheme={changeColorTheme}
        />
      ) : (
        <Login 
          onLogin={setUser} 
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          currentTheme={currentTheme}
          changeColorTheme={changeColorTheme}
        />
      )}
    </div>
  );
}