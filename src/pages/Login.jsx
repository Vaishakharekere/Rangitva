import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate(isAdmin ? '/admin' : '/');
        }
    }, [currentUser, isAdmin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            // Redirection logic is handled by useEffect to wait for context update
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10 relative">
            <div className="max-w-md w-full space-y-8 bg-[#FFFCF9] p-10 rounded-sm shadow-xl border border-[#E9DAC1]">
                <div>
                    <h2 className="mt-6 text-center text-4xl font-extrabold text-primary-900 font-serif">Welcome Back</h2>
                    <p className="mt-2 text-center text-sm text-primary-600">
                        Sign in to your Rangitva account
                    </p>
                </div>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center border border-red-200">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="sr-only bg-[#E9DAC1]">Email address</label>
                            <input
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-[#E9DAC1] bg-transparent placeholder-primary-600 text-primary-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="sr-only bg-[#EBEDF0]">Password</label>
                            <input
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-[#E9DAC1] bg-transparent placeholder-primary-600 text-primary-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-accent-500 hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 shadow-md uppercase tracking-widest transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <Link to="/signup" className="text-sm font-medium text-accent-500 hover:text-primary-900 transition-colors">
                            Need an account? Sign up here
                        </Link>
                    </div>
                </form >
            </div >
        </div >
    );
}
