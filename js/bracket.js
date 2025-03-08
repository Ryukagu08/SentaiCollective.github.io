/**
 * bracket.js - Spectre Divide Tournament
 * Functionality specific to the tournament bracket visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Draw connectors when page loads
    drawConnectors();
    
    // Set up match click handlers
    setupMatchClicks();
    
    // Redraw connectors when window is resized
    window.addEventListener('resize', drawConnectors);
});

/**
 * Draw connector lines between matches in the bracket
 */
function drawConnectors() {
    const connectorContainer = document.getElementById('connector-container');
    
    // Exit if connector container doesn't exist
    if (!connectorContainer) return;
    
    // Clear existing connectors
    connectorContainer.innerHTML = '';
    
    // Get all match wrappers that have next-match data
    const matchWrappers = document.querySelectorAll('.bracket-match-wrapper[data-next-match]');
    
    matchWrappers.forEach(wrapper => {
        const matchRect = wrapper.getBoundingClientRect();
        const matchId = wrapper.getAttribute('data-match-id');
        const nextMatchId = wrapper.getAttribute('data-next-match');
        const position = wrapper.getAttribute('data-position');
        
        // Find the next match wrapper
        const nextMatchWrapper = document.querySelector(`.bracket-match-wrapper[data-match-id="${nextMatchId}"]`);
        
        if (nextMatchWrapper) {
            const nextMatchRect = nextMatchWrapper.getBoundingClientRect();
            
            // Calculate positions relative to the connector container
            const containerRect = connectorContainer.getBoundingClientRect();
            
            const startX = matchRect.right - containerRect.left;
            const startY = matchRect.top + (matchRect.height / 2) - containerRect.top;
            
            const endX = nextMatchRect.left - containerRect.left;
            const endY = nextMatchRect.top + (nextMatchRect.height / 2) - containerRect.top;
            
            // Create horizontal connector
            const horizontalConnector = document.createElement('div');
            horizontalConnector.className = 'connector connector-horizontal';
            horizontalConnector.style.left = `${startX}px`;
            horizontalConnector.style.top = `${startY}px`;
            horizontalConnector.style.width = `${(endX - startX) / 2}px`;
            
            // Create vertical connector if needed
            if (startY !== endY) {
                const verticalConnector = document.createElement('div');
                verticalConnector.className = 'connector connector-vertical';
                
                if (position === 'top') {
                    verticalConnector.style.left = `${startX + (endX - startX) / 2}px`;
                    verticalConnector.style.top = `${startY}px`;
                    verticalConnector.style.height = `${endY - startY}px`;
                } else {
                    verticalConnector.style.left = `${startX + (endX - startX) / 2}px`;
                    verticalConnector.style.top = `${endY}px`;
                    verticalConnector.style.height = `${startY - endY}px`;
                }
                
                connectorContainer.appendChild(verticalConnector);
            }
            
            // Create second horizontal connector
            const horizontalConnector2 = document.createElement('div');
            horizontalConnector2.className = 'connector connector-horizontal';
            horizontalConnector2.style.left = `${startX + (endX - startX) / 2}px`;
            horizontalConnector2.style.top = `${endY}px`;
            horizontalConnector2.style.width = `${(endX - startX) / 2}px`;
            
            // Add connectors to container
            connectorContainer.appendChild(horizontalConnector);
            connectorContainer.appendChild(horizontalConnector2);
        }
    });
}

/**
 * Generate a tournament bracket based on teams
 * @param {Array} teams - Array of team objects
 * @param {string} format - Tournament format (single, double, etc.)
 */
function generateBracket(teams, format = 'single') {
    // Validate teams
    if (!teams || teams.length < 2) {
        console.error('Not enough teams to generate a bracket');
        return;
    }
    
    // Get bracket container
    const bracketContainer = document.querySelector('.bracket');
    if (!bracketContainer) return;
    
    // Clear existing bracket
    bracketContainer.innerHTML = '<div class="connector-container" id="connector-container"></div>';
    
    // Calculate number of rounds needed
    const teamCount = teams.length;
    const roundCount = Math.ceil(Math.log2(teamCount));
    
    // Create rounds
    for (let round = 0; round < roundCount; round++) {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'bracket-round';
        
        // Round header
        const roundHeader = document.createElement('div');
        roundHeader.className = 'round-header';
        
        const roundTitle = document.createElement('div');
        roundTitle.className = 'round-title';
        
        // Set round title based on round number
        if (round === 0) {
            roundTitle.textContent = teamCount <= 4 ? 'Semifinals' : 'Round 1';
        } else if (round === roundCount - 1) {
            roundTitle.textContent = 'Final';
        } else if (round === roundCount - 2) {
            roundTitle.textContent = 'Semifinals';
        } else if (round === roundCount - 3) {
            roundTitle.textContent = 'Quarterfinals';
        } else {
            roundTitle.textContent = `Round ${round + 1}`;
        }
        
        const roundSubtitle = document.createElement('div');
        roundSubtitle.className = 'round-subtitle';
        roundSubtitle.textContent = round === roundCount - 1 ? 'Best of 7' : 'Best of 5';
        
        roundHeader.appendChild(roundTitle);
        roundHeader.appendChild(roundSubtitle);
        roundDiv.appendChild(roundHeader);
        
        // Bracket matches container
        const bracketMatches = document.createElement('div');
        bracketMatches.className = 'bracket-matches';
        
        // Calculate matches for this round
        const matchCount = Math.pow(2, roundCount - round - 1);
        
        // Create matches
        for (let match = 0; match < matchCount; match++) {
            // Create match wrapper
            const matchWrapper = document.createElement('div');
            matchWrapper.className = 'bracket-match-wrapper';
            matchWrapper.setAttribute('data-match-id', getMatchId(round, match));
            
            // Set next match data for advancing winners
            if (round < roundCount - 1) {
                matchWrapper.setAttribute('data-next-match', getMatchId(round + 1, Math.floor(match / 2)));
                matchWrapper.setAttribute('data-position', match % 2 === 0 ? 'top' : 'bottom');
            }
            
            // Create match inner div
            const matchDiv = document.createElement('div');
            matchDiv.className = 'bracket-match';
            
            // Create match card
            const matchCard = createMatchCard(round, match, teams, roundCount);
            
            // Add to DOM
            matchDiv.appendChild(matchCard);
            matchWrapper.appendChild(matchDiv);
            bracketMatches.appendChild(matchWrapper);
        }
        
        roundDiv.appendChild(bracketMatches);
        bracketContainer.appendChild(roundDiv);
    }
    
    // Draw connector lines
    setTimeout(drawConnectors, 100);
}

/**
 * Create a match card element
 */
function createMatchCard(round, match, teams, totalRounds) {
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';
    matchCard.setAttribute('data-match-id', getMatchId(round, match));
    
    // Match header
    const matchHeader = document.createElement('div');
    matchHeader.className = 'match-header';
    
    const matchId = document.createElement('div');
    matchId.className = 'match-id';
    matchId.textContent = round === totalRounds - 1 ? 'Grand Finals' : `Match ${getMatchId(round, match)}`;
    
    const matchFormat = document.createElement('div');
    matchFormat.className = 'match-format';
    matchFormat.textContent = round === totalRounds - 1 ? 'BO7' : 'BO5';
    
    matchHeader.appendChild(matchId);
    matchHeader.appendChild(matchFormat);
    matchCard.appendChild(matchHeader);
    
    // Team rows
    // For first round, use actual teams
    if (round === 0) {
        const team1Index = match * 2;
        const team2Index = match * 2 + 1;
        
        // Team 1
        if (team1Index < teams.length) {
            const team1Row = createTeamRow(teams[team1Index], 0);
            matchCard.appendChild(team1Row);
        } else {
            const byeRow = createTeamRow({ name: 'BYE', seed: '-' }, 0);
            matchCard.appendChild(byeRow);
        }
        
        // Team 2
        if (team2Index < teams.length) {
            const team2Row = createTeamRow(teams[team2Index], 0);
            matchCard.appendChild(team2Row);
        } else {
            const byeRow = createTeamRow({ name: 'BYE', seed: '-' }, 0);
            matchCard.appendChild(byeRow);
        }
    } else {
        // For later rounds, use placeholders
        const team1Row = createTeamRow({ name: 'TBD', seed: '-' }, 0);
        const team2Row = createTeamRow({ name: 'TBD', seed: '-' }, 0);
        
        matchCard.appendChild(team1Row);
        matchCard.appendChild(team2Row);
    }
    
    // Match footer
    const matchFooter = document.createElement('div');
    matchFooter.className = 'match-footer';
    
    const matchTime = document.createElement('div');
    matchTime.className = 'match-time';
    matchTime.textContent = 'Upcoming';
    
    const matchStatus = document.createElement('div');
    matchStatus.className = 'match-status upcoming';
    matchStatus.textContent = 'Scheduled';
    
    matchFooter.appendChild(matchTime);
    matchFooter.appendChild(matchStatus);
    matchCard.appendChild(matchFooter);
    
    return matchCard;
}

/**
 * Create a team row element
 */
function createTeamRow(team, score) {
    const teamRow = document.createElement('div');
    teamRow.className = 'team-row';
    
    const teamInfo = document.createElement('div');
    teamInfo.className = 'team-info';
    
    const teamSeed = document.createElement('div');
    teamSeed.className = 'team-seed';
    teamSeed.textContent = team.seed || '-';
    
    const teamName = document.createElement('div');
    teamName.className = 'team-name';
    teamName.textContent = team.name || 'TBD';
    
    teamInfo.appendChild(teamSeed);
    teamInfo.appendChild(teamName);
    
    const teamScore = document.createElement('div');
    teamScore.className = 'team-score';
    teamScore.textContent = score || '-';
    
    teamRow.appendChild(teamInfo);
    teamRow.appendChild(teamScore);
    
    return teamRow;
}

/**
 * Generate a unique match ID
 */
function getMatchId(round, match) {
    // For final, use a special ID
    if (round === 0 && match === 0) {
        return 1;
    }
    
    // For other rounds, generate sequential IDs
    let id = 1; // Start from 1
    
    // Add all matches from previous rounds
    for (let r = 0; r < round; r++) {
        id += Math.pow(2, r);
    }
    
    // Add matches from current round
    id += match;
    
    return id;
}

/**
 * Advance a winner to the next round
 */
function advanceWinner(roundIndex, matchIndex, winner, score) {
    // Find the next match
    const currentMatch = document.querySelector(`.bracket-match-wrapper[data-match-id="${getMatchId(roundIndex, matchIndex)}"]`);
    if (!currentMatch) return;
    
    const nextMatchId = currentMatch.getAttribute('data-next-match');
    const position = currentMatch.getAttribute('data-position');
    
    // Find the next match element
    const nextMatch = document.querySelector(`.bracket-match-wrapper[data-match-id="${nextMatchId}"]`);
    if (!nextMatch) return;
    
    // Get team rows in the next match
    const nextMatchCard = nextMatch.querySelector('.match-card');
    const teamRows = nextMatchCard.querySelectorAll('.team-row');
    
    // Determine which team position to update (top or bottom)
    const teamIndex = position === 'top' ? 0 : 1;
    
    // Update team name and score in next match
    if (teamRows[teamIndex]) {
        const teamNameEl = teamRows[teamIndex].querySelector('.team-name');
        const teamSeedEl = teamRows[teamIndex].querySelector('.team-seed');
        
        if (teamNameEl) teamNameEl.textContent = winner.name;
        if (teamSeedEl) teamSeedEl.textContent = winner.seed || '-';
    }
}

/**
 * Update match score and status
 */
function updateMatchScore(matchId, team1Score, team2Score, status = 'completed') {
    // Find the match card
    const matchCard = document.querySelector(`.match-card[data-match-id="${matchId}"]`);
    if (!matchCard) return;
    
    // Get team rows
    const teamRows = matchCard.querySelectorAll('.team-row');
    if (teamRows.length !== 2) return;
    
    // Update scores
    const team1ScoreEl = teamRows[0].querySelector('.team-score');
    const team2ScoreEl = teamRows[1].querySelector('.team-score');
    
    if (team1ScoreEl) team1ScoreEl.textContent = team1Score;
    if (team2ScoreEl) team2ScoreEl.textContent = team2Score;
    
    // Clear previous winner/loser classes
    teamRows.forEach(row => {
        row.classList.remove('winner', 'loser');
    });
    
    // Set winner/loser classes based on scores
    if (team1Score > team2Score) {
        teamRows[0].classList.add('winner');
        teamRows[1].classList.add('loser');
    } else if (team2Score > team1Score) {
        teamRows[0].classList.add('loser');
        teamRows[1].classList.add('winner');
    }
    
    // Update match status
    const matchStatusEl = matchCard.querySelector('.match-status');
    const matchTimeEl = matchCard.querySelector('.match-time');
    
    if (matchStatusEl) {
        matchStatusEl.className = `match-status ${status}`;
        
        // Set status text
        if (status === 'completed') {
            matchStatusEl.textContent = 'Final';
        } else if (status === 'live') {
            matchStatusEl.textContent = 'Live';
        } else {
            matchStatusEl.textContent = 'Upcoming';
        }
    }
    
    if (matchTimeEl) {
        if (status === 'completed') {
            matchTimeEl.textContent = 'Completed';
        } else if (status === 'live') {
            matchTimeEl.textContent = 'In Progress';
        }
    }
    
    // If this is a completed match, and we have a winner, advance to next round
    if (status === 'completed' && (team1Score > team2Score || team2Score > team1Score)) {
        // Get match details
        const matchWrapper = matchCard.closest('.bracket-match-wrapper');
        if (!matchWrapper) return;
        
        const roundIndex = Array.from(document.querySelectorAll('.bracket-round')).findIndex(round => 
            round.contains(matchWrapper)
        );
        
        const matchIndex = Array.from(matchWrapper.parentNode.children).indexOf(matchWrapper);
        
        // Get winner details
        const winnerIndex = team1Score > team2Score ? 0 : 1;
        const winnerNameEl = teamRows[winnerIndex].querySelector('.team-name');
        const winnerSeedEl = teamRows[winnerIndex].querySelector('.team-seed');
        
        const winner = {
            name: winnerNameEl ? winnerNameEl.textContent : 'TBD',
            seed: winnerSeedEl ? winnerSeedEl.textContent : '-',
            score: winnerIndex === 0 ? team1Score : team2Score
        };
        
        // Advance winner to next round
        const nextMatchId = matchWrapper.getAttribute('data-next-match');
        if (nextMatchId) {
            advanceWinner(roundIndex, matchIndex, winner, winnerIndex === 0 ? team1Score : team2Score);
        }
    }
}