// Quiz Logic for Annuities
let selectedQuestions = [];
let userAnswers = [];
let quizSubmitted = false;

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Play soft ding sound for correct answers
function playDingSound() {
  // Create a simple beep using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    // Silently fail if audio is not supported
    console.log('Audio not supported');
  }
}

// Initialize quiz
function initializeQuiz() {
  // Select 10 random questions
  selectedQuestions = shuffleArray(questionBank).slice(0, 10);
  
  // Shuffle options for each question
  selectedQuestions = selectedQuestions.map(q => {
    const correctAnswer = q.options[q.correct];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
    
    return {
      question: q.question,
      options: shuffledOptions,
      correct: newCorrectIndex
    };
  });
  
  // Initialize user answers array
  userAnswers = new Array(10).fill(null);
  quizSubmitted = false;
  
  // Render questions
  renderQuestions();
  
  // Show progress section and submit button
  document.getElementById('progressSection').classList.remove('hidden');
  document.getElementById('submitBtn').classList.remove('hidden');
  document.getElementById('submitBtn').disabled = true;
  document.getElementById('scoreSummary').classList.add('hidden');
  document.getElementById('retryBtn').classList.add('hidden');
  
  // Update progress
  updateProgress();
}

// Render questions
function renderQuestions() {
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';
  
  selectedQuestions.forEach((q, qIndex) => {
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.id = `question-${qIndex}`;
    questionCard.style.opacity = '0';
    questionCard.style.transform = 'translateY(20px)';
    
    const questionNumber = document.createElement('span');
    questionNumber.className = 'question-number';
    questionNumber.textContent = `Question ${qIndex + 1} of 10`;
    
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = q.question;
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    q.options.forEach((option, oIndex) => {
      const optionLabel = document.createElement('label');
      optionLabel.className = 'option-label';
      optionLabel.id = `q${qIndex}-opt${oIndex}`;
      
      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = `question-${qIndex}`;
      radioInput.value = oIndex;
      radioInput.onchange = () => selectOption(qIndex, oIndex);
      
      const optionText = document.createElement('span');
      optionText.className = 'option-text';
      optionText.textContent = `${String.fromCharCode(65 + oIndex)}. ${option}`;
      
      optionLabel.appendChild(radioInput);
      optionLabel.appendChild(optionText);
      optionsContainer.appendChild(optionLabel);
    });
    
    questionCard.appendChild(questionNumber);
    questionCard.appendChild(questionText);
    questionCard.appendChild(optionsContainer);
    container.appendChild(questionCard);
    
    // Animate card appearance with stagger effect
    setTimeout(() => {
      questionCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      questionCard.style.opacity = '1';
      questionCard.style.transform = 'translateY(0)';
    }, qIndex * 100);
  });
}

// Handle option selection
function selectOption(questionIndex, optionIndex) {
  userAnswers[questionIndex] = optionIndex;
  
  // Update visual selection
  const allOptions = document.querySelectorAll(`input[name="question-${questionIndex}"]`);
  allOptions.forEach((input, idx) => {
    const label = document.getElementById(`q${questionIndex}-opt${idx}`);
    if (idx === optionIndex) {
      label.classList.add('selected');
    } else {
      label.classList.remove('selected');
    }
  });
  
  // Check if all questions are answered
  checkAllAnswered();
  updateProgress();
}

// Check if all questions are answered
function checkAllAnswered() {
  const allAnswered = userAnswers.every(answer => answer !== null);
  document.getElementById('submitBtn').disabled = !allAnswered;
}

// Update progress bar
function updateProgress() {
  const answeredCount = userAnswers.filter(a => a !== null).length;
  const percentage = (answeredCount / 10) * 100;
  
  document.getElementById('progressText').textContent = `Answered ${answeredCount} of 10 questions`;
  document.getElementById('progressBar').style.width = `${percentage}%`;
}

// Submit quiz
function submitQuiz() {
  if (quizSubmitted) return;
  
  quizSubmitted = true;
  let score = 0;
  let correctCount = 0;
  
  // Calculate score and show feedback
  selectedQuestions.forEach((q, qIndex) => {
    const userAnswer = userAnswers[qIndex];
    const isCorrect = userAnswer === q.correct;
    
    if (isCorrect) {
      score++;
      correctCount++;
    }
    
    // Update visual feedback with animation delay
    setTimeout(() => {
      q.options.forEach((option, oIndex) => {
        const label = document.getElementById(`q${qIndex}-opt${oIndex}`);
        const input = label.querySelector('input');
        input.disabled = true;
        
        if (oIndex === q.correct) {
          label.classList.add('correct');
          // Play ding sound for correct answers
          if (isCorrect && oIndex === userAnswer) {
            playDingSound();
          }
        } else if (oIndex === userAnswer && !isCorrect) {
          label.classList.add('incorrect');
        }
        
        // Remove selected class if not correct
        if (oIndex !== q.correct && oIndex !== userAnswer) {
          label.classList.remove('selected');
        }
      });
    }, qIndex * 150);
  });
  
  // Display score after all animations
  setTimeout(() => {
    displayScore(score);
  }, selectedQuestions.length * 150 + 300);
  
  // Hide submit button, show retry button
  document.getElementById('submitBtn').classList.add('hidden');
  document.getElementById('retryBtn').classList.remove('hidden');
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Display score summary
function displayScore(score) {
  const percentage = (score / 10) * 100;
  const scoreSummary = document.getElementById('scoreSummary');
  const scoreText = document.getElementById('scoreText');
  const scorePercentage = document.getElementById('scorePercentage');
  const scoreMessage = document.getElementById('scoreMessage');
  
  scoreText.textContent = `You scored ${score} out of 10!`;
  scorePercentage.textContent = `${percentage}%`;
  
  // Set message based on score
  let message = '';
  if (percentage === 100) {
    message = '🌟 Perfect score! You have mastered Annuities concepts!';
  } else if (percentage >= 80) {
    message = '🎉 Excellent work! You have a strong understanding of Annuities!';
  } else if (percentage >= 60) {
    message = '👍 Good job! Keep practicing to improve your understanding.';
  } else if (percentage >= 40) {
    message = '📚 You\'re getting there! Review the lessons and try again.';
  } else {
    message = '💪 Keep studying! Review the Annuities lessons carefully.';
  }
  
  scoreMessage.textContent = message;
  scoreSummary.classList.remove('hidden');
}

// Retry quiz
function retryQuiz() {
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Fade out current questions
  const container = document.getElementById('questionsContainer');
  container.style.transition = 'opacity 0.3s ease';
  container.style.opacity = '0';
  
  // Reinitialize quiz after fade out
  setTimeout(() => {
    container.style.opacity = '1';
    initializeQuiz();
  }, 300);
}

// Initialize quiz on page load
window.addEventListener('DOMContentLoaded', () => {
  initializeQuiz();
});
