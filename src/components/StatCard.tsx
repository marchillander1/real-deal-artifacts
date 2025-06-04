
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, color = "blue" }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            {change}
          </p>
        )}
      </div>
      <div className={`bg-${color}-100 p-3 rounded-lg`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

export default StatCard;
