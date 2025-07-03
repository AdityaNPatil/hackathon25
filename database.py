import sqlite3
import json
from datetime import datetime, date
from typing import Dict, List, Optional
import config

class WellnessDatabase:
    def __init__(self, db_path: str = config.DATABASE_PATH):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Wellness check-ins table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS wellness_checkins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                mood TEXT NOT NULL,
                notes TEXT,
                points INTEGER DEFAULT 10,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Break reminders table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS break_reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                reminder_type TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                points INTEGER DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Meditation sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS meditation_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                session_type TEXT NOT NULL,
                duration_minutes INTEGER DEFAULT 5,
                points INTEGER DEFAULT 15,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_user(self, username: str, email: str = None) -> int:
        """Add a new user to the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO users (username, email) VALUES (?, ?)',
                (username, email)
            )
            user_id = cursor.lastrowid
            conn.commit()
            return user_id
        except sqlite3.IntegrityError:
            # User already exists, get their ID
            cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
            return cursor.fetchone()[0]
        finally:
            conn.close()
    
    def add_wellness_checkin(self, user_id: int, mood: str, notes: str = None) -> bool:
        """Add a wellness check-in for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO wellness_checkins (user_id, mood, notes) VALUES (?, ?, ?)',
                (user_id, mood, notes)
            )
            conn.commit()
            return True
        except Exception as e:
            print(f"Error adding wellness check-in: {e}")
            return False
        finally:
            conn.close()
    
    def add_break_reminder(self, user_id: int, reminder_type: str) -> bool:
        """Add a break reminder for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO break_reminders (user_id, reminder_type) VALUES (?, ?)',
                (user_id, reminder_type)
            )
            conn.commit()
            return True
        except Exception as e:
            print(f"Error adding break reminder: {e}")
            return False
        finally:
            conn.close()
    
    def add_meditation_session(self, user_id: int, session_type: str, duration_minutes: int = 5) -> bool:
        """Add a meditation session for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO meditation_sessions (user_id, session_type, duration_minutes) VALUES (?, ?, ?)',
                (user_id, session_type, duration_minutes)
            )
            conn.commit()
            return True
        except Exception as e:
            print(f"Error adding meditation session: {e}")
            return False
        finally:
            conn.close()
    
    def get_user_points(self, user_id: int) -> int:
        """Get total points for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Sum points from all activities
            cursor.execute('''
                SELECT COALESCE(SUM(points), 0) FROM (
                    SELECT points FROM wellness_checkins WHERE user_id = ?
                    UNION ALL
                    SELECT points FROM break_reminders WHERE user_id = ? AND completed = 1
                    UNION ALL
                    SELECT points FROM meditation_sessions WHERE user_id = ?
                )
            ''', (user_id, user_id, user_id))
            
            return cursor.fetchone()[0]
        finally:
            conn.close()
    
    def get_leaderboard(self, limit: int = 10) -> List[Dict]:
        """Get the wellness leaderboard"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT u.username, 
                       COALESCE(SUM(
                           CASE 
                               WHEN wc.id IS NOT NULL THEN wc.points
                               WHEN br.id IS NOT NULL AND br.completed = 1 THEN br.points
                               WHEN ms.id IS NOT NULL THEN ms.points
                               ELSE 0
                           END
                       ), 0) as total_points
                FROM users u
                LEFT JOIN wellness_checkins wc ON u.id = wc.user_id
                LEFT JOIN break_reminders br ON u.id = br.user_id
                LEFT JOIN meditation_sessions ms ON u.id = ms.user_id
                GROUP BY u.id, u.username
                ORDER BY total_points DESC
                LIMIT ?
            ''', (limit,))
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    'username': row[0],
                    'points': row[1]
                })
            
            return results
        finally:
            conn.close()
    
    def get_user(self, user_id: int) -> Dict:
        """Get user information"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT id, username, email FROM users WHERE id = ?', (user_id,))
            row = cursor.fetchone()
            if row:
                return {"user_id": row[0], "username": row[1], "email": row[2]}
            return None
        finally:
            conn.close()

    def add_chat_points(self, user_id: int, points: int = 5) -> bool:
        """Add points for chat interaction by creating a wellness check-in entry"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO wellness_checkins (user_id, mood, notes, points) VALUES (?, ?, ?, ?)',
                (user_id, "Chat Interaction", "AI Wellness Chat", points)
            )
            conn.commit()
            return True
        except Exception as e:
            print(f"Error adding chat points: {e}")
            return False
        finally:
            conn.close()

    def get_user_stats(self, user_id: int) -> Dict:
        """Get comprehensive stats for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Get user info
            cursor.execute('SELECT username FROM users WHERE id = ?', (user_id,))
            user_row = cursor.fetchone()
            if not user_row:
                return None
            username = user_row[0]
            
            # Get check-in stats
            cursor.execute('''
                SELECT mood, COUNT(*) as count 
                FROM wellness_checkins 
                WHERE user_id = ? 
                GROUP BY mood
            ''', (user_id,))
            mood_stats = dict(cursor.fetchall())
            
            # Get total activities
            cursor.execute('''
                SELECT 
                    COUNT(DISTINCT wc.id) as checkins,
                    COUNT(DISTINCT br.id) as breaks,
                    COUNT(DISTINCT ms.id) as meditations
                FROM users u
                LEFT JOIN wellness_checkins wc ON u.id = wc.user_id
                LEFT JOIN break_reminders br ON u.id = br.user_id
                LEFT JOIN meditation_sessions ms ON u.id = ms.user_id
                WHERE u.id = ?
            ''', (user_id,))
            
            activity_counts = cursor.fetchone()
            
            return {
                'username': username,
                'total_points': self.get_user_points(user_id),
                'mood_stats': mood_stats,
                'checkins': activity_counts[0] or 0,
                'breaks': activity_counts[1] or 0,
                'meditations': activity_counts[2] or 0
            }
        finally:
            conn.close() 