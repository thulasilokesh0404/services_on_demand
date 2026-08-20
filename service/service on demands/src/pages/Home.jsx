import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Home = () => {
    const { services } = useData();

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gray-50/50">
                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="hero-text">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-primary font-medium text-sm mb-6">
                                <i className="fa-solid fa-bolt"></i> Service On Demand
                            </div>
                            <h1 className="text-5xl lg:text-[3.5rem] font-bold leading-[1.2] mb-6 text-gray-900 tracking-tight">
                                All Services <br /> <span className="text-primary">At Your Doorstep</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg">
                                Book trusted professionals for home services, repairs, cleaning, beauty, and more — anytime, anywhere.
                            </p>
                            
                            <form className="flex flex-col sm:flex-row items-center bg-white border border-gray-200 rounded-2xl sm:rounded-full shadow-sm p-2 max-w-xl gap-2 sm:gap-0">
                                <div className="w-full sm:flex-1 flex items-center px-4 py-2 sm:py-0">
                                    <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                                    <input type="text" className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-3 py-2 text-sm" placeholder="What service do you need?" />
                                </div>
                                <div className="w-full sm:w-auto flex items-center border-t sm:border-t-0 sm:border-l border-gray-200 px-4 py-2 sm:py-0">
                                    <i className="fa-solid fa-location-dot text-gray-400"></i>
                                    <select className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-600 ml-2 w-full sm:w-auto">
                                        <option>Select Location</option>
                                        <option>New York</option>
                                        <option>London</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full sm:w-auto bg-primary text-white rounded-xl sm:rounded-full px-8 py-3 font-medium hover:bg-primary-hover transition-colors shadow-md">Search</button>
                            </form>
                            
                            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 items-center">
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-500 flex items-center gap-1"><i className="fa-solid fa-boxes-stacked text-xl"></i></div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-lg">500+</div>
                                        <div className="text-xs text-gray-500">Services</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-500 flex items-center gap-1"><i className="fa-solid fa-user-group text-xl"></i></div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-lg">10K+</div>
                                        <div className="text-xs text-gray-500">Professionals</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-500 flex items-center gap-1"><i className="fa-solid fa-face-smile text-xl"></i></div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-lg">1M+</div>
                                        <div className="text-xs text-gray-500">Happy Customers</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-amber-500 flex items-center gap-1"><i className="fa-solid fa-star text-xl"></i></div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-lg">4.8</div>
                                        <div className="text-xs text-gray-500">Avg. Ratings</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative flex justify-center mt-16 lg:mt-0 lg:ml-10">
                            {/* Circle Background */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#EEF2FF] rounded-full -z-10"></div>
                            
                            <img src="/images/hero.png" alt="Professional Worker" className="relative z-10 w-[95%] max-w-[500px] object-contain drop-shadow-2xl" />
                            
                            {/* Floating Card */}
                            <div className="absolute top-1/3 -left-4 sm:-left-12 bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 z-20 animate-float border border-gray-100">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Provider" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                <div>
                                    <div className="font-bold text-sm text-gray-900">Electrician</div>
                                    <div className="text-gray-500 text-[10px] sm:text-xs flex items-center gap-1">
                                        <i className="fa-solid fa-clock text-primary"></i> 15 min away
                                    </div>
                                </div>
                                <div className="ml-2 flex flex-col items-center justify-center bg-amber-50 p-1.5 rounded-lg text-xs font-bold text-amber-600">
                                    <i className="fa-solid fa-star mb-0.5"></i>
                                    4.8
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Service Providers */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Top Service Providers</h2>
                        </div>
                        <Link to="/services" className="text-primary font-medium hover:underline flex items-center gap-1 text-sm">See All <i className="fa-solid fa-arrow-right"></i></Link>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: 'Ravi Kumar', role: 'Electrician', rating: '4.9', reviews: 320, price: 299, img: 'https://randomuser.me/api/portraits/men/45.jpg' },
                            { name: 'Sunil Yadav', role: 'Plumber', rating: '4.8', reviews: 210, price: 299, img: 'https://randomuser.me/api/portraits/men/22.jpg' },
                            { name: 'Amit Verma', role: 'Carpenter', rating: '4.7', reviews: 180, price: 299, img: 'https://randomuser.me/api/portraits/men/78.jpg' }
                        ].map((provider, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <img src={provider.img} alt={provider.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{provider.name}</h4>
                                        <p className="text-gray-500 text-sm mb-2">{provider.role}</p>
                                        <div className="flex items-center gap-1 text-sm">
                                            <i className="fa-solid fa-star text-amber-500 text-xs"></i>
                                            <span className="font-bold text-gray-900">{provider.rating}</span>
                                            <span className="text-gray-400 text-xs">({provider.reviews})</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-primary text-xs font-semibold bg-blue-50/50 px-2.5 py-1 rounded-md">
                                        <i className="fa-regular fa-circle-check"></i> Verified
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Starts at <span className="font-bold text-gray-900 text-sm">₹{provider.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-gray-50/50">
                <div className="container">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                        <p className="text-gray-500 mt-2 text-sm">Get your work done in 4 simple steps</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: 1, title: 'Choose Service', desc: 'Select the service you need from our list' },
                            { step: 2, title: 'Book Instantly', desc: 'Pick a time and book your service' },
                            { step: 3, title: 'Professional Arrives', desc: 'Our expert will arrive at your location' },
                            { step: 4, title: 'Work Done', desc: 'Get the work done and pay securely' }
                        ].map(item => (
                            <div key={item.step} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                                    {item.step}
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose ServiceHub */}
            <section className="py-16 bg-primary text-white">
                <div className="container">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-12">Why Choose ServiceHub?</h2>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { icon: 'fa-user-shield', title: 'Trusted Professionals', desc: 'Verified & experienced experts' },
                            { icon: 'fa-shield-halved', title: 'Secure Payments', desc: '100% secure payment options' },
                            { icon: 'fa-stopwatch', title: 'On-Time Service', desc: 'Punctual and reliable service' },
                            { icon: 'fa-headset', title: '24/7 Support', desc: "We're here to help you" }
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-start gap-4">
                                <div className="text-3xl text-blue-200 mt-1">
                                    <i className={`fa-solid ${feature.icon}`}></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-base mb-1.5">{feature.title}</h4>
                                    <p className="text-blue-100 text-sm leading-snug opacity-90">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Become a Provider Banner */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="container">
                    <div className="bg-[#EEF2FF] rounded-3xl flex flex-col md:flex-row items-center justify-between overflow-hidden relative shadow-sm border border-blue-100">
                        <div className="md:w-1/2 p-8 lg:p-14 z-10">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">Become a Service Provider</h2>
                            <p className="text-gray-600 mb-8 text-lg">Earn money by providing services in your area.</p>
                            <Link to="/register" className="inline-flex items-center justify-center bg-primary text-white px-8 py-3.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                                Join Now
                            </Link>
                        </div>
                        <div className="md:w-1/2 relative h-[300px] md:h-[400px] w-full flex justify-center md:justify-end pt-10 md:pt-0">
                            {/* Decorative background for the guy */}
                            <div className="absolute bottom-0 right-10 md:right-32 w-64 h-64 bg-[#E0E7FF] rounded-full blur-3xl"></div>
                            <img src="/images/provider.png" alt="Join as Provider" className="relative z-10 h-[120%] -bottom-10 object-contain object-bottom drop-shadow-2xl" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
