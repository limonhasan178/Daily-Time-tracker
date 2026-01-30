
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  PieChart as ChartIcon, 
  LayoutDashboard,
  Clock,
  Settings
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Layout from './components/Layout';
import { Task, Category } from './types';
import { CATEGORY_COLORS, CATEGORY_CHART_COLORS } from './constants';
import { calculateBlocks } from './utils';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('planning');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayStartTime, setDayStartTime] = useState('07:00');
  
  // Date-indexed state
  const [tasksByDate, setTasksByDate] = useState<Record<string, Task[]>>({
    [new Date().toISOString().split('T')[0]]: [
      { id: '1', title: 'Morning Routine', duration: 45, category: Category.REST, isRaw: false },
      { id: '2', title: 'Deep Work Session', duration: 180, category: Category.WORK, isRaw: false },
      { id: '3', title: 'Lunch Break', duration: 60, category: Category.REST, isRaw: false },
      { id: '4', title: 'Team Sync', duration: 30, category: Category.SOCIAL, isRaw: false },
    ]
  });

  // Drag and drop local state
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const currentTasks = tasksByDate[selectedDate] || [];
  
  const scheduledTasks = useMemo(() => {
    const active = currentTasks.filter(t => !t.isRaw);
    return calculateBlocks(active, dayStartTime);
  }, [currentTasks, dayStartTime]);

  const rawTasks = currentTasks.filter(t => t.isRaw);

  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasksByDate(prev => ({ ...prev, [selectedDate]: newTasks }));
  }, [selectedDate]);

  const addTask = (isRaw: boolean) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      duration: 30,
      category: Category.OTHER,
      isRaw: isRaw
    };
    saveTasks([...currentTasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    saveTasks(currentTasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    saveTasks(currentTasks.filter(t => t.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggingIndex === null) return;
    
    const activeTasks = currentTasks.filter(t => !t.isRaw);
    const raw = currentTasks.filter(t => t.isRaw);
    
    const newActive = [...activeTasks];
    const [movedItem] = newActive.splice(draggingIndex, 1);
    newActive.splice(targetIndex, 0, movedItem);
    
    saveTasks([...newActive, ...raw]);
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const navigateDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    scheduledTasks.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + t.duration;
    });
    return Object.entries(counts).map(([name, value]) => ({ 
      name, 
      value, 
      color: CATEGORY_CHART_COLORS[name as Category] 
    }));
  }, [scheduledTasks]);

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isDarkMode={isDarkMode} 
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
    >
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col gap-4">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><ChevronLeft size={18}/></button>
            <div className="px-4 py-1 flex flex-col items-center">
              <span className="text-sm font-bold tracking-tight">
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
              </span>
              <input 
                type="date" 
                className="absolute opacity-0 w-24 cursor-pointer" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
            <button onClick={() => navigateDate(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><ChevronRight size={18}/></button>
          </div>
          
          <div className="flex items-center gap-2 pr-2">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
               <Clock size={12} className="text-slate-400" />
               <input 
                type="time" 
                value={dayStartTime} 
                onChange={e => setDayStartTime(e.target.value)} 
                className="bg-transparent text-xs font-bold outline-none cursor-pointer" 
               />
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
          
          {/* Main Timeline Section */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Timeline Scheduler</h2>
              <button onClick={() => addTask(false)} className="flex items-center gap-1 text-xs font-bold text-brand-dark hover:text-emerald-400 transition-colors">
                <Plus size={14}/> Add Block
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 slim-scrollbar">
              <div className="space-y-1.5 relative">
                {scheduledTasks.map((task, idx) => (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={e => handleDragStart(e, idx)}
                    onDragOver={e => handleDragOver(e, idx)}
                    onDrop={e => handleDrop(e, idx)}
                    className={`group relative flex items-center gap-3 transition-all duration-200
                      ${dragOverIndex === idx ? 'pt-8' : ''}
                      ${draggingIndex === idx ? 'opacity-30 scale-[0.98]' : ''}
                    `}
                  >
                    {dragOverIndex === idx && (
                      <div className="absolute top-2 left-0 right-0 h-1 bg-brand-light rounded-full animate-pulse z-10"></div>
                    )}
                    
                    <div className="w-14 text-[10px] font-black mono text-slate-400 dark:text-slate-500 text-right shrink-0">
                      {task.startTime}
                    </div>

                    <div className={`flex-1 flex items-center h-10 px-3 rounded-xl border-l-4 transition-all hover:shadow-sm ${CATEGORY_COLORS[task.category]}`}>
                      <GripVertical size={14} className="mr-2 opacity-30 cursor-grab group-active:cursor-grabbing shrink-0" />
                      <input 
                        value={task.title}
                        onChange={e => updateTask(task.id, { title: e.target.value })}
                        placeholder="Task details..."
                        className="bg-transparent text-sm font-semibold outline-none flex-1 placeholder:opacity-50"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <input 
                          type="number" 
                          value={task.duration}
                          onChange={e => updateTask(task.id, { duration: parseInt(e.target.value) || 0 })}
                          className="w-10 bg-black/5 dark:bg-white/10 text-center rounded text-[10px] font-black py-0.5 outline-none"
                        />
                        <select 
                          value={task.category}
                          onChange={e => updateTask(task.id, { category: e.target.value as Category })}
                          className="bg-transparent text-[10px] font-bold uppercase tracking-tighter outline-none opacity-60"
                        >
                          {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button onClick={() => deleteTask(task.id)} className="p-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all">
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {scheduledTasks.length === 0 && (
                  <div className="text-center py-20 text-slate-300 dark:text-slate-700">
                    <LayoutDashboard size={40} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">Plan your day below</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area: Stats & Raw Ideas */}
          <div className="w-full md:w-64 flex flex-col gap-4">
            
            {/* Ultra-Slim Stats */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1">
                <ChartIcon size={12}/> Allocation
              </h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={30} outerRadius={45} paddingAngle={5} dataKey="value" stroke="none">
                      {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1">
                 {chartData.map(item => (
                   <div key={item.name} className="flex justify-between items-center text-[10px] font-bold">
                     <span className="text-slate-500">{item.name}</span>
                     <span className="mono">{item.value}m</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Ideas Dump */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
               <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Backlog</h3>
                  <button onClick={() => addTask(true)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"><Plus size={12}/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-2 slim-scrollbar">
                  {rawTasks.map(task => (
                    <div key={task.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 group">
                      <input 
                        value={task.title}
                        onChange={e => updateTask(task.id, { title: e.target.value })}
                        placeholder="Future idea..."
                        className="bg-transparent text-xs font-bold outline-none w-full placeholder:opacity-40"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <button 
                          onClick={() => updateTask(task.id, { isRaw: false })}
                          className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-0.5 rounded-lg"
                        >
                          Schedule
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                          <Trash2 size={10}/>
                        </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
