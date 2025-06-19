
import React from 'react';
import { Shield, Users, Award, Lock } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustItems = [
    {
      icon: Users,
      text: "100+ consultants already onboard"
    },
    {
      icon: Award,
      text: "No commitment required"
    },
    {
      icon: Users,
      text: "Built by consultants – powered by AI"
    },
    {
      icon: Lock,
      text: "Your data stays private and only used for analysis + matching"
    }
  ];

  return (
    <div className="mt-16 bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Trusted by IT professionals worldwide
        </h3>
        <p className="text-slate-600">
          Your privacy and professional growth are our top priorities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trustItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
            <item.icon className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-slate-700 text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
