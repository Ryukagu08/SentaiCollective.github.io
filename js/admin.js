/**
 * optimized-admin.js - Spectre Divide Tournament
 * Performance-optimized admin functionality
 */

// Single global state object for tournament data
const tournamentState = {
    name: 'Winter Championship 2025',
    format: 'single',
    status: 'live',
    teams: [],
    matches: [],
    changes: false
};

// Cache DOM elements for improved performance
const domCache = {};

// Function to cache frequently accessed DOM elements
function cacheDOMElements() {
    // Tournament settings elements
    domCache.tournamentName = document.getElementById('tournament-name');
    domCache.tournamentFormat = document.getElementById('tournament-format');
    domCache.tournamentStatus = document.getElementById('tournament-status-select');
    domCache.tournamentDate = document.getElementById('tournament-date');
    domCache.tournamentEndDate = document.getElementById('tournament-end-date');
    
    // Tournament header elements (user-facing)
    domCache.tournamentTitle = document.querySelector('.tournament-title');
    domCache.tournamentFormatDisplay = document.querySelector('.tournament-format');
    domCache.tournamentStatusDisplay = document.querySelector('.tournament-status');
    
    // Buttons
    domCache.updateTournamentBtn = document.getElementById('update-tournament');
    domCache.addTeamBtn = document.getElementById('add-team');
    domCache.generateBracketBtn = document.getElementById('generate-bracket');
    domCache.resetScoresBtn = document.getElementById('reset-scores');
    domCache.saveChangesBtn = document.getElementById('save-all-changes');
    
    // Team management
    domCache.teamNameInput = document.getElementById('team-name');
    domCache.teamSeedInput = document.getElementById('team-seed');
    domCache.teamList = document.getElementById('admin-team-list');
    
    // Other sections
    domCache.championDisplay = document.querySelector('.champion-display');
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize on DOM load
    cacheDOMElements();
    checkAuth();
    initAdminFunctionality();
    loadSavedData();
});

/**
 * Check authentication
 */
function checkAuth() {
    const token = localStorage.getItem('auth');
    if (!token) {
        window.location.href = 'login.html?redirect=admin';
    }
}

/**
 * Initialize all admin functionality
 */
function initAdminFunctionality() {
    // Use event delegation for better performance
    attachEventListeners();
    
    // Initialize modals
    initModals();
}

/**
 * Attach event listeners using delegation where possible
 */
function attachEventListeners() {
    // Tournament settings
    if (domCache.updateTournamentBtn) {
        domCache.updateTournamentBtn.addEventListener('click', updateTournamentSettings);
    }
    
    // Team management
    if (domCache.addTeamBtn) {
        domCache.addTeamBtn.addEventListener('click', handleAddTeam);
    }
    
    // Tournament status
    if (domCache.tournamentStatus) {
        domCache.tournamentStatus.addEventListener('change', function() {
            updateTournamentStatus(this.value);
        });
    }
    
    // Save changes
    if (domCache.saveChangesBtn) {
        domCache.saveChangesBtn.addEventListener('click', saveTournamentData);
    }
    
    // Team list event delegation
    if (domCache.teamList) {
        domCache.teamList.addEventListener('click', function(e) {
            // Handle team edit button
            if (e.target.classList.contains('edit-team-btn')) {
                handleEditTeam(e);
            }
            
            // Handle team remove button
            if (e.target.classList.contains('remove-team-btn')) {
                handleRemoveTeam(e);
            }
        });
    }
    
    // Bracket generation
    if (domCache.generateBracketBtn) {
        domCache.generateBracketBtn.addEventListener('click', function() {
            const teams = getTeamsFromList();
            if (teams.length < 4) {
                showNotification('Need at least 4 teams to generate a bracket', 'error');
                return;
            }
            
            showConfirmModal('Generate a new bracket? This will reset all current progress.', function() {
                generateBracket(teams, domCache.tournamentFormat.value);
                tournamentState.changes = true;
                showNotification('Bracket generated successfully', 'success');
            });
        });
    }
    
    // Reset scores
    if (domCache.resetScoresBtn) {
        domCache.resetScoresBtn.addEventListener('click', function() {
            showConfirmModal('Are you sure you want to reset all scores?', function() {
                resetAllScores();
                tournamentState.changes = true;
                showNotification('All scores have been reset', 'success');
            });
        });
    }
    
    // Logout button
    document.getElementById('logout-button')?.addEventListener('click', logout);
    document.getElementById('logout')?.addEventListener('click', logout);
}

/**
 * Handle logout
 */
function logout() {
    if (tournamentState.changes) {
        showConfirmModal('You have unsaved changes. Are you sure you want to logout?', function() {
            localStorage.removeItem('auth');
            window.location.href = 'login.html';
        });
    } else {
        localStorage.removeItem('auth');
        window.location.href = 'login.html';
    }
}

/**
 * Update tournament settings
 */
function updateTournamentSettings() {
    if (!domCache.tournamentName || !domCache.tournamentFormat || !domCache.tournamentStatus) {
        console.error('DOM elements not found');
        return;
    }
    
    const name = domCache.tournamentName.value;
    const format = domCache.tournamentFormat.value;
    const status = domCache.tournamentStatus.value;
    
    if (!name) {
        showNotification('Please enter a tournament name', 'error');
        return;
    }
    
    // Update state
    tournamentState.name = name;
    tournamentState.format = format;
    tournamentState.status = status;
    
    if (domCache.tournamentDate) {
        tournamentState.startDate = domCache.tournamentDate.value;
    }
    
    if (domCache.tournamentEndDate) {
        tournamentState.endDate = domCache.tournamentEndDate.value;
    }
    
    // Update UI
    updateTournamentDisplay();
    
    // Mark as having changes
    tournamentState.changes = true;
    
    showNotification('Tournament settings updated successfully', 'success');
}

/**
 * Update tournament display (user-facing elements)
 */
function updateTournamentDisplay() {
    // Update tournament title
    if (domCache.tournamentTitle) {
        domCache.tournamentTitle.textContent = tournamentState.name;
    }
    
    // Update format display
    if (domCache.tournamentFormatDisplay) {
        let formatText = 'Single Elimination';
        
        if (tournamentState.format === 'double') {
            formatText = 'Double Elimination';
        } else if (tournamentState.format === 'round') {
            formatText = 'Round Robin';
        }
        
        domCache.tournamentFormatDisplay.textContent = formatText;
    }
    
    // Update status
    updateTournamentStatus(tournamentState.status);
}

/**
 * Update tournament status
 */
function updateTournamentStatus(status) {
    if (!domCache.tournamentStatusDisplay) return;
    
    // Update status text
    domCache.tournamentStatusDisplay.textContent = status.toUpperCase();
    
    // Update status styling
    domCache.tournamentStatusDisplay.classList.remove('live', 'upcoming', 'completed');
    domCache.tournamentStatusDisplay.classList.add(status.toLowerCase());
    
    // Show/hide champion display
    if (domCache.championDisplay) {
        domCache.championDisplay.style.display = status.toLowerCase() === 'completed' ? 'block' : 'none';
    }
    
    // Update state
    tournamentState.status = status;
}

/**
 * Handle adding a team
 */
function handleAddTeam() {
    if (!domCache.teamNameInput || !domCache.teamSeedInput) return;
    
    const teamName = domCache.teamNameInput.value.trim();
    const teamSeed = domCache.teamSeedInput.value.trim();
    
    if (!teamName) {
        showNotification('Please enter a team name', 'error');
        return;
    }
    
    addTeam(teamName, teamSeed);
    
    // Clear inputs
    domCache.teamNameInput.value = '';
    domCache.teamSeedInput.value = '';
    domCache.teamNameInput.focus();
    
    // Mark as having changes
    tournamentState.changes = true;
}

/**
 * Add a team to the UI and state
 */
function addTeam(name, seed = '') {
    if (!domCache.teamList) return;
    
    // Create a unique ID for the team
    const teamId = Date.now();
    const teamSeed = seed || (tournamentState.teams.length + 1);
    
    // Create team item element
    const teamItem = document.createElement('div');
    teamItem.className = 'team-item';
    teamItem.setAttribute('data-team-id', teamId);
    
    teamItem.innerHTML = `
        <span><strong>#${teamSeed}</strong> ${name}</span>
        <div class="team-actions">
            <button class="edit-team-btn">✎</button>
            <button class="remove-team-btn">×</button>
        </div>
    `;
    
    domCache.teamList.appendChild(teamItem);
    
    // Add to state
    tournamentState.teams.push({
        id: teamId,
        name: name,
        seed: parseInt(teamSeed) || tournamentState.teams.length + 1
    });
    
    showNotification('Team added successfully', 'success');
}

/**
 * Handle editing a team
 */
function handleEditTeam(e) {
    const teamItem = e.target.closest('.team-item');
    if (!teamItem) return;
    
    const teamId = teamItem.getAttribute('data-team-id');
    const teamText = teamItem.querySelector('span').textContent;
    
    // Parse team text
    const teamParts = teamText.match(/^#(\d+)\s+(.+)$/);
    
    let teamSeed = '';
    let teamName = teamText;
    
    if (teamParts && teamParts.length === 3) {
        teamSeed = teamParts[1];
        teamName = teamParts[2];
    }
    
    showEditTeamModal(teamId, teamName, teamSeed);
}

/**
 * Handle removing a team
 */
function handleRemoveTeam(e) {
    const teamItem = e.target.closest('.team-item');
    if (!teamItem) return;
    
    const teamId = teamItem.getAttribute('data-team-id');
    
    showConfirmModal('Are you sure you want to remove this team?', function() {
        // Remove from DOM
        teamItem.remove();
        
        // Remove from state
        const teamIndex = tournamentState.teams.findIndex(team => team.id == teamId);
        if (teamIndex !== -1) {
            tournamentState.teams.splice(teamIndex, 1);
        }
        
        // Mark as having changes
        tournamentState.changes = true;
        
        showNotification('Team removed successfully', 'success');
    });
}

/**
 * Initialize modals
 */
function initModals() {
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Cancel buttons
    document.getElementById('cancel-action')?.addEventListener('click', closeAllModals);
    document.getElementById('cancel-edit-team')?.addEventListener('click', closeAllModals);
    
    // Save team button
    document.getElementById('save-edit-team')?.addEventListener('click', saveEditedTeam);
    
    // Close on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Show confirmation modal
 */
function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;
    
    // Set message
    const messageEl = modal.querySelector('.modal-body p');
    if (messageEl) {
        messageEl.textContent = message;
    }
    
    // Set confirm action
    const confirmBtn = modal.querySelector('#confirm-action');
    if (confirmBtn) {
        // Remove previous event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        // Add new event listener
        newConfirmBtn.addEventListener('click', function() {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            closeAllModals();
        });
    }
    
    // Show modal
    modal.classList.add('active');
}

/**
 * Show edit team modal
 */
function showEditTeamModal(teamId, teamName, teamSeed) {
    const modal = document.getElementById('edit-team-modal');
    if (!modal) return;
    
    // Set team ID
    modal.setAttribute('data-team-id', teamId);
    
    // Set form values
    document.getElementById('edit-team-name').value = teamName;
    document.getElementById('edit-team-seed').value = teamSeed;
    document.getElementById('edit-team-logo').value = teamName.substring(0, 2).toUpperCase();
    
    // Show modal
    modal.classList.add('active');
    
    // Focus on name field
    setTimeout(() => {
        document.getElementById('edit-team-name').focus();
    }, 100);
}

/**
 * Save edited team
 */
function saveEditedTeam() {
    const modal = document.getElementById('edit-team-modal');
    if (!modal) return;
    
    const teamId = modal.getAttribute('data-team-id');
    const teamName = document.getElementById('edit-team-name').value;
    const teamSeed = document.getElementById('edit-team-seed').value;
    const teamLogo = document.getElementById('edit-team-logo').value;
    
    if (!teamName) {
        showNotification('Please enter a team name', 'error');
        return;
    }
    
    // Update DOM
    const teamItem = document.querySelector(`.team-item[data-team-id="${teamId}"]`);
    if (teamItem) {
        const teamText = teamItem.querySelector('span');
        if (teamText) {
            teamText.innerHTML = `<strong>#${teamSeed}</strong> ${teamName}`;
        }
    }
    
    // Update state
    const teamIndex = tournamentState.teams.findIndex(team => team.id == teamId);
    if (teamIndex !== -1) {
        tournamentState.teams[teamIndex] = {
            id: teamId,
            name: teamName,
            seed: parseInt(teamSeed) || teamIndex + 1,
            logo: teamLogo
        };
    }
    
    // Mark as having changes
    tournamentState.changes = true;
    
    // Close modal
    closeAllModals();
    
    showNotification('Team updated successfully', 'success');
}

/**
 * Close all modals
 */
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

/**
 * Get teams from the list
 */
function getTeamsFromList() {
    // Use state data instead of DOM parsing for better performance
    return [...tournamentState.teams].sort((a, b) => (a.seed || 999) - (b.seed || 999));
}

/**
 * Save tournament data to localStorage
 */
function saveTournamentData() {
    // Save bracket data
    saveBracketData();
    
    // Add timestamp
    tournamentState.lastSaved = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem('tournamentData', JSON.stringify(tournamentState));
    
    // Reset changes flag
    tournamentState.changes = false;
    
    showNotification('All changes saved successfully', 'success');
}

/**
 * Save bracket data to state
 */
function saveBracketData() {
    const matchCards = document.querySelectorAll('.match-card');
    const matches = [];
    
    matchCards.forEach(card => {
        const matchId = card.getAttribute('data-match-id');
        const team1Name = card.querySelector('.team-row:first-child .team-name')?.textContent || 'TBD';
        const team2Name = card.querySelector('.team-row:last-child .team-name')?.textContent || 'TBD';
        
        // Handle different score element types (input vs text)
        const team1ScoreEl = card.querySelector('.team-row:first-child .team-score');
        const team2ScoreEl = card.querySelector('.team-row:last-child .team-score');
        
        const team1Score = getElementValue(team1ScoreEl) || 0;
        const team2Score = getElementValue(team2ScoreEl) || 0;
        
        // Format and status
        const formatEl = card.querySelector('.match-format');
        const statusEl = card.querySelector('.match-status');
        
        const format = getElementValue(formatEl) || 'BO5';
        const status = getElementStatus(statusEl) || 'upcoming';
        
        // Add to matches array
        matches.push({
            id: matchId,
            team1: team1Name,
            team2: team2Name,
            team1Score: team1Score,
            team2Score: team2Score,
            format: format,
            status: status
        });
    });
    
    // Update state
    tournamentState.matches = matches;
}

/**
 * Get element value (works with both inputs and text nodes)
 */
function getElementValue(element) {
    if (!element) return null;
    
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
        return element.value;
    } else {
        return element.textContent;
    }
}

/**
 * Get match status from status element
 */
function getElementStatus(element) {
    if (!element) return 'upcoming';
    
    if (element.tagName === 'SELECT') {
        return element.value;
    } else if (element.classList.contains('completed')) {
        return 'completed';
    } else if (element.classList.contains('live')) {
        return 'live';
    } else {
        return 'upcoming';
    }
}

/**
 * Load saved tournament data
 */
function loadSavedData() {
    const savedData = localStorage.getItem('tournamentData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Merge with current state
            Object.assign(tournamentState, data);
            
            // Update UI
            populateUI();
            
            showNotification('Loaded saved tournament data', 'info');
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

/**
 * Populate UI with state data
 */
function populateUI() {
    // Populate tournament settings
    if (domCache.tournamentName) {
        domCache.tournamentName.value = tournamentState.name || '';
    }
    
    if (domCache.tournamentFormat) {
        domCache.tournamentFormat.value = tournamentState.format || 'single';
    }
    
    if (domCache.tournamentStatus) {
        domCache.tournamentStatus.value = tournamentState.status || 'upcoming';
    }
    
    if (domCache.tournamentDate) {
        domCache.tournamentDate.value = tournamentState.startDate || '';
    }
    
    if (domCache.tournamentEndDate) {
        domCache.tournamentEndDate.value = tournamentState.endDate || '';
    }
    
    // Update display
    updateTournamentDisplay();
    
    // Populate teams
    if (domCache.teamList) {
        // Clear existing teams
        domCache.teamList.innerHTML = '';
        
        // Add teams from state
        tournamentState.teams.forEach(team => {
            addTeam(team.name, team.seed);
        });
    }
    
    // Clear changes flag
    tournamentState.changes = false;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    notification.appendChild(closeBtn);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}