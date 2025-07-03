import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Activity, Heart, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Points', value: user?.total_points || 0, icon: Target, color: 'text-primary' },
    { label: 'Check-ins', value: user?.checkins || 0, icon: Heart, color: 'text-accent' },
    { label: 'Meditations', value: user?.meditations || 0, icon: Coffee, color: 'text-calm' },
          { label: 'Breaks', value: user?.breaks || 0, icon: Activity, color: 'text-energy' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-tr from-calm to-focus rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Your Wellness Analytics
        </h1>
        <p className="text-lg text-neutral-600">
          Track your wellness journey with detailed insights
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="wellness-card text-center"
          >
            <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
            <div className="text-sm text-neutral-600">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="wellness-card"
        >
          <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6">
            Activity Overview
          </h2>
          <div className="space-y-4">
            {[
                    { label: 'Check-ins', value: user?.checkins || 0, color: 'bg-accent' },
      { label: 'Meditations', value: user?.meditations || 0, color: 'bg-calm' },
                              { label: 'Breaks', value: user?.breaks || 0, color: 'bg-energy' },
            ].map((activity, index) => (
              <div key={activity.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">{activity.label}</span>
                  <span className="font-medium">{activity.value}</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${activity.color}`}
                    style={{ width: `${Math.min((activity.value / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="wellness-card"
        >
          <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6">
            Wellness Insights
          </h2>
          <div className="space-y-4">
            {[
              "You're building great wellness habits!",
              "Regular check-ins help track your emotional patterns",
              "Meditation sessions improve focus and reduce stress",
              "Taking breaks prevents burnout and boosts productivity"
            ].map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-neutral-700">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 