# Communication Assessment Interview Bot

A speech-to-speech and speech-to-text communication assessment application that evaluates users' speaking skills through conversation. The application supports two assessment modes:

1. **Conversational Mode**: Speech-to-speech processing with natural voice responses
2. **Single Speaker Mode**: Speech-to-text processing with detailed analysis

## Features

- **Speech-to-Speech Assessment**: Users speak and receive natural voice responses
- **Speech-to-Text Assessment**: Users speak and receive text analysis
- **TOEFL-style Scoring**: Detailed scoring from 0-30 for multiple communication aspects
- **AI-powered Analysis**: OpenAI Whisper for transcription, GPT-3.5 Turbo for analysis
- **Real-time Feedback**: Immediate feedback on speaking performance
- **Comprehensive Dashboard**: Detailed breakdown of strengths and areas for improvement
- **Enhanced Voice Selection**: Improved natural voice quality using advanced Web Speech API
- **Accurate Scoring Algorithm**: Refined scoring with better accuracy and error handling

## Technologies Used

- **Frontend**: React.js with Socket.IO client
- **Backend**: Node.js with Express.js
- **Speech Processing**: Web Speech API (free) for text-to-speech with enhanced voice selection
- **Speech Recognition**: MediaRecorder API for audio capture
- **AI Analysis**: OpenAI Whisper for transcription, GPT-3.5 Turbo for analysis
- **Real-time Communication**: Socket.IO for WebSocket connections
- **Enhanced Scoring**: Improved TOEFL-style scoring algorithm with better accuracy

## Assessment Modes

### Conversational Mode
- Interactive back-and-forth conversation
- Natural voice responses using Web Speech API
- Real-time speech processing
- Comprehensive communication evaluation

### Single Speaker Mode
- Monologue on provided topics
- Speech-to-text transcription
- Detailed analysis of speaking performance
- Focus on fluency, grammar, vocabulary, and pronunciation

## Scoring System

TOEFL-style scoring (0-30 scale) for:
- Fluency and Coherence
- Grammar Range and Accuracy
- Lexical Resource/Vocabulary
- Pronunciation
- Overall Communication Skills

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Modern browser with Web Speech API and MediaRecorder support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ashish9731/speakscore.git
cd speakscore
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory with your OpenAI API key:
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
PORT=5001
CORS_ORIGIN=http://localhost:3000
```

**Important:** Replace `your_actual_openai_api_key_here` with your actual OpenAI API key. Without a valid API key, the application will use mock data and will not process real speech.

### Running the Application

#### Development Mode
```bash
# Run both frontend and backend
npm run dev:full

# Run backend only
npm run dev

# Run frontend only
npm run client
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

### Testing Without API Key
If you don't have an OpenAI API key, the application will still run but will use mock data for transcription and analysis. This allows you to test the UI and workflow without incurring API costs.

## API Usage

### OpenAI Whisper (Speech-to-Text)
- Model: whisper-1
- Used for transcribing user speech
- Requires valid API key for real transcription

### OpenAI GPT-3.5 Turbo (Analysis)
- Model: gpt-3.5-turbo
- Used for conversation analysis and scoring
- Requires valid API key for real analysis

## Troubleshooting

### Common Issues

1. **Buttons not working**: Check that both frontend and backend servers are running, and that the ports are correctly configured.

2. **Microphone access denied**: Ensure your browser has permission to access the microphone and that you're using HTTPS in production.

3. **API key errors**: Verify that your OpenAI API key is correctly set in the .env file and that it has the necessary permissions.

4. **Voice not playing**: Some browsers have restrictions on automatic audio playback. User interaction may be required.

### Build Issues
If you encounter build issues, make sure:
1. All dependencies are installed: `npm install` in both root and client directories
2. The client/public directory contains the required files (index.html, manifest.json, etc.)
3. Your OpenAI API key is valid and has the necessary permissions

### Deployment Issues
If deployment fails on Vercel:
1. Check that your environment variables are correctly set
2. Ensure your OpenAI API key is added to Vercel environment variables
3. Verify that the build process completes successfully locally

## Deployment

### Vercel Deployment

This application is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your `OPENAI_API_KEY` as an environment variable in Vercel
4. Deploy!

The application will automatically build and deploy with the proper configuration.

### Environment Variables for Production

- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Set to "production"
- `PORT`: Vercel will automatically set this

## Project Structure

```
├── client/                 # React frontend
│   ├── public/             # Public assets (index.html, favicon, etc.)
│   ├── src/
│   │   ├── pages/          # Assessment and Dashboard pages
│   │   ├── components/     # Reusable components
│   │   └── App.js          # Main application component
│   └── package.json        # Frontend dependencies
├── services/               # Backend services
│   ├── openaiService.js    # OpenAI API integration
│   ├── conversationService.js # Conversation logic
│   └── scoringService.js   # Scoring algorithms
├── routes/                 # API routes
├── controllers/            # Route controllers
├── middleware/             # Express middleware
├── models/                 # Data models
├── tests/                  # Unit tests
├── server.js              # Main server file
├── vercel.json            # Vercel deployment configuration
└── package.json           # Backend dependencies
```

## Browser Support

The application works best in modern browsers that support:
- Web Speech API (for text-to-speech)
- MediaRecorder API (for audio recording)
- WebSocket (for real-time communication)

Recommended browsers:
- Google Chrome 60+
- Microsoft Edge 79+
- Firefox 25+
- Safari 14.1+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on GitHub.

## Recent Enhancements

### Voice Quality Improvements
- Enhanced Web Speech API implementation with better voice selection
- Improved speech parameters for more natural sound
- Platform-specific voice preferences for optimal quality

### Scoring Algorithm Refinements
- Improved accuracy across all scoring metrics
- Better handling of edge cases and minimal transcripts
- Enhanced error detection and scoring consistency

### User Experience Enhancements
- Improved dashboard with color-coded scores
- Better conversation flow with clearer instructions
- Enhanced error handling and graceful degradation
