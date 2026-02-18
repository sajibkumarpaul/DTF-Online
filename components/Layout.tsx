
import React from 'react';
import { User, UserRole, CartItem } from '../types';
import { ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, Brush, X, Trash2, ShoppingBag } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: 'landing' | 'builder' | 'dashboard') => void;
  cart: CartItem[];
  onRemoveFromCart: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  onNavigate, 
  cart, 
  onRemoveFromCart,
  isCartOpen,
  setIsCartOpen
}) => {
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('landing')}>
              <div className="bg-indigo-600 p-2 rounded-xl mr-3 group-hover:scale-110 transition shadow-lg shadow-indigo-200">
                <Brush className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                PrintFlow<span className="text-indigo-600">BD</span>
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-10">
              <button onClick={() => onNavigate('landing')} className="text-slate-500 hover:text-indigo-600 font-bold transition">Home</button>
              <button onClick={() => onNavigate('builder')} className="text-slate-500 hover:text-indigo-600 font-bold transition">Designer</button>
              <button className="text-slate-500 hover:text-indigo-600 font-bold transition">Apparel</button>
              <button className="text-slate-500 hover:text-indigo-600 font-bold transition">Bulk Orders</button>
            </div>

            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition font-bold border border-slate-100">
                    <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </button>
                  <button onClick={onLogout} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button onClick={() => onNavigate('builder')} className="hidden sm:block px-6 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
                  Join Now
                </button>
              )}
              
              <div className="relative group cursor-pointer" onClick={() => setIsCartOpen(true)}>
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition border border-slate-100">
                  <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black w-6 h-6 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-black text-slate-900">Your Cart</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <ShoppingCart className="w-16 h-16 opacity-10 mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs">Your cart is empty</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); onNavigate('builder'); }}
                    className="mt-6 text-indigo-600 font-black text-sm hover:underline"
                  >
                    Start Designing
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="group p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4 hover:border-indigo-200 transition-all">
                    <div className="w-20 h-20 bg-white rounded-xl border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                       {/* Simplified Preview Placeholder */}
                       <Brush className="w-8 h-8 text-slate-200" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-slate-900 text-sm leading-tight">{item.productName}</h3>
                        <button 
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {item.color && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 uppercase">{item.color}</span>}
                        {item.size && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 uppercase">{item.size}</span>}
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-indigo-600 uppercase">Qty: {item.quantity}</span>
                      </div>
                      <div className="mt-3 flex justify-between items-end">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</span>
                        <span className="font-black text-indigo-600">৳{Math.round(item.total).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-2xl font-black text-slate-900">৳{Math.round(cartTotal).toLocaleString()}</span>
                </div>
                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                  Proceed to Checkout
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Free delivery on orders over ৳5000</p>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <Brush className="w-8 h-8 text-indigo-500 mr-2" />
              <span className="text-3xl font-black text-white tracking-tighter">PrintFlow BD</span>
            </div>
            <p className="text-lg max-w-sm leading-relaxed mb-8">Empowering the next generation of apparel brands in Bangladesh with world-class DTF technology.</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">FB</div>
              <div className="w-10 h-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">IG</div>
              <div className="w-10 h-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">LI</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Platform</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li className="hover:text-indigo-400 transition cursor-pointer">Custom Designer</li>
              <li className="hover:text-indigo-400 transition cursor-pointer">GSM Guide</li>
              <li className="hover:text-indigo-400 transition cursor-pointer">Reseller Program</li>
              <li className="hover:text-indigo-400 transition cursor-pointer">Bulk DTF Rolls</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Support</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li className="hover:text-indigo-400 transition cursor-pointer">Shipping Tracker</li>
              <li className="hover:text-indigo-400 transition cursor-pointer">Production Status</li>
              <li className="hover:text-indigo-400 transition cursor-pointer">Refund Policy</li>
              <li className="hover:text-indigo-400 transition cursor-pointer">Contact Support</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest">
          <p>© 2024 PrintFlow Bangladesh. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
