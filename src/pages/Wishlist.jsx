import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { getArtworks } from '../services/artworkService';
import ArtworkCard from '../components/ArtworkCard';
import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const stored = localStorage.getItem('rangitva_wishlist');
            if (!stored) {
                setWishlistItems([]);
                setLoading(false);
                return;
            }

            const storedIds = JSON.parse(stored);
            if (!Array.isArray(storedIds) || storedIds.length === 0) {
                setWishlistItems([]);
                setLoading(false);
                return;
            }

            const allArtworks = await getArtworks();
            const wishlistData = allArtworks.filter(art => storedIds.includes(art.id.toString()));
            setWishlistItems(wishlistData);
        } catch (error) {
            console.error("Error fetching wishlist items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (id) => {
        const stored = localStorage.getItem('rangitva_wishlist');
        if (stored) {
            let arr = JSON.parse(stored);
            arr = arr.filter(itemId => itemId !== id.toString());
            localStorage.setItem('rangitva_wishlist', JSON.stringify(arr));

            // Optimistically update UI
            setWishlistItems(prev => prev.filter(item => item.id.toString() !== id.toString()));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#FFFCF9] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <Helmet>
                <title>My Wishlist | Rangitva</title>
                <meta name="description" content="View your favorite artworks saved to your wishlist." />
            </Helmet>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-4 tracking-tight">Your Saved Favorites</h1>
                <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mb-6"></div>
                <p className="text-primary-600 max-w-2xl mx-auto">Masterpieces you've set your heart on.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-white p-8 rounded-2xl shadow-sm border border-[#E9DAC1]">
                    <HeartCrack className="w-16 h-16 text-primary-300 mb-6" />
                    <h2 className="text-2xl font-serif text-primary-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-primary-600 mb-8 max-w-md">You haven't added any artworks to your wishlist yet. Explore our collection and find something beautiful.</p>
                    <Link
                        to="/"
                        className="bg-primary-900 text-white px-8 py-3 hover:bg-accent-500 transition-colors uppercase tracking-widest font-bold text-sm shadow-md"
                    >
                        Explore Gallery
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {wishlistItems.map((artwork) => (
                            <motion.div
                                key={artwork.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="relative group"
                            >
                                <ArtworkCard artwork={artwork} />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemove(artwork.id);
                                    }}
                                    className="absolute top-4 right-4 z-20 bg-white/90 p-2 rounded-full shadow-md text-red-500 hover:bg-red-50 hover:scale-110 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                                    title="Remove from Wishlist"
                                >
                                    <HeartCrack className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}
