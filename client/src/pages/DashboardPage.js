import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = ({ analysis, conversation }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Use real analysis data passed from parent component
    if (analysis) {
      setDashboardData(analysis);
    }
  }, [analysis]);

  const restartAssessment = () => {
    navigate('/');
  };

  if (!dashboardData) {
    return <div className="dashboard-container">Loading analysis...</div>;
  }

  // Function to get score category (Low, Medium, High)
  const getScoreCategory = (score) => {
    if (score >= 26) return 'high';
    if (score >= 22) return 'medium';
    return 'low';
  };

  // Function to get score description
  const getScoreDescription = (score) => {
    if (score >= 26) return 'Excellent';
    if (score >= 22) return 'Good';
    if (score >= 18) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="dashboard-container">
      <h1>Communication Assessment Dashboard</h1>
      
      <div className="assessment-mode">
        <h2>Assessment Mode: 
          <span className={dashboardData.assessmentMode === 'conversational' ? 'conversational' : 'single'}>
            {dashboardData.assessmentMode === 'conversational' ? ' Conversational' : ' Single Speaker'}
          </span>
        </h2>
      </div>
      
      <div className="score-overview">
        <div className="overall-score">
          <h2>Overall Score</h2>
          <div className="score-value">{dashboardData.scores.overall}/30</div>
          <div className="score-description">{getScoreDescription(dashboardData.scores.overall)}</div>
        </div>
      </div>
      
      <div className="score-grid">
        <div className={`score-item ${getScoreCategory(dashboardData.scores.fluency)}`}>
          <h3>Fluency</h3>
          <div className="score-value">{dashboardData.scores.fluency}/30</div>
        </div>
        <div className={`score-item ${getScoreCategory(dashboardData.scores.pronunciation)}`}>
          <h3>Pronunciation</h3>
          <div className="score-value">{dashboardData.scores.pronunciation}/30</div>
        </div>
        <div className={`score-item ${getScoreCategory(dashboardData.scores.grammar)}`}>
          <h3>Grammar</h3>
          <div className="score-value">{dashboardData.scores.grammar}/30</div>
        </div>
        <div className={`score-item ${getScoreCategory(dashboardData.scores.vocabulary)}`}>
          <h3>Vocabulary</h3>
          <div className="score-value">{dashboardData.scores.vocabulary}/30</div>
        </div>
        <div className={`score-item ${getScoreCategory(dashboardData.scores.coherence)}`}>
          <h3>Coherence</h3>
          <div className="score-value">{dashboardData.scores.coherence}/30</div>
        </div>
        <div className={`score-item ${getScoreCategory(dashboardData.scores.completeness)}`}>
          <h3>Completeness</h3>
          <div className="score-value">{dashboardData.scores.completeness}/30</div>
        </div>
      </div>
      
      {dashboardData.aiAnalysis && (
        <>
          <div className="strengths-section">
            <h2>Strengths</h2>
            <div className="strengths-grid">
              {dashboardData.aiAnalysis.breakdown?.strengths?.map((strength, index) => (
                <div key={index} className="strength-item">
                  <span className="strength-icon">✓</span>
                  <span className="strength-text">{strength}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="ai-analysis-section">
            <h2>AI-Powered Analysis</h2>
            <div className="ai-score-details">
              <div className="ai-score-item">
                <h3>Fluency & Coherence</h3>
                <div className="score-value">{dashboardData.aiAnalysis.scores?.fluency?.score || dashboardData.scores.fluency}/30</div>
                <p>{dashboardData.aiAnalysis.scores?.fluency?.explanation || "Analysis pending"}</p>
              </div>
              
              <div className="ai-score-item">
                <h3>Grammar Accuracy</h3>
                <div className="score-value">{dashboardData.aiAnalysis.scores?.grammar?.score || dashboardData.scores.grammar}/30</div>
                <p>{dashboardData.aiAnalysis.scores?.grammar?.explanation || "Analysis pending"}</p>
              </div>
              
              <div className="ai-score-item">
                <h3>Vocabulary Range</h3>
                <div className="score-value">{dashboardData.aiAnalysis.scores?.vocabulary?.score || dashboardData.scores.vocabulary}/30</div>
                <p>{dashboardData.aiAnalysis.scores?.vocabulary?.explanation || "Analysis pending"}</p>
              </div>
            </div>
          </div>
          
          <div className="improvements-section">
            <h2>Areas to Improve</h2>
            <div className="improvements-grid">
              {dashboardData.aiAnalysis.breakdown?.weaknesses?.map((weakness, index) => (
                <div key={index} className="improvement-item">
                  <span className="improvement-icon">⚠️</span>
                  <span className="improvement-text">{weakness}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="recommendations">
            <h2>Personalized Recommendations</h2>
            <ul>
              {dashboardData.aiAnalysis.breakdown?.recommendations?.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      
      <div className="conversation-summary">
        <h2>Conversation Summary</h2>
        <div className="conversation-text">
          {conversation && conversation.length > 0 ? (
            conversation.map((item, index) => (
              <div key={index} className={`message ${item.speaker}-message`}>
                <strong>{item.speaker === 'user' ? 'You' : 'Interviewer'}:</strong> {item.message}
              </div>
            ))
          ) : (
            <p>No conversation data available.</p>
          )}
        </div>
      </div>
      
      <div className="actions">
        <button onClick={restartAssessment}>Restart Assessment</button>
      </div>
    </div>
  );
};

export default DashboardPage;