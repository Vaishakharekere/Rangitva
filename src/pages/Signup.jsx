import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implementation for Firebase Auth will go here later
        alert("Signup implementation coming soon!");
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
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-[#E9DAC1] bg-transparent placeholder-primary-600/70 text-primary-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-sm text-white bg-accent-500 hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 shadow-md uppercase tracking-widest transition-colors duration-300"
                        >
                            Sign up
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
