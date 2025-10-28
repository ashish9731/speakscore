const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for audio data
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

// Import services
const ConversationService = require('./services/conversationService');
const CommunicationScoringService = require('./services/scoringService');
const { analyzeConversation, transcribeAudio } = require('./services/openaiService');

// Initialize services
const conversationService = new ConversationService();
const scoringService = new CommunicationScoringService();

// Import routes
const apiRoutes = require('./routes/api');

// Use routes
app.use('/api', apiRoutes);

// Socket.io connection handling with authentication
io.use((socket, next) => {
  // In a real implementation, we would verify the token here
  // For now, we'll allow all connections
  next();
});

io.on('connection', (socket) => {
  console.log('New client connected');
  let currentSessionId = null;
  let currentUser = null;
  let assessmentMode = 'conversational'; // Default mode
  
  socket.on('authenticate', (data) => {
    // In a real implementation, we would verify the token
    // For now, we'll just accept any authentication
    currentUser = data.user || { id: 'anonymous', username: 'Anonymous User' };
    socket.emit('authenticated', { success: true, user: currentUser });
  });
  
  socket.on('set_assessment_mode', (data) => {
    assessmentMode = data.mode || 'conversational';
    socket.emit('mode_set', { success: true, mode: assessmentMode });
  });
  
  socket.on('start_assessment', (data) => {
    console.log('Assessment started:', data);
    
    // Set assessment mode if provided
    if (data.mode) {
      assessmentMode = data.mode;
   
    
 }
    
    // Create a new session
    currentSessionId = uuidv4();
    const session = conversationService.initSession(currentSessionId, currentUser?.id || 'anonymous');
    session.assessmentMode = assessmentMode;
    
    // Generate initial bot response
    const botResponse = conversationService.generateBotResponse('', session.currentState, assessmentMode);
    
    // Add bot message to conversation
    conversationService.addMessage(currentSessionId, 'bot', botResponse.message);
    
    // For conversational mode, we'll send text and indicate audio should be generated
    // For single speaker mode, no bot response needed
    
    // Emit response to client
    const responseToSend = {
      message: botResponse.message,
      sessionId: currentSessionId,
      shouldGenerateAudio: assessmentMode === 'conversational'
    };
    
    socket.emit('bot_response', responseToSend);
  });
  
  socket.on('user_audio', async (data) => {
    if (!currentSessionId) {
      socket.emit('error', { message: 'No active session found' });
      return;
    }
    
    try {
      console.log('User audio received, length:', data.audio?.length);
      
      // Convert base64 audio to buffer
      const audioBuffer = Buffer.from(data.audio, 'base64');
      
      let transcript = '';
      
      // Transcribe audio using OpenAI Whisper
      transcript = await transcribeAudio(audioBuffer);
      console.log('Transcribed text:', transcript);
      
      // Add user message to conversation
      conversationService.addMessage(currentSessionId, 'user', transcript);
      
      // Get current session
      const session = conversationService.getSession(currentSessionId);
      
      // Generate bot response
      const botResponse = conversationService.generateBotResponse(transcript, session.currentState, session.assessmentMode);
      
      // Update session state
      session.currentState = botResponse.nextState;
      
      // Add bot message to conversation
      conversationService.addMessage(currentSessionId, 'bot', botResponse.message);
      
      // Prepare response for client
      let responseToSend = {
        message: botResponse.message,
        sessionId: currentSessionId,
        shouldGenerateAudio: session.assessmentMode === 'conversational'
      };
      
      // Emit response to client
      socket.emit('bot_response', responseToSend);
      
      // If assessment is completed, send analysis
      if (botResponse.nextState === 'completed') {
        // Get full conversation
        const conversation = conversationService.getConversation(currentSessionId);
        
        // Convert conversation to text for analysis
        const conversationText = conversation.map(msg => 
          `${msg.speaker}: ${msg.message}`
        ).join('\n');
        
        // Score the conversation with our algorithm using the selected mode
        const algorithmScores = scoringService.scoreTranscript(conversationText, session.assessmentMode);
        
        // Generate detailed feedback from our algorithm
        const algorithmFeedback = scoringService.generateFeedback(algorithmScores);
        
        // Get AI-powered analysis
        let aiAnalysis;
        try {
          aiAnalysis = await analyzeConversation(conversation);
        } catch (error) {
          console.error('Error getting AI analysis:', error);
          // Fallback to algorithm-based analysis
          aiAnalysis = {
            scores: {
              fluency: {score: algorithmScores.fluency, explanation: "Algorithm-based score", examples: []},
              grammar: {score: algorithmScores.grammar, explanation: "Algorithm-based score", examples: []},
              vocabulary: {score: algorithmScores.vocabulary, explanation: "Algorithm-based score", examples: []},
              pronunciation: {score: algorithmScores.pronunciation, explanation: "Algorithm-based score (estimated)", examples: []},
              overall: {score: algorithmScores.overall, explanation: "Overall algorithm-based score"}
            },
            breakdown: algorithmFeedback
          };
        }
        
        // Update session scores
        conversationService.updateScores(currentSessionId, {
          ...algorithmScores,
          aiAnalysis: aiAnalysis,
          assessmentMode: session.assessmentMode
        });
        
        // End session
        conversationService.endSession(currentSessionId);
        
        // Send analysis to client
        socket.emit('assessment_complete', {
          scores: algorithmScores,
          aiAnalysis: aiAnalysis,
          conversation: conversation,
          assessmentMode: session.assessmentMode
        });
      }
    } catch (error) {
      console.error('Error processing user audio:', error);
      socket.emit('error', { message: 'Error processing audio: ' + error.message });
    }
  });
  
  socket.on('end_assessment', async () => {
    if (!currentSessionId) {
      socket.emit('error', { message: 'No active session found' });
      return;
    }
    
    // Get current session
    const session = conversationService.getSession(currentSessionId);
    
    // If we haven't completed the assessment flow, force completion
    if (session.currentState !== 'completed') {
      // Get full conversation
      const conversation = conversationService.getConversation(currentSessionId);
      
      // Convert conversation to text for analysis
      const conversationText = conversation.map(msg => 
        `${msg.speaker}: ${msg.message}`
      ).join('\n');
      
      // Score the conversation with our algorithm using the selected mode
      const algorithmScores = scoringService.scoreTranscript(conversationText, session.assessmentMode);
      
      // Generate detailed feedback from our algorithm
      const algorithmFeedback = scoringService.generateFeedback(algorithmScores);
      
      // Get AI-powered analysis
      let aiAnalysis;
      try {
        aiAnalysis = await analyzeConversation(conversation);
      } catch (error) {
        console.error('Error getting AI analysis:', error);
        // Fallback to algorithm-based analysis
        aiAnalysis = {
          scores: {
            fluency: {score: algorithmScores.fluency, explanation: "Algorithm-based score", examples: []},
            grammar: {score: algorithmScores.grammar, explanation: "Algorithm-based score", examples: []},
            vocabulary: {score: algorithmScores.vocabulary, explanation: "Algorithm-based score", examples: []},
            pronunciation: {score: algorithmScores.pronunciation, explanation: "Algorithm-based score (estimated)", examples: []},
            overall: {score: algorithmScores.overall, explanation: "Overall algorithm-based score"}
          },
          breakdown: algorithmFeedback
        };
      }
      
      // Update session scores
      conversationService.updateScores(currentSessionId, {
        ...algorithmScores,
        aiAnalysis: aiAnalysis,
        assessmentMode: session.assessmentMode
      });
      
      // End session
      conversationService.endSession(currentSessionId);
      
      // Send analysis to client
      socket.emit('assessment_complete', {
        scores: algorithmScores,
        aiAnalysis: aiAnalysis,
        conversation: conversation,
        assessmentMode: session.assessmentMode
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;