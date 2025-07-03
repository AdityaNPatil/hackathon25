import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Sun, Moon, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    await login(username, email);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-secondary to-energy/20 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-20 text-primary/20"
        >
          <Sun className="w-16 h-16" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 text-calm/20"
        >
          <Cloud className="w-12 h-12" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-1/4 text-calm/20"
        >
          <Moon className="w-14 h-14" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-large"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-display font-bold wellness-gradient-text mb-2">
            Wellness Buddy
          </h1>
          <p className="text-lg text-neutral-600 mb-2">
            Your AI-powered wellness companion
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
                            <Sparkles className="w-4 h-4 text-primary" />
            <span>Start your wellness journey today</span>
          </div>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="wellness-card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-2">
                Username *
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="wellness-input"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email (optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="wellness-input"
                placeholder="Enter your email"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !username.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full wellness-button-primary ${
                isLoading || !username.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Welcome...</span>
                </div>
              ) : (
                'Begin Wellness Journey'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
                    { icon: Heart, label: 'Check-ins', color: 'text-accent' },
        { icon: Cloud, label: 'Meditation', color: 'text-calm' },
                          { icon: Sun, label: 'Analytics', color: 'text-energy' },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="text-center p-4 wellness-card"
            >
              <feature.icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
              <p className="text-sm font-medium text-neutral-600">{feature.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Wellness Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 text-center"
        >
          <blockquote className="text-neutral-500 italic">
            "Wellness is not a destination, but a way of life. Every breath, every moment, every choice matters."
          </blockquote>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login; 