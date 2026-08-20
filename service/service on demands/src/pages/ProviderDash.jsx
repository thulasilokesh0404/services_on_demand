import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const ProviderDash = () => {
    const { user, updateUserBalance } = useAuth();
    const { bookings, updateBookingStatus } = useData();

    const providerBookings = bookings.filter(b => b.providerId === user.id || b.providerId === null).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const pendingReqs = providerBookings.filter(b => b.status === 'Confirmed');
    const completedReqs = providerBookings.filter(b => b.status === 'Completed');
    const totalEarnings = completedReqs.reduce((sum, b) => sum + b.price, 0);

    const handleComplete = (bookingId, price) => {
        updateBookingStatus(bookingId, 'Completed');
        updateUserBalance(price, false); // Add earnings
    };

    const handleDecline = (bookingId) => {
        updateBookingStatus(bookingId, 'Cancelled');
    };

    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <h1 className="mb-6">Provider Dashboard</h1>
            
            <div className="grid md-grid-cols-4 gap-6 mb-8">
                <div className="card border-l-4 border-l-primary">
                    <div className="card-body p-4">
                        <div className="text-gray-500 text-sm mb-2">Total Earnings</div>
                        <h2 className="text-2xl font-bold">₹{totalEarnings}</h2>
                    </div>
                </div>
                <div className="card border-l-4 border-l-emerald-500">
                    <div className="card-body p-4">
                        <div className="text-gray-500 text-sm mb-2">Jobs Completed</div>
                        <h2 className="text-2xl font-bold">{completedReqs.length}</h2>
                    </div>
                </div>
                <div className="card border-l-4 border-l-amber-500">
                    <div className="card-body p-4">
                        <div className="text-gray-500 text-sm mb-2">Average Rating</div>
                        <h2 className="text-2xl font-bold">4.8 <i className="fa-solid fa-star text-amber-500 text-sm"></i></h2>
                    </div>
                </div>
                <div className="card border-l-4 border-l-red-500">
                    <div className="card-body p-4">
                        <div className="text-gray-500 text-sm mb-2">Pending Requests</div>
                        <h2 className="text-2xl font-bold">{pendingReqs.length}</h2>
                    </div>
                </div>
            </div>
            
            <div className="grid md-grid-cols-3 gap-8">
                <div className="md-col-span-2" style={{ gridColumn: 'span 2' }}>
                    <h2 className="text-xl font-bold mb-4">Recent Job Requests</h2>
                    
                    {pendingReqs.length === 0 ? (
                        <div className="card">
                            <div className="card-body text-center text-gray-500 py-12">
                                <i className="fa-solid fa-inbox mb-4 text-4xl text-gray-300"></i>
                                <p>No new job requests at the moment.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingReqs.map(booking => (
                                <div key={booking.id} className="card animate-fade-in">
                                    <div className="card-body p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{booking.serviceName}</h3>
                                                <div className="text-gray-500 text-sm">Booking ID: #{booking.id}</div>
                                            </div>
                                            <div className="font-bold text-primary text-xl">₹{booking.price}</div>
                                        </div>
                                        
                                        <div className="grid md-grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="text-gray-500 text-xs"><i className="fa-regular fa-calendar"></i> Date & Time</div>
                                                <div className="font-medium text-sm">{booking.date} at {booking.time}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-xs"><i className="fa-solid fa-location-dot"></i> Location</div>
                                                <div className="font-medium text-sm">{booking.address.line1}, {booking.address.city}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-4">
                                            <button className="btn btn-outline flex-1 py-2" onClick={() => handleDecline(booking.id)}>Decline</button>
                                            <button className="btn btn-primary flex-1 py-2 bg-emerald-500 border-emerald-500" onClick={() => handleComplete(booking.id, booking.price)}>Mark Completed</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div>
                    <div className="card">
                        <div className="card-body p-6">
                            <h3 className="text-lg font-bold mb-4">Today's Schedule</h3>
                            <div className="text-center text-gray-500 py-8">
                                <i className="fa-regular fa-calendar-xmark mb-2 text-3xl"></i>
                                <p>No jobs scheduled for today.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDash;
