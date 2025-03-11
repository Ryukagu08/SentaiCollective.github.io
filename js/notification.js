/**
 * notification.js - Simple notification system for Spectre Divide Tournament
 */

// Make notification function available globally
window.showNotification = showNotification;

/**
 * Show a notification toast
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (info, success, warning, error)
 */
function showNotification(message, type = 'info') {
    console.log('Notification:', message, 'Type:', type);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
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
    
    return notification;
}