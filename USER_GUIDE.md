# User Guide: Communication Assessment Interview Bot

## Getting Started

Welcome to the Communication Assessment Interview Bot! This application helps you improve your communication skills through AI-powered assessment in two modes:

1. **Conversational Mode**: Practice real conversations with natural voice responses
2. **Single Speaker Mode**: Speak on topics and get detailed analysis

## System Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Microphone access
- Stable internet connection
- OpenAI API key (for backend processing)

## Starting the Application

### For Developers
```bash
# Start the backend server
npm start

# In a new terminal, start the frontend
cd client
npm start
```

### For Users
1. Open your web browser
2. Navigate to the application URL (typically http://localhost:3000)
3. Allow microphone permissions when prompted

## Using the Application

### 1. Home Page
When you first open the application, you'll see a beautiful home page with:
- Application overview
- Feature highlights
- How-it-works guide
- User testimonials
- Start assessment button

Click the "Begin Your Assessment Now" button to proceed.

### 2. Assessment Mode Selection
You'll be presented with two assessment modes:

#### Conversational Mode
- **Purpose**: Practice interactive conversations
- **Process**: 
  1. System asks questions
  2. You respond verbally
  3. System responds with natural voice
  4. Back-and-forth conversation
- **Best for**: Interview practice, casual conversation skills

#### Single Speaker Mode
- **Purpose**: Topic-based speaking assessment
- **Process**:
  1. System provides speaking topics
  2. You speak continuously on the topic
  3. Speech is analyzed for skills
- **Best for**: Public speaking, presentation practice

### 3. During Assessment

#### Starting Recording
1. Click the "Start Speaking" button
2. Speak naturally into your microphone
3. The button will change to "Stop Speaking"

#### During Recording
- Your speech is being captured and processed
- For conversational mode, you'll hear responses
- Indicator shows recording is active

#### Stopping Recording
1. Click the "Stop Speaking" button
2. System processes your speech
3. For conversational mode, you'll get a response

#### Ending Assessment
1. Click the "End Assessment" button
2. System completes analysis
3. You're redirected to the dashboard

### 4. Dashboard Results

After completing an assessment, you'll see detailed results including:

#### TOEFL-style Scores (0-30 scale)
- **Fluency and Coherence**
- **Grammar Range and Accuracy**
- **Lexical Resource/Vocabulary**
- **Pronunciation**
- **Overall Communication Skills**

#### Detailed Analysis
- **Strengths**: What you did well
- **Areas for Improvement**: Specific skills to work on
- **Recommendations**: Personalized suggestions

#### Conversation History
- Full transcript of your conversation
- System responses
- Timestamps (if applicable)

## Tips for Best Results

### Microphone Setup
1. Use a quality microphone or headset
2. Ensure you're in a quiet environment
3. Position microphone at appropriate distance
4. Test microphone before starting

### Speaking Tips
1. Speak clearly and at a natural pace
2. Don't worry about perfection - focus on natural communication
3. For conversational mode, treat it like a real conversation
4. For single speaker mode, speak continuously for 1-2 minutes

### Technical Tips
1. Keep browser tab active during assessment
2. Don't close the browser window during processing
3. Ensure stable internet connection
4. Allow notifications and microphone permissions

## Troubleshooting Common Issues

### "Disconnected" Status
- **Cause**: Backend server not running or connection issues
- **Solution**: 
  1. Check that backend server is running on port 5001
  2. Refresh the page
  3. Check browser console for errors

### Microphone Not Working
- **Cause**: Permissions not granted or device issues
- **Solution**:
  1. Check browser permissions for microphone
  2. Ensure no other application is using microphone
  3. Test microphone in system settings
  4. Try a different browser

### No Audio Response (Conversational Mode)
- **Cause**: Browser doesn't support Web Speech API or muted
- **Solution**:
  1. Check that speakers/headphones are not muted
  2. Ensure browser supports Web Speech API
  3. Check browser console for speech synthesis errors

### Slow Processing
- **Cause**: Internet connection or server load
- **Solution**:
  1. Check internet connection speed
  2. Wait for processing to complete
  3. Refresh page if it seems stuck

### Assessment Not Completing
- **Cause**: Server errors or incomplete data
- **Solution**:
  1. Click "End Assessment" to force completion
  2. Check browser console for errors
  3. Restart the application

## Browser Compatibility

### Fully Supported
- **Google Chrome** (Version 60+)
- **Microsoft Edge** (Version 79+)
- **Mozilla Firefox** (Version 25+)
- **Safari** (Version 14.1+)

### Features by Browser
| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Speech Recording | ✅ | ✅ | ✅ | ✅ |
| Speech Synthesis | ✅ | ✅ | ✅ | ⚠️ Limited |
| WebSocket | ✅ | ✅ | ✅ | ✅ |
| Audio Processing | ✅ | ✅ | ✅ | ✅ |

## Privacy and Data

### Data Collection
- Audio recordings are processed temporarily
- No permanent storage of audio files
- Conversation transcripts are used for analysis only
- Personal data is not collected or stored

### Data Processing
- Audio is sent to backend server for processing
- OpenAI APIs are used for transcription and analysis
- Data is not shared with third parties
- All processing happens in real-time

## Support

### Getting Help
If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all system requirements are met
4. Contact support with detailed error information

### Reporting Issues
When reporting issues, include:
- Browser and version
- Operating system
- Error messages from console
- Steps to reproduce the issue
- Screenshots if applicable

## Feedback and Improvement

We're constantly working to improve the Communication Assessment Interview Bot. Your feedback helps us make the application better for everyone.

### How to Provide Feedback
1. Use the application and note your experience
2. Report issues through the proper channels
3. Suggest new features or improvements
4. Share your success stories

Thank you for using the Communication Assessment Interview Bot!