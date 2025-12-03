// BIZMATH: Deferred Annuity Calculator - GRESA Method
// Educational step-by-step calculator for Grade 11 learners

// ========== STATE MANAGEMENT ==========
let state = {
  inputs: {},
  computedValues: {},  // Store i and n (Decimal objects - full precision)
  computedValuesRounded: {},  // Store rounded i (8 decimals) for use in calculations
  result: null,
  currentGRESAStep: 0,
  gresaSteps: ['given', 'required', 'equation', 'solution', 'answer']
};

// ========== PRECISION BEHAVIOR ==========
// Deferred Annuity uses ROUNDED-INTERMEDIATE mode:
// - Compute i with full precision
// - Round i to 8 decimals
// - Use rounded i in all subsequent calculations
// This matches teacher's manual worked solutions

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
  
  // Convert Decimal to number if needed
  const num = (value instanceof Decimal) ? parseFloat(value.toString()) : Number(value);
  
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
  // Convert Decimal to number if needed
  const num = (value instanceof Decimal) ? parseFloat(value.toString()) : Number(value);
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ========== COMPUTATION FUNCTIONS ==========
function computeRatePerPeriod(r, m) {
  // i = r/m
  const R_dec = new Decimal(r);
  const M_dec = new Decimal(m);
  
  const i_dec = R_dec.div(M_dec);
  
  return i_dec;  // Return Decimal object
}

function computePaymentTerm(m, t) {
  // n = m × t
  const M_dec = new Decimal(m);
  const T_dec = new Decimal(t);
  
  const n_dec = M_dec.times(T_dec);
  
  return n_dec;  // Return Decimal object
}

// ========== CALCULATE RESULT ==========
function calculateResult() {
  // Collect inputs
  const R = parseFloat(document.getElementById('input-R').value);
  const r = parseFloat(document.getElementById('input-r').value);
  const m = parseFloat(document.getElementById('input-m').value);
  const t = parseFloat(document.getElementById('input-t').value);
  const k = parseFloat(document.getElementById('input-k').value);
  
  // Validate inputs
  if (isNaN(R) || isNaN(r) || isNaN(m) || isNaN(t) || isNaN(k)) {
    alert('Please enter valid numbers for all fields');
    return;
  }
  
  if (R <= 0 || r <= 0 || m <= 0 || t <= 0 || k < 0) {
    alert('Please enter positive values (k can be 0)');
    return;
  }
  
  // Store inputs
  state.inputs = { R, r, m, t, k };
  
  // Calculate i and n from r, m, t using Decimal.js
  // Compute with full precision
  state.computedValues.i = computeRatePerPeriod(r, m);  // Decimal object (full precision)
  state.computedValues.n = computePaymentTerm(m, t);  // Decimal object (full precision)
  
  // ROUNDED-INTERMEDIATE MODE: Round i to 8 decimals before using in calculations
  // This ensures results match teacher's manual worked solutions
  state.computedValuesRounded.i = new Decimal(state.computedValues.i.toFixed(8));
  state.computedValuesRounded.n = state.computedValues.n;  // n is usually exact integer
  
  // Use rounded i in all calculations (rounded-intermediate mode)
  const i = state.computedValuesRounded.i;  // Decimal object (rounded to 8 decimals)
  const n = state.computedValuesRounded.n;  // Decimal object
  
  // Calculate P using Decimal.js
  // P = R × [(1 - (1+i)^-(k+n)) / i] - R × [(1 - (1+i)^-k) / i]
  try {
    const R_dec = new Decimal(R);
    const k_dec = new Decimal(k);
    
    // First term: R × [(1 - (1+i)^-(k+n)) / i]
    const kPlusN = k_dec.plus(n);
    const negKPlusN = kPlusN.negated();
    const onePlusI = new Decimal(1).plus(i);
    const power1 = Decimal.pow(onePlusI, negKPlusN);
    const numerator1 = new Decimal(1).minus(power1);
    const fraction1 = numerator1.div(i);
    const term1 = R_dec.times(fraction1);
    
    // Second term: R × [(1 - (1+i)^-k) / i]
    const negK = k_dec.negated();
    const power2 = Decimal.pow(onePlusI, negK);
    const numerator2 = new Decimal(1).minus(power2);
    const fraction2 = numerator2.div(i);
    const term2 = R_dec.times(fraction2);
    
    // P = term1 - term2
    state.result = term1.minus(term2);
    
    displayGRESA();
    showBlock(2);
    
  } catch (error) {
    alert('Calculation error: ' + error.message);
  }
}

// ========== DISPLAY GRESA SOLUTION ==========
function displayGRESA() {
  const { inputs, computedValuesRounded, result } = state;
  
  // Helper function to format values
  const formatValue = (varKey, value) => {
    if (varKey === 'R' || varKey === 'P') {
      return `₱${formatCurrencyDisplay(value)}`;
    } else if (varKey === 'r' || varKey === 'i') {
      return formatDisplay(value);
    } else if (varKey === 't') {
      return `${formatDisplay(value)} years`;
    } else if (varKey === 'm' || varKey === 'n' || varKey === 'k') {
      return formatDisplay(value, { isInteger: true });
    }
    return formatDisplay(value);
  };
  
  // GIVEN - Show all input values including derived i and n
  let givenHTML = '<strong>Regular Payment (R):</strong> ' + formatValue('R', inputs.R) + '<br>';
  givenHTML += '<strong>Nominal Rate (r):</strong> ' + formatValue('r', inputs.r) + '<br>';
  givenHTML += '<strong>Frequency of Conversion (m):</strong> ' + formatValue('m', inputs.m) + '<br>';
  givenHTML += '<strong>Term (t):</strong> ' + formatValue('t', inputs.t) + '<br>';
  givenHTML += '<strong>Period of Deferral (k):</strong> ' + formatValue('k', inputs.k) + '<br>';
  givenHTML += '<br><em>Computed values:</em><br>';
  if (computedValuesRounded.i !== undefined) {
    givenHTML += '<strong>Rate per period (i):</strong> ' + formatValue('i', computedValuesRounded.i) + ' <em>(i = r/m)</em><br>';
  }
  if (computedValuesRounded.n !== undefined) {
    givenHTML += '<strong>Total payments (n):</strong> ' + formatValue('n', computedValuesRounded.n) + ' <em>(n = m × t)</em><br>';
  }
  
  document.getElementById('gresa-given').innerHTML = givenHTML;
  
  // REQUIRED
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Present Value (P)</strong> of the deferred annuity';
  
  // EQUATION
  const equationLatex = `$$P = R \\left(\\frac{1 - (1+i)^{-(k+n)}}{i}\\right) - R \\left(\\frac{1 - (1+i)^{-k}}{i}\\right)$$`;
  document.getElementById('gresa-equation').innerHTML = equationLatex;
  
  // SOLUTION - pass the rounded values used in calculation
  const solutionLatex = getSolutionLatex(inputs, computedValuesRounded, result);
  document.getElementById('gresa-solution').innerHTML = solutionLatex;
  
  // ANSWER
  const modeNote = '<br><small style="color: #666; font-style: italic;">*Rate per period (i) rounded to 8 decimals for manual-style worked solution.</small>';
  
  const answerText = `<strong>P = ${formatValue('P', result)}</strong>${modeNote}`;
  document.getElementById('gresa-answer').innerHTML = answerText;
  document.getElementById('final-answer').innerHTML = `P = ${formatValue('P', result)}`;
  
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

function getSolutionLatex(inputs, computed, result) {
  const fd = formatDisplay;  // Format decimals
  const fc = formatCurrencyDisplay;  // Format currency
  
  const R = inputs.R;
  const i = computed.i;
  const n = computed.n;
  const k = inputs.k;
  
  // Calculate intermediate values
  const onePlusI = new Decimal(1).plus(i);
  const kPlusN = new Decimal(k).plus(n);
  
  // First term calculations
  const negKPlusN = kPlusN.negated();
  const power1 = Decimal.pow(onePlusI, negKPlusN);
  const numerator1 = new Decimal(1).minus(power1);
  const fraction1 = numerator1.div(i);
  const term1 = new Decimal(R).times(fraction1);
  
  // Second term calculations
  const negK = new Decimal(k).negated();
  const power2 = Decimal.pow(onePlusI, negK);
  const numerator2 = new Decimal(1).minus(power2);
  const fraction2 = numerator2.div(i);
  const term2 = new Decimal(R).times(fraction2);
  
  let latex = '';
  
  // Step 1: Show formula with values
  latex += `$$P = ${fc(R)} \\left(\\frac{1 - (1+${fd(i)})^{-(${fd(k)}+${fd(n)})}}{${fd(i)}}\\right) - ${fc(R)} \\left(\\frac{1 - (1+${fd(i)})^{-${fd(k)}}}{${fd(i)}}\\right)$$`;
  
  // Step 2: Simplify exponents
  latex += `$$P = ${fc(R)} \\left(\\frac{1 - (${fd(onePlusI)})^{-${fd(kPlusN)}}}{${fd(i)}}\\right) - ${fc(R)} \\left(\\frac{1 - (${fd(onePlusI)})^{-${fd(k)}}}{${fd(i)}}\\right)$$`;
  
  // Step 3: Calculate powers
  latex += `$$P = ${fc(R)} \\left(\\frac{1 - ${fd(power1)}}{${fd(i)}}\\right) - ${fc(R)} \\left(\\frac{1 - ${fd(power2)}}{${fd(i)}}\\right)$$`;
  
  // Step 4: Calculate numerators
  latex += `$$P = ${fc(R)} \\left(\\frac{${fd(numerator1)}}{${fd(i)}}\\right) - ${fc(R)} \\left(\\frac{${fd(numerator2)}}{${fd(i)}}\\right)$$`;
  
  // Step 5: Calculate fractions
  latex += `$$P = ${fc(R)} \\times ${fd(fraction1)} - ${fc(R)} \\times ${fd(fraction2)}$$`;
  
  // Step 6: Calculate terms
  latex += `$$P = ${fc(term1)} - ${fc(term2)}$$`;
  
  // Step 7: Final answer
  latex += `$$P = ${fc(result)}$$`;
  
  return latex;
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
    finalAnswer.classList.add('hidden');
    finalAnswer.classList.remove('visible');
  }
}

function showNextGRESAStep() {
  if (state.currentGRESAStep < state.gresaSteps.length) {
    const stepName = state.gresaSteps[state.currentGRESAStep];
    const element = document.getElementById(`gresa-item-${stepName}`);
    
    if (element) {
      element.style.opacity = '1';
      element.classList.add('visible', 'slide-in');
      
      // Typeset MathJax for this step
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([element]);
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
    finalAnswer.classList.remove('hidden');
    finalAnswer.classList.add('visible');
    
    // Play success sound
    playSuccessSound();
    
    // Update button
    const nextBtn = document.getElementById('next-step-btn');
    nextBtn.style.display = 'none';
    
    // Show restart button
    document.getElementById('restart-btn').style.display = 'inline-block';
  }
}

// ========== NAVIGATION CONTROLS ==========
function showBlock(blockNumber) {
  // Hide all blocks
  document.getElementById('block1').classList.add('hidden');
  document.getElementById('block2').classList.add('hidden');
  
  // Show selected block
  document.getElementById(`block${blockNumber}`).classList.remove('hidden');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetCalculator() {
  state = {
    inputs: {},
    computedValues: {},
    computedValuesRounded: {},
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
  
  // Clear inputs
  document.getElementById('input-R').value = '';
  document.getElementById('input-r').value = '';
  document.getElementById('input-m').value = '';
  document.getElementById('input-t').value = '';
  document.getElementById('input-k').value = '';
  
  showBlock(1);
}
