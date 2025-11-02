// Quiz Logic
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

// Initialize quiz
function initializeQuiz() {
  // Select 10 random questions while preserving image property
  selectedQuestions = shuffleArray(questionBank)
    .slice(0, 10)
    .map(q => {
      const correctAnswer = q.options[q.correct];
      const shuffledOptions = shuffleArray(q.options);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
      
      return {
        question: q.question,
        image: q.image, // Preserve image property
        options: shuffledOptions,
        correct: newCorrectIndex
      };
    });
  
  // Initialize other quiz state
  userAnswers = new Array(10).fill(null);
  quizSubmitted = false;
  
  // Render questions
  renderQuestions();
  
  // Show UI elements
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
    
    // Question number
    const questionNumber = document.createElement('span');
    questionNumber.className = 'question-number';
    questionNumber.textContent = `Question ${qIndex + 1} of 10`;
    
    // Question text
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = q.question;
    
    // Add image if present
    if (q.image) {
      const questionImage = document.createElement('img');
      questionImage.src = `images/${q.image}`; // Assuming images are in images folder
      questionImage.alt = 'Question diagram';
      questionImage.className = 'question-image';
      questionImage.loading = 'lazy'; // Lazy load images
      questionText.appendChild(questionImage);
    }
    
    // Options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    // Create options
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
    
    // Assemble question card
    questionCard.appendChild(questionNumber);
    questionCard.appendChild(questionText);
    questionCard.appendChild(optionsContainer);
    container.appendChild(questionCard);
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
  
  // Calculate score and show feedback
  selectedQuestions.forEach((q, qIndex) => {
    const userAnswer = userAnswers[qIndex];
    const isCorrect = userAnswer === q.correct;
    
    if (isCorrect) {
      score++;
    }
    
    // Update visual feedback
    q.options.forEach((option, oIndex) => {
      const label = document.getElementById(`q${qIndex}-opt${oIndex}`);
      const input = label.querySelector('input');
      input.disabled = true;
      
      if (oIndex === q.correct) {
        label.classList.add('correct');
      } else if (oIndex === userAnswer && !isCorrect) {
        label.classList.add('incorrect');
      }
      
      // Remove selected class if not correct
      if (oIndex !== q.correct && oIndex !== userAnswer) {
        label.classList.remove('selected');
      }
    });
  });
  
  // Display score
  displayScore(score);
  
  // Hide submit button, show retry button
  document.getElementById('submitBtn').classList.add('hidden');
  document.getElementById('retryBtn').classList.remove('hidden');
  
  // Scroll to top
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
    message = '🌟 Perfect score! You have mastered Interest concepts!';
  } else if (percentage >= 80) {
    message = '🎉 Excellent work! You have a strong understanding of Interest!';
  } else if (percentage >= 60) {
    message = '👍 Good job! Keep practicing to improve your understanding.';
  } else if (percentage >= 40) {
    message = '📚 You\'re getting there! Review the lessons and try again.';
  } else {
    message = '💪 Keep studying! Review the Interest lessons carefully.';
  }
  
  scoreMessage.textContent = message;
  scoreSummary.classList.remove('hidden');
}

// Retry quiz
function retryQuiz() {
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Reinitialize quiz
  setTimeout(() => {
    initializeQuiz();
  }, 300);
}

// Initialize quiz on page load
window.addEventListener('DOMContentLoaded', () => {
  initializeQuiz();
});