/**
 * tournament-sync.js - Spectre Divide Tournament
 * Synchronizes admin changes with the main tournament display
 */

// Shared state between admin and public views
const sharedTournamentState = {
    // Main state is stored in localStorage
    // This module handles synchronization between views
};

/**
 * Initialize sync functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for storage events (when other tabs update localStorage)
    window.addEventListener('storage', handleStorageChange);
    
    // Check if we're on admin page
    const isAdmin = document.body.classList.contains('admin-view');
    
    if (isAdmin) {
        // Setup admin-specific sync
        setupAdminSync();
    } else {
        // Setup public view sync
        setupPublicSync();
    }
    
    // Initial load from localStorage
    loadFromStorage();
});

/**
 * Handle storage change events (when localStorage is updated in another tab)
 */
function handleStorageChange(e) {
    // Only respond to changes in tournamentData
    if (e.key === 'tournamentData') {
        console.log('Tournament data updated in another tab, refreshing...');
        
        // Reload data
        loadFromStorage();
    }
}

/**
 * Load data from localStorage
 */
function loadFromStorage() {
    const savedData = localStorage.getItem('tournamentData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        
        // Update tournament display based on current page
        const isAdmin = document.body.classList.contains('admin-view');
        
        if (isAdmin) {
            // We're in admin view, update admin form values
            updateAdminFormValues(data);
        } else {
            // We're in public view, update public display
            updatePublicDisplay(data);
        }
    } catch (e) {
        console.error('Error loading tournament data:', e);
    }
}

/**
 * Setup admin-specific sync
 */
function setupAdminSync() {
    // Real-time sync of form values to display
    
    // Tournament name sync
    const nameInput = document.getElementById('tournament-name');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            // Update tournament title in real-time
            const tournamentTitle = document.querySelector('.tournament-title');
            if (tournamentTitle) {
                tournamentTitle.textContent = this.value;
            }
        });
    }
    
    // Format sync
    const formatSelect = document.getElementById('tournament-format');
    if (formatSelect) {
        formatSelect.addEventListener('change', function() {
            // Update format display
            const formatDisplay = document.querySelector('.tournament-format');
            if (formatDisplay) {
                let formatText = 'Single Elimination';
                
                if (this.value === 'double') {
                    formatText = 'Double Elimination';
                } else if (this.value === 'round') {
                    formatText = 'Round Robin';
                }
                
                formatDisplay.textContent = formatText;
            }
        });
    }
    
    // Status sync
    const statusSelect = document.getElementById('tournament-status-select');
    if (statusSelect) {
        statusSelect.addEventListener('change', function() {
            // Update status in UI
            updateTournamentStatus(this.value);
        });
    }
    
    // Score input sync
    document.querySelectorAll('.score-input').forEach(input => {
        input.addEventListener('input', function() {
            // Find this score element in the main display
            const matchCard = this.closest('.match-card');
            if (!matchCard) return;
            
            const matchId = matchCard.getAttribute('data-match-id');
            const isTeam1 = this.closest('.team-row') === matchCard.querySelector('.team-row:first-child');
            
            // Find the corresponding match card in the public view
            // For simplicity, we'll update within the same page
            const displayMatch = document.querySelector(`.bracket-container .match-card[data-match-id="${matchId}"]`);
            if (!displayMatch) return;
            
            // Update the score display
            const scoreEl = displayMatch.querySelector(`.team-row:${isTeam1 ? 'first-child' : 'last-child'} .team-score`);
            if (scoreEl) {
                scoreEl.textContent = this.value;
            }
            
            // Update winner/loser classes based on scores
            updateWinnerLoser(displayMatch);
        });
    });
    
    // Set up live updates for other editable elements
    setupLiveEditing();
}

/**
 * Setup public view sync
 */
function setupPublicSync() {
    // Public view just needs to listen for localStorage changes
    // These are handled by the handleStorageChange function
    
    // We can also set up a polling mechanism for more frequent updates
    // This is optional, as the storage event should handle most cases
    setInterval(loadFromStorage, 30000); // Check every 30 seconds
}

/**
 * Update tournament status
 */
function updateTournamentStatus(status) {
    const statusDisplay = document.querySelector('.tournament-status');
    if (!statusDisplay) return;
    
    // Update status text
    statusDisplay.textContent = status.toUpperCase();
    
    // Update status styling
    statusDisplay.classList.remove('live', 'upcoming', 'completed');
    statusDisplay.classList.add(status.toLowerCase());
    
    // Show/hide champion display
    const championDisplay = document.querySelector('.champion-display');
    if (championDisplay) {
        championDisplay.style.display = status.toLowerCase() === 'completed' ? 'block' : 'none';
    }
}

/**
 * Update winner/loser classes based on scores
 */
function updateWinnerLoser(matchCard) {
    const team1Row = matchCard.querySelector('.team-row:first-child');
    const team2Row = matchCard.querySelector('.team-row:last-child');
    
    if (!team1Row || !team2Row) return;
    
    const team1Score = parseInt(team1Row.querySelector('.team-score').textContent) || 0;
    const team2Score = parseInt(team2Row.querySelector('.team-score').textContent) || 0;
    
    // Clear previous classes
    team1Row.classList.remove('winner', 'loser');
    team2Row.classList.remove('winner', 'loser');
    
    // Set new classes
    if (team1Score > team2Score) {
        team1Row.classList.add('winner');
        team2Row.classList.add('loser');
    } else if (team2Score > team1Score) {
        team1Row.classList.add('loser');
        team2Row.classList.add('winner');
    }
}

/**
 * Setup live editing of tournament elements
 */
function setupLiveEditing() {
    // Status select sync
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            const matchCard = this.closest('.match-card');
            if (!matchCard) return;
            
            const matchId = matchCard.getAttribute('data-match-id');
            
            // Find corresponding display match
            const displayMatch = document.querySelector(`.bracket-container .match-card[data-match-id="${matchId}"]`);
            if (!displayMatch) return;
            
            // Update status
            const statusEl = displayMatch.querySelector('.match-status');
            if (statusEl) {
                statusEl.textContent = getStatusText(this.value);
                statusEl.className = `match-status ${this.value}`;
            }
            
            // Update time text
            const timeEl = displayMatch.querySelector('.match-time');
            if (timeEl) {
                timeEl.textContent = getTimeText(this.value);
            }
        });
    });
    
    // Format select sync
    document.querySelectorAll('.match-format-select').forEach(select => {
        select.addEventListener('change', function() {
            const matchCard = this.closest('.match-card');
            if (!matchCard) return;
            
            const matchId = matchCard.getAttribute('data-match-id');
            
            // Find corresponding display match
            const displayMatch = document.querySelector(`.bracket-container .match-card[data-match-id="${matchId}"]`);
            if (!displayMatch) return;
            
            // Update format
            const formatEl = displayMatch.querySelector('.match-format');
            if (formatEl) {
                formatEl.textContent = this.value;
            }
        });
    });
    
    // Time input sync
    document.querySelectorAll('.time-input').forEach(input => {
        input.addEventListener('change', function() {
            const matchCard = this.closest('.match-card');
            if (!matchCard) return;
            
            const matchId = matchCard.getAttribute('data-match-id');
            
            // Find corresponding display match
            const displayMatch = document.querySelector(`.bracket-container .match-card[data-match-id="${matchId}"]`);
            if (!displayMatch) return;
            
            // Update time text if not live or completed
            const statusEl = displayMatch.querySelector('.match-status');
            if (statusEl && !statusEl.classList.contains('live') && !statusEl.classList.contains('completed')) {
                const timeEl = displayMatch.querySelector('.match-time');
                if (timeEl) {
                    // Format datetime for display
                    const date = new Date(this.value);
                    timeEl.textContent = formatTime(date);
                }
            }
        });
    });
}

/**
 * Update admin form values from data
 */
function updateAdminFormValues(data) {
    // Tournament settings
    const nameInput = document.getElementById('tournament-name');
    if (nameInput && data.name) {
        nameInput.value = data.name;
    }
    
    const formatSelect = document.getElementById('tournament-format');
    if (formatSelect && data.format) {
        formatSelect.value = data.format;
    }
    
    const statusSelect = document.getElementById('tournament-status-select');
    if (statusSelect && data.status) {
        statusSelect.value = data.status;
    }
    
    const dateInput = document.getElementById('tournament-date');
    if (dateInput && data.startDate) {
        dateInput.value = data.startDate;
    }
    
    const endDateInput = document.getElementById('tournament-end-date');
    if (endDateInput && data.endDate) {
        endDateInput.value = data.endDate;
    }
    
    // Update visual elements
    updatePublicDisplay(data);
}

/**
 * Update public display elements
 */
function updatePublicDisplay(data) {
    // Tournament title
    const titleEl = document.querySelector('.tournament-title');
    if (titleEl && data.name) {
        titleEl.textContent = data.name;
    }
    
    // Format
    const formatEl = document.querySelector('.tournament-format');
    if (formatEl && data.format) {
        let formatText = 'Single Elimination';
        
        if (data.format === 'double') {
            formatText = 'Double Elimination';
        } else if (data.format === 'round') {
            formatText = 'Round Robin';
        }
        
        formatEl.textContent = formatText;
    }
    
    // Status
    if (data.status) {
        updateTournamentStatus(data.status);
    }
    
    // Match data (if available)
    if (data.matches && data.matches.length > 0) {
        updateMatches(data.matches);
    }
}

/**
 * Update matches from data
 */
function updateMatches(matches) {
    matches.forEach(match => {
        const matchCard = document.querySelector(`.bracket-container .match-card[data-match-id="${match.id}"]`);
        if (!matchCard) return;
        
        // Update team names if not TBD
        if (match.team1 && match.team1 !== 'TBD') {
            const team1NameEl = matchCard.querySelector('.team-row:first-child .team-name');
            if (team1NameEl) {
                team1NameEl.textContent = match.team1;
            }
        }
        
        if (match.team2 && match.team2 !== 'TBD') {
            const team2NameEl = matchCard.querySelector('.team-row:last-child .team-name');
            if (team2NameEl) {
                team2NameEl.textContent = match.team2;
            }
        }
        
        // Update scores
        const team1ScoreEl = matchCard.querySelector('.team-row:first-child .team-score');
        const team2ScoreEl = matchCard.querySelector('.team-row:last-child .team-score');
        
        if (team1ScoreEl) {
            team1ScoreEl.textContent = match.team1Score;
        }
        
        if (team2ScoreEl) {
            team2ScoreEl.textContent = match.team2Score;
        }
        
        // Update status
        const statusEl = matchCard.querySelector('.match-status');
        if (statusEl && match.status) {
            statusEl.textContent = getStatusText(match.status);
            statusEl.className = `match-status ${match.status}`;
        }
        
        // Update time
        const timeEl = matchCard.querySelector('.match-time');
        if (timeEl && match.status) {
            timeEl.textContent = getTimeText(match.status);
        }
        
        // Update winner/loser
        updateWinnerLoser(matchCard);
    });
}

/**
 * Get status text based on status value
 */
function getStatusText(status) {
    switch (status) {
        case 'upcoming':
            return 'Scheduled';
        case 'live':
            return 'Live';
        case 'completed':
            return 'Final';
        default:
            return 'Scheduled';
    }
}

/**
 * Get time text based on status
 */
function getTimeText(status) {
    switch (status) {
        case 'upcoming':
            return 'Upcoming';
        case 'live':
            return 'In Progress';
        case 'completed':
            return 'Completed';
        default:
            return 'Upcoming';
    }
}

/**
 * Format time for display
 */
function formatTime(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Upcoming';
    }
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}