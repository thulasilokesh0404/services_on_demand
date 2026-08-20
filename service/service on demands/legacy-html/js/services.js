/**
 * Services JS
 * Handles filtering, sorting and displaying services
 */

document.addEventListener('DOMContentLoaded', () => {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return; // Only run on services page

    let allServices = JSON.parse(localStorage.getItem('services') || '[]');
    let currentServices = [...allServices];
    
    // UI Elements
    const searchInput = document.getElementById('search-input');
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const sortSelect = document.getElementById('sort-select');
    const resultsCount = document.getElementById('results-count');

    // Initial Render
    renderServices(currentServices);

    // Event Listeners
    if(searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    if(priceRange) {
        priceRange.addEventListener('input', (e) => {
            priceDisplay.textContent = `₹${e.target.value}`;
            applyFilters();
        });
    }

    categoryFilters.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    if(sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const maxPrice = priceRange ? parseInt(priceRange.value) : 10000;
        
        const selectedCategories = Array.from(categoryFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        currentServices = allServices.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm) || 
                                  service.category.toLowerCase().includes(searchTerm);
            const matchesPrice = service.price <= maxPrice;
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category);
            
            return matchesSearch && matchesPrice && matchesCategory;
        });

        // Sorting
        const sortValue = sortSelect ? sortSelect.value : 'recommended';
        if (sortValue === 'price-low') {
            currentServices.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-high') {
            currentServices.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'rating') {
            currentServices.sort((a, b) => b.rating - a.rating);
        }

        renderServices(currentServices);
    }

    function renderServices(services) {
        if(resultsCount) {
            resultsCount.textContent = `${services.length} Service${services.length !== 1 ? 's' : ''} Found`;
        }
        
        if (services.length === 0) {
            servicesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: #D1D5DB; margin-bottom: 1rem;"></i>
                    <h3 style="color: #4B5563;">No services found matching your criteria.</h3>
                    <button class="btn btn-outline mt-4" onclick="document.getElementById('search-input').value=''; document.querySelectorAll('.category-filter').forEach(c=>c.checked=false); document.getElementById('price-range').value=2000; document.getElementById('price-range').dispatchEvent(new Event('input'));">Clear Filters</button>
                </div>
            `;
            return;
        }

        servicesGrid.innerHTML = '';
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'card service-card animate-fade-in';
            card.innerHTML = `
                <img src="${service.image}" alt="${service.name}" class="service-img">
                <div class="service-content">
                    <div class="flex justify-between items-center mb-2">
                        <span class="badge badge-primary" style="font-size: 0.75rem;">${service.category}</span>
                        <span style="font-size: 0.875rem; color: #4B5563;"><i class="fa-solid fa-star" style="color: #F59E0B"></i> ${service.rating} (${service.reviews})</span>
                    </div>
                    <h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;"><a href="service-details.html?id=${service.id}" style="color: inherit;">${service.name}</a></h3>
                    <div style="flex: 1;"></div>
                    <div class="flex justify-between items-center mt-4 pt-4" style="border-top: 1px solid #E5E7EB;">
                        <span class="font-bold text-primary" style="font-size: 1.25rem;">₹${service.price}</span>
                        <a href="service-details.html?id=${service.id}" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Book Now</a>
                    </div>
                </div>
            `;
            servicesGrid.appendChild(card);
        });
    }
});
