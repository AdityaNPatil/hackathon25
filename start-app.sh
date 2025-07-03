#!/bin/bash

echo "🧘‍♀️ Starting Wellness Buddy Application with FastAPI Backend..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🚀 Starting applications..."
echo ""

# Start FastAPI backend in background
echo "🔧 Starting FastAPI backend server..."
python3 -m uvicorn api:app --host 0.0.0.0 --port 6081 --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "⚛️  Starting React frontend..."
cd frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Wellness Buddy is starting up!"
echo ""
echo "🌐 Backend (FastAPI): http://localhost:6081"
echo "📚 API Documentation: http://localhost:6081/docs"
echo "⚛️  Frontend (React): http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both applications"
echo ""

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping applications...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 