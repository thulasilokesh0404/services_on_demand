import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');
    
    const { register } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = register(name, email, password, role);
        
        if (!result.success) {
            setError(result.error);
        } else {
            if (result.user.role === 'provider') {
                window.location.href = '/dashboard/provider';
            } else {
                window.location.href = '/dashboard/customer';
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 py-12">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 text-center animate-fade-in my-8">
                <Link to="/" className="inline-flex items-center gap-2 text-3xl font-extrabold text-primary mb-8 hover:text-primary-hover">
                    <i className="fa-solid fa-shield-halved"></i>
                    ServiceHub
                </Link>
                
                <h2 className="text-2xl font-bold mb-2">Create an Account</h2>
                <p className="text-gray-500 mb-8">Join ServiceHub today to book or provide services.</p>
                
                <div className="flex gap-4 mb-8">
                    <div 
                        className={`flex-1 p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${role === 'customer' ? 'border-primary bg-primary-light text-primary' : 'border-gray-200'}`}
                        onClick={() => setRole('customer')}
                    >
                        <i className="fa-solid fa-user text-2xl mb-2 block"></i>
                        <div className="font-bold">Customer</div>
                        <div className="text-xs text-gray-500 mt-1">Book services</div>
                    </div>
                    <div 
                        className={`flex-1 p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${role === 'provider' ? 'border-primary bg-primary-light text-primary' : 'border-gray-200'}`}
                        onClick={() => setRole('provider')}
                    >
                        <i className="fa-solid fa-briefcase text-2xl mb-2 block"></i>
                        <div className="font-bold">Provider</div>
                        <div className="text-xs text-gray-500 mt-1">Offer services</div>
                    </div>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm text-left">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Full Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            required 
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
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
                        <label className="block mb-2 font-medium">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            required 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-full py-3">Create Account</button>
                </form>
                
                <p className="mt-8 text-gray-500 text-sm">
                    Already have an account? <Link to="/login" className="font-bold text-gray-900 hover:text-primary">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
