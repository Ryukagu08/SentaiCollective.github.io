/**
 * info-sync.js - Synchronizes data between admin and public views
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Info sync JS loaded');
    
    // Add event listener for storage events (when other tabs update localStorage)
    window.addEventListener('storage', handleStorageChange);
    
    // Check if we're on admin page
    const isAdmin = document.body.classList.contains('admin-view');
    
    if (isAdmin) {
        console.log('Admin view detected, setting up admin sync');
        // Admin-specific functionality would go here
    } else {
        console.log('Public view detected, setting up public sync');
        // Public view sync
        checkForTournamentData();
    }
});

/**
 * Handle storage change events (when localStorage is updated in another tab)
 */
function handleStorageChange(e) {
    // Only respond to changes in tournamentData
    if (e.key === 'tournamentData') {
        console.log('Tournament data updated in another tab, refreshing...');
        
        // Check for tournament data
        checkForTournamentData();
    }
}

/**
 * Check for tournament data in localStorage and apply it
 */
function checkForTournamentData() {
    console.log('Checking for tournament data');
    
    const savedData = localStorage.getItem('tournamentData');
    if (!savedData) {
        console.log('No tournament data found');
        return;
    }
    
    try {
        const data = JSON.parse(savedData);
        console.log('Tournament data found:', data);
        
        // Update UI based on current page
        const isAdmin = document.body.classList.contains('admin-view');
        
        if (isAdmin) {
            console.log('Admin view - data will be handled by admin.js');
            // Admin view updates are handled by admin.js
        } else {
            console.log('Public view - updating display');
            // Public view updates
            updatePublicDisplay(data);
        }
    } catch (e) {
        console.error('Error processing tournament data:', e);
    }
}

/**
 * Update public display with tournament data
 */
function updatePublicDisplay(data) {
    console.log('Updating public display with data');
    
    // Update tournament title
    const titleEl = document.querySelector('.tournament-title');
    if (titleEl && data.name) {
        titleEl.textContent = data.name;
    }
    
    // Update format
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
    
    // Update status
    const statusEl = document.querySelector('.tournament-status');
    if (statusEl && data.status) {
        statusEl.textContent = data.status.toUpperCase();
        statusEl.className = 'tournament-status ' + data.status.toLowerCase();
    }
    
    // Update champion display
    const championDisplay = document.querySelector('.champion-display');
    if (championDisplay && data.status) {
        championDisplay.style.display = data.status === 'completed' ? 'block' : 'none';
    }
    
    // Update bracket if there are matches
    if (data.teams && data.teams.length > 0) {
        // Generate bracket with teams
        if (typeof generateBracket === 'function' && typeof updateMatchScore === 'function') {
            // Generate the bracket first
            generateBracket(data.teams, data.format || 'single');
            
            // Then update match scores if there are any
            if (data.matches && data.matches.length > 0) {
                setTimeout(() => {
                    data.matches.forEach(match => {
                        updateMatchScore(
                            match.id,
                            match.team1Score,
                            match.team2Score,
                            match.status
                        );
                    });
                }, 500);
            }
        }
    }
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification('Tournament data updated', 'info');
    }
}