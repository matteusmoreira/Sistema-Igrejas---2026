import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { User, FinancialRecord, ActionItem } from '../types';
import { getFinancials, getActionItems } from '../services/api';
import { getFinancialInsight } from '../services/gemini';
import { 
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  MoreVertical, ArrowUpRight, Plus, Sparkles, Calendar, 
  CheckCircle2, Clock, AlertCircle 
} from 'lucide-react';
import { ThemeColor } from '../App';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentTheme: ThemeColor;
  changeColorTheme: (color: ThemeColor) => void;
}

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-white text-xs p-3 rounded-lg shadow-xl">
        <p className="font-bold mb-1 text-gray-200">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{backgroundColor: entry.color}}></span>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ user, onLogout, isDarkMode, toggleTheme, currentTheme, changeColorTheme }: DashboardProps) {
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fData = await getFinancials(user.tenantId);
      const aData = await getActionItems(user.tenantId);
      setFinancials(fData);
      setActionItems(aData);
    };
    fetchData();
  }, [user.tenantId]);

  const handleAiInsight = async () => {
    setAiLoading(true);
    const insight = await getFinancialInsight(financials);
    alert(`AI Insight:\n\n${insight}`);
    setAiLoading(false);
  };

  // Dynamic Card Class for Glassmorphism
  const cardClass = currentTheme === 'glass'
    ? 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-white/10'
    : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700';

  const buttonClass = currentTheme === 'glass'
    ? 'bg-white/50 dark:bg-slate-700/50 border-white/30'
    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700';

  return (
    <Layout user={user} onLogout={onLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentTheme={currentTheme} changeColorTheme={changeColorTheme}>
      
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           {/* Hidden on desktop as it's in header */}
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button className={`flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium shadow-sm transition-all hover:opacity-80 border ${buttonClass}`}>
            <Plus size={16} />
            Create New
          </button>
          <button 
            onClick={handleAiInsight}
            disabled={aiLoading}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium shadow-sm transition-all hover:opacity-80
              ${currentTheme === 'glass' 
                ? 'bg-white/50 dark:bg-slate-700/50 border-purple-200/50 text-purple-700 dark:text-purple-300' 
                : 'bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400'}
            `}
          >
            <Sparkles size={16} />
            {aiLoading ? 'Analyzing...' : 'Get AI Insight'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Sales/Tithes Performance (Left - Large) */}
        <div className={`col-span-12 lg:col-span-8 rounded-3xl p-6 shadow-sm transition-colors ${cardClass}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tithes Performance</h3>
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><MoreVertical size={18}/></button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><ArrowUpRight size={18}/></button>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financials} barSize={32}>
                 <defs>
                  <linearGradient id="colorTithes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: isDarkMode ? '#94a3b8' : '#9ca3af', fontSize: 12}} 
                  dy={10} 
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'transparent'}} />
                <Bar dataKey="tithes" fill="url(#colorTithes)" radius={[20, 20, 20, 20]} name="Tithes" />
                <Bar dataKey="offerings" fill={isDarkMode ? '#334155' : '#e2e8f0'} radius={[20, 20, 20, 20]} name="Offerings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Quick Stats Overlay Mockup */}
          <div className="mt-4 flex justify-center">
             <div className="bg-primary-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-primary-500/30 dark:shadow-none flex flex-col items-center -mt-20 z-10 relative border border-primary-500">
                <span className="text-xs opacity-80">May 2025</span>
                <span className="font-bold text-lg">$139,817</span>
             </div>
          </div>
        </div>

        {/* Productivity/Attendance Value (Right - Small) */}
        <div className={`col-span-12 lg:col-span-4 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors ${cardClass}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Productivity Value</h3>
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><ArrowUpRight size={18}/></button>
            </div>
          </div>

          <div>
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">$112,803<span className="text-gray-400 text-xl">.00</span></h2>
             <div className="flex items-center gap-2 mt-1">
               <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">+ 16.2%</span>
               <span className="text-xs text-gray-400 dark:text-slate-500">You gained +4.1k this week</span>
             </div>
          </div>

          <div className="h-[150px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financials.slice(0, 6)}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="expenses" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend Mockup */}
          <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-slate-400 font-medium">
             <div className="flex flex-col gap-1"><span className="w-8 h-1 bg-primary-500 rounded-full"></span>Imprint</div>
             <div className="flex flex-col gap-1"><span className="w-8 h-1 bg-pink-500 rounded-full"></span>Flux</div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="col-span-12 flex flex-wrap gap-4 items-center justify-between py-2">
          <div className="flex items-center gap-2">
             <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Active Filters</span>
             <span className={`text-xs font-bold text-gray-800 dark:text-white w-6 h-6 flex items-center justify-center rounded-full ${currentTheme === 'glass' ? 'bg-white/50' : 'bg-white dark:bg-slate-700 border dark:border-slate-600'}`}>2</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
             {['All Employee', 'All Department', 'May 2025', 'June 2025'].map((filter) => (
               <button key={filter} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap transition-colors hover:opacity-80 ${buttonClass}`}>
                  {filter} <MoreVertical size={14}/>
               </button>
             ))}
          </div>
        </div>

        {/* Action Center (Bottom Left) */}
        <div className="col-span-12 lg:col-span-5 bg-transparent">
           <h3 className="text-gray-600 dark:text-gray-400 font-semibold mb-4">Action Center</h3>
           
           <div className="flex gap-2 mb-6">
              <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-full shadow-md shadow-primary-200/50 dark:shadow-none">All Activities</button>
              <button className="px-4 py-2 bg-transparent hover:bg-white/20 text-gray-500 dark:text-gray-400 text-sm rounded-full transition-colors">In Progress</button>
              <button className="px-4 py-2 bg-transparent hover:bg-white/20 text-gray-500 dark:text-gray-400 text-sm rounded-full transition-colors">Completed</button>
           </div>

           <div className="space-y-4">
             {actionItems.map((item) => (
               <div key={item.id} className={`p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer ${cardClass}`}>
                 <div className="flex items-center gap-3">
                    <img src={item.requester.avatarUrl} alt={item.requester.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                       <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.requester.name}</h4>
                       <p className="text-xs text-gray-400 dark:text-slate-500">{item.requester.ministry} Team</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      item.status === 'Completed' 
                        ? 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400' 
                        : 'bg-primary-50 dark:bg-primary-900/30 border-primary-100 dark:border-primary-800 text-primary-600 dark:text-primary-400'
                    }`}>
                      {item.status === 'Completed' ? 'Reviewed' : 'Review'}
                    </span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">$67,893</span>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Employee/Member Detail Card (Bottom Right - Colored) */}
        <div className="col-span-12 lg:col-span-7">
           <div className="bg-primary-600 dark:bg-primary-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-primary-200/50 dark:shadow-none relative overflow-hidden transition-colors">
              {/* Abstract shapes background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 dark:bg-primary-600 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>

              <div className="relative z-10">
                {/* Header of Card */}
                <div className="flex justify-between items-start mb-8">
                   <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-full border-2 border-primary-400 p-0.5">
                         <img src={user.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <div>
                         <h2 className="text-lg font-bold">Rev. Cooper Levin</h2>
                         <p className="text-primary-200 text-sm">Senior Pastor</p>
                      </div>
                   </div>

                   <div className="text-right hidden md:block">
                      <p className="text-primary-200 text-xs uppercase tracking-wide">Department</p>
                      <h3 className="text-xl font-semibold">Executive Leadership</h3>
                   </div>

                   <div className="text-right">
                      <p className="text-primary-200 text-xs uppercase tracking-wide">Employee ID</p>
                      <div className="flex items-center gap-2 justify-end">
                         <span className="text-xl font-mono opacity-80">#4X3-592</span>
                         <button className="text-xs border border-primary-400 rounded-full px-2 py-0.5 hover:bg-primary-500 transition-colors">Details</button>
                      </div>
                   </div>
                </div>

                {/* Inner White Card */}
                <div className={`rounded-2xl p-5 text-gray-800 dark:text-white shadow-lg transition-colors ${currentTheme === 'glass' ? 'bg-white/80 dark:bg-slate-900/60 backdrop-blur-md' : 'bg-white dark:bg-slate-800'}`}>
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full text-pink-500 dark:text-pink-300">
                            <Calendar size={20} />
                         </div>
                         <div>
                            <h4 className="font-bold text-sm">Upcoming Event Approval</h4>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Easter Service Planning</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 transition-colors shadow-md shadow-green-200 dark:shadow-none">
                            <CheckCircle2 size={14} /> Approve
                         </button>
                         <button className="hover:bg-gray-100 dark:hover:bg-slate-700 p-1 rounded-full text-gray-400 transition-colors">
                            <MoreVertical size={16} />
                         </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3 border border-gray-100 dark:border-slate-700">
                         <div className="flex items-center gap-2 mb-1 text-gray-400 dark:text-gray-500 text-xs">
                            <Calendar size={12} /> Event Date
                         </div>
                         <p className="font-semibold text-sm">Apr 20, 2025</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3 border border-gray-100 dark:border-slate-700">
                         <div className="flex items-center gap-2 mb-1 text-gray-400 dark:text-gray-500 text-xs">
                            <Clock size={12} /> Duration
                         </div>
                         <p className="font-semibold text-sm">4 Hours</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3 border border-gray-100 dark:border-slate-700 flex justify-between items-center">
                         <div>
                           <div className="flex items-center gap-2 mb-1 text-gray-400 dark:text-gray-500 text-xs">
                              <AlertCircle size={12} /> Budget Status
                           </div>
                           <p className="font-semibold text-sm">Under Review</p>
                         </div>
                         <div className="h-8 w-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center border border-gray-200 dark:border-slate-600 text-gray-400">
                            <AlertCircle size={14}/>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
}