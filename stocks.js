// BIZMATH: Stocks Calculator - GRESA Method
// Educational step-by-step calculator for Grade 11 learners

// ========== STATE MANAGEMENT ==========
let state = {
  selectedVariable: null,
  selectedFormula: null,
  isComparison: false,
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
  if (fromBlock === 1) {
    showBlock(1);
  } else if (fromBlock === 2) {
    if (state.selectedVariable === 'dividend-per-share') {
      showBlock('1_1');
    } else if (state.selectedVariable === 'stock-yield') {
      showBlock('1_1_1');
    } else {
      showBlock(1);
    }
  }
}

// ========== STEP 1: SELECT VARIABLE ==========
function selectVariable(variable) {
  state.selectedVariable = variable;
  state.selectedFormula = null;
  state.isComparison = false;
  state.inputs = {};
  state.computed = {};
  
  if (variable === 'dividend-per-share') {
    showBlock('1_1');
  } else if (variable === 'stock-yield') {
    showBlock('1_1_1');
  } else {
    state.selectedFormula = variable;
    generateInputs();
    showBlock(2);
  }
}

// ========== STEP 1.1: SELECT FORMULA ==========
function selectFormula(formula) {
  state.selectedFormula = formula;
  generateInputs();
  showBlock(2);
}

// ========== STEP 1.1.1: SELECT COMPARISON ==========
function selectComparison(choice) {
  state.isComparison = (choice === 'yes');
  state.selectedFormula = 'stock-yield';
  generateInputs();
  showBlock(2);
}

// ========== STEP 2: GENERATE INPUTS ==========
function generateInputs() {
  const container = document.getElementById('input-container');
  const formula = state.selectedFormula;
  
  if (formula === 'dps-method1') {
    container.innerHTML = `
      <div class="input-group">
        <label for="input-total-dividend">Total Dividend</label>
        <div class="input-wrapper">
          <input type="number" id="input-total-dividend" step="any" placeholder="Enter total dividend" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-total-shares">Total Number of Shares</label>
        <div class="input-wrapper">
          <input type="number" id="input-total-shares" step="1" placeholder="Enter total shares" required>
          <span class="unit">shares</span>
        </div>
      </div>
    `;
  } else if (formula === 'dps-method2') {
    container.innerHTML = `
      <div class="input-group">
        <label for="input-par-value">Par Value</label>
        <div class="input-wrapper">
          <input type="number" id="input-par-value" step="any" placeholder="Enter par value" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-dividend-percent">Dividend Percentage</label>
        <div class="input-wrapper">
          <input type="number" id="input-dividend-percent" step="any" placeholder="Enter dividend % (e.g., 5 for 5%)" required>
          <span class="unit">%</span>
        </div>
      </div>
    `;
  } else if (formula === 'total-dividend') {
    container.innerHTML = `
      <div class="input-group">
        <label for="input-dividend-per-share">Dividend per Share</label>
        <div class="input-wrapper">
          <input type="number" id="input-dividend-per-share" step="any" placeholder="Enter dividend per share" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-total-shares">Total Number of Shares</label>
        <div class="input-wrapper">
          <input type="number" id="input-total-shares" step="1" placeholder="Enter total shares" required>
          <span class="unit">shares</span>
        </div>
      </div>
    `;
  } else if (formula === 'total-shares') {
    container.innerHTML = `
      <div class="input-group">
        <label for="input-total-dividend">Total Dividend</label>
        <div class="input-wrapper">
          <input type="number" id="input-total-dividend" step="any" placeholder="Enter total dividend" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-dividend-per-share">Dividend per Share</label>
        <div class="input-wrapper">
          <input type="number" id="input-dividend-per-share" step="any" placeholder="Enter dividend per share" required>
          <span class="unit">₱</span>
        </div>
      </div>
    `;
  } else if (formula === 'stock-yield' && !state.isComparison) {
    container.innerHTML = `
      <div class="input-group">
        <label for="input-dividend-per-share">Dividend per Share</label>
        <div class="input-wrapper">
          <input type="number" id="input-dividend-per-share" step="any" placeholder="Enter dividend per share" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-market-value">Market Value</label>
        <div class="input-wrapper">
          <input type="number" id="input-market-value" step="any" placeholder="Enter market value" required>
          <span class="unit">₱</span>
        </div>
      </div>
    `;
  } else if (formula === 'stock-yield' && state.isComparison) {
    container.innerHTML = `
      <h3 style="color: #3498db; margin-top: 10px; margin-bottom: 15px;">📊 Corporation A</h3>
      <div class="input-group">
        <label for="input-dividend-per-share-a">Dividend per Share (A)</label>
        <div class="input-wrapper">
          <input type="number" id="input-dividend-per-share-a" step="any" placeholder="Enter dividend per share for A" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-market-value-a">Market Value (A)</label>
        <div class="input-wrapper">
          <input type="number" id="input-market-value-a" step="any" placeholder="Enter market value for A" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <h3 style="color: #e74c3c; margin-top: 25px; margin-bottom: 15px;">📊 Corporation B</h3>
      <div class="input-group">
        <label for="input-dividend-per-share-b">Dividend per Share (B)</label>
        <div class="input-wrapper">
          <input type="number" id="input-dividend-per-share-b" step="any" placeholder="Enter dividend per share for B" required>
          <span class="unit">₱</span>
        </div>
      </div>
      <div class="input-group">
        <label for="input-market-value-b">Market Value (B)</label>
        <div class="input-wrapper">
          <input type="number" id="input-market-value-b" step="any" placeholder="Enter market value for B" required>
          <span class="unit">₱</span>
        </div>
      </div>
    `;
  }
}

// ========== STEP 3: CALCULATE RESULT ==========
function calculateResult() {
  const formula = state.selectedFormula;
  
  try {
    if (formula === 'dps-method1') {
      const totalDividend = parseFloat(document.getElementById('input-total-dividend').value);
      const totalShares = parseFloat(document.getElementById('input-total-shares').value);
      if (isNaN(totalDividend) || isNaN(totalShares) || totalShares <= 0) {
        alert('Please enter valid values');
        return;
      }
      state.inputs = { totalDividend, totalShares };
      state.result = new Decimal(totalDividend).div(totalShares);
      
    } else if (formula === 'dps-method2') {
      const parValue = parseFloat(document.getElementById('input-par-value').value);
      const dividendPercent = parseFloat(document.getElementById('input-dividend-percent').value);
      if (isNaN(parValue) || isNaN(dividendPercent)) {
        alert('Please enter valid values');
        return;
      }
      state.inputs = { parValue, dividendPercent };
      state.result = new Decimal(parValue).times(dividendPercent).div(100);
      
    } else if (formula === 'total-dividend') {
      const dividendPerShare = parseFloat(document.getElementById('input-dividend-per-share').value);
      const totalShares = parseFloat(document.getElementById('input-total-shares').value);
      if (isNaN(dividendPerShare) || isNaN(totalShares) || totalShares <= 0) {
        alert('Please enter valid values');
        return;
      }
      state.inputs = { dividendPerShare, totalShares };
      state.result = new Decimal(dividendPerShare).times(totalShares);
      
    } else if (formula === 'total-shares') {
      const totalDividend = parseFloat(document.getElementById('input-total-dividend').value);
      const dividendPerShare = parseFloat(document.getElementById('input-dividend-per-share').value);
      if (isNaN(totalDividend) || isNaN(dividendPerShare) || dividendPerShare <= 0) {
        alert('Please enter valid values');
        return;
      }
      state.inputs = { totalDividend, dividendPerShare };
      state.result = new Decimal(totalDividend).div(dividendPerShare);
      
    } else if (formula === 'stock-yield' && !state.isComparison) {
      const dividendPerShare = parseFloat(document.getElementById('input-dividend-per-share').value);
      const marketValue = parseFloat(document.getElementById('input-market-value').value);
      if (isNaN(dividendPerShare) || isNaN(marketValue) || marketValue <= 0) {
        alert('Please enter valid values');
        return;
      }
      state.inputs = { dividendPerShare, marketValue };
      state.result = new Decimal(dividendPerShare).div(marketValue);
      
    } else if (formula === 'stock-yield' && state.isComparison) {
      const dividendPerShareA = parseFloat(document.getElementById('input-dividend-per-share-a').value);
      const marketValueA = parseFloat(document.getElementById('input-market-value-a').value);
      const dividendPerShareB = parseFloat(document.getElementById('input-dividend-per-share-b').value);
      const marketValueB = parseFloat(document.getElementById('input-market-value-b').value);
      if (isNaN(dividendPerShareA) || isNaN(marketValueA) || isNaN(dividendPerShareB) || isNaN(marketValueB)) {
        alert('Please enter all required values');
        return;
      }
      if (marketValueA <= 0 || marketValueB <= 0) {
        alert('Market values must be positive');
        return;
      }
      state.inputs = { dividendPerShareA, marketValueA, dividendPerShareB, marketValueB };
      const stockYieldRatioA = new Decimal(dividendPerShareA).div(marketValueA);
      const stockYieldRatioB = new Decimal(dividendPerShareB).div(marketValueB);
      const comparison = stockYieldRatioA.greaterThan(stockYieldRatioB) ? 'A' : 'B';
      state.computed = { stockYieldRatioA, stockYieldRatioB, comparison };
      state.result = null;
    }
    
    displayGRESA();
    showBlock(3);
    
  } catch (error) {
    alert('Calculation error: ' + error.message);
  }
}

// ========== DISPLAY GRESA SOLUTION ==========
function displayGRESA() {
  const formula = state.selectedFormula;
  
  if (formula === 'dps-method1') displayGRESADPSMethod1();
  else if (formula === 'dps-method2') displayGRESADPSMethod2();
  else if (formula === 'total-dividend') displayGRESATotalDividend();
  else if (formula === 'total-shares') displayGRESATotalShares();
  else if (formula === 'stock-yield' && !state.isComparison) displayGRESAStockYieldSingle();
  else if (formula === 'stock-yield' && state.isComparison) displayGRESAStockYieldComparison();
  
  state.currentGRESAStep = 0;
  hideAllGRESASteps();
  document.getElementById('next-step-btn').style.display = 'inline-block';
  document.getElementById('restart-btn').style.display = 'none';
  
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise();
  }
}

function displayGRESADPSMethod1() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Total Dividend:</strong> ₱${formatCurrencyDisplay(inputs.totalDividend)}<br><strong>Total Number of Shares:</strong> ${formatDisplay(inputs.totalShares, { isInteger: true })} shares`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Dividend per Share</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Dividend per Share} = \\frac{\\text{Total Dividend}}{\\text{Total Number of Shares}}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Dividend per Share} = \\frac{${formatCurrencyDisplay(inputs.totalDividend)}}{${formatDisplay(inputs.totalShares, { isInteger: true })}}$$$$\\text{Dividend per Share} = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Dividend per Share = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Dividend per Share = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESADPSMethod2() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Par Value:</strong> ₱${formatCurrencyDisplay(inputs.parValue)}<br><strong>Dividend Percentage:</strong> ${formatDisplay(inputs.dividendPercent)}%`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Dividend per Share</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Dividend per Share} = \\text{Par Value} \\times \\frac{\\text{Dividend Percentage}}{100}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Dividend per Share} = ${formatCurrencyDisplay(inputs.parValue)} \\times \\frac{${formatDisplay(inputs.dividendPercent)}}{100}$$$$\\text{Dividend per Share} = ${formatCurrencyDisplay(inputs.parValue)} \\times ${formatDisplay(new Decimal(inputs.dividendPercent).div(100))}$$$$\\text{Dividend per Share} = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Dividend per Share = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Dividend per Share = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESATotalDividend() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Dividend per Share:</strong> ₱${formatCurrencyDisplay(inputs.dividendPerShare)}<br><strong>Total Number of Shares:</strong> ${formatDisplay(inputs.totalShares, { isInteger: true })} shares`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Total Dividend</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Total Dividend} = \\text{Dividend per Share} \\times \\text{Total Number of Shares}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Total Dividend} = ${formatCurrencyDisplay(inputs.dividendPerShare)} \\times ${formatDisplay(inputs.totalShares, { isInteger: true })}$$$$\\text{Total Dividend} = \\text{₱}${formatCurrencyDisplay(result)}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Total Dividend = ₱${formatCurrencyDisplay(result)}</strong>`;
  document.getElementById('final-answer').innerHTML = `Total Dividend = ₱${formatCurrencyDisplay(result)}`;
}

function displayGRESATotalShares() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Total Dividend:</strong> ₱${formatCurrencyDisplay(inputs.totalDividend)}<br><strong>Dividend per Share:</strong> ₱${formatCurrencyDisplay(inputs.dividendPerShare)}`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Total Number of Shares</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Total Number of Shares} = \\frac{\\text{Total Dividend}}{\\text{Dividend per Share}}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Total Number of Shares} = \\frac{${formatCurrencyDisplay(inputs.totalDividend)}}{${formatCurrencyDisplay(inputs.dividendPerShare)}}$$$$\\text{Total Number of Shares} = ${formatDisplay(result, { isInteger: true })} \\text{ shares}$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Total Number of Shares = ${formatDisplay(result, { isInteger: true })} shares</strong>`;
  document.getElementById('final-answer').innerHTML = `Total Number of Shares = ${formatDisplay(result, { isInteger: true })} shares`;
}

function displayGRESAStockYieldSingle() {
  const { inputs, result } = state;
  document.getElementById('gresa-given').innerHTML = `<strong>Dividend per Share:</strong> ₱${formatCurrencyDisplay(inputs.dividendPerShare)}<br><strong>Market Value:</strong> ₱${formatCurrencyDisplay(inputs.marketValue)}`;
  document.getElementById('gresa-required').innerHTML = 'Find <strong>Stock Yield Ratio</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Stock Yield Ratio} = \\frac{\\text{Dividend per Share}}{\\text{Market Value}}$$';
  document.getElementById('gresa-solution').innerHTML = `$$\\text{Stock Yield Ratio} = \\frac{${formatCurrencyDisplay(inputs.dividendPerShare)}}{${formatCurrencyDisplay(inputs.marketValue)}}$$$$\\text{Stock Yield Ratio} = ${formatDisplay(result)}$$$$\\text{Stock Yield Ratio} = ${formatPercentDisplay(result)}\\%$$`;
  document.getElementById('gresa-answer').innerHTML = `<strong>Stock Yield Ratio = ${formatPercentDisplay(result)}%</strong><br><small>(or ${formatDisplay(result)} in decimal form)</small>`;
  document.getElementById('final-answer').innerHTML = `Stock Yield Ratio = ${formatPercentDisplay(result)}%`;
}

function displayGRESAStockYieldComparison() {
  const { inputs, computed } = state;
  let givenHTML = '<strong>Corporation A:</strong><br>';
  givenHTML += `Dividend per Share: ₱${formatCurrencyDisplay(inputs.dividendPerShareA)}<br>`;
  givenHTML += `Market Value: ₱${formatCurrencyDisplay(inputs.marketValueA)}<br><br>`;
  givenHTML += '<strong>Corporation B:</strong><br>';
  givenHTML += `Dividend per Share: ₱${formatCurrencyDisplay(inputs.dividendPerShareB)}<br>`;
  givenHTML += `Market Value: ₱${formatCurrencyDisplay(inputs.marketValueB)}`;
  document.getElementById('gresa-given').innerHTML = givenHTML;
  
  document.getElementById('gresa-required').innerHTML = 'Find:<br><strong>1. Stock Yield Ratio for Corporation A</strong><br><strong>2. Stock Yield Ratio for Corporation B</strong><br><strong>3. Which corporation has a higher stock yield ratio?</strong>';
  document.getElementById('gresa-equation').innerHTML = '$$\\text{Stock Yield Ratio} = \\frac{\\text{Dividend per Share}}{\\text{Market Value}}$$';
  
  let solutionHTML = '<strong>For Corporation A:</strong><br>';
  solutionHTML += `$$\\text{Stock Yield Ratio}_A = \\frac{${formatCurrencyDisplay(inputs.dividendPerShareA)}}{${formatCurrencyDisplay(inputs.marketValueA)}}$$`;
  solutionHTML += `$$\\text{Stock Yield Ratio}_A = ${formatDisplay(computed.stockYieldRatioA)}$$`;
  solutionHTML += `$$\\text{Stock Yield Ratio}_A = ${formatPercentDisplay(computed.stockYieldRatioA)}\\%$$`;
  solutionHTML += '<br><strong>For Corporation B:</strong><br>';
  solutionHTML += `$$\\text{Stock Yield Ratio}_B = \\frac{${formatCurrencyDisplay(inputs.dividendPerShareB)}}{${formatCurrencyDisplay(inputs.marketValueB)}}$$`;
  solutionHTML += `$$\\text{Stock Yield Ratio}_B = ${formatDisplay(computed.stockYieldRatioB)}$$`;
  solutionHTML += `$$\\text{Stock Yield Ratio}_B = ${formatPercentDisplay(computed.stockYieldRatioB)}\\%$$`;
  document.getElementById('gresa-solution').innerHTML = solutionHTML;
  
  let answerHTML = `<strong>Corporation A Stock Yield Ratio:</strong> ${formatPercentDisplay(computed.stockYieldRatioA)}%<br>`;
  answerHTML += `<strong>Corporation B Stock Yield Ratio:</strong> ${formatPercentDisplay(computed.stockYieldRatioB)}%<br><br>`;
  answerHTML += `<div style="background: #d4edda; border: 2px solid #28a745; border-radius: 8px; padding: 15px; margin-top: 10px;">`;
  answerHTML += `<strong style="color: #155724;">✅ Conclusion:</strong><br>`;
  answerHTML += `<span style="color: #155724; font-size: 1.1em;">Corporation ${computed.comparison} has a higher stock yield ratio than Corporation ${computed.comparison === 'A' ? 'B' : 'A'}.</span>`;
  answerHTML += `</div>`;
  document.getElementById('gresa-answer').innerHTML = answerHTML;
  document.getElementById('final-answer').innerHTML = `Corporation ${computed.comparison} has the higher stock yield ratio`;
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
    selectedFormula: null,
    isComparison: false,
    inputs: {},
    computed: {},
    result: null,
    currentGRESAStep: 0,
    gresaSteps: ['given', 'required', 'equation', 'solution', 'answer']
  };
  showBlock(1);
}
