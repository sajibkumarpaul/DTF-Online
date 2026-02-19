import React from 'react';
import { User } from '../types';
import { Settings, Users, ClipboardList, Database, Check, X } from 'lucide-react';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Admin Control Panel</h1>
        <p className="text-slate-500">Managing Sell Point Operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Sales</p>
          <p className="text-xl font-black">৳1,24,500</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase">Pending Orders</p>
          <p className="text-xl font-black">18</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase">Payout Requests</p>
          <p className="text-xl font-black">5</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase">DTF Rate</p>
          <p className="text-xl font-black">৳380/m</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Management Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
                Active Order Queue
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Design</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[101, 102, 103].map(id => (
                  <tr key={id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-600">#SP-{id}</td>
                    <td className="px-6 py-4">Asif Rahman<br/><span className="text-[10px] text-slate-400">01800000000</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-200 rounded"></div>
                        <span>A3 Front</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase">Processing</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Check className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" />
              Global Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">DTF Print Rate (BDT/m)</label>
                <input type="number" defaultValue="380" className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm font-bold" />
              </div>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Update System</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-slate-400" />
              Apparel Catalog
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-slate-100 text-sm font-medium">Manage GSM Prices</button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-slate-100 text-sm font-medium">Add New Product</button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-slate-100 text-sm font-medium">Bulk Stock Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;