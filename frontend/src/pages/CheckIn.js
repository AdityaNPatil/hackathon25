import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Smile, Meh, Frown, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CheckIn = () => {
  const { user, checkIn, loading } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const moods = [
    { id: 'Happy 😊', label: 'Happy 😊', icon: Smile, color: 'bg-gradient-to-tr from-calm to-focus' },
          { id: 'Neutral 😐', label: 'Neutral 😐', icon: Meh, color: 'bg-gradient-to-tr from-energy to-accent' },
    { id: 'Stressed 😰', label: 'Stressed 😰', icon: Frown, color: 'bg-gradient-to-tr from-accent to-energy' }
  ];

  const handleSubmit = async () => {
    if (!selectedMood) return;
    const data = await checkIn(selectedMood.label, notes);
    if (data) {
      // Optionally, show a contextual AI response
      if (selectedMood.id === 'Happy 😊') setAiResponse("That's wonderful! Keep spreading joy!");
      if (selectedMood.id === 'Neutral 😐') setAiResponse("It's okay to feel neutral. Try a quick stretch or deep breath!");
      if (selectedMood.id === 'Stressed 😰') setAiResponse("I hear you. Try a breathing exercise or a short walk. You've got this!");
      setSelectedMood(null);
      setNotes('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">How are you feeling at work today?</h1>
        <p className="text-lg text-neutral-600">Share your mood and help your team support each other</p>
        <div className="mt-2 text-sm text-calm">Your check-in helps your team's overall wellness score!</div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="wellness-card">
        <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6">Choose your mood</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moods.map((mood, index) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMood(mood)}
              className={`wellness-card cursor-pointer transition-all duration-300 ${selectedMood?.id === mood.id ? 'ring-2 ring-wellness-400 shadow-large' : 'hover:shadow-medium'}`}
            >
              <div className={`w-16 h-16 ${mood.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <mood.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-neutral-900">{mood.label}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="wellness-card">
        <h2 className="text-xl font-display font-semibold text-neutral-900 mb-4">Additional Notes (Optional)</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Share more about your day..."
          className="wellness-input min-h-[120px] resize-none"
          rows={4}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
        <motion.button
          onClick={handleSubmit}
          disabled={!selectedMood || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`wellness-button-primary text-lg px-8 py-4 ${!selectedMood || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Recording...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Submit Check-in (+10 points)</span>
            </div>
          )}
        </motion.button>
      </motion.div>

      {aiResponse && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="wellness-card bg-secondary border-primary">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2">Wellness Buddy's Response</h3>
              <p className="text-neutral-700 leading-relaxed">{aiResponse}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CheckIn; 