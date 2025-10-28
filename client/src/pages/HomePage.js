import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const startAssessment = () => {
    navigate('/assessment');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="header-section">
          <h1>🎤 Communication Assessment Interview Bot</h1>
          <p className="subtitle">Improve your communication skills with AI-powered assessment</p>
        </div>
        
        <div className="hero-section">
          <div className="hero-content">
            <h2>Practice Makes Perfect</h2>
            <p>Get real-time feedback on your speaking skills with our advanced AI assessment system</p>
            <button className="cta-button" onClick={startAssessment}>
              Start Your Assessment Journey
            </button>
          </div>
        </div>
        
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Conversational Mode</h3>
            <p>Practice real conversations with natural voice responses. Engage in back-and-forth dialogues to improve your interactive communication skills.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Single Speaker Mode</h3>
            <p>Speak on various topics and get detailed analysis of your fluency, grammar, vocabulary, and pronunciation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>TOEFL-style Scoring</h3>
            <p>Get scored on a 0-30 scale for fluency, grammar, vocabulary, pronunciation, and overall communication skills.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-powered Feedback</h3>
            <p>Receive personalized recommendations and detailed breakdown of your strengths and areas for improvement.</p>
          </div>
        </div>
        
        <div className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Select Mode</h3>
              <p>Choose between conversational practice or topic-based speaking</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Speak Naturally</h3>
              <p>Respond to questions or speak on topics using your microphone</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Feedback</h3>
              <p>Receive instant analysis and personalized improvement recommendations</p>
            </div>
          </div>
        </div>
        
        <div className="testimonials">
          <h2>What Our Users Say</h2>
          <div className="testimonial">
            <p>"This tool helped me improve my interview skills tremendously. The feedback was spot-on!"</p>
            <p className="author">- Sarah K., Job Seeker</p>
          </div>
          <div className="testimonial">
            <p>"The conversational mode feels like talking to a real interviewer. Highly recommended!"</p>
            <p className="author">- Michael T., ESL Student</p>
          </div>
        </div>
        
        <button className="start-button" onClick={startAssessment}>
          Begin Your Assessment Now
        </button>
      </div>
    </div>
  );
};

export default HomePage;