import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Calendar, 
  Settings, 
  Bell, 
  Search, 
  LogOut,
  Church,
  Menu,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Palette
} from 'lucide-react';
import { User } from '../types';
import { ThemeColor } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentTheme: ThemeColor;
  changeColorTheme: (color: ThemeColor) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, user, onLogout, isDarkMode, toggleTheme, currentTheme, changeColorTheme 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const NavItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <button 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full
        ${active 
          ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-semibold' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100'}
        ${isCollapsed ? 'justify-center px-2' : ''}
      `}
      title={isCollapsed ? label : ''}
    >
      <Icon size={20} className={`flex-shrink-0 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-100'}`} />
      <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
        {label}
      </span>
    </button>
  );

  // Glassmorphism conditional classes
  const sidebarClasses = currentTheme === 'glass' 
    ? 'bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50'
    : 'bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700';

  const headerClasses = currentTheme === 'glass'
    ? 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/20 dark:border-slate-700/50'
    : 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-b border-gray-100 dark:border-slate-700';

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-30 h-full flex flex-col transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${sidebarClasses}
      `}>
        {/* Logo Area */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="bg-primary-600 p-2 rounded-lg text-white shadow-lg shadow-primary-500/30 flex-shrink-0">
            <Church size={24} />
          </div>
          <span className={`text-xl font-bold text-gray-800 dark:text-white tracking-tight whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
            axentra
          </span>
        </div>

        {/* Collapse Toggle (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-20 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full p-1 text-gray-500 dark:text-gray-300 shadow-sm hover:text-primary-600 z-40"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-4 scrollbar-hide">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Users} label="Members" />
          <NavItem icon={Wallet} label="Financials" />
          <NavItem icon={Calendar} label="Events" />
          <div className={`pt-4 pb-2 transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            <p className="px-4 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">System</p>
          </div>
          <NavItem icon={Settings} label="Settings" />
          <NavItem icon={Users} label="Employee" />
        </nav>

        {/* User Footer & Theme Controls */}
        <div className="p-4 border-t border-gray-50 dark:border-slate-700/50 space-y-2">
          
          {/* Theme Expandable Menu */}
          <div className={`transition-all duration-300 overflow-hidden ${showThemePicker && !isCollapsed ? 'max-h-32' : 'max-h-0'}`}>
            <div className="p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg mb-2 grid grid-cols-2 gap-2">
              <button onClick={() => changeColorTheme('blue')} className={`text-xs flex items-center gap-1 ${currentTheme === 'blue' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Blue
              </button>
              <button onClick={() => changeColorTheme('red')} className={`text-xs flex items-center gap-1 ${currentTheme === 'red' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Red
              </button>
              <button onClick={() => changeColorTheme('green')} className={`text-xs flex items-center gap-1 ${currentTheme === 'green' ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                <div className="w-3 h-3 rounded-full bg-green-500"></div> Green
              </button>
              <button onClick={() => changeColorTheme('glass')} className={`text-xs flex items-center gap-1 ${currentTheme === 'glass' ? 'text-purple-600 font-bold' : 'text-gray-500'}`}>
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div> Glass
              </button>
            </div>
          </div>

          <button 
            onClick={() => !isCollapsed ? setShowThemePicker(!showThemePicker) : null}
            className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 w-full px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Theme Palette"
          >
            <Palette size={16} />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Theme Color</span>
          </button>

          <button 
            onClick={toggleTheme}
            className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 w-full px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button onClick={onLogout} className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 w-full px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <LogOut size={16} />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-6 md:px-10 sticky top-0 z-20 transition-colors duration-300 ${headerClasses}`}>
          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 mr-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} className="text-gray-600 dark:text-gray-200" />
          </button>

          {/* Breadcrumb / Title */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Management Overview</h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by Name" 
                className={`pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 w-64 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-slate-500 transition-colors
                  ${currentTheme === 'glass' ? 'bg-white/50 dark:bg-slate-800/50 border-white/20' : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600'}
                `}
              />
            </div>
            
            <button className={`p-2 text-gray-500 dark:text-gray-400 hover:shadow-sm rounded-full transition-all relative ${currentTheme === 'glass' ? 'hover:bg-white/40' : 'hover:bg-white dark:hover:bg-slate-700'}`}>
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>

            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm">
              <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};