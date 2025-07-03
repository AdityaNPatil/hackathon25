import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { leaderboard, user, fetchLeaderboard, loading } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-calm-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Team Leaderboard</h1>
        <p className="text-lg text-neutral-600">See how you and your colleagues are supporting team wellness</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="wellness-card p-0 overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {loading ? (
            <div className="p-6 text-center text-neutral-500">Loading...</div>
          ) : leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((entry, idx) => (
              <div key={entry.username} className={`flex items-center justify-between px-6 py-4 ${entry.username === user?.username ? 'bg-secondary font-bold' : ''}`}>
                <div className="flex items-center space-x-4">
                  <span className={`text-xl font-mono w-8 text-center ${idx < 3 ? 'text-primary' : 'text-neutral-400'}`}>{idx + 1}</span>
                  <User className="w-6 h-6 text-neutral-400" />
                  <span className="text-neutral-900">{entry.username}{entry.username === user?.username ? ' (You)' : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                              <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">{entry.points} pts</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-neutral-500">No leaderboard data yet.</div>
          )}
        </div>
      </motion.div>

      {user && leaderboard && leaderboard.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="wellness-card text-center">
          <h2 className="text-xl font-display font-semibold text-neutral-900 mb-2">Your Rank</h2>
          {(() => {
            const rank = leaderboard.findIndex(e => e.username === user.username) + 1;
            if (rank > 0) {
              return <div className="text-2xl font-bold text-primary">#{rank}</div>;
            } else {
              return <div className="text-neutral-500">Not ranked yet.</div>;
            }
          })()}
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard; 