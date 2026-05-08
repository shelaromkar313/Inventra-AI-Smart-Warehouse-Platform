import React, { useState } from 'react';
import { Warehouse3D } from '../components/Warehouse3D';
import { 
  Box, 
  Layers, 
  Activity, 
  Zap, 
  Thermometer, 
  AlertTriangle,
  RefreshCw,
  Maximize2,
  Camera,
  Scan,
  BarChart3,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

// Mock real-time sensor data
const sensorData = {
  temperature: 22.4,
  humidity: 45,
  energyUsage: 1240,
  activeRobots: 3,
  alerts: 2,
  lastSync: '2 seconds ago'
};

const zoneStats = [
  { zone: 'Zone A', status: 'active', items: 45, capacity: 60, temp: 21.5 },
  { zone: 'Zone B', status: 'high', items: 128, capacity: 85, temp: 22.1 },
  { zone: 'Zone C', status: 'active', items: 32, capacity: 40, temp: 23.0 },
  { zone: 'Zone D', status: 'active', items: 67, capacity: 70, temp: 22.8 },
  { zone: 'Zone E', status: 'low', items: 23, capacity: 30, temp: 4.2 },
  { zone: 'Zone F', status: 'warning', items: 12, capacity: 25, temp: 20.5 },
];

const recentEvents = [
  { id: 1, time: '10:42 AM', event: 'Robot #2 completed inventory scan in Zone B', type: 'success' },
  { id: 2, time: '10:38 AM', event: 'Temperature alert in Cold Storage (Zone E)', type: 'warning' },
  { id: 3, time: '10:35 AM', event: 'New shipment received at Dock A', type: 'info' },
  { id: 4, time: '10:30 AM', event: 'Autonomous forklift completed task #4421', type: 'success' },
];

const StatCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card group hover:shadow-lg transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={clsx("p-2 rounded-lg", `bg-${color}-50 text-${color}-600`)}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className={clsx(
          "text-xs font-medium px-2 py-1 rounded-full",
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <span className="text-xs text-slate-400">{unit}</span>
      </div>
    </div>
  </motion.div>
);

const ZoneCard = ({ zone, status, items, capacity, temp }: any) => {
  const statusColors = {
    active: 'emerald',
    high: 'amber',
    low: 'blue',
    warning: 'rose'
  };
  
  const color = statusColors[status as keyof typeof statusColors];
  
  return (
    <div className={clsx(
      "p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer",
      `border-${color}-200 bg-${color}-50/30`
    )}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-slate-900">{zone}</span>
        <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", `bg-${color}-100 text-${color}-700`)}>
          {status.toUpperCase()}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Items</span>
          <span className="font-bold text-slate-700">{items}</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className={clsx("h-full rounded-full", `bg-${color}-500`)}
            style={{ width: `${capacity}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Capacity: {capacity}%</span>
          <span className="text-slate-400">{temp}°C</span>
        </div>
      </div>
    </div>
  );
};

const DigitalTwin = () => {
  const [viewMode, setViewMode] = useState<'3d' | 'heatmap' | 'inventory'>('3d');
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              Live
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Last updated {sensorData.lastSync}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            Digital Twin Warehouse
            <Box className="w-8 h-8 text-indigo-500" />
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time 3D visualization with IoT sensor integration and predictive analytics
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setViewMode('3d')}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              viewMode === '3d' 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            3D View
          </button>
          <button 
            onClick={() => setViewMode('heatmap')}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              viewMode === 'heatmap' 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            Heatmap
          </button>
          <button 
            onClick={() => setViewMode('inventory')}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              viewMode === 'inventory' 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            <Box className="w-4 h-4 inline mr-2" />
            Inventory
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Warehouse Temp" 
          value={sensorData.temperature} 
          unit="°C" 
          icon={Thermometer} 
          color="orange"
          trend={-2.3}
        />
        <StatCard 
          title="Energy Usage" 
          value={sensorData.energyUsage} 
          unit="kWh" 
          icon={Zap} 
          color="amber"
          trend={5.1}
        />
        <StatCard 
          title="Active Robots" 
          value={sensorData.activeRobots} 
          unit="units" 
          icon={Activity} 
          color="emerald"
        />
        <StatCard 
          title="Active Alerts" 
          value={sensorData.alerts} 
          unit="alerts" 
          icon={AlertTriangle} 
          color="rose"
          trend={-50}
        />
      </div>

      {/* Main 3D Visualization */}
      <div className={clsx("relative", isFullscreen ? "fixed inset-0 z-50 bg-slate-950" : "")}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scan className="w-5 h-5 text-indigo-500" />
            Interactive 3D Model
          </h2>
          <div className="flex gap-2">
            <button 
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <Warehouse3D />
      </div>

      {/* Zone Details & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Zone Status */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Zone Status Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {zoneStats.map((z) => (
                <ZoneCard key={z.zone} {...z} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Recent Events
          </h3>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl">
                <div className={clsx(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  event.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                  event.type === 'warning' ? "bg-amber-100 text-amber-600" :
                  "bg-blue-100 text-blue-600"
                )}>
                  {event.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                   event.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                   <Box className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">{event.event}</p>
                  <p className="text-xs text-slate-400 mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
            View All Events
          </button>
        </div>
      </div>

      {/* AI Predictions Banner */}
      <div className="card bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI-Powered Predictions</h3>
              <p className="text-indigo-100 text-sm">
                Zone B is predicted to reach 95% capacity by 4:30 PM. Consider redistributing inventory to Zone C.
              </p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
            View Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
