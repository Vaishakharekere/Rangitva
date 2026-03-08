import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { updatePassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from 'framer-motion';
import { User, Lock, Save, AlertCircle, CheckCircle, LogOut, Edit2, X, MapPin, Phone } from 'lucide-react';

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const { clearCart } = useCart();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Editable Details States
    const [isEditing, setIsEditing] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [userData, setUserData] = useState({
        name: currentUser?.displayName || '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData({
                            name: data.name || currentUser.displayName || '',
                            phone: data.phone || '',
                            address: data.address || ''
                        });
                    } else {
                        setUserData({
                            name: currentUser.displayName || '',
                            phone: '',
                            address: ''
                        });
                    }
                } catch (err) {
                    console.error("Error fetching user data", err);
                } finally {
                    setDetailsLoading(false);
                }
            }
        };
        fetchUserData();
    }, [currentUser]);

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await updateProfile(currentUser, {
                displayName: userData.name
            });

            await setDoc(doc(db, 'users', currentUser.uid), {
                name: userData.name,
                phone: userData.phone,
                address: userData.address
            }, { merge: true });

            setSuccess("Profile details updated successfully!");
            setIsEditing(false);
        } catch (err) {
            setError("Failed to update profile details.");
            console.error(err);
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters.");
        }

        try {
            setLoading(true);
            await updatePassword(currentUser, password);
            setSuccess("Password updated successfully!");
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError("Failed to update password. You may need to re-login.");
            console.error(err);
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            clearCart();
            navigate('/login');
        } catch (err) {
            console.error("Failed to log out", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen flex items-center justify-center p-4 bg-primary-50/30 overflow-y-auto pt-24 pb-12"
        >
            <div className="max-w-xl w-full bg-[#FFFCF9] rounded-sm shadow-xl border border-[#E9DAC1] overflow-hidden">
                {/* Header */}
                <div className="bg-primary-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSI4Ij48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iOCIgZmlsbD0iI0E3MjgxNCIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iNCIgcj0iMiIgZmlsbD0iI0NGQUY2NSIvPjwvc3ZnPg==')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-[#F3E5D8] rounded-full flex items-center justify-center border-2 border-gold-500 shadow-lg text-primary-900 mb-4">
                            <User size={48} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-[#F3E5D8]">{userData.name || 'User Profile'}</h2>
                        <p className="text-gold-500 text-sm mt-1 mb-2">{currentUser?.email}</p>
                    </div>
                </div>

                <div className="p-8">
                    {/* Alerts */}
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 p-3 bg-red-50 text-red-700 text-sm flex items-start border border-red-200">
                                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 p-3 bg-green-50 text-green-700 text-sm flex items-start border border-green-200">
                                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Profile Details Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-primary-900 flex items-center font-serif">
                                <User className="w-5 h-5 mr-2 text-accent-500" />
                                Personal Details
                            </h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-sm font-bold uppercase tracking-wider text-primary-600 hover:text-accent-500 flex items-center transition-colors"
                            >
                                {isEditing ? <><X className="w-4 h-4 mr-1" /> Cancel</> : <><Edit2 className="w-4 h-4 mr-1" /> Edit</>}
                            </button>
                        </div>

                        {detailsLoading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-10 bg-primary-100 rounded w-full"></div>
                                <div className="h-10 bg-primary-100 rounded w-full"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateDetails} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold tracking-wider text-primary-600 uppercase mb-1">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={userData.name}
                                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-[#E9DAC1] bg-white text-primary-900 focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-colors shadow-sm"
                                        />
                                    ) : (
                                        <p className="text-primary-900 font-medium py-2 border-b border-primary-100">{userData.name || 'Not provided'}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-primary-600 uppercase mb-1 flex items-center"><Phone className="w-3 h-3 mr-1" /> Phone Number</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={userData.phone}
                                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                                className="w-full px-4 py-3 border border-[#E9DAC1] bg-white text-primary-900 focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-colors shadow-sm"
                                            />
                                        ) : (
                                            <p className="text-primary-900 font-medium py-2 border-b border-primary-100">{userData.phone || 'Not provided'}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold tracking-wider text-primary-600 uppercase mb-1 flex items-center"><MapPin className="w-3 h-3 mr-1" /> Address</label>
                                        {isEditing ? (
                                            <textarea
                                                rows="3"
                                                value={userData.address}
                                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                                className="w-full px-4 py-3 border border-[#E9DAC1] bg-white text-primary-900 focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-colors shadow-sm resize-none"
                                            />
                                        ) : (
                                            <p className="text-primary-900 font-medium py-2 border-b border-primary-100 whitespace-pre-wrap">{userData.address || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                                {isEditing && (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-4 w-full flex justify-center items-center py-3 px-4 shadow-md text-sm font-bold text-white bg-accent-500 hover:bg-accent-400 focus:outline-none transition-colors uppercase tracking-widest disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </form>
                        )}
                    </div>

                    <hr className="border-[#E9DAC1] my-8" />

                    {/* Security Settings Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-primary-900 mb-6 flex items-center font-serif">
                            <Lock className="w-5 h-5 mr-2 text-primary-400" />
                            Security Settings
                        </h3>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold tracking-wider text-primary-600 uppercase mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#E9DAC1] bg-white text-primary-900 focus:ring-1 focus:ring-primary-300 focus:border-primary-300 outline-none transition-colors shadow-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-wider text-primary-600 uppercase mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#E9DAC1] bg-white text-primary-900 focus:ring-1 focus:ring-primary-300 focus:border-primary-300 outline-none transition-colors shadow-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto flex justify-center items-center py-3 px-6 shadow-sm text-sm font-bold text-primary-900 bg-primary-100 hover:bg-primary-200 focus:outline-none transition-colors uppercase tracking-widest"
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#E9DAC1]">
                        <button
                            onClick={handleLogout}
                            className="w-full flex justify-center items-center py-3 px-4 shadow-sm text-sm font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white transition-colors uppercase tracking-widest"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out of your account
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
