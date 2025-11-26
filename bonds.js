// BIZMATH: Bonds Calculator - GRESA Method
// Educational step-by-step calculator for Grade 11 learners

// ========== STATE MANAGEMENT ==========
let state = {
  selectedVariable: null,
  inputs: {},
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

function formatPercentDisplay(value) {
  const num = (value instanceof Decimal) ? parseFloat(value.toString()) : Number(value);
  const percent = num * 100;
  return formatDisplay(percent, { decimals: 2 });
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
  generateInputs();
  showBlock(2);
}

// ========== STEP 2: GENERATE INPUTS ==========
function generateInputs() {
  const container = document.getElementById('input-container');
  const variable = state.selectedVariable;
  
  if (variable === 'annual-coupon') {
    // Annual Coupon Amount = F × r ÷ m₁
    container.innerHTML = `
      <div class="input-group">
        <label for="input-face-value">Face Value (F)</label>
        <div class="input-wrapper">
          <input type="number" id="input-face-value" step="any" placeholder="Enter face value" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-coupon-rate">Coupon Rate (r)</label>
        <div class="input-wrapper">
          <input type="number" id="input-coupon-rate" step="any" placeholder="Enter rate (e.g., 0.05 for 5%)" required>
          <span class="unit">(decimal)</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-payment-interval">Payment Interval (m₁)</label>
        <div class="input-wrapper">
          <input type="number" id="input-payment-interval" step="1" placeholder="Enter payment interval" required>
          <span class="unit">times/year</span>
        </div>
      </div>
    `;
  } else if (variable === 'semi-annual-coupon') {
    // Semi-Annual Coupon Amount = F × r ÷ 2
    container.innerHTML = `
      <div class="input-group">
        <label for="input-face-value">Face Value (F)</label>
        <div class="input-wrapper">
          <input type="number" id="input-face-value" step="any" placeholder="Enter face value" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-coupon-rate">Coupon Rate (r)</label>
        <div class="input-wrapper">
          <input type="number" id="input-coupon-rate" step="any" placeholder="Enter rate (e.g., 0.05 for 5%)" required>
          <span class="unit">(decimal)</span>
        </div>
      </div>
    `;
  } else if (variable === 'total-investment') {
    // Total Investment = Number of Bonds × F × Bond Quotation
    container.innerHTML = `
      <div class="input-group">
        <label for="input-num-bonds">Number of Bonds</label>
        <div class="input-wrapper">
          <input type="number" id="input-num-bonds" step="1" placeholder="Enter number of bonds" required>
          <span class="unit">bonds</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-face-value">Face Value (F)</label>
        <div class="input-wrapper">
          <input type="number" id="input-face-value" step="any" placeholder="Enter face value" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-bond-quotation">Bond Quotation</label>
        <div class="input-wrapper">
          <input type="number" id="input-bond-quotation" step="any" placeholder="Enter quotation (e.g., 1.05)" required>
          <span class="unit">(decimal)</span>
        </div>
      </div>
    `;
  } else if (variable === 'market-price') {
    // Market Price = F × Bond Quotation
    container.innerHTML = `
      <div class="input-group">
        <label for="input-face-value">Face Value (F)</label>
        <div class="input-wrapper">
          <input type="number" id="input-face-value" step="any" placeholder="Enter face value" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-bond-quotation">Bond Quotation</label>
        <div class="input-wrapper">
          <input type="number" id="input-bond-quotation" step="any" placeholder="Enter quotation (e.g., 1.05)" required>
          <span class="unit">(decimal)</span>
        </div>
      </div>
    `;
  } else if (variable === 'annual-income') {
    // Annual Income = Number of Bonds × F × r × t
    container.innerHTML = `
      <div class="input-group">
        <label for="input-num-bonds">Number of Bonds</label>
        <div class="input-wrapper">
          <input type="number" id="input-num-bonds" step="1" placeholder="Enter number of bonds" required>
          <span class="unit">bonds</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-face-value">Face Value (F)</label>
        <div class="input-wrapper">
          <input type="number" id="input-face-value" step="any" placeholder="Enter face value" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-nominal-rate">Nominal Rate (r)</label>
        <div class="input-wrapper">
          <input type="number" id="input-nominal-rate" step="any" placeholder="Enter rate (e.g., 0.05 for 5%)" required>
          <span class="unit">(decimal)</span>
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
  } else if (variable === 'amount-invested') {
    // Amount Invested = Market Price + Commission
    container.innerHTML = `
      <div class="input-group">
        <label for="input-market-price">Market Price</label>
        <div class="input-wrapper">
          <input type="number" id="input-market-price" step="any" placeholder="Enter market price" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-commission">Commission</label>
        <div class="input-wrapper">
          <input type="number" id="input-commission" step="any" placeholder="Enter commission" required>
          <span class="unit">₱</span>
        </div>
      </div>
    `;
  } else if (variable === 'yield') {
    // Yield = Annual Income ÷ Amount Invested
    container.innerHTML = `
      <div class="input-group">
        <label for="input-annual-income">Annual Income</label>
        <div class="input-wrapper">
          <input type="number" id="input-annual-income" step="any" placeholder="Enter annual income" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-amount-invested">Amount Invested</label>
        <div class="input-wrapper">
          <input type="number" id="input-amount-invested" step="any" placeholder="Enter amount invested" required>
          <span class="unit">₱</span>
        </div>
      </div>
    `;
  }
}

// ========== STEP 3: CALCULATE RESULT ==========
function calculateResult() {
  const variable = state.selectedVariable;
  
  try {
    if (variable === 'annual-coupon') {
      const faceValue = parseFloat(document.getElementById('input-face-value').value);
      const couponRate = parseFloat(document.getElementById('input-coupon-rate').value);
      const paymentInterval = parseFloat(document.getElementById('input-payment-interval').value);
      
      if (isNaN(faceValue) || isNaN(couponRate) || isNaN(paymentInterval) || paymentInterval <= 0) {
        alert('Please enter valid values');
        return;
      }
      
      state.inputs = { faceValue, couponRate, paymentInterval };
      state.result = new Decimal(faceValue).times(couponRate).div(paymentInterval);
      
    } else if (variable === 'semi-annual-coupon') {
      const faceValue = parseFloat(document.getElementById('input-face-value').value);
      const couponRate = parseFloat(document.getElementById('input-coupon-rate').value);
      
      if (isNaN(faceValue) || isNaN(couponRate)) {
        alert('Please enter valid values');
        return;
      }
      
      state.inputs = { faceValue, couponRate };
      state.result = new Decimal(faceValue).times(couponRate).div(2);
      
    } else if (variable === 'total-investment') {
      const numBonds = parseFloat(document.getElementById('input-num-bonds').value);
      const faceValue = parseFloat(document.getElementById('input-face-value').value);
      const bondQuotation = parseFloat(document.getElementById('input-bond-quotation').value);
      
      if (isNaN(numBonds) || isNaN(faceValue) || isNaN(bondQuotation)) {
        alert('Please enter valid values');
        return;
      }
      
      state.inputs = { numBonds, faceValue, bondQuotation };
      state.result = new Decimal(numBonds).times(faceValue).times(bondQuotation);
      
    } else if (variable === 'market-price') {
      const faceValue = parseFloat(document.getElementById('input-face-value').value);
      const bondQuotation = parseFloat(document.getElementById('input-bond-quotation').value);
      
      if (isNaN(faceValue) || isNaN(bondQuotation)) {
        alert('Please enter valid values');
        return;
      }
      
      state.inputs = { faceValue, bondQuotation };
      state.result = new Decimal(faceValue).times(bondQuotation);
      
    } else if (variable === 'annual-income') {
      const numBonds = parseFloat(document.getElementById('input-num-bonds').value);
      const faceValue = parseFloat(document.getElementById('input-face-value').value);
      const nominalRate = parseFloat(document.getElementById('input-nominal-rate').value);
      const time = parseFloat(document.getElementById('input-time').value);
      
      if (isNaN(numBonds) || isNaN(faceValue) || isNaN(nominalRate) || isNaN(time)) {
        alert('Please enter valid values');
        return;
      }
      
      state.inputs = { numBonds, faceValue, nominalRate, time };
      state.result = new Decimal(numBonds).times(faceValue).times(nominalRate).times(time);
      
    } else if (variable === 'amount-invested') {
      const marketPrice = parseFloat(document.getElementById('input-market-price').value);
      const commission = parseFloat(document.getElementById('input-commission').value);
      
      if (isNaN(marketPrice) || isNaN(commission)) {
        alert('Please enter valid values');
        return;
      }
      
      state.inputs = { marketPrice, commission };
      state.result = new Decimal(marketPrice).plus(commission);
      
    } else if (variable === 'yield') {
      const annualIncome = parseFloat(document.getElementById('input-annual-income').value);
      const amountInvested = parseFloat(document.getElementById('input-amount-invested').value);
      
      if (isNaN(annualIncome) || isNaN(amountInvested) || amountInvested <= 0) {
        alert('Please enter valid values');
        return;
      }
      
      state.inputs = { annualIncome, amountInvested };
      state.result = new Decimal(annualIncome).div(amountInvested);
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
  
  if (variable === 'annual-coupon') displayGRESAAnnualCoupon();
  else if (variable === 'semi-annual-coupon') displayGRESASemiAnnualCoupon();
  else if (variable === 'total-investment') displayGRESATotalInvestment();
  else if (variable === 'market-price') displayGRESAMarketPrice();
  else if (variable === 'annual-income') displayGRESAAnnualIncome();
  else if (variable === 'amount-invested') displayGRESAAmountInvested();
  else if (variable === 'yield') displayGRESAYield();
  
  state.currentGRESAStep = 0;
  hideAllGRESASteps();
  document.getElementById('next-step-btn').style.display = 'inline-block';
  document.getElementById('restart-btn').style.display = 'none';
  
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise();
  }
}

function displayGRESAAnnualCoupon() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Face Value (F):</strong> ₱${formatCurrencyDisplay(inputs.faceValue)}<br><strong>Coupon Rate (r):</strong> ${formatDisplay(inputs.couponRate)}<br><strong>Payment Interval (m₁):</strong> ${formatDisplay(inputs.paymentInterval, { isInteger: true })} times/year`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Annual Coupon Amount</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Annual Coupon Amount} = \\frac{F \\times r}{m_1}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Annual Coupon Amount} = \\frac{${formatCurrencyDisplay(inputs.faceValue)} \\times ${formatDisplay(inputs.couponRate)}}{${formatDisplay(inputs.paymentInterval, { isInteger: true })}}$$$$\\text{Annual Coupon Amount} = \\frac{${formatCurrencyDisplay(new Decimal(inputs.faceValue).times(inputs.couponRate))}}{${formatDisplay(inputs.paymentInterval, { isInteger: true })}}$$$$\\text{Annual Coupon Amount} = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Annual Coupon Amount = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Annual Coupon Amount = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESASemiAnnualCoupon() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Face Value (F):</strong> ₱${formatCurrencyDisplay(inputs.faceValue)}<br><strong>Coupon Rate (r):</strong> ${formatDisplay(inputs.couponRate)}`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Semi-Annual Coupon Amount</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Semi-Annual Coupon Amount} = \\frac{F \\times r}{2}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Semi-Annual Coupon Amount} = \\frac{${formatCurrencyDisplay(inputs.faceValue)} \\times ${formatDisplay(inputs.couponRate)}}{2}$$$$\\text{Semi-Annual Coupon Amount} = \\frac{${formatCurrencyDisplay(new Decimal(inputs.faceValue).times(inputs.couponRate))}}{2}$$$$\\text{Semi-Annual Coupon Amount} = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Semi-Annual Coupon Amount = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Semi-Annual Coupon Amount = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESATotalInvestment() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Number of Bonds:</strong> ${formatDisplay(inputs.numBonds, { isInteger: true })} bonds<br><strong>Face Value (F):</strong> ₱${formatCurrencyDisplay(inputs.faceValue)}<br><strong>Bond Quotation:</strong> ${formatDisplay(inputs.bondQuotation)}`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Total Investment</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Total Investment} = \\text{Number of Bonds} \\times F \\times \\text{Bond Quotation}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Total Investment} = ${formatDisplay(inputs.numBonds, { isInteger: true })} \\times ${formatCurrencyDisplay(inputs.faceValue)} \\times ${formatDisplay(inputs.bondQuotation)}$$$$\\text{Total Investment} = ${formatCurrencyDisplay(new Decimal(inputs.numBonds).times(inputs.faceValue))} \\times ${formatDisplay(inputs.bondQuotation)}$$$$\\text{Total Investment} = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Total Investment = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Total Investment = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESAMarketPrice() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Face Value (F):</strong> ₱${formatCurrencyDisplay(inputs.faceValue)}<br><strong>Bond Quotation:</strong> ${formatDisplay(inputs.bondQuotation)}`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Market Price</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Market Price} = F \\times \\text{Bond Quotation}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Market Price} = ${formatCurrencyDisplay(inputs.faceValue)} \\times ${formatDisplay(inputs.bondQuotation)}$$$$\\text{Market Price} = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Market Price = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Market Price = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESAAnnualIncome() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Number of Bonds:</strong> ${formatDisplay(inputs.numBonds, { isInteger: true })} bonds<br><strong>Face Value (F):</strong> ₱${formatCurrencyDisplay(inputs.faceValue)}<br><strong>Nominal Rate (r):</strong> ${formatDisplay(inputs.nominalRate)}<br><strong>Time (t):</strong> ${formatDisplay(inputs.time)} years`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Annual Income</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Annual Income} = \\text{Number of Bonds} \\times F \\times r \\times t$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Annual Income} = ${formatDisplay(inputs.numBonds, { isInteger: true })} \\times ${formatCurrencyDisplay(inputs.faceValue)} \\times ${formatDisplay(inputs.nominalRate)} \\times ${formatDisplay(inputs.time)}$$$$\\text{Annual Income} = ${formatCurrencyDisplay(new Decimal(inputs.numBonds).times(inputs.faceValue))} \\times ${formatDisplay(inputs.nominalRate)} \\times ${formatDisplay(inputs.time)}$$$$\\text{Annual Income} = ${formatCurrencyDisplay(new Decimal(inputs.numBonds).times(inputs.faceValue).times(inputs.nominalRate))} \\times ${formatDisplay(inputs.time)}$$$$\\text{Annual Income} = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Annual Income = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Annual Income = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESAAmountInvested() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Market Price:</strong> ₱${formatCurrencyDisplay(inputs.marketPrice)}<br><strong>Commission:</strong> ₱${formatCurrencyDisplay(inputs.commission)}`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Amount Invested</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Amount Invested} = \\text{Market Price} + \\text{Commission}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Amount Invested} = ${formatCurrencyDisplay(inputs.marketPrice)} + ${formatCurrencyDisplay(inputs.commission)}$$$$\\text{Amount Invested} = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Amount Invested = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Amount Invested = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESAYield() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Annual Income:</strong> ₱${formatCurrencyDisplay(inputs.annualIncome)}<br><strong>Amount Invested:</strong> ₱${formatCurrencyDisplay(inputs.amountInvested)}`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Yield</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Yield} = \\frac{\\text{Annual Income}}{\\text{Amount Invested}}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Yield} = \\frac{${formatCurrencyDisplay(inputs.annualIncome)}}{${formatCurrencyDisplay(inputs.amountInvested)}}$$$$\\text{Yield} = ${formatDisplay(result)}$$$$\\text{Yield} = ${formatPercentDisplay(result)}\\%$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Yield = ${formatPercentDisplay(result)}%</strong><br><small>(or ${formatDisplay(result)} in decimal form)</small>`;
  document.getElementById('final-answer').innerHTML = `Yield = ${formatPercentDisplay(result)}%`;
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
