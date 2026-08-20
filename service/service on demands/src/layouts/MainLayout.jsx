import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const { user, logout } = useAuth();
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="header">
                <div className="container nav-container">
                    <Link to="/" className="logo">
                        <i className="fa-solid fa-shield-halved"></i>
                        ServiceHub
                    </Link>
                    
                    <button className="mobile-menu-btn">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    
                    <nav className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/services">Services</Link>
                        <Link to="/#how-it-works">How It Works</Link>
                        <Link to="/dashboard/provider">Become a Provider</Link>
                        <Link to="/#about-us">About Us</Link>
                    </nav>
                    
                    <div className="nav-actions flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="font-medium text-primary text-sm">
                                    <i className="fa-solid fa-user"></i> {user.name}
                                </span>
                                <Link 
                                    to={`/dashboard/${user.role}`} 
                                    className="btn btn-outline py-2 px-4 text-sm"
                                >
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="btn py-2 px-4 text-sm text-muted">
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn font-medium hover:text-primary">Login</Link>
                                <Link to="/register" className="btn btn-primary text-white shadow-md hover:shadow-lg">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
            
            <main>
                <Outlet />
            </main>
            
            <footer className="footer mt-8">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <div className="logo text-white mb-4">
                                <i className="fa-solid fa-shield-halved"></i>
                                ServiceHub
                            </div>
                            <p className="text-gray-400 text-sm mb-6">Your one-stop destination for all home services. Quality service at your doorstep.</p>
                        </div>
                        <div className="footer-col">
                            <h4>Company</h4>
                            <div className="footer-links">
                                <Link to="#">About Us</Link>
                                <Link to="#">Careers</Link>
                                <Link to="#">Terms & Conditions</Link>
                            </div>
                        </div>
                        <div className="footer-col">
                            <h4>Contact</h4>
                            <div className="footer-links">
                                <span><i className="fa-solid fa-phone mr-2"></i> +1 234 567 8900</span>
                                <span><i className="fa-solid fa-envelope mr-2"></i> support@servicehub.com</span>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 ServiceHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
