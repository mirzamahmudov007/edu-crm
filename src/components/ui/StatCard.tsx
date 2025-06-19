import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  gradient,
  iconBg,
  change
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="font-medium">{change.value}</span>
              <span className="ml-1 text-gray-500">dan oldingi oyga nisbatan</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className={`h-1 w-full ${gradient} rounded-full mt-4`}></div>
    </div>
  );
};