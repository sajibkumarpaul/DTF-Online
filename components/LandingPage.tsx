import React from 'react';
import { UserRole } from '../types';
import { Shirt, Rocket, Wallet, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onStartBuilding: () => void;
  onLogin: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartBuilding, onLogin }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Premium DTF POD Solution
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
              Print Your Vision <br />
              <span className="text-indigo-600">Sell Everywhere.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0">
              The only DTF platform in Bangladesh that gives you professional design tools and a built-in reseller system to launch your apparel brand in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={onStartBuilding} className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
                Create My Design
              </button>
              <button onClick={() => onLogin(UserRole.RESELLER)} className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition">
                Become a Reseller
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/600/500?creative" alt="Platform Preview" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Sell Point?</h2>
            <p className="text-slate-500">We handle the tech and production; you focus on creativity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shirt className="w-8 h-8 text-indigo-600" />}
              title="Premium DTF Prints"
              desc="Vibrant colors, durable prints, and high-quality 100% cotton apparel for your brand."
            />
            <FeatureCard 
              icon={<Rocket className="w-8 h-8 text-violet-600" />}
              title="Next-Day Production"
              desc="Swift turnaround times to keep your customers happy and your business moving fast."
            />
            <FeatureCard 
              icon={<Wallet className="w-8 h-8 text-emerald-600" />}
              title="Smart Reseller Wallet"
              desc="Automatic profit distribution and instant withdrawal to bKash/Nagad."
            />
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 border border-slate-100 rounded-[3rem] p-12 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shirt className="w-64 h-64 text-indigo-600" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-grow">
              <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <span>DTF Printing at only ৳380 per meter</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <span>Base Apparel starting from ৳115</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <span>Volume discounts available for Bulk</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-w-[300px] text-center">
              <p className="text-slate-400 text-sm font-bold uppercase mb-2">Reseller Margin</p>
              <div className="text-5xl font-black text-slate-900 mb-2">৳150+</div>
              <p className="text-slate-500 mb-6">Profit Per T-Shirt</p>
              <button onClick={() => onLogin(UserRole.RESELLER)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                Start Selling
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Switcher (Mock Login) */}
      <section className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Demo Access (Role Selection)</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onLogin(UserRole.ADMIN)} className="px-4 py-2 text-xs font-bold border border-slate-200 rounded hover:bg-slate-50">Log in as Admin</button>
            <button onClick={() => onLogin(UserRole.RESELLER)} className="px-4 py-2 text-xs font-bold border border-slate-200 rounded hover:bg-slate-50">Log in as Reseller</button>
            <button onClick={() => onLogin(UserRole.CUSTOMER)} className="px-4 py-2 text-xs font-bold border border-slate-200 rounded hover:bg-slate-50">Log in as Customer</button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;