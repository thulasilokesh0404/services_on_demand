import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const AdminDash = () => {
    const { bookings } = useData();
    const [stats, setStats] = useState({ users: 0, providers: 0, revenue: 0 });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(allUsers);
        
        const customers = allUsers.filter(u => u.role === 'customer');
        const providersList = allUsers.filter(u => u.role === 'provider');
        
        // 50 per booking
        const totalRevenue = bookings.length * 50;
        
        setStats({
            users: customers.length,
            providers: providersList.length,
            revenue: totalRevenue
        });
    }, [bookings]);

    const handleReset = () => {
        if(window.confirm('Are you sure you want to reset all mock data?')) {
            localStorage.clear();
            
            const adminUser = {
                id: 'admin_1',
                name: 'System Admin',
                email: 'admin@servicehub.com',
                password: 'admin',
                role: 'admin'
            };
            
            localStorage.setItem('users', JSON.stringify([adminUser]));
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            
            window.location.reload();
        }
    };

    return (
        <div className="container py-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Platform Overview</h1>
                <button className="btn btn-primary bg-indigo-600 hover:bg-indigo-700" onClick={handleReset}>
                    <i className="fa-solid fa-rotate-right mr-2"></i> Reset Data
                </button>
            </div>
            
            <div className="grid md-grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-gray-500 text-sm">Total Revenue</div>
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-primary flex items-center justify-center"><i className="fa-solid fa-indian-rupee-sign"></i></div>
                        </div>
                        <h2 className="text-2xl font-bold">₹{stats.revenue}</h2>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-gray-500 text-sm">Total Bookings</div>
                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><i className="fa-solid fa-calendar-check"></i></div>
                        </div>
                        <h2 className="text-2xl font-bold">{bookings.length}</h2>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-gray-500 text-sm">Total Users</div>
                            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center"><i className="fa-solid fa-users"></i></div>
                        </div>
                        <h2 className="text-2xl font-bold">{stats.users}</h2>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-gray-500 text-sm">Active Providers</div>
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center"><i className="fa-solid fa-user-tie"></i></div>
                        </div>
                        <h2 className="text-2xl font-bold">{stats.providers}</h2>
                    </div>
                </div>
            </div>
            
            <div className="card">
                <div className="card-body p-0">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold">Recent Platform Activity</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="p-4 font-medium text-gray-500">Booking ID</th>
                                    <th className="p-4 font-medium text-gray-500">Service</th>
                                    <th className="p-4 font-medium text-gray-500">Customer</th>
                                    <th className="p-4 font-medium text-gray-500">Amount</th>
                                    <th className="p-4 font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8 text-gray-500">No activity yet.</td>
                                    </tr>
                                ) : (
                                    [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10).map(booking => {
                                        const customer = users.find(u => u.id === booking.userId);
                                        return (
                                            <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-4 font-medium">#{booking.id}</td>
                                                <td className="p-4">{booking.serviceName}</td>
                                                <td className="p-4">{customer?.name || 'Unknown User'}</td>
                                                <td className="p-4 font-bold text-gray-900">₹{booking.total}</td>
                                                <td className="p-4">
                                                    <span className={`badge ${booking.status === 'Completed' ? 'badge-success' : booking.status === 'Cancelled' ? 'badge-danger' : 'badge-primary'}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDash;
