
import React, { useState } from 'react';
import { User, WalletTransaction } from '../types';
import { DollarSign, Package, Link, Download, Plus, ArrowUpRight, Clock, ExternalLink, TrendingUp } from 'lucide-react';

const ResellerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(450);
  const baseCost = 280; // Mock base cost from design builder

  const [transactions] = useState<WalletTransaction[]>([
    { id: 'tx1', resellerId: 'u1', amount: 850, type: 'credit', status: 'completed', createdAt: '2024-03-24 10:00' },
    { id: 'tx2', resellerId: 'u1', amount: 2000, type: 'debit', status: 'pending', createdAt: '2024-03-25 14:30' },
  ]);

  const profit = sellingPrice - baseCost;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Reseller Hub</h1>
          <p className="text-slate-500 text-lg">Manage your apparel brand and earnings.</p>
        </div>
        <button 
          onClick={() => setShowLinkModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100"
        >
          <Plus className="w-6 h-6" />
          Create Sales Link
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between">
          <div>
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-[10px] mb-2">Available Balance</p>
            <p className="text-5xl font-black">৳{user.walletBalance.toLocaleString()}</p>
          </div>
          <button className="mt-8 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition flex items-center justify-center gap-2">
            Withdraw Funds <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Total Sales</p>
              <p className="text-4xl font-black text-slate-900">128</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp /></div>
          </div>
          <p className="text-emerald-600 font-bold text-sm mt-4">+12% from last month</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Pending Payouts</p>
              <p className="text-4xl font-black text-slate-900">৳2,000</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock /></div>
          </div>
          <p className="text-slate-400 text-sm mt-4 font-medium">Next release: Mar 30</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-800">Your Active Products</h2>
            <button className="text-indigo-600 font-black text-sm hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 flex items-center gap-6 group hover:bg-slate-50 transition">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={`https://picsum.photos/200/200?sig=${i}`} alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-black text-slate-800 text-lg">Premium Streetwear Drop #{i}</h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Profit: ৳170</span>
                    <span className="text-xs font-bold text-slate-400">Orders: {i * 12}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition border border-transparent hover:border-slate-100"><ExternalLink className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <h2 className="text-2xl font-black text-slate-800">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {transactions.map(tx => (
              <div key={tx.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800">{tx.type === 'credit' ? 'Profit Payout' : 'Withdrawal Request'}</p>
                    <p className="text-xs text-slate-400 font-bold">{tx.createdAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'} ৳{tx.amount}
                  </p>
                  <span className={`text-[9px] uppercase font-black px-2 py-1 rounded-full ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10">
            <h2 className="text-3xl font-black mb-8 text-slate-900">Configure Sales Link</h2>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Pricing Engine</p>
                <div className="space-y-3">
                  <div className="flex justify-between font-bold text-sm">
                    <span className="text-slate-500">System Base Cost</span>
                    <span className="text-slate-900">৳{baseCost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold text-sm">Your Selling Price</span>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                       <input 
                        type="number" 
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(Number(e.target.value))}
                        className="bg-white border-2 border-indigo-100 rounded-xl py-2 pl-8 pr-4 w-32 font-black text-indigo-600 outline-none focus:border-indigo-600"
                       />
                    </div>
                  </div>
                  <div className="h-px bg-slate-200 my-4"></div>
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="font-black">Your Profit / Piece</span>
                    <span className="text-2xl font-black">৳{profit}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowLinkModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition">Cancel</button>
                <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">Generate Link</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerDashboard;
