/**
 * main.js - Spectre Divide Tournament
 * Main functionality for the tournament site
 */

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    handleDataFilters();
    initTeamSearch();
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
        });
    });
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
            
            // In a real implementation, you would load specific match data based on the ID
            console.log('Loading details for match', matchId);
            
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
}

/**
 * Toggle tournament status
 * (Example function that would be connected to admin controls)
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