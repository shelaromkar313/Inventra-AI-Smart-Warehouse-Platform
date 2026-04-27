import React from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Clock,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';

const severityConfig = {
  LOW: { icon: Info, color: 'blue' },
  MEDIUM: { icon: AlertTriangle, color: 'amber' },
  HIGH: { icon: AlertCircle, color: 'rose' },
  CRITICAL: { icon: AlertCircle, color: 'red' },
};

const Alerts = () => {
  const { alerts, isLoading, markAsRead } = useAlerts();

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const unreadAlerts = alerts.filter(a => !a.is_read);
  const readAlerts = alerts.filter(a => a.is_read);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Notifications</h1>
        <p className="text-slate-500 mt-1">Stay updated with critical warehouse events.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Active Alerts ({unreadAlerts.length})</h3>
        <div className="grid gap-4">
          {unreadAlerts.length === 0 ? (
            <div className="card text-center py-12 bg-slate-50/50">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="text-slate-900 font-bold">All clear!</p>
              <p className="text-slate-500 text-sm">No unhandled alerts in the system.</p>
            </div>
          ) : (
            unreadAlerts.map((alert) => {
              const { icon: Icon, color } = severityConfig[alert.severity] || severityConfig.LOW;
              return (
                <div key={alert.id} className={clsx(
                  "card flex gap-6 items-start border-l-4",
                  `border-l-${color}-500 shadow-lg shadow-${color}-500/5`
                )}>
                  <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold text-${color}-600`}>{alert.type}</span>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="text-slate-900 font-medium mb-4">{alert.message}</p>
                    <button 
                      onClick={() => markAsRead(alert.id)}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Acknowledge & Mark as Read
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {readAlerts.length > 0 && (
        <div className="space-y-4 opacity-75">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Recently Resolved</h3>
          <div className="grid gap-4">
            {readAlerts.map((alert) => (
              <div key={alert.id} className="card p-4 flex gap-4 items-center bg-slate-50">
                <CheckCircle2 className="w-5 h-5 text-slate-300" />
                <p className="text-slate-500 text-sm flex-1">{alert.message}</p>
                <span className="text-[10px] font-bold text-slate-400">{new Date(alert.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
