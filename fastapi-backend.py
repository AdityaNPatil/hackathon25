#!/usr/bin/env python3
"""
FastAPI Backend Runner for Wellness Buddy
"""

import uvicorn
import os
import sys
from api import app

def main():
    """Run the FastAPI backend server"""
    print("🧘‍♀️ Starting Wellness Buddy FastAPI Backend...")
    print("📚 API Documentation will be available at: http://localhost:6081/docs")
    print("🔄 Auto-reload enabled for development")
    print("")
    
    try:
        uvicorn.run(
            "api:app",
            host="0.0.0.0",
            port=6081,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Shutting down FastAPI backend...")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 