import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'blue', trend = null, subtext = null }) {
  const colorStyles = {
    blue: {
      number: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/30'
    },
    green: {
      number: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/30'
    },
    amber: {
      number: 'text-amber-500 dark:text-amber-400',
      badge: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/30'
    },
    purple: {
      number: 'text-indigo-600 dark:text-indigo-400',
      badge: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/30'
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl ${style.badge}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mt-1">
        <h3 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${style.number}`}>
          {value}
        </h3>
      </div>

      {(subtext || trend) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          {trend && (
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {trend}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  );
}
