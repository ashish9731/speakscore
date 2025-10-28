import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssessmentPage from './pages/AssessmentPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  const [conversation, setConversation] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <AssessmentPage 
              conversation={conversation} 
              setConversation={setConversation}
              setAnalysis={setAnalysis}
            />
          } />
          <Route path="/dashboard" element={
            <DashboardPage 
              analysis={analysis} 
              conversation={conversation}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;