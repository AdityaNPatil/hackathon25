import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, Pause, Timer, Heart, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BreathingAnimation = ({ duration, onEnd }) => {
  const [phase, setPhase] = useState('inhale');
  const [cycle, setCycle] = useState(0);
  const totalCycles = duration;

  React.useEffect(() => {
    if (cycle >= totalCycles) {
      onEnd();
      return;
    }
    const timer = setTimeout(() => {
      setPhase(phase === 'inhale' ? 'exhale' : 'inhale');
      if (phase === 'exhale') setCycle(cycle + 1);
    }, 4000);
    return () => clearTimeout(timer);
  }, [phase, cycle, totalCycles, onEnd]);

  return (
    <div className="flex flex-col items-center justify-center h-72">
      <motion.div
        animate={{ scale: phase === 'inhale' ? 1.3 : 0.7 }}
        transition={{ duration: 4, ease: 'easeInOut' }}
        className="w-40 h-40 rounded-full bg-gradient-to-tr from-calm-300 to-meditation-400 flex items-center justify-center shadow-lg"
      >
        <span className="text-2xl text-white font-bold">
          {phase === 'inhale' ? 'Inhale...' : 'Exhale...'}
        </span>
      </motion.div>
      <div className="mt-6 text-lg text-neutral-700">
        Cycle {cycle + 1} of {totalCycles}
      </div>
    </div>
  );
};

const Meditation = () => {
  const { user, meditate, loading } = useAuth();
  const [selectedType, setSelectedType] = useState(null);
  const [duration, setDuration] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const sessionTypes = [
    { id: 'Guided Breathing', label: 'Guided Breathing', icon: Heart, color: 'bg-gradient-to-tr from-calm to-focus' },
    { id: 'Mindfulness', label: 'Mindfulness', icon: Brain, color: 'bg-gradient-to-tr from-primary to-accent' },
          { id: 'Relaxation', label: 'Relaxation', icon: Timer, color: 'bg-gradient-to-tr from-energy to-accent' }
  ];

  const handleStart = async () => {
    setIsActive(true);
    setSessionComplete(false);
    setAiResponse('');
  };

  const handleEnd = async () => {
    setIsActive(false);
    setSessionComplete(true);
    const data = await meditate(selectedType.label, duration);
    if (data) {
      if (selectedType.id === 'Guided Breathing') setAiResponse('Great job! Deep breathing calms the mind and body.');
      if (selectedType.id === 'Mindfulness') setAiResponse('Mindfulness helps you stay present. Well done!');
      if (selectedType.id === 'Relaxation') setAiResponse('Relaxation is key to wellness. Keep it up!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-calm to-focus rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Mindfulness & Meditation</h1>
        <p className="text-lg text-neutral-600">Take a moment to center yourself and find peace</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="wellness-card">
        <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6">Choose your session</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessionTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type)}
              className={`wellness-card cursor-pointer transition-all duration-300 ${selectedType?.id === type.id ? 'ring-2 ring-meditation-400 shadow-large' : 'hover:shadow-medium'}`}
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="wellness-card">
        <h2 className="text-xl font-display font-semibold text-neutral-900 mb-4">Session Duration</h2>
        <input
          type="range"
          min="1"
          max="30"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full"
          disabled={isActive}
        />
        <div className="text-center mt-2">
          <span className="text-lg font-medium text-neutral-900">{duration} minutes</span>
        </div>
      </motion.div>

      {isActive && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <BreathingAnimation duration={duration} onEnd={handleEnd} />
          <div className="text-center mt-6">
            <button onClick={handleEnd} className="wellness-button-primary px-8 py-3 text-lg">
              <Pause className="w-5 h-5 inline-block mr-2" /> End Session
            </button>
          </div>
        </motion.div>
      )}

      {!isActive && !sessionComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
          <motion.button
            onClick={handleStart}
            disabled={!selectedType || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`wellness-button-primary text-lg px-8 py-4 ${!selectedType || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {(isActive || loading) ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Meditating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Start Meditation (+15 points)</span>
              </div>
            )}
          </motion.button>
        </motion.div>
      )}

      {sessionComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="wellness-card bg-secondary border-calm text-center">
          <CheckCircle className="w-10 h-10 text-calm mx-auto mb-2" />
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">Session Complete!</h3>
          <p className="text-neutral-700 mb-2">{aiResponse}</p>
          <button onClick={() => setSessionComplete(false)} className="wellness-button-primary mt-2">Start Another Session</button>
        </motion.div>
      )}
    </div>
  );
};

export default Meditation; 