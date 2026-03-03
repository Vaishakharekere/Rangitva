import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                        <Link to="/" className={`text-[13px] font-bold tracking-[0.1em] uppercase transition-colors hover:text-accent-500 ${location.pathname === '/' ? 'text-accent-500' : 'text-primary-800'}`}>Gallery</Link>
                        <Link to="/#about" className="text-[13px] font-bold tracking-[0.1em] uppercase text-primary-800 hover:text-accent-500 transition-colors">About Story</Link>
                        <Link to="/#contact" className="text-[13px] font-bold tracking-[0.1em] uppercase text-primary-800 hover:text-accent-500 transition-colors">Contact</Link>
                    </nav>

                    {/* Action Area */}
                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex items-center space-x-4 text-primary-600">
                            <button className="hover:text-accent-500 transition-colors"><Search className="w-5 h-5" /></button>
                            <button className="hover:text-accent-500 transition-colors"><ShoppingBag className="w-5 h-5" /></button>
                        </div>

                        <div className="hidden md:flex items-center space-x-4 pl-4 border-l border-primary-100">
                            <Link to="/login" className="text-[13px] font-bold uppercase tracking-wider text-primary-800 hover:text-accent-500 transition-colors">Log In</Link>
                        </div>

                        <button className="md:hidden text-primary-900 hover:text-accent-500">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}
