import streamlit as st
import pandas as pd
from datetime import datetime
import config
from wellness_buddy import WellnessBuddy

# Page configuration
st.set_page_config(
    page_title="Wellness Buddy",
    page_icon="🧘‍♀️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .feature-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
        border-left: 4px solid #667eea;
    }
    
    .chat-message {
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
    }
    
    .user-message {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
    }
    
    .bot-message {
        background: #f3e5f5;
        border-left: 4px solid #9c27b0;
    }
    
    .stats-card {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    
    .points-display {
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Initialize Wellness Buddy
    buddy = WellnessBuddy()
    
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🧘‍♀️ Wellness Buddy</h1>
        <p>Your AI-powered workplace wellness companion</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar for login and navigation
    with st.sidebar:
        st.header("👤 User Profile")
        
        # Login section
        if not st.session_state.user_id:
            st.subheader("Login to Wellness Buddy")
            username = st.text_input("Username", key="login_username")
            email = st.text_input("Email (optional)", key="login_email")
            
            if st.button("Login / Register", type="primary"):
                if username:
                    if buddy.login_user(username, email):
                        st.success(f"Welcome, {username}! 🎉")
                        st.rerun()
                else:
                    st.error("Please enter a username")
        else:
            st.success(f"Welcome back, {st.session_state.username}! 👋")
            
            # User stats in sidebar
            stats = buddy.get_user_stats()
            if stats:
                st.subheader("Your Stats")
                st.metric("Total Points", stats['total_points'])
                st.metric("Check-ins", stats['checkins'])
                st.metric("Breaks", stats['breaks'])
                st.metric("Meditations", stats['meditations'])
            
            if st.button("Logout"):
                st.session_state.user_id = None
                st.session_state.username = None
                st.session_state.chat_history = []
                st.rerun()
        
        st.divider()
        
        # Navigation
        st.header("🧭 Navigation")
        page = st.selectbox(
            "Choose a feature",
            ["🏠 Dashboard", "💬 Chat with Buddy", "📊 Wellness Check-in", "⏰ Break Reminders", 
             "🧘‍♀️ Meditation", "🏆 Leaderboard", "📈 Analytics"]
        )
    
    # Main content area
    if page == "🏠 Dashboard":
        show_dashboard(buddy)
    elif page == "💬 Chat with Buddy":
        show_chat(buddy)
    elif page == "📊 Wellness Check-in":
        show_wellness_checkin(buddy)
    elif page == "⏰ Break Reminders":
        show_break_reminders(buddy)
    elif page == "🧘‍♀️ Meditation":
        show_meditation(buddy)
    elif page == "🏆 Leaderboard":
        show_leaderboard(buddy)
    elif page == "📈 Analytics":
        show_analytics(buddy)

def show_dashboard(buddy):
    """Show the main dashboard"""
    if not st.session_state.user_id:
        st.warning("Please log in to access the dashboard")
        return
    
    # Welcome message
    col1, col2, col3 = st.columns([2, 1, 2])
    
    with col2:
        st.markdown("""
        <div class="stats-card">
            <div class="points-display">🎯</div>
            <h3>Your Wellness Journey</h3>
        </div>
        """, unsafe_allow_html=True)
    
    # Quick actions
    st.subheader("🚀 Quick Actions")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        if st.button("📊 Check-in", use_container_width=True):
            st.session_state.current_feature = "checkin"
            st.rerun()
    
    with col2:
        if st.button("⏰ Take Break", use_container_width=True):
            st.session_state.current_feature = "break"
            st.rerun()
    
    with col3:
        if st.button("🧘‍♀️ Meditate", use_container_width=True):
            st.session_state.current_feature = "meditation"
            st.rerun()
    
    with col4:
        if st.button("💬 Chat", use_container_width=True):
            st.session_state.current_feature = "chat"
            st.rerun()
    
    # Recent activity
    st.subheader("📝 Recent Activity")
    if st.session_state.chat_history:
        recent_messages = st.session_state.chat_history[-5:]  # Show last 5 messages
        for msg in recent_messages:
            message_class = "user-message" if msg['is_user'] else "bot-message"
            st.markdown(f"""
            <div class="chat-message {message_class}">
                <strong>{msg['sender']}:</strong> {msg['message']}
                <br><small>{msg['timestamp'].strftime('%H:%M')}</small>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("No recent activity. Start your wellness journey! 🌟")

def show_chat(buddy):
    """Show the chat interface"""
    if not st.session_state.user_id:
        st.warning("Please log in to chat with Wellness Buddy")
        return
    
    st.subheader("💬 Chat with Wellness Buddy")
    st.write("Share your thoughts, ask for wellness advice, or just chat!")
    
    # Chat history
    chat_container = st.container()
    with chat_container:
        if st.session_state.chat_history:
            for msg in st.session_state.chat_history:
                message_class = "user-message" if msg['is_user'] else "bot-message"
                st.markdown(f"""
                <div class="chat-message {message_class}">
                    <strong>{msg['sender']}:</strong> {msg['message']}
                    <br><small>{msg['timestamp'].strftime('%H:%M')}</small>
                </div>
                """, unsafe_allow_html=True)
    
    # Chat input
    st.divider()
    user_input = st.text_input("Type your message here...", key="chat_input")
    col1, col2 = st.columns([1, 4])
    
    with col1:
        if st.button("Send", type="primary"):
            if user_input.strip():
                response = buddy.chat_with_buddy(user_input)
                st.rerun()
    
    with col2:
        if st.button("Clear Chat"):
            st.session_state.chat_history = []
            st.rerun()

def show_wellness_checkin(buddy):
    """Show the wellness check-in interface"""
    if not st.session_state.user_id:
        st.warning("Please log in to access wellness check-in")
        return
    
    st.subheader("📊 Daily Wellness Check-in")
    st.write("How are you feeling today? Share your mood and get personalized support.")
    
    # Mood selection
    mood = st.selectbox(
        "How are you feeling?",
        config.WELLNESS_FEATURES['check_in']['options'],
        key="mood_selection"
    )
    
    # Additional notes
    notes = st.text_area("Additional notes (optional)", 
                        placeholder="Share more about your day, what's on your mind, or any specific concerns...")
    
    if st.button("Submit Check-in", type="primary"):
        if mood:
            response = buddy.wellness_checkin(mood, notes)
            st.success(response)
            st.rerun()

def show_break_reminders(buddy):
    """Show the break reminders interface"""
    if not st.session_state.user_id:
        st.warning("Please log in to access break reminders")
        return
    
    st.subheader("⏰ Break Reminders")
    st.write("Set reminders to take healthy breaks and stay refreshed throughout your day.")
    
    # Break type selection
    break_type = st.selectbox(
        "What type of break would you like?",
        config.WELLNESS_FEATURES['break_reminder']['options'],
        key="break_selection"
    )
    
    if st.button("Set Break Reminder", type="primary"):
        if break_type:
            response = buddy.break_reminder(break_type)
            st.success(response)
            st.rerun()

def show_meditation(buddy):
    """Show the meditation interface"""
    if not st.session_state.user_id:
        st.warning("Please log in to access meditation features")
        return
    
    st.subheader("🧘‍♀️ Mindfulness & Meditation")
    st.write("Take a moment to center yourself with guided meditation and mindfulness exercises.")
    
    # Meditation type selection
    meditation_type = st.selectbox(
        "Choose your meditation session",
        config.WELLNESS_FEATURES['meditation']['options'],
        key="meditation_selection"
    )
    
    # Duration selection
    duration = st.slider("Session duration (minutes)", 1, 30, 5)
    
    if st.button("Start Meditation Session", type="primary"):
        if meditation_type:
            response = buddy.meditation_session(meditation_type, duration)
            st.success(response)
            st.rerun()

def show_leaderboard(buddy):
    """Show the leaderboard"""
    st.subheader("🏆 Team Wellness Leaderboard")
    st.write("See how you and your team are doing in the wellness challenge!")
    
    leaderboard = buddy.get_leaderboard()
    
    if leaderboard:
        # Create leaderboard chart
        fig = buddy.create_leaderboard_chart(leaderboard)
        if fig:
            st.plotly_chart(fig, use_container_width=True)
        
        # Leaderboard table
        st.subheader("📊 Leaderboard Rankings")
        df = pd.DataFrame(leaderboard)
        df.index = range(1, len(df) + 1)
        df.columns = ['Username', 'Points']
        
        # Highlight current user
        if st.session_state.user_id:
            current_user_row = df[df['Username'] == st.session_state.username]
            if not current_user_row.empty:
                st.info(f"Your rank: #{current_user_row.index[0]} with {current_user_row['Points'].iloc[0]} points")
        
        st.dataframe(df, use_container_width=True)
    else:
        st.info("No leaderboard data available yet. Be the first to start earning points! 🌟")

def show_analytics(buddy):
    """Show analytics and insights"""
    if not st.session_state.user_id:
        st.warning("Please log in to view your analytics")
        return
    
    st.subheader("📈 Your Wellness Analytics")
    st.write("Track your wellness journey with detailed insights and trends.")
    
    stats = buddy.get_user_stats()
    
    if stats:
        # Key metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Points", stats['total_points'])
        
        with col2:
            st.metric("Check-ins", stats['checkins'])
        
        with col3:
            st.metric("Breaks", stats['breaks'])
        
        with col4:
            st.metric("Meditations", stats['meditations'])
        
        # Charts
        col1, col2 = st.columns(2)
        
        with col1:
            if stats['mood_stats']:
                mood_fig = buddy.create_mood_chart(stats['mood_stats'])
                if mood_fig:
                    st.plotly_chart(mood_fig, use_container_width=True)
            else:
                st.info("No mood data available yet. Start checking in! 📊")
        
        with col2:
            activity_fig = buddy.create_activity_chart(stats)
            if activity_fig:
                st.plotly_chart(activity_fig, use_container_width=True)
        
        # Wellness insights
        st.subheader("💡 Wellness Insights")
        
        if stats['total_points'] > 0:
            if stats['checkins'] > stats['meditations']:
                st.info("💡 Tip: You're great at checking in! Consider adding more meditation sessions for deeper wellness benefits.")
            
            if stats['breaks'] < stats['checkins']:
                st.info("💡 Tip: Don't forget to take regular breaks! They're just as important as check-ins.")
            
            if stats['mood_stats'].get('Stressed 😰', 0) > stats['mood_stats'].get('Happy 😊', 0):
                st.info("💡 Tip: I notice you've been feeling stressed lately. Consider trying more meditation sessions or talking to a colleague.")
        else:
            st.info("🌟 Start your wellness journey today! Every check-in, break, and meditation session counts towards your wellness goals.")
    else:
        st.info("No analytics data available yet. Start using Wellness Buddy to see your progress! 📊")

if __name__ == "__main__":
    main() 