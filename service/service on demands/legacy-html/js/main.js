/**
 * Main JavaScript File
 * Handles global interactions and basic mock data initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initMockData();
});

// Handle mobile menu toggle
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Utility function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Initialize mock data in localStorage for demo purposes
function initMockData() {
    if (!localStorage.getItem('services')) {
        const mockServices = [
            { id: 1, name: 'Home Cleaning', category: 'Cleaning', price: 999, rating: 4.8, reviews: 120, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80' },
            { id: 2, name: 'Plumbing Repair', category: 'Plumbing', price: 499, rating: 4.6, reviews: 85, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&q=80' },
            { id: 3, name: 'AC Servicing', category: 'Appliance', price: 799, rating: 4.9, reviews: 210, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&q=80' },
            { id: 4, name: 'Electrical Wiring', category: 'Electrician', price: 399, rating: 4.7, reviews: 150, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80' }
        ];
        localStorage.setItem('services', JSON.stringify(mockServices));
    }
    
    if (!localStorage.getItem('providers')) {
        const mockProviders = [
            { id: 101, name: 'Ravi Kumar', profession: 'Electrician', rating: 4.9, jobsDone: 320, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { id: 102, name: 'Sunil Yadav', profession: 'Plumber', rating: 4.8, jobsDone: 210, image: 'https://randomuser.me/api/portraits/men/44.jpg' },
            { id: 103, name: 'Amit Verma', profession: 'Carpenter', rating: 4.7, jobsDone: 180, image: 'https://randomuser.me/api/portraits/men/68.jpg' }
        ];
        localStorage.setItem('providers', JSON.stringify(mockProviders));
    }
}
