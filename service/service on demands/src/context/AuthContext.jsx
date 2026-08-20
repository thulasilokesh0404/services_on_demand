import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === email && u.password === password);
        
        if (existingUser) {
            setUser(existingUser);
            localStorage.setItem('currentUser', JSON.stringify(existingUser));
            return { success: true, user: existingUser };
        }
        return { success: false, error: 'Invalid email or password.' };
    };

    const register = (name, email, password, role) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'An account with this email already exists.' };
        }
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            role,
            balance: 1000 // Mock starting balance
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        return { success: true, user: newUser };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const updateUserBalance = (amount, isDeduction = true) => {
        if (!user) return false;
        
        const newBalance = isDeduction ? (user.balance || 0) - amount : (user.balance || 0) + amount;
        const updatedUser = { ...user, balance: newBalance };
        
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update in global users list
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const uIndex = users.findIndex(u => u.id === user.id);
        if(uIndex > -1) {
            users[uIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        return true;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserBalance }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
