#!/usr/bin/env python3
"""
Flask Backend for CalmIQ Wellness Buddy
Integrates with enhanced DeepSeek psychological support chat
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from database import WellnessDatabase
from deepseek_api import DeepSeekAPI
import config

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize components
db = WellnessDatabase()
deepseek_api = DeepSeekAPI()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "CalmIQ Flask Backend"})

@app.route('/api/login', methods=['POST'])
def login():
    """Login or register a user"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email', '')
        
        if not username:
            return jsonify({"error": "Username is required"}), 400
        
        user_id = db.add_user(username, email)
        user_stats = db.get_user_stats(user_id)
        
        return jsonify({
            "user_id": user_id,
            "username": username,
            **user_stats
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/checkin', methods=['POST'])
def checkin():
    """Wellness check-in endpoint"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        mood = data.get('mood')
        notes = data.get('notes', '')
        
        if not user_id or not mood:
            return jsonify({"error": "user_id and mood are required"}), 400
        
        success = db.add_wellness_checkin(user_id, mood, notes)
        if not success:
            return jsonify({"error": "Check-in failed"}), 500
        
        user_stats = db.get_user_stats(user_id)
        return jsonify(user_stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/break', methods=['POST'])
def break_reminder():
    """Break reminder endpoint"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        reminder_type = data.get('reminder_type')
        
        if not user_id or not reminder_type:
            return jsonify({"error": "user_id and reminder_type are required"}), 400
        
        success = db.add_break_reminder(user_id, reminder_type)
        if not success:
            return jsonify({"error": "Break reminder failed"}), 500
        
        user_stats = db.get_user_stats(user_id)
        return jsonify(user_stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/meditation', methods=['POST'])
def meditation():
    """Meditation session endpoint"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        session_type = data.get('session_type')
        duration = data.get('duration', 5)
        
        if not user_id or not session_type:
            return jsonify({"error": "user_id and session_type are required"}), 400
        
        success = db.add_meditation_session(user_id, session_type, duration)
        if not success:
            return jsonify({"error": "Meditation session failed"}), 500
        
        user_stats = db.get_user_stats(user_id)
        return jsonify(user_stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Enhanced psychological support chat with DeepSeek AI"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        message = data.get('message')
        
        if not user_id or not message:
            return jsonify({"error": "user_id and message are required"}), 400
        
        # Get user information for context
        user = db.get_user(user_id)
        username = user['username'] if user else "Employee"
        
        # Enhanced context for employee psychological support
        context = f"Employee: {username}. This is a workplace wellness conversation."
        
        # Get intelligent response from DeepSeek
        try:
            ai_response = deepseek_api.get_employee_wellness_response(message, context)
            app.logger.info(f"DeepSeek API response received for user {user_id}")
        except Exception as e:
            app.logger.error(f"DeepSeek API error: {e}")
            # Fallback to enhanced psychological support
            ai_response = deepseek_api._get_employee_fallback_response(message)
        
        # Award points for meaningful engagement
        db.add_chat_points(user_id, 5)
        user_stats = db.get_user_stats(user_id)
        
        return jsonify({
            "response": ai_response,
            "user_stats": user_stats
        })
    except Exception as e:
        app.logger.error(f"Chat endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user statistics"""
    try:
        user_stats = db.get_user_stats(user_id)
        if not user_stats:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user_stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/leaderboard', methods=['GET'])
def leaderboard():
    """Get wellness leaderboard"""
    try:
        leaderboard_data = db.get_leaderboard(10)
        return jsonify(leaderboard_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/config', methods=['GET'])
def get_config():
    """Get app configuration for frontend"""
    return jsonify({
        "deepseek_configured": len(config.DEEPSEEK_API_KEY) > 20,
        "features": list(config.WELLNESS_FEATURES.keys())
    })

if __name__ == '__main__':
    # Configure logging
    import logging
    logging.basicConfig(level=logging.INFO)
    
    print("🧘‍♀️ Starting CalmIQ Flask Backend...")
    print(f"🔑 DeepSeek API: {'✅ Configured' if len(config.DEEPSEEK_API_KEY) > 20 else '❌ Not configured'}")
    print("🌐 Backend will run on: http://localhost:5000")
    print("📡 CORS enabled for React frontend")
    
    # Run Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    ) 