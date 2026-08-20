/**
 * Provider JS
 * Handles provider dashboard logic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Check
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = '../login.html';
        return;
    }
    
    const user = JSON.parse(userStr);
    
    // Only allow providers
    if (user.role !== 'provider') {
        window.location.href = '../index.html';
        return;
    }
    
    // Populate User Data
    document.getElementById('nav-user-name').innerHTML = `<i class="fa-solid fa-user-tie"></i> ${user.name}`;
    
    // Load Provider Data
    loadProviderDashboard(user.id);
});

function loadProviderDashboard(userId) {
    // In a real app, this would filter by provider ID. 
    // For this mock, we'll just show all bookings that don't have a provider assigned or are assigned to this provider.
    
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const providerBookings = allBookings.filter(b => b.providerId === userId || b.providerId === null).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const pendingReqs = providerBookings.filter(b => b.status === 'Confirmed'); // Treat confirmed as pending for provider to accept/start
    const completedReqs = providerBookings.filter(b => b.status === 'Completed');
    
    const totalEarnings = completedReqs.reduce((sum, b) => sum + (b.price), 0); // Price without platform fee
    
    // Update Stats
    document.getElementById('dash-earnings').textContent = `₹${totalEarnings}`;
    document.getElementById('dash-completed').textContent = completedReqs.length;
    document.getElementById('dash-rating').innerHTML = `4.8 <i class="fa-solid fa-star text-accent" style="font-size: 1rem;"></i>`; // Mock rating
    document.getElementById('dash-pending').textContent = pendingReqs.length;
    document.getElementById('job-req-count').textContent = pendingReqs.length;
    
    const container = document.getElementById('job-requests-container');
    if (!container) return;
    
    if (pendingReqs.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body text-center text-muted" style="padding: 3rem 0;">
                    <i class="fa-solid fa-inbox mb-2" style="font-size: 2rem; color: #D1D5DB;"></i>
                    <p>No new job requests at the moment.</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    pendingReqs.forEach(booking => {
        const div = document.createElement('div');
        div.className = 'card mb-4 animate-fade-in';
        div.innerHTML = `
            <div class="card-body">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 style="margin-bottom: 0.25rem;">${booking.serviceName}</h3>
                        <div class="text-muted" style="font-size: 0.875rem;">
                            Booking ID: #${booking.id}
                        </div>
                    </div>
                    <div class="font-bold text-primary" style="font-size: 1.25rem;">
                        ₹${booking.price}
                    </div>
                </div>
                
                <div class="grid md-grid-cols-2 gap-4 mb-4" style="background: var(--bg-color); padding: 1rem; border-radius: var(--radius-md);">
                    <div>
                        <div class="text-muted" style="font-size: 0.75rem;"><i class="fa-regular fa-calendar"></i> Date & Time</div>
                        <div class="font-medium" style="font-size: 0.875rem;">${booking.date} at ${booking.time}</div>
                    </div>
                    <div>
                        <div class="text-muted" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot"></i> Location</div>
                        <div class="font-medium" style="font-size: 0.875rem;">${booking.address.line1}, ${booking.address.city}</div>
                    </div>
                </div>
                
                <div class="flex gap-4">
                    <button class="btn btn-outline" style="flex: 1;" onclick="updateBookingStatus('${booking.id}', 'Cancelled')">Decline</button>
                    <button class="btn btn-primary" style="flex: 1; background: #10B981; border-color: #10B981;" onclick="updateBookingStatus('${booking.id}', 'Completed')">Mark Completed</button>
                </div>
            </div>
        `;
        
        container.appendChild(div);
    });
}

function updateBookingStatus(bookingId, status) {
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const index = allBookings.findIndex(b => b.id === bookingId);
    
    if (index > -1) {
        allBookings[index].status = status;
        
        // If completed, add earnings to provider wallet (mock)
        if (status === 'Completed') {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            user.balance = (user.balance || 0) + allBookings[index].price;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const uIndex = users.findIndex(u => u.id === user.id);
            if(uIndex > -1) {
                users[uIndex] = user;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
        localStorage.setItem('bookings', JSON.stringify(allBookings));
        location.reload(); // Quick refresh to update UI
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}
