from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import logging
from datetime import datetime
from database import WellnessDatabase
from deepseek_api import DeepSeekAPI
import config
import json

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Wellness Buddy API",
    description="AI-powered workplace wellness companion backend",
    version="1.0.0"
)

# Enhanced CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
db = WellnessDatabase()
deepseek_api = DeepSeekAPI()

# Pydantic models for request validation
class UserLogin(BaseModel):
    username: str
    email: Optional[str] = None

class CheckInRequest(BaseModel):
    user_id: int
    mood: str
    notes: Optional[str] = ""

class BreakRequest(BaseModel):
    user_id: int
    reminder_type: str

class MeditationRequest(BaseModel):
    user_id: int
    session_type: str
    duration: Optional[int] = 5

class ChatRequest(BaseModel):
    user_id: int
    message: str

# Enhanced response models
class UserStatsResponse(BaseModel):
    user_id: int
    username: str
    total_points: int
    checkins: int
    breaks: int
    meditations: int

class AIResponse(BaseModel):
    response: str
    user_stats: UserStatsResponse
    points_earned: int

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Enhanced login endpoint
@app.post("/api/login")
async def login(data: UserLogin):
    """Login or register a user"""
    try:
        logger.info(f"Login attempt for user: {data.username}")
        user_id = db.add_user(data.username, data.email or "")
        user_stats = db.get_user_stats(user_id)
        user_info = db.get_user(user_id)
        response = {
            "user_id": user_id,
            "username": data.username,
            "email": user_info.get('email', ''),
            **user_stats
        }
        logger.info(f"Login successful for user: {data.username} (ID: {user_id})")
        return response
    except Exception as e:
        logger.error(f"Login error for {data.username}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Login failed: {str(e)}")

# Enhanced check-in endpoint with AI response
@app.post("/api/checkin")
async def checkin(data: CheckInRequest, background_tasks: BackgroundTasks):
    """Wellness check-in with AI mood analysis"""
    try:
        logger.info(f"Check-in request from user {data.user_id}: {data.mood}")
        
        # Add check-in to database
        success = db.add_wellness_checkin(data.user_id, data.mood, data.notes or "")
        if not success:
            raise HTTPException(status_code=400, detail="Check-in failed")
        
        # Get AI mood analysis
        ai_response = ""
        try:
            ai_response = deepseek_api.get_mood_analysis(data.mood, data.notes or "")
            logger.info(f"AI mood analysis generated for user {data.user_id}")
        except Exception as e:
            logger.warning(f"AI mood analysis failed: {str(e)}")
            ai_response = get_fallback_mood_response(data.mood)
        
        # Get updated user stats
        user_stats = db.get_user_stats(data.user_id)
        
        return {
            "ai_response": ai_response,
            "points_earned": 10,
            **user_stats
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Check-in error for user {data.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Check-in failed: {str(e)}")

# Enhanced break reminder endpoint
@app.post("/api/break")
async def break_reminder(data: BreakRequest, background_tasks: BackgroundTasks):
    """Set break reminder with AI guidance"""
    try:
        logger.info(f"Break reminder request from user {data.user_id}: {data.reminder_type}")
        
        # Add break reminder to database
        success = db.add_break_reminder(data.user_id, data.reminder_type)
        if not success:
            raise HTTPException(status_code=400, detail="Break reminder failed")
        
        # Get AI break guidance
        ai_response = ""
        try:
            ai_response = deepseek_api.get_employee_wellness_response(
                f"I need help with taking breaks: {data.reminder_type}",
                "The user is setting up break reminders to improve their workplace wellness."
            )
            logger.info(f"AI break guidance generated for user {data.user_id}")
        except Exception as e:
            logger.warning(f"AI break guidance failed: {str(e)}")
            ai_response = get_fallback_break_response(data.reminder_type)
        
        # Get updated user stats
        user_stats = db.get_user_stats(data.user_id)
        
        return {
            "ai_response": ai_response,
            "points_earned": 5,
            **user_stats
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Break reminder error for user {data.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Break reminder failed: {str(e)}")

# Enhanced meditation endpoint
@app.post("/api/meditation")
async def meditation(data: MeditationRequest, background_tasks: BackgroundTasks):
    """Start meditation session with AI guidance"""
    try:
        logger.info(f"Meditation request from user {data.user_id}: {data.session_type} ({data.duration} min)")
        
        # Add meditation session to database
        success = db.add_meditation_session(data.user_id, data.session_type, data.duration if data.duration is not None else 5)
        if not success:
            raise HTTPException(status_code=400, detail="Meditation session failed")
        
        # Get AI meditation guidance
        ai_response = ""
        try:
            ai_guidance = deepseek_api.get_meditation_guidance(data.session_type)
            # For Mindfulness and Relaxation, try to parse as list
            if data.session_type.lower() == 'mindfulness':
                # Try to extract bullet points or steps as a list
                import re
                steps = re.findall(r"(?:\d+\.|\-|•)\s*(.+)", ai_guidance)
                if steps:
                    ai_response = json.dumps(steps)
                else:
                    ai_response = json.dumps([ai_guidance])
            elif data.session_type.lower() == 'relaxation':
                # Try to extract techniques as a list
                import re
                techniques = re.findall(r"(?:\d+\.|\-|•)\s*(.+)", ai_guidance)
                if techniques:
                    ai_response = json.dumps(techniques)
                else:
                    ai_response = json.dumps([ai_guidance])
            else:
                ai_response = ai_guidance
            logger.info(f"AI meditation guidance generated for user {data.user_id}")
        except Exception as e:
            logger.warning(f"AI meditation guidance failed: {str(e)}")
            # Fallbacks as lists for Mindfulness/Relaxation, string for Guided Breathing
            if data.session_type.lower() == 'mindfulness':
                ai_response = json.dumps([
                    "Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
                    "Focus on your breath and gently return your attention when your mind wanders.",
                    "Accept your thoughts and feelings without judgment."
                ])
            elif data.session_type.lower() == 'relaxation':
                ai_response = json.dumps([
                    "Progressive muscle relaxation: tense and release each muscle group from toes to head.",
                    "Visualization: imagine a peaceful place and immerse yourself in that feeling.",
                    "Box breathing: inhale for 4, hold for 4, exhale for 4, hold for 4."
                ])
            else:
                ai_response = "Find a comfortable position. Close your eyes and take slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 4. Focus on your breath and let thoughts pass by like clouds."
        
        # Get updated user stats
        user_stats = db.get_user_stats(data.user_id)
        
        return {
            "ai_response": ai_response,
            "points_earned": 15,
            **user_stats
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Meditation error for user {data.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Meditation failed: {str(e)}")

# Enhanced chat endpoint with comprehensive AI support
@app.post("/api/chat")
async def chat(data: ChatRequest, background_tasks: BackgroundTasks):
    """Chat with AI wellness buddy"""
    try:
        logger.info(f"Chat request from user {data.user_id}: {data.message[:50]}...")
        
        # Get user info for context
        user = db.get_user(data.user_id)
        username = user['username'] if user else "Employee"
        
        # Enhanced context for AI
        context = (
            f"Employee: {username}. "
            f"This is a workplace wellness conversation. "
            f"The user has {user.get('total_points', 0)} wellness points and "
            f"has completed {user.get('checkins', 0)} check-ins, "
            f"{user.get('meditations', 0)} meditations, and "
            f"{user.get('breaks', 0)} breaks."
        )
        
        # Get AI response
        ai_response = ""
        try:
            ai_response = deepseek_api.get_employee_wellness_response(data.message, context)
            logger.info(f"AI response generated for user {data.user_id}")
        except Exception as e:
            logger.warning(f"AI response failed: {str(e)}")
            ai_response = get_fallback_chat_response(data.message)
        
        # Award points for chat engagement
        db.add_chat_points(data.user_id, 5)
        user_stats = db.get_user_stats(data.user_id)
        
        return {
            "response": ai_response,
            "user_stats": user_stats,
            "points_earned": 5
        }
    except Exception as e:
        logger.error(f"Chat error for user {data.user_id}: {str(e)}")
        # Return fallback response even on error
        fallback_response = "I'm here to support you. Take a moment to breathe deeply. What's on your mind today?"
        try:
            db.add_chat_points(data.user_id, 3)
            user_stats = db.get_user_stats(data.user_id)
        except:
            user_stats = {"total_points": 0, "checkins": 0, "breaks": 0, "meditations": 0}
        
        return {
            "response": fallback_response,
            "user_stats": user_stats,
            "points_earned": 3
        }

# Get user stats endpoint
@app.get("/api/user/{user_id}")
async def get_user(user_id: int):
    """Get user statistics and profile"""
    try:
        user_stats = db.get_user_stats(user_id)
        user_info = db.get_user(user_id)
        if not user_info:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "user_id": user_id,
            "username": user_info.get('username', 'Unknown'),
            "email": user_info.get('email', ''),
            **user_stats
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch user: {str(e)}")

# Enhanced leaderboard endpoint
@app.get("/api/leaderboard")
async def leaderboard(limit: int = 10):
    """Get wellness leaderboard"""
    try:
        leaderboard_data = db.get_leaderboard(limit)
        logger.info(f"Leaderboard fetched with {len(leaderboard_data)} entries")
        return leaderboard_data
    except Exception as e:
        logger.error(f"Leaderboard error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")

# Analytics endpoint for dashboard
@app.get("/api/analytics/{user_id}")
async def get_analytics(user_id: int):
    """Get user analytics data"""
    try:
        stats = db.get_user_stats(user_id)
        return {
            "user_stats": stats,
            "daily_activity": [],  # Could be enhanced with time-series data
            "achievements": []  # Could be enhanced with achievement system
        }
    except Exception as e:
        logger.error(f"Analytics error for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch analytics: {str(e)}")

# Wellness insights endpoint
@app.get("/api/insights/{user_id}")
async def get_wellness_insights(user_id: int):
    """Get AI-powered wellness insights for user"""
    try:
        user_stats = db.get_user_stats(user_id)
        user_info = db.get_user(user_id)
        
        # Generate insights using AI
        context = (
            f"User {user_info.get('username', 'Employee')} has "
            f"{user_stats['total_points']} points, "
            f"{user_stats['checkins']} check-ins, "
            f"{user_stats['meditations']} meditation sessions, and "
            f"{user_stats['breaks']} breaks taken."
        )
        
        try:
            insights = deepseek_api.get_employee_wellness_response(
                "Please provide personalized wellness insights and recommendations based on my activity.",
                context
            )
        except Exception:
            insights = generate_basic_insights(user_stats)
        
        return {
            "insights": insights,
            "recommendations": [
                "Take regular breaks throughout the day",
                "Practice mindfulness meditation",
                "Stay connected with colleagues",
                "Maintain a positive work-life balance"
            ]
        }
    except Exception as e:
        logger.error(f"Insights error for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

# Fallback response functions
def get_fallback_mood_response(mood: str) -> str:
    """Generate fallback mood response when AI is unavailable"""
    mood_responses = {
        "Happy 😊": "That's wonderful! Your positive energy is contagious. Keep spreading those good vibes!",
        "Neutral 😐": "Thanks for checking in. Sometimes neutral is perfectly okay. Consider a short walk or some deep breathing.",
        "Stressed 😰": "I understand you're feeling stressed. Try taking 5 deep breaths: in for 4, hold for 4, out for 6. You've got this!"
    }
    return mood_responses.get(mood, "Thank you for sharing how you're feeling. Remember, every emotion is valid.")

def get_fallback_break_response(reminder_type: str) -> str:
    """Generate fallback break response when AI is unavailable"""
    break_responses = {
        "Take a 5-minute break": "Great choice! Step away from your screen, stretch your arms above your head, and take 5 deep breaths.",
        "Stretch exercises": "Perfect! Try shoulder rolls, neck stretches, and touch your toes. Your body will thank you!",
        "Drink water": "Excellent reminder! Staying hydrated boosts energy and focus. Aim for 8 glasses throughout the day."
    }
    return break_responses.get(reminder_type, "Taking breaks is essential for productivity and wellbeing. Great job prioritizing your health!")

def get_fallback_meditation_response(session_type: str) -> str:
    """Generate fallback meditation response when AI is unavailable"""
    meditation_responses = {
        "Guided breathing": "Sit comfortably, close your eyes, and breathe naturally. Count each breath: 1 on inhale, 2 on exhale, up to 10, then repeat.",
        "Mindfulness tips": "Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This grounds you in the present.",
        "Relaxation techniques": "Progressive muscle relaxation: tense and release each muscle group starting from your toes up to your head."
    }
    return meditation_responses.get(session_type, "Find a quiet space, focus on your breath, and let your mind settle. Even 2 minutes can make a difference.")

def get_fallback_chat_response(message: str) -> str:
    """Generate fallback chat response when AI is unavailable"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['stress', 'overwhelmed', 'anxious']):
        return "I hear that you're feeling stressed. Take a moment to breathe deeply. Try the 4-7-8 technique: breathe in for 4, hold for 7, out for 8."
    elif any(word in message_lower for word in ['tired', 'exhausted', 'fatigue']):
        return "Feeling tired is common in our busy work lives. Consider taking a short walk, drinking water, or doing some gentle stretches."
    elif any(word in message_lower for word in ['happy', 'good', 'great', 'excellent']):
        return "That's wonderful to hear! Your positive energy can inspire others around you. Keep up the great work!"
    else:
        return "Thank you for sharing with me. Remember, I'm here to support your wellness journey. What would help you feel better right now?"

def generate_basic_insights(user_stats: Dict) -> str:
    """Generate basic insights when AI is unavailable"""
    total_points = user_stats.get('total_points', 0)
    checkins = user_stats.get('checkins', 0)
    meditations = user_stats.get('meditations', 0)
    breaks = user_stats.get('breaks', 0)
    
    if total_points > 100:
        return f"You're doing great with {total_points} wellness points! Your commitment to self-care is showing."
    elif checkins > 5:
        return f"Your {checkins} check-ins show good self-awareness. Consider adding more meditation sessions for balance."
    else:
        return "You're starting your wellness journey! Try to check in daily and take regular breaks for the best results."

@app.post("/api/mindfulness_quotes")
async def mindfulness_quotes(data: MeditationRequest):
    """Get AI-generated mindfulness quotes (as a list) for Mindfulness session"""
    try:
        logger.info(f"Mindfulness quotes request for user {data.user_id}")
        try:
            ai_guidance = deepseek_api.get_mindfulness_quotes()
            # Try to extract bullet points or steps as a list
            import re
            quotes = re.findall(r"(?:\d+\.|\-|•)\s*(.+)", ai_guidance)
            if quotes:
                ai_response = quotes
            else:
                ai_response = [ai_guidance]
        except Exception as e:
            logger.warning(f"AI mindfulness quotes failed: {str(e)}")
            ai_response = [
                "In the stillness of the present moment, we discover that much of our suffering arises not from what is, but from our resistance to it.",
                "Mindfulness is not about getting anywhere else. It's about allowing ourselves to be exactly where we are, completely.",
                "The present moment is a place of profound healing, not because it fixes our problems, but because it shows us that beneath the noise of fear, worry, and regret lies an untouched stillness, waiting patiently for us to return home to ourselves.",
                "We spend so much time trying to fix the external world, forgetting that the deepest peace comes not from changing the waves, but from learning to surf them with awareness, grace, and trust in the rhythm of life.",
                "When you let go of what you think your life is supposed to look like and gently open to what is, you meet a profound serenity — one that doesn't depend on outcomes but blossoms from acceptance, patience, and the courage to be present."
            ]
        return {"ai_response": ai_response}
    except Exception as e:
        logger.error(f"Mindfulness quotes error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch mindfulness quotes: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=6081) 