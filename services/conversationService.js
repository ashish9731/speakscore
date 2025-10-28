// Service for handling conversation flow and speech recognition

class ConversationService {
  constructor() {
    this.sessions = new Map(); // Store active conversation sessions
  }

  // Initialize a new conversation session
  initSession(sessionId, userId) {
    const session = {
      id: sessionId,
      userId: userId,
      startTime: new Date(),
      conversation: [],
      currentState: 'greeting',
      assessmentMode: 'conversational', // Default mode
      scores: {
        fluency: 0,
        grammar: 0,
        vocabulary: 0,
        pronunciation: 0,
        intonation: 0,
        pacing: 0,
        coherence: 0,
        completeness: 0,
        overall: 0
      }
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  // Add a message to the conversation
  addMessage(sessionId, speaker, message, timestamp = new Date()) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    const messageObj = {
      speaker,
      message,
      timestamp
    };
    
    session.conversation.push(messageObj);
    return messageObj;
  }

  // Generate bot response based on user input and assessment mode
  generateBotResponse(userMessage, currentState, mode = 'conversational') {
    // This would typically integrate with an NLP service or AI model
    // For now, we'll use rule-based responses
    
    let response = "";
    let nextState = currentState;
    
    if (mode === 'single') {
      // Single speaker mode - give a topic and let user speak
      switch (currentState) {
        case 'greeting':
          response = "Hello! Welcome to the Communication Assessment. In Single Speaker mode, I'll give you a topic and you'll have 2 minutes to speak about it. Let's begin. Your first topic is: Describe your ideal job and why you're interested in it. When you're ready, click the Start Speaking button and begin.";
          nextState = 'topic1';
          break;
          
        case 'topic1':
          response = "Great! Now, let's talk about your educational background. Please describe your educational journey and how it has prepared you for your career goals. Take your time and speak clearly.";
          nextState = 'topic2';
          break;
          
        case 'topic2':
          response = "Interesting! Now, tell me about a challenge you've faced and how you overcame it. Be specific about the situation and your approach to solving it.";
          nextState = 'topic3';
          break;
          
        case 'topic3':
          response = "Thank you for sharing that. Finally, what are your goals for the future? Please describe both your short-term and long-term aspirations.";
          nextState = 'topic4';
          break;
          
        case 'topic4':
          response = "That's wonderful! We've completed the Single Speaker assessment. You can now view your detailed analysis on the dashboard. Click the 'End Assessment' button to see your results.";
          nextState = 'completed';
          break;
          
        default:
          response = "Please continue speaking about the topic. Try to elaborate on your points and provide specific examples.";
      }
    } else {
      // Conversational mode - interactive interview
      switch (currentState) {
        case 'greeting':
          response = "Hello! Welcome to the Communication Assessment Interview. I'm here to have a conversation with you to evaluate your communication skills. Let's begin. Please tell me about yourself, including your background and interests.";
          nextState = 'introduction';
          break;
          
        case 'introduction':
          response = "That's a great introduction. Now, I'd like to know more about your educational background. Can you tell me about your studies and any academic achievements that you're proud of?";
          nextState = 'education';
          break;
          
        case 'education':
          response = "Interesting! Now let's talk about your work experience. What kind of work have you been doing, and what have you learned from these experiences?";
          nextState = 'work';
          break;
          
        case 'work':
          response = "That sounds fulfilling. Let's discuss your communication skills. How do you usually communicate with your colleagues, and can you give me an example of a time when effective communication was crucial?";
          nextState = 'communication';
          break;
          
        case 'communication':
          response = "Good to know. Now, let's talk about challenges. What's the biggest challenge you've faced in your career, and how did you overcome it? Please walk me through your thought process.";
          nextState = 'challenge';
          break;
          
        case 'challenge':
          response = "Thank you for sharing that. Finally, what are your goals for the future? How do you plan to achieve them, and how will this assessment help you?";
          nextState = 'future';
          break;
          
        case 'future':
          response = "That's wonderful! We've covered a lot of ground in our conversation. Thank you for participating in this assessment. You can now view your detailed analysis on the dashboard. Click the 'End Assessment' button to see your results.";
          nextState = 'completed';
          break;
          
        default:
          response = "That's interesting. Could you tell me more about that? I'd like to understand your perspective better.";
      }
    }
    
    return {
      message: response,
      nextState: nextState
    };
  }

  // Get conversation history for a session
  getConversation(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    return session.conversation;
  }

  // Get session data
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  // Update session scores
  updateScores(sessionId, scores) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.scores = { ...session.scores, ...scores };
    return session.scores;
  }

  // End session
  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.endTime = new Date();
    session.duration = (session.endTime - session.startTime) / 1000; // in seconds
    
    return session;
  }
}

module.exports = ConversationService;