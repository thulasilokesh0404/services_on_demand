import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import ServiceCard from '../components/ServiceCard';
import { useSearchParams } from 'react-router-dom';

const Services = () => {
    const { services } = useData();
    const [searchParams] = useSearchParams();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState(2000);
    const [selectedCategories, setSelectedCategories] = useState(
        searchParams.get('category') ? [searchParams.get('category')] : []
    );
    const [sortBy, setSortBy] = useState('recommended');

    const handleCategoryChange = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const filteredServices = useMemo(() => {
        let result = services.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  service.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = service.price <= priceRange;
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category);
            
            return matchesSearch && matchesPrice && matchesCategory;
        });

        if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [services, searchTerm, priceRange, selectedCategories, sortBy]);

    return (
        <>
            <div className="bg-primary-light py-16 text-center">
                <div className="container">
                    <h1 className="text-4xl font-bold mb-2">Our Services</h1>
                    <p className="text-gray-500">Find and book exactly what you need.</p>
                </div>
            </div>

            <main className="container py-16">
                <div className="grid md-grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                        <h3 className="mb-4 text-xl font-bold">Filters</h3>
                        
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Categories</h4>
                            {['Cleaning', 'Plumbing', 'Appliance', 'Electrician', 'Carpentry', 'Painting'].map(cat => (
                                <label key={cat} className="flex items-center gap-2 mb-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => handleCategoryChange(cat)}
                                    /> 
                                    {cat}
                                </label>
                            ))}
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Max Price</h4>
                            <input 
                                type="range" 
                                min="0" max="2000" 
                                value={priceRange} 
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                                <span>₹0</span>
                                <span>₹{priceRange}</span>
                            </div>
                        </div>
                    </aside>
                    
                    {/* Main Content */}
                    <div className="md-col-span-3" style={{ gridColumn: 'span 3' }}>
                        <div className="flex gap-4 mb-8">
                            <input 
                                type="text" 
                                className="form-control flex-1" 
                                placeholder="Search for a service..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-primary px-6"><i className="fa-solid fa-magnifying-glass"></i></button>
                        </div>
                        
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{filteredServices.length} Services Found</h2>
                            <select 
                                className="form-control w-auto"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="recommended">Recommended</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                        
                        {filteredServices.length === 0 ? (
                            <div className="text-center py-16">
                                <i className="fa-solid fa-magnifying-glass text-5xl text-gray-300 mb-4"></i>
                                <h3 className="text-gray-600 text-xl">No services found matching your criteria.</h3>
                                <button 
                                    className="btn btn-outline mt-4"
                                    onClick={() => { setSearchTerm(''); setPriceRange(2000); setSelectedCategories([]); }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid md-grid-cols-2 xl-grid-cols-3 gap-6">
                                {filteredServices.map(service => (
                                    <ServiceCard key={service.id} service={service} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Services;
