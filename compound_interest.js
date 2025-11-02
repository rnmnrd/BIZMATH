// BIZMATH: Compound Interest Calculator - Block System with GRESA Method
// Educational step-by-step calculator for Grade 11 learners

// ========== STATE MANAGEMENT ==========
let state = {
  selectedVariable: null,
  selectedFormula: null,
  inputs: {},
  result: null,
  currentGRESAStep: 0,
  gresaSteps: ['given', 'required', 'equation', 'solution', 'answer']
};

// ========== PRECISION BEHAVIOR ==========
// Compound Interest uses CONTINUOUS mode:
// - Compute with full precision
// - Use full precision in all calculations
// - Round only for display (8 decimals for intermediate, 2 for currency)

// ========== AUDIO CONTEXT FOR SUCCESS SOUND ==========
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSuccessSound() {
  initAudio();
  
  // Create a pleasant "ding" sound using Web Audio API
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Configure the sound
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // High C note
  
  // Envelope for smooth sound
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  // Play the sound
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// ========== DISPLAY FORMATTING UTILITIES ==========
function formatDisplay(value, options = {}) {
  const {
    decimals = 8,
    stripTrailingZeros = true,
    isInteger = false
  } = options;
  
  const num = Number(value);
  
  if (isInteger || Number.isInteger(num)) {
    return num.toString();
  }
  
  let formatted = num.toFixed(decimals);
  
  if (stripTrailingZeros) {
    formatted = formatted.replace(/(\.[0-9]*?)0+$/, '$1');
    formatted = formatted.replace(/\.$/, '');
  }
  
  return formatted;
}

function formatCurrencyDisplay(value) {
  const num = Number(value);
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ========== FORMULA DEFINITIONS ==========
const formulas = {
  'F': [
    { id: 'F_compound', label: 'F = P(1 + i)ⁿ', variables: ['P', 'r', 'm', 't'] }
  ],
  'P': [
    { id: 'P_compound', label: 'P = F / (1 + i)ⁿ', variables: ['F', 'r', 'm', 't'] }
  ],
  'r': [
    { id: 'r_compound', label: 'r = m × ((F/P)^(1/n) - 1)', variables: ['F', 'P', 'm', 't'] }
  ],
  't': [
    { id: 't_compound', label: 't = log(F/P) / (m × log(1+i))', variables: ['F', 'P', 'r', 'm'] }
  ]
};

// ========== VARIABLE INFORMATION ==========
const variableInfo = {
  'F': { name: 'Future Value', type: 'currency', unit: '₱' },
  'P': { name: 'Principal', type: 'currency', unit: '₱' },
  'r': { name: 'Nominal Rate', type: 'rate', unit: '(decimal, e.g., 0.08 for 8%)' },
  'm': { name: 'Frequency of Conversion', type: 'number', unit: '(times per year)' },
  't': { name: 'Time', type: 'time', unit: 'years' },
  'i': { name: 'Rate per Period', type: 'rate', unit: '(decimal)' },
  'n': { name: 'Total Conversions', type: 'number', unit: '(periods)' }
};

// ========== BLOCK NAVIGATION ==========
function showBlock(blockId) {
  document.querySelectorAll('.block').forEach(block => block.classList.add('hidden'));
  const targetBlock = blockId === '1_1' ? 'block1_1' : `block${blockId}`;
  document.getElementById(targetBlock).classList.remove('hidden');
}

// ========== STEP 1: VARIABLE SELECTION ==========
function selectVariable(variable) {
  state.selectedVariable = variable;
  
  // Highlight selected button
  document.querySelectorAll('.var-btn').forEach(btn => btn.classList.remove('selected'));
  event.target.closest('.var-btn').classList.add('selected');
  
  // Check if multiple formulas exist
  const availableFormulas = formulas[variable];
  if (availableFormulas.length > 1) {
    showFormulaSelection(availableFormulas);
  } else {
    state.selectedFormula = availableFormulas[0];
    generateInputs();
    showBlock(2);
  }
}

// ========== STEP 1.1: FORMULA SELECTION ==========
function showFormulaSelection(availableFormulas) {
  const container = document.getElementById('formula-list');
  container.innerHTML = '';
  
  availableFormulas.forEach((formula, index) => {
    const btn = document.createElement('button');
    btn.className = 'formula-btn';
    btn.innerHTML = formula.label;
    btn.onclick = () => {
      state.selectedFormula = formula;
      generateInputs();
      showBlock(2);
    };
    
    container.appendChild(btn);
  });
  
  showBlock('1_1');
}

// ========== STEP 2: GENERATE INPUT FIELDS ==========
function generateInputs() {
  const container = document.getElementById('input-container');
  container.innerHTML = '';
  
  const requiredVars = state.selectedFormula.variables;
  
  requiredVars.forEach(varKey => {
    const info = variableInfo[varKey];
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    
    inputGroup.innerHTML = `
      <label for="input-${varKey}">${info.name} (${varKey})</label>
      <input type="number" id="input-${varKey}" step="any" placeholder="Enter ${info.name} ${info.unit}">
    `;
    
    container.appendChild(inputGroup);
  });
}

// ========== STEP 3: CALCULATE RESULT ==========
function calculateResult() {
  // Gather inputs
  const requiredVars = state.selectedFormula.variables;
  state.inputs = {};
  
  for (let varKey of requiredVars) {
    const value = parseFloat(document.getElementById(`input-${varKey}`).value);
    if (isNaN(value)) {
      alert(`Please enter a valid value for ${variableInfo[varKey].name}`);
      return;
    }
    state.inputs[varKey] = value;
  }
  
  // Calculate based on selected formula
  try {
    const { P, F, r, m, t } = state.inputs;
    
    // Calculate i and n (these are derived, not input)
    const i = r / m;
    const n = m * t;
    
    // Store i and n for display in GIVEN section
    state.inputs.i = i;
    state.inputs.n = n;
    
    switch(state.selectedFormula.id) {
      case 'F_compound':
        // F = P(1 + i)^n
        state.result = P * Math.pow(1 + i, n);
        break;
        
      case 'P_compound':
        // P = F / (1 + i)^n
        state.result = F / Math.pow(1 + i, n);
        break;
        
      case 'r_compound':
        // r = m × ((F/P)^(1/n) - 1)
        // Corrected formula: compute (F/P)^(1/n) - 1 first, then multiply by m
        const n_r = m * t;
        state.inputs.n = n_r;  // Store n for display
        state.result = m * (Math.pow(F / P, 1 / n_r) - 1);
        break;
        
      case 't_compound':
        // t = log(F/P) / (m × log(1+i))
        state.result = Math.log(F / P) / (m * Math.log(1 + i));
        break;
        
      default:
        throw new Error('Unknown formula');
    }
    
    displayGRESA();
    showBlock(3);
    
  } catch (error) {
    alert('Calculation error: ' + error.message);
  }
}

// ========== DISPLAY GRESA SOLUTION ==========
function displayGRESA() {
  const { selectedVariable, selectedFormula, inputs, result } = state;
  
  // Smart number formatter: up to 8 decimals, removes trailing zeros
  const formatNumber = (n, maxDecimals = 8) => {
    const num = Number(n);
    if (Number.isInteger(num)) {
      return num.toString();
    }
    
    let formatted = num.toFixed(maxDecimals);
    formatted = formatted.replace(/(\.[0-9]*?)0+$/, '$1');
    formatted = formatted.replace(/\.$/, '');
    
    return formatted;
  };
  
  // Helper functions
  const formatCurrency = (n) => `₱${formatNumber(n)}`;
  const formatDecimal = (n) => formatNumber(n);
  const formatValue = (varKey, value) => {
    const info = variableInfo[varKey];
    if (info.type === 'currency') return formatCurrency(value);
    if (info.type === 'rate') return formatDecimal(value);
    if (info.type === 'time') return `${formatDecimal(value)} years`;
    if (info.type === 'number') return formatDecimal(value);
    return formatDecimal(value);
  };
  
  // GIVEN - Show all input values including derived i and n
  let givenHTML = '';
  
  // Show original inputs first
  ['P', 'F', 'r', 'm', 't'].forEach(varKey => {
    if (inputs[varKey] !== undefined && varKey !== 'i' && varKey !== 'n') {
      givenHTML += `<strong>${variableInfo[varKey].name} (${varKey}):</strong> ${formatValue(varKey, inputs[varKey])}<br>`;
    }
  });
  
  // Show derived values
  if (inputs.i !== undefined) {
    givenHTML += `<strong>${variableInfo.i.name} (i):</strong> ${formatDecimal(inputs.i)} <em>(i = r/m)</em><br>`;
  }
  if (inputs.n !== undefined) {
    givenHTML += `<strong>${variableInfo.n.name} (n):</strong> ${formatDecimal(inputs.n)} <em>(n = m × t)</em><br>`;
  }
  
  document.getElementById('gresa-given').innerHTML = givenHTML;
  
  // REQUIRED
  const varInfo = variableInfo[selectedVariable];
  document.getElementById('gresa-required').innerHTML = `Find <strong>${varInfo.name} (${selectedVariable})</strong>`;
  
  // EQUATION
  const equationLatex = getEquationLatex(selectedFormula.id);
  document.getElementById('gresa-equation').innerHTML = equationLatex;
  
  // SOLUTION
  const solutionLatex = getSolutionLatex(selectedFormula.id, inputs, result);
  document.getElementById('gresa-solution').innerHTML = solutionLatex;
  
  // ANSWER
  const answerText = `<strong>${selectedVariable} = ${formatValue(selectedVariable, result)}</strong>`;
  document.getElementById('gresa-answer').innerHTML = answerText;
  document.getElementById('final-answer').innerHTML = `${selectedVariable} = ${formatValue(selectedVariable, result)}`;
  
  // Reset progressive disclosure
  state.currentGRESAStep = 0;
  hideAllGRESASteps();
  
  // Show and enable Next Step button
  const nextBtn = document.getElementById('next-step-btn');
  nextBtn.style.display = 'inline-block';
  nextBtn.disabled = false;
  nextBtn.textContent = 'Next Step →';
  
  // Hide restart button initially
  document.getElementById('restart-btn').style.display = 'none';
  
  // Typeset MathJax
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise();
  }
}

// ========== PROGRESSIVE DISCLOSURE FUNCTIONS ==========
function hideAllGRESASteps() {
  state.gresaSteps.forEach(step => {
    const element = document.getElementById(`gresa-item-${step}`);
    if (element) {
      element.classList.remove('visible', 'slide-in');
      element.style.opacity = '0';
    }
  });
  
  const finalAnswer = document.getElementById('final-answer');
  if (finalAnswer) {
    finalAnswer.classList.remove('visible', 'celebrate');
    finalAnswer.style.opacity = '0';
  }
}

function showNextGRESAStep() {
  if (state.currentGRESAStep < state.gresaSteps.length) {
    const stepName = state.gresaSteps[state.currentGRESAStep];
    const element = document.getElementById(`gresa-item-${stepName}`);
    
    if (element) {
      // Add slide-in animation
      element.classList.add('slide-in', 'visible');
      
      // Typeset MathJax for this step if it contains math
      if (stepName === 'equation' || stepName === 'solution') {
        if (window.MathJax && MathJax.typesetPromise) {
          MathJax.typesetPromise([element]);
        }
      }
    }
    
    state.currentGRESAStep++;
    
    // If we've shown all steps, show final answer and play sound
    if (state.currentGRESAStep >= state.gresaSteps.length) {
      setTimeout(() => {
        showFinalAnswer();
      }, 400);
    }
  }
}

function showFinalAnswer() {
  const finalAnswer = document.getElementById('final-answer');
  if (finalAnswer) {
    finalAnswer.classList.add('visible', 'celebrate');
    
    // Play success sound
    playSuccessSound();
    
    // Disable and update Next Step button
    const nextBtn = document.getElementById('next-step-btn');
    nextBtn.disabled = true;
    nextBtn.textContent = 'All Steps Shown ✓';
    nextBtn.style.opacity = '0.6';
    nextBtn.style.cursor = 'not-allowed';
    
    // Show restart button
    document.getElementById('restart-btn').style.display = 'inline-block';
  }
}

// ========== LATEX FORMATTERS ==========
function getEquationLatex(formulaId) {
  const equations = {
    'F_compound': '$$F = P(1 + i)^n$$',
    'P_compound': '$$P = \\dfrac{F}{(1 + i)^n}$$',
    'r_compound': '$$r = m \\times \\left[\\left(\\dfrac{F}{P}\\right)^{\\frac{1}{n}} - 1\\right]$$',
    't_compound': '$$t = \\dfrac{\\log(F/P)}{m \\cdot \\log(1 + i)}$$'
  };
  return equations[formulaId] || '';
}

function getSolutionLatex(formulaId, inputs, result) {
  // Smart number formatter: up to 8 decimals, removes trailing zeros
  const formatNumber = (n, maxDecimals = 8) => {
    const num = Number(n);
    if (Number.isInteger(num)) {
      return num.toString();
    }
    
    let formatted = num.toFixed(maxDecimals);
    formatted = formatted.replace(/(\.[0-9]*?)0+$/, '$1');
    formatted = formatted.replace(/\.$/, '');
    
    return formatted;
  };
  
  const fc = formatNumber;  // Format currency/general numbers
  const fd = formatNumber;  // Format decimals
  
  let latex = '';
  
  switch(formulaId) {
    case 'F_compound':
      // F = P(1 + i)^n
      latex = `$$F = ${fc(inputs.P)}(1 + ${fd(inputs.i)})^{${fd(inputs.n)}}$$`;
      latex += `$$F = ${fc(inputs.P)} \\times ${fd(Math.pow(1 + inputs.i, inputs.n))}$$`;
      latex += `$$F = ${fc(result)}$$`;
      break;
      
    case 'P_compound':
      // P = F / (1 + i)^n
      latex = `$$P = \\dfrac{${fc(inputs.F)}}{(1 + ${fd(inputs.i)})^{${fd(inputs.n)}}}$$`;
      latex += `$$P = \\dfrac{${fc(inputs.F)}}{${fd(Math.pow(1 + inputs.i, inputs.n))}}$$`;
      latex += `$$P = ${fc(result)}$$`;
      break;
      
    case 'r_compound':
      // r = m × ((F/P)^(1/n) - 1)
      const ratio = inputs.F / inputs.P;
      const exponent = 1 / inputs.n;
      const base_result = Math.pow(ratio, exponent);
      const factor = base_result - 1;
      
      latex = `$$r = ${fd(inputs.m)} \\times \\left[\\left(\\dfrac{${fc(inputs.F)}}{${fc(inputs.P)}}\\right)^{\\frac{1}{${fd(inputs.n)}}} - 1\\right]$$`;
      latex += `$$r = ${fd(inputs.m)} \\times \\left[${fd(ratio)}^{${fd(exponent)}} - 1\\right]$$`;
      latex += `$$r = ${fd(inputs.m)} \\times \\left[${fd(base_result)} - 1\\right]$$`;
      latex += `$$r = ${fd(inputs.m)} \\times ${fd(factor)}$$`;
      latex += `$$r = ${fd(result)}$$`;
      break;
      
    case 't_compound':
      // t = log(F/P) / (m × log(1+i))
      latex = `$$t = \\dfrac{\\log(${fc(inputs.F)}/${fc(inputs.P)})}{${fd(inputs.m)} \\times \\log(1 + ${fd(inputs.i)})}$$`;
      latex += `$$t = \\dfrac{${fd(Math.log(inputs.F / inputs.P))}}{${fd(inputs.m)} \\times ${fd(Math.log(1 + inputs.i))}}$$`;
      latex += `$$t = \\dfrac{${fd(Math.log(inputs.F / inputs.P))}}{${fd(inputs.m * Math.log(1 + inputs.i))}}$$`;
      latex += `$$t = ${fd(result)} \\text{ years}$$`;
      break;
  }
  
  return latex;
}

// ========== NAVIGATION CONTROLS ==========
function goBack(fromBlock) {
  if (fromBlock === 1) {
    // From Block 1.1 back to Block 1
    showBlock(1);
  } else if (fromBlock === 2) {
    // From Block 2, check if we came from Block 1.1 or Block 1
    if (formulas[state.selectedVariable].length > 1) {
      showBlock('1_1');
    } else {
      showBlock(1);
    }
  }
}

function resetCalculator() {
  state = {
    selectedVariable: null,
    selectedFormula: null,
    inputs: {},
    result: null,
    currentGRESAStep: 0,
    gresaSteps: ['given', 'required', 'equation', 'solution', 'answer']
  };
  showBlock(1);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  showBlock(1);
});
