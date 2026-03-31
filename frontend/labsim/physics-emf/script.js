const app = document.getElementById('app');

// Game State
const gameState = {
  currentScreen: 'welcome',
  score: 0,
  batteryEnergy: 0,
  circuitEnergy: 100,
  currentQuestion: 0,
  selectedAnswer: null,
  showExplanation: false,
  quizScore: 0,
  particles: []
};

// Screen Rendering Functions
function showScreen(screenName) {
  gameState.currentScreen = screenName;
  app.innerHTML = '';

  switch (screenName) {
    case 'welcome':
      renderWelcome();
      break;
    case 'battery':
      renderBattery();
      break;
    case 'circuit':
      renderCircuit();
      break;
    case 'quiz':
      renderQuiz();
      break;
    case 'summary':
      renderSummary();
      break;
  }
}

// Welcome Screen
function renderWelcome() {
  app.innerHTML = `
    <div class="screen welcome-screen">
      <div class="screen-content">
        <div class="welcome-icon">⚡</div>
        <h1 class="welcome-title">EMF Explorer</h1>
        <p class="welcome-subtitle">
          Master the concepts of <strong>Electromotive Force</strong> and <strong>Potential Difference</strong>
          by becoming a charge in a circuit.
        </p>

        <div class="welcome-grid">
          <div class="welcome-card">
            <div class="welcome-card-title">1. The Battery</div>
            <div class="welcome-card-desc">Gain energy (EMF)</div>
          </div>
          <div class="welcome-card">
            <div class="welcome-card-title">2. The Circuit</div>
            <div class="welcome-card-desc">Spend energy (p.d.)</div>
          </div>
        </div>

        <button class="btn btn-primary" onclick="showScreen('battery')">
          Start Journey →
        </button>
      </div>
    </div>
  `;
}

// Battery Level Screen
function renderBattery() {
  app.innerHTML = `
    <div class="screen">
      <div class="screen-content">
        <div class="stage-header">
          <h2 class="stage-title">🔋 Inside the Battery</h2>
          <div class="stage-badge">Stage 1: EMF</div>
        </div>

        <div class="two-column">
          <div class="left-panel">
            <div class="info-box">
              <h3 class="info-title">Gain Chemical Energy</h3>
              <p class="info-text">
                In a battery, chemical energy is converted into electrical potential energy.
                This "push" given to the charge is the <strong>Electromotive Force (EMF)</strong>.
              </p>

              <div class="formula-box">
                <div class="formula-label">Key Formula</div>
                <div class="formula-text">
                  EMF (ε) = <span style="color: #22c55e">Energy (W)</span> / <span style="color: #eab308">Charge (Q)</span>
                </div>
              </div>

              <div class="hint-box">
                <span class="hint-icon">ℹ️</span>
                <span>Tap the floating green orbs to collect chemical energy!</span>
              </div>
            </div>
          </div>

          <div class="right-panel">
            <div class="battery-visualization">
              <div class="battery-grid"></div>
              <div class="battery-label">ZINC-CARBON CELL</div>

              <div class="energy-meter">
                <div class="energy-bar">
                  <div class="energy-fill" id="energyFill" style="height: ${gameState.batteryEnergy}%"></div>
                </div>
                <div class="energy-voltage" id="voltageText">${(gameState.batteryEnergy / 100 * 12).toFixed(1)}V</div>
              </div>

              <div class="charge-character">
                <div class="charge-circle">
                  Q
                  <div class="charge-aura"></div>
                </div>
              </div>

              <div id="particlesContainer"></div>

              ${gameState.batteryEnergy >= 100 ? `
                <div class="success-overlay">
                  <div class="success-box">
                    <div class="success-icon">✓</div>
                    <h2 class="success-title">Fully Charged!</h2>
                    <p class="success-text">12 Volts of EMF acquired.</p>
                    <button class="btn btn-success" onclick="showScreen('circuit')">
                      Enter Circuit →
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Spawn particles
  spawnBatteryParticles();
}

function spawnBatteryParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container || gameState.batteryEnergy >= 100) return;

  const spawnInterval = setInterval(() => {
    if (gameState.batteryEnergy >= 100 || gameState.currentScreen !== 'battery') {
      clearInterval(spawnInterval);
      return;
    }

    if (gameState.particles.length < 5) {
      const id = Date.now();
      const x = Math.random() * 80 + 10;
      const y = 100;

      gameState.particles.push({ id, x, y });

      const particleEl = document.createElement('button');
      particleEl.className = 'particle';
      particleEl.id = `particle-${id}`;
      particleEl.innerHTML = '⚡';
      particleEl.style.left = x + '%';
      particleEl.style.bottom = y + '%';
      particleEl.onclick = () => collectParticle(id, particleEl);

      container.appendChild(particleEl);

      // Animate particle move up
      setTimeout(() => {
        const el = document.getElementById(`particle-${id}`);
        if (el) {
          el.style.transition = 'none';
          let bottomPos = 100;
          const moveInterval = setInterval(() => {
            bottomPos -= 2;
            el.style.bottom = bottomPos + '%';
            if (bottomPos <= 0) {
              clearInterval(moveInterval);
              if (el.parentNode) el.parentNode.removeChild(el);
              gameState.particles = gameState.particles.filter(p => p.id !== id);
            }
          }, 20);
        }
      }, 100);
    }
  }, APP_CONFIG.particleInterval);
}

function collectParticle(id, el) {
  el.remove();
  gameState.particles = gameState.particles.filter(p => p.id !== id);
  gameState.batteryEnergy = Math.min(gameState.batteryEnergy + APP_CONFIG.energyPerParticle, APP_CONFIG.targetEnergy);

  // Update UI
  const fill = document.getElementById('energyFill');
  if (fill) fill.style.height = gameState.batteryEnergy + '%';

  const voltage = document.getElementById('voltageText');
  if (voltage) voltage.textContent = (gameState.batteryEnergy / 100 * APP_CONFIG.maxVoltage).toFixed(1) + 'V';

  // Show success if fully charged
  if (gameState.batteryEnergy >= 100) {
    setTimeout(() => {
      const overlay = document.querySelector('.success-overlay');
      if (!overlay) {
        renderBattery();
      }
    }, 100);
  }
}

// Circuit Level Screen
function renderCircuit() {
  gameState.circuitEnergy = 100;

  app.innerHTML = `
    <div class="screen">
      <div class="screen-content">
        <div class="stage-header">
          <h2 class="stage-title">💡 The Load (Bulb)</h2>
          <div class="stage-badge">Stage 2: Potential Difference</div>
        </div>

        <div class="two-column">
          <div class="left-panel">
            <div class="info-box">
              <h3 class="info-title">Transfer Energy</h3>
              <p class="info-text">
                You are now passing through a component. You must do work to get through,
                converting your electrical energy into light and heat.
              </p>
              <p class="info-text">
                This loss of energy per unit charge is the <strong>Potential Difference (p.d.)</strong>.
              </p>

              <div class="formula-box" style="background: #fef3c7; border-color: #fcd34d;">
                <div class="formula-label" style="color: #ca8a04;">Key Formula</div>
                <div class="formula-text" style="color: #b45309;">
                  p.d. (V) = <span style="color: #22c55e">Energy Transferred (W)</span> / <span style="color: #eab308">Charge (Q)</span>
                </div>
              </div>

              <div class="hint-box">
                <span class="hint-icon">ℹ️</span>
                <span>Tap the button repeatedly to power the bulb!</span>
              </div>
            </div>

            <button class="btn btn-yellow btn-full transfer-btn" id="transferBtn" onclick="transferEnergy()">
              ${gameState.circuitEnergy > 0 ? '⚡ Transfer Energy to Bulb' : '⚪ Energy Depleted'}
            </button>
          </div>

          <div class="right-panel">
            <div class="circuit-visualization">
              <div class="bulb-glow" id="bulbGlow" style="opacity: ${(100 - gameState.circuitEnergy) / 100}"></div>

              <div class="bulb-container">💡</div>

              <div class="charge-moving" id="chargeMoving" style="left: ${(100 - gameState.circuitEnergy) * 2 - 100}px; filter: grayscale(${(100 - gameState.circuitEnergy)}%)">
                Q
              </div>

              <div class="voltage-display">
                <div class="voltage-label">POTENTIAL</div>
                <div class="voltage-value" id="circuitVoltage">${(gameState.circuitEnergy / 100 * 12).toFixed(1)}V</div>
              </div>

              ${gameState.circuitEnergy === 0 ? `
                <div class="success-overlay">
                  <div class="success-box">
                    <div class="success-icon">✓</div>
                    <h2 class="success-title">Work Done!</h2>
                    <p class="success-text">You have transferred all your energy.</p>
                    <button class="btn btn-purple" onclick="showScreen('quiz')">
                      Take Quiz →
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function transferEnergy() {
  if (gameState.circuitEnergy > 0) {
    gameState.circuitEnergy = Math.max(gameState.circuitEnergy - APP_CONFIG.energyTransferPerClick, 0);

    // Update UI
    const voltage = document.getElementById('circuitVoltage');
    if (voltage) voltage.textContent = (gameState.circuitEnergy / 100 * APP_CONFIG.maxVoltage).toFixed(1) + 'V';

    const glow = document.getElementById('bulbGlow');
    if (glow) glow.style.opacity = (100 - gameState.circuitEnergy) / 100;

    const charge = document.getElementById('chargeMoving');
    if (charge) {
      charge.style.left = (100 - gameState.circuitEnergy) * 2 - 100 + 'px';
      charge.style.filter = `grayscale(${(100 - gameState.circuitEnergy)}%)`;
    }

    const btn = document.getElementById('transferBtn');
    if (btn) {
      btn.textContent = gameState.circuitEnergy > 0 ? '⚡ Transfer Energy to Bulb' : '⚪ Energy Depleted';
      btn.disabled = gameState.circuitEnergy <= 0;
    }

    // Show success if depleted
    if (gameState.circuitEnergy === 0) {
      setTimeout(() => {
        const overlay = document.querySelector('.success-overlay');
        if (!overlay) {
          renderCircuit();
        }
      }, 100);
    }
  }
}

// Quiz Level Screen
function renderQuiz() {
  const question = QUIZ_QUESTIONS[gameState.currentQuestion];
  const progress = ((gameState.currentQuestion) / QUIZ_QUESTIONS.length) * 100;

  app.innerHTML = `
    <div class="screen">
      <div class="screen-content">
        <div class="stage-header">
          <h2 class="stage-title">📖 Knowledge Check</h2>
          <div class="stage-badge">${gameState.currentQuestion + 1} / ${QUIZ_QUESTIONS.length}</div>
        </div>

        <div class="quiz-container">
          <div class="quiz-progress" style="width: ${progress}%"></div>

          <h3 class="quiz-question">${question.question}</h3>

          <div class="quiz-options">
            ${question.options.map((option, idx) => {
              let className = 'quiz-option';
              if (gameState.showExplanation) {
                if (idx === question.correctAnswer) {
                  className += ' correct';
                } else if (idx === gameState.selectedAnswer) {
                  className += ' incorrect';
                } else {
                  className += ' neutral disabled';
                }
              }

              return `
                <button class="${className}" onclick="selectAnswer(${idx})" ${gameState.showExplanation ? 'disabled' : ''}>
                  <span>${option}</span>
                  ${gameState.showExplanation && idx === question.correctAnswer ? '<span class="quiz-icon">✓</span>' : ''}
                  ${gameState.showExplanation && idx === gameState.selectedAnswer && idx !== question.correctAnswer ? '<span class="quiz-icon">✗</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          ${gameState.showExplanation ? `
            <div class="quiz-explanation ${gameState.selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'}">
              <div class="explanation-label">
                ${gameState.selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Not quite.'}
              </div>
              <div class="explanation-text">${question.explanation}</div>
            </div>

            <div class="quiz-nav">
              <div></div>
              <button class="btn btn-purple" onclick="nextQuestion()">
                ${gameState.currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'} →
              </button>
            </div>
          ` : ''}

          ${!gameState.showExplanation ? `
            <div class="quiz-nav">
              <div class="quiz-progress-text">Select an answer...</div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function selectAnswer(idx) {
  if (gameState.showExplanation) return;

  gameState.selectedAnswer = idx;
  gameState.showExplanation = true;

  if (idx === QUIZ_QUESTIONS[gameState.currentQuestion].correctAnswer) {
    gameState.quizScore++;
  }

  renderQuiz();
}

function nextQuestion() {
  if (gameState.currentQuestion < QUIZ_QUESTIONS.length - 1) {
    gameState.currentQuestion++;
    gameState.selectedAnswer = null;
    gameState.showExplanation = false;
    renderQuiz();
  } else {
    showScreen('summary');
  }
}

// Summary Screen
function renderSummary() {
  const percentage = Math.round((gameState.quizScore / QUIZ_QUESTIONS.length) * 100);

  app.innerHTML = `
    <div class="screen">
      <div class="summary-container">
        <div class="trophy-icon">
          🏆
          <div class="score-badge">${percentage}%</div>
        </div>

        <h1 class="summary-title">Mission Complete!</h1>
        <p class="summary-subtitle">
          You scored <strong>${gameState.quizScore}</strong> out of <strong>${QUIZ_QUESTIONS.length}</strong> on the quiz.
        </p>

        <div class="recap-box">
          <h3 class="recap-title">Quick Recap</h3>
          <div class="recap-items">
            <div class="recap-item">
              <span class="recap-checkmark">✓</span>
              <span>EMF is energy supplied TO the charge (in the battery).</span>
            </div>
            <div class="recap-item">
              <span class="recap-checkmark">✓</span>
              <span>P.D. is energy transferred FROM the charge (in components).</span>
            </div>
            <div class="recap-item">
              <span class="recap-checkmark">✓</span>
              <span>Both are measured in Volts (Joules per Coulomb).</span>
            </div>
          </div>
        </div>

        <button class="btn btn-secondary" onclick="resetGame()">
          🔄 Play Again
        </button>
      </div>
    </div>
  `;
}

function resetGame() {
  gameState.batteryEnergy = 0;
  gameState.circuitEnergy = 100;
  gameState.currentQuestion = 0;
  gameState.selectedAnswer = null;
  gameState.showExplanation = false;
  gameState.quizScore = 0;
  gameState.particles = [];
  showScreen('welcome');
}

// Initialize
showScreen('welcome');
