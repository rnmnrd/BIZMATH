// BIZMATH: General Annuity Calculator - GRESA Method
// Educational step-by-step calculator for Grade 11 learners
// Handles different payment and compounding periods

// ========== STATE MANAGEMENT ==========
let state = {
  selectedVariable: null,
  selectedFormula: null,
  inputs: {},
  computedValues: {},  // Store i and n (Decimal objects - full precision)
  computedValuesRounded: {},  // Store rounded i (8 decimals) for use in calculations
  result: null,
  currentGRESAStep: 0,
  gresaSteps: ['given', 'required', 'equation', 'solution', 'answer']
  // Note: General Annuity always uses rounded-intermediate mode (no toggle)
};

// ========== PRECISION BEHAVIOR ==========
// General Annuity uses ROUNDED-INTERMEDIATE mode:
// - Compute i with full precision
// - Round i to 8 decimals
// - Use rounded i in all subsequent calculations
// This matches teacher's manual worked solutions

// ========== DISPLAY FORMATTING UTILITIES ==========
function formatDisplay(value, options = {}) {
  const {
    decimals = 8,
    stripTrailingZeros = true,
    isInteger = false
  } = options;
  
  // Convert Decimal to number if needed
  const num = (value instanceof Decimal) ? parseFloat(value.toString()) : Number(value);
  
  // Handle integers
  if (isInteger || Number.isInteger(num)) {
    return num.toString();
  }
  
  // Format to specified decimals
  let formatted = num.toFixed(decimals);
  
  // Strip trailing zeros if requested
  if (stripTrailingZeros) {
    formatted = formatted.replace(/(\.[0-9]*?)0+$/, '$1');
    formatted = formatted.replace(/\.$/, '');
  }
  
  return formatted;
}

function formatCurrencyDisplay(value) {
  // Convert Decimal to number if needed
  const num = (value instanceof Decimal) ? parseFloat(value.toString()) : Number(value);
  
  // Format to 2 decimals with thousand separators
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

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

// ========== FORMULA DEFINITIONS ==========
const formulas = {
  'F': [
    { id: 'F_general', label: 'F = R × [(1+i)ⁿ - 1] / i', variables: ['R', 'r', 'm1', 'm2', 't'] }
  ],
  'P': [
    { id: 'P_general', label: 'P = R × [1 - (1+i)⁻ⁿ] / i', variables: ['R', 'r', 'm1', 'm2', 't'] }
  ],
  'R': [
    { id: 'R_from_F', label: 'R from Future Value (F)', variables: ['F', 'r', 'm1', 'm2', 't'] },
    { id: 'R_from_P', label: 'R from Present Value (P)', variables: ['P', 'r', 'm1', 'm2', 't'] }
  ]
};

// ========== VARIABLE INFORMATION ==========
const variableInfo = {
  'F': { 
    name: 'Future Value', 
    type: 'currency', 
    unit: '₱', 
    placeholder: 'Enter Future Value (e.g., 10000)' 
  },
  'P': { 
    name: 'Present Value', 
    type: 'currency', 
    unit: '₱', 
    placeholder: 'Enter Present Value (e.g., 8500)' 
  },
  'R': { 
    name: 'Regular Payment', 
    type: 'currency', 
    unit: '₱', 
    placeholder: 'Enter Regular Payment (e.g., 500)' 
  },
  'r': { 
    name: 'Nominal Interest Rate', 
    type: 'rate', 
    unit: '', 
    placeholder: 'Enter rate as decimal (e.g., 0.08 for 8%)' 
  },
  'm1': { 
    name: 'Payment Interval', 
    type: 'number', 
    unit: 'times per year', 
    placeholder: 'Enter payment frequency (e.g., 12 for monthly)' 
  },
  'm2': { 
    name: 'Compounding Period', 
    type: 'number', 
    unit: 'times per year', 
    placeholder: 'Enter compounding frequency (e.g., 4 for quarterly)' 
  },
  't': { 
    name: 'Term of Annuity', 
    type: 'number', 
    unit: 'years', 
    placeholder: 'Enter time in years (e.g., 5)' 
  }
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
  
  prompt.textContent = 'What formula do you want to use to find R?';
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

// ========== COMPUTATION FUNCTIONS (Using Decimal.js for high precision) ==========
function computeEquivalentRate(r, m1, m2) {
  // i = (1 + r/m2)^(m2/m1) - 1
  const R_dec = new Decimal(r);
  const M1_dec = new Decimal(m1);
  const M2_dec = new Decimal(m2);
  
  const i_dec = Decimal.pow(
    new Decimal(1).plus(R_dec.div(M2_dec)),
    M2_dec.div(M1_dec)
  ).minus(1);
  
  return i_dec;  // Return Decimal object
}

function computePaymentTerm(m1, t) {
  // n = m1 × t
  const M1_dec = new Decimal(m1);
  const T_dec = new Decimal(t);
  return M1_dec.times(T_dec);  // Return Decimal object
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
  
  // Calculate i and n from r, m1, m2, t using Decimal.js
  const { r, m1, m2, t } = state.inputs;
  
  // Compute with full precision
  state.computedValues.i = computeEquivalentRate(r, m1, m2);  // Decimal object (full precision)
  state.computedValues.n = computePaymentTerm(m1, t);  // Decimal object (full precision)
  
  // ROUNDED-INTERMEDIATE MODE: Round i to 8 decimals before using in calculations
  // This ensures results match teacher's manual worked solutions
  state.computedValuesRounded.i = new Decimal(state.computedValues.i.toFixed(8));
  state.computedValuesRounded.n = state.computedValues.n;  // n is usually exact integer
  
  // Use rounded i in all calculations (rounded-intermediate mode)
  const i = state.computedValuesRounded.i;  // Decimal object (rounded to 8 decimals)
  const n = state.computedValuesRounded.n;  // Decimal object
  
  // Calculate based on selected formula using Decimal.js
  try {
    const { F, P, R } = state.inputs;
    
    switch(state.selectedFormula.id) {
      case 'F_general':
        // F = R × [(1+i)^n - 1] / i
        const R_F = new Decimal(R);
        state.result = R_F.times(
          Decimal.pow(new Decimal(1).plus(i), n).minus(1).div(i)
        );  // Decimal object
        break;
        
      case 'P_general':
        // P = R × [1 - (1+i)^(-n)] / i
        const R_P = new Decimal(R);
        state.result = R_P.times(
          new Decimal(1).minus(Decimal.pow(new Decimal(1).plus(i), n.neg())).div(i)
        );  // Decimal object
        break;
        
      case 'R_from_F':
        // R = F / [(1+i)^n - 1] × i
        const F_R = new Decimal(F);
        state.result = F_R.div(
          Decimal.pow(new Decimal(1).plus(i), n).minus(1).div(i)
        );  // Decimal object
        break;
        
      case 'R_from_P':
        // R = P / [1 - (1+i)^(-n)] × i
        const P_R = new Decimal(P);
        state.result = P_R.div(
          new Decimal(1).minus(Decimal.pow(new Decimal(1).plus(i), n.neg())).div(i)
        );  // Decimal object
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
  
  // Use global formatting utilities
  const formatDecimal = (n) => formatDisplay(n, { decimals: 8, stripTrailingZeros: true });
  const formatCurrency = (n) => `₱${formatCurrencyDisplay(n)}`;
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
  givenHTML += `<strong>Equivalent Rate per Payment Interval (i):</strong> ${formatDecimal(computedValues.i)}<br>`;
  givenHTML += `<em>i = (1 + r/m₂)^(m₂/m₁) - 1</em><br>`;
  givenHTML += `<em>i = (1 + ${formatDecimal(inputs.r)}/${formatDecimal(inputs.m2)})^(${formatDecimal(inputs.m2)}/${formatDecimal(inputs.m1)}) - 1</em><br>`;
  givenHTML += `<em>i = ${formatDecimal(computedValues.i)}</em><br><br>`;
  
  givenHTML += `<strong>Total Number of Payment Intervals (n):</strong> ${formatDecimal(computedValues.n)}<br>`;
  givenHTML += `<em>n = m₁ × t = ${formatDecimal(inputs.m1)} × ${formatDecimal(inputs.t)} = ${formatDecimal(computedValues.n)}</em><br>`;
  
  document.getElementById('gresa-given').innerHTML = givenHTML;
  
  // REQUIRED
  const varInfo = variableInfo[selectedVariable];
  document.getElementById('gresa-required').innerHTML = `Find <strong>${varInfo.name} (${selectedVariable})</strong>`;
  
  // EQUATION
  const equationLatex = getEquationLatex(selectedFormula.id);
  document.getElementById('gresa-equation').innerHTML = equationLatex;
  
  // SOLUTION - pass the rounded values used in calculation
  const solutionLatex = getSolutionLatex(selectedFormula.id, inputs, state.computedValuesRounded, result);
  document.getElementById('gresa-solution').innerHTML = solutionLatex;
  
  // ANSWER
  const modeNote = '<br><small style="color: #666; font-style: italic;">*Intermediate rate <em>i</em> rounded to 8 decimals for manual-style worked solution.</small>';
  
  const answerText = `<strong>${selectedVariable} = ${formatValue(selectedVariable, result)}</strong>${modeNote}`;
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
    'F_general': '$$F = R \\left( \\dfrac{(1+i)^n - 1}{i} \\right)$$',
    'P_general': '$$P = R \\left( \\dfrac{1 - (1+i)^{-n}}{i} \\right)$$',
    'R_from_F': '$$R = \\dfrac{F}{\\dfrac{(1+i)^n - 1}{i}}$$',
    'R_from_P': '$$R = \\dfrac{P}{\\dfrac{1 - (1+i)^{-n}}{i}}$$'
  };
  return equations[formulaId] || '';
}

function getSolutionLatex(formulaId, inputs, computedValues, result) {
  // Use global formatting utilities
  const fd = (n) => formatDisplay(n, { decimals: 8, stripTrailingZeros: true });  // Format decimals
  const fc = (n) => formatCurrencyDisplay(n);  // Format currency
  
  const i = computedValues.i;  // Decimal object
  const n = computedValues.n;  // Decimal object
  
  let latex = '';
  
  switch(formulaId) {
    case 'F_general':
      // F = R × [(1+i)^n - 1] / i (using Decimal.js)
      const onePlusI_F = new Decimal(1).plus(i);
      const powerN_F = Decimal.pow(onePlusI_F, n);
      const numerator_F = powerN_F.minus(1);
      const factor_F = numerator_F.div(i);
      
      latex = `$$F = ${fc(inputs.R)} \\left( \\dfrac{(1+${fd(i)})^{${fd(n)}} - 1}{${fd(i)}} \\right)$$`;
      latex += `$$F = ${fc(inputs.R)} \\left( \\dfrac{${fd(powerN_F)} - 1}{${fd(i)}} \\right)$$`;
      latex += `$$F = ${fc(inputs.R)} \\left( \\dfrac{${fd(numerator_F)}}{${fd(i)}} \\right)$$`;
      latex += `$$F = ${fc(inputs.R)} \\times ${fd(factor_F)}$$`;
      latex += `$$F = ${fc(result)}$$`;
      break;
      
    case 'P_general':
      // P = R × [1 - (1+i)^(-n)] / i (using Decimal.js)
      const onePlusI_P = new Decimal(1).plus(i);
      const powerNegN_P = Decimal.pow(onePlusI_P, n.neg());
      const numerator_P = new Decimal(1).minus(powerNegN_P);
      const factor_P = numerator_P.div(i);
      
      latex = `$$P = ${fc(inputs.R)} \\left( \\dfrac{1 - (1+${fd(i)})^{-${fd(n)}}}{${fd(i)}} \\right)$$`;
      latex += `$$P = ${fc(inputs.R)} \\left( \\dfrac{1 - ${fd(powerNegN_P)}}{${fd(i)}} \\right)$$`;
      latex += `$$P = ${fc(inputs.R)} \\left( \\dfrac{${fd(numerator_P)}}{${fd(i)}} \\right)$$`;
      latex += `$$P = ${fc(inputs.R)} \\times ${fd(factor_P)}$$`;
      latex += `$$P = ${fc(result)}$$`;
      break;
      
    case 'R_from_F':
      // R = F / [(1+i)^n - 1] × i (using Decimal.js)
      const onePlusI_RF = new Decimal(1).plus(i);
      const powerN_RF = Decimal.pow(onePlusI_RF, n);
      const numerator_RF = powerN_RF.minus(1);
      const denom_F = numerator_RF.div(i);
      
      latex = `$$R = \\dfrac{${fc(inputs.F)}}{\\dfrac{(1+${fd(i)})^{${fd(n)}} - 1}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.F)}}{\\dfrac{${fd(powerN_RF)} - 1}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.F)}}{\\dfrac{${fd(numerator_RF)}}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.F)}}{${fd(denom_F)}}$$`;
      latex += `$$R = ${fc(result)}$$`;
      break;
      
    case 'R_from_P':
      // R = P / [1 - (1+i)^(-n)] × i (using Decimal.js)
      const onePlusI_RP = new Decimal(1).plus(i);
      const powerNegN_RP = Decimal.pow(onePlusI_RP, n.neg());
      const numerator_RP = new Decimal(1).minus(powerNegN_RP);
      const denom_P = numerator_RP.div(i);
      
      latex = `$$R = \\dfrac{${fc(inputs.P)}}{\\dfrac{1 - (1+${fd(i)})^{-${fd(n)}}}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.P)}}{\\dfrac{1 - ${fd(powerNegN_RP)}}{${fd(i)}}}$$`;
      latex += `$$R = \\dfrac{${fc(inputs.P)}}{\\dfrac{${fd(numerator_RP)}}{${fd(i)}}}$$`;
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
  
  // Reset Next Step button visual state
  const nextBtn = document.getElementById('next-step-btn');
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
    nextBtn.style.cursor = 'pointer';
    nextBtn.textContent = 'Next Step →';
    nextBtn.style.display = 'none'; // Hide until we reach solution step
  }
  
  // Hide restart button
  document.getElementById('restart-btn').style.display = 'none';
  
  showBlock(1);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  showBlock(1);
});
