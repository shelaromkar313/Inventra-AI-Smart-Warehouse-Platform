import React from 'react';
import { Search, Bell, Moon, Sun, User } from 'lucide-react';

export const Topbar = () => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search inventory, alerts, or orders..." 
          className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">Warehouse-A</p>
            <p className="text-xs text-slate-500">Online</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            W
          </div>
        </div>
      </div>
    </header>
  );
};
