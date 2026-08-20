/**
 * Booking JS
 * Handles multi-step booking logic
 */

let currentStep = 1;
let currentBookingData = null;

document.addEventListener('DOMContentLoaded', () => {
    // Only run on booking page
    if (!document.getElementById('section-1')) return;
    
    // Check if user is logged in
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(userStr);
    
    // Pre-fill user data
    const nameInput = document.getElementById('b-name');
    if(nameInput) nameInput.value = user.name;
    
    // Update wallet display
    const walletDisplay = document.getElementById('wallet-balance-display');
    if(walletDisplay) walletDisplay.textContent = `Balance: ₹${user.balance || 0}`;

    // Load booking data from session storage
    const bookingStr = sessionStorage.getItem('currentBooking');
    if (!bookingStr) {
        alert('No service selected.');
        window.location.href = 'services.html';
        return;
    }
    
    currentBookingData = JSON.parse(bookingStr);
    
    // Initialize summary
    document.getElementById('summary-service').textContent = currentBookingData.serviceName;
    document.getElementById('summary-price').textContent = `₹${currentBookingData.price}`;
    document.getElementById('summary-total').textContent = `₹${currentBookingData.price + 50}`; // +50 platform fee
    
    if (currentBookingData.providerId) {
        const providers = JSON.parse(localStorage.getItem('providers') || '[]');
        const p = providers.find(x => x.id === currentBookingData.providerId);
        if(p) document.getElementById('summary-provider').textContent = `Provider: ${p.name}`;
    }
    
    initDateSelectors();
    initTimeSelectors();
});

function initDateSelectors() {
    const container = document.getElementById('date-selector');
    if (!container) return;
    
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        
        const dateStr = `${d.getDate()} ${months[d.getMonth()]}`;
        const dayStr = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()];
        
        const div = document.createElement('div');
        div.className = `selector-item ${i === 0 ? 'selected' : ''}`;
        div.innerHTML = `
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">${dayStr}</div>
            <div style="font-weight: 600;">${dateStr}</div>
        `;
        
        if(i === 0) {
            currentBookingData.date = `${dateStr} ${d.getFullYear()}`;
        }
        
        div.addEventListener('click', () => {
            document.querySelectorAll('#date-selector .selector-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            currentBookingData.date = `${dateStr} ${d.getFullYear()}`;
            updateSummaryDateTime();
        });
        
        container.appendChild(div);
    }
}

function initTimeSelectors() {
    const container = document.getElementById('time-selector');
    if (!container) return;
    
    const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM', '06:00 PM'];
    
    times.forEach((time, index) => {
        const div = document.createElement('div');
        div.className = 'selector-item';
        div.innerHTML = `<div style="font-weight: 600;">${time}</div>`;
        
        div.addEventListener('click', () => {
            document.querySelectorAll('#time-selector .selector-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            currentBookingData.time = time;
            updateSummaryDateTime();
        });
        
        container.appendChild(div);
    });
}

function updateSummaryDateTime() {
    const container = document.getElementById('summary-datetime-container');
    const dateEl = document.getElementById('summary-date');
    const timeEl = document.getElementById('summary-time');
    
    if (currentBookingData.date && currentBookingData.time) {
        container.style.display = 'flex';
        dateEl.textContent = currentBookingData.date;
        timeEl.textContent = currentBookingData.time;
    }
}

function nextStep(step) {
    // Validation
    if (step === 2) {
        if (!currentBookingData.date || !currentBookingData.time) {
            alert('Please select both date and time.');
            return;
        }
    } else if (step === 3) {
        const name = document.getElementById('b-name').value;
        const phone = document.getElementById('b-phone').value;
        const address = document.getElementById('b-address').value;
        const city = document.getElementById('b-city').value;
        const pincode = document.getElementById('b-pincode').value;
        
        if (!name || !phone || !address || !city || !pincode) {
            alert('Please fill in all address fields.');
            return;
        }
        
        currentBookingData.address = { line1: address, city, pincode, phone };
    }
    
    // UI Update
    document.querySelectorAll('.booking-section').forEach(el => el.classList.remove('active'));
    document.getElementById(`section-${step}`).classList.add('active');
    
    document.getElementById(`step-${currentStep}-indicator`).classList.remove('active');
    document.getElementById(`step-${currentStep}-indicator`).classList.add('completed');
    document.getElementById(`step-${step}-indicator`).classList.add('active');
    
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    document.querySelectorAll('.booking-section').forEach(el => el.classList.remove('active'));
    document.getElementById(`section-${step}`).classList.add('active');
    
    document.getElementById(`step-${currentStep}-indicator`).classList.remove('active');
    document.getElementById(`step-${step}-indicator`).classList.remove('completed');
    document.getElementById(`step-${step}-indicator`).classList.add('active');
    
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function confirmBooking() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const totalAmount = currentBookingData.price + 50;
    
    if (paymentMethod === 'wallet') {
        if (user.balance < totalAmount) {
            alert('Insufficient wallet balance. Please choose another payment method or top up.');
            return;
        }
        user.balance -= totalAmount;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update user in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const uIndex = users.findIndex(u => u.id === user.id);
        if(uIndex > -1) {
            users[uIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
    
    // Save booking
    const booking = {
        id: 'SH' + Math.floor(10000 + Math.random() * 90000),
        userId: user.id,
        ...currentBookingData,
        total: totalAmount,
        paymentMethod,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
    };
    
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    allBookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(allBookings));
    
    // Clean up and redirect
    sessionStorage.removeItem('currentBooking');
    sessionStorage.setItem('lastBooking', JSON.stringify(booking));
    
    window.location.href = 'booking-success.html';
}
