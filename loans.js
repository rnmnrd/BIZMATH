// BIZMATH: Loan Calculator - GRESA Method
// Educational step-by-step calculator for Grade 11 learners

// ========== STATE MANAGEMENT ==========
let state = {
  selectedVariable: null,
  inputs: {},
  computed: {},
  result: null,
  currentGRESAStep: 0,
  gresaSteps: ['given', 'required', 'equation', 'solution', 'answer']
};

// ========== AUDIO CONTEXT FOR SUCCESS SOUND ==========
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSuccessSound() {
  initAudio();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// ========== DISPLAY FORMATTING UTILITIES ==========
function formatDisplay(value, options = {}) {
  const { decimals = 8, stripTrailingZeros = true, isInteger = false } = options;
  const num = (value instanceof Decimal) ? parseFloat(value.toString()) : Number(value);
  if (isInteger || Number.isInteger(num)) return num.toString();
  let formatted = num.toFixed(decimals);
  if (stripTrailingZeros) {
    formatted = formatted.replace(/(\.[0-9]*?)0+$/, '$1').replace(/\.$/, '');
  }
  return formatted;
}

function formatCurrencyDisplay(value) {
  const num = (value instanceof Decimal) ? parseFloat(value.toString()) : Number(value);
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ========== NAVIGATION FUNCTIONS ==========
function showBlock(blockNumber) {
  document.querySelectorAll('.block').forEach(block => block.classList.add('hidden'));
  const targetBlock = document.getElementById(`block${blockNumber}`);
  if (targetBlock) targetBlock.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack(fromBlock) {
  if (fromBlock === 2) {
    showBlock(1);
  }
}

// ========== STEP 1: SELECT VARIABLE ==========
function selectVariable(variable) {
  state.selectedVariable = variable;
  state.inputs = {};
  state.computed = {};
  generateInputs();
  showBlock(2);
}

// ========== STEP 2: GENERATE INPUTS ==========
function generateInputs() {
  const container = document.getElementById('input-container');
  const variable = state.selectedVariable;
  
  if (variable === 'regular-payment') {
    // Regular Payment (R) = P / [(1 - (1+i)^-n) / i]
    // Inputs: P, r, m, t
    container.innerHTML = `
      <div class="input-group">
        <label for="input-principal">Loan Amount / Principal (P)</label>
        <div class="input-wrapper">
          <input type="number" id="input-principal" step="any" placeholder="Enter loan amount" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-rate">Nominal Interest Rate (r)</label>
        <div class="input-wrapper">
          <input type="number" id="input-rate" step="any" placeholder="Enter rate (e.g., 0.06 for 6%)" required>
          <span class="unit">(decimal)</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-frequency">Frequency of Conversions (m)</label>
        <div class="input-wrapper">
          <input type="number" id="input-frequency" step="1" placeholder="1=annual, 2=semi, 4=quarterly, 12=monthly" required>
          <span class="unit">times/year</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-time">Time (t)</label>
        <div class="input-wrapper">
          <input type="number" id="input-time" step="any" placeholder="Enter time in years" required>
          <span class="unit">years</span>
        </div>
      </div>
    `;
  } else if (variable === 'total-interest') {
    // Total Interest (I) = R × n - P
    // Inputs: R, P, m, t
    container.innerHTML = `
      <div class="input-group">
        <label for="input-regular-payment">Regular Payment (R)</label>
        <div class="input-wrapper">
          <input type="number" id="input-regular-payment" step="any" placeholder="Enter regular payment" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-principal">Principal (P)</label>
        <div class="input-wrapper">
          <input type="number" id="input-principal" step="any" placeholder="Enter principal amount" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-frequency">Frequency of Conversions (m)</label>
        <div class="input-wrapper">
          <input type="number" id="input-frequency" step="1" placeholder="1=annual, 2=semi, 4=quarterly, 12=monthly" required>
          <span class="unit">times/year</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-time">Time (t)</label>
        <div class="input-wrapper">
          <input type="number" id="input-time" step="any" placeholder="Enter time in years" required>
          <span class="unit">years</span>
        </div>
      </div>
    `;
  }
}

// ========== STEP 3: CALCULATE RESULT ==========
function calculateResult() {
  const variable = state.selectedVariable;
  
  try {
    if (variable === 'regular-payment') {
      const P = parseFloat(document.getElementById('input-principal').value);
      const r = parseFloat(document.getElementById('input-rate').value);
      const m = parseFloat(document.getElementById('input-frequency').value);
      const t = parseFloat(document.getElementById('input-time').value);
      
      if (isNaN(P) || isNaN(r) || isNaN(m) || isNaN(t)) {
        alert('Please enter valid values for all fields');
        return;
      }
      
      if (P <= 0 || r <= 0 || m <= 0 || t <= 0) {
        alert('All values must be positive');
        return;
      }
      
      state.inputs = { P, r, m, t };
      
      // Compute i = r / m
      const i = new Decimal(r).div(m);
      
      // Compute n = m × t
      const n = new Decimal(m).times(t);
      
      state.computed = { i, n };
      
      // Compute R = P / [(1 - (1+i)^-n) / i]
      // R = P × i / (1 - (1+i)^-n)
      const onePlusI = new Decimal(1).plus(i);
      const negN = n.negated();
      const power = Decimal.pow(onePlusI, negN);
      const numerator = new Decimal(1).minus(power);
      const denominator = numerator.div(i);
      const R = new Decimal(P).div(denominator);
      
      state.result = R;
      
    } else if (variable === 'total-interest') {
      const R = parseFloat(document.getElementById('input-regular-payment').value);
      const P = parseFloat(document.getElementById('input-principal').value);
      const m = parseFloat(document.getElementById('input-frequency').value);
      const t = parseFloat(document.getElementById('input-time').value);
      
      if (isNaN(R) || isNaN(P) || isNaN(m) || isNaN(t)) {
        alert('Please enter valid values for all fields');
        return;
      }
      
      if (R <= 0 || P <= 0 || m <= 0 || t <= 0) {
        alert('All values must be positive');
        return;
      }
      
      state.inputs = { R, P, m, t };
      
      // Compute n = m × t
      const n = new Decimal(m).times(t);
      
      state.computed = { n };
      
      // Compute I = R × n - P
      const I = new Decimal(R).times(n).minus(P);
      
      state.result = I;
    }
    
    displayGRESA();
    showBlock(3);
    
  } catch (error) {
    alert('Calculation error: ' + error.message);
  }
}

// ========== DISPLAY GRESA SOLUTION ==========
function displayGRESA() {
  const variable = state.selectedVariable;
  
  if (variable === 'regular-payment') displayGRESARegularPayment();
  else if (variable === 'total-interest') displayGRESATotalInterest();
  
  state.currentGRESAStep = 0;
  hideAllGRESASteps();
  document.getElementById('next-step-btn').style.display = 'inline-block';
  document.getElementById('restart-btn').style.display = 'none';
  
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise();
  }
}

function displayGRESARegularPayment() {
  const { inputs, computed, result } = state;
  
  // GIVEN
  let givenHTML = `<strong>Principal (P):</strong> ₱${formatCurrencyDisplay(inputs.P)}<br>`;
  givenHTML += `<strong>Nominal Rate (r):</strong> ${formatDisplay(inputs.r)}<br>`;
  givenHTML += `<strong>Frequency (m):</strong> ${formatDisplay(inputs.m, { isInteger: true })} times/year<br>`;
  givenHTML += `<strong>Time (t):</strong> ${formatDisplay(inputs.t)} years<br><br>`;
  givenHTML += `<em>Computed values:</em><br>`;
  givenHTML += `<strong>Interest rate per period (i):</strong> ${formatDisplay(computed.i)} <em>(i = r/m)</em><br>`;
  givenHTML += `<strong>Total number of payments (n):</strong> ${formatDisplay(computed.n, { isInteger: true })} <em>(n = m × t)</em>`;
  document.getElementById('gresa-given').innerHTML = givenHTML;
  
  // REQUIRED
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Regular Payment (R)</strong>';
  
  // EQUATION
  document.getElementById('gresa-equation').innerHTML = '$$R = \\frac{P}{\\dfrac{1 - (1 + i)^{-n}}{i}}$$';
  
  // SOLUTION
  const P = inputs.P;
  const i = computed.i;
  const n = computed.n;
  const onePlusI = new Decimal(1).plus(i);
  const negN = n.negated();
  const power = Decimal.pow(onePlusI, negN);
  const oneMinusPower = new Decimal(1).minus(power);
  const denominator = oneMinusPower.div(i);
  
  let solutionHTML = `$$R = \\frac{${formatCurrencyDisplay(P)}}{\\dfrac{1 - (1 + ${formatDisplay(i)})^{-${formatDisplay(n, { isInteger: true })}}}{${formatDisplay(i)}}}$$`;
  solutionHTML += `$$R = \\frac{${formatCurrencyDisplay(P)}}{\\dfrac{1 - (${formatDisplay(onePlusI)})^{-${formatDisplay(n, { isInteger: true })}}}{${formatDisplay(i)}}}$$`;
  solutionHTML += `$$R = \\frac{${formatCurrencyDisplay(P)}}{\\dfrac{1 - ${formatDisplay(power)}}{${formatDisplay(i)}}}$$`;
  solutionHTML += `$$R = \\frac{${formatCurrencyDisplay(P)}}{\\dfrac{${formatDisplay(oneMinusPower)}}{${formatDisplay(i)}}}$$`;
  solutionHTML += `$$R = \\frac{${formatCurrencyDisplay(P)}}{${formatDisplay(denominator)}}$$`;
  solutionHTML += `$$R = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  
  document.getElementById('gresa-solution').innerHTML = solutionHTML;
  
  // ANSWER
  document.getElementById('gresa-answer').innerHTML = `<strong>Regular Payment (R) = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Regular Payment (R) = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESATotalInterest() {
  const { inputs, computed, result } = state;
  
  // GIVEN
  let givenHTML = `<strong>Regular Payment (R):</strong> ₱${formatCurrencyDisplay(inputs.R)}<br>`;
  givenHTML += `<strong>Principal (P):</strong> ₱${formatCurrencyDisplay(inputs.P)}<br>`;
  givenHTML += `<strong>Frequency (m):</strong> ${formatDisplay(inputs.m, { isInteger: true })} times/year<br>`;
  givenHTML += `<strong>Time (t):</strong> ${formatDisplay(inputs.t)} years<br><br>`;
  givenHTML += `<em>Computed values:</em><br>`;
  givenHTML += `<strong>Total number of payments (n):</strong> ${formatDisplay(computed.n, { isInteger: true })} <em>(n = m × t)</em>`;
  document.getElementById('gresa-given').innerHTML = givenHTML;
  
  // REQUIRED
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Total Amount of Interest (I)</strong>';
  
  // EQUATION
  document.getElementById('gresa-equation').innerHTML = '$$I = R \\times n - P$$';
  
  // SOLUTION
  const R = inputs.R;
  const n = computed.n;
  const P = inputs.P;
  const RtimesN = new Decimal(R).times(n);
  
  let solutionHTML = `$$I = ${formatCurrencyDisplay(R)} \\times ${formatDisplay(n, { isInteger: true })} - ${formatCurrencyDisplay(P)}$$`;
  solutionHTML += `$$I = ${formatCurrencyDisplay(RtimesN)} - ${formatCurrencyDisplay(P)}$$`;
  solutionHTML += `$$I = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  
  document.getElementById('gresa-solution').innerHTML = solutionHTML;
  
  // ANSWER
  document.getElementById('gresa-answer').innerHTML = `<strong>Total Amount of Interest (I) = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Total Amount of Interest (I) = ₱${formatCurrencyDisplay(result)}`;
}

// ========== PROGRESSIVE DISCLOSURE ==========
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
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([element]);
      }
    }
    state.currentGRESAStep++;
    if (state.currentGRESAStep >= state.gresaSteps.length) {
      setTimeout(() => showFinalAnswer(), 400);
    }
  }
}

function showFinalAnswer() {
  const finalAnswer = document.getElementById('final-answer');
  if (finalAnswer) {
    finalAnswer.classList.remove('hidden');
    finalAnswer.classList.add('visible');
    playSuccessSound();
    document.getElementById('next-step-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'inline-block';
  }
}

// ========== RESET CALCULATOR ==========
function resetCalculator() {
  state = {
    selectedVariable: null,
    inputs: {},
    computed: {},
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
