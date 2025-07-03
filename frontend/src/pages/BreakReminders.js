import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Coffee, Droplets, Activity, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Helper to get today's date string
const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const getCounts = () => {
  const todayKey = getTodayKey();
  const stored = JSON.parse(localStorage.getItem('break_counts') || '{}');
  if (stored.date !== todayKey) {
    // Reset counts for new day
    localStorage.setItem('break_counts', JSON.stringify({ date: todayKey, water: 0, coffee: 0, fiveMin: 0 }));
    return { water: 0, coffee: 0, fiveMin: 0 };
  }
  return { water: stored.water || 0, coffee: stored.coffee || 0, fiveMin: stored.fiveMin || 0 };
};

const setCounts = (water, coffee, fiveMin) => {
  const todayKey = getTodayKey();
  localStorage.setItem('break_counts', JSON.stringify({ date: todayKey, water, coffee, fiveMin }));
};

const BreakReminders = () => {
  const { user, takeBreak, loading } = useAuth();
  const [selectedType, setSelectedType] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [counts, setCountsState] = useState(getCounts());
  const [reminderTime, setReminderTime] = useState({ hours: '', minutes: '' });
  const [showTimeInput, setShowTimeInput] = useState(false);

  useEffect(() => {
    // Reset counts at midnight
    const now = new Date();
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) - now;
    const timeout = setTimeout(() => {
      setCounts(0, 0, 0);
      setCountsState({ water: 0, coffee: 0, fiveMin: 0 });
    }, msToMidnight);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setCountsState(getCounts());
  }, []);

  const breakTypes = [
    { id: 'Take a 5-minute break', label: 'Take a 5-minute break', icon: Activity, color: 'bg-gradient-to-tr from-calm to-focus' },
    { id: 'Drink water', label: 'Drink water', icon: Droplets, color: 'bg-gradient-to-tr from-primary to-accent' },
    { id: 'Coffee break', label: 'Coffee break', icon: Coffee, color: 'bg-gradient-to-tr from-energy to-accent' }
  ];

  // Fallback AI responses
  const fallbackAI = {
    'Take a 5-minute break': 'Great! Stretch and move your body for a few minutes.',
    'Drink water': 'Hydration is key! Go grab a glass of water.',
    'Coffee break': 'Enjoy your coffee break! Remember to relax your mind.'
  };

  // Show time input when a break is selected
  const handleBreakSelect = (type) => {
    setSelectedType(type);
    setShowTimeInput(true);
    setReminderTime({ hours: '', minutes: '' });
  };

  // Schedule browser notification
  const scheduleNotification = (reminderType, delayMs) => {
    const message = `Time for your break: ${reminderType}`;
    // In-app toast notification
    setTimeout(() => {
      toast(message, {
        icon: '⏰',
        duration: 8000,
        style: {
          background: '#fffbe6',
          color: '#363636',
          borderRadius: '12px',
          boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          fontWeight: 'bold',
          fontSize: '1.1rem',
        },
      });
    }, delayMs);

    // Browser notification
    if ('Notification' in window) {
      const notify = () => {
        new Notification('Wellness Buddy', {
          body: message,
          icon: '/favicon.ico',
        });
      };
      if (Notification.permission === 'granted') {
        setTimeout(notify, delayMs);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setTimeout(notify, delayMs);
          }
        });
      }
    }
  };

  // Handle setting the reminder
  const handleSetReminder = async () => {
    if (!selectedType) return;
    let delayMs = 0;
    let hours = parseInt(reminderTime.hours) || 0;
    let minutes = parseInt(reminderTime.minutes) || 0;
    if (selectedType.id === 'Drink water') {
      delayMs = (hours * 60 + minutes) * 60 * 1000;
    } else if (selectedType.id === 'Coffee break') {
      delayMs = hours * 60 * 60 * 1000;
    } else if (selectedType.id === 'Take a 5-minute break') {
      delayMs = 5 * 60 * 1000;
    } else {
      delayMs = 5 * 60 * 1000;
    }
    // Call backend
    let data = null;
    try {
      data = await takeBreak(selectedType.label);
    } catch {
      data = null;
    }
    // Fallback if no backend response
    let aiMsg = data?.ai_response || fallbackAI[selectedType.id] || 'Break reminder set!';
    setAiResponse(aiMsg);
    // Update counts for water/coffee/5min
    let newCounts = { ...counts };
    if (selectedType.id === 'Drink water') {
      newCounts.water = (counts.water || 0) + 1;
    } else if (selectedType.id === 'Coffee break') {
      newCounts.coffee = (counts.coffee || 0) + 1;
    } else if (selectedType.id === 'Take a 5-minute break') {
      newCounts.fiveMin = (counts.fiveMin || 0) + 1;
    }
    setCounts(newCounts.water, newCounts.coffee, newCounts.fiveMin);
    setCountsState(newCounts);
    setSelectedType(null);
    setShowTimeInput(false);
    setReminderTime({ hours: '', minutes: '' });
    // Schedule notification
    scheduleNotification(selectedType.label, delayMs);
  };

  // Render time input for selected break
  const renderTimeInput = () => {
    if (!selectedType) return null;
    if (selectedType.id === 'Drink water') {
      return (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <label className="text-neutral-700">Set reminder time for water:</label>
          <div className="flex space-x-2 justify-center items-center">
            <input type="number" min="0" max="23" placeholder="Hours" value={reminderTime.hours} onChange={e => setReminderTime({ ...reminderTime, hours: e.target.value })} className="wellness-input w-20" />
            <span className="text-neutral-700 text-center">H</span>
            <input type="number" min="0" max="59" placeholder="Minutes" value={reminderTime.minutes} onChange={e => setReminderTime({ ...reminderTime, minutes: e.target.value })} className="wellness-input w-20" />
            <span className="text-neutral-700 text-center">M</span>
          </div>
        </div>
      );
    } else if (selectedType.id === 'Coffee break') {
      return (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <label className="text-neutral-700">Set reminder time for coffee:</label>
          <div className="flex space-x-2 justify-center items-center">
            <input type="number" min="0" max="23" placeholder="Hours" value={reminderTime.hours} onChange={e => setReminderTime({ ...reminderTime, hours: e.target.value, minutes: '' })} className="wellness-input w-20" />
            <span className="text-neutral-700">H</span>
          </div>
        </div>
      );
    }
    return null;
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
              onClick={() => handleBreakSelect(type)}
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
                {type.id === 'Drink water' && (
                  <div className="text-sm text-primary mt-2">Drank water today: <span className="font-bold">{counts.water}</span></div>
                )}
                {type.id === 'Coffee break' && (
                  <div className="text-sm text-primary mt-2">Coffee breaks today: <span className="font-bold">{counts.coffee}</span></div>
                )}
                {type.id === 'Take a 5-minute break' && (
                  <div className="text-sm text-primary mt-2">5-min breaks today: <span className="font-bold">{counts.fiveMin}</span></div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {showTimeInput && selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="wellness-card text-center"
        >
          {renderTimeInput()}
          <motion.button
            onClick={handleSetReminder}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`wellness-button-primary text-lg px-8 py-4 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      )}

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