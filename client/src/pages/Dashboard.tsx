import React from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import InventoryHeatmap from '../components/InventoryHeatmap';

const data = [
  { name: 'Mon', stock: 4000, demand: 2400 },
  { name: 'Tue', stock: 3000, demand: 1398 },
  { name: 'Wed', stock: 2000, demand: 9800 },
  { name: 'Thu', stock: 2780, demand: 3908 },
  { name: 'Fri', stock: 1890, demand: 4800 },
  { name: 'Sat', stock: 2390, demand: 3800 },
  { name: 'Sun', stock: 3490, demand: 4300 },
];

// ...existing code...

// Add InventoryHeatmap to the Dashboard page's JSX (example location below)

// ...existing code for Dashboard layout...

// Example: Place InventoryHeatmap below charts or in a new section
// <InventoryHeatmap />

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="card group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className={clsx(
        "flex items-center text-xs font-medium px-2 py-1 rounded-full",
        change > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        {change > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {Math.abs(change)}%
      </div>
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);

// Note: Using a small hack for Tailwind dynamic colors in StatCard
import { clsx } from 'clsx';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Good Morning, Admin</h1>
        <p className="text-slate-500 mt-1">Here is what's happening in your warehouse today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Inventory" value="12,482" change={12} icon={Package} color="indigo" />
        <StatCard title="Active Alerts" value="24" change={-5} icon={AlertTriangle} color="amber" />
        <StatCard title="Predicted Demand" value="8,200" change={18} icon={TrendingUp} color="blue" />
        <StatCard title="System Uptime" value="99.9%" change={0.1} icon={Activity} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-6">Stock vs Demand Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="stock" stroke="#6366f1" fillOpacity={1} fill="url(#colorStock)" strokeWidth={2} />
                <Area type="monotone" dataKey="demand" stroke="#fbbf24" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-6">Inventory by Zone</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="stock" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
