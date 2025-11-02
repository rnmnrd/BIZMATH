// BIZMATH: Simple Interest Calculator - Block System with GRESA Method
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
// Simple Interest uses CONTINUOUS mode:
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
  'Is': [
    { id: 'Is_Prt', label: 'Iₛ = P × r × t', variables: ['P', 'r', 't'] }
  ],
  'F': [
    { id: 'F_PplusIs', label: 'F = P + Iₛ', variables: ['P', 'Is'] },
    { id: 'F_Prt', label: 'F = P(1 + r × t)', variables: ['P', 'r', 't'] }
  ],
  'P': [
    { id: 'P_FminusIs', label: 'P = F - Iₛ', variables: ['F', 'Is'] },
    { id: 'P_Isrt', label: 'P = Iₛ / (r × t)', variables: ['Is', 'r', 't'] }
  ],
  'r': [
    { id: 'r_IsPt', label: 'r = Iₛ / (P × t)', variables: ['Is', 'P', 't'] }
  ],
  't': [
    { id: 't_IsPr', label: 't = Iₛ / (P × r)', variables: ['Is', 'P', 'r'] }
  ]
};

// Variable metadata
const variableInfo = {
  'P': { name: 'Principal', unit: '₱', type: 'currency' },
  'Is': { name: 'Simple Interest', unit: '₱', type: 'currency' },
  'F': { name: 'Future Value', unit: '₱', type: 'currency' },
  'r': { name: 'Rate', unit: '(decimal)', type: 'rate', placeholder: 'e.g., 0.05 for 5%' },
  't': { name: 'Time', unit: 'years', type: 'time' }
};

// ========== COMPUTATION FUNCTIONS ==========
function computeI_from_Prt(P, r, t) { return P * r * t; }
function computeF_from_P_plus_I(P, I) { return P + I; }
function computeF_from_Prt(P, r, t) { return P * (1 + r * t); }
function computeP_from_FminusI(F, I) { return F - I; }
function computeP_from_Irt(I, r, t) { return I / (r * t); }
function computeR_from_IPt(I, P, t) { return I / (P * t); }
function computeT_from_IPr(I, P, r) { return I / (P * r); }

// ========== BLOCK NAVIGATION ==========
function showBlock(blockNumber) {
  // Hide all blocks
  document.querySelectorAll('.block').forEach(block => block.classList.add('hidden'));
  // Show requested block
  const targetBlock = document.getElementById(`block${blockNumber}`);
  if (targetBlock) {
    targetBlock.classList.remove('hidden');
  }
}

// ========== STEP 1: SELECT VARIABLE ==========
function selectVariable(variable) {
  state.selectedVariable = variable;
  state.selectedFormula = null;
  state.inputs = {};
  
  const formulaOptions = formulas[variable];
  
  if (formulaOptions.length > 1) {
    // Show Block 1.1 (formula selection)
    showFormulaSelection(variable, formulaOptions);
    showBlock('1_1');
  } else {
    // Only one formula, skip to Block 2
    state.selectedFormula = formulaOptions[0];
    generateInputs();
    showBlock(2);
  }
}

// ========== STEP 1.1: SELECT FORMULA (CONDITIONAL) ==========
function showFormulaSelection(variable, formulaOptions) {
  const prompt = document.getElementById('formula-prompt');
  const formulaList = document.getElementById('formula-list');
  
  prompt.textContent = `You selected to find ${variableInfo[variable].name}. Choose which formula to use:`;
  
  formulaList.innerHTML = '';
  formulaOptions.forEach(formula => {
    const btn = document.createElement('button');
    btn.className = 'formula-btn';
    btn.textContent = formula.label;
    btn.onclick = () => selectFormula(formula);
    formulaList.appendChild(btn);
  });
}

function selectFormula(formula) {
  state.selectedFormula = formula;
  generateInputs();
  showBlock(2);
}

// ========== STEP 2: GENERATE INPUTS ==========
function generateInputs() {
  const container = document.getElementById('input-container');
  container.innerHTML = '';
  
  const variables = state.selectedFormula.variables;
  
  variables.forEach(varKey => {
    const info = variableInfo[varKey];
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    
    const label = document.createElement('label');
    label.textContent = `${info.name} (${varKey})`;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.step = 'any';
    input.id = `input-${varKey}`;
    input.placeholder = info.placeholder || `Enter ${info.name}`;
    input.required = true;
    
    const unit = document.createElement('span');
    unit.className = 'unit';
    unit.textContent = info.unit;
    
    wrapper.appendChild(input);
    wrapper.appendChild(unit);
    
    inputGroup.appendChild(label);
    inputGroup.appendChild(wrapper);
    container.appendChild(inputGroup);
  });
}

// ========== STEP 3: CALCULATE AND SHOW GRESA ==========
function calculateResult() {
  // Collect inputs
  const variables = state.selectedFormula.variables;
  const inputs = {};
  let hasError = false;
  
  variables.forEach(varKey => {
    const input = document.getElementById(`input-${varKey}`);
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value < 0) {
      alert(`Please enter a valid positive number for ${variableInfo[varKey].name}`);
      hasError = true;
      return;
    }
    inputs[varKey] = value;
  });
  
  if (hasError) return;
  
  state.inputs = inputs;
  
  // Perform calculation based on formula
  let result;
  const formulaId = state.selectedFormula.id;
  
  try {
    switch(formulaId) {
      case 'Is_Prt':
        result = computeI_from_Prt(inputs.P, inputs.r, inputs.t);
        break;
      case 'F_PplusIs':
        result = computeF_from_P_plus_I(inputs.P, inputs.Is);
        break;
      case 'F_Prt':
        result = computeF_from_Prt(inputs.P, inputs.r, inputs.t);
        break;
      case 'P_FminusIs':
        result = computeP_from_FminusI(inputs.F, inputs.Is);
        break;
      case 'P_Isrt':
        // Validate division by zero
        if (inputs.r === 0 || inputs.t === 0) {
          alert('Error: Rate and Time must be non-zero for this formula.');
          return;
        }
        result = computeP_from_Irt(inputs.Is, inputs.r, inputs.t);
        break;
      case 'r_IsPt':
        if (inputs.P === 0 || inputs.t === 0) {
          alert('Error: Principal and Time must be non-zero for this formula.');
          return;
        }
        result = computeR_from_IPt(inputs.Is, inputs.P, inputs.t);
        break;
      case 't_IsPr':
        if (inputs.P === 0 || inputs.r === 0) {
          alert('Error: Principal and Rate must be non-zero for this formula.');
          return;
        }
        result = computeT_from_IPr(inputs.Is, inputs.P, inputs.r);
        break;
      default:
        alert('Unknown formula');
        return;
    }
    
    state.result = result;
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
    return formatDecimal(value);
  };
  
  // GIVEN
  let givenHTML = '';
  Object.keys(inputs).forEach(varKey => {
    givenHTML += `<strong>${variableInfo[varKey].name} (${varKey}):</strong> ${formatValue(varKey, inputs[varKey])}<br>`;
  });
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
    'Is_Prt': '$$I_s = P \\times r \\times t$$',
    'F_PplusIs': '$$F = P + I_s$$',
    'F_Prt': '$$F = P(1 + r \\times t)$$',
    'P_FminusIs': '$$P = F - I_s$$',
    'P_Isrt': '$$P = \\dfrac{I_s}{r \\times t}$$',
    'r_IsPt': '$$r = \\dfrac{I_s}{P \\times t}$$',
    't_IsPr': '$$t = \\dfrac{I_s}{P \\times r}$$'
  };
  return equations[formulaId] || '';
}

function getSolutionLatex(formulaId, inputs, result) {
  // Smart number formatter: up to 8 decimals, removes trailing zeros
  const formatNumber = (n, maxDecimals = 8) => {
    // Convert to number and check if it's an integer
    const num = Number(n);
    if (Number.isInteger(num)) {
      return num.toString();
    }
    
    // Format with max decimals, then remove trailing zeros
    let formatted = num.toFixed(maxDecimals);
    
    // Remove trailing zeros after decimal point
    formatted = formatted.replace(/(\.[0-9]*?)0+$/, '$1');
    
    // Remove decimal point if no decimals left
    formatted = formatted.replace(/\.$/, '');
    
    return formatted;
  };
  
  // Alias for consistency with existing code
  const fc = formatNumber;  // Format currency/general numbers
  const fd = formatNumber;  // Format decimals
  
  let latex = '';
  
  switch(formulaId) {
    case 'Is_Prt':
      latex = `$$I_s = ${fc(inputs.P)} \\times ${fd(inputs.r)} \\times ${fd(inputs.t)}$$`;
      latex += `$$I_s = ${fc(result)}$$`;
      break;
    case 'F_PplusIs':
      latex = `$$F = ${fc(inputs.P)} + ${fc(inputs.Is)}$$`;
      latex += `$$F = ${fc(result)}$$`;
      break;
    case 'F_Prt':
      latex = `$$F = ${fc(inputs.P)}(1 + ${fd(inputs.r)} \\times ${fd(inputs.t)})$$`;
      latex += `$$F = ${fc(inputs.P)} \\times ${fd(1 + inputs.r * inputs.t)}$$`;
      latex += `$$F = ${fc(result)}$$`;
      break;
    case 'P_FminusIs':
      latex = `$$P = ${fc(inputs.F)} - ${fc(inputs.Is)}$$`;
      latex += `$$P = ${fc(result)}$$`;
      break;
    case 'P_Isrt':
      latex = `$$P = \\dfrac{${fc(inputs.Is)}}{${fd(inputs.r)} \\times ${fd(inputs.t)}}$$`;
      latex += `$$P = \\dfrac{${fc(inputs.Is)}}{${fd(inputs.r * inputs.t)}}$$`;
      latex += `$$P = ${fc(result)}$$`;
      break;
    case 'r_IsPt':
      latex = `$$r = \\dfrac{${fc(inputs.Is)}}{${fc(inputs.P)} \\times ${fd(inputs.t)}}$$`;
      latex += `$$r = \\dfrac{${fc(inputs.Is)}}{${fc(inputs.P * inputs.t)}}$$`;
      latex += `$$r = ${fd(result)}$$`;
      break;
    case 't_IsPr':
      latex = `$$t = \\dfrac{${fc(inputs.Is)}}{${fc(inputs.P)} \\times ${fd(inputs.r)}}$$`;
      latex += `$$t = \\dfrac{${fc(inputs.Is)}}{${fc(inputs.P * inputs.r)}}$$`;
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
