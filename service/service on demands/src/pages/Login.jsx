import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = login(email, password);
        
        if (!result.success) {
            setError(result.error);
        } else {
            const redirect = sessionStorage.getItem('redirectAfterLogin');
            if (redirect) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirect;
            } else {
                if (result.user.role === 'provider') {
                    window.location.href = '/dashboard/provider';
                } else if (result.user.role === 'admin') {
                    window.location.href = '/dashboard/admin';
                } else {
                    window.location.href = '/dashboard/customer';
                }
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-12 text-center animate-fade-in">
                <Link to="/" className="inline-flex items-center gap-2 text-3xl font-extrabold text-primary mb-8 hover:text-primary-hover">
                    <i className="fa-solid fa-shield-halved"></i>
                    ServiceHub
                </Link>
                
                <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                <p className="text-gray-500 mb-8">Enter your credentials to access your account.</p>
                
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm text-left">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            required 
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-medium m-0">Password</label>
                            <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
                        </div>
                        <input 
                            type="password" 
                            className="form-control" 
                            required 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-full py-3">Sign In</button>
                </form>
                
                <p className="mt-8 text-gray-500 text-sm">
                    Don't have an account? <Link to="/register" className="font-bold text-gray-900 hover:text-primary">Sign up now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
