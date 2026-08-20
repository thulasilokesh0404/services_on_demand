import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ allowedRoles }) => {
    const { user, loading, logout } = useAuth();
    
    if (loading) return <div className="p-8 text-center">Loading...</div>;
    
    if (!user) return <Navigate to="/login" replace />;
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    
    const isAdmin = user.role === 'admin';
    const isProvider = user.role === 'provider';
    const isCustomer = user.role === 'customer';

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="header sticky top-0 z-[100]" style={{ background: isAdmin ? '#111827' : 'white' }}>
                <div className="container nav-container">
                    <Link to="/" className="logo" style={{ color: isAdmin ? 'white' : 'var(--primary-color)' }}>
                        <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary-color)' }}></i>
                        ServiceHub {isAdmin && <span className="text-xs bg-primary text-white py-0.5 px-2 rounded ml-2">ADMIN</span>}
                    </Link>
                    
                    <div className="nav-actions flex items-center gap-4">
                        {isProvider && <span className="badge badge-warning mr-4">Provider Mode</span>}
                        <span className="font-medium text-sm" style={{ color: isAdmin ? 'white' : 'var(--primary-color)' }}>
                            <i className={`fa-solid ${isAdmin ? 'fa-user-shield' : isProvider ? 'fa-user-tie' : 'fa-user'}`}></i> {user.name}
                        </span>
                        <button 
                            onClick={logout} 
                            className="btn btn-outline py-2 px-4 text-sm"
                            style={{ borderColor: isAdmin ? '#374151' : '', color: isAdmin ? 'white' : '' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="dashboard-layout">
                <aside className="sidebar" style={{ background: isAdmin ? '#1F2937' : 'white', borderColor: isAdmin ? '#374151' : 'var(--border-color)' }}>
                    <nav className="sidebar-nav">
                        {isCustomer && (
                            <>
                                <Link to="/dashboard/customer" className="sidebar-link active">
                                    <i className="fa-solid fa-house"></i> Dashboard
                                </Link>
                                <Link to="#" className="sidebar-link">
                                    <i className="fa-solid fa-calendar-check"></i> My Bookings
                                </Link>
                                <Link to="#" className="sidebar-link">
                                    <i className="fa-solid fa-wallet"></i> Wallet
                                </Link>
                            </>
                        )}
                        
                        {isProvider && (
                            <>
                                <Link to="/dashboard/provider" className="sidebar-link active">
                                    <i className="fa-solid fa-chart-line"></i> Overview
                                </Link>
                                <Link to="#" className="sidebar-link">
                                    <i className="fa-solid fa-clipboard-list"></i> Job Requests
                                </Link>
                                <Link to="#" className="sidebar-link">
                                    <i className="fa-solid fa-indian-rupee-sign"></i> Earnings
                                </Link>
                            </>
                        )}
                        
                        {isAdmin && (
                            <>
                                <Link to="/dashboard/admin" className="sidebar-link active" style={{ color: 'white' }}>
                                    <i className="fa-solid fa-chart-pie"></i> Overview
                                </Link>
                                <Link to="#" className="sidebar-link" style={{ color: '#9CA3AF' }}>
                                    <i className="fa-solid fa-users"></i> Users
                                </Link>
                                <Link to="#" className="sidebar-link" style={{ color: '#9CA3AF' }}>
                                    <i className="fa-solid fa-calendar-check"></i> All Bookings
                                </Link>
                            </>
                        )}
                    </nav>
                </aside>

                <main className="dashboard-content" style={{ background: isAdmin ? '#F3F4F6' : 'var(--bg-color)' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
