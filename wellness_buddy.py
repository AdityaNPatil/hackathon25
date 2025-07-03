import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, date
from typing import Dict, List, Optional
import config
from database import WellnessDatabase
from deepseek_api import DeepSeekAPI

class WellnessBuddy:
    def __init__(self):
        self.db = WellnessDatabase()
        self.api = DeepSeekAPI()
        self.setup_session_state()
    
    def setup_session_state(self):
        """Initialize session state variables"""
        if 'user_id' not in st.session_state:
            st.session_state.user_id = None
        if 'username' not in st.session_state:
            st.session_state.username = None
        if 'chat_history' not in st.session_state:
            st.session_state.chat_history = []
        if 'current_feature' not in st.session_state:
            st.session_state.current_feature = None
    
    def login_user(self, username: str, email: str = None) -> bool:
        """Login or register a user"""
        try:
            user_id = self.db.add_user(username, email)
            st.session_state.user_id = user_id
            st.session_state.username = username
            return True
        except Exception as e:
            st.error(f"Error logging in: {e}")
            return False
    
    def add_chat_message(self, sender: str, message: str, is_user: bool = True):
        """Add a message to the chat history"""
        st.session_state.chat_history.append({
            'sender': sender,
            'message': message,
            'timestamp': datetime.now(),
            'is_user': is_user
        })
    
    def wellness_checkin(self, mood: str, notes: str = ""):
        """Handle wellness check-in"""
        if not st.session_state.user_id:
            return "Please log in first."
        
        # Add to database
        success = self.db.add_wellness_checkin(st.session_state.user_id, mood, notes)
        
        if success:
            # Get AI response
            ai_response = self.api.get_mood_analysis(mood, notes)
            
            # Add to chat
            self.add_chat_message("You", f"Check-in: {mood} - {notes}")
            self.add_chat_message("Wellness Buddy", ai_response, False)
            
            return f"✅ Check-in recorded! +10 points\n\n{ai_response}"
        else:
            return "❌ Error recording check-in. Please try again."
    
    def break_reminder(self, reminder_type: str):
        """Handle break reminder"""
        if not st.session_state.user_id:
            return "Please log in first."
        
        # Add to database
        success = self.db.add_break_reminder(st.session_state.user_id, reminder_type)
        
        if success:
            # Get AI response
            ai_response = self.api.get_wellness_response(f"break reminder: {reminder_type}")
            
            # Add to chat
            self.add_chat_message("You", f"Break reminder: {reminder_type}")
            self.add_chat_message("Wellness Buddy", ai_response, False)
            
            return f"⏰ Break reminder set! +5 points\n\n{ai_response}"
        else:
            return "❌ Error setting break reminder. Please try again."
    
    def meditation_session(self, session_type: str, duration: int = 5):
        """Handle meditation session"""
        if not st.session_state.user_id:
            return "Please log in first."
        
        # Add to database
        success = self.db.add_meditation_session(st.session_state.user_id, session_type, duration)
        
        if success:
            # Get AI guidance
            guidance = self.api.get_meditation_guidance(session_type)
            
            # Add to chat
            self.add_chat_message("You", f"Meditation: {session_type} ({duration} min)")
            self.add_chat_message("Wellness Buddy", guidance, False)
            
            return f"🧘 Meditation session started! +15 points\n\n{guidance}"
        else:
            return "❌ Error starting meditation session. Please try again."
    
    def chat_with_buddy(self, user_message: str):
        """Handle general chat with Wellness Buddy"""
        if not st.session_state.user_id:
            return "Please log in first."
        
        # Get AI response
        ai_response = self.api.get_wellness_response(user_message)
        
        # Add to chat
        self.add_chat_message("You", user_message)
        self.add_chat_message("Wellness Buddy", ai_response, False)
        
        return ai_response
    
    def get_user_stats(self) -> Dict:
        """Get user statistics"""
        if not st.session_state.user_id:
            return None
        return self.db.get_user_stats(st.session_state.user_id)
    
    def get_leaderboard(self) -> List[Dict]:
        """Get wellness leaderboard"""
        return self.db.get_leaderboard(10)
    
    def create_mood_chart(self, mood_stats: Dict):
        """Create a pie chart for mood distribution"""
        if not mood_stats:
            return None
        
        df = pd.DataFrame(list(mood_stats.items()), columns=['Mood', 'Count'])
        
        fig = px.pie(
            df, 
            values='Count', 
            names='Mood',
            title='Your Mood Distribution',
            color_discrete_map={
                'Happy 😊': '#2E8B57',
                'Neutral 😐': '#FFD700',
                'Stressed 😰': '#DC143C'
            }
        )
        
        fig.update_traces(textposition='inside', textinfo='percent+label')
        return fig
    
    def create_activity_chart(self, stats: Dict):
        """Create a bar chart for activity distribution"""
        activities = ['Check-ins', 'Breaks', 'Meditations']
        counts = [stats.get('checkins', 0), stats.get('breaks', 0), stats.get('meditations', 0)]
        
        fig = px.bar(
            x=activities,
            y=counts,
            title='Your Wellness Activities',
            color=counts,
            color_continuous_scale='Viridis'
        )
        
        fig.update_layout(
            xaxis_title="Activity Type",
            yaxis_title="Count",
            showlegend=False
        )
        
        return fig
    
    def create_leaderboard_chart(self, leaderboard: List[Dict]):
        """Create a horizontal bar chart for leaderboard"""
        if not leaderboard:
            return None
        
        df = pd.DataFrame(leaderboard)
        
        fig = px.bar(
            df,
            x='points',
            y='username',
            orientation='h',
            title='Wellness Leaderboard',
            color='points',
            color_continuous_scale='Viridis'
        )
        
        fig.update_layout(
            xaxis_title="Points",
            yaxis_title="Username",
            showlegend=False
        )
        
        return fig 