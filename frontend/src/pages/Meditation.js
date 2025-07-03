import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Play, Pause, Timer, Heart, Sparkles, CheckCircle, Volume2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const mindfulnessQuotesFallback = [
  "In the stillness of the present moment, we discover that much of our suffering arises not from what is, but from our resistance to it. When we stop struggling against what already is, we find peace not because everything has changed, but because we have changed our relationship to it.",
  "Mindfulness is not about getting anywhere else. It's about allowing ourselves to be exactly where we are, completely. It's in this radical acceptance of the now — no matter how chaotic or mundane — that we find the doorway to calm, clarity, and compassion.",
  "The present moment is a place of profound healing, not because it fixes our problems, but because it shows us that beneath the noise of fear, worry, and regret lies an untouched stillness, waiting patiently for us to return home to ourselves.",
  "We spend so much time trying to fix the external world, forgetting that the deepest peace comes not from changing the waves, but from learning to surf them with awareness, grace, and trust in the rhythm of life.",
  "When you let go of what you think your life is supposed to look like and gently open to what is, you meet a profound serenity — one that doesn't depend on outcomes but blossoms from acceptance, patience, and the courage to be present.",
  "True mindfulness is not the absence of thoughts or emotions, but the quiet, steady attention that watches them arise and pass — like clouds across a vast sky — without grasping, without pushing away. In that watching, there is a gentle freedom.",
  "Relaxation is not a luxury; it is a doorway to truth. When the body is still, the mind settles, and we begin to remember that life is not something to be controlled, but something to be experienced with reverence and presence.",
  "You are not your thoughts, not your emotions, not your past. You are the awareness behind it all — spacious, calm, and infinite. Mindfulness is the art of returning to that awareness, again and again, until the illusion of separation dissolves.",
  "Each breath is an invitation to return: to return to now, to return to simplicity, to return to the miracle of being alive. No need to fix anything. Just breathe, and in that breath, find the wholeness you thought was missing.",
  "Let today be a day where doing less leads to feeling more. When you step out of the rush and into presence, you don't lose time — you find yourself. And that is the real beginning of peace."
];

const relaxationTechniquesFallback = [
  "Progressive muscle relaxation: tense and release each muscle group.",
  "Visualization: imagine a peaceful place.",
  "Box breathing: inhale 4, hold 4, exhale 4, hold 4.",
  "Body scan: notice sensations from head to toe.",
  "Gentle stretching: roll your shoulders, stretch your neck."
];

const MIN_QUOTE_TIME = 15; // seconds per quote for audio

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
        <span className="text-2xl text-calm font-bold">
          {phase === 'inhale' ? 'Inhale...' : 'Exhale...'}
        </span>
      </motion.div>
      <div className="mt-6 text-lg text-neutral-700">
        Cycle {cycle + 1} of {totalCycles}
      </div>
    </div>
  );
};

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const MindfulnessQuotes = ({ duration, quotes, onEnd }) => {
  // Each quote lasts 30s, show as many as fit in duration
  const maxQuotes = Math.max(1, Math.ceil((duration * 60) / 30));
  const [displayQuotes, setDisplayQuotes] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef();
  const totalQuotes = displayQuotes.length;

  useEffect(() => {
    // Shuffle and pick quotes on mount/start
    const cleanedQuotes = quotes.map(q => q.replace(/^\*+|\*+$/g, '').trim());
    const shuffled = shuffleArray(cleanedQuotes).slice(0, maxQuotes);
    setDisplayQuotes(shuffled);
    setQuoteIndex(0);
    setElapsed(0);
    // eslint-disable-next-line
  }, [duration, quotes]);

  useEffect(() => {
    if (displayQuotes.length === 0) return;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [displayQuotes]);

  useEffect(() => {
    if (displayQuotes.length === 0) return;
    // Advance quote every 30s
    if (elapsed > 0 && elapsed % 30 === 0 && quoteIndex < totalQuotes - 1) {
      setQuoteIndex((prev) => prev + 1);
    }
    // End session after duration
    if (elapsed >= duration * 60) {
      clearInterval(intervalRef.current);
      onEnd();
    }
  }, [elapsed, duration, quoteIndex, totalQuotes, onEnd, displayQuotes]);

  const speakQuote = (quote) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(quote);
      window.speechSynthesis.speak(utter);
    }
  };

  if (displayQuotes.length === 0) return null;

  // Time left for current quote
  const quoteElapsed = elapsed % 30;
  const quoteTimeLeft = Math.max(0, 30 - quoteElapsed);

  return (
    <div className="flex flex-col items-center justify-center h-72">
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-calm text-center bg-white rounded-xl shadow-lg p-6 border border-calm-200 mb-4"
        >
          {displayQuotes[quoteIndex]}
        </motion.div>
      </AnimatePresence>
      <button
        onClick={() => speakQuote(displayQuotes[quoteIndex])}
        className="mt-4 wellness-button-secondary flex items-center"
      >
        <Volume2 className="w-5 h-5 mr-2" /> Repeat with me
      </button>
      <div className="mt-6 text-lg text-neutral-700">
        Quote {quoteIndex + 1} of {totalQuotes}
      </div>
      <div className="mt-2 text-sm text-neutral-500">
        {Math.max(0, duration * 60 - elapsed)} seconds left || {quoteTimeLeft} seconds for this quote
      </div>
    </div>
  );
};

// Relaxation technique explanations and visuals (fallback)
const relaxationDetailsFallback = [
  {
    title: "Progressive Muscle Relaxation",
    explanation: "Tense each muscle group for 5 seconds, then release. Start from your toes and move up to your head. Notice the difference between tension and relaxation.",
    visual: <span role="img" aria-label="muscle" className="text-5xl">💪</span>
  },
  {
    title: "Visualization",
    explanation: "Close your eyes and imagine a peaceful place, like a beach or forest. Engage all your senses: what do you see, hear, smell, and feel? Stay in this scene for a few minutes.",
    visual: <span role="img" aria-label="beach" className="text-5xl">🏖️</span>
  },
  {
    title: "Box Breathing",
    explanation: "Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat this cycle several times. This helps calm your nervous system.",
    visual: <span role="img" aria-label="box" className="text-5xl">🟦</span>
  },
  {
    title: "Body Scan",
    explanation: "Bring your attention to each part of your body, starting from your toes and moving up. Notice any sensations, tension, or relaxation. Just observe without judgment.",
    visual: <span role="img" aria-label="body" className="text-5xl">🧘‍♂️</span>
  },
  {
    title: "Gentle Stretching",
    explanation: "Do slow, gentle stretches: roll your shoulders, stretch your neck, reach for the sky. Move within your comfort zone and notice how your body feels.",
    visual: <span role="img" aria-label="stretch" className="text-5xl">🤸‍♂️</span>
  }
];

const RelaxationTechniques = ({ techniques }) => {
  // Only shuffle/select techniques once per session
  const details = useMemo(() => {
    if (Array.isArray(techniques) && techniques.length >= 2) {
      if (typeof techniques[0] === 'object' && techniques[0].title) {
        return shuffleArray(techniques).slice(0, 2);
      } else {
        return shuffleArray(relaxationDetailsFallback).slice(0, 2);
      }
    } else {
      return shuffleArray(relaxationDetailsFallback).slice(0, 2);
    }
  }, [techniques]);

  const [techIndex, setTechIndex] = useState(0);
  const current = details[techIndex];

  return (
    <div className="wellness-card bg-secondary border-calm text-center flex flex-col items-center">
      <div className="mb-2">{current.visual}</div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{current.title}</h3>
      <p className="text-neutral-700 mb-4 max-w-xl mx-auto">{current.explanation}</p>
      <div className="flex justify-center space-x-4 mt-2">
        <button
          className="wellness-button-secondary px-4 py-2"
          onClick={() => setTechIndex((i) => Math.max(0, i - 1))}
          disabled={techIndex === 0}
        >
          Previous
        </button>
        <button
          className="wellness-button-secondary px-4 py-2"
          onClick={() => setTechIndex((i) => Math.min(details.length - 1, i + 1))}
          disabled={techIndex === details.length - 1}
        >
          Next
        </button>
      </div>
      <div className="mt-2 text-sm text-neutral-500">
        Technique {techIndex + 1} of {details.length}
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
  const [mindfulnessQuotes, setMindfulnessQuotes] = useState(mindfulnessQuotesFallback);
  const [relaxationTechniques, setRelaxationTechniques] = useState(relaxationTechniquesFallback);
  const [error, setError] = useState(null);

  const sessionTypes = [
    { id: 'Guided Breathing', label: 'Guided Breathing', icon: Heart, color: 'bg-gradient-to-tr from-calm to-focus' },
    { id: 'Mindfulness', label: 'Mindfulness', icon: Brain, color: 'bg-gradient-to-tr from-primary to-accent' },
    { id: 'Relaxation', label: 'Relaxation', icon: Timer, color: 'bg-gradient-to-tr from-energy to-accent' }
  ];

  const handleStart = async () => {
    setIsActive(true);
    setSessionComplete(false);
    setAiResponse('');
    setError(null);
    // For Mindfulness, fetch quotes from backend
    if (selectedType?.id === 'Mindfulness') {
      try {
        const res = await fetch('http://localhost:6081/api/mindfulness_quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user?.user_id || 1, session_type: 'Mindfulness', duration })
        });
        if (!res.ok) throw new Error('Failed to fetch mindfulness quotes');
        const data = await res.json();
        if (Array.isArray(data.ai_response)) {
          setMindfulnessQuotes(data.ai_response);
        } else if (typeof data.ai_response === 'string') {
          // Try to parse as bullet points/numbered list
          const lines = data.ai_response.split(/\n|\r/).map(l => l.trim()).filter(Boolean);
          const quotes = lines.map(l => l.replace(/^\d+\.|^-|•/, '').trim()).filter(Boolean);
          setMindfulnessQuotes(quotes.length > 0 ? quotes : mindfulnessQuotesFallback);
        } else {
          setMindfulnessQuotes(mindfulnessQuotesFallback);
        }
      } catch (e) {
        setError('Could not load mindfulness quotes. Showing fallback.');
        setMindfulnessQuotes(mindfulnessQuotesFallback);
      }
    }
  };

  const handleEnd = async () => {
    setIsActive(false);
    setSessionComplete(true);
    // Fetch backend data for session summary
    const data = await meditate(selectedType.label, duration);
    if (selectedType.id === 'Guided Breathing') {
      setAiResponse(data?.ai_response || 'Great job! Deep breathing calms the mind and body.');
    } else if (selectedType.id === 'Relaxation') {
      // Always use backend ai_response for relaxation techniques
      if (data && data.ai_response) {
        try {
          const backendTechniques = JSON.parse(data.ai_response);
          if (Array.isArray(backendTechniques) && backendTechniques.length > 0) {
            setRelaxationTechniques(backendTechniques.map(t => t.replace(/^\*+|\*+$/g, '').trim()));
            setAiResponse('Relaxation is key to wellness. Keep it up!');
            return;
          }
        } catch (e) {
          // Parsing failed, fallback
        }
      }
      setRelaxationTechniques(relaxationTechniquesFallback);
      setAiResponse('Relaxation is key to wellness. Keep it up!');
    } else if (selectedType.id === 'Mindfulness') {
      setAiResponse('Mindfulness helps you stay present. Well done!');
    }
  };

  // Render session content
  let sessionContent = null;
  if (isActive && selectedType?.id === 'Guided Breathing') {
    sessionContent = <BreathingAnimation duration={duration} onEnd={handleEnd} />;
  } else if (isActive && selectedType?.id === 'Mindfulness') {
    sessionContent = <MindfulnessQuotes duration={duration} quotes={mindfulnessQuotes} onEnd={handleEnd} />;
  } else if (isActive && selectedType?.id === 'Relaxation') {
    sessionContent = <RelaxationTechniques techniques={relaxationTechniques} />;
  }

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
          {sessionContent}
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
          {/* <p className="text-neutral-700 mb-2">{aiResponse}</p> */}
          <button onClick={() => setSessionComplete(false)} className="wellness-button-primary mt-2">Start Another Session</button>
        </motion.div>
      )}
    </div>
  );
};

export default Meditation; 