import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  change, 
  isPositive = true, 
  icon: Icon, 
  accentColor = 'emerald', // emerald, gold, orange, red, blue
  badgeText
}) {
  const accentClasses = {
    emerald: {
      bgIcon: 'bg-[#1b4332]/10 text-[#1b4332] border-[#1b4332]/20',
      borderTop: 'border-t-4 border-t-[#1b4332]',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    gold: {
      bgIcon: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      borderTop: 'border-t-4 border-t-[#d4af37]',
      badge: 'bg-amber-100 text-amber-900 border border-amber-300'
    },
    orange: {
      bgIcon: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      borderTop: 'border-t-4 border-t-orange-500',
      badge: 'bg-orange-100 text-orange-800'
    },
    red: {
      bgIcon: 'bg-red-500/10 text-red-600 border-red-500/20',
      borderTop: 'border-t-4 border-t-red-500',
      badge: 'bg-red-100 text-red-800'
    },
    blue: {
      bgIcon: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      borderTop: 'border-t-4 border-t-blue-600',
      badge: 'bg-blue-100 text-blue-800'
    }
  };

  const currentAccent = accentClasses[accentColor] || accentClasses.emerald;

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-xs border border-gray-100 hover-card-rise relative overflow-hidden ${currentAccent.borderTop}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-2xs ${currentAccent.bgIcon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
        {change && (
          <div className={`flex items-center font-bold px-2 py-0.5 rounded-md ${
            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            <span>{change}</span>
          </div>
        )}

        {subtitle && (
          <span className="text-gray-500 font-medium truncate">{subtitle}</span>
        )}

        {badgeText && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentAccent.badge}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
