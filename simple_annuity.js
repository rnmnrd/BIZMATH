// BIZMATH: Simple Annuity Calculator - GRESA Method
// Educational step-by-step calculator for Grade 11 learners

// ========== STATE MANAGEMENT ==========
let state = {
  selectedVariable: null,
  selectedFormula: null,
  inputs: {},
  computedValues: {},  // Store i and n
  result: null,
  currentGRESAStep: 0,
  gresaSteps: ['given', 'required', 'equation', 'solution', 'answer']
};

// ========== PRECISION BEHAVIOR ==========
// Simple Annuity uses CONTINUOUS mode:
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
    { id: 'F_annuity', label: 'F = R × [(1+i)ⁿ - 1] / i', variables: ['R', 'r', 'm', 't'] }
  ],
  'P': [
    { id: 'P_annuity', label: 'P = R × [1 - (1+i)⁻ⁿ] / i', variables: ['R', 'r', 'm', 't'] }
  ],
  'R': [
    { id: 'R_from_F', label: 'Step 1.1 – Using Future Value', variables: ['F', 'r', 'm', 't'] },
    { id: 'R_from_P', label: 'Step 1.2 – Using Present Value', variables: ['P', 'r', 'm', 't'] }
  ]
};

// ========== VARIABLE INFORMATION ==========
const variableInfo = {
  'F': { name: 'Future Value', type: 'currency', unit: '₱', placeholder: 'Enter Future Value' },
  'P': { name: 'Present Value', type: 'currency', unit: '₱', placeholder: 'Enter Present Value' },
  'R': { name: 'Regular Payment', type: 'currency', unit: '₱', placeholder: 'Enter Regular Payment' },
  'r': { name: 'Nominal Rate', type: 'rate', unit: '', placeholder: 'Enter rate as decimal (e.g., 0.08 for 8%)' },
  'm': { name: 'Frequency of Conversion', type: 'number', unit: '', placeholder: 'Enter frequency (e.g., 12 for monthly)' },
  't': { name: 'Time', type: 'number', unit: 'years', placeholder: 'Enter time in years' }
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
  const prompt = document.getElementById('formula-prompt');
  
  prompt.textContent = 'Choose which value you have to calculate Regular Payment:';
  container.innerHTML = '';
  
  availableFormulas.forEach((formula) => {
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
    
    const unitDisplay = info.unit ? ` (${info.unit})` : '';
    
    inputGroup.innerHTML = `
      <label for="input-${varKey}">${info.name} (${varKey})${unitDisplay}</label>
      <input type="number" id="input-${varKey}" step="any" placeholder="${info.placeholder}">
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
  
  // Calculate i and n from r, m, t
  const { r, m, t } = state.inputs;
  state.computedValues.i = r / m;
  state.computedValues.n = m * t;
  
  const i = state.computedValues.i;
  const n = state.computedValues.n;
  
  // Calculate based on selected formula
  try {
    const { F, P, R } = state.inputs;
    
    switch(state.selectedFormula.id) {
      case 'F_annuity':
        // F = R × [(1+i)^n - 1] / i
        state.result = R * (Math.pow(1 + i, n) - 1) / i;
        break;
        
      case 'P_annuity':
        // P = R × [1 - (1+i)^(-n)] / i
        state.result = R * (1 - Math.pow(1 + i, -n)) / i;
        break;
        
      case 'R_from_F':
        // R = F × i / [(1+i)^n - 1]
        state.result = F * i / (Math.pow(1 + i, n) - 1);
        break;
        
      case 'R_from_P':
        // R = P × i / [1 - (1+i)^(-n)]
        state.result = P * i / (1 - Math.pow(1 + i, -n));
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
  const { selectedVariable, selectedFormula, inputs, computedValues, result } = state;
  
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
  const formatCurrency = (n) => {
    // Currency should show 2 decimal places for final display
    const num = Number(n);
    return `₱${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };
  const formatDecimal = (n) => formatNumber(n);
  const formatValue = (varKey, value) => {
    const info = variableInfo[varKey];
    if (info.type === 'currency') return formatCurrency(value);
    if (info.type === 'rate') return formatDecimal(value);
    if (info.type === 'number') return formatDecimal(value);
    return formatDecimal(value);
  };
  
  // GIVEN - Show all input values + computed i and n
  let givenHTML = '';
  Object.keys(inputs).forEach(varKey => {
    givenHTML += `<strong>${variableInfo[varKey].name} (${varKey}):</strong> ${formatValue(varKey, inputs[varKey])}<br>`;
  });
  
  // Add computed values
  givenHTML += `<br><em>Computed values:</em><br>`;
  givenHTML += `<strong>Interest Rate per Period (i):</strong> ${formatDecimal(computedValues.i)} <em>(i = r/m = ${formatDecimal(inputs.r)}/${formatDecimal(inputs.m)})</em><br>`;
  givenHTML += `<strong>Number of Periods (n):</strong> ${formatDecimal(computedValues.n)} <em>(n = m×t = ${formatDecimal(inputs.m)}×${formatDecimal(inputs.t)})</em><br>`;
  
  document.getElementById('gresa-given').innerHTML = givenHTML;
  
  // REQUIRED
  const varInfo = variableInfo[selectedVariable];
  document.getElementById('gresa-required').innerHTML = `Find <strong>${varInfo.name} (${selectedVariable})</strong>`;
  
  // EQUATION
  const equationLatex = getEquationLatex(selectedFormula.id);
  document.getElementById('gresa-equation').innerHTML = equationLatex;
  
  // SOLUTION
  const solutionLatex = getSolutionLatex(selectedFormula.id, inputs, computedValues, result);
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
    'F_annuity': '$$F = R \\left( \\dfrac{(1+i)^n - 1}{i} \\right)$$',
    'P_annuity': '$$P = R \\left( \\dfrac{1 - (1+i)^{-n}}{i} \\right)$$',
    'R_from_F': '$$R = \\dfrac{F}{\\dfrac{(1+i)^n - 1}{i}}$$',
    'R_from_P': '$$R = \\dfrac{P}{\\dfrac{1 - (1+i)^{-n}}{i}}$$'
  };
  return equations[formulaId] || '';
}

function getSolutionLatex(formulaId, inputs, computedValues, result) {
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
  
  const fc = (n) => {
    // Currency: 2 decimals with comma separators
    const num = Number(n);
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const fd = formatNumber;  // Format decimals: up to 8, no trailing zeros
  
  const i = computedValues.i;
  const n = computedValues.n;
  
  let latex = '';
  
  switch(formulaId) {
    case 'F_annuity':
      // F = R × [(1+i)^n - 1] / i
      const factor_F = (Math.pow(1 + i, n) - 1) / i;
      latex = `$$F = ${fc(inputs.R)} \\left( \\dfrac{(1+${fd(i)})^{${fd(n)}} - 1}{${fd(i)}} \\right)$$`;
      latex += `$$F = ${fc(inputs.R)} \\left( \\dfrac{${fd(Math.pow(1 + i, n))} - 1}{${fd(i)}} \\right)$$`;
      latex += `$$F = ${fc(inputs.R)} \\left( \\dfrac{${fd(Math.pow(1 + i, n) - 1)}}{${fd(i)}} \\right)$$`;
      latex += `$$F = ${fc(inputs.R)} \\times ${fd(factor_F)}$$`;
      latex += `$$F = ${fc(result)}$$`;
      break;
      
    case 'P_annuity':
      // P = R × [1 - (1+i)^(-n)] / i
      const factor_P = (1 - Math.pow(1 + i, -n)) / i;
      latex = `$$P = ${fc(inputs.R)} \\left( \\dfrac{1 - (1+${fd(i)})^{-${fd(n)}}}{${fd(i)}} \\right)$$`;
      latex += `$$P = ${fc(inputs.R)} \\left( \\dfrac{1 - ${fd(Math.pow(1 + i, -n))}}{${fd(i)}} \\right)$$`;
      latex += `$$P = ${fc(inputs.R)} \\left( \\dfrac{${fd(1 - Math.pow(1 + i, -n))}}{${fd(i)}} \\right)$$`;
      latex += `$$P = ${fc(inputs.R)} \\times ${fd(factor_P)}$$`;
      latex += `$$P = ${fc(result)}$$`;
      break;
      
    case 'R_from_F':
      // R = F / [(1+i)^n - 1] × i
      const denom_F = (Math.pow(1 + i, n) - 1) / i;
      latex = `$$R = \\dfrac{${fc(inputs.F)}}{\\dfrac{(1+${fd(i)})^{${fd(n)}} - 1}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.F)}}{\\dfrac{${fd(Math.pow(1 + i, n))} - 1}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.F)}}{\\dfrac{${fd(Math.pow(1 + i, n) - 1)}}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.F)}}{${fd(denom_F)}}$$`;
      latex += `$$R = ${fc(result)}$$`;
      break;
      
    case 'R_from_P':
      // R = P / [1 - (1+i)^(-n)] × i
      const denom_P = (1 - Math.pow(1 + i, -n)) / i;
      latex = `$$R = \\dfrac{${fc(inputs.P)}}{\\dfrac{1 - (1+${fd(i)})^{-${fd(n)}}}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.P)}}{\\dfrac{1 - ${fd(Math.pow(1 + i, -n))}}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.P)}}{\\dfrac{${fd(1 - Math.pow(1 + i, -n))}}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.P)}}{${fd(denom_P)}}$$`;
      latex += `$$R = ${fc(result)}$$`;
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
    computedValues: {},
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
