import requests
import json
from typing import Dict, List, Optional
import config

class DeepSeekAPI:
    def __init__(self, api_key: str = config.DEEPSEEK_API_KEY, api_url: str = config.DEEPSEEK_API_URL):
        self.api_key = api_key
        self.api_url = api_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def get_employee_wellness_response(self, user_input: str, context: str = "") -> str:
        """Get an optimized psychological support response for employees in real-time"""
        
        # Specialized prompt for employee psychological support
        system_prompt = """You are CalmIQ Wellness Buddy, an expert AI psychological support assistant specialized in workplace mental health and employee wellbeing. You provide real-time psychological support for employees.

CORE EXPERTISE:
- Licensed-level understanding of workplace psychology, stress management, and mental health
- Evidence-based therapeutic techniques (CBT, mindfulness, positive psychology)
- Crisis detection and appropriate response protocols
- Workplace-specific stressors and solutions

YOUR APPROACH:
1. IMMEDIATE ASSESSMENT: Quickly identify emotional state and urgency level
2. EMPATHETIC VALIDATION: Acknowledge feelings without judgment
3. PRACTICAL INTERVENTION: Provide actionable, evidence-based techniques
4. WORKPLACE CONTEXT: Tailor advice to professional environment constraints
5. PROGRESSIVE SUPPORT: Escalate or suggest professional help when needed

COMMUNICATION STYLE:
- Professional yet warm and approachable
- Clear, actionable language
- Trauma-informed and culturally sensitive
- Solution-focused while validating emotions
- Concise but comprehensive (100-200 words max)

INTERVENTION TECHNIQUES:
- Breathing exercises, grounding techniques
- Cognitive reframing, perspective shifting
- Boundary setting, time management
- Stress inoculation, resilience building
- Team dynamics and communication strategies

CRISIS INDICATORS: If you detect severe distress, suicidal ideation, or crisis markers, acknowledge the severity and gently suggest professional resources while providing immediate coping strategies.

You are providing psychological first aid in a workplace context. Be professional, evidence-based, and immediately helpful."""

        user_prompt = f"""
EMPLOYEE MESSAGE: "{user_input}"
CONTEXT: {context}

ASSESSMENT NEEDED:
1. Emotional state and stress level (1-10)
2. Immediate intervention required?
3. Workplace-specific factors involved?

RESPONSE REQUIREMENTS:
- Provide immediate psychological support
- Include at least one practical technique they can use right now
- Address the specific concern raised
- Maintain professional therapeutic boundaries
- Suggest follow-up actions if appropriate
- If detecting high stress/crisis, acknowledge and provide crisis resources

Keep response focused, actionable, and professionally therapeutic (150-200 words max).
"""

        try:
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 400,
                "temperature": 0.7
            }
            
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content'].strip()
            else:
                return self._get_employee_fallback_response(user_input)
                
        except Exception as e:
            print(f"Error calling DeepSeek API: {e}")
            return self._get_employee_fallback_response(user_input)
    
    def get_mood_analysis(self, mood: str, notes: str = "") -> str:
        """Get personalized response based on user's mood"""
        
        system_prompt = """You are Wellness Buddy analyzing a user's mood check-in. Provide supportive, encouraging feedback based on their mood state. Be empathetic and offer practical suggestions for improvement if needed."""

        user_prompt = f"""
User's Mood: {mood}
Additional Notes: {notes}

Please provide a supportive response that:
1. Acknowledges their current state
2. Offers encouragement
3. Suggests practical wellness activities if they're feeling stressed
4. Celebrates positive moods
5. Keeps the response warm and under 100 words
"""

        try:
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 200,
                "temperature": 0.7
            }
            
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content'].strip()
            else:
                return self._get_mood_fallback_response(mood)
                
        except Exception as e:
            print(f"Error calling DeepSeek API for mood analysis: {e}")
            return self._get_mood_fallback_response(mood)
    
    def get_meditation_guidance(self, session_type: str) -> str:
        """Get personalized meditation guidance"""
        
        system_prompt = """You are Wellness Buddy providing meditation and mindfulness guidance. Offer practical, step-by-step instructions for different types of meditation and relaxation techniques."""

        user_prompt = f"""
Session Type: {session_type}

Please provide:
1. A brief introduction to this type of meditation/mindfulness
2. Step-by-step instructions (3-5 steps)
3. Tips for getting the most out of the session
4. Keep it practical and easy to follow
5. Limit to 150 words
"""

        try:
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 250,
                "temperature": 0.7
            }
            
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content'].strip()
            else:
                return self._get_meditation_fallback_response(session_type)
                
        except Exception as e:
            print(f"Error calling DeepSeek API for meditation guidance: {e}")
            return self._get_meditation_fallback_response(session_type)
    
    def _get_employee_fallback_response(self, user_input: str) -> str:
        """Enhanced fallback responses for employee psychological support"""
        user_input_lower = user_input.lower()
        
        # Crisis/urgent keywords detection
        crisis_keywords = ['suicide', 'kill myself', 'want to die', 'hopeless', 'can\'t go on', 'end it all']
        high_stress_keywords = ['panic', 'overwhelmed', 'breakdown', 'can\'t cope', 'too much', 'burnout']
        work_stress_keywords = ['deadline', 'boss', 'workload', 'colleague', 'meeting', 'pressure', 'fired', 'job']
        anxiety_keywords = ['anxious', 'worried', 'nervous', 'scared', 'fear', 'panic']
        depression_keywords = ['sad', 'depressed', 'lonely', 'empty', 'worthless', 'tired']
        
        # Crisis response
        if any(keyword in user_input_lower for keyword in crisis_keywords):
            return """I'm deeply concerned about what you're sharing. Your life has value and there are people who want to help. 

IMMEDIATE SUPPORT:
• Crisis Text Line: Text HOME to 741741
• National Suicide Prevention: 988
• Emergency: 911

RIGHT NOW: Take 5 deep breaths with me. In for 4... hold for 4... out for 6. Please reach out to a trusted colleague, friend, or mental health professional today. You don't have to face this alone."""

        # High stress response
        elif any(keyword in user_input_lower for keyword in high_stress_keywords):
            return """I hear that you're experiencing intense stress right now. This is a signal that you need immediate support and care.

IMMEDIATE TECHNIQUE - 5-4-3-2-1 Grounding:
• 5 things you can see
• 4 things you can touch  
• 3 things you can hear
• 2 things you can smell
• 1 thing you can taste

Consider speaking with your manager about workload adjustment or accessing your company's Employee Assistance Program (EAP) for professional support."""

        # Work-specific stress
        elif any(keyword in user_input_lower for keyword in work_stress_keywords):
            return """Workplace stress is incredibly common and manageable with the right strategies. Let's address this systematically.

IMMEDIATE ACTION:
• Step away from your desk for 2 minutes
• Practice box breathing: 4 counts in, 4 hold, 4 out, 4 hold
• Write down your top 3 priorities for today

NEXT STEPS: Consider discussing workload with your supervisor, setting clearer boundaries, or utilizing workplace mental health resources. Remember: your wellbeing is essential for sustainable performance."""

        # Anxiety response
        elif any(keyword in user_input_lower for keyword in anxiety_keywords):
            return """Anxiety is your mind's way of trying to protect you, but it sounds like it's causing distress right now.

IMMEDIATE RELIEF - Progressive Muscle Relaxation:
• Tense your shoulders for 5 seconds, then release
• Clench your fists for 5 seconds, then release  
• Notice the contrast between tension and relaxation

COGNITIVE TECHNIQUE: Ask yourself - "What's one thing I can control right now?" Focus on that single action. Anxiety often comes from feeling powerless, so reclaiming control over small things helps."""

        # Depression response
        elif any(keyword in user_input_lower for keyword in depression_keywords):
            return """Thank you for sharing how you're feeling. Depression can make everything feel harder, but small steps can create meaningful change.

IMMEDIATE GENTLE ACTION:
• Acknowledge one thing you did today, however small
• Step outside or near a window for natural light
• Send a quick message to someone who cares about you

Remember: Depression lies to you about your worth and future. You matter, your feelings are valid, and professional support can make a significant difference. Consider reaching out to a counselor or your EAP services."""

        # General support
        else:
            return f"""I understand you're reaching out for support, and I'm here to help with your wellness journey.

IMMEDIATE CALMING TECHNIQUE:
• Take 3 slow, deep breaths with me right now
• Place your feet flat on the floor and feel grounded
• Notice 3 things you can see around you

Based on what you've shared ("{user_input[:50]}..."), here are some personalized suggestions:

• **Right now**: Step away from your screen for 2 minutes and stretch
• **Mindset**: Remember that asking for help shows strength, not weakness  
• **Next steps**: Consider what one small thing you can do today to care for yourself

I'm equipped with evidence-based techniques for stress, anxiety, workplace challenges, and mental health support. What specific area would you like to focus on today?

💡 *Note: For full AI-powered personalized support, ensure your DeepSeek API key is configured.*"""
    
    def get_wellness_response(self, user_input: str, context: str = "") -> str:
        """Legacy method - redirects to enhanced employee wellness response for backwards compatibility"""
        return self.get_employee_wellness_response(user_input, context)
    
    def _get_fallback_response(self, user_input: str) -> str:
        """Legacy fallback for backwards compatibility"""
        return self._get_employee_fallback_response(user_input)
    
    def _get_mood_fallback_response(self, mood: str) -> str:
        """Fallback responses for mood analysis"""
        mood_responses = {
            "Happy 😊": "That's wonderful! Your positive energy is contagious. Keep spreading that joy and remember to share it with your team!",
            "Neutral 😐": "It's okay to feel neutral. Sometimes we need a moment to reset. Try a quick stretch or take a few deep breaths to boost your energy.",
            "Stressed 😰": "I hear you, and it's completely normal to feel stressed. Let's take a moment together. Try this: inhale for 4 counts, hold for 4, exhale for 4. You've got this!"
        }
        
        return mood_responses.get(mood, "Thank you for sharing how you're feeling. Remember, every emotion is valid and temporary. I'm here to support you!")
    
    def _get_meditation_fallback_response(self, session_type: str) -> str:
        """Fallback responses for meditation guidance"""
        meditation_responses = {
            "Guided breathing": "Find a comfortable position. Close your eyes and take slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 4. Focus on your breath and let thoughts pass by like clouds.",
            "Mindfulness tips": "Start by focusing on your senses. What do you see, hear, feel, smell? Be present in this moment. Notice your thoughts without judgment and gently return to your breath.",
            "Relaxation techniques": "Progressive muscle relaxation: tense and release each muscle group from toes to head. Or try visualization - imagine a peaceful place and immerse yourself in that feeling."
        }
        
        return meditation_responses.get(session_type, "Find a quiet space, sit comfortably, and focus on your breath. Start with just 2-3 minutes and gradually increase. Every moment of mindfulness counts!") 