/**
 * main.js - Spectre Divide Tournament
 * Main functionality for the tournament site
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Main JS loaded');
    
    // Initialize all functionality
    initTabs();
    setupMatchClicks();
    
    // Load tournament data from localStorage
    loadTournamentData();
    
    // Generate demo bracket if none exists
    setTimeout(checkAndGenerateDemoBracket, 500);
});

/**
 * Initialize tab navigation system
 */
function initTabs() {
    console.log('Initializing tabs');
    
    const tabButtons = document.querySelectorAll('.bracket-nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Tab clicked:', this.getAttribute('data-tab'));
            
            // Get the tab to activate
            const tabToActivate = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.getElementById(tabToActivate)?.classList.add('active');
            
            // Re-draw connectors if bracket tab
            if (tabToActivate === 'bracket' && typeof drawConnectors === 'function') {
                setTimeout(drawConnectors, 100);
            }
            
            // Save active tab to sessionStorage
            sessionStorage.setItem('activeTab', tabToActivate);
        });
    });
    
    // Check for saved tab in sessionStorage
    const activeTab = sessionStorage.getItem('activeTab');
    if (activeTab) {
        const tabToClick = document.querySelector(`.bracket-nav-item[data-tab="${activeTab}"]`);
        if (tabToClick) {
            tabToClick.click();
        }
    }
}

/**
 * Setup match click handlers
 */
function setupMatchClicks() {
    console.log('Setting up match clicks');
    
    document.addEventListener('click', function(e) {
        // Match card click
        if (e.target.closest('.match-card')) {
            const matchCard = e.target.closest('.match-card');
            const matchId = matchCard.getAttribute('data-match-id');
            console.log('Match clicked:', matchId);
            
            // Load match details
            loadMatchDetails(matchId);
            
            // Scroll to match details
            const matchDetails = document.querySelector('.match-details');
            if (matchDetails) {
                matchDetails.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

/**
 * Load match details into the details section
 */
function loadMatchDetails(matchId) {
    console.log('Loading match details for:', matchId);
    
    // Find the match card
    const matchCard = document.querySelector(`.match-card[data-match-id="${matchId}"]`);
    if (!matchCard) {
        console.warn('Match card not found for ID:', matchId);
        return;
    }
    
    // Get match details
    const matchTitle = matchCard.querySelector('.match-id')?.textContent || 'Match Details';
    const team1Name = matchCard.querySelector('.team-row:first-child .team-name')?.textContent || 'TBD';
    const team2Name = matchCard.querySelector('.team-row:last-child .team-name')?.textContent || 'TBD';
    const team1Score = matchCard.querySelector('.team-row:first-child .team-score')?.textContent || '0';
    const team2Score = matchCard.querySelector('.team-row:last-child .team-score')?.textContent || '0';
    const matchFormat = matchCard.querySelector('.match-format')?.textContent || 'BO5';
    const matchStatus = matchCard.querySelector('.match-status')?.textContent || 'Upcoming';
    
    // Update match details section
    const matchDetails = document.querySelector('.match-details');
    if (!matchDetails) {
        console.warn('Match details section not found');
        return;
    }
    
    // Update title
    const matchDetailsTitle = matchDetails.querySelector('.match-details-title');
    if (matchDetailsTitle) {
        matchDetailsTitle.textContent = matchTitle;
    }
    
    // Update team names
    const teamNames = matchDetails.querySelectorAll('.match-team-name');
    if (teamNames.length >= 2) {
        teamNames[0].textContent = team1Name;
        teamNames[1].textContent = team2Name;
    }
    
    // Update team logos
    const teamLogos = matchDetails.querySelectorAll('.team-logo');
    if (teamLogos.length >= 2) {
        teamLogos[0].textContent = team1Name.substring(0, 2).toUpperCase();
        teamLogos[1].textContent = team2Name.substring(0, 2).toUpperCase();
    }
    
    // Update scores
    const scoreValues = matchDetails.querySelectorAll('.match-score-value');
    if (scoreValues.length >= 2) {
        scoreValues[0].textContent = team1Score;
        scoreValues[1].textContent = team2Score;
    }
    
    // Update match info
    const statusValue = matchDetails.querySelector('.match-info-item:nth-child(1) .match-info-value');
    if (statusValue) {
        statusValue.textContent = matchStatus;
    }
    
    const stageValue = matchDetails.querySelector('.match-info-item:nth-child(2) .match-info-value');
    if (stageValue) {
        // Extract stage from match title
        let stage = 'Bracket Stage';
        if (matchTitle.includes('Quarter')) {
            stage = 'Quarterfinals';
        } else if (matchTitle.includes('Semi')) {
            stage = 'Semifinals';
        } else if (matchTitle.includes('Final')) {
            stage = 'Finals';
        }
        
        stageValue.textContent = stage;
    }
    
    const formatValue = matchDetails.querySelector('.match-info-item:nth-child(3) .match-info-value');
    if (formatValue) {
        formatValue.textContent = matchFormat.replace('BO', 'Best of ');
    }
    
    // Clear winner classes
    const matchTeams = matchDetails.querySelectorAll('.match-team');
    matchTeams.forEach(team => {
        team.classList.remove('winner');
    });
    
    // Set winner if there is one
    if (parseInt(team1Score) > parseInt(team2Score)) {
        matchTeams[0]?.classList.add('winner');
    } else if (parseInt(team2Score) > parseInt(team1Score)) {
        matchTeams[1]?.classList.add('winner');
    }
    
    showNotification('Match details updated', 'info');
}

/**
 * Load tournament data from localStorage
 */
function loadTournamentData() {
    console.log('Loading tournament data');
    
    const tournamentData = localStorage.getItem('tournamentData');
    if (tournamentData) {
        try {
            const data = JSON.parse(tournamentData);
            console.log('Tournament data loaded:', data);
            
            // Update tournament display
            updateTournamentDisplay(data);
            
            if (data.matches && data.matches.length > 0) {
                console.log('Matches found in stored data');
                // The bracket should be regenerated by info-sync.js
            }
        } catch (error) {
            console.error('Error parsing tournament data:', error);
        }
    } else {
        console.log('No saved tournament data found');
    }
}

/**
 * Update tournament display
 */
function updateTournamentDisplay(data) {
    console.log('Updating tournament display');
    
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
        
        // Show/hide champion display
        const championDisplay = document.querySelector('.champion-display');
        if (championDisplay) {
            championDisplay.style.display = data.status === 'completed' ? 'block' : 'none';
        }
    }
}

/**
 * Check if a demo bracket should be generated
 */
function checkAndGenerateDemoBracket() {
    console.log('Checking for existing bracket');
    
    const bracketContainer = document.querySelector('.bracket');
    const matchCards = document.querySelectorAll('.match-card');
    
    if (bracketContainer && matchCards.length === 0) {
        console.log('No bracket found, generating demo bracket');
        
        // Create demo teams
        const demoTeams = [
            { id: 1, name: 'Cyber Sentinels', seed: 1, logo: 'CS' },
            { id: 2, name: 'Eclipse Squad', seed: 2, logo: 'ES' },
            { id: 3, name: 'Shadow Ravens', seed: 3, logo: 'SR' },
            { id: 4, name: 'Neon Tigers', seed: 4, logo: 'NT' },
            { id: 5, name: 'Quantum Flames', seed: 5, logo: 'QF' },
            { id: 6, name: 'Digital Wolves', seed: 6, logo: 'DW' },
            { id: 7, name: 'Techno Phoenix', seed: 7, logo: 'TP' },
            { id: 8, name: 'Orbital Ghosts', seed: 8, logo: 'OG' }
        ];
        
        // Generate bracket
        if (typeof generateBracket === 'function') {
            generateBracket(demoTeams, 'single');
            
            // Set some demo scores
            setTimeout(() => {
                if (typeof updateMatchScore === 'function') {
                    // Update quarterfinals
                    updateMatchScore(1, 2, 0, 'completed');
                    updateMatchScore(2, 2, 1, 'completed');
                    updateMatchScore(3, 2, 0, 'completed');
                    updateMatchScore(4, 1, 2, 'completed');
                    
                    // Update semifinals
                    updateMatchScore(5, 3, 1, 'completed');
                    updateMatchScore(6, 2, 3, 'completed');
                    
                    // Finals in progress
                    updateMatchScore(7, 2, 2, 'live');
                    
                    // Show notification
                    showNotification('Demo bracket loaded with sample data', 'success');
                }
            }, 1000);
        }
    }
}