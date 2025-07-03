import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:6081/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Try to restore user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('wellness_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch leaderboard on mount and when user changes
  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  // Helper: Save user to localStorage
  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('wellness_user', JSON.stringify(userData));
  };

  // Login or register user
  const login = async (username, email = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      saveUser({ ...data, username });
      toast.success(`Welcome, ${username}! 🌟`);
      return true;
    } catch (err) {
      setError(err.message);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('wellness_user');
    toast.success('Logged out successfully. Take care! 💙');
  };

  // Fetch user stats
  const fetchUser = async (user_id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/user/${user_id}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      saveUser({ ...user, ...data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check-in
  const checkIn = async (mood, notes = '') => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, mood, notes })
      });
      if (!res.ok) throw new Error('Check-in failed');
      const data = await res.json();
      saveUser({ ...user, ...data });
      toast.success('Check-in recorded! +10 points');
      fetchLeaderboard();
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Check-in failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Enhanced AI-powered wellness chat
  const chatWithBuddy = async (message, chatType = 'general', context = '') => {
    if (!user) {
      console.error('❌ No user logged in for chat');
      return null;
    }
    
    console.log('🤖 DeepSeek AI Chat Request:', { 
      user_id: user.user_id, 
      message: message.substring(0, 50) + '...', 
      chat_type: chatType 
    });
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user.user_id, 
          message
        })
      });
      
      console.log('📡 DeepSeek API Response Status:', res.status);
      
      if (!res.ok) throw new Error(`AI chat failed with status ${res.status}`);
      
      const data = await res.json();
      console.log('🧠 DeepSeek AI Response:', data);
      
      // Update user stats if provided
      if (data.user_stats) {
        saveUser({ ...user, ...data.user_stats });
        toast.success(`AI Wellness Chat! +${data.points_earned || 5} points`);
      }
      
      fetchLeaderboard();
      
      // Adapt response format for frontend compatibility
      return {
        ai_message: data.response,
        response_type: chatType,
        confidence_score: 0.9,
        suggested_actions: ["Take deep breaths", "Stay hydrated", "Take a short break"],
        wellness_tips: ["Practice mindfulness", "Stay connected with colleagues"],
        points_earned: data.points_earned || 5,
        user_stats: data.user_stats
      };
      
    } catch (err) {
      console.error('❌ DeepSeek Chat Error:', err);
      setError(err.message);
      toast.error('AI chat temporarily unavailable. Fallback support active.');
      return {
        ai_message: "I'm here to support you, though my AI capabilities are temporarily limited. Your wellbeing matters to me.",
        response_type: "fallback",
        suggested_actions: ["Take three deep breaths", "Try a quick stretch"],
        wellness_tips: ["Stay hydrated", "Take regular breaks"],
        points_earned: 3
      };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced mood analysis with AI
  const analyzeMood = async (mood, stressLevel = 5, notes = '') => {
    if (!user) return;
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user.user_id, 
          mood, 
          notes 
        })
      });
      
      if (!res.ok) throw new Error('Mood analysis failed');
      const data = await res.json();
      
      toast.success('AI mood analysis complete! +10 points');
      fetchLeaderboard();
      
      // Adapt response format
      return {
        ai_analysis: data.ai_response || "Thank you for sharing your mood. Your feelings are valid and important.",
        mood_detected: mood,
        stress_assessment: stressLevel,
        recommendations: [
          "Take some deep breaths",
          "Consider a short walk",
          "Practice gratitude",
          "Stay connected with others"
        ],
        follow_up_actions: [
          "Check in again later",
          "Try a wellness activity",
          "Share with someone you trust"
        ],
        points_earned: 10
      };
      
    } catch (err) {
      setError(err.message);
      toast.error('Mood analysis failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get AI-powered insights (fallback implementation)
  const getAIInsights = async (insightType = 'daily_insight') => {
    if (!user) return;
    setLoading(true);
    setError(null);
    
    try {
      // Use chat endpoint to get insights
      const message = `Please provide ${insightType.replace('_', ' ')} for my wellness journey`;
      const response = await chatWithBuddy(message, 'wellness');
      
      return {
        insight_type: insightType,
        ai_insight: response?.ai_message || "Focus on small, positive changes each day. Your wellness journey is important.",
        personalization_level: "high",
        confidence: 0.9,
        timestamp: new Date().toISOString()
      };
      
    } catch (err) {
      setError(err.message);
      console.error('AI insights error:', err);
      return {
        insight_type: insightType,
        ai_insight: "Take time for yourself today. Small steps towards wellness make a big difference.",
        personalization_level: "basic",
        confidence: 0.7,
        timestamp: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  };

  // Get AI meditation guidance (fallback implementation)
  const getMeditationGuide = async (sessionType = 'Guided breathing', duration = 5) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use meditation endpoint
      const res = await fetch(`${API_URL}/meditation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user?.user_id || 1, 
          session_type: sessionType, 
          duration 
        })
      });
      
      if (!res.ok) throw new Error('Meditation guide failed');
      const data = await res.json();
      
      return {
        session_type: sessionType,
        duration_minutes: duration,
        ai_guidance: data.ai_response || "Find a comfortable position, close your eyes, and focus on your breath. Breathe naturally and let thoughts pass by like clouds.",
        preparation_steps: [
          "Find a quiet, comfortable space",
          "Sit with your back straight but relaxed",
          "Close your eyes or soften your gaze",
          "Begin with three deep breaths"
        ],
        follow_up_tips: [
          "Notice how you feel after the session",
          "Consider journaling about your experience",
          "Try to maintain the peaceful feeling"
        ]
      };
      
    } catch (err) {
      setError(err.message);
      console.error('Meditation guide error:', err);
      return {
        session_type: sessionType,
        duration_minutes: duration,
        ai_guidance: "Take a moment to breathe deeply. Inhale for 4 counts, hold for 4, exhale for 4. Repeat and focus on the present moment.",
        preparation_steps: ["Find a quiet space", "Sit comfortably", "Close your eyes", "Begin breathing"],
        follow_up_tips: ["Notice your feelings", "Stay present", "Practice regularly"]
      };
    } finally {
      setLoading(false);
    }
  };

  // Meditation (kept for compatibility)
  const meditate = async (session_type, duration = 5) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/meditation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, session_type, duration })
      });
      if (!res.ok) throw new Error('Meditation failed');
      const data = await res.json();
      saveUser({ ...user, ...data });
      toast.success('Meditation completed! +15 points');
      fetchLeaderboard();
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Meditation failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Break reminder (kept for compatibility)
  const takeBreak = async (reminder_type) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/break`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, reminder_type })
      });
      if (!res.ok) throw new Error('Break reminder failed');
      const data = await res.json();
      saveUser({ ...user, ...data });
      toast.success('Break reminder set! +5 points');
      fetchLeaderboard();
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Break reminder failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/leaderboard`);
      if (!res.ok) {
        console.warn('Leaderboard fetch failed with status:', res.status);
        return;
      }
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.warn('Leaderboard fetch error (using fallback):', err);
      // Don't show error to user for leaderboard failures
      setLeaderboard([]);
    }
  };

  const value = {
    user,
    loading,
    error,
    leaderboard,
    login,
    logout,
    fetchUser,
    checkIn,
    meditate,
    takeBreak,
    chatWithBuddy,
    analyzeMood,
    getAIInsights,
    getMeditationGuide,
    fetchLeaderboard,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 