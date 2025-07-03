# 🧘‍♀️ Wellness Buddy - AI-Powered Workplace Wellness Platform

A comprehensive workplace wellness platform that combines a **FastAPI backend** with **React frontend** and **AI-powered wellness coaching** to support employee mental health and wellbeing.

## 🏗️ Architecture

- **Backend**: FastAPI with SQLite database
- **Frontend**: React with Tailwind CSS
- **AI Services**: DeepSeek API for wellness coaching
- **Database**: SQLite for user data and wellness tracking

## ✨ Features

### 🤖 AI-Powered Wellness Coaching
- **Intelligent Chat**: AI wellness buddy powered by DeepSeek API
- **Mood Analysis**: AI analyzes daily check-ins and provides personalized responses
- **Meditation Guidance**: AI-generated meditation instructions
- **Break Recommendations**: Smart suggestions for workplace breaks

### 📊 Wellness Tracking
- **Daily Check-ins**: Track mood and wellness status
- **Break Reminders**: Set and track healthy break habits
- **Meditation Sessions**: Guided mindfulness practices
- **Points System**: Gamified wellness engagement

### 🏆 Team Features
- **Leaderboard**: Team wellness competition
- **Analytics**: Personal and team wellness insights
- **Progress Tracking**: Monitor wellness journey over time

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- DeepSeek API key (for AI features)

### 1. Install Dependencies

```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your DeepSeek API key
# DEEPSEEK_API_KEY=your_actual_api_key_here
```

### 3. Start the Application

**Option A: Start both backend and frontend together**
```bash
chmod +x start-app.sh
./start-app.sh
```

**Option B: Start services individually**

Backend (FastAPI):
```bash
python3 fastapi-backend.py
# Or alternatively:
uvicorn api:app --host 0.0.0.0 --port 6081 --reload
```

Frontend (React):
```bash
cd frontend
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:6081
- **API Documentation**: http://localhost:6081/docs

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - Login/register user

### Wellness Features
- `POST /api/checkin` - Daily wellness check-in with AI analysis
- `POST /api/meditation` - Start meditation session with AI guidance
- `POST /api/break` - Set break reminder with AI suggestions
- `POST /api/chat` - Chat with AI wellness buddy

### Data & Analytics
- `GET /api/user/{user_id}` - Get user stats and profile
- `GET /api/leaderboard` - Get team wellness leaderboard
- `GET /api/analytics/{user_id}` - Get user analytics
- `GET /api/insights/{user_id}` - Get AI-powered wellness insights

## 🧠 AI Features

### DeepSeek Integration
The platform uses DeepSeek API to provide:
- **Psychological Support**: Real-time workplace mental health assistance
- **Mood Analysis**: Intelligent responses based on check-in data
- **Meditation Guidance**: Personalized mindfulness instructions
- **Wellness Insights**: AI-generated recommendations and insights

### Fallback System
If AI services are unavailable, the system provides:
- Pre-defined wellness responses
- Basic mood acknowledgment
- Standard meditation instructions
- Generic wellness tips

## 📁 Project Structure

```
Hackthon/
├── api.py                 # FastAPI backend application
├── fastapi-backend.py     # Backend runner script
├── database.py            # Database models and operations
├── deepseek_api.py        # AI service integration
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── start-app.sh          # Full application startup script
├── .env.example          # Environment variables template
├── wellness_buddy.db     # SQLite database (created automatically)
└── frontend/             # React frontend application
    ├── src/
    │   ├── components/   # Reusable React components
    │   ├── pages/        # Page components
    │   ├── context/      # React context (AuthContext)
    │   └── ...
    ├── package.json      # Frontend dependencies
    └── ...
```

## 🔒 Environment Variables

Required environment variables in `.env`:

```bash
# DeepSeek API (Required for AI features)
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# Database
DATABASE_PATH=wellness_buddy.db
```

## 🛠️ Development

### Backend Development
```bash
# Start with auto-reload
uvicorn api:app --reload --port 6081

# View API documentation
open http://localhost:6081/docs
```

### Frontend Development
```bash
cd frontend
npm start
```

### Database
The SQLite database is created automatically with tables for:
- Users and authentication
- Wellness check-ins
- Break reminders
- Meditation sessions
- Points and gamification

## 📊 Wellness Metrics

The platform tracks:
- **Check-ins**: Daily mood and wellness status (+10 points)
- **Breaks**: Healthy break habits (+5 points)
- **Meditations**: Mindfulness sessions (+15 points)
- **Chat Interactions**: AI wellness conversations (+5 points)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the application
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔮 Future Enhancements

- Multi-language support
- Advanced analytics dashboard
- Team challenges and goals
- Integration with calendar systems
- Mobile app development
- Additional AI models support

## 🎯 Real-World Benefits

### For Employees
- **Reduced Stress** - Regular breaks and mindfulness practices
- **Improved Focus** - Better work-life balance
- **Enhanced Well-being** - Daily wellness tracking and support
- **Team Bonding** - Friendly competition through leaderboards

### For Organizations
- **Increased Productivity** - Happier, healthier employees
- **Reduced Burnout** - Proactive wellness management
- **Positive Culture** - Supportive work environment
- **Data Insights** - Wellness trends and patterns

## 🔮 Future Enhancements

### Planned Features
- **Microsoft Calendar Integration** - Smart break suggestions based on meeting schedules
- **Advanced Analytics Dashboard** - Detailed wellness reports and trends
- **Team Challenges** - Collaborative wellness activities
- **Mobile App** - Native mobile experience
- **Integration APIs** - Connect with other wellness platforms

### Technical Improvements
- **Real-time Notifications** - Push notifications for breaks and reminders
- **Machine Learning** - Personalized wellness recommendations
- **Multi-language Support** - International workplace support
- **Advanced Security** - Enterprise-grade authentication

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **DeepSeek** for providing the AI API
- **Streamlit** for the amazing web framework
- **Plotly** for beautiful visualizations
- **Microsoft Teams** for inspiration on workplace wellness

## 📞 Support

If you have any questions or need help:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

**Made with ❤️ for workplace wellness** 