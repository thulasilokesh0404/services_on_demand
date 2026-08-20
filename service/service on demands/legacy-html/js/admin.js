/**
 * Admin JS
 * Handles admin dashboard logic and platform management
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Check
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = '../login.html';
        return;
    }
    
    const user = JSON.parse(userStr);
    
    // Only allow admins. For demo purposes, we might let anyone who selects admin role through.
    if (user.role !== 'admin') {
        // If not admin, just warn and redirect (or we can just let them view it for demo)
        console.warn('User is not admin. Allowing view for demo purposes.');
        // window.location.href = '../index.html'; 
    }
    
    document.getElementById('nav-user-name').innerHTML = `<i class="fa-solid fa-user-shield"></i> ${user.name}`;
    
    loadAdminDashboard();
});

function loadAdminDashboard() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    const customers = users.filter(u => u.role === 'customer');
    const providers = users.filter(u => u.role === 'provider');
    
    // Stats
    document.getElementById('admin-users').textContent = customers.length;
    document.getElementById('admin-providers').textContent = providers.length;
    document.getElementById('admin-bookings').textContent = bookings.length;
    
    // Calculate Revenue (Assuming 50 platform fee per booking as set in booking.js)
    const revenue = bookings.length * 50;
    document.getElementById('admin-revenue').textContent = `₹${revenue}`;
    
    // Activity Table
    const tbody = document.getElementById('admin-activity-table');
    if (!tbody) return;
    
    if (bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No activity yet.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = '';
    
    // Show latest 10 bookings
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10).forEach(booking => {
        const customer = users.find(u => u.id === booking.userId);
        const customerName = customer ? customer.name : 'Unknown User';
        
        let statusClass = 'status-pending';
        if (booking.status === 'Confirmed') statusClass = 'status-confirmed';
        if (booking.status === 'Completed') statusClass = 'status-completed';
        if (booking.status === 'Cancelled') statusClass = 'status-cancelled';
        
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border-color)';
        tr.innerHTML = `
            <td style="padding: 1rem; font-weight: 500;">#${booking.id}</td>
            <td style="padding: 1rem;">${booking.serviceName}</td>
            <td style="padding: 1rem;">${customerName}</td>
            <td style="padding: 1rem; font-weight: 600; color: var(--text-main);">₹${booking.total}</td>
            <td style="padding: 1rem;">
                <span class="status-badge ${statusClass}">${booking.status}</span>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function initMockData(forceReset = false) {
    if (forceReset) {
        if(confirm('Are you sure you want to reset all mock data?')) {
            localStorage.clear();
            
            // Setup Admin
            const adminUser = {
                id: 1,
                name: 'System Admin',
                email: 'admin@servicehub.com',
                password: 'admin',
                role: 'admin'
            };
            localStorage.setItem('users', JSON.stringify([adminUser]));
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            
            // Will re-initialize services and providers on page load via main.js logic if called
            alert('Data reset successfully. Reloading...');
            location.reload();
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}
