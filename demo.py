import requests

API_URL = "http://localhost:8000"

def demo_login():
    resp = requests.post(f"{API_URL}/login", json={"username": "demo", "password": "demo"})
    print("Login response:", resp.json())

def demo_leaderboard():
    resp = requests.get(f"{API_URL}/leaderboard")
    print("Leaderboard:", resp.json())

if __name__ == "__main__":
    demo_login()
    demo_leaderboard() 