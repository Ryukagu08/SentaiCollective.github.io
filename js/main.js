/**
 * main.js - Spectre Divide Tournament
 * Main functionality for the tournament site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initTabs();
    handleDataFilters();
    initTeamSearch();
    setupMatchClicks();
    initStatsInteractions();
    
    // Load tournament data (simulated for demo)
    loadTournamentData();
});

/**
 * Initialize tab navigation system
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.bracket-nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the tab to activate
            const tabToActivate = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.getElementById(tabToActivate).classList.add('active');
            
            // Save active tab to sessionStorage
            sessionStorage.setItem('activeTab', tabToActivate);
            
            // Re-draw connectors if bracket tab
            if (tabToActivate === 'bracket') {
                setTimeout(drawConnectors, 100);
            }
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
 * Initialize data filters for schedule, results, etc.
 */
function handleDataFilters() {
    // Schedule Filters
    const scheduleFilters = document.querySelectorAll('.schedule-filters .filter-btn');
    const scheduleDays = document.querySelectorAll('.schedule-day');
    
    scheduleFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Remove active class from all filters
            scheduleFilters.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Show/hide schedule days based on filter
            if (filterValue === 'all') {
                scheduleDays.forEach(day => day.classList.add('active'));
            } else {
                scheduleDays.forEach(day => {
                    if (day.getAttribute('data-day') === filterValue) {
                        day.classList.add('active');
                    } else {
                        day.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Results Filters
    const resultsFilters = document.querySelectorAll('.results-filters .filter-btn');
    const resultMatches = document.querySelectorAll('.result-match');
    
    resultsFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Remove active class from all filters
            resultsFilters.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Show/hide result matches based on filter
            if (filterValue === 'all') {
                resultMatches.forEach(match => match.style.display = 'block');
            } else {
                resultMatches.forEach(match => {
                    if (match.getAttribute('data-status') === filterValue) {
                        match.style.display = 'block';
                    } else {
                        match.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Stats Filters
    const statsNavItems = document.querySelectorAll('.stats-nav-item');
    const statsPanes = document.querySelectorAll('.stats-pane');
    
    statsNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const statsType = this.getAttribute('data-stats');
            
            // Remove active class from all nav items and panes
            statsNavItems.forEach(navItem => navItem.classList.remove('active'));
            statsPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding pane
            this.classList.add('active');
            document.getElementById(statsType + '-stats').classList.add('active');
        });
    });
    
    // Stats table filters
    const statsFilters = document.querySelectorAll('.stats-filter');
    statsFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            const filterValue = this.value;
            const table = this.closest('.stats-pane').querySelector('.stats-table');
            
            // Simple filtering for demo purposes
            // In a real app, this would filter the actual data
            if (filterValue !== 'all') {
                showNotification(`Filtered stats to show ${filterValue} data`, 'info');
            }
        });
    });
}

/**
 * Initialize team search functionality
 */
function initTeamSearch() {
    const searchInput = document.querySelector('.teams-search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const teamCards = document.querySelectorAll('.team-card');
            
            teamCards.forEach(card => {
                const teamName = card.querySelector('.team-name').textContent.toLowerCase();
                
                if (teamName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Match click handler
 * Shows match details when a match card is clicked
 */
function setupMatchClicks() {
    const matchCards = document.querySelectorAll('.match-card');
    
    matchCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get match ID
            const matchId = this.getAttribute('data-match-id');
            
            // Load match details
            loadMatchDetails(matchId);
            
            // For demo purposes, we simply scroll to the match details section
            const matchDetails = document.querySelector('.match-details');
            if (matchDetails) {
                matchDetails.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Schedule match clicks
    const scheduleMatches = document.querySelectorAll('.schedule-match');
    scheduleMatches.forEach(match => {
        match.addEventListener('click', function() {
            // Get teams
            const team1El = this.querySelector('.match-teams .match-team:first-child .team-name');
            const team2El = this.querySelector('.match-teams .match-team:last-child .team-name');
            
            if (team1El && team2El) {
                const team1 = team1El.textContent;
                const team2 = team2El.textContent;
                
                // Find match in bracket
                const matchCards = document.querySelectorAll('.match-card');
                let foundMatch = null;
                
                matchCards.forEach(card => {
                    const cardTeam1 = card.querySelector('.team-row:first-child .team-name').textContent;
                    const cardTeam2 = card.querySelector('.team-row:last-child .team-name').textContent;
                    
                    if ((cardTeam1 === team1 && cardTeam2 === team2) || (cardTeam1 === team2 && cardTeam2 === team1)) {
                        foundMatch = card;
                    }
                });
                
                if (foundMatch) {
                    // Switch to bracket tab
                    const bracketTab = document.querySelector('.bracket-nav-item[data-tab="bracket"]');
                    if (bracketTab) {
                        bracketTab.click();
                    }
                    
                    // Scroll to match
                    foundMatch.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Highlight match
                    foundMatch.classList.add('match-highlight');
                    setTimeout(() => {
                        foundMatch.classList.remove('match-highlight');
                    }, 3000);
                    
                    // Load match details
                    const matchId = foundMatch.getAttribute('data-match-id');
                    loadMatchDetails(matchId);
                    
                    // Scroll to match details
                    setTimeout(() => {
                        const matchDetails = document.querySelector('.match-details');
                        if (matchDetails) {
                            matchDetails.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }, 800);
                }
            }
        });
    });
    
    // Results match details clicks
    const resultDetailsLinks = document.querySelectorAll('.result-details-link');
    resultDetailsLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get result match
            const resultMatch = this.closest('.result-match');
            if (!resultMatch) return;
            
            // Get teams
            const team1El = resultMatch.querySelector('.result-team:first-child .team-name');
            const team2El = resultMatch.querySelector('.result-team:last-child .team-name');
            
            if (team1El && team2El) {
                const team1 = team1El.textContent;
                const team2 = team2El.textContent;
                
                // Find match in bracket (same as above)
                const matchCards = document.querySelectorAll('.match-card');
                let foundMatch = null;
                
                matchCards.forEach(card => {
                    const cardTeam1 = card.querySelector('.team-row:first-child .team-name').textContent;
                    const cardTeam2 = card.querySelector('.team-row:last-child .team-name').textContent;
                    
                    if ((cardTeam1 === team1 && cardTeam2 === team2) || (cardTeam1 === team2 && cardTeam2 === team1)) {
                        foundMatch = card;
                    }
                });
                
                if (foundMatch) {
                    // Switch to bracket tab
                    const bracketTab = document.querySelector('.bracket-nav-item[data-tab="bracket"]');
                    if (bracketTab) {
                        bracketTab.click();
                    }
                    
                    // Load match details and scroll (same as above)
                    const matchId = foundMatch.getAttribute('data-match-id');
                    loadMatchDetails(matchId);
                    
                    foundMatch.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    foundMatch.classList.add('match-highlight');
                    setTimeout(() => {
                        foundMatch.classList.remove('match-highlight');
                    }, 3000);
                    
                    setTimeout(() => {
                        const matchDetails = document.querySelector('.match-details');
                        if (matchDetails) {
                            matchDetails.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }, 800);
                }
            }
        });
    });
}

/**
 * Initialize stats interactions
 */
function initStatsInteractions() {
    // Team stats row hover effects
    const statsTableRows = document.querySelectorAll('.stats-table tbody tr');
    statsTableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            const teamName = this.querySelector('.team')?.textContent;
            if (teamName) {
                // Highlight all instances of this team
                highlightTeam(teamName);
            }
        });
        
        row.addEventListener('mouseleave', function() {
            // Remove all highlights
            clearTeamHighlights();
        });
    });
    
    // Highlight team cards on team name click
    const teamNameElements = document.querySelectorAll('.team-name');
    teamNameElements.forEach(el => {
        el.addEventListener('click', function(e) {
            // Only if not inside a card that's already clickable
            if (!el.closest('.match-card') && !el.closest('.schedule-match') && !el.closest('.result-match')) {
                e.stopPropagation();
                const teamName = this.textContent;
                
                // Switch to teams tab
                const teamsTab = document.querySelector('.bracket-nav-item[data-tab="teams"]');
                if (teamsTab) {
                    teamsTab.click();
                }
                
                // Find and scroll to team card
                const teamCards = document.querySelectorAll('.team-card');
                teamCards.forEach(card => {
                    const cardTeamName = card.querySelector('.team-name').textContent;
                    if (cardTeamName === teamName) {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        
                        // Highlight card
                        card.classList.add('team-highlight');
                        setTimeout(() => {
                            card.classList.remove('team-highlight');
                        }, 3000);
                    }
                });
            }
        });
    });
}

/**
 * Load match details into the details section
 */
function loadMatchDetails(matchId) {
    // Find the match card
    const matchCard = document.querySelector(`.match-card[data-match-id="${matchId}"]`);
    if (!matchCard) return;
    
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
    if (!matchDetails) return;
    
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
    
    // Update map details - for demo purposes just ensure they're consistent with the teams
    const mapTeamNames = matchDetails.querySelectorAll('.map-content .team-name');
    mapTeamNames.forEach((el, i) => {
        if (i % 2 === 0) {
            el.textContent = team1Name;
        } else {
            el.textContent = team2Name;
        }
    });
}

/**
 * Highlight all instances of a team across the interface
 */
function highlightTeam(teamName) {
    // Find all elements with this team name
    const teamElements = document.querySelectorAll('.team-name');
    
    teamElements.forEach(el => {
        if (el.textContent === teamName) {
            // Highlight parent element
            const parent = el.closest('.team-row') || 
                          el.closest('.result-team') || 
                          el.closest('.match-team') || 
                          el.closest('.team-card') || 
                          el.closest('.map-score');
            
            if (parent) {
                parent.classList.add('highlight-team');
            }
        }
    });
}

/**
 * Clear all team highlights
 */
function clearTeamHighlights() {
    const highlightedElements = document.querySelectorAll('.highlight-team');
    highlightedElements.forEach(el => {
        el.classList.remove('highlight-team');
    });
}

/**
 * Toggle tournament status
 */
function updateTournamentStatus(status) {
    const tournamentStatus = document.querySelector('.tournament-status');
    
    // Update status text
    tournamentStatus.textContent = status.toUpperCase();
    
    // Update status styling
    tournamentStatus.classList.remove('live', 'upcoming', 'completed');
    tournamentStatus.classList.add(status.toLowerCase());
    
    // Show/hide champion display based on status
    const championDisplay = document.querySelector('.champion-display');
    if (championDisplay) {
        if (status.toLowerCase() === 'completed') {
            championDisplay.style.display = 'block';
        } else {
            championDisplay.style.display = 'none';
        }
    }
}

/**
 * Load tournament data
 * This is a simulation for demo purposes
 */
function loadTournamentData() {
    // In a real application, this would fetch data from an API
    console.log('Loading tournament data...');
    
    // Set up live match updates
    if (document.querySelector('.match-status.live')) {
        setInterval(updateLiveMatch, 30000); // Update every 30 seconds
    }
}

/**
 * Simulate live match updates
 */
function updateLiveMatch() {
    // Find live match
    const liveMatch = document.querySelector('.match-card:has(.match-status.live)');
    if (!liveMatch) return;
    
    // Get current scores
    const team1ScoreEl = liveMatch.querySelector('.team-row:first-child .team-score');
    const team2ScoreEl = liveMatch.querySelector('.team-row:last-child .team-score');
    
    if (team1ScoreEl && team2ScoreEl) {
        let team1Score = parseInt(team1ScoreEl.textContent) || 0;
        let team2Score = parseInt(team2ScoreEl.textContent) || 0;
        
        // Randomly update one of the scores (50% chance)
        if (Math.random() > 0.5) {
            // Determine max score based on format
            const format = liveMatch.querySelector('.match-format').textContent;
            const maxScore = format === 'BO7' ? 4 : 3;
            
            // Only update if neither team has reached max score
            if (team1Score < maxScore && team2Score < maxScore) {
                // 50% chance to update either team
                if (Math.random() > 0.5 && team1Score < maxScore) {
                    team1Score++;
                    team1ScoreEl.textContent = team1Score;
                    
                    // If this is the winning score, update status
                    if (team1Score === maxScore) {
                        const matchStatusEl = liveMatch.querySelector('.match-status');
                        if (matchStatusEl) {
                            matchStatusEl.textContent = 'Completed';
                            matchStatusEl.classList.remove('live');
                            matchStatusEl.classList.add('completed');
                        }
                        
                        const timeEl = liveMatch.querySelector('.match-time');
                        if (timeEl) {
                            timeEl.textContent = 'Completed';
                        }
                        
                        // Add winner/loser classes
                        liveMatch.querySelector('.team-row:first-child').classList.add('winner');
                        liveMatch.querySelector('.team-row:last-child').classList.add('loser');
                        
                        // Update champion if this was the final
                        if (liveMatch.querySelector('.match-id').textContent.includes('Final')) {
                            const winnerName = liveMatch.querySelector('.team-row:first-child .team-name').textContent;
                            updateChampion(winnerName);
                        }
                        
                        showNotification('Match completed! Refresh match details to see final results.', 'success');
                    } else {
                        showNotification('Score updated for live match!', 'info');
                    }
                } else if (team2Score < maxScore) {
                    team2Score++;
                    team2ScoreEl.textContent = team2Score;
                    
                    // If this is the winning score, update status
                    if (team2Score === maxScore) {
                        const matchStatusEl = liveMatch.querySelector('.match-status');
                        if (matchStatusEl) {
                            matchStatusEl.textContent = 'Completed';
                            matchStatusEl.classList.remove('live');
                            matchStatusEl.classList.add('completed');
                        }
                        
                        const timeEl = liveMatch.querySelector('.match-time');
                        if (timeEl) {
                            timeEl.textContent = 'Completed';
                        }
                        
                        // Add winner/loser classes
                        liveMatch.querySelector('.team-row:first-child').classList.add('loser');
                        liveMatch.querySelector('.team-row:last-child').classList.add('winner');
                        
                        // Update champion if this was the final
                        if (liveMatch.querySelector('.match-id').textContent.includes('Final')) {
                            const winnerName = liveMatch.querySelector('.team-row:last-child .team-name').textContent;
                            updateChampion(winnerName);
                        }
                        
                        showNotification('Match completed! Refresh match details to see final results.', 'success');
                    } else {
                        showNotification('Score updated for live match!', 'info');
                    }
                }
            }
        }
    }
}

/**
 * Update champion display
 */
function updateChampion(teamName) {
    const championDisplay = document.querySelector('.champion-display');
    if (!championDisplay) return;
    
    // Update champion name
    const championName = championDisplay.querySelector('.champion-name');
    if (championName) {
        championName.textContent = teamName;
    }
    
    // Update tournament status
    updateTournamentStatus('completed');
    
    // Show champion display
    championDisplay.style.display = 'block';
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

/**
 * Utility function to format date and time
 */
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    
    // Format date: e.g., "March 8, 2025"
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    
    // Format time: e.g., "3:30 PM"
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
    
    return {
        date: formattedDate,
        time: formattedTime,
        full: `${formattedDate} at ${formattedTime}`
    };
}