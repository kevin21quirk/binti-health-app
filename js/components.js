/**
 * Binti International Health App
 * UI Components for screen content
 */

// ---- Dashboard Screen Components ----

function createCycleOverview(container) {
    const cycleEl = document.createElement('div');
    cycleEl.className = 'card insight-card cycle-overview-card';
    
    // Check if user profile exists
    if (!appState.userProfile || !appState.userProfile.cycleData) {
        cycleEl.innerHTML = `
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-calendar-alt"></i>
                    Cycle Overview
                </div>
            </div>
            <div class="card-content">
                <div class="empty-state">
                    <i class="fas fa-calendar-plus" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>Log your first period to see cycle predictions</p>
                    <button class="btn btn-primary" onclick="app.navigateToScreen('period-tracking')">
                        <i class="fas fa-plus"></i> Add Period
                    </button>
                </div>
            </div>
        `;
        container.appendChild(cycleEl);
        return;
    }
    
    // Calculate days until next period based on app state
    const today = new Date();
    const nextPeriodEstimate = appState.userProfile.cycleData.nextPeriodEstimate;
    
    // Check if we have valid period data
    if (!nextPeriodEstimate || nextPeriodEstimate === 'Invalid Date' || isNaN(new Date(nextPeriodEstimate).getTime())) {
        // No valid period data - show empty state
        cycleEl.innerHTML = `
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-calendar-alt"></i>
                    Cycle Overview
                </div>
            </div>
            <div class="card-content">
                <div class="empty-state">
                    <i class="fas fa-calendar-plus" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>Log your first period to see cycle predictions</p>
                    <button class="btn btn-primary" onclick="app.navigateToScreen('period-tracking')">
                        <i class="fas fa-plus"></i> Add Period
                    </button>
                </div>
            </div>
        `;
        container.appendChild(cycleEl);
        return;
    }
    
    const nextPeriod = new Date(nextPeriodEstimate);
    const daysUntil = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
    
    cycleEl.innerHTML = `
        <div class="card-header">
            <div class="card-title">
                <i class="fas fa-calendar-alt pulse-subtle"></i>
                Cycle Overview
            </div>
            <div class="card-actions">
                <button class="btn-icon btn-text tooltip" onclick="app.navigateToScreen('period-tracking')">
                    <i class="fas fa-arrow-right"></i>
                    <span class="tooltiptext">View full calendar</span>
                </button>
            </div>
        </div>
        <div class="card-content">
            <div class="cycle-status">
                <div class="cycle-circle branded-gradient">
                    <div class="cycle-days">${daysUntil}</div>
                    <div class="cycle-label">days until<br>next period</div>
                </div>
                <div class="cycle-phase">
                    <h3><i class="fas fa-moon highlight-icon"></i> Luteal Phase</h3>
                    <p>Your body is preparing for your next period</p>
                </div>
            </div>
            <div class="cycle-progress">
                <div class="cycle-bar">
                    <div class="cycle-fill branded-gradient" style="width: 75%"></div>
                </div>
                <div class="cycle-markers">
                    <span>Day 1</span>
                    <span>Ovulation</span>
                    <span class="current-marker">Now</span>
                    <span>Day 28</span>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(cycleEl);
}

async function createDailyInsights(container) {
    const insightsEl = document.createElement('div');
    insightsEl.className = 'card insights-card';
    
    insightsEl.innerHTML = `
        <div class="card-header">
            <div class="card-title">
                <i class="fas fa-chart-bar pulse-subtle"></i>
                Today's Insights
            </div>
            <div class="card-actions">
                <button class="btn-icon btn-text tooltip" onclick="app.navigateToScreen('health-insights')">
                    <i class="fas fa-arrow-right"></i>
                    <span class="tooltiptext">View all insights</span>
                </button>
            </div>
        </div>
        <div class="card-content">
            <div class="empty-state">
                <i class="fas fa-lightbulb" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <p>No insights yet</p>
                <p style="font-size: 14px; color: #666;">Track your health to see personalized insights</p>
            </div>
        </div>
    `;
    
    container.appendChild(insightsEl);
    
    // Load real insights from API if authenticated
    if (window.apiService && window.authManager && window.authManager.isAuthenticated()) {
        try {
            const response = await apiService.getHealthInsights(4, false);
            if (response.insights && response.insights.length > 0) {
                // Update with real insights
                const contentDiv = insightsEl.querySelector('.card-content');
                contentDiv.innerHTML = `
                    <div class="insights-list">
                        ${response.insights.slice(0, 3).map(insight => `
                            <div class="insight-item" onclick="app.navigateToScreen('health-insights')">
                                <i class="fas fa-lightbulb"></i>
                                <div>
                                    <strong>${insight.title}</strong>
                                    <p style="font-size: 14px; color: #666;">${insight.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        } catch (error) {
            console.error('Failed to load insights:', error);
        }
    }
}

function createQuickActions(container) {
    const actionsEl = document.createElement('div');
    actionsEl.className = 'quick-actions card';
    
    actionsEl.innerHTML = `
        <div class="card-header">
            <div class="card-title">
                <i class="fas fa-bolt pulse-subtle"></i>
                Quick Actions
            </div>
        </div>
        <div class="card-content">
            <div class="action-buttons">
                <button class="action-button" onclick="app.navigateToScreen('period-tracking')">
                    <div class="action-icon binti-gradient-bg"><i class="fas fa-calendar-alt"></i></div>
                    <span>Track Period</span>
                </button>
                <button class="action-button" onclick="app.navigateToScreen('pain-management')">
                    <div class="action-icon binti-secondary-gradient"><i class="fas fa-heartbeat"></i></div>
                    <span>Log Pain</span>
                </button>
                <button class="action-button" onclick="app.navigateToScreen('device-connection')">
                    <div class="action-icon binti-gradient-bg"><i class="fas fa-bluetooth-b"></i></div>
                    <span>Connect Device</span>
                </button>
                <button class="action-button" onclick="app.navigateToScreen('community')">
                    <div class="action-icon binti-secondary-gradient"><i class="fas fa-users"></i></div>
                    <span>Community</span>
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(actionsEl);
}

function createUpcomingEvents(container) {
    const eventsEl = document.createElement('div');
    eventsEl.className = 'card upcoming-events-card';
    
    // Check if user has cycle data
    if (!appState.userProfile || !appState.userProfile.cycleData || !appState.userProfile.cycleData.nextPeriodEstimate) {
        eventsEl.innerHTML = `
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-clock"></i>
                    Upcoming
                </div>
            </div>
            <div class="card-content">
                <div class="empty-state">
                    <i class="fas fa-calendar-times" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>No upcoming events yet</p>
                    <p style="font-size: 14px; color: #666;">Track your period to see predictions</p>
                </div>
            </div>
        `;
        container.appendChild(eventsEl);
        return;
    }
    
    const today = new Date();
    const nextPeriod = new Date(appState.userProfile.cycleData.nextPeriodEstimate);
    const daysUntil = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    eventsEl.innerHTML = `
        <div class="card-header">
            <div class="card-title">
                <i class="fas fa-clock pulse-subtle"></i>
                Upcoming
            </div>
        </div>
        <div class="card-content">
            <div class="event-list">
                <div class="event-item">
                    <div class="event-icon binti-gradient-bg"><i class="fas fa-calendar-day"></i></div>
                    <div class="event-details">
                        <div class="event-title">Period expected to start</div>
                        <div class="event-time"><i class="fas fa-hourglass-half"></i> ${daysUntil > 0 ? `In ${daysUntil} days` : 'Today'} - ${monthNames[nextPeriod.getMonth()]} ${nextPeriod.getDate()}, ${nextPeriod.getFullYear()}</div>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(eventsEl);
}

// ---- Period Tracking Screen Components ----

function createPeriodCalendar(container) {
    console.log('🗓️ createPeriodCalendar called');
    const calendarEl = document.createElement('div');
    calendarEl.className = 'calendar-container';
    
    // Get current date information
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Month names for display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    calendarEl.innerHTML = `
        <div class="calendar-header">
            <div class="calendar-title">
                <i class="fas fa-calendar-alt pulse-subtle"></i>
                ${monthNames[currentMonth]} ${currentYear}
            </div>
            <div class="calendar-actions">
                <button class="btn-icon btn-text" id="prev-month">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="btn-icon btn-text" id="next-month">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
        <div class="calendar-weekdays">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
        </div>
        <div class="calendar-days" id="calendar-days">
            ${generateCalendarDays(currentMonth, currentYear)}
        </div>
        <div class="calendar-legend">
            <div class="legend-title">Calendar Legend</div>
            <div class="legend-items">
                <div class="legend-item">
                    <div class="legend-color period-day"></div>
                    <div class="legend-label">Period Days</div>
                </div>
                <div class="legend-item">
                    <div class="legend-color fertile-day"></div>
                    <div class="legend-label">Fertile Window</div>
                </div>
                <div class="legend-item">
                    <div class="legend-color ovulation-day"></div>
                    <div class="legend-label">Ovulation Day</div>
                </div>
                <div class="legend-item">
                    <div class="legend-color today"></div>
                    <div class="legend-label">Today</div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(calendarEl);
    
    // Initialize calendar month/year tracking
    currentCalendarMonth = currentMonth;
    currentCalendarYear = currentYear;
    console.log('✓ Calendar HTML added to container');
    
    // Add event listeners after the calendar is added to the DOM
    setTimeout(() => {
        console.log('⏱️ Attaching calendar event listeners...');
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('◀️ Previous month clicked');
                navigateCalendar(-1);
            });
            console.log('✓ Previous month button listener attached');
        } else {
            console.error('❌ Previous month button not found');
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('▶️ Next month clicked');
                navigateCalendar(1);
            });
            console.log('✓ Next month button listener attached');
        } else {
            console.error('❌ Next month button not found');
        }
        
        // Add click handlers for days - clicking a day opens period entry modal
        const dayElements = document.querySelectorAll('.calendar-day');
        console.log(`Found ${dayElements.length} calendar days`);
        dayElements.forEach(day => {
            day.addEventListener('click', (e) => {
                if (!day.classList.contains('inactive')) {
                    console.log('📅 Calendar day clicked');
                    // Get the date from the clicked day
                    const dateStr = day.getAttribute('data-date');
                    console.log('Date:', dateStr);
                    if (dateStr && window.showPeriodEntryModal) {
                        console.log('Opening period modal for date:', dateStr);
                        // Open period entry modal with this date pre-selected
                        window.showPeriodEntryModal(dateStr);
                    } else {
                        console.error('Cannot open modal:', {
                            dateStr,
                            modalFunction: typeof window.showPeriodEntryModal
                        });
                    }
                }
            });
        });
        console.log('✓ All calendar event listeners attached');
    }, 0);
}

function generateCalendarDays(month, year) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startOffset = firstDay.getDay();
    
    // Generate previous month's trailing days
    let calendarHTML = '';
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    
    for (let i = 0; i < startOffset; i++) {
        const dayNum = prevMonthLastDay - startOffset + i + 1;
        calendarHTML += `<div class="calendar-day inactive">${dayNum}</div>`;
    }
    
    // Real cycle data will be loaded from API
    const periodDays = [];
    const ovulationDay = null;
    const fertileWindowDays = [];
    const today = new Date();
    
    // Generate current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        let classes = 'calendar-day';
        
        // Check if this is today
        if (today.getDate() === i && today.getMonth() === month && today.getFullYear() === year) {
            classes += ' today';
        }
        
        // Check if this is a period day (from API data)
        if (periodDays.includes(i)) {
            classes += ' period-day';
        }
        
        // Check if this is ovulation day (from API data)
        if (i === ovulationDay) {
            classes += ' ovulation-day';
        }
        
        // Check if this is fertile window day (from API data)
        if (fertileWindowDays.includes(i)) {
            classes += ' fertile-day';
        }
        
        calendarHTML += `<div class="${classes}" data-date="${year}-${month+1}-${i}">${i}</div>`;
    }
    
    // Generate next month's leading days
    const gridSize = 42; // 7 days x 6 rows
    const daysShown = startOffset + daysInMonth;
    const nextDays = gridSize - daysShown;
    
    for (let i = 1; i <= nextDays; i++) {
        calendarHTML += `<div class="calendar-day inactive">${i}</div>`;
    }
    
    return calendarHTML;
}

let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

function navigateCalendar(direction) {
    // Update month
    currentCalendarMonth += direction;
    
    // Handle year boundaries
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    } else if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    
    // Update calendar display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Update title
    const calendarTitle = document.querySelector('.calendar-title');
    if (calendarTitle) {
        calendarTitle.innerHTML = `
            <i class="fas fa-calendar-alt pulse-subtle"></i>
            ${monthNames[currentCalendarMonth]} ${currentCalendarYear}
        `;
    }
    
    // Regenerate calendar days
    const calendarDays = document.getElementById('calendar-days');
    if (calendarDays) {
        calendarDays.innerHTML = generateCalendarDays(currentCalendarMonth, currentCalendarYear);
        
        // Re-attach click handlers to new days
        const dayElements = calendarDays.querySelectorAll('.calendar-day');
        dayElements.forEach(day => {
            day.addEventListener('click', (e) => {
                if (!day.classList.contains('inactive')) {
                    const dateStr = day.getAttribute('data-date');
                    if (dateStr && window.showPeriodEntryModal) {
                        window.showPeriodEntryModal(dateStr);
                    }
                }
            });
        });
        
        // Reload period data for new month
        if (window.loadCalendarPeriodData) {
            setTimeout(() => loadCalendarPeriodData(), 100);
        }
    }
}

function createCycleStatistics(container) {
    const statsEl = document.createElement('div');
    statsEl.className = 'card cycle-statistics-card';
    
    // Get stats from user profile or show defaults
    const cycleLength = appState.userProfile?.cycleData?.averageCycleLength || 28;
    const periodLength = appState.userProfile?.cycleData?.averagePeriodLength || 5;
    const ovulationDay = cycleLength - 14;
    
    statsEl.innerHTML = `
        <div class="card-header">
            <div class="card-title">
                <i class="fas fa-chart-pie pulse-subtle"></i>
                Your Cycle Statistics
            </div>
        </div>
        <div class="card-content">
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-icon binti-gradient-bg">
                        <i class="fas fa-sync-alt"></i>
                    </div>
                    <div class="stat-value">${cycleLength}</div>
                    <div class="stat-label">Avg. Cycle Length</div>
                    <div class="stat-emoji">🗓️</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon binti-secondary-gradient">
                        <i class="fas fa-calendar-week"></i>
                    </div>
                    <div class="stat-value">${periodLength}</div>
                    <div class="stat-label">Avg. Period Length</div>
                    <div class="stat-emoji">📅</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon binti-gradient-bg">
                        <i class="fas fa-egg"></i>
                    </div>
                    <div class="stat-value">${ovulationDay}</div>
                    <div class="stat-label">Avg. Ovulation Day</div>
                    <div class="stat-emoji">✨</div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(statsEl);
}

async function createPeriodHistory(container) {
    const historyEl = document.createElement('div');
    historyEl.className = 'card period-history-card';
    
    historyEl.innerHTML = `
        <div class="card-header">
            <div class="card-title">
                <i class="fas fa-history pulse-subtle"></i>
                Period History
            </div>
        </div>
        <div class="card-content">
            <div class="empty-state">
                <i class="fas fa-calendar-times" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <p>No period history yet</p>
                <p style="font-size: 14px; color: #666;">Start tracking to build your history</p>
            </div>
        </div>
    `;
    
    container.appendChild(historyEl);
    
    // Load real period history from API
    if (window.apiService && window.authManager && window.authManager.isAuthenticated()) {
        try {
            const response = await apiService.getPeriods();
            if (response.periods && response.periods.length > 0) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const contentDiv = historyEl.querySelector('.card-content');
                contentDiv.innerHTML = `
                    <div class="period-history-list">
                        ${response.periods.map(period => {
                            const startDate = new Date(period.start_date);
                            const endDate = period.end_date ? new Date(period.end_date) : null;
                            const duration = endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : '?';
                            return `
                                <div class="period-history-item">
                                    <div class="period-month-badge binti-gradient-bg">
                                        <div class="period-month">${monthNames[startDate.getMonth()]}</div>
                                    </div>
                                    <div class="period-content">
                                        <div class="period-header">
                                            <div class="period-dates">
                                                <i class="fas fa-calendar-day"></i> ${startDate.getDate()}${endDate ? `-${endDate.getDate()}` : ''}
                                            </div>
                                            <div class="period-duration">
                                                <i class="fas fa-hourglass-half"></i> ${duration} days
                                            </div>
                                        </div>
                                        ${period.flow_intensity ? `
                                            <div class="period-flow ${period.flow_intensity}-flow">
                                                <i class="fas fa-tint"></i>
                                                <span>${period.flow_intensity} flow</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }
        } catch (error) {
            console.error('Failed to load period history:', error);
        }
    }
}
