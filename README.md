# Communication Assessment Interview Bot

A comprehensive application for assessing communication skills through conversational AI. This application evaluates users' speaking abilities based on TOEFL-like criteria and provides detailed feedback through an analytics dashboard.

## Features

- Conversational AI interview bot
- Real-time communication assessment
- Google TTS integration for Indian English
- TOEFL-style scoring system
- Detailed analytics dashboard
- OpenAI-powered analysis
- Responsive web interface

## Tech Stack

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: React.js, React Router
- **AI Services**: Google Cloud Text-to-Speech, OpenAI GPT-3.5 Turbo
- **Real-time Communication**: WebSocket (Socket.IO)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud account for TTS service
- OpenAI API key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
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

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Google Cloud credentials path
   - Add your OpenAI API key

## Usage

1. Start the development server:
   ```bash
   npm run dev:full
   ```

2. Open your browser to `http://localhost:3000`

3. Begin the assessment by speaking with the interview bot

4. View your detailed analysis on the dashboard

## Project Structure

```
├── client/                 # React frontend
│   ├── public/             # Static assets
│   └── src/                # Source code
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── utils/          # Utility functions
├── controllers/            # Request handlers
├── routes/                 # API routes
├── services/               # Business logic and external services
├── .env                    # Environment variables
├── server.js               # Entry point
└── package.json            # Project dependencies
```

## Components

### 1. Interview Bot
The conversational AI that conducts the assessment interview, simulating a real interview scenario.

### 2. Scoring Engine
Analyzes speech patterns and provides scores based on:
- Fluency and Coherence
- Grammar Range and Accuracy
- Lexical Resource
- Pronunciation
- Overall Communication Skills

### 3. Analytics Dashboard
Provides detailed insights including:
- Overall and component scores
- Strengths and weaknesses
- Personalized recommendations
- Conversation history

## API Endpoints

- `POST /api/start` - Initialize assessment session
- `POST /api/analysis` - Get communication analysis
- `POST /api/feedback` - Submit user feedback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Cloud Text-to-Speech for voice synthesis
- OpenAI for language analysis capabilities
- TOEFL for assessment criteria inspiration