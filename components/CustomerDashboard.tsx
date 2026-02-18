
import React from 'react';
import { User } from '../types';
import { Package, Truck, Calendar } from 'lucide-react';

const CustomerDashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">My Orders</h1>
        <p className="text-slate-500 text-lg">Track your custom apparel status</p>
      </div>

      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1">
                <Calendar className="w-3 h-3" />
                Ordered on March {20 + i}, 2024
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Order #PF-908{i}</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  2x Custom Drop-Shoulder T-Shirts
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-600 font-bold">
                  Total Paid: ৳1,450
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl min-w-[150px]">
              <Truck className="w-6 h-6 text-indigo-600 mb-2" />
              <p className="text-sm font-bold text-slate-800">In Transit</p>
              <p className="text-[10px] text-slate-400">Expected: Mar 28</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
