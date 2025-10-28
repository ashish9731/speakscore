// Service for communication skills scoring algorithm (TOEFL-style 0-30 scale)

class CommunicationScoringService {
  constructor() {
    // TOEFL-like scoring criteria weights
    this.weights = {
      fluency: 0.15,
      grammar: 0.15,
      vocabulary: 0.15,
      pronunciation: 0.15,
      intonation: 0.10,
      pacing: 0.10,
      coherence: 0.10,
      completeness: 0.10
    };
    
    // Common filler words to detect
    this.fillerWords = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'sort of', 'kind of'];
    
    // Complex sentence patterns
    this.complexPatterns = [
      /\b(because|since|although|though|while|whereas|however|therefore|consequently|furthermore)\b/i,
      /\b(if|unless|provided that|as long as|in case)\b/i,
      /\b(which|who|whom|whose|that)\b/i
    ];
    
    // Transition words for coherence
    this.transitionWords = [
      'furthermore', 'moreover', 'additionally', 'however', 'nevertheless', 
      'therefore', 'consequently', 'meanwhile', 'subsequently', 'finally',
      'firstly', 'secondly', 'thirdly', 'next', 'then', 'after', 'before',
      'in addition', 'on the other hand', 'as a result', 'for example',
      'similarly', 'likewise', 'in contrast', 'otherwise', 'thus'
    ];
  }

  // Calculate overall score based on individual component scores (TOEFL scale 0-30)
  calculateOverallScore(scores) {
    let weightedSum = 0;
    let totalWeight = 0;
    
    for (const [key, weight] of Object.entries(this.weights)) {
      if (scores[key] !== undefined) {
        weightedSum += scores[key] * weight;
        totalWeight += weight;
      }
    }
    
    const result = (weightedSum / totalWeight);
    return Math.round(result * 100) / 100; // Round to 2 decimal places
  }

  // Analyze fluency based on speech patterns (0-30 scale)
  analyzeFluency(transcript) {
    // Count filler words
    let fillerCount = 0;
    this.fillerWords.forEach(filler => {
      const regex = new RegExp('\\b' + filler + '\\b', 'gi');
      const matches = transcript.match(regex);
      if (matches) {
        fillerCount += matches.length;
      }
    });
    
    // Calculate words per minute (assuming 2 minutes average conversation)
    const words = transcript.trim().split(/\s+/);
    const wpm = words.length / 2; // Assuming 2-minute conversation
    
    // Calculate filler ratio
    const fillerRatio = words.length > 0 ? fillerCount / words.length : 0;
    
    // Score based on multiple factors:
    // 1. Low filler word ratio (40% weight)
    // 2. Appropriate speech rate 150-200 WPM (40% weight)
    // 3. Sentence length variation (20% weight)
    
    const fillerScore = Math.max(0, 30 - (fillerRatio * 200)); // Max 30, lower with more fillers
    const rateScore = wpm < 100 ? (wpm / 100) * 30 : (wpm > 250 ? (250 / wpm) * 30 : 30); // Ideal 100-250 WPM
    const sentenceLengthVariation = this.analyzeSentenceVariation(transcript);
    const variationScore = sentenceLengthVariation * 30; // Convert to 0-30 scale
    
    // Weighted average
    const score = (fillerScore * 0.4) + (rateScore * 0.4) + (variationScore * 0.2);
    
    return Math.max(0, Math.min(30, Math.round(score * 100) / 100));
  }

  // Analyze sentence length variation
  analyzeSentenceVariation(transcript) {
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0.5; // Default middle value
    
    // Calculate average and standard deviation of sentence lengths
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    
    // Simple variation metric - higher when sentences vary in length
    // Perfect score (1.0) when standard deviation is around 50% of average
    const idealDeviation = avgLength * 0.5;
    const actualDeviation = Math.sqrt(
      lengths.map(l => Math.pow(l - avgLength, 2)).reduce((a, b) => a + b, 0) / lengths.length
    );
    
    // Normalize to 0-1 scale, with 0.5 as default
    return Math.min(1, Math.max(0, 1 - (Math.abs(actualDeviation - idealDeviation) / idealDeviation)));
  }

  // Analyze grammar accuracy (0-30 scale)
  analyzeGrammar(transcript) {
    // Count complex sentence structures
    let complexStructureCount = 0;
    this.complexPatterns.forEach(pattern => {
      const matches = transcript.match(pattern);
      if (matches) {
        complexStructureCount += matches.length;
      }
    });
    
    // Count basic grammar errors (simplified detection)
    let errorCount = 0;
    
    // Detect double negatives
    const doubleNegatives = transcript.match(/\b(don't|doesn't|didn't|won't|wouldn't|can't|couldn't)\s+\b(no|not|never)\b/gi);
    if (doubleNegatives) errorCount += doubleNegatives.length;
    
    // Detect subject-verb disagreement (simplified)
    const subjectVerbErrors = transcript.match(/\b(I|we|they)\s+(has|was|is)\b|\b(he|she|it)\s+(have|were|are)\b/gi);
    if (subjectVerbErrors) errorCount += subjectVerbErrors.length;
    
    // Detect incorrect verb forms
    const incorrectVerbs = transcript.match(/\b(I|you|we|they)\s+(was|has)\b|\b(he|she|it)\s+(were|have)\b/gi);
    if (incorrectVerbs) errorCount += incorrectVerbs.length;
    
    // Calculate words per complex structure ratio
    const words = transcript.trim().split(/\s+/);
    const complexityRatio = words.length > 0 ? complexStructureCount / words.length : 0;
    
    // Score based on:
    // 1. Complex structure usage (60% weight)
    // 2. Fewer grammar errors (40% weight)
    
    const complexityScore = Math.min(30, complexityRatio * 300); // Scale up for visibility
    const errorPenalty = Math.max(0, 30 - (errorCount * 3)); // Deduct 3 points per error
    
    // Weighted average
    const score = (complexityScore * 0.6) + (errorPenalty * 0.4);
    
    return Math.max(0, Math.min(30, Math.round(score * 100) / 100));
  }

  // Analyze vocabulary richness (0-30 scale)
  analyzeVocabulary(transcript) {
    const words = transcript.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const validWords = words.filter(w => w.length > 0); // Filter out empty strings
    const uniqueWords = new Set(validWords.filter(w => w.length > 3)); // Only consider words longer than 3 chars
    const totalWords = validWords.length;
    
    if (totalWords === 0) return 15; // Default middle value
    
    // Lexical diversity ratio
    const diversity = uniqueWords.size / totalWords;
    
    // Count advanced vocabulary (simplified - looks for longer words)
    const advancedWords = [...uniqueWords].filter(word => word.length >= 8).length;
    const advancedRatio = uniqueWords.size > 0 ? advancedWords / uniqueWords.size : 0;
    
    // Score based on:
    // 1. Lexical diversity (60% weight)
    // 2. Advanced vocabulary usage (40% weight)
    
    const diversityScore = diversity * 50; // Scale to 0-30 range
    const advancedScore = advancedRatio * 60; // Scale to 0-30 range
    
    // Weighted average
    const score = (diversityScore * 0.6) + (advancedScore * 0.4);
    
    return Math.max(0, Math.min(30, Math.round(score * 100) / 100));
  }

  // Analyze pronunciation (0-30 scale) - placeholder
  analyzePronunciation(transcript) {
    // In a real implementation, this would require:
    // 1. Audio input processing
    // 2. Phonetic analysis
    // 3. Comparison with standard pronunciation
    
    // For now, we'll return a placeholder score
    // In a production system, this would be replaced with actual audio analysis
    return 22.0; // Average score placeholder
  }

  // Analyze intonation (0-30 scale) - placeholder
  analyzeIntonation(transcript) {
    // In a real implementation, this would require:
    // 1. Audio input processing
    // 2. Pitch contour analysis
    // 3. Stress pattern evaluation
    
    // For now, we'll return a placeholder score
    return 20.0; // Average score placeholder
  }

  // Analyze pacing (0-30 scale)
  analyzePacing(transcript) {
    // Calculate words per minute (assuming 2 minutes average conversation)
    const words = transcript.trim().split(/\s+/);
    const wpm = words.length / 2; // Assuming 2-minute conversation
    
    // Ideal range for speaking pace is 150-180 WPM
    // Score based on how close the pace is to ideal
    let paceScore;
    if (wpm < 100) {
      paceScore = (wpm / 100) * 30;
    } else if (wpm > 220) {
      paceScore = (220 / wpm) * 30;
    } else {
      // Within ideal range, give higher score
      paceScore = 25 + ((Math.abs(wpm - 160) < 20) ? 5 : 0);
    }
    
    return Math.max(0, Math.min(30, Math.round(paceScore * 100) / 100));
  }

  // Analyze coherence of speech (0-30 scale)
  analyzeCoherence(transcript) {
    // Count transition words that indicate coherence
    let transitionCount = 0;
    this.transitionWords.forEach(transition => {
      const regex = new RegExp('\\b' + transition + '\\b', 'gi');
      const matches = transcript.match(regex);
      if (matches) {
        transitionCount += matches.length;
      }
    });
    
    // Topic consistency - check if sentences reference previous content
    // Simplified approach: look for pronoun references
    const pronouns = transcript.match(/\b(he|she|it|they|them|this|these|those)\b/gi);
    const pronounCount = pronouns ? pronouns.length : 0;
    
    // Count question-answer patterns (user asks, bot responds, user responds)
    const userMessages = (transcript.match(/user:/g) || []).length;
    const botMessages = (transcript.match(/bot:/g) || []).length;
    const interactionScore = Math.min(30, (userMessages + botMessages) * 2);
    
    // Score based on:
    // 1. Transition word usage (40% weight)
    // 2. Pronoun/reference usage (30% weight)
    // 3. Interaction patterns (30% weight)
    
    const transitionScore = Math.min(30, transitionCount * 4); // Scale appropriately
    const referenceScore = Math.min(30, pronounCount * 3); // Three points per pronoun reference
    const interactionScoreWeighted = interactionScore * 0.3;
    
    // Weighted average
    const score = (transitionScore * 0.4) + (referenceScore * 0.3) + interactionScoreWeighted;
    
    return Math.max(0, Math.min(30, Math.round(score * 100) / 100));
  }

  // Analyze completeness of responses (0-30 scale)
  analyzeCompleteness(transcript) {
    // Count responses that seem incomplete or too short
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let incompleteCount = 0;
    
    sentences.forEach(sentence => {
      // Check for incomplete sentences (ending with words like "um", "uh", etc.)
      if (/\b(um|uh|er|ah)$/.test(sentence.trim())) {
        incompleteCount++;
      }
      
      // Check for very short responses
      const words = sentence.trim().split(/\s+/);
      if (words.length < 3 && words.length > 0) {
        incompleteCount++;
      }
    });
    
    // Calculate completeness ratio
    const completenessRatio = incompleteCount / sentences.length;
    
    // Score inversely related to incomplete ratio
    const score = Math.max(0, 30 - (completenessRatio * 60));
    
    return Math.max(0, Math.min(30, Math.round(score * 100) / 100));
  }

  // Main scoring function
  scoreTranscript(transcript, mode = 'conversational') {
    const scores = {
      fluency: this.analyzeFluency(transcript),
      grammar: this.analyzeGrammar(transcript),
      vocabulary: this.analyzeVocabulary(transcript),
      pronunciation: this.analyzePronunciation(transcript),
      intonation: this.analyzeIntonation(transcript),
      pacing: this.analyzePacing(transcript),
      coherence: this.analyzeCoherence(transcript),
      completeness: this.analyzeCompleteness(transcript)
    };
    
    scores.overall = this.calculateOverallScore(scores);
    
    // For single speaker mode, we might weight differently
    if (mode === 'single') {
      // Adjust weights for single speaker mode
      scores.overall = this.calculateOverallScore({
        ...scores,
        coherence: scores.coherence * 0.7, // Less emphasis on coherence in single speaker mode
        completeness: scores.completeness * 1.3 // More emphasis on completeness
      });
    }
    
    return scores;
  }
  
  // Generate detailed feedback based on scores
  generateFeedback(scores) {
    const feedback = {
      strengths: [],
      weaknesses: [],
      recommendations: []
    };
    
    // Fluency feedback
    if (scores.fluency >= 26) {
      feedback.strengths.push("Excellent fluency with minimal hesitation");
    } else if (scores.fluency >= 22) {
      feedback.strengths.push("Good fluency with occasional pauses");
      feedback.recommendations.push("Practice speaking continuously for 2 minutes without pausing");
    } else if (scores.fluency >= 18) {
      feedback.strengths.push("Adequate fluency");
      feedback.recommendations.push("Work on reducing filler words like 'um' and 'uh'");
    } else {
      feedback.weaknesses.push("Needs improvement in fluency and reducing filler words");
      feedback.recommendations.push("Record yourself speaking and identify filler words to reduce");
      feedback.recommendations.push("Practice timed speaking exercises daily");
    }
    
    // Grammar feedback
    if (scores.grammar >= 26) {
      feedback.strengths.push("Strong grammatical accuracy with complex structures");
    } else if (scores.grammar >= 22) {
      feedback.strengths.push("Generally accurate grammar");
      feedback.recommendations.push("Study advanced grammar structures for more variety");
    } else if (scores.grammar >= 18) {
      feedback.strengths.push("Adequate grammar accuracy");
      feedback.recommendations.push("Review complex sentence structures");
    } else {
      feedback.weaknesses.push("Grammar errors affecting clarity");
      feedback.recommendations.push("Review basic grammar rules and practice error identification");
    }
    
    // Vocabulary feedback
    if (scores.vocabulary >= 26) {
      feedback.strengths.push("Rich and varied vocabulary");
    } else if (scores.vocabulary >= 22) {
      feedback.strengths.push("Good vocabulary range");
      feedback.recommendations.push("Read diverse materials to expand vocabulary");
    } else if (scores.vocabulary >= 18) {
      feedback.strengths.push("Adequate vocabulary range");
      feedback.recommendations.push("Learn new words daily from different domains");
    } else {
      feedback.weaknesses.push("Limited vocabulary range");
      feedback.recommendations.push("Learn 5 new words daily and practice using them");
    }
    
    // Pronunciation feedback
    if (scores.pronunciation >= 26) {
      feedback.strengths.push("Clear and understandable pronunciation");
    } else if (scores.pronunciation >= 22) {
      feedback.strengths.push("Generally clear pronunciation");
      feedback.recommendations.push("Practice pronunciation of difficult sounds");
    } else if (scores.pronunciation >= 18) {
      feedback.strengths.push("Adequate pronunciation");
      feedback.recommendations.push("Focus on problematic sound combinations");
    } else {
      feedback.weaknesses.push("Pronunciation needs improvement");
      feedback.recommendations.push("Work with pronunciation guides and practice daily");
    }
    
    // Intonation feedback
    if (scores.intonation >= 26) {
      feedback.strengths.push("Good use of intonation and stress patterns");
    } else if (scores.intonation >= 22) {
      feedback.strengths.push("Adequate intonation");
      feedback.recommendations.push("Practice varying your pitch to emphasize key points");
    } else if (scores.intonation >= 18) {
      feedback.strengths.push("Basic intonation patterns");
      feedback.recommendations.push("Listen to native speakers and模仿他们的 intonation patterns");
    } else {
      feedback.weaknesses.push("Intonation could be more expressive");
      feedback.recommendations.push("Practice reading aloud with emotional expression");
    }
    
    // Pacing feedback
    if (scores.pacing >= 26) {
      feedback.strengths.push("Excellent pacing - not too fast or slow");
    } else if (scores.pacing >= 22) {
      feedback.strengths.push("Good pacing with minor adjustments needed");
      feedback.recommendations.push("Practice speaking at a consistent pace");
    } else if (scores.pacing >= 18) {
      feedback.strengths.push("Adequate pacing");
      feedback.recommendations.push("Work on maintaining steady speech rate");
    } else {
      feedback.weaknesses.push("Pacing needs improvement - work on consistency");
      feedback.recommendations.push("Use a metronome to practice consistent speaking pace");
    }
    
    // Coherence feedback
    if (scores.coherence >= 26) {
      feedback.strengths.push("Well-organized and logically structured responses");
    } else if (scores.coherence >= 22) {
      feedback.strengths.push("Generally coherent responses");
      feedback.recommendations.push("Practice using transition words between ideas");
    } else if (scores.coherence >= 18) {
      feedback.strengths.push("Adequate coherence");
      feedback.recommendations.push("Work on connecting ideas more clearly");
    } else {
      feedback.weaknesses.push("Ideas could be better organized");
      feedback.recommendations.push("Outline responses before speaking");
      feedback.recommendations.push("Use linking phrases to connect ideas");
    }
    
    // Completeness feedback
    if (scores.completeness >= 26) {
      feedback.strengths.push("Complete and well-developed responses");
    } else if (scores.completeness >= 22) {
      feedback.strengths.push("Mostly complete responses");
      feedback.recommendations.push("Ensure all points are fully explained");
    } else if (scores.completeness >= 18) {
      feedback.strengths.push("Adequate response completeness");
      feedback.recommendations.push("Work on developing ideas more fully");
    } else {
      feedback.weaknesses.push("Some responses feel incomplete");
      feedback.recommendations.push("Practice giving full, detailed answers");
    }
    
    return feedback;
  }
}

module.exports = CommunicationScoringService;