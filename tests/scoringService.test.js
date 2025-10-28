// Test file for scoring service

const CommunicationScoringService = require('../services/scoringService');

// Create an instance of the scoring service
const scoringService = new CommunicationScoringService();

// Test transcript with better coherence
const testTranscript = `
user: Hello, my name is John. I'm here for the communication assessment.
bot: Nice to meet you, John. Can you tell me about your educational background?
user: I studied computer science at the university. I graduated last year. Furthermore, I specialized in artificial intelligence and machine learning.
bot: That's great. What kind of projects did you work on during your studies?
user: I worked on several projects. Firstly, I developed a web application for task management. Secondly, I created a machine learning model for image recognition. Moreover, I collaborated with a team to build a mobile app.
bot: I see. Can you tell me more about your work experience?
user: Well, I've been working at a tech company for the past year. My role involves developing software applications. In addition, I participate in code reviews and mentor junior developers. Consequently, I've improved my technical and communication skills.
bot: That sounds fulfilling. What would you say is your biggest strength in communication?
user: I think my biggest strength is listening to others. Therefore, I try to understand their perspective before responding. Moreover, I use clear and concise language to express my ideas.
`;

console.log('Testing Communication Scoring Service (TOEFL-style 0-30 scale)...\n');

// Score the transcript
const scores = scoringService.scoreTranscript(testTranscript);

console.log('Scores (0-30 scale):');
console.log('- Overall:', scores.overall);
console.log('- Fluency:', scores.fluency);
console.log('- Grammar:', scores.grammar);
console.log('- Vocabulary:', scores.vocabulary);
console.log('- Pronunciation:', scores.pronunciation);
console.log('- Intonation:', scores.intonation);
console.log('- Pacing:', scores.pacing);
console.log('- Coherence:', scores.coherence);
console.log('- Completeness:', scores.completeness);

// Generate feedback
const feedback = scoringService.generateFeedback(scores);

console.log('\nFeedback:');
console.log('Strengths:');
feedback.strengths.forEach((strength, index) => {
  console.log(`${index + 1}. ${strength}`);
});

console.log('\nWeaknesses:');
feedback.weaknesses.forEach((weakness, index) => {
  console.log(`${index + 1}. ${weakness}`);
});

console.log('\nRecommendations:');
feedback.recommendations.forEach((recommendation, index) => {
  console.log(`${index + 1}. ${recommendation}`);
});

// Test single speaker mode
console.log('\n\nTesting Single Speaker Mode...\n');
const singleSpeakerScores = scoringService.scoreTranscript(testTranscript, 'single');
console.log('Single Speaker Mode Scores:');
console.log('- Overall:', singleSpeakerScores.overall);
console.log('- Fluency:', singleSpeakerScores.fluency);
console.log('- Grammar:', singleSpeakerScores.grammar);
console.log('- Vocabulary:', singleSpeakerScores.vocabulary);