/**
 * Customer JS
 * Handles customer dashboard logic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Check
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = '../login.html';
        return;
    }
    
    const user = JSON.parse(userStr);
    
    // Only allow customers
    if (user.role !== 'customer') {
        window.location.href = '../index.html';
        return;
    }
    
    // Populate User Data
    document.getElementById('nav-user-name').innerHTML = `<i class="fa-solid fa-user"></i> ${user.name}`;
    document.getElementById('dash-user-name').textContent = user.name.split(' ')[0]; // First name
    document.getElementById('dash-wallet-balance').textContent = `₹${user.balance || 0}`;
    
    // Load Bookings
    loadBookings(user.id);
});

function loadBookings(userId) {
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = allBookings.filter(b => b.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const container = document.getElementById('recent-bookings-container');
    if (!container) return;
    
    if (userBookings.length === 0) {
        // Leave the empty state
        return;
    }
    
    container.innerHTML = '';
    
    // Show only top 3 on dashboard
    userBookings.slice(0, 3).forEach(booking => {
        let statusClass = 'status-pending';
        if (booking.status === 'Confirmed') statusClass = 'status-confirmed';
        if (booking.status === 'Completed') statusClass = 'status-completed';
        if (booking.status === 'Cancelled') statusClass = 'status-cancelled';
        
        const div = document.createElement('div');
        div.className = 'booking-list-item animate-fade-in';
        div.innerHTML = `
            <div class="booking-info">
                <div class="booking-icon">
                    <i class="fa-solid fa-toolbox"></i>
                </div>
                <div>
                    <h4 style="margin-bottom: 0.25rem;">${booking.serviceName}</h4>
                    <div class="text-muted" style="font-size: 0.875rem;">
                        <i class="fa-regular fa-calendar mr-1"></i> ${booking.date} at ${booking.time}
                    </div>
                </div>
            </div>
            <div style="text-align: right;">
                <div class="font-bold mb-1">₹${booking.total}</div>
                <span class="status-badge ${statusClass}">${booking.status}</span>
            </div>
        `;
        
        container.appendChild(div);
    });
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}
