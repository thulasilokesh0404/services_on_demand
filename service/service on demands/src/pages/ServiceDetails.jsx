import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { services, providers } = useData();
    const { user } = useAuth();
    
    const [service, setService] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(() => {
        const found = services.find(s => s.id === parseInt(id));
        if (found) {
            setService(found);
        } else {
            navigate('/services');
        }
    }, [id, services, navigate]);

    const handleBook = () => {
        const bookingData = {
            serviceId: service.id,
            serviceName: service.name,
            price: service.price,
            providerId: selectedProvider
        };
        sessionStorage.setItem('currentBooking', JSON.stringify(bookingData));
        
        if (user) {
            navigate('/booking');
        } else {
            sessionStorage.setItem('redirectAfterLogin', '/booking');
            navigate('/login');
        }
    };

    if (!service) return <div className="p-16 text-center">Loading...</div>;

    return (
        <>
            <div className="bg-white py-12 border-b border-gray-200">
                <div className="container">
                    <span className="badge badge-primary mb-4">{service.category}</span>
                    <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
                    <div className="flex flex-wrap gap-6 text-gray-500 items-center">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-star text-amber-500"></i>
                            <span className="font-bold text-gray-900">{service.rating}</span> ({service.reviews} reviews)
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-clock"></i>
                            <span>Takes ~2 hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-shield-halved"></i>
                            <span>ServiceHub Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container py-16">
                <div className="grid md-grid-cols-3 gap-8">
                    <div className="md-col-span-2" style={{ gridColumn: 'span 2' }}>
                        <img src={service.image} alt={service.name} className="w-full h-[400px] object-cover rounded-xl shadow-md mb-8" />
                        
                        <h2 className="text-3xl font-bold mb-4">About this service</h2>
                        <p className="text-gray-500 text-lg mb-8">Our professional service guarantees high quality and reliable results. We use top-tier equipment and follow strict safety protocols to ensure your complete satisfaction.</p>
                        
                        <h3 className="text-2xl font-bold mt-8 mb-4">What's Included</h3>
                        <ul className="space-y-4 my-8">
                            <li className="flex gap-4">
                                <i className="fa-solid fa-check-circle text-emerald-500 mt-1"></i>
                                <div>
                                    <h4 className="font-bold mb-1">Professional Execution</h4>
                                    <p className="text-gray-500 text-sm">Expertly handled by trained professionals with years of experience.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <i className="fa-solid fa-check-circle text-emerald-500 mt-1"></i>
                                <div>
                                    <h4 className="font-bold mb-1">Post-Service Cleanup</h4>
                                    <p className="text-gray-500 text-sm">We leave the place spotless after completing the job.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <div className="sticky top-[100px] card border-t-4 border-t-primary">
                            <div className="p-6">
                                <div className="text-4xl font-bold text-primary mb-6">
                                    ₹{service.price}
                                </div>
                                <p className="text-gray-500 text-sm mb-6">Base price. Final price may vary based on specific requirements.</p>
                                
                                <h4 className="font-bold mb-2">Select a Provider (Optional)</h4>
                                <p className="text-gray-500 text-sm mb-4">Choose a specific professional or we'll assign the best one for you.</p>
                                
                                <div className="flex flex-col gap-4 mt-6">
                                    {providers.slice(0, 2).map(provider => (
                                        <div 
                                            key={provider.id}
                                            onClick={() => setSelectedProvider(provider.id)}
                                            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${selectedProvider === provider.id ? 'border-primary bg-primary-light shadow-[0_0_0_1px_var(--primary-color)]' : 'border-gray-200 hover:border-primary hover:bg-indigo-50'}`}
                                        >
                                            <img src={provider.image} className="w-12 h-12 rounded-full object-cover" alt={provider.name} />
                                            <div className="flex-1">
                                                <div className="font-medium">{provider.name}</div>
                                                <div className="text-gray-500 text-xs">
                                                    <i className="fa-solid fa-star text-amber-500"></i> {provider.rating} ({provider.jobsDone} jobs)
                                                </div>
                                            </div>
                                            {selectedProvider === provider.id && <i className="fa-solid fa-circle-check text-primary"></i>}
                                        </div>
                                    ))}
                                    
                                    <div 
                                        onClick={() => setSelectedProvider(null)}
                                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${selectedProvider === null ? 'border-primary bg-primary-light shadow-[0_0_0_1px_var(--primary-color)]' : 'border-gray-200 hover:border-primary hover:bg-indigo-50'}`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-primary">
                                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">Auto-Assign</div>
                                            <div className="text-gray-500 text-xs">Let us pick the best available</div>
                                        </div>
                                        {selectedProvider === null && <i className="fa-solid fa-circle-check text-primary"></i>}
                                    </div>
                                </div>
                                
                                <button onClick={handleBook} className="btn btn-primary mt-6 w-full text-lg">Continue to Book</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ServiceDetails;
