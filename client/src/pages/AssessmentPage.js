import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './AssessmentPage.css';

let socket;

const AssessmentPage = ({ conversation, setConversation, setAnalysis }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [assessmentMode, setAssessmentMode] = useState('conversational'); // Default mode
  const [showModeSelector, setShowModeSelector] = useState(true);
  const [isSupported, setIsSupported] = useState(true);
  const navigate = useNavigate();
  const conversationEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });
    
    socket.on('authenticated', (data) => {
      console.log('Authenticated:', data);
    });
    
    socket.on('mode_set', (data) => {
      console.log('Mode set:', data);
      setAssessmentMode(data.mode);
    });
    
    socket.on('bot_response', (data) => {
      console.log('Bot response:', data);
      
      // For conversational mode, use natural voice (Web Speech API)
      if (data.shouldGenerateAudio && assessmentMode === 'conversational') {
        speakText(data.message);
      }
      
      setConversation(prev => [...prev, { speaker: 'bot', message: data.message }]);
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
    });
    
    socket.on('assessment_complete', (data) => {
      console.log('Assessment complete:', data);
      // Pass analysis data to parent component
      setAnalysis(data);
      // Redirect to dashboard
      navigate('/dashboard');
    });
    
    socket.on('error', (data) => {
      console.error('Server error:', data);
      alert(`Error: ${data.message}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });
    
    // Authenticate user (in a real app, this would use a real token)
    socket.emit('authenticate', { user: { id: 'user123', username: 'Test User' } });
    
    // Check if media recording is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
    
    return () => {
      socket.disconnect();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      // Cancel any ongoing speech
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, [assessmentMode]);
  
  useEffect(() => {
    // Scroll to bottom of conversation
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const speakText = (text) => {
    if (!speechSynthesisRef.current) {
      console.warn('Speech synthesis not available');
      return;
    }
    
    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();
    
    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice to a natural-sounding voice (if available)
    const voices = speechSynthesisRef.current.getVoices();
    const naturalVoices = voices.filter(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Natural') || voice.name.includes('Premium') || voice.name.includes('Enhanced'))
    );
    
    if (naturalVoices.length > 0) {
      utterance.voice = naturalVoices[0];
    } else {
      // Fallback to any English voice
      const englishVoices = voices.filter(voice => voice.lang.includes('en'));
      if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0];
      }
    }
    
    // Set speech parameters for more natural sound
    utterance.rate = 1.0;  // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Speak the text
    speechSynthesisRef.current.speak(utterance);
  };

  const startAssessment = (mode) => {
    setAssessmentMode(mode);
    setShowModeSelector(false);
    
    // Set assessment mode on server
    socket.emit('set_assessment_mode', { mode });
    
    // Start assessment
    socket.emit('start_assessment', { mode });
  };

  const initializeMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        // Send audio to server for processing
        socket.emit('user_audio', { audio: base64Audio });
        
        // Clean up
        audioChunksRef.current = [];
      };
      
      return mediaRecorder;
    } catch (error) {
      console.error('Error initializing media recorder:', error);
      throw error;
    }
  };

  const startListening = async () => {
    if (isListening) {
      // Stop listening
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
      return;
    }
    
    try {
      // Start listening
      const mediaRecorder = await initializeMediaRecorder();
      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting media recording:', error);
      alert('Error accessing microphone: ' + error.message);
      setIsListening(false);
    }
  };

  const endAssessment = () => {
    // Stop media recording if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Cancel any ongoing speech
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    
    // Send end assessment signal to server
    socket.emit('end_assessment', {});
  };

  return (
    <div className="assessment-container">
      <h1>Communication Assessment Interview Bot</h1>
      
      {!isSupported && (
        <div className="browser-warning">
          <p>⚠️ Audio recording is not supported in your browser. Please use a modern browser like Chrome or Edge.</p>
        </div>
      )}
      
      {showModeSelector && (
        <div className="mode-selector">
          <h2>Select Assessment Mode</h2>
          <div className="mode-options">
            <button 
              className="mode-button conversational"
              onClick={() => startAssessment('conversational')}
            >
              <h3>Conversational Mode</h3>
              <p>Natural voice conversation with back-and-forth</p>
            </button>
            <button 
              className="mode-button single"
              onClick={() => startAssessment('single')}
            >
              <h3>Single Speaker Mode</h3>
              <p>Speech-to-text analysis on given topics</p>
            </button>
          </div>
        </div>
      )}
      
      {!showModeSelector && (
        <>
          <div className="mode-indicator">
            Current Mode: <strong>{assessmentMode === 'conversational' ? 'Conversational (Natural Voice)' : 'Single Speaker (Speech-to-Text)'}</strong>
          </div>
          
          <div className="connection-status">
            {isConnected ? (
              <span className="status-connected">● Connected</span>
            ) : (
              <span className="status-disconnected">● Disconnected</span>
            )}
          </div>
          
          <div className="conversation-history">
            {conversation.map((item, index) => (
              <div key={index} className={`message ${item.speaker}-message`}>
                <strong>{item.speaker === 'user' ? 'You' : 'Interviewer'}:</strong> {item.message}
              </div>
            ))}
            <div ref={conversationEndRef} />
          </div>
          
          <div className="input-area">
            <button 
              onClick={startListening} 
              disabled={!isConnected || !isSupported}
              className={isListening ? "listening" : ""}
            >
              {isListening ? '⏹️ Stop Speaking' : '🎤 Start Speaking'}
            </button>
            <button onClick={endAssessment} className="end-button">
              End Assessment
            </button>
          </div>
          
          <div className="instructions">
            <h3>How it works:</h3>
            <ul>
              {assessmentMode === 'conversational' ? (
                <>
                  <li>Click "Start Speaking" and respond to the interviewer's questions</li>
                  <li>Your speech will be recorded and transcribed</li>
                  <li>The interviewer will respond with natural synthesized speech</li>
                  <li>Have a conversation with the interview bot</li>
                </>
              ) : (
                <>
                  <li>Click "Start Speaking" and speak on the given topic</li>
                  <li>Your speech will be recorded and transcribed for analysis</li>
                  <li>Speak continuously for the full time allowed</li>
                </>
              )}
              <li>Click "Stop Speaking" to pause recording</li>
              <li>Click "End Assessment" when you're finished</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentPage;