import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Meditation from './pages/Meditation';
import BreakReminders from './pages/BreakReminders';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
                  <div className="min-h-screen bg-gradient-to-br from-muted via-secondary to-calm/30">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="checkin" element={<CheckIn />} />
                <Route path="meditation" element={<Meditation />} />
                <Route path="breaks" element={<BreakReminders />} />
                <Route path="chat" element={<Chat />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="leaderboard" element={<Leaderboard />} />
              </Route>
            </Routes>
          </AnimatePresence>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                borderRadius: '12px',
                boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 