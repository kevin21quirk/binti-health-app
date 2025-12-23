/**
 * Data loader functions to populate UI with real API data
 */

// Load and update leak prevention predictions
async function updateLeakPreventionData() {
    if (!window.authManager || !window.authManager.isAuthenticated()) return;
    
    try {
        const { user } = await window.apiService.getUserProfile();
        
        if (user.next_period_estimate) {
            const nextPeriod = new Date(user.next_period_estimate);
            const today = new Date();
            const daysUntil = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            const leakNextPeriodEl = document.getElementById('leak-next-period');
            if (leakNextPeriodEl) {
                const startDate = nextPeriod.getDate();
                const endDate = new Date(nextPeriod);
                endDate.setDate(endDate.getDate() + (user.average_period_length || 5) - 1);
                
                leakNextPeriodEl.innerHTML = `${monthNames[nextPeriod.getMonth()]} ${startDate}-${endDate.getDate()} <span class="info-badge">in ${daysUntil} days</span>`;
            }
            
            const leakDay1El = document.getElementById('leak-day-1-date');
            if (leakDay1El) {
                leakDay1El.innerHTML = `${monthNames[nextPeriod.getMonth()]} ${startDate} <span class="flow-indicator light-flow"><i class="fas fa-tint-slash"></i> Light Flow Expected</span>`;
            }
        }
    } catch (error) {
        console.error('Failed to update leak prevention data:', error);
    }
}

// Load and display period data on calendar
async function loadCalendarPeriodData() {
    if (!window.authManager || !window.authManager.isAuthenticated()) return;
    
    try {
        const { periods } = await window.apiService.getPeriods();
        
        if (periods && periods.length > 0) {
            // Get current month/year from calendar
            const calendarEl = document.querySelector('.period-calendar');
            if (!calendarEl) return;
            
            // Mark period days on calendar
            periods.forEach(period => {
                const startDate = new Date(period.start_date);
                const endDate = period.end_date ? new Date(period.end_date) : startDate;
                
                // Mark each day of the period
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
                    const dayEl = document.querySelector(`[data-date="${dateStr}"]`);
                    if (dayEl) {
                        dayEl.classList.add('period-day');
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            });
        }
        
        // Mark predicted next period
        const { user } = await window.apiService.getUserProfile();
        if (user.next_period_estimate) {
            const nextPeriod = new Date(user.next_period_estimate);
            const periodLength = user.average_period_length || 5;
            
            for (let i = 0; i < periodLength; i++) {
                const date = new Date(nextPeriod);
                date.setDate(date.getDate() + i);
                const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                const dayEl = document.querySelector(`[data-date="${dateStr}"]`);
                if (dayEl && !dayEl.classList.contains('period-day')) {
                    dayEl.classList.add('predicted-period');
                    dayEl.style.opacity = '0.6';
                }
            }
        }
        
        // Mark ovulation day
        if (user.average_cycle_length) {
            const ovulationDay = user.average_cycle_length - 14;
            if (user.last_period_start) {
                const lastPeriod = new Date(user.last_period_start);
                const ovulationDate = new Date(lastPeriod);
                ovulationDate.setDate(ovulationDate.getDate() + ovulationDay);
                
                const dateStr = `${ovulationDate.getFullYear()}-${ovulationDate.getMonth() + 1}-${ovulationDate.getDate()}`;
                const dayEl = document.querySelector(`[data-date="${dateStr}"]`);
                if (dayEl) {
                    dayEl.classList.add('ovulation-day');
                }
                
                // Mark fertile window (5 days before ovulation + ovulation day)
                for (let i = -5; i <= 0; i++) {
                    const fertileDate = new Date(ovulationDate);
                    fertileDate.setDate(fertileDate.getDate() + i);
                    const fertileStr = `${fertileDate.getFullYear()}-${fertileDate.getMonth() + 1}-${fertileDate.getDate()}`;
                    const fertileEl = document.querySelector(`[data-date="${fertileStr}"]`);
                    if (fertileEl && !fertileEl.classList.contains('ovulation-day')) {
                        fertileEl.classList.add('fertile-day');
                    }
                }
            }
        }
    } catch (error) {
        console.error('Failed to load calendar period data:', error);
    }
}

// Load pain journal entries
async function loadPainJournalEntries() {
    if (!window.authManager || !window.authManager.isAuthenticated()) return;
    
    try {
        const { painEntries } = await window.apiService.getPainEntries(null, null, 10);
        
        const journalContainer = document.querySelector('.pain-journal-entries');
        if (!journalContainer) return;
        
        if (!painEntries || painEntries.length === 0) {
            journalContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-medical" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>No pain journal entries yet</p>
                    <p style="font-size: 14px; color: #666;">Start logging your pain to track patterns</p>
                    <button class="btn btn-primary" onclick="showPainEntryModal()">
                        <i class="fas fa-plus"></i> Log Pain
                    </button>
                </div>
            `;
            return;
        }
        
        // Display pain entries
        journalContainer.innerHTML = painEntries.map(entry => {
            const entryDate = new Date(entry.entry_date);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const timeStr = entryDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            
            return `
                <div class="journal-entry">
                    <div class="entry-header">
                        <div class="entry-date-time">
                            <div class="entry-day">${monthNames[entryDate.getMonth()]} ${entryDate.getDate()}</div>
                            <div class="entry-time">${timeStr}</div>
                        </div>
                        <div class="entry-indicators">
                            <span class="pain-level-badge level-${entry.pain_level}">${entry.pain_level}/10</span>
                        </div>
                    </div>
                    <div class="entry-body">
                        <div class="entry-locations">
                            ${entry.pain_locations ? entry.pain_locations.map(loc => `<span class="location-tag">${loc}</span>`).join('') : ''}
                        </div>
                        ${entry.notes ? `<p class="entry-notes">${entry.notes}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Failed to load pain journal:', error);
    }
}

// Initialize data loading when screens are loaded
window.updateLeakPreventionData = updateLeakPreventionData;
window.loadCalendarPeriodData = loadCalendarPeriodData;
window.loadPainJournalEntries = loadPainJournalEntries;
