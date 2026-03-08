import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, signInWithGoogle, currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate(isAdmin ? '/admin' : '/');
        }
    }, [currentUser, isAdmin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password, name, phone, address);
            // Redirection logic is handled by useEffect to wait for context update
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setError('');
            setLoading(true);
            await signInWithGoogle();
        } catch (err) {
            setError('Failed to sign up with Google: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10 relative">
            <div className="max-w-md w-full space-y-8 bg-[#FFFCF9] p-10 rounded-sm shadow-xl border border-[#E9DAC1]">
                <div>
                    <h2 className="mt-6 text-center text-4xl font-extrabold text-primary-900 font-serif">Create Account</h2>
                    <p className="mt-2 text-center text-sm text-primary-600">
                        Join the Rangitva community
                    </p>
                </div>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center border border-red-200">{error}</div>}
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
                        <div>
                            <input
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-[#E9DAC1] bg-transparent placeholder-primary-600/70 text-primary-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-[#E9DAC1] bg-transparent placeholder-primary-600/70 text-primary-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="tel"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-[#E9DAC1] bg-transparent text-primary-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div>
                            <textarea
                                className="appearance-none block w-full px-3 py-3 border border-[#E9DAC1] bg-transparent text-primary-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm resize-none"
                                placeholder="Shipping/Billing Address (Optional)"
                                rows="3"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-[#E9DAC1] bg-transparent text-primary-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-[#E9DAC1] bg-transparent text-primary-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-sm text-white bg-accent-500 hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 shadow-md uppercase tracking-widest transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            disabled={loading}
                            className="mt-4 w-full flex justify-center py-3 px-4 border border-[#E9DAC1] text-sm font-medium rounded-sm text-primary-900 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 shadow-sm uppercase tracking-widest transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.74 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.09H2.18V16.93C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
                                <path d="M5.84 14.09C5.62 13.43 5.5 12.73 5.5 12C5.5 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.84 14.09Z" fill="#FBBC05" />
                                <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07L5.84 9.91C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm font-medium text-accent-500 hover:text-primary-900 transition-colors">
                            Already have an account? Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
