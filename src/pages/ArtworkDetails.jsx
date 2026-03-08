import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../contexts/CartContext';
import { getArtworks } from '../services/artworkService';
import { useAuth } from '../contexts/AuthContext';

export default function ArtworkDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { currentUser } = useAuth();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);

    // Basic wishlist toggle for now
    const [inWishlist, setInWishlist] = useState(false);
    useEffect(() => {
        const stored = localStorage.getItem('rangitva_wishlist');
        if (stored) {
            const arr = JSON.parse(stored);
            if (arr.includes(id)) setInWishlist(true);
        }
    }, [id]);

    const toggleWishlist = () => {
        if (!currentUser) {
            alert("Please log in to save artworks to your Wishlist!");
            navigate('/login');
            return;
        }

        setInWishlist(!inWishlist);
        const stored = localStorage.getItem('rangitva_wishlist');
        let arr = stored ? JSON.parse(stored) : [];
        if (arr.includes(id)) {
            arr = arr.filter(itemId => itemId !== id);
        } else {
            arr.push(id);
        }
        localStorage.setItem('rangitva_wishlist', JSON.stringify(arr));
    };

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const firestoreData = await getArtworks();
                const found = firestoreData.find(art => art.id.toString() === id);
                setArtwork(found);
            } catch (error) {
                console.error("Error fetching details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-primary-600 font-serif text-xl border-t-8 border-accent-500">Loading masterpiece...</div>;
    }

    if (!artwork) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center border-t-8 border-accent-500 text-center px-4">
                <h2 className="text-3xl font-serif text-primary-900 mb-4">Artwork Not Found</h2>
                <button onClick={() => navigate('/')} className="text-accent-500 hover:underline">Return to Gallery</button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen bg-[#FFFCF9] border-t-8 border-accent-500 pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <Helmet>
                <title>{artwork.title} | Rangitva</title>
                <meta name="description" content={artwork.description} />
                <meta property="og:title" content={`${artwork.title} | Rangitva`} />
                <meta property="og:description" content={artwork.description} />
                {artwork.imageUrl && <meta property="og:image" content={artwork.imageUrl} />}
                <meta property="og:type" content="product" />
            </Helmet>

            <button onClick={() => navigate(-1)} className="flex items-center text-primary-600 hover:text-accent-500 transition-colors mb-8 font-semibold tracking-wider text-sm uppercase">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
                {/* Image Section */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                        className="relative w-full max-w-lg aspect-[4/5] bg-primary-100 shadow-2xl border-4 border-white p-2"
                    >
                        <div className="absolute inset-2 border-2 border-[#CFAF65]/20 pointer-events-none z-10"></div>
                        {artwork.imageUrl ? (
                            <img src={artwork.imageUrl} alt={artwork.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary-400 font-serif">No Image</div>
                        )}
                    </motion.div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <div className="text-accent-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">{artwork.category}</div>
                        <h1 className="text-4xl lg:text-5xl font-bold font-serif text-primary-900 leading-tight mb-6">{artwork.title}</h1>
                        <div className="w-16 h-1 bg-[#CFAF65] mb-8"></div>
                        <p className="text-primary-800 text-lg leading-relaxed mb-8">{artwork.description}</p>

                        <div className="flex items-center space-x-6 mb-10 text-primary-600 border-y border-[#E9DAC1] py-4">
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-widest font-bold">Medium</span>
                                <span className="font-serif italic text-lg text-primary-900">{artwork.medium || 'Mixed Media'}</span>
                            </div>
                            <div className="h-10 w-px bg-[#E9DAC1]"></div>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-widest font-bold">Dimensions</span>
                                <span className="font-serif italic text-lg text-primary-900">{artwork.dimensions || 'Contact for specifics'}</span>
                            </div>
                        </div>

                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className="block text-xs uppercase tracking-widest font-bold text-primary-600 mb-1">Price</span>
                                <span className="text-3xl font-bold text-accent-500">{artwork.price}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => addToCart(artwork)}
                                className="flex-1 flex items-center justify-center bg-primary-900 text-white py-4 px-6 hover:bg-accent-500 transition-colors uppercase tracking-widest font-bold shadow-lg"
                            >
                                <ShoppingBag className="w-5 h-5 mr-3" /> Add to Cart
                            </button>
                            <button onClick={toggleWishlist} className={`flex items-center justify-center border-2 py-4 px-6 transition-colors uppercase tracking-widest font-bold ${inWishlist ? 'bg-red-50 text-red-500 border-red-200' : 'bg-[#FFFCF9] border-primary-900 text-primary-900 hover:bg-primary-50'}`}>
                                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
