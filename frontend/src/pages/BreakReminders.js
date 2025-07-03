import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Coffee, Droplets, Activity, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BreakReminders = () => {
  const { user, takeBreak, loading } = useAuth();
  const [selectedType, setSelectedType] = useState(null);
  const [aiResponse, setAiResponse] = useState('');

  const breakTypes = [
    { id: 'Take a 5-minute break', label: 'Take a 5-minute break', icon: Activity, color: 'bg-gradient-to-tr from-calm to-focus' },
    { id: 'Drink water', label: 'Drink water', icon: Droplets, color: 'bg-gradient-to-tr from-primary to-accent' },
          { id: 'Coffee break', label: 'Coffee break', icon: Coffee, color: 'bg-gradient-to-tr from-energy to-accent' }
  ];

  const handleSetReminder = async () => {
    if (!selectedType) return;
    const data = await takeBreak(selectedType.label);
    if (data) {
      if (selectedType.id === 'Take a 5-minute break') setAiResponse('Great! Stretch and move your body for a few minutes.');
      if (selectedType.id === 'Drink water') setAiResponse('Hydration is key! Go grab a glass of water.');
      if (selectedType.id === 'Coffee break') setAiResponse('Enjoy your coffee break! Remember to relax your mind.');
      setSelectedType(null);
      // Browser notification for break reminder (5 minutes later)
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          setTimeout(() => {
            new Notification('Wellness Buddy', {
              body: `Time for your break: ${data?.reminder_type || 'Take a break!'}`,
              icon: '/favicon.ico',
            });
          }, 5 * 60 * 1000); // 5 minutes
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              setTimeout(() => {
                new Notification('Wellness Buddy', {
                  body: `Time for your break: ${data?.reminder_type || 'Take a break!'}`,
                  icon: '/favicon.ico',
                });
              }, 5 * 60 * 1000);
            }
          });
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-energy-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Break Reminders
        </h1>
        <p className="text-lg text-neutral-600">
          Set reminders to take healthy breaks throughout your day
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="wellness-card"
      >
        <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6">
          Choose your break type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {breakTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type)}
              className={`wellness-card cursor-pointer transition-all duration-300 ${
                selectedType?.id === type.id
                  ? 'ring-2 ring-energy-400 shadow-large'
                  : 'hover:shadow-medium'
              }`}
            >
              <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <type.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-neutral-900">{type.label}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <motion.button
          onClick={handleSetReminder}
          disabled={!selectedType || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`wellness-button-primary text-lg px-8 py-4 ${
            !selectedType || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Setting reminder...</span>
            </div>
          ) : (
            'Set Break Reminder (+5 points)'
          )}
        </motion.button>
      </motion.div>

      {aiResponse && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="wellness-card bg-energy-50 border-energy-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-energy-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2">Wellness Buddy's Tip</h3>
              <p className="text-neutral-700 leading-relaxed">{aiResponse}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BreakReminders; 