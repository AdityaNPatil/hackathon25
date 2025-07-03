import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Coffee, 
  MessageCircle, 
  TrendingUp, 
  Target, 
  Calendar,
  Activity,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, leaderboard, fetchLeaderboard, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Live clock - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      title: 'Daily Check-in',
      description: 'Share how you\'re feeling',
      icon: Heart,
      color: 'bg-gradient-to-tr from-accent to-primary',
      href: '/checkin',
      points: '+10'
    },
    {
      title: 'Meditation',
      description: 'Take a mindful break',
      icon: Coffee,
      color: 'bg-gradient-to-tr from-calm to-focus',
      href: '/meditation',
      points: '+15'
    },
    {
      title: 'Break Reminder',
      description: 'Set healthy reminders',
      icon: Clock,
      color: 'bg-gradient-to-tr from-energy to-accent',
      href: '/breaks',
      points: '+5'
    },
    {
      title: 'Chat with Buddy',
      description: 'Get wellness advice',
      icon: MessageCircle,
      color: 'bg-gradient-to-tr from-primary to-calm',
      href: '/chat',
      points: '+3'
    }
  ];

  const wellnessTips = [
    "Take a 5-minute breathing break every hour",
    "Stay hydrated - drink water regularly",
    "Practice gratitude - write down 3 things you're thankful for",
    "Move your body - even a short walk helps",
    "Connect with colleagues - social interaction boosts mood"
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Helper to show demo numbers if user has zero stats
  const stats = {
    total_points: typeof user?.total_points === 'number' ? user.total_points : 120,
    checkins: typeof user?.checkins === 'number' ? user.checkins : 8,
    meditations: typeof user?.meditations === 'number' ? user.meditations : 5,
    breaks: typeof user?.breaks === 'number' ? user.breaks : 12,
  };

  return (
    <div className="flex flex-col items-center space-y-8 px-2 sm:px-4 md:px-8 lg:px-12 w-full">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="wellness-card w-full flex justify-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-3xl">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
              {getGreeting()}, {user?.username}! 👋
            </h1>
            <p className="text-neutral-600">
              Welcome to your employee wellness dashboard. Your participation helps your team thrive!
            </p>
          </div>
          <div className="text-center md:text-right flex-1">
            <div className="text-2xl font-mono text-primary">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-neutral-500">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Wellness Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="wellness-card flex flex-col md:flex-row items-center justify-center gap-6 w-full my-6">
        <div className="text-center flex-1">
          <h2 className="text-xl font-display font-semibold text-neutral-900 mb-1">Team Wellness Score</h2>
          <div className="text-3xl font-bold text-primary mb-1">{leaderboard?.length ? leaderboard.reduce((acc, u) => acc + (u.points || 0), 0) : 420}</div>
          <div className="text-sm text-neutral-500">Total points earned by your team</div>
        </div>
        <div className="text-center flex-1">
          <h2 className="text-xl font-display font-semibold text-neutral-900 mb-1">Your Contribution</h2>
          <div className="text-3xl font-bold text-accent mb-1">{stats.total_points}</div>
          <div className="text-sm text-neutral-500">Your personal points</div>
        </div>
      </motion.div>

      {/* Shoutouts Section (placeholder) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="wellness-card w-full my-6 text-center flex justify-center">
        <div className="max-w-2xl w-full">
          <h2 className="text-xl font-display font-semibold text-neutral-900 mb-4">Team Shoutouts</h2>
          <div className="text-neutral-500">No shoutouts yet. Encourage your colleagues by sending a positive note!</div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Points', value: stats.total_points, icon: Target, color: 'text-trophy' },
          { label: 'Check-ins', value: stats.checkins, icon: Heart, color: 'text-heart' },
          { label: 'Meditations', value: stats.meditations, icon: Coffee, color: 'text-meditation' },
          { label: 'Breaks Taken', value: stats.breaks, icon: Activity, color: 'text-activity' },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.1 }} className="wellness-card text-center">
            <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
            <div className="text-sm text-neutral-600">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-2xl font-display font-semibold text-neutral-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.href)}
              className="wellness-card cursor-pointer group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">{action.title}</h3>
              <p className="text-sm text-neutral-600 mb-3">{action.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">{action.points} points</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaderboard Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="wellness-card">
          <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6">Leaderboard Preview</h2>
          <div className="space-y-2">
            {leaderboard && leaderboard.length > 0 ? leaderboard.slice(0, 5).map((entry, idx) => (
              <div key={entry.username} className={`flex items-center justify-between p-2 rounded-xl ${entry.username === user?.username ? 'bg-secondary font-bold' : ''}`}>
                <span>{idx + 1}. {entry.username}</span>
                <span className="text-primary">{entry.points} pts</span>
              </div>
            )) : <div className="text-neutral-500">No leaderboard data yet.</div>}
          </div>
        </motion.div>

        {/* Wellness Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="wellness-card">
          <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6">Today's Wellness Tips</h2>
          <div className="space-y-4">
            {wellnessTips.map((tip, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.1 }} className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-energy mt-0.5 flex-shrink-0" />
                <p className="text-sm text-neutral-700">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Motivation Quote */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="wellness-card text-center bg-gradient-to-r from-primary to-accent text-white">
        <TrendingUp className="w-8 h-8 mx-auto mb-4" />
        <blockquote className="text-lg font-medium mb-2">
          "Every step you take towards wellness is a step towards a better version of yourself."
        </blockquote>
        <p className="text-white/80">Keep going, you're doing great! 💪</p>
      </motion.div>
    </div>
  );
};

export default Dashboard; 