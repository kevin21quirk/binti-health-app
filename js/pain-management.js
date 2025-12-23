/**
 * Binti International Health App
 * Pain Management Functionality - Professional UI Implementation
 * 
 * Features:
 * - Interactive pain tracking chart with animations
 * - Smart pain trigger analysis with visual indicators
 * - Interactive body pain map with hotspots
 * - Personalized remedy recommendations
 * - Pain journal with sentiment analysis
 */

// Create pain chart visualization with professional UI and animations
function createPainChart(container) {
    const chartEl = document.createElement('div');
    chartEl.className = 'pain-chart-container';
    
    chartEl.innerHTML = `
        <div class="card pain-tracking-card">
            <div class="card-header">
                <div class="card-title">📊 Pain Tracking</div>
                <div class="card-actions">
                    <button class="btn-icon tooltip" onclick="showPainEntryModal()" aria-label="Add new pain entry">
                        <i class="fas fa-plus"></i>
                        <span class="tooltiptext">Add new pain entry</span>
                    </button>
                    <button class="btn-icon tooltip" onclick="showToast('Chart view toggled!')" aria-label="Toggle chart view">
                        <i class="fas fa-eye"></i>
                        <span class="tooltiptext">Change chart view</span>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <!-- AI insights will appear once you have enough pain data -->
                <div class="ai-insight" id="pain-ai-insight" style="display: none;">
                    <h4>AI Pattern Detection ✨</h4>
                    <p id="pain-insight-text"></p>
                </div>
                
                <div class="chart-filters">
                    <button class="filter-btn active" data-period="week">
                        <i class="fas fa-calendar-week"></i> Week
                    </button>
                    <button class="filter-btn" data-period="month">
                        <i class="fas fa-calendar-alt"></i> Month
                    </button>
                    <button class="filter-btn" data-period="3months">
                        <i class="fas fa-calendar-check"></i> 3 Months
                    </button>
                    <button class="filter-btn" data-period="custom" onclick="AnimationController.applyShakeAnimation(this)">
                        <i class="fas fa-sliders-h"></i> Custom
                    </button>
                </div>
                
                <div class="chart-legend">
                    <div class="legend-item">
                        <span class="emoji-indicator mild">🙂</span> Mild
                    </div>
                    <div class="legend-item">
                        <span class="emoji-indicator moderate">😕</span> Moderate
                    </div>
                    <div class="legend-item">
                        <span class="emoji-indicator severe">😭</span> Severe
                    </div>
                </div>
                
                <div class="pain-visualization">
                    <div class="chart-container" id="pain-chart-data">
                        <!-- Pain data will load here from API -->
                        <div class="empty-state">
                            <i class="fas fa-chart-line" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                            <p>No pain data yet</p>
                            <p style="font-size: 0.9rem; color: #888;">Track your pain levels to see patterns and insights</p>
                            <button class="btn btn-primary" onclick="window.showPainEntryModal ? window.showPainEntryModal() : showToast('Please use the + button to add pain entry')">
                                <i class="fas fa-plus"></i> Log Pain
                            </button>
                        </div>
                        <!-- Week view will be populated by API data -->
                        <div class="week-view enhanced-pain-chart" id="pain-week-view" style="display: none;">
                            <!-- Pain chart days will be dynamically generated from API data -->
                        </div>
                        
                        <!-- Chart controls and legend hidden until data exists -->
                        <div class="chart-controls" id="pain-chart-controls" style="display: none;">
                            <button class="btn-icon-small tooltip">
                                <i class="fas fa-expand-arrows-alt"></i>
                                <span class="tooltiptext">View fullscreen</span>
                            </button>
                            <button class="btn-icon-small tooltip">
                                <i class="fas fa-download"></i>
                                <span class="tooltiptext">Export data</span>
                            </button>
                        </div>
                        
                        <div class="pain-scale-legend" id="pain-scale-legend" style="display: none;">
                            <div class="scale-label severe">Severe</div>
                            <div class="scale-label moderate">Moderate</div>
                            <div class="scale-label mild">Mild</div>
                            <div class="scale-label none">None</div>
                        </div>
                    </div>
                </div>
                
                <!-- Today's pain status hidden until user logs pain -->
                <div class="pain-stats-container binti-card-enhanced" id="today-pain-status" style="display: none;">
                    <div class="pain-status-header binti-gradient-bg">
                        <div class="status-icon-wrapper">
                            <div class="status-icon-outer">
                                <div class="status-icon-inner">
                                    <i class="fas fa-heartbeat pulse"></i>
                                </div>
                            </div>
                        </div>
                        <div class="status-details">
                            <div class="status-label"><i class="fas fa-chart-line"></i> Today's Pain Level</div>
                            <div class="status-value" id="today-pain-value"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(chartEl);
    
    // Initialize animation for pain levels with staggered effect
    setTimeout(() => {
        const painLevels = chartEl.querySelectorAll('.pain-level');
        painLevels.forEach((level, index) => {
            setTimeout(() => {
                level.classList.add('animate-in');
            }, index * 100);
        });
        
        // Add pain level tooltips interaction
        painLevels.forEach(level => {
            level.addEventListener('mouseenter', () => {
                level.classList.add('active');
            });
            level.addEventListener('mouseleave', () => {
                level.classList.remove('active');
            });
        });
    
        // Add event listeners for period filters with enhanced animation
        const filterButtons = chartEl.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button with ripple effect
                btn.classList.add('active');
                AnimationController.createButtonRipple({ currentTarget: btn });
                
                // In a real app, this would update the chart data
                const period = btn.dataset.period;
                
                // Animate the pain levels changing
                painLevels.forEach((level, index) => {
                    // Simulate new data with random heights
                    const newHeight = Math.floor(Math.random() * 80) + '%';
                    
                    // Animate height change
                    setTimeout(() => {
                        level.style.height = '0%';
                        
                        setTimeout(() => {
                            level.style.height = newHeight;
                        }, 300);
                    }, index * 50);
                });
                
                // Show toast with animation
                showToast(`Showing pain data for ${period === 'week' ? 'this week' : period === 'month' ? 'this month' : 'last 3 months'}`);
            });
        });
        
        // Add animation for the forecast bar
        const forecastBar = chartEl.querySelector('.metric-fill');
        forecastBar.style.width = '0%';
        setTimeout(() => {
            forecastBar.style.width = '35%';
        }, 800);
    }, 300);
}

// Create pain triggers analysis with visual indicators and interactive elements
function createPainTriggers(container) {
    const triggersEl = document.createElement('div');
    triggersEl.className = 'pain-triggers-container';
    
    triggersEl.innerHTML = `
        <div class="remedy-recommendations card card-3d">
            <div class="card-header">
                <div class="card-title">💊 Remedy Recommendations</div>
                <div class="card-actions">
                    <button class="btn-icon tooltip" onclick="AnimationController.createButtonRipple(event)" aria-label="Filter recommendations">
                        <i class="fas fa-filter"></i>
                        <span class="tooltiptext">Filter remedies</span>
                    </button>
                    <button class="btn-icon tooltip" onclick="AnimationController.showEmojiReaction(this.parentNode, '💾')" aria-label="Save recommendations">
                        <i class="fas fa-bookmark"></i>
                        <span class="tooltiptext">Save favorites</span>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <!-- Trigger analysis will appear once you have enough pain data -->
                <div class="empty-state">
                    <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>No trigger patterns detected yet</p>
                    <p style="font-size: 0.9rem; color: #888;">Log pain entries regularly to identify triggers</p>
                </div>
            
                <!-- Trigger list will be populated from API data -->
                <div class="triggers-list" id="pain-triggers-list" style="display: none;">
                                </div>
                            </div>
                        </div>
                        <div class="trigger-action">
                            <button class="btn-icon-small" aria-label="View details">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Trigger stats will be populated from API -->
                <div class="trigger-stats" id="trigger-stats" style="display: none;"></div>
            </div>
        </div>
        
        <!-- Body pain map hidden until implemented -->
        <div class="pain-body-map card card-3d" style="display: none;">
            <div class="card-header">
                <div class="card-title">🖲 Your Pain Map</div>
            </div>
            <div class="card-content">
                <div class="empty-state">
                    <i class="fas fa-user" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>Body pain map coming soon</p>
                </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(triggersEl);
}

// Create remedy recommendations with professional UI and interactive elements
function createRemedyRecommendations(container) {
    const remediesEl = document.createElement('div');
    remediesEl.className = 'remedies-container';
    
    remediesEl.innerHTML = `
        <div class="card remedy-card">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-hand-holding-medical"></i> Personalized Remedies</div>
                <div class="card-actions">
                    <button class="btn-icon btn-refresh" aria-label="Refresh recommendations" title="Refresh recommendations">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <!-- Remedy recommendations will appear based on your pain data -->
                <div class="empty-state">
                    <i class="fas fa-hand-holding-medical" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>No remedy recommendations yet</p>
                    <p style="font-size: 0.9rem; color: #888;">Track your pain and remedies to get personalized suggestions</p>
                </div>
                
                <!-- Remedy list will be populated from API -->
                <div class="remedies-list" id="remedy-recommendations-list" style="display: none;">
                    <!-- Remedy recommendations will be populated from API -->
                </div>
            </div>
        </div>
        </div>
    `;
    
    container.appendChild(remediesEl);
    
    // Add animations and interactivity to remedy items
    setTimeout(() => {
        // Add event listeners for remedy filters
        const filterButtons = remediesEl.querySelectorAll('.filter-pill');
        const remedyItems = remediesEl.querySelectorAll('.remedy-item');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button with ripple effect
                btn.classList.add('active');
                AnimationController.createButtonRipple({ currentTarget: btn });
                
                // Filter remedy items
                const filter = btn.dataset.filter;
                remedyItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'flex';
                        // Add re-entry animation
                        item.classList.remove('slide-in-left');
                        void item.offsetWidth; // Force reflow
                        item.classList.add('slide-in-left');
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Show toast
                showToast(`Showing ${filter === 'all' ? 'all remedies' : `${filter} remedies`}`);
            });
        });
        
        // Add bookmark functionality
        const bookmarkButtons = remediesEl.querySelectorAll('.btn-bookmark');
        bookmarkButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const icon = btn.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    showToast('Remedy saved to your bookmarks');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    showToast('Remedy removed from bookmarks');
                }
                AnimationController.createButtonRipple({ currentTarget: btn });
            });
        });
        
        // Add share functionality
        const shareButtons = remediesEl.querySelectorAll('.btn-share');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('Sharing option coming soon!');
                AnimationController.createButtonRipple({ currentTarget: btn });
            });
        });
        
        // Animate effectiveness bars
        const effectivenessBars = remediesEl.querySelectorAll('.effectiveness-fill');
        effectivenessBars.forEach(bar => {
            const originalWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = originalWidth;
            }, 500);
        });
    }, 300);
}

// Create pain journal with sentiment analysis and advanced tracking
function createPainJournal(container) {
    const journalEl = document.createElement('div');
    journalEl.className = 'pain-journal-container';
    
    journalEl.innerHTML = `
        <div class="card journal-card card-3d">
            <div class="card-header">
                <div class="card-title">📝 Pain Journal</div>
                <div class="card-actions">
                    <button class="btn-icon tooltip" onclick="AnimationController.createButtonRipple(event); showAddJournalEntryModal();" aria-label="Add journal entry">
                        <i class="fas fa-plus"></i>
                        <span class="tooltiptext">Add journal entry</span>
                    </button>
                    <button class="btn-icon tooltip" onclick="AnimationController.createButtonRipple(event)" aria-label="Filter entries">
                        <i class="fas fa-filter"></i>
                        <span class="tooltiptext">Filter entries</span>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <!-- Journal entries will load from API -->
                <div class="empty-state">
                    <i class="fas fa-book-open" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>No journal entries yet</p>
                    <p style="font-size: 0.9rem; color: #888;">Start tracking your pain to see patterns and insights</p>
                    <button class="btn btn-primary" onclick="window.showPainEntryModal ? window.showPainEntryModal() : showToast('Use the + button to add an entry')">
                        <i class="fas fa-plus"></i> Add Entry
                    </button>
                </div>
                
                <div class="journal-entries" id="pain-journal-entries" style="display: none;">
                    <!-- Journal entries will be populated from API -->
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(journalEl);
    
    // Add animations and interactivity
    setTimeout(() => {
        // Animate the pain and mood lines
        const painLine = journalEl.querySelector('.pain-line');
        const moodLine = journalEl.querySelector('.mood-line');
        
        if (painLine) painLine.classList.add('animate');
        if (moodLine) moodLine.classList.add('animate');
        
        // Add entry action handlers
        const editButtons = journalEl.querySelectorAll('.entry-actions .btn-icon-small:first-child');
        editButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('Entry edit feature coming soon!');
                AnimationController.createButtonRipple({ currentTarget: btn });
            });
        });
        
        const detailButtons = journalEl.querySelectorAll('.entry-actions .btn-icon-small:last-child');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('Detailed view coming soon!');
                AnimationController.createButtonRipple({ currentTarget: btn });
            });
        });
        
        // Animation for journal entries on hover
        const journalEntries = journalEl.querySelectorAll('.journal-entry');
        journalEntries.forEach(entry => {
            entry.addEventListener('mouseenter', () => {
                entry.classList.add('expanded');
            });
            entry.addEventListener('mouseleave', () => {
                entry.classList.remove('expanded');
            });
        });
        
        // View all entries button
        const viewAllBtn = journalEl.querySelector('.journal-actions .btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                showToast('Full journal history coming soon!');
                AnimationController.createButtonRipple({ currentTarget: viewAllBtn });
            });
        }
    }, 300);
}

// Export functions for use in other modules
window.createPainChart = createPainChart;
window.createPainTriggers = createPainTriggers;
window.createRemedyRecommendations = createRemedyRecommendations;
window.createPainJournal = createPainJournal;

// Initialize pain management screen
function initPainManagement() {
    const painScreen = document.getElementById('pain-management');
    if (!painScreen) return;
    
    // Create pain tracking chart
    createPainChart(painScreen);
    
    // Create pain triggers analysis
    createPainTriggers(painScreen);
    
    // Create body map visualization
    // createBodyMap(painScreen); - This is now part of createPainTriggers
    
    // Create remedy recommendations
    createRemedyRecommendations(painScreen);
    
    // Create pain journal
    createPainJournal(painScreen);
    
    // Apply animations to the entire screen
    AnimationController.applyScreenTransition(painScreen);
}

// Add to window object
window.initPainManagement = initPainManagement;
