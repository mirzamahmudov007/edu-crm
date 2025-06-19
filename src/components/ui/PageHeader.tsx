import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  gradient: string;
  stats?: Array<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
  }>;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  gradient,
  stats,
  action
}) => {
  return (
    <div className={`${gradient} rounded-2xl p-8 text-white mb-8 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white transform -translate-x-24 translate-y-24"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-white/80">{subtitle}</p>
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};