import os

# Try to load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not available, use environment variables directly
    pass

# DeepSeek API Configuration
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', 'your_deepseek_api_key_here')
DEEPSEEK_API_URL = os.getenv('DEEPSEEK_API_URL', 'https://api.deepseek.com/v1/chat/completions')

# Application Configuration
DATABASE_PATH = os.getenv('DATABASE_PATH', 'wellness_buddy.db')

# Wellness Buddy Configuration
WELLNESS_FEATURES = {
    'check_in': {
        'name': 'Daily Wellness Check-in',
        'description': 'Share how you\'re feeling today',
        'options': ['Happy 😊', 'Neutral 😐', 'Stressed 😰']
    },
    'break_reminder': {
        'name': 'Break Reminder',
        'description': 'Get reminded to take breaks and stay hydrated',
        'options': ['Take a 5-minute break', 'Stretch exercises', 'Drink water']
    },
    'meditation': {
        'name': 'Mindfulness & Meditation',
        'description': 'Get guided breathing exercises and mindfulness tips',
        'options': ['Guided breathing', 'Mindfulness tips', 'Relaxation techniques']
    },
    'leaderboard': {
        'name': 'Team Wellness Leaderboard',
        'description': 'See how you and your team are doing',
        'options': ['View leaderboard', 'Your stats', 'Team wellness trends']
    }
} 