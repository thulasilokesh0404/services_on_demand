import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const CustomerDash = () => {
    const { user } = useAuth();
    const { bookings } = useData();
    
    const userBookings = bookings.filter(b => b.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const activeBookings = userBookings.filter(b => b.status === 'Confirmed');
    const completedBookings = userBookings.filter(b => b.status === 'Completed');

    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <h1 className="mb-6">Customer Dashboard</h1>
            
            <div className="grid md-grid-cols-3 gap-6 mb-8">
                <div className="card border-l-4 border-l-primary">
                    <div className="card-body p-6">
                        <div className="text-gray-500 text-sm mb-2">Wallet Balance</div>
                        <h2 className="text-3xl font-bold text-gray-900">₹{user.balance || 0}</h2>
                        <button className="text-primary text-sm font-medium mt-2 hover:underline">+ Add Money</button>
                    </div>
                </div>
                <div className="card border-l-4 border-l-amber-500">
                    <div className="card-body p-6">
                        <div className="text-gray-500 text-sm mb-2">Active Bookings</div>
                        <h2 className="text-3xl font-bold text-gray-900">{activeBookings.length}</h2>
                    </div>
                </div>
                <div className="card border-l-4 border-l-emerald-500">
                    <div className="card-body p-6">
                        <div className="text-gray-500 text-sm mb-2">Completed Services</div>
                        <h2 className="text-3xl font-bold text-gray-900">{completedBookings.length}</h2>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body p-6">
                    <h3 className="text-xl font-bold mb-6">Recent Bookings</h3>
                    
                    {userBookings.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fa-solid fa-calendar-xmark text-4xl mb-4 text-gray-300"></i>
                            <p>You haven't booked any services yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userBookings.map(booking => (
                                <div key={booking.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white hover:border-primary transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 text-primary rounded-lg flex items-center justify-center text-xl">
                                            <i className="fa-solid fa-wrench"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{booking.serviceName}</h4>
                                            <div className="text-gray-500 text-sm">{booking.date} at {booking.time}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">₹{booking.total}</div>
                                        <span className={`badge ${booking.status === 'Completed' ? 'badge-success' : booking.status === 'Cancelled' ? 'badge-danger' : 'badge-primary'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDash;
