/**
 * bracket-preset.js - Spectre Divide Tournament
 * Performance-optimized bracket system using presets
 */

// Make functions available globally
window.generateBracket = generateBracket;
window.updateMatchScore = updateMatchScore;

// Draggable bracket state
const dragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0,
    lastTranslateX: 0,
    lastTranslateY: 0,
    scale: 1.0,
    minScale: 0.5,
    maxScale: 2.0
};

// Bracket presets definitions
const bracketPresets = {
    // 4 teams - single elimination
    '4-single': {
        rounds: 2,
        matchPositions: [
            // Semifinals
            { round: 0, match: 0, x: 50, y: 100 },
            { round: 0, match: 1, x: 50, y: 300 },
            // Finals
            { round: 1, match: 0, x: 400, y: 200 }
        ],
        connectorSVG: `<svg width="100%" height="100%" class="preset-connector-svg">
            <path d="M 200 125 H 300 V 200 H 400" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 325 H 300 V 200 H 400" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <defs>
                <filter id="glow-filter">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.97 0 0 0 0 0.24 0 0 0 0 0.44 0 0 0 0.5 0" />
                </filter>
            </defs>
        </svg>`
    },
    
    // 8 teams - single elimination
    '8-single': {
        rounds: 3,
        matchPositions: [
            // Quarterfinals
            { round: 0, match: 0, x: 50, y: 50 },
            { round: 0, match: 1, x: 50, y: 150 },
            { round: 0, match: 2, x: 50, y: 250 },
            { round: 0, match: 3, x: 50, y: 350 },
            // Semifinals
            { round: 1, match: 0, x: 400, y: 100 },
            { round: 1, match: 1, x: 400, y: 300 },
            // Finals
            { round: 2, match: 0, x: 750, y: 200 }
        ],
        connectorSVG: `<svg width="100%" height="100%" class="preset-connector-svg">
            <!-- Quarterfinals to Semifinals -->
            <path d="M 200 75 H 300 V 100 H 400" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 175 H 300 V 100 H 400" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 275 H 300 V 300 H 400" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 375 H 300 V 300 H 400" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            
            <!-- Semifinals to Finals -->
            <path d="M 550 125 H 650 V 200 H 750" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 550 325 H 650 V 200 H 750" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            
            <defs>
                <filter id="glow-filter">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.97 0 0 0 0 0.24 0 0 0 0 0.44 0 0 0 0.5 0" />
                </filter>
            </defs>
        </svg>`
    },
    
    // 16 teams - single elimination
    '16-single': {
        rounds: 4,
        matchPositions: [
            // Round 1 (16 teams = 8 matches)
            { round: 0, match: 0, x: 50, y: 25 },
            { round: 0, match: 1, x: 50, y: 75 },
            { round: 0, match: 2, x: 50, y: 125 },
            { round: 0, match: 3, x: 50, y: 175 },
            { round: 0, match: 4, x: 50, y: 225 },
            { round: 0, match: 5, x: 50, y: 275 },
            { round: 0, match: 6, x: 50, y: 325 },
            { round: 0, match: 7, x: 50, y: 375 },
            // Round 2 (8 teams = 4 matches)
            { round: 1, match: 0, x: 350, y: 50 },
            { round: 1, match: 1, x: 350, y: 150 },
            { round: 1, match: 2, x: 350, y: 250 },
            { round: 1, match: 3, x: 350, y: 350 },
            // Semifinals
            { round: 2, match: 0, x: 650, y: 100 },
            { round: 2, match: 1, x: 650, y: 300 },
            // Finals
            { round: 3, match: 0, x: 950, y: 200 }
        ],
        connectorSVG: `<svg width="100%" height="100%" class="preset-connector-svg">
            <!-- Round 1 to Round 2 (top half) -->
            <path d="M 200 37.5 H 275 V 50 H 350" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 87.5 H 275 V 50 H 350" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 137.5 H 275 V 150 H 350" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 187.5 H 275 V 150 H 350" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            
            <!-- Round 1 to Round 2 (bottom half) -->
            <path d="M 200 237.5 H 275 V 250 H 350" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 287.5 H 275 V 250 H 350" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 337.5 H 275 V 350 H 350" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 200 387.5 H 275 V 350 H 350" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            
            <!-- Round 2 to Semifinals -->
            <path d="M 500 62.5 H 575 V 100 H 650" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 500 162.5 H 575 V 100 H 650" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 500 262.5 H 575 V 300 H 650" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 500 362.5 H 575 V 300 H 650" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            
            <!-- Semifinals to Finals -->
            <path d="M 800 125 H 875 V 200 H 950" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            <path d="M 800 325 H 875 V 200 H 950" stroke="rgba(247, 61, 114, 0.7)" stroke-width="2" fill="none" filter="url(#glow-filter)" />
            
            <defs>
                <filter id="glow-filter">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.97 0 0 0 0 0.24 0 0 0 0 0.44 0 0 0 0.5 0" />
                </filter>
            </defs>
        </svg>`
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Bracket preset system loaded');
    
    // Initialize draggable bracket
    initDraggableBracket();
    
    // Set up match click handlers
    setupMatchClicks();
    
    // Set up zoom controls
    setupZoomControls();
});

/**
 * Initialize draggable bracket functionality
 */
function initDraggableBracket() {
    console.log('Initializing draggable bracket');
    
    const bracketContainer = document.querySelector('.bracket-container');
    const bracket = document.querySelector('.bracket');
    
    if (!bracketContainer || !bracket) {
        console.warn('Bracket container or bracket not found');
        return;
    }
    
    // Add draggable class and hint
    bracketContainer.classList.add('draggable-container');
    
    // Create and add a drag hint element if it doesn't exist
    if (!bracketContainer.querySelector('.drag-hint')) {
        const dragHint = document.createElement('div');
        dragHint.className = 'drag-hint';
        dragHint.textContent = 'Drag to move • Pinch/scroll to zoom';
        bracketContainer.appendChild(dragHint);
    }
    
    // Set initial transform
    resetBracketPosition(bracket);
    
    // Touch events for mobile
    bracket.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);
    
    // Mouse events for desktop
    bracket.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    // Wheel event for zoom
    bracketContainer.addEventListener('wheel', handleZoom, { passive: false });
    
    // Double-tap/click to reset
    bracket.addEventListener('dblclick', function(e) {
        e.preventDefault();
        resetBracketPosition(bracket);
    });
    
    // Add pinch zoom for mobile
    let initialDistance = 0;
    bracket.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            initialDistance = getTouchDistance(e.touches);
        }
    });
    
    bracket.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getTouchDistance(e.touches);
            const scaleChange = currentDistance / initialDistance;
            
            // Adjust scale within bounds
            const newScale = dragState.scale * scaleChange;
            if (newScale >= dragState.minScale && newScale <= dragState.maxScale) {
                dragState.scale = newScale;
                initialDistance = currentDistance;
                updateBracketTransform(bracket);
            }
        }
    });
    
    console.log('Draggable bracket initialized');
}

/**
 * Set up zoom controls
 */
function setupZoomControls() {
    const bracketContainer = document.querySelector('.bracket-container');
    if (!bracketContainer) return;
    
    const zoomControls = bracketContainer.querySelector('.zoom-controls');
    if (!zoomControls) return;
    
    const zoomInBtn = zoomControls.querySelector('.zoom-in');
    const zoomOutBtn = zoomControls.querySelector('.zoom-out');
    const resetBtn = zoomControls.querySelector('.zoom-reset');
    const bracket = document.querySelector('.bracket');
    
    if (zoomInBtn && zoomOutBtn && resetBtn && bracket) {
        zoomInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const newScale = Math.min(dragState.scale + 0.2, dragState.maxScale);
            
            if (newScale !== dragState.scale) {
                dragState.scale = newScale;
                updateBracketTransform(bracket);
            }
        });
        
        zoomOutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const newScale = Math.max(dragState.scale - 0.2, dragState.minScale);
            
            if (newScale !== dragState.scale) {
                dragState.scale = newScale;
                updateBracketTransform(bracket);
            }
        });
        
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetBracketPosition(bracket);
        });
    }
}

/**
 * Calculate distance between two touch points
 */
function getTouchDistance(touches) {
    return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );
}

/**
 * Handle drag start event
 */
function handleDragStart(e) {
    e.preventDefault();
    
    // Get the bracket element
    const bracket = document.querySelector('.bracket');
    if (!bracket) return;
    
    dragState.isDragging = true;
    
    // Set cursor style
    bracket.style.cursor = 'grabbing';
    
    // Get start coordinates
    if (e.type === 'touchstart') {
        dragState.startX = e.touches[0].clientX;
        dragState.startY = e.touches[0].clientY;
    } else {
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
    }
    
    // Store the current translation
    dragState.lastTranslateX = dragState.translateX;
    dragState.lastTranslateY = dragState.translateY;
}

/**
 * Handle drag move event
 */
function handleDragMove(e) {
    if (!dragState.isDragging) return;
    
    e.preventDefault();
    
    const bracket = document.querySelector('.bracket');
    if (!bracket) return;
    
    let currentX, currentY;
    
    if (e.type === 'touchmove') {
        // Ensure we're only handling single-touch drags here
        if (e.touches.length !== 1) return;
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
    } else {
        currentX = e.clientX;
        currentY = e.clientY;
    }
    
    // Calculate how far the pointer has moved
    const deltaX = currentX - dragState.startX;
    const deltaY = currentY - dragState.startY;
    
    // Update the translation
    dragState.translateX = dragState.lastTranslateX + deltaX;
    dragState.translateY = dragState.lastTranslateY + deltaY;
    
    // Apply the transform
    updateBracketTransform(bracket);
}

/**
 * Handle drag end event
 */
function handleDragEnd(e) {
    if (!dragState.isDragging) return;
    
    const bracket = document.querySelector('.bracket');
    if (!bracket) return;
    
    dragState.isDragging = false;
    
    // Reset cursor
    bracket.style.cursor = 'grab';
    
    // Apply and persist the final position
    updateBracketTransform(bracket);
}

/**
 * Handle zoom via mouse wheel
 */
function handleZoom(e) {
    e.preventDefault();
    
    const bracket = document.querySelector('.bracket');
    if (!bracket) return;
    
    // Calculate zoom direction based on wheel delta
    const delta = -Math.sign(e.deltaY) * 0.1;
    const newScale = Math.max(
        dragState.minScale,
        Math.min(dragState.maxScale, dragState.scale + delta)
    );
    
    // Only update if the scale has changed
    if (newScale !== dragState.scale) {
        dragState.scale = newScale;
        updateBracketTransform(bracket);
    }
}

/**
 * Update bracket transform based on current drag state
 */
function updateBracketTransform(bracket) {
    bracket.style.transform = `translate(${dragState.translateX}px, ${dragState.translateY}px) scale(${dragState.scale})`;
    bracket.style.transformOrigin = 'center';
}

/**
 * Reset bracket position to default
 */
function resetBracketPosition(bracket) {
    dragState.translateX = 0;
    dragState.translateY = 0;
    dragState.lastTranslateX = 0;
    dragState.lastTranslateY = 0;
    dragState.scale = 1.0;
    
    updateBracketTransform(bracket);
}

/**
 * Get preset key based on team count and format
 */
function getPresetKey(teamCount, format) {
    // Normalize team count to nearest power of 2
    let normalizedCount = 4;
    if (teamCount > 4 && teamCount <= 8) normalizedCount = 8;
    if (teamCount > 8 && teamCount <= 16) normalizedCount = 16;
    if (teamCount > 16) normalizedCount = 16; // Max supported is 16 teams
    
    const key = `${normalizedCount}-${format}`;
    
    // Check if preset exists
    if (bracketPresets[key]) {
        return key;
    }
    
    // Fallback to single elimination
    return `${normalizedCount}-single`;
}

/**
 * Setup match click handlers
 */
function setupMatchClicks() {
    console.log('Setting up match click handlers');
    
    // Use event delegation for better performance
    document.addEventListener('click', function(e) {
        // Only process if not dragging
        if (dragState.isDragging) return;
        
        // Check if a match card was clicked
        const matchCard = e.target.closest('.match-card');
        if (!matchCard) return;
        
        console.log('Match card clicked:', matchCard.getAttribute('data-match-id'));
        
        // Get match ID
        const matchId = matchCard.getAttribute('data-match-id');
        
        // Load match details (if we're on the public view)
        if (typeof loadMatchDetails === 'function') {
            loadMatchDetails(matchId);
            
            // Scroll to the match details section
            const matchDetails = document.querySelector('.match-details');
            if (matchDetails) {
                matchDetails.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Highlight this match
        matchCard.classList.add('match-highlight');
        setTimeout(() => {
            matchCard.classList.remove('match-highlight');
        }, 3000);
        
        e.stopPropagation(); // Prevent the event from bubbling
    });
}

/**
 * Generate a tournament bracket based on teams
 * @param {Array} teams - Array of team objects
 * @param {string} format - Tournament format (single, double, etc.)
 */
function generateBracket(teams, format = 'single') {
    console.log('Generating bracket for', teams.length, 'teams with format:', format);
    
    // Validate teams
    if (!teams || teams.length < 2) {
        console.error('Not enough teams to generate a bracket');
        return;
    }
    
    // Get bracket container
    const bracketContainer = document.querySelector('.bracket-container');
    const bracket = document.querySelector('.bracket');
    if (!bracketContainer || !bracket) {
        console.error('Bracket container or bracket not found');
        return;
    }
    
    // Clear existing bracket
    bracket.innerHTML = '';
    
    // Get the appropriate preset
    const presetKey = getPresetKey(teams.length, format);
    const preset = bracketPresets[presetKey];
    
    if (!preset) {
        console.error('No preset found for', teams.length, 'teams in', format, 'format');
        return;
    }
    
    console.log(`Using preset: ${presetKey} with ${preset.rounds} rounds`);
    
    // Create the tournament structure container
    const structureDiv = document.createElement('div');
    structureDiv.className = 'tournament-structure';
    
    // Add the connector SVG (pre-defined in the preset)
    const connectorContainer = document.createElement('div');
    connectorContainer.className = 'connector-container';
    connectorContainer.innerHTML = preset.connectorSVG;
    structureDiv.appendChild(connectorContainer);
    
    // Get the match positions from the preset
    const matchPositions = preset.matchPositions;
    
    // Create matches based on preset positions
    matchPositions.forEach((position, index) => {
        const round = position.round;
        const match = position.match;
        
        // Create match card
        const matchCardDiv = document.createElement('div');
        matchCardDiv.className = 'match-card preset-match';
        matchCardDiv.setAttribute('data-match-id', getMatchId(round, match));
        
        // Position the match card
        matchCardDiv.style.position = 'absolute';
        matchCardDiv.style.left = `${position.x}px`;
        matchCardDiv.style.top = `${position.y}px`;
        
        // Match header
        const matchHeader = document.createElement('div');
        matchHeader.className = 'match-header';
        
        const matchId = document.createElement('div');
        matchId.className = 'match-id';
        
        // Set appropriate match title based on round and tournament structure
        if (round === preset.rounds - 1) {
            matchId.textContent = 'Grand Finals';
        } else if (round === preset.rounds - 2) {
            matchId.textContent = `Semifinal ${match + 1}`;
        } else if (round === preset.rounds - 3) {
            matchId.textContent = `Quarterfinal ${match + 1}`;
        } else {
            matchId.textContent = `Match ${getMatchId(round, match)}`;
        }
        
        const matchFormat = document.createElement('div');
        matchFormat.className = 'match-format';
        matchFormat.textContent = round === preset.rounds - 1 ? 'BO7' : 'BO5';
        
        matchHeader.appendChild(matchId);
        matchHeader.appendChild(matchFormat);
        matchCardDiv.appendChild(matchHeader);
        
        // Team rows
        // For first round, use actual teams
        if (round === 0) {
            const team1Index = match * 2;
            const team2Index = match * 2 + 1;
            
            // Team 1
            if (team1Index < teams.length) {
                const team1Row = createTeamRow(teams[team1Index], 0);
                matchCardDiv.appendChild(team1Row);
            } else {
                const byeRow = createTeamRow({ name: 'BYE', seed: '-' }, 0);
                matchCardDiv.appendChild(byeRow);
            }
            
            // Team 2
            if (team2Index < teams.length) {
                const team2Row = createTeamRow(teams[team2Index], 0);
                matchCardDiv.appendChild(team2Row);
            } else {
                const byeRow = createTeamRow({ name: 'BYE', seed: '-' }, 0);
                matchCardDiv.appendChild(byeRow);
            }
        } else {
            // For later rounds, use placeholders
            const team1Row = createTeamRow({ name: 'TBD', seed: '-' }, 0);
            const team2Row = createTeamRow({ name: 'TBD', seed: '-' }, 0);
            
            matchCardDiv.appendChild(team1Row);
            matchCardDiv.appendChild(team2Row);
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
        matchCardDiv.appendChild(matchFooter);
        
        // Store next match relationship in data attributes for winner advancement
        if (round < preset.rounds - 1) {
            const nextMatch = Math.floor(match / 2);
            matchCardDiv.setAttribute('data-next-match', getMatchId(round + 1, nextMatch));
            matchCardDiv.setAttribute('data-position', match % 2 === 0 ? 'top' : 'bottom');
        }
        
        // Add match card to structure
        structureDiv.appendChild(matchCardDiv);
    });
    
    // Add the structure to the bracket
    bracket.appendChild(structureDiv);
    
    // Initialize draggable functionality
    initDraggableBracket();
    
    // Setup match click handlers
    setupMatchClicks();
    
    // Set up zoom controls
    setupZoomControls();
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
    if (round === 0 && match === 0 && match === 0) {
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
 * Update match score and status
 */
function updateMatchScore(matchId, team1Score, team2Score, status = 'completed') {
    console.log(`Updating match ${matchId} score: ${team1Score}-${team2Score}, status: ${status}`);
    
    // Find the match card
    const matchCard = document.querySelector(`.match-card[data-match-id="${matchId}"]`);
    if (!matchCard) {
        console.warn(`Match card ${matchId} not found`);
        return;
    }
    
    // Get team rows
    const teamRows = matchCard.querySelectorAll('.team-row');
    if (teamRows.length !== 2) {
        console.warn(`Expected 2 team rows, found ${teamRows.length}`);
        return;
    }
    
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
    
    // If this is a completed match with a winner, advance to next round
    if (status === 'completed' && (team1Score > team2Score || team2Score > team1Score)) {
        // Get next match ID from data attribute
        const nextMatchId = matchCard.getAttribute('data-next-match');
        if (!nextMatchId) return;
        
        // Get position from data attribute
        const position = matchCard.getAttribute('data-position');
        if (!position) return;
        
        // Get winner details
        const winnerIndex = team1Score > team2Score ? 0 : 1;
        const winnerNameEl = teamRows[winnerIndex].querySelector('.team-name');
        const winnerSeedEl = teamRows[winnerIndex].querySelector('.team-seed');
        
        if (!winnerNameEl || !winnerSeedEl) return;
        
        const winner = {
            name: winnerNameEl.textContent,
            seed: winnerSeedEl.textContent
        };
        
        // Find next match
        const nextMatchCard = document.querySelector(`.match-card[data-match-id="${nextMatchId}"]`);
        if (!nextMatchCard) return;
        
        // Update next match with winner
        const nextMatchTeamRows = nextMatchCard.querySelectorAll('.team-row');
        if (nextMatchTeamRows.length !== 2) return;
        
        // Determine which team position to update (top or bottom)
        const teamIndex = position === 'top' ? 0 : 1;
        
        // Update team name and seed in next match
        const teamNameEl = nextMatchTeamRows[teamIndex].querySelector('.team-name');
        const teamSeedEl = nextMatchTeamRows[teamIndex].querySelector('.team-seed');
        
        if (teamNameEl) teamNameEl.textContent = winner.name;
        if (teamSeedEl) teamSeedEl.textContent = winner.seed;
    }
}