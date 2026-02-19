import React, { useState, useEffect } from 'react';
import { User, UserRole, CartItem } from './types';
import Layout from './components/Layout';
import CanvasBuilder from './components/CanvasBuilder';
import LandingPage from './components/LandingPage';
import ResellerDashboard from './components/ResellerDashboard';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'builder' | 'dashboard'>('landing');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sellpoint_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('sellpoint_cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (role: UserRole) => {
    setUser({
      id: 'u1',
      name: role.charAt(0).toUpperCase() + role.slice(1) + ' User',
      email: `${role}@sellpoint.com`,
      phone: '01700000000',
      role: role,
      status: 'active',
      walletBalance: role === UserRole.RESELLER ? 2450 : 0
    });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const renderContent = () => {
    if (currentView === 'landing') {
      return <LandingPage onStartBuilding={() => setCurrentView('builder')} onLogin={handleLogin} />;
    }

    if (currentView === 'builder') {
      return <CanvasBuilder onBack={() => setCurrentView('landing')} onAddToCart={addToCart} />;
    }

    if (currentView === 'dashboard' && user) {
      switch (user.role) {
        case UserRole.ADMIN: return <AdminDashboard user={user} />;
        case UserRole.RESELLER: return <ResellerDashboard user={user} />;
        case UserRole.CUSTOMER: return <CustomerDashboard user={user} />;
      }
    }

    return null;
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onNavigate={setCurrentView}
      cart={cart}
      onRemoveFromCart={removeFromCart}
      isCartOpen={isCartOpen}
      setIsCartOpen={setIsCartOpen}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;