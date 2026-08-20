import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [bookings, setBookings] = useState([]);
    
    // Initialize mock data
    useEffect(() => {
        initMockData();
    }, []);

    const initMockData = () => {
        // Services
        let localServices = JSON.parse(localStorage.getItem('services') || 'null');
        if (!localServices) {
            localServices = [
                { id: 1, name: 'Home Cleaning', category: 'Cleaning', price: 999, rating: 4.8, reviews: 120, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80' },
                { id: 2, name: 'Plumbing Repair', category: 'Plumbing', price: 499, rating: 4.6, reviews: 85, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&q=80' },
                { id: 3, name: 'AC Servicing', category: 'Appliance', price: 799, rating: 4.9, reviews: 210, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&q=80' },
                { id: 4, name: 'Electrical Wiring', category: 'Electrician', price: 399, rating: 4.7, reviews: 150, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80' }
            ];
            localStorage.setItem('services', JSON.stringify(localServices));
        }
        setServices(localServices);

        // Providers
        let localProviders = JSON.parse(localStorage.getItem('providers') || 'null');
        if (!localProviders) {
            localProviders = [
                { id: '101', name: 'Ravi Kumar', profession: 'Electrician', rating: 4.9, jobsDone: 320, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
                { id: '102', name: 'Sunil Yadav', profession: 'Plumber', rating: 4.8, jobsDone: 210, image: 'https://randomuser.me/api/portraits/men/44.jpg' },
                { id: '103', name: 'Amit Verma', profession: 'Carpenter', rating: 4.7, jobsDone: 180, image: 'https://randomuser.me/api/portraits/men/68.jpg' }
            ];
            localStorage.setItem('providers', JSON.stringify(localProviders));
        }
        setProviders(localProviders);
        
        // Bookings
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        setBookings(localBookings);
    };

    const addBooking = (bookingData) => {
        const newBooking = {
            id: 'SH' + Math.floor(10000 + Math.random() * 90000),
            createdAt: new Date().toISOString(),
            status: 'Confirmed',
            ...bookingData
        };
        
        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        
        return newBooking;
    };

    const updateBookingStatus = (bookingId, newStatus) => {
        const updatedBookings = bookings.map(b => 
            b.id === bookingId ? { ...b, status: newStatus } : b
        );
        
        setBookings(updatedBookings);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        
        return updatedBookings.find(b => b.id === bookingId);
    };

    return (
        <DataContext.Provider value={{ services, providers, bookings, addBooking, updateBookingStatus }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
