import React, { useState } from 'react';
import { Church, ArrowRight, Moon, Sun, Palette } from 'lucide-react';
import { login } from '../services/api';
import { User } from '../types';
import { ThemeColor } from '../App';

interface LoginProps {
  onLogin: (user: User) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentTheme: ThemeColor;
  changeColorTheme: (color: ThemeColor) => void;
}

export default function Login({ onLogin, isDarkMode, toggleTheme, currentTheme, changeColorTheme }: LoginProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate network request
      const user = await login(email);
      onLogin(user);
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic card class based on theme
  const cardClass = currentTheme === 'glass'
    ? 'bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl'
    : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300 relative overflow-hidden">
      
      {/* Controls Container */}
      <div className="absolute top-6 right-6 flex gap-2">
        {/* Theme Picker Dropdown */}
        <div className="relative">
           {showThemePicker && (
             <div className={`absolute right-0 top-12 w-32 p-2 rounded-xl shadow-xl z-50 grid gap-2 ${currentTheme === 'glass' ? 'bg-white/80 backdrop-blur-md' : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700'}`}>
                <button onClick={() => changeColorTheme('blue')} className="flex items-center gap-2 text-xs p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Blue</button>
                <button onClick={() => changeColorTheme('red')} className="flex items-center gap-2 text-xs p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><div className="w-3 h-3 rounded-full bg-red-500"></div> Red</button>
                <button onClick={() => changeColorTheme('green')} className="flex items-center gap-2 text-xs p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><div className="w-3 h-3 rounded-full bg-green-500"></div> Green</button>
                <button onClick={() => changeColorTheme('glass')} className="flex items-center gap-2 text-xs p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Glass</button>
             </div>
           )}
           <button 
            onClick={() => setShowThemePicker(!showThemePicker)}
            className={`p-2 rounded-full shadow-sm hover:shadow-md transition-all ${currentTheme === 'glass' ? 'bg-white/50 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300'}`}
          >
            <Palette size={20} />
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full shadow-sm hover:shadow-md transition-all ${currentTheme === 'glass' ? 'bg-white/50 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300'}`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className={`max-w-md w-full rounded-2xl p-8 md:p-10 transition-colors ${cardClass}`}>
        <div className="flex justify-center mb-8">
          <div className="bg-primary-600 p-3 rounded-xl shadow-lg shadow-primary-500/30">
            <Church size={32} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Sign in to manage your church</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              required
              className={`w-full px-4 py-3 rounded-lg outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${currentTheme === 'glass' 
                   ? 'bg-white/50 dark:bg-slate-900/50 border-gray-200/50 text-gray-900 dark:text-white' 
                   : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white'}
              `}
              placeholder="pastor@church.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-primary-500/30 dark:shadow-none disabled:opacity-70"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 dark:text-slate-600">Innovation Church System v1.0</p>
        </div>
      </div>
    </div>
  );
}