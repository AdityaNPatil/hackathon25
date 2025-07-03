import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Heart, 
  Coffee, 
  MessageCircle, 
  BarChart3, 
  Trophy, 
  Menu, 
  X, 
  LogOut,
  User,
  Settings,
  Brain,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, color: 'text-primary' },
    { name: 'Colleague Check-in', href: '/checkin', icon: Heart, color: 'text-heart' },
    { name: 'Meditation', href: '/meditation', icon: Brain, color: 'text-meditation' },
    { name: 'Break Reminders', href: '/breaks', icon: Clock, color: 'text-activity' },
    { name: 'Chat', href: '/chat', icon: MessageCircle, color: 'text-message' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'text-analytics' },
    { name: 'Team Leaderboard', href: '/leaderboard', icon: Trophy, color: 'text-trophy' },
  ];

  const handleLogout = () => {
    logout();
  };

  // Show demo points if user has zero
  const demoPoints = user?.points && user.points > 0 ? user.points : 120;

  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-muted via-secondary to-calm/30">
      {/* Sidebar */}
      <div className={`z-50 ${sidebarCollapsed ? 'w-24' : 'w-80'} bg-white shadow-large h-full flex-shrink-0 transition-all duration-300 ease-in-out`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={`flex items-center justify-between ${sidebarCollapsed ? 'p-3' : 'p-6'} border-b border-neutral-100`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'space-x-4'}`}>
              <img src="/logo.jpg" alt="CalmIQ Logo" className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-14 h-14'} rounded-full object-cover shadow-lg`} />
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-2xl font-display font-semibold wellness-gradient-text">
                    CalmIQ
                  </h1>
                  <p className="text-base text-neutral-500">Employee Wellness Platform</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-neutral-600" />
              </button>
            )}
          </div>

          {/* User Profile */}
          <div className={`${sidebarCollapsed ? 'p-3' : 'p-6'} border-b border-neutral-100`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className={`${sidebarCollapsed ? 'w-10 h-10 text-lg' : 'w-12 h-12 text-2xl'} bg-gradient-to-tr from-accent to-calm rounded-full flex items-center justify-center text-white font-bold`}>
                K
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">{user?.username}</h3>
                  <p className="text-sm text-neutral-500">kanha930@gmail.com</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="mt-4 p-3 bg-secondary rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Total Points</span>
                  <span className="font-semibold text-primary">{demoPoints}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${sidebarCollapsed ? 'p-3' : 'p-6'} space-y-2`}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2 py-4' : 'space-x-3 px-4 py-3'} rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <item.icon className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isActive ? 'text-white' : item.color}`} />
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                </motion.button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`${sidebarCollapsed ? 'p-3' : 'p-6'} border-t border-neutral-100`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2 py-4' : 'space-x-3 px-4 py-3'} rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200`}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              <LogOut className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
              {!sidebarCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu className="w-5 h-5 text-neutral-600" />
                </button>
              )}
              <div className="hidden lg:flex items-center space-x-2 text-sm text-neutral-500">
                <span>Welcome back,</span>
                <span className="font-medium text-neutral-900">{user?.username}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-secondary rounded-full">
                <Heart className="w-4 h-4 text-heart" />
                <span className="text-sm font-medium text-primary">{demoPoints} pts</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout; 