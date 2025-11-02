// Formula Builder Challenge - BIZMATH Game Logic
// Part 1: Formula Database and Core Functions

const formulaDatabase = [
  // ---------------- SIMPLE INTEREST ----------------
  {
    id: 1,
    category: "Simple Interest",
    formula: "I_s = P \\times r \\times t",
    display: "$$I_s = P \\times r \\times t$$",
    description: "Finds the simple interest earned or charged on a principal over time.",
    solvedFor: "I_s",
    variables: {
      I_s: "Simple Interest",
      P: "Principal (initial amount)",
      r: "Rate of interest (in decimal form)",
      t: "Time (in years)"
    },
    blanks: ["I_s", "P", "r", "t"],
    difficulty: "easy"
  },
  {
    id: 2,
    category: "Simple Interest",
    formula: "F = P + I_s",
    display: "$$F = P + I_s$$",
    description: "Computes the future or maturity value in simple interest.",
    solvedFor: "F",
    variables: {
      F: "Future (Maturity) Value",
      P: "Principal",
      I_s: "Simple Interest"
    },
    blanks: ["F", "P", "I_s"],
    difficulty: "easy"
  },
  {
    id: 3,
    category: "Simple Interest",
    formula: "F = P(1 + r t)",
    display: "$$F = P(1 + r t)$$",
    description: "Alternative formula to find the future value directly.",
    solvedFor: "F",
    variables: {
      F: "Future Value",
      P: "Principal",
      r: "Rate (decimal form)",
      t: "Time (years)"
    },
    blanks: ["F", "P", "r", "t"],
    difficulty: "medium"
  },
  {
    id: 4,
    category: "Simple Interest",
    formula: "P = \\frac{I_s}{r t}",
    display: "$$P = \\frac{I_s}{r t}$$",
    description: "Finds the principal when interest, rate, and time are known.",
    solvedFor: "P",
    variables: {
      P: "Principal",
      I_s: "Simple Interest",
      r: "Rate",
      t: "Time"
    },
    blanks: ["P", "I_s", "r", "t"],
    difficulty: "medium"
  },
  {
    id: 5,
    category: "Simple Interest",
    formula: "P = F - I_s",
    display: "$$P = F - I_s$$",
    description: "Finds the principal using the future value and interest.",
    solvedFor: "P",
    variables: {
      P: "Principal",
      F: "Future Value",
      I_s: "Simple Interest"
    },
    blanks: ["P", "F", "I_s"],
    difficulty: "easy"
  },
  {
    id: 6,
    category: "Simple Interest",
    formula: "r = \\frac{I_s}{P t}",
    display: "$$r = \\frac{I_s}{P t}$$",
    description: "Computes the simple interest rate.",
    solvedFor: "r",
    variables: {
      r: "Rate (decimal form)",
      I_s: "Simple Interest",
      P: "Principal",
      t: "Time"
    },
    blanks: ["r", "I_s", "P", "t"],
    difficulty: "medium"
  },
  {
    id: 7,
    category: "Simple Interest",
    formula: "t = \\frac{I_s}{P r}",
    display: "$$t = \\frac{I_s}{P r}$$",
    description: "Computes the time needed to earn or pay a certain interest.",
    solvedFor: "t",
    variables: {
      t: "Time (in years)",
      I_s: "Simple Interest",
      P: "Principal",
      r: "Rate"
    },
    blanks: ["t", "I_s", "P", "r"],
    difficulty: "medium"
  },
  {
    id: 8,
    category: "Compound Interest",
    formula: "F = P(1 + i)^n",
    display: "$$F = P(1 + i)^n$$",
    description: "Computes the future value in compound interest given principal, rate per conversion, and number of conversions.",
    solvedFor: "F",
    variables: {
      F: "Future Value",
      P: "Principal (initial amount)",
      i: "Rate per conversion period",
      n: "Total number of conversion periods"
    },
    blanks: ["F", "P", "i", "n"],
    difficulty: "medium"
  },
  {
    id: 9,
    category: "Compound Interest",
    formula: "P = \\frac{F}{(1 + i)^n}",
    display: "$$P = \\frac{F}{(1 + i)^n}$$",
    description: "Finds the principal when future value, rate, and time are known.",
    solvedFor: "P",
    variables: {
      P: "Principal (present value)",
      F: "Future Value",
      i: "Rate per conversion period",
      n: "Total number of conversion periods"
    },
    blanks: ["P", "F", "i", "n"],
    difficulty: "medium"
  },
  {
    id: 10,
    category: "Compound Interest",
    formula: "r = m\\left[(\\frac{F}{P})^{\\frac{1}{n}} - 1\\right]",
    display: "$$r = m\\left[\\left(\\frac{F}{P}\\right)^{\\frac{1}{n}} - 1\\right]$$",
    description: "Finds the nominal annual rate given the future and present values, total conversions, and frequency of compounding.",
    solvedFor: "r",
    variables: {
      r: "Nominal Annual Rate",
      F: "Future Value",
      P: "Principal",
      n: "Total number of conversions",
      m: "Frequency of conversion per year"
    },
    blanks: ["r", "F", "P", "n", "m"],
    difficulty: "hard"
  },
  {
    id: 11,
    category: "Compound Interest",
    formula: "i = \\frac{r}{m}",
    display: "$$i = \\frac{r}{m}$$",
    description: "Computes the rate per conversion period.",
    solvedFor: "i",
    variables: {
      i: "Rate per conversion period",
      r: "Nominal annual rate",
      m: "Frequency of conversion per year"
    },
    blanks: ["i", "r", "m"],
    difficulty: "easy"
  },
  {
    id: 12,
    category: "Compound Interest",
    formula: "n = m \\times t",
    display: "$$n = m \\times t$$",
    description: "Determines the total number of compounding periods.",
    solvedFor: "n",
    variables: {
      n: "Total number of conversion periods",
      m: "Frequency of conversion per year",
      t: "Time in years"
    },
    blanks: ["n", "m", "t"],
    difficulty: "easy"
  },
  {
    id: 13,
    category: "Compound Interest",
    formula: "t = \\frac{\\log(\\frac{F}{P})}{m \\log(1 + i)}",
    display: "$$t = \\frac{\\log\\left(\\frac{F}{P}\\right)}{m \\log(1 + i)}$$",
    description: "Computes the time in years required for an investment to reach its future value.",
    solvedFor: "t",
    variables: {
      t: "Time in years",
      F: "Future Value",
      P: "Principal",
      i: "Rate per conversion period",
      m: "Frequency of conversion per year"
    },
    blanks: ["t", "F", "P", "i", "m"],
    difficulty: "hard"
  },
  {
    id: 14,
    category: "Compound Interest",
    formula: "I_c = F - P",
    display: "$$I_c = F - P$$",
    description: "Computes the total compound interest earned or accumulated.",
    solvedFor: "I_c",
    variables: {
      I_c: "Compound Interest",
      F: "Future Value",
      P: "Principal"
    },
    blanks: ["I_c", "F", "P"],
    difficulty: "easy"
  },
    {
    id: 15,
    category: "Simple Annuity",
    formula: "F = R\\left[\\frac{(1 + i)^n - 1}{i}\\right]",
    display: "$$F = R\\left[\\frac{(1 + i)^n - 1}{i}\\right]$$",
    description: "Computes the future value of a simple (ordinary) annuity given regular payments, interest rate, and number of periods.",
    solvedFor: "F",
    variables: {
      F: "Future Value of the Annuity",
      R: "Regular Payment",
      i: "Rate per period",
      n: "Total number of payments"
    },
    blanks: ["F", "R", "i", "n"],
    difficulty: "medium"
  },
  {
    id: 16,
    category: "Simple Annuity",
    formula: "P = R\\left[\\frac{1 - (1 + i)^{-n}}{i}\\right]",
    display: "$$P = R\\left[\\frac{1 - (1 + i)^{-n}}{i}\\right]$$",
    description: "Finds the present value of a simple (ordinary) annuity based on regular payments, rate per period, and number of periods.",
    solvedFor: "P",
    variables: {
      P: "Present Value of the Annuity",
      R: "Regular Payment",
      i: "Rate per period",
      n: "Total number of payments"
    },
    blanks: ["P", "R", "i", "n"],
    difficulty: "medium"
  },
  {
    id: 17,
    category: "Simple Annuity",
    formula: "R = \\frac{F \\times i}{(1 + i)^n - 1}",
    display: "$$R = \\frac{F \\times i}{(1 + i)^n - 1}$$",
    description: "Finds the regular payment given the future value, interest rate, and number of periods.",
    solvedFor: "R",
    variables: {
      R: "Regular Payment",
      F: "Future Value",
      i: "Rate per period",
      n: "Total number of payments"
    },
    blanks: ["R", "F", "i", "n"],
    difficulty: "hard"
  },
  {
    id: 18,
    category: "Simple Annuity",
    formula: "R = \\frac{P \\times i}{1 - (1 + i)^{-n}}",
    display: "$$R = \\frac{P \\times i}{1 - (1 + i)^{-n}}$$",
    description: "Computes the regular payment given the present value, rate per period, and number of periods.",
    solvedFor: "R",
    variables: {
      R: "Regular Payment",
      P: "Present Value",
      i: "Rate per period",
      n: "Total number of payments"
    },
    blanks: ["R", "P", "i", "n"],
    difficulty: "hard"
  },
  {
    id: 19,
    category: "Simple Annuity",
    formula: "F = R\\left[\\frac{(1 + \\frac{r}{m})^{mt} - 1}{\\frac{r}{m}}\\right]",
    display: "$$F = R\\left[\\frac{(1 + \\frac{r}{m})^{mt} - 1}{\\frac{r}{m}}\\right]$$",
    description: "Expanded form of the future value formula showing relationship between nominal rate, compounding frequency, and time.",
    solvedFor: "F",
    variables: {
      F: "Future Value",
      R: "Regular Payment",
      r: "Nominal Annual Interest Rate",
      m: "Frequency of conversion per year",
      t: "Time in years"
    },
    blanks: ["F", "R", "r", "m", "t"],
    difficulty: "hard"
  },
    {
    id: 20,
    category: "General Annuity",
    formula: "i_2 = (1 + i_1)^{\\frac{c}{p}} - 1",
    display: "$$i_2 = (1 + i_1)^{\\frac{c}{p}} - 1$$",
    description: "Converts an interest rate per compounding period (i₁) to an equivalent rate per payment period (i₂).",
    solvedFor: "i_2",
    variables: {
      i_2: "Equivalent rate per payment period",
      i_1: "Rate per compounding period",
      c: "Number of compounding periods per year",
      p: "Number of payments per year"
    },
    blanks: ["i_2", "i_1", "c", "p"],
    difficulty: "medium"
  },
  {
    id: 21,
    category: "General Annuity",
    formula: "P = R\\left[\\frac{1 - (1 + i_2)^{-n}}{i_2}\\right]",
    display: "$$P = R\\left[\\frac{1 - (1 + i_2)^{-n}}{i_2}\\right]$$",
    description: "Computes the present value of a general annuity after converting the rate to match the payment period.",
    solvedFor: "P",
    variables: {
      P: "Present Value of the Annuity",
      R: "Regular Payment",
      i_2: "Equivalent interest rate per payment period",
      n: "Total number of payments"
    },
    blanks: ["P", "R", "i_2", "n"],
    difficulty: "hard"
  },
    {
    id: 22,
    category: "Deferred Annuity",
    formula: "P = R\\left[\\frac{1 - (1 + i)^{-(k + n)}}{i}\\right] - R\\left[\\frac{1 - (1 + i)^{-k}}{i}\\right]",
    display: "$$P = R\\left[\\frac{1 - (1 + i)^{-(k + n)}}{i}\\right] - R\\left[\\frac{1 - (1 + i)^{-k}}{i}\\right]$$",
    description: "Calculates the present value of a deferred annuity — payments begin after a deferral period (k).",
    solvedFor: "P",
    variables: {
      P: "Present Value of the Deferred Annuity",
      R: "Regular Payment",
      i: "Interest rate per period",
      k: "Deferral period (number of deferred payments)",
      n: "Number of payments after deferral"
    },
    blanks: ["P", "R", "i", "k", "n"],
    difficulty: "expert"
  }
];


// Game state - removed difficulty, now fully randomized
let gameState = {mode: null, score: 0, streak: 0, bestStreak: 0, currentQuestion: 0, totalQuestions: 10, timeRemaining: 60, timerInterval: null, questionStartTime: null, fastestAnswer: Infinity, correctAnswers: 0, incorrectAnswers: 0, masteredFormulas: [], reviewFormulas: [], currentFormula: null, selectedAnswer: null, questions: [], usedFormulaIds: []};

const motivationalQuotes = ["Practice makes progress!", "Every formula mastered is a step toward success!", "You're building mathematical confidence!", "Keep going - you're doing great!", "Mathematics is the language of business!", "Your hard work is paying off!", "Learning is a journey, not a destination!", "Each mistake is a learning opportunity!", "You're becoming a business math expert!", "Consistency is the key to mastery!"];

// Helper Functions
function shuffleArray(array) {const newArray = [...array]; for (let i = newArray.length - 1; i > 0; i--) {const j = Math.floor(Math.random() * (i + 1)); [newArray[i], newArray[j]] = [newArray[j], newArray[i]];} return newArray;}
function getRandomElement(array) {return array[Math.floor(Math.random() * array.length)];}

// Escape special regex characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Replace only the first occurrence of a substring
function replaceFirst(str, find, replace) {
    const index = str.indexOf(find);
    if (index === -1) return str;
    return str.substring(0, index) + replace + str.substring(index + find.length);
}

// Render MathJax with proper error handling
function renderMath() {
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise().catch((err) => console.log('MathJax error:', err));
    }
}

function showScreen(screenId) {document.querySelectorAll('.screen').forEach(screen => {screen.classList.remove('active');}); document.getElementById(screenId).classList.add('active');}
function playSound(type) {const audioContext = new (window.AudioContext || window.webkitAudioContext)(); const oscillator = audioContext.createOscillator(); const gainNode = audioContext.createGain(); oscillator.connect(gainNode); gainNode.connect(audioContext.destination); if (type === 'correct') {oscillator.frequency.value = 800; gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);} else if (type === 'incorrect') {oscillator.frequency.value = 200; gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);} oscillator.start(audioContext.currentTime); oscillator.stop(audioContext.currentTime + 0.3);}
function showScorePopup(points) {const popup = document.getElementById('scorePopup'); popup.textContent = `+${points} XP`; popup.classList.add('show'); setTimeout(() => {popup.classList.remove('show');}, 600);}
// Difficulty system removed - now using fully randomized selection

function startGame(mode) {
    // Initialize game state
    gameState.mode = mode; 
    gameState.score = 0; 
    gameState.streak = 0; 
    gameState.bestStreak = 0; 
    gameState.currentQuestion = 0; 
    gameState.correctAnswers = 0; 
    gameState.incorrectAnswers = 0; 
    gameState.masteredFormulas = []; 
    gameState.reviewFormulas = []; 
    gameState.fastestAnswer = Infinity;
    gameState.usedFormulaIds = []; // Track used formulas to prevent repeats
    
    // Set question count and time based on mode
    if (mode === 'quick') {
        gameState.totalQuestions = 20; 
        gameState.timeRemaining = 60;
    } else {
        gameState.totalQuestions = 10; 
        gameState.timeRemaining = 300;
    }
    
    generateQuestions(); 
    showScreen('gameScreen'); 
    startTimer(); 
    loadQuestion();
}

// Generate randomized questions with balanced category distribution
function generateQuestions() {
    gameState.questions = [];
    let availableFormulas = [...formulaDatabase]; // Use all formulas, no difficulty filter
    let lastCategory = null; // Track last category to avoid repetition
    
    for (let i = 0; i < gameState.totalQuestions; i++) {
        let selectedFormula;
        let attempts = 0;
        const maxAttempts = 50;
        
        // Select a formula that:
        // 1. Hasn't been used yet (if possible)
        // 2. Is from a different category than the last question (if possible)
        do {
            selectedFormula = getRandomElement(availableFormulas);
            attempts++;
            
            // If we've tried too many times, accept any formula
            if (attempts >= maxAttempts) break;
            
            // Check if formula hasn't been used AND is from different category
            const notUsed = !gameState.usedFormulaIds.includes(selectedFormula.id);
            const differentCategory = lastCategory === null || selectedFormula.category !== lastCategory;
            
            if (notUsed && differentCategory) break;
            
            // If all formulas used, reset the used list
            if (gameState.usedFormulaIds.length >= formulaDatabase.length) {
                gameState.usedFormulaIds = [];
            }
        } while (attempts < maxAttempts);
        
        // Mark formula as used
        gameState.usedFormulaIds.push(selectedFormula.id);
        lastCategory = selectedFormula.category;
        
        // Randomize question type
        let questionType;
        if (gameState.mode === 'quick') {
            // Quick mode: random mix of all types
            questionType = getRandomElement(['build', 'match', 'variable']);
        } else {
            // Other modes: use the selected mode
            questionType = gameState.mode;
        }
        
        gameState.questions.push({
            formula: selectedFormula,
            type: questionType
        });
    }
}

function startTimer() {
    updateTimerDisplay();
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        if (gameState.timeRemaining <= 0) {endGame();}
    }, 1000);
}

function updateTimerDisplay() {
    const timerText = document.getElementById('timerDisplay');
    const timerFill = document.getElementById('timerFill');
    const maxTime = gameState.mode === 'quick' ? 60 : 300;
    const percentage = (gameState.timeRemaining / maxTime) * 100;
    timerText.textContent = `${gameState.timeRemaining}s`;
    timerFill.style.width = `${percentage}%`;
    if (percentage < 20) {timerFill.classList.add('warning');} else {timerFill.classList.remove('warning');}
}

function addTime(seconds) {gameState.timeRemaining += seconds; updateTimerDisplay();}

function loadQuestion() {
    if (gameState.currentQuestion >= gameState.totalQuestions) {endGame(); return;}
    gameState.questionStartTime = Date.now(); gameState.selectedAnswer = null;
    const question = gameState.questions[gameState.currentQuestion];
    gameState.currentFormula = question.formula;
    document.getElementById('scoreDisplay').textContent = gameState.score;
    document.getElementById('streakDisplay').textContent = `${gameState.streak}🔥`;
    document.getElementById('questionCount').textContent = `${gameState.currentQuestion + 1}/${gameState.totalQuestions}`;
    document.getElementById('categoryDisplay').textContent = question.formula.category;
    // Display "Random Mode" instead of difficulty level
    const difficultyBadge = document.getElementById('difficultyBadge');
    if (difficultyBadge) {
        difficultyBadge.textContent = 'Random Mode';
    }
    const feedback = document.getElementById('feedbackMessage');
    feedback.className = 'feedback-message'; feedback.textContent = '';
    if (question.type === 'build') {loadBuildQuestion(question.formula);} else if (question.type === 'match') {loadMatchQuestion(question.formula);} else if (question.type === 'variable') {loadVariableQuestion(question.formula);}
    renderMath();
}

function loadBuildQuestion(formula) {
    document.getElementById('questionText').textContent = 'Complete the formula:';
    document.getElementById('questionSubtext').textContent = formula.description;
    
    // Select one variable to hide as the blank
    const blanks = shuffleArray(formula.blanks);
    const blankToFill = blanks[0];
    
    // Get the TeX formula (remove $$ delimiters)
    let texFormula = formula.display.replace(/^\$\$/, '').replace(/\$\$$/, '');
    
    // Create a placeholder for the blank using \boxed{\phantom{...}}
    const placeholder = `\\boxed{\\phantom{${blankToFill}}}`;
    
    // Replace the first occurrence of the variable with the placeholder
    // Handle subscripts like I_s, i_1, i_2, P_s, P_m, B_k
    let modifiedFormula = texFormula;
    let replacementMade = false;
    
    if (blankToFill.includes('_')) {
        // Variable with subscript - search for exact match
        const index = texFormula.indexOf(blankToFill);
        if (index !== -1) {
            modifiedFormula = texFormula.substring(0, index) + placeholder + texFormula.substring(index + blankToFill.length);
            replacementMade = true;
        }
    } else {
        // Simple variable - use word boundaries to avoid replacing inside other variables
        const regex = new RegExp(`\\b${escapeRegExp(blankToFill)}\\b`);
        if (regex.test(texFormula)) {
            modifiedFormula = texFormula.replace(regex, placeholder);
            replacementMade = true;
        }
    }
    
    // FALLBACK: If no replacement was made, append a box at the end
    if (!replacementMade || !modifiedFormula.includes('\\boxed')) {
        modifiedFormula += `\\quad \\boxed{\\phantom{X}}`;
    }
    
    // Build HTML with MathJax formula
    let formulaHTML = '<div class="formula-builder">';
    formulaHTML += `<div class="formula-display" id="buildFormulaDisplay" data-original="${texFormula}" data-blank="${blankToFill}" data-modified="${modifiedFormula}">$$${modifiedFormula}$$</div>`;
    formulaHTML += '<div class="tiles-container">';
    
    // Create tiles with correct answer and distractors
    const tiles = [blankToFill];
    const otherVars = formula.blanks.filter(v => v !== blankToFill);
    tiles.push(...otherVars.slice(0, 2));
    const distractors = ['A', 'B', 'C', 'X', 'Y', 'Z', 'N', 'M'];
    const availableDistractors = distractors.filter(d => !tiles.includes(d));
    tiles.push(...availableDistractors.slice(0, 3 - otherVars.length));
    
    shuffleArray(tiles).forEach(tile => {
        formulaHTML += `<div class="tile" onclick="selectTile(this, '${tile}')">${tile}</div>`;
    });
    
    formulaHTML += '</div></div>';
    document.getElementById('answerArea').innerHTML = formulaHTML;
    
    // Store correct answer and selected tile (not yet submitted)
    gameState.selectedAnswer = null;
    gameState.correctAnswer = blankToFill;
    gameState.selectedTileValue = null; // Track selection without revealing
    
    // Render MathJax after a short delay
    setTimeout(() => renderMath(), 50);
}

function selectTile(element, value) {
    if (element.classList.contains('used')) return;
    
    const displayElement = document.getElementById('buildFormulaDisplay');
    if (!displayElement) return;
    
    // Remove 'used' class from all tiles first
    document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('used'));
    
    // Mark this tile as selected (visual feedback only)
    element.classList.add('used');
    
    // Store the selected value WITHOUT revealing it in the formula yet
    gameState.selectedAnswer = value;
    gameState.selectedTileValue = value;
    
    // Add visual feedback to the box (highlight it) without showing the answer
    const boxElements = displayElement.querySelectorAll('mjx-box, .MJX-box');
    boxElements.forEach(box => {
        box.style.borderColor = '#667eea';
        box.style.backgroundColor = '#e6f0ff';
    });
}

function loadMatchQuestion(formula) {
    document.getElementById('questionText').textContent = 'Which formula matches this description?';
    document.getElementById('questionSubtext').textContent = formula.description;
    const options = [formula];
    const sameCategory = formulaDatabase.filter(f => f.category === formula.category && f.id !== formula.id);
    const otherFormulas = formulaDatabase.filter(f => f.category !== formula.category && f.id !== formula.id);
    if (sameCategory.length >= 2) {options.push(...sameCategory.slice(0, 2));} else {options.push(...sameCategory); options.push(...otherFormulas.slice(0, 2 - sameCategory.length));}
    const shuffledOptions = shuffleArray(options);
    let html = '<div class="answer-options">';
    const letters = ['A', 'B', 'C'];
    shuffledOptions.forEach((opt, index) => {html += `<div class="answer-option" onclick="selectAnswer(this, ${opt.id})"><span class="option-letter">${letters[index]}</span><span>${opt.display}</span></div>`;});
    html += '</div>';
    document.getElementById('answerArea').innerHTML = html;
    gameState.correctAnswer = formula.id; gameState.selectedAnswer = null;
    // Render MathJax for formula options
    setTimeout(() => renderMath(), 50);
}

function loadVariableQuestion(formula) {
    const variables = Object.keys(formula.variables);
    const selectedVar = getRandomElement(variables);
    document.getElementById('questionText').textContent = `What does "${selectedVar}" represent in this formula?`;
    document.getElementById('questionSubtext').innerHTML = formula.display;
    const correctMeaning = formula.variables[selectedVar];
    const options = [correctMeaning];
    Object.values(formula.variables).forEach(meaning => {if (meaning !== correctMeaning && options.length < 4) {options.push(meaning);}});
    const commonDistractors = ['Total Amount', 'Interest Earned', 'Payment Period', 'Discount Rate', 'Number of Years', 'Monthly Payment'];
    commonDistractors.forEach(dist => {if (!options.includes(dist) && options.length < 4) {options.push(dist);}});
    const shuffledOptions = shuffleArray(options);
    let html = '<div class="answer-options">';
    const letters = ['A', 'B', 'C', 'D'];
    shuffledOptions.forEach((opt, index) => {html += `<div class="answer-option" onclick="selectAnswer(this, '${opt}')"><span class="option-letter">${letters[index]}</span><span>${opt}</span></div>`;});
    html += '</div>';
    document.getElementById('answerArea').innerHTML = html;
    gameState.correctAnswer = correctMeaning; gameState.selectedAnswer = null;
    // Render MathJax for the formula in subtext
    setTimeout(() => renderMath(), 50);
}

function selectAnswer(element, value) {document.querySelectorAll('.answer-option').forEach(opt => {opt.classList.remove('selected');}); element.classList.add('selected'); gameState.selectedAnswer = value;}

function submitAnswer() {
    if (gameState.selectedAnswer === null) {
        showFeedback('Please select an answer!', 'incorrect');
        return;
    }
    
    const isCorrect = gameState.selectedAnswer == gameState.correctAnswer;
    const timeTaken = (Date.now() - gameState.questionStartTime) / 1000;
    
    // NOW reveal the answer in the formula (only after submit)
    const displayElement = document.getElementById('buildFormulaDisplay');
    if (displayElement && gameState.selectedTileValue) {
        const modifiedFormula = displayElement.dataset.modified;
        const blankVar = displayElement.dataset.blank;
        
        // Replace the box with the selected variable
        const placeholder = `\\boxed{\\phantom{${blankVar}}}`;
        const fallbackPlaceholder = `\\boxed{\\phantom{X}}`;
        
        let revealedFormula = modifiedFormula.replace(placeholder, gameState.selectedTileValue);
        revealedFormula = revealedFormula.replace(fallbackPlaceholder, gameState.selectedTileValue);
        
        // Update display with proper MathJax delimiters for fractions
        displayElement.innerHTML = `$$${revealedFormula}$$`;
        
        // Re-render MathJax to show fractions properly
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([displayElement]).catch(err => console.log('MathJax error:', err));
        }
    }
    
    if (isCorrect) {
        handleCorrectAnswer(timeTaken);
    } else {
        handleIncorrectAnswer();
        // Show correct answer in formula if wrong
        if (displayElement) {
            const modifiedFormula = displayElement.dataset.modified;
            const blankVar = displayElement.dataset.blank;
            const placeholder = `\\boxed{\\phantom{${blankVar}}}`;
            const fallbackPlaceholder = `\\boxed{\\phantom{X}}`;
            
            let correctFormula = modifiedFormula.replace(placeholder, gameState.correctAnswer);
            correctFormula = correctFormula.replace(fallbackPlaceholder, gameState.correctAnswer);
            
            setTimeout(() => {
                displayElement.innerHTML = `$$${correctFormula}$$`;
                if (window.MathJax && window.MathJax.typesetPromise) {
                    MathJax.typesetPromise([displayElement]).catch(err => console.log('MathJax error:', err));
                }
            }, 300);
        }
    }
    
    setTimeout(() => {
        gameState.currentQuestion++;
        loadQuestion();
    }, 1500);
}

function handleCorrectAnswer(timeTaken) {
    gameState.correctAnswers++; gameState.streak++;
    if (gameState.streak > gameState.bestStreak) {gameState.bestStreak = gameState.streak;}
    let points = 10;
    if (timeTaken < 5) points += 5;
    if (gameState.streak >= 3) points += gameState.streak;
    gameState.score += points;
    if (gameState.mode === 'quick') {addTime(5);}
    if (timeTaken < gameState.fastestAnswer) {gameState.fastestAnswer = timeTaken;}
    if (!gameState.masteredFormulas.find(f => f.id === gameState.currentFormula.id)) {gameState.masteredFormulas.push(gameState.currentFormula);}
    showFeedback('Correct! Great job! 🎉', 'correct'); showScorePopup(points); playSound('correct');
    document.querySelectorAll('.answer-option.selected, .formula-blank.filled').forEach(el => {el.classList.add('correct');});
    document.getElementById('scoreDisplay').textContent = gameState.score;
    document.getElementById('streakDisplay').textContent = `${gameState.streak}🔥`;
}

function handleIncorrectAnswer() {
    gameState.incorrectAnswers++; gameState.streak = 0;
    if (gameState.mode === 'quick') {gameState.timeRemaining = Math.max(0, gameState.timeRemaining - 1); updateTimerDisplay();}
    if (!gameState.reviewFormulas.find(f => f.id === gameState.currentFormula.id)) {gameState.reviewFormulas.push(gameState.currentFormula);}
    showFeedback(`Incorrect. The correct answer is: ${gameState.correctAnswer}`, 'incorrect'); playSound('incorrect');
    document.querySelectorAll('.answer-option.selected, .formula-blank.filled').forEach(el => {el.classList.add('incorrect');});
    document.getElementById('streakDisplay').textContent = `0🔥`;
}

function showFeedback(message, type) {const feedback = document.getElementById('feedbackMessage'); feedback.textContent = message; feedback.className = `feedback-message ${type} show`;}
function skipQuestion() {gameState.incorrectAnswers++; gameState.streak = 0; if (!gameState.reviewFormulas.find(f => f.id === gameState.currentFormula.id)) {gameState.reviewFormulas.push(gameState.currentFormula);} gameState.currentQuestion++; loadQuestion();}

function endGame() {
    clearInterval(gameState.timerInterval);
    const totalAnswered = gameState.correctAnswers + gameState.incorrectAnswers;
    const accuracy = totalAnswered > 0 ? Math.round((gameState.correctAnswers / totalAnswered) * 100) : 0;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('accuracyPercent').textContent = `${accuracy}%`;
    document.getElementById('bestStreak').textContent = `${gameState.bestStreak}🔥`;
    document.getElementById('fastestTime').textContent = gameState.fastestAnswer === Infinity ? 'N/A' : `${gameState.fastestAnswer.toFixed(1)}s`;
    const masteredList = document.getElementById('masteredList');
    masteredList.innerHTML = gameState.masteredFormulas.length > 0 ? gameState.masteredFormulas.map(f => `<div class="formula-item">${f.category}: ${f.description}</div>`).join('') : '<p style="color: #888;">No formulas mastered yet. Keep practicing!</p>';
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = gameState.reviewFormulas.length > 0 ? gameState.reviewFormulas.map(f => `<div class="formula-item">${f.category}: ${f.description}</div>`).join('') : '<p style="color: #888;">Great job! No formulas need review.</p>';
    document.getElementById('motivationalQuote').textContent = `"${getRandomElement(motivationalQuotes)}"`;
    if (accuracy >= 80) {document.getElementById('resultsIcon').textContent = '🎉'; document.getElementById('resultsTitle').textContent = 'Excellent Work!';} else if (accuracy >= 60) {document.getElementById('resultsIcon').textContent = '👍'; document.getElementById('resultsTitle').textContent = 'Good Job!';} else {document.getElementById('resultsIcon').textContent = '💪'; document.getElementById('resultsTitle').textContent = 'Keep Practicing!';}
    showScreen('resultsScreen');
}

function showReviewMode() {
    const reviewContent = document.getElementById('reviewContent');
    const allFormulas = [...new Set([...gameState.masteredFormulas, ...gameState.reviewFormulas])];
    if (allFormulas.length === 0) {reviewContent.innerHTML = '<p style="text-align: center; color: #888;">No formulas to review yet.</p>'; showScreen('reviewScreen'); return;}
    let html = '';
    allFormulas.forEach(formula => {
        html += `<div class="review-item"><div class="review-formula">${formula.display}</div><div class="review-description"><strong>Description:</strong> ${formula.description}</div><div class="review-variables"><strong>Variables:</strong> ${Object.entries(formula.variables).map(([key, val]) => `${key} = ${val}`).join(', ')}</div></div>`;
    });
    reviewContent.innerHTML = html;
    showScreen('reviewScreen');
    // Render MathJax for all review formulas
    setTimeout(() => renderMath(), 50);
}

function closeReview() {showScreen('resultsScreen');}
function resetGame() {showScreen('startScreen');}
