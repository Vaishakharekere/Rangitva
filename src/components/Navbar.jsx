/* eslint-disable no-unused-vars */
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { currentUser, isAdmin } = useAuth();
    const { toggleCart, cartTotalCount } = useCart();
    const searchInputRef = useRef(null);

    // Sync search input with URL if present
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setTimeout(() => {
                setSearchQuery(q);
                setSearchOpen(true);
            }, 0);
        } else {
            setTimeout(() => setSearchQuery(''), 0);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/');
        }
    };

    const toggleSearch = () => {
        if (searchOpen && !searchQuery) {
            setSearchOpen(false);
        } else if (!searchOpen) {
            setSearchOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#FAFAFA]/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl font-black tracking-tighter text-primary-900 group-hover:text-accent-500 transition-colors uppercase font-serif">
                            Rangitva<span className="text-accent-500 text-sm ml-1 align-top tracking-normal normal-case">🪷</span>
                        </span>
                    </Link>

                    {/* Main Navigation */}
                    <nav className="hidden md:flex items-center space-x-10">
                        <Link to="/" className={`text-[13px] font-bold tracking-[0.1em] uppercase transition-colors hover:text-accent-500 ${location.pathname === '/' && !location.hash && !searchParams.get('q') ? 'text-accent-500' : 'text-primary-800'}`}>Gallery</Link>
                        <a href="/#about" onClick={(e) => { e.preventDefault(); if (location.pathname !== '/') { window.location.href = '/#about'; } else { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); } }} className="text-[13px] font-bold tracking-[0.1em] uppercase text-primary-800 hover:text-accent-500 transition-colors cursor-pointer">About Story</a>
                        <a href="/#contact" onClick={(e) => { e.preventDefault(); if (location.pathname !== '/') { window.location.href = '/#contact'; } else { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); } }} className="text-[13px] font-bold tracking-[0.1em] uppercase text-primary-800 hover:text-accent-500 transition-colors cursor-pointer">Contact</a>
                    </nav>

                    {/* Action Area */}
                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex items-center space-x-4 text-primary-600">

                            {/* Search */}
                            <form onSubmit={handleSearchSubmit} className="flex items-center relative h-8">
                                <AnimatePresence>
                                    {searchOpen && (
                                        <motion.input
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 180, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
                                            placeholder="Search artworks..."
                                            className="absolute right-6 h-full border-b border-primary-300 bg-transparent text-sm focus:outline-none focus:border-accent-500 px-2 text-primary-900 placeholder-primary-400"
                                        />
                                    )}
                                </AnimatePresence>
                                <button type="button" onClick={toggleSearch} className="hover:text-accent-500 transition-colors z-10 w-5 h-5 flex items-center justify-center">
                                    <Search className="w-5 h-5 shrink-0" />
                                </button>
                            </form>

                            {/* Cart */}
                            {!isAdmin && (
                                <button onClick={toggleCart} className="hover:text-accent-500 transition-colors relative group h-8 flex items-center">
                                    <ShoppingBag className="w-5 h-5 shrink-0" />
                                    {cartTotalCount > 0 && (
                                        <span className="absolute -top-1 -right-2 bg-accent-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full z-10">
                                            {cartTotalCount}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="hidden md:flex items-center space-x-4 pl-4 border-l border-primary-100">
                            {currentUser ? (
                                <>
                                    {isAdmin && <Link to="/admin" className="text-[13px] font-bold uppercase tracking-wider text-primary-800 hover:text-accent-500 transition-colors">Admin</Link>}
                                    {!isAdmin && <Link to="/my-orders" className="text-[13px] font-bold uppercase tracking-wider text-primary-800 hover:text-accent-500 transition-colors">Orders</Link>}
                                    <Link to="/profile" className="text-[13px] font-bold uppercase tracking-wider text-primary-800 hover:text-accent-500 transition-colors bg-primary-50 px-3 py-1.5 rounded-sm">Profile</Link>
                                </>
                            ) : (
                                <Link to="/login" className="text-[13px] font-bold uppercase tracking-wider text-primary-800 hover:text-accent-500 transition-colors">Log In</Link>
                            )}
                        </div>

                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-primary-900 hover:text-accent-500 z-50 relative">
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#FAFAFA] border-t border-primary-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
                            <Link onClick={() => setMenuOpen(false)} to="/" className="text-sm font-bold tracking-widest uppercase text-primary-900 hover:text-accent-500 block py-2 border-b border-primary-100/50">Gallery</Link>
                            <Link onClick={() => setMenuOpen(false)} to="/#about" className="text-sm font-bold tracking-widest uppercase text-primary-800 hover:text-accent-500 block py-2 border-b border-primary-100/50">About Story</Link>
                            <Link onClick={() => setMenuOpen(false)} to="/#contact" className="text-sm font-bold tracking-widest uppercase text-primary-800 hover:text-accent-500 block py-2 border-b border-primary-100/50">Contact</Link>

                            <div className="pt-4 flex flex-col space-y-3">
                                {currentUser ? (
                                    <>
                                        {!isAdmin && <Link onClick={() => setMenuOpen(false)} to="/my-orders" className="text-sm font-bold uppercase tracking-wider text-primary-800 block">My Orders</Link>}
                                        <Link onClick={() => setMenuOpen(false)} to="/profile" className="text-sm font-bold uppercase tracking-wider text-primary-800 block">My Profile</Link>
                                        {isAdmin && <Link onClick={() => setMenuOpen(false)} to="/admin" className="text-sm font-bold uppercase tracking-wider text-primary-800 block">Admin Dashboard</Link>}
                                    </>
                                ) : (
                                    <Link onClick={() => setMenuOpen(false)} to="/login" className="text-sm font-bold uppercase tracking-wider text-primary-800 block">Log In</Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
