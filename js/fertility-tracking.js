/**
 * Binti International Health App
 * Fertility Tracking Functionality
 */

// Create fertility calendar and tracking
function createFertilityTracker(container) {
    const fertilityEl = document.createElement('div');
    fertilityEl.className = 'fertility-tracker-container';
    
    fertilityEl.innerHTML = `
        <div class="card fertility-card card-3d">
            <div class="card-header">
                <div class="card-title">🔍 Fertility Window</div>
                <div class="card-actions">
                    <button class="btn-icon tooltip" onclick="AnimationController.createButtonRipple(event)" aria-label="More info">
                        <i class="fas fa-info-circle"></i>
                        <span class="tooltiptext">About fertility tracking</span>
                    </button>
                    <button class="btn-icon tooltip" onclick="AnimationController.createButtonRipple(event)" aria-label="Settings">
                        <i class="fas fa-cog"></i>
                        <span class="tooltiptext">Tracking settings</span>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="fertility-status">
                    <div class="status-indicator high-fertility pulse-animation">
                        <span class="indicator-emoji">✨</span>
                    </div>
                    <div class="status-details">
                        <h3>High Fertility Today</h3>
                        <p>Your fertile window is open. This is an optimal time for conception.</p>
                    </div>
                </div>
                
                <div class="fertility-timeline">
                    <div class="timeline-header">
                        <h4>Your Cycle Phases</h4>
                    </div>
                    <div class="timeline-chart">
                        <div class="cycle-phases">
                            <div class="phase period" style="width: 15%">
                                <span class="phase-label">Period</span>
                            </div>
                            <div class="phase follicular" style="width: 25%">
                                <span class="phase-label">Follicular</span>
                            </div>
                            <div class="phase ovulation" style="width: 10%">
                                <span class="phase-label">Ovulation</span>
                                <span class="phase-marker">🥚</span>
                            </div>
                            <div class="phase luteal" style="width: 50%">
                                <span class="phase-label">Luteal</span>
                            </div>
                        </div>
                        <div class="current-day-marker" style="left: 42%">
                            <div class="day-marker">TODAY</div>
                        </div>
                    </div>
                </div>
                
                <div class="conception-tips">
                    <h4>🍀 Conception Optimization</h4>
                    <div class="tip-list">
                        <div class="tip-item">
                            <div class="tip-icon">🛌</div>
                            <div class="tip-content">
                                <h5>Best Time for Intimacy</h5>
                                <p>Today and tomorrow are your peak fertility days. Try morning or early evening.</p>
                            </div>
                        </div>
                        <div class="tip-item">
                            <div class="tip-icon">🧪</div>
                            <div class="tip-content">
                                <h5>LH Surge Detected</h5>
                                <p>Your hormone test indicates ovulation within 24-36 hours.</p>
                            </div>
                        </div>
                        <div class="tip-item">
                            <div class="tip-icon">🌡️</div>
                            <div class="tip-content">
                                <h5>BBT Rising</h5>
                                <p>Your basal body temperature is rising, confirming ovulation approach.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="fertility-actions">
                    <button class="btn btn-primary" onclick="AnimationController.createButtonRipple(event); showConceptionTipsModal()">
                        <i class="fas fa-star"></i> Fertility Boosting Tips
                    </button>
                    <button class="btn btn-outline" onclick="AnimationController.createButtonRipple(event); trackIntimacy()">
                        <i class="fas fa-calendar-check"></i> Log Intimacy
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(fertilityEl);
    
    // Add animations and interactivity
    setTimeout(() => {
        // Add event listeners for timeline interactions
        const phases = fertilityEl.querySelectorAll('.phase');
        
        phases.forEach(phase => {
            phase.addEventListener('click', () => {
                // Show phase details
                const phaseName = phase.classList[1];
                let phaseInfo = '';
                
                switch(phaseName) {
                    case 'period':
                        phaseInfo = 'Menstruation phase (Days 1-5)';
                        break;
                    case 'follicular':
                        phaseInfo = 'Follicular phase - egg development (Days 6-13)';
                        break;
                    case 'ovulation':
                        phaseInfo = 'Ovulation - highest fertility (Day 14)';
                        break;
                    case 'luteal':
                        phaseInfo = 'Luteal phase - post-ovulation (Days 15-28)';
                        break;
                }
                
                showToast(phaseInfo);
                AnimationController.createButtonRipple({ currentTarget: phase });
            });
        });
        
        // Add pulsing animation to current phase
        const currentPhase = fertilityEl.querySelector('.ovulation');
        if (currentPhase) {
            currentPhase.classList.add('pulse-soft');
        }
        
    }, 300);
}

// Create conception probability calculator
function createConceptionCalculator(container) {
    const calculatorEl = document.createElement('div');
    calculatorEl.className = 'conception-calculator-container';
    
    calculatorEl.innerHTML = `
        <div class="card calculator-card">
            <div class="card-header">
                <div class="card-title">🔮 Conception Probability</div>
            </div>
            <div class="card-content">
                <div class="probability-meter">
                    <div class="meter-fill" style="width: 73%"></div>
                    <div class="meter-label">73% Today</div>
                    <div class="meter-emoji">👶</div>
                </div>
                
                <div class="factors-list">
                    <h4>Factors Affecting Your Probability:</h4>
                    <ul>
                        <li>
                            <span class="factor-icon">🥚</span>
                            <span class="factor-text"><strong>Ovulation Day:</strong> Today is your ovulation day</span>
                            <span class="factor-impact positive">+40%</span>
                        </li>
                        <li>
                            <span class="factor-icon">📊</span>
                            <span class="factor-text"><strong>Age:</strong> Fertility peak (25-30)</span>
                            <span class="factor-impact positive">+15%</span>
                        </li>
                        <li>
                            <span class="factor-icon">🧪</span>
                            <span class="factor-text"><strong>Hormone Levels:</strong> Optimal LH surge detected</span>
                            <span class="factor-impact positive">+10%</span>
                        </li>
                        <li>
                            <span class="factor-icon">🛌</span>
                            <span class="factor-text"><strong>Intimacy Timing:</strong> Within last 24 hours</span>
                            <span class="factor-impact positive">+8%</span>
                        </li>
                    </ul>
                </div>
                
                <div class="optimization-section">
                    <h4>Improve Your Chances:</h4>
                    <div class="optimization-tips">
                        <div class="tip tooltip" onclick="AnimationController.showEmojiReaction(this, '👍')">
                            <i class="fas fa-glass-water"></i>
                            <span>Stay hydrated</span>
                            <span class="tooltiptext">Helps with cervical mucus</span>
                        </div>
                        <div class="tip tooltip" onclick="AnimationController.showEmojiReaction(this, '👍')">
                            <i class="fas fa-person-walking"></i>
                            <span>Light exercise</span>
                            <span class="tooltiptext">Improves blood flow</span>
                        </div>
                        <div class="tip tooltip" onclick="AnimationController.showEmojiReaction(this, '👍')">
                            <i class="fas fa-bed"></i>
                            <span>Rest after intimacy</span>
                            <span class="tooltiptext">Helps sperm reach egg</span>
                        </div>
                        <div class="tip tooltip" onclick="AnimationController.showEmojiReaction(this, '👍')">
                            <i class="fas fa-temperature-low"></i>
                            <span>Track BBT</span>
                            <span class="tooltiptext">Confirms ovulation</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(calculatorEl);
    
    // Animate probability meter
    setTimeout(() => {
        const meterFill = calculatorEl.querySelector('.meter-fill');
        if (meterFill) {
            const originalWidth = meterFill.style.width;
            meterFill.style.width = '0%';
            
            setTimeout(() => {
                meterFill.style.width = originalWidth;
            }, 500);
        }
    }, 300);
}

// Initialize fertility tracking features
function initFertilityTracking() {
    const fertilityScreen = document.getElementById('fertility-tracking');
    if (!fertilityScreen) return;
    
    // Create fertility tracker and calendar
    createFertilityTracker(fertilityScreen);
    
    // Create conception probability calculator
    createConceptionCalculator(fertilityScreen);
    
    // Apply animations to the entire screen
    AnimationController.applyScreenTransition(fertilityScreen);
}

// Export functions for use in other modules
window.createFertilityTracker = createFertilityTracker;
window.createConceptionCalculator = createConceptionCalculator;
window.initFertilityTracking = initFertilityTracking;
