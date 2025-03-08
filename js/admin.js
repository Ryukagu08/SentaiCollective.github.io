/**
 * admin.js - Spectre Divide Tournament
 * Admin panel functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize admin functionality
    initAdminFunctionality();
});

/**
 * Check if user is authenticated
 */
function checkAuth() {
    const token = localStorage.getItem('auth');
    if (!token) {
        // Not authenticated, redirect to login
        window.location.href = 'login.html?redirect=admin';
    }
}

/**
 * Initialize all admin functionality
 */
function initAdminFunctionality() {
    // Tournament settings
    initTournamentSettings();
    
    // Team management
    initTeamManagement();
    
    // Tournament actions
    initTournamentActions();
    
    // Bracket editing
    initBracketEditing();
    
    // Modal handling
    initModals();
}

/**
 * Initialize tournament settings functionality
 */
function initTournamentSettings() {
    const updateTournamentBtn = document.getElementById('update-tournament');
    if (!updateTournamentBtn) return;
    
    updateTournamentBtn.addEventListener('click', function() {
        const tournamentName = document.getElementById('tournament-name').value;
        const tournamentFormat = document.getElementById('tournament-format').value;
        const tournamentStatus = document.getElementById('tournament-status-select').value;
        const tournamentDate = document.getElementById('tournament-date').value;
        const tournamentEndDate = document.getElementById('tournament-end-date').value;
        
        // Validate inputs
        if (!tournamentName) {
            showNotification('Please enter a tournament name', 'error');
            return;
        }
        
        // Update tournament settings
        updateTournamentHeader(tournamentName, tournamentFormat, tournamentStatus);
        
        // Show success notification
        showNotification('Tournament settings updated successfully', 'success');
    });
    
    // Status change handler
    const statusSelect = document.getElementById('tournament-status-select');
    if (statusSelect) {
        statusSelect.addEventListener('change', function() {
            const status = this.value;
            updateTournamentStatus(status);
        });
    }
}

/**
 * Update tournament header with new settings
 */
function updateTournamentHeader(name, format, status) {
    // Update tournament title
    const tournamentTitle = document.querySelector('.tournament-title');
    if (tournamentTitle) {
        tournamentTitle.textContent = name;
    }
    
    // Update tournament format
    const tournamentFormat = document.querySelector('.tournament-format');
    if (tournamentFormat) {
        let formatText = 'Single Elimination';
        
        if (format === 'double') {
            formatText = 'Double Elimination';
        } else if (format === 'round') {
            formatText = 'Round Robin';
        }
        
        tournamentFormat.textContent = formatText;
    }
    
    // Update tournament status
    updateTournamentStatus(status);
}

/**
 * Initialize team management functionality
 */
function initTeamManagement() {
    // Add team
    const addTeamBtn = document.getElementById('add-team');
    if (addTeamBtn) {
        addTeamBtn.addEventListener('click', function() {
            const teamName = document.getElementById('team-name').value;
            const teamSeed = document.getElementById('team-seed').value;
            
            if (!teamName) {
                showNotification('Please enter a team name', 'error');
                return;
            }
            
            addTeam(teamName, teamSeed);
            
            // Clear inputs
            document.getElementById('team-name').value = '';
            document.getElementById('team-seed').value = '';
        });
    }
    
    // Team action buttons (edit, remove)
    initTeamActions();
}

/**
 * Initialize team action buttons
 */
function initTeamActions() {
    // Remove team buttons
    const removeTeamBtns = document.querySelectorAll('.remove-team-btn');
    removeTeamBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const teamItem = this.closest('.team-item');
            if (teamItem) {
                const teamId = teamItem.getAttribute('data-team-id');
                showConfirmModal('Are you sure you want to remove this team?', function() {
                    teamItem.remove();
                    showNotification('Team removed successfully', 'success');
                });
            }
        });
    });
    
    // Edit team buttons
    const editTeamBtns = document.querySelectorAll('.edit-team-btn');
    editTeamBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const teamItem = this.closest('.team-item');
            if (teamItem) {
                const teamId = teamItem.getAttribute('data-team-id');
                const teamName = teamItem.querySelector('span').textContent.split(' ')[1];
                const teamSeed = teamItem.querySelector('strong').textContent.replace('#', '');
                
                // Show edit team modal
                showEditTeamModal(teamId, teamName, teamSeed);
            }
        });
    });
}

/**
 * Add a new team to the list
 */
function addTeam(name, seed = '') {
    const teamList = document.getElementById('admin-team-list');
    if (!teamList) return;
    
    // Create a unique ID for the team
    const teamId = Date.now();
    
    // Create team item
    const teamItem = document.createElement('div');
    teamItem.className = 'team-item';
    teamItem.setAttribute('data-team-id', teamId);
    
    const teamText = document.createElement('span');
    teamText.innerHTML = `<strong>#${seed || teamList.children.length + 1}</strong> ${name}`;
    
    const teamActions = document.createElement('div');
    teamActions.className = 'team-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-team-btn';
    editBtn.textContent = '✎';
    editBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showEditTeamModal(teamId, name, seed || teamList.children.length + 1);
    });
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-team-btn';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showConfirmModal('Are you sure you want to remove this team?', function() {
            teamItem.remove();
            showNotification('Team removed successfully', 'success');
        });
    });
    
    teamActions.appendChild(editBtn);
    teamActions.appendChild(removeBtn);
    
    teamItem.appendChild(teamText);
    teamItem.appendChild(teamActions);
    
    teamList.appendChild(teamItem);
    
    // Show success notification
    showNotification('Team added successfully', 'success');
}

/**
 * Initialize tournament actions
 */
function initTournamentActions() {
    // Generate bracket
    const generateBracketBtn = document.getElementById('generate-bracket');
    if (generateBracketBtn) {
        generateBracketBtn.addEventListener('click', function() {
            // Get teams
            const teams = getTeamsFromList();
            
            if (teams.length < 4) {
                showNotification('Need at least 4 teams to generate a bracket', 'error');
                return;
            }
            
            // Get tournament format
            const format = document.getElementById('tournament-format').value;
            
            // Show confirmation modal
            showConfirmModal('Generate a new bracket? This will reset all current progress.', function() {
                // Generate bracket
                generateBracket(teams, format);
                
                // Show success notification
                showNotification('Bracket generated successfully', 'success');
            });
        });
    }
    
    // Reset scores
    const resetScoresBtn = document.getElementById('reset-scores');
    if (resetScoresBtn) {
        resetScoresBtn.addEventListener('click', function() {
            showConfirmModal('Are you sure you want to reset all scores?', function() {
                resetAllScores();
                showNotification('All scores have been reset', 'success');
            });
        });
    }
    
    // Export data
    const exportDataBtn = document.getElementById('export-data');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            exportTournamentData();
        });
    }
    
    // Delete tournament
    const deleteTournamentBtn = document.getElementById('delete-tournament');
    if (deleteTournamentBtn) {
        deleteTournamentBtn.addEventListener('click', function() {
            showConfirmModal('Are you sure you want to delete this tournament? This action cannot be undone.', function() {
                // In a real app, this would make an API call to delete the tournament
                showNotification('Tournament deleted successfully', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            });
        });
    }
    
    // Bracket editing shortcuts
    const shuffleTeamsBtn = document.getElementById('shuffle-teams');
    if (shuffleTeamsBtn) {
        shuffleTeamsBtn.addEventListener('click', function() {
            const teams = getTeamsFromList();
            if (teams.length < 4) {
                showNotification('Need at least 4 teams to shuffle', 'error');
                return;
            }
            
            // Shuffle teams
            for (let i = teams.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [teams[i], teams[j]] = [teams[j], teams[i]];
            }
            
            // Get tournament format
            const format = document.getElementById('tournament-format').value;
            
            // Generate bracket with shuffled teams
            generateBracket(teams, format);
            
            showNotification('Teams shuffled successfully', 'success');
        });
    }
    
    const randomizeScoresBtn = document.getElementById('randomize-scores');
    if (randomizeScoresBtn) {
        randomizeScoresBtn.addEventListener('click', function() {
            randomizeAllScores();
            showNotification('Scores randomized successfully', 'success');
        });
    }
}

/**
 * Initialize bracket editing functionality
 */
function initBracketEditing() {
    // Admin editable match cards
    const editableMatchCards = document.querySelectorAll('.match-card.admin-editable');
    
    editableMatchCards.forEach(card => {
        // Score inputs
        const scoreInputs = card.querySelectorAll('.score-input');
        const matchId = card.getAttribute('data-match-id');
        
        scoreInputs.forEach(input => {
            input.addEventListener('change', function() {
                const team1Score = parseInt(scoreInputs[0].value) || 0;
                const team2Score = parseInt(scoreInputs[1].value) || 0;
                
                // Get status
                const statusSelect = card.querySelector('.status-select');
                const status = statusSelect ? statusSelect.value : 'completed';
                
                // Update match
                updateMatchScore(matchId, team1Score, team2Score, status);
            });
        });
        
        // Status select
        const statusSelect = card.querySelector('.status-select');
        if (statusSelect) {
            statusSelect.addEventListener('change', function() {
                const team1Score = parseInt(scoreInputs[0].value) || 0;
                const team2Score = parseInt(scoreInputs[1].value) || 0;
                
                // Update match
                updateMatchScore(matchId, team1Score, team2Score, this.value);
            });
        }
    });
    
    // Update bracket button
    const updateBracketBtn = document.getElementById('update-bracket');
    if (updateBracketBtn) {
        updateBracketBtn.addEventListener('click', function() {
            showNotification('Bracket updated successfully', 'success');
        });
    }
}

/**
 * Initialize modals
 */
function initModals() {
    // Close modal buttons
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Confirm modal
    const confirmModal = document.getElementById('confirm-modal');
    if (confirmModal) {
        const cancelBtn = confirmModal.querySelector('#cancel-action');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeAllModals);
        }
    }
    
    // Edit team modal
    const editTeamModal = document.getElementById('edit-team-modal');
    if (editTeamModal) {
        const cancelBtn = editTeamModal.querySelector('#cancel-edit-team');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeAllModals);
        }
        
        const saveBtn = editTeamModal.querySelector('#save-edit-team');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                const teamId = editTeamModal.getAttribute('data-team-id');
                const teamName = document.getElementById('edit-team-name').value;
                const teamSeed = document.getElementById('edit-team-seed').value;
                const teamLogo = document.getElementById('edit-team-logo').value;
                
                if (!teamName) {
                    showNotification('Please enter a team name', 'error');
                    return;
                }
                
                // Update team
                updateTeam(teamId, teamName, teamSeed, teamLogo);
                
                // Close modal
                closeAllModals();
                
                showNotification('Team updated successfully', 'success');
            });
        }
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
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
function showEditTeamModal(teamId, teamName, teamSeed, teamLogo = '') {
    const modal = document.getElementById('edit-team-modal');
    if (!modal) return;
    
    // Set team ID
    modal.setAttribute('data-team-id', teamId);
    
    // Set form values
    document.getElementById('edit-team-name').value = teamName;
    document.getElementById('edit-team-seed').value = teamSeed;
    document.getElementById('edit-team-logo').value = teamLogo || teamName.substring(0, 2).toUpperCase();
    
    // Show modal
    modal.classList.add('active');
}

/**
 * Close all modals
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
}

/**
 * Update team information
 */
function updateTeam(teamId, name, seed, logo) {
    const teamItem = document.querySelector(`.team-item[data-team-id="${teamId}"]`);
    if (!teamItem) return;
    
    // Update team text
    const teamText = teamItem.querySelector('span');
    if (teamText) {
        teamText.innerHTML = `<strong>#${seed}</strong> ${name}`;
    }
}

/**
 * Get teams from the team list
 */
function getTeamsFromList() {
    const teamItems = document.querySelectorAll('#admin-team-list .team-item');
    const teams = [];
    
    teamItems.forEach(item => {
        const teamText = item.querySelector('span').textContent;
        const seedMatch = teamText.match(/#(\d+)/);
        const seed = seedMatch ? parseInt(seedMatch[1]) : null;
        const name = teamText.replace(/#\d+\s/, '');
        
        teams.push({
            id: item.getAttribute('data-team-id'),
            name: name,
            seed: seed
        });
    });
    
    // Sort by seed
    teams.sort((a, b) => (a.seed || 999) - (b.seed || 999));
    
    return teams;
}

/**
 * Reset all scores in the bracket
 */
function resetAllScores() {
    const matchCards = document.querySelectorAll('.match-card');
    
    matchCards.forEach(card => {
        const teamRows = card.querySelectorAll('.team-row');
        
        // Clear winner/loser classes
        teamRows.forEach(row => {
            row.classList.remove('winner', 'loser');
        });
        
        // Reset scores
        const scoreInputs = card.querySelectorAll('.score-input');
        if (scoreInputs.length > 0) {
            scoreInputs.forEach(input => {
                input.value = 0;
            });
        } else {
            const scoreElements = card.querySelectorAll('.team-score');
            scoreElements.forEach(el => {
                el.textContent = '-';
            });
        }
        
        // Reset status
        const statusSelect = card.querySelector('.status-select');
        if (statusSelect) {
            statusSelect.value = 'upcoming';
        }
        
        const statusEl = card.querySelector('.match-status');
        if (statusEl) {
            statusEl.className = 'match-status upcoming';
            statusEl.textContent = 'Scheduled';
        }
        
        const timeEl = card.querySelector('.match-time');
        if (timeEl) {
            timeEl.textContent = 'Upcoming';
        }
    });
    
    // Regenerate connectors
    drawConnectors();
}

/**
 * Randomize all scores in the bracket
 */
function randomizeAllScores() {
    const matchCards = document.querySelectorAll('.match-card');
    
    matchCards.forEach(card => {
        const matchId = card.getAttribute('data-match-id');
        const teamRows = card.querySelectorAll('.team-row');
        
        // Skip if any team is TBD
        const team1Name = teamRows[0].querySelector('.team-name').textContent;
        const team2Name = teamRows[1].querySelector('.team-name').textContent;
        
        if (team1Name === 'TBD' || team2Name === 'TBD' || team1Name === 'BYE' || team2Name === 'BYE') {
            return;
        }
        
        // Generate random scores
        const maxScore = card.querySelector('.match-format').textContent === 'BO7' ? 4 : 3;
        const team1Score = Math.floor(Math.random() * (maxScore + 1));
        let team2Score = Math.floor(Math.random() * (maxScore + 1));
        
        // Ensure we have a winner (no ties)
        if (team1Score === team2Score) {
            // If both 0, make at least one score greater than 0
            if (team1Score === 0) {
                team2Score = Math.ceil(Math.random() * maxScore);
            } else {
                // If max score, reduce one of them
                if (team1Score === maxScore) {
                    team2Score = Math.floor(Math.random() * maxScore);
                } else {
                    // Otherwise, just make sure they're different
                    team2Score = team1Score - 1;
                }
            }
        }
        
        // Update scores in the UI
        const scoreInputs = card.querySelectorAll('.score-input');
        if (scoreInputs.length > 0) {
            scoreInputs[0].value = team1Score;
            scoreInputs[1].value = team2Score;
        }
        
        // Update match
        updateMatchScore(matchId, team1Score, team2Score, 'completed');
    });
}

/**
 * Export tournament data as JSON
 */
function exportTournamentData() {
    // Get tournament info
    const name = document.getElementById('tournament-name').value;
    const format = document.getElementById('tournament-format').value;
    const status = document.getElementById('tournament-status-select').value;
    const startDate = document.getElementById('tournament-date').value;
    const endDate = document.getElementById('tournament-end-date').value;
    
    // Get teams
    const teams = getTeamsFromList();
    
    // Get matches
    const matches = [];
    const matchCards = document.querySelectorAll('.match-card');
    
    matchCards.forEach(card => {
        const matchId = card.getAttribute('data-match-id');
        const teamRows = card.querySelectorAll('.team-row');
        
        const team1Name = teamRows[0].querySelector('.team-name').textContent;
        const team2Name = teamRows[1].querySelector('.team-name').textContent;
        
        const team1Score = parseInt(teamRows[0].querySelector('.team-score').textContent) || 0;
        const team2Score = parseInt(teamRows[1].querySelector('.team-score').textContent) || 0;
        
        const matchFormatEl = card.querySelector('.match-format');
        const matchFormat = matchFormatEl ? matchFormatEl.textContent : 'BO5';
        
        const matchStatusEl = card.querySelector('.match-status');
        const matchStatus = matchStatusEl ? matchStatusEl.className.replace('match-status ', '') : 'upcoming';
        
        matches.push({
            id: matchId,
            team1: team1Name,
            team2: team2Name,
            team1Score: team1Score,
            team2Score: team2Score,
            format: matchFormat,
            status: matchStatus
        });
    });
    
    // Create tournament data object
    const tournamentData = {
        name: name,
        format: format,
        status: status,
        startDate: startDate,
        endDate: endDate,
        teams: teams,
        matches: matches,
        exportDate: new Date().toISOString()
    };
    
    // Convert to JSON
    const jsonData = JSON.stringify(tournamentData, null, 2);
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament_${name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    showNotification('Tournament data exported successfully', 'success');
}

/**
 * Create notification toast
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