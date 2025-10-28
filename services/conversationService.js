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
          response = "Hello! Welcome to the Communication Assessment. In Single Speaker mode, I'll give you a topic and you'll have 2 minutes to speak about it. Let's begin. Your first topic is: Describe your ideal job and why you're interested in it.";
          nextState = 'topic1';
          break;
          
        case 'topic1':
          response = "Great! Now, let's talk about your educational background. Please describe your educational journey and how it has prepared you for your career goals.";
          nextState = 'topic2';
          break;
          
        case 'topic2':
          response = "Interesting! Now, tell me about a challenge you've faced and how you overcame it.";
          nextState = 'topic3';
          break;
          
        case 'topic3':
          response = "Thank you for sharing that. Finally, what are your goals for the future?";
          nextState = 'topic4';
          break;
          
        case 'topic4':
          response = "That's wonderful! We've completed the Single Speaker assessment. You can now view your detailed analysis on the dashboard.";
          nextState = 'completed';
          break;
          
        default:
          response = "Please continue speaking about the topic.";
      }
    } else {
      // Conversational mode - interactive interview
      switch (currentState) {
        case 'greeting':
          response = "Hello! Welcome to the Communication Assessment Interview. Let's begin. Please tell me about yourself.";
          nextState = 'introduction';
          break;
          
        case 'introduction':
          response = "That's a great introduction. Now, I'd like to know more about your educational background. Can you tell me about your studies?";
          nextState = 'education';
          break;
          
        case 'education':
          response = "Interesting! Now let's talk about your work experience. What kind of work have you been doing?";
          nextState = 'work';
          break;
          
        case 'work':
          response = "That sounds fulfilling. Let's discuss your communication skills. How do you usually communicate with your colleagues?";
          nextState = 'communication';
          break;
          
        case 'communication':
          response = "Good to know. Now, let's talk about challenges. What's the biggest challenge you've faced in your career?";
          nextState = 'challenge';
          break;
          
        case 'challenge':
          response = "Thank you for sharing that. Finally, what are your goals for the future?";
          nextState = 'future';
          break;
          
        case 'future':
          response = "That's wonderful! We've covered a lot of ground. Thank you for participating in this assessment. You can now view your detailed analysis on the dashboard.";
          nextState = 'completed';
          break;
          
        default:
          response = "That's interesting. Tell me more about that.";
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