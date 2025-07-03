import sqlite3

DB_PATH = "wellness_buddy.db"  # Update if your DB path is different

def delete_user_by_email(email):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Find user id by email
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    if not row:
        print(f"No user found with email: {email}")
        conn.close()
        return
    user_id = row[0]
    # Delete related data
    cursor.execute("DELETE FROM wellness_checkins WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM break_reminders WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM meditation_sessions WHERE user_id = ?", (user_id,))
    # Delete user
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    print(f"User with email {email} and all related data deleted.")

if __name__ == "__main__":
    email = input("Enter the email of the user to delete: ").strip()
    delete_user_by_email(email)