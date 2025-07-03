import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, Brain, Heart, Zap, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user, chatWithBuddy, getAIInsights } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatType, setChatType] = useState('general');

  // Test DeepSeek API connectivity on component mount
  React.useEffect(() => {
    const testDeepSeekAPI = async () => {
      try {
        console.log('🧠 Testing DeepSeek API connectivity...');
        const response = await fetch('http://localhost:6081/api/health');
        const data = await response.json();
        console.log('🚀 DeepSeek API Status:', data);
        
        if (response.ok && data.status === 'healthy') {
          toast.success('🤖 DeepSeek AI is ready to chat!');
        } else {
          toast.warning('⚠️ DeepSeek AI is in fallback mode');
        }
      } catch (error) {
        console.error('❌ DeepSeek API test failed:', error);
        toast.error('🔧 Backend connection issue');
      }
    };
    testDeepSeekAPI();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { 
      type: 'user', 
      text: message, 
      time: new Date(),
      chatType: chatType
    };
    setChatHistory(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      console.log('🤖 Sending to DeepSeek AI:', { message: currentMessage, type: chatType });
      
      // Send to enhanced DeepSeek API
      const data = await chatWithBuddy(currentMessage, chatType);
      console.log('🧠 DeepSeek AI Response:', data);
      
      if (data && data.ai_message) {
        const aiResponse = {
          type: 'ai',
          text: data.ai_message,
          time: new Date(),
          responseType: data.response_type,
          confidence: data.confidence_score,
          suggestions: data.suggested_actions || [],
          wellnessTips: data.wellness_tips || [],
          pointsEarned: data.points_earned || 0
        };
        setChatHistory(prev => [...prev, aiResponse]);
        
        // Show success message with points
        if (data.points_earned > 0) {
          toast.success(`🎯 +${data.points_earned} wellness points earned!`);
        }
        
        console.log('✅ DeepSeek AI response displayed successfully');
      } else {
        console.log('⚠️ No AI response, using fallback');
        addFallbackResponse();
      }
    } catch (error) {
      console.error('❌ DeepSeek chat error:', error);
      addFallbackResponse();
    } finally {
      setIsTyping(false);
    }
  };

  const addFallbackResponse = () => {
    const fallbackResponse = {
      type: 'ai',
      text: "I'm experiencing some technical difficulties with my AI brain, but I'm still here for you. Try taking a few deep breaths while I get back online. 🧘‍♀️",
      time: new Date(),
      responseType: 'fallback',
      suggestions: ['Take deep breaths', 'Try a quick stretch', 'Drink some water'],
      wellnessTips: ['Stay hydrated', 'Take breaks regularly'],
      pointsEarned: 3
    };
    setChatHistory(prev => [...prev, fallbackResponse]);
  };

  const getQuickInsight = async (insightType) => {
    setIsTyping(true);
    try {
      const data = await getAIInsights(insightType);
      if (data && data.ai_insight) {
        const insightMessage = {
          type: 'ai',
          text: `💡 ${data.ai_insight}`,
          time: new Date(),
          responseType: 'insight',
          isInsight: true
        };
        setChatHistory(prev => [...prev, insightMessage]);
        toast.success('🔮 AI insight generated!');
      }
    } catch (error) {
      console.error('Insight error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const chatTypes = [
    { value: 'general', label: '💬 General', icon: MessageCircle },
    { value: 'wellness', label: '🧘‍♀️ Wellness', icon: Heart },
    { value: 'stress', label: '😰 Stress Help', icon: Zap },
    { value: 'meditation', label: '🧘‍♂️ Meditation', icon: Brain },
    { value: 'motivation', label: '⚡ Motivation', icon: Star }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-primary via-accent to-calm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-display font-bold text-neutral-900 mb-3">
          🤖 DeepSeek AI Wellness Buddy
        </h1>
        <p className="text-lg text-neutral-600 mb-4">
          Powered by advanced AI for personalized wellness support
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-neutral-500">
          <span className="flex items-center"><Sparkles className="w-4 h-4 mr-1" /> AI-Powered</span>
          <span className="flex items-center"><Heart className="w-4 h-4 mr-1" /> Wellness-Focused</span>
          <span className="flex items-center"><Brain className="w-4 h-4 mr-1" /> DeepSeek Integration</span>
        </div>
      </motion.div>

      {/* Chat Type Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="wellness-card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">🎯 Choose Your Chat Focus</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {chatTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setChatType(type.value)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                chatType === type.value
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <type.icon className="w-4 h-4 mx-auto mb-1" />
              {type.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Quick AI Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="wellness-card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">🔮 Quick AI Insights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: 'daily_insight', label: '📅 Daily Insight', color: 'from-blue-500 to-blue-600' },
            { type: 'mood_trend', label: '📈 Mood Trends', color: 'from-green-500 to-green-600' },
            { type: 'wellness_tips', label: '💡 Wellness Tips', color: 'from-purple-500 to-purple-600' },
            { type: 'motivation', label: '⚡ Motivation', color: 'from-orange-500 to-orange-600' }
          ].map((insight) => (
            <button
              key={insight.type}
              onClick={() => getQuickInsight(insight.type)}
              disabled={isTyping}
              className={`p-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${insight.color} hover:shadow-lg transition-all disabled:opacity-50`}
            >
              {insight.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chat Interface */}
      <div className="wellness-card flex flex-col h-[600px]">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h3 className="text-lg font-semibold text-neutral-900">
            🤖 AI Chat - {chatTypes.find(t => t.value === chatType)?.label}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-neutral-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>DeepSeek AI Active</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center text-neutral-500 mt-8">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h4 className="text-lg font-semibold mb-2">Start Your AI Wellness Journey!</h4>
              <p className="mb-4">I'm powered by DeepSeek AI and ready to provide personalized wellness support.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                {[
                  "How are you feeling today?",
                  "I'm feeling stressed at work",
                  "Can you help me with meditation?",
                  "I need motivation to stay healthy"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(suggestion)}
                    className="p-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {chatHistory.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-r from-primary to-accent text-white p-4 rounded-2xl rounded-br-sm' 
                  : 'bg-white border border-neutral-200 p-4 rounded-2xl rounded-bl-sm shadow-sm'
              }`}>
                {msg.type === 'ai' && (
                  <div className="flex items-center mb-2">
                    <Brain className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-xs font-medium text-primary">DeepSeek AI</span>
                    {msg.confidence && (
                      <span className="text-xs text-neutral-500 ml-2">
                        {Math.round(msg.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                )}
                
                <p className={`text-sm ${msg.type === 'user' ? 'text-white' : 'text-neutral-900'}`}>
                  {msg.text}
                </p>
                
                {msg.type === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-xs font-medium text-neutral-600 mb-2">💡 Suggested Actions:</p>
                    <div className="space-y-1">
                      {msg.suggestions.slice(0, 2).map((suggestion, idx) => (
                        <div key={idx} className="text-xs text-neutral-600 bg-neutral-50 px-2 py-1 rounded">
                          • {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.type === 'ai' && msg.pointsEarned > 0 && (
                  <div className="mt-2 flex items-center text-xs text-green-600">
                    <Star className="w-3 h-3 mr-1" />
                    +{msg.pointsEarned} wellness points
                  </div>
                )}
                
                <p className={`text-xs ${msg.type === 'user' ? 'text-white/70' : 'text-neutral-500'} mt-2`}>
                  {msg.time.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-neutral-200 p-4 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex items-center mb-2">
                  <Brain className="w-4 h-4 mr-2 text-primary animate-pulse" />
                  <span className="text-xs font-medium text-primary">DeepSeek AI is thinking...</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <form className="flex items-center p-4 border-t border-neutral-100" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
          <input
            type="text"
            className="flex-1 wellness-input"
            placeholder={`Ask your AI wellness buddy about ${chatTypes.find(t => t.value === chatType)?.label.toLowerCase()}...`}
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="ml-2 wellness-button-primary px-4 py-2 flex items-center" 
            disabled={isTyping || !message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat; 