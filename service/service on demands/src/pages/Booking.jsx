import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Booking = () => {
    const navigate = useNavigate();
    const { user, updateUserBalance } = useAuth();
    const { providers, addBooking } = useData();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [addressForm, setAddressForm] = useState({
        name: user?.name || '',
        phone: '',
        line1: '',
        city: '',
        pincode: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const stored = sessionStorage.getItem('currentBooking');
        if (!stored) {
            navigate('/services');
            return;
        }
        
        setBookingData(JSON.parse(stored));
    }, [user, navigate]);

    // Calendar Generation
    const getDates = () => {
        const today = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dates = [];
        
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
            const dayStr = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()];
            dates.push({ label: dayStr, value: dateStr, display: `${d.getDate()} ${months[d.getMonth()]}` });
        }
        return dates;
    };
    
    const dates = getDates();
    const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM', '06:00 PM'];

    const handleNextStep = (targetStep) => {
        if (targetStep === 2) {
            if (!bookingData.date || !bookingData.time) {
                alert('Please select both date and time.');
                return;
            }
        } else if (targetStep === 3) {
            if (!addressForm.name || !addressForm.phone || !addressForm.line1 || !addressForm.city || !addressForm.pincode) {
                alert('Please fill in all address fields.');
                return;
            }
            setBookingData({ ...bookingData, address: addressForm });
        }
        
        setCurrentStep(targetStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleConfirmBooking = () => {
        const totalAmount = bookingData.price + 50;
        
        if (paymentMethod === 'wallet') {
            if ((user.balance || 0) < totalAmount) {
                alert('Insufficient wallet balance. Please choose another payment method or top up.');
                return;
            }
            updateUserBalance(totalAmount, true); // Deduct
        }
        
        const finalBooking = {
            ...bookingData,
            userId: user.id,
            total: totalAmount,
            paymentMethod
        };
        
        const savedBooking = addBooking(finalBooking);
        
        sessionStorage.removeItem('currentBooking');
        setBookingData(savedBooking); // Use saved to show ID
        setIsSuccess(true);
    };

    if (!bookingData) return null;

    if (isSuccess) {
        return (
            <div className="container success-container text-center py-16 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-pop-in">
                    <i className="fa-solid fa-check"></i>
                </div>
                
                <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
                <p className="text-gray-500 text-lg mb-8">Your service has been successfully booked. We've sent a confirmation email to your registered address.</p>
                
                <div className="card text-left mt-8 bg-white">
                    <div className="card-body p-8">
                        <h3 className="text-xl font-bold mb-6">Booking ID: <span className="text-primary">#{bookingData.id}</span></h3>
                        
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <div className="text-gray-500 text-sm mb-1">Service</div>
                                <div className="font-medium">{bookingData.serviceName}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm mb-1">Total Amount</div>
                                <div className="font-medium">₹{bookingData.total}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm mb-1">Date</div>
                                <div className="font-medium">{bookingData.date}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm mb-1">Time</div>
                                <div className="font-medium">{bookingData.time}</div>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-gray-500 text-sm mb-2">Service Address</div>
                            <div className="font-medium">{bookingData.address.line1}, {bookingData.address.city} - {bookingData.address.pincode}</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center gap-4 mt-8">
                    <button onClick={() => navigate('/dashboard/customer')} className="btn btn-primary px-8">Go to Dashboard</button>
                    <button onClick={() => navigate('/')} className="btn btn-outline px-8">Back to Home</button>
                </div>
            </div>
        );
    }

    const assignedProvider = bookingData.providerId ? providers.find(p => p.id === bookingData.providerId) : null;

    return (
        <div className="container booking-container max-w-4xl mx-auto py-16">
            
            <div className="booking-steps mb-12 flex justify-between relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                {[1, 2, 3].map(step => (
                    <div key={step} className={`booking-step bg-gray-50 px-4 flex flex-col items-center gap-2 ${currentStep === step ? 'active' : currentStep > step ? 'completed' : ''}`}>
                        <div className={`step-circle w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold bg-white
                            ${currentStep === step ? 'border-primary text-primary shadow-[0_0_0_4px_var(--primary-light)]' : 
                              currentStep > step ? 'bg-primary border-primary text-white' : 'border-gray-200 text-gray-400'}`}
                        >
                            {step}
                        </div>
                        <div className={`step-label text-sm font-medium ${currentStep === step ? 'text-primary' : 'text-gray-500'}`}>
                            {step === 1 ? 'Date & Time' : step === 2 ? 'Address' : 'Payment'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid md-grid-cols-3 gap-8">
                <div className="md-col-span-2" style={{ gridColumn: 'span 2' }}>
                    
                    {currentStep === 1 && (
                        <div className="card animate-fade-in">
                            <div className="card-body p-8">
                                <h2 className="text-2xl font-bold mb-8">Select Date and Time</h2>
                                
                                <h4 className="font-bold mb-4">Choose Date</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
                                    {dates.map((d, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => setBookingData({...bookingData, date: d.value})}
                                            className={`border rounded-lg p-4 text-center cursor-pointer transition-all
                                                ${bookingData.date === d.value ? 'bg-primary-light border-primary text-primary font-bold' : 'border-gray-200 hover:border-primary'}`}
                                        >
                                            <div className="text-xs text-gray-500 mb-1 font-normal">{d.label}</div>
                                            <div>{d.display}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                <h4 className="font-bold mb-4 mt-8">Choose Time</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
                                    {times.map((time, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => setBookingData({...bookingData, time})}
                                            className={`border rounded-lg p-4 text-center cursor-pointer transition-all
                                                ${bookingData.time === time ? 'bg-primary-light border-primary text-primary font-bold' : 'border-gray-200 hover:border-primary'}`}
                                        >
                                            <div>{time}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                <button className="btn btn-primary mt-8 w-full py-3" onClick={() => handleNextStep(2)}>Continue to Address</button>
                            </div>
                        </div>
                    )}
                    
                    {currentStep === 2 && (
                        <div className="card animate-fade-in">
                            <div className="card-body p-8">
                                <h2 className="text-2xl font-bold mb-8">Service Address</h2>
                                
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">Full Name</label>
                                    <input type="text" className="form-control" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">Phone Number</label>
                                    <input type="tel" className="form-control" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">Address Line</label>
                                    <input type="text" className="form-control" placeholder="House/Flat No., Street, Area" value={addressForm.line1} onChange={e => setAddressForm({...addressForm, line1: e.target.value})} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium">City</label>
                                        <input type="text" className="form-control" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium">Pincode</label>
                                        <input type="text" className="form-control" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 mt-8">
                                    <button className="btn btn-outline flex-1 py-3" onClick={() => handleNextStep(1)}>Back</button>
                                    <button className="btn btn-primary flex-1 py-3" onClick={() => handleNextStep(3)}>Continue to Payment</button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {currentStep === 3 && (
                        <div className="card animate-fade-in">
                            <div className="card-body p-8">
                                <h2 className="text-2xl font-bold mb-8">Payment Method</h2>
                                
                                <div className="space-y-4 mb-8">
                                    <label className={`flex items-center gap-4 p-6 border rounded-xl cursor-pointer ${paymentMethod === 'wallet' ? 'border-primary bg-primary-light' : 'border-gray-200'}`}>
                                        <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="w-5 h-5 text-primary" />
                                        <div>
                                            <div className="font-bold">ServiceHub Wallet</div>
                                            <div className="text-gray-500 text-sm">Balance: ₹{user.balance || 0}</div>
                                        </div>
                                    </label>
                                    
                                    <label className={`flex items-center gap-4 p-6 border rounded-xl cursor-pointer ${paymentMethod === 'cash' ? 'border-primary bg-primary-light' : 'border-gray-200'}`}>
                                        <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 text-primary" />
                                        <div>
                                            <div className="font-bold">Pay After Service (Cash)</div>
                                            <div className="text-gray-500 text-sm">Pay the professional directly after work is done</div>
                                        </div>
                                    </label>
                                </div>
                                
                                <div className="flex gap-4 mt-8">
                                    <button className="btn btn-outline flex-1 py-3" onClick={() => handleNextStep(2)}>Back</button>
                                    <button className="btn btn-primary flex-1 py-3" onClick={handleConfirmBooking}>Confirm Booking</button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                </div>
                
                {/* Summary Sidebar */}
                <div>
                    <div className="card sticky top-[100px] bg-white border-primary-light">
                        <div className="card-body p-6">
                            <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
                            
                            <div className="flex flex-col gap-1 mb-4 pb-4 border-b border-gray-200">
                                <span className="font-bold text-lg">{bookingData.serviceName}</span>
                                <span className="text-gray-500 text-sm">
                                    {assignedProvider ? `Provider: ${assignedProvider.name}` : 'Auto-Assign Provider'}
                                </span>
                            </div>
                            
                            {bookingData.date && bookingData.time && (
                                <div className="flex justify-between mb-4 pb-4 border-b border-dashed border-gray-200 text-sm">
                                    <div>
                                        <div className="text-gray-500"><i className="fa-regular fa-calendar"></i> Date</div>
                                        <div className="font-medium">{bookingData.date.split(' ')[0]} {bookingData.date.split(' ')[1]}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-500"><i className="fa-regular fa-clock"></i> Time</div>
                                        <div className="font-medium">{bookingData.time}</div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span>₹{bookingData.price}</span>
                            </div>
                            
                            <div className="flex justify-between mb-6">
                                <span className="text-gray-500">Platform Fee</span>
                                <span>₹50</span>
                            </div>
                            
                            <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg">
                                <span>Total Amount</span>
                                <span className="text-primary">₹{bookingData.price + 50}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
