/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function ArtworkCard({ artwork }) {
    const { addToCart } = useCart();
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="h-full bg-[#FFFCF9] rounded-sm shadow-md hover:shadow-2xl border border-[#E9DAC1] overflow-hidden flex flex-col group transition-shadow duration-500"
        >
            <div className="relative h-80 overflow-hidden bg-primary-100/50 p-2">
                {/* Ornate inner border effect */}
                <div className="absolute inset-2 border-2 border-[#CFAF65]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                {/* Image Display */}
                <div className="w-full h-full relative bg-primary-100 flex items-center justify-center">
                    {/* Elegant Skeleton Pulse while image loads */}
                    {!imageLoaded && artwork.imageUrl && (
                        <div className="absolute inset-0 bg-primary-200/50 animate-pulse"></div>
                    )}

                    {artwork.imageUrl ? (
                        <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            onLoad={() => setImageLoaded(true)}
                            loading="lazy"
                            decoding="async"
                            className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-4 text-primary-900/40 font-serif italic text-center relative z-10">
                            [Image of {artwork.title}]
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow relative">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-accent-500 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 shadow-md">
                    {artwork.category}
                </div>

                <h3 className="text-2xl font-bold text-primary-900 mb-2 mt-2 leading-tight">{artwork.title}</h3>

                {/* Subtle decorative line */}
                <div className="w-12 h-0.5 bg-accent-400 mb-4"></div>

                <p className="text-primary-800/80 text-sm mb-8 flex-grow leading-relaxed font-sans">{artwork.description}</p>

                <div className="flex items-center justify-between mt-auto gap-2">
                    <span className="text-xl font-bold text-accent-500 shrink-0">{artwork.price}</span>
                    <div className="flex gap-2">
                        <Link
                            to={`/artwork/${artwork.id}`}
                            className="flex items-center justify-center p-2 bg-[#FFFCF9] border border-primary-900 text-primary-900 hover:bg-primary-50 transition-colors duration-300"
                            title="View Details"
                        >
                            <Eye className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => addToCart(artwork)}
                            className="flex items-center space-x-2 bg-primary-900 text-[#F3E5D8] px-3 sm:px-4 py-2 hover:bg-accent-500 hover:text-white transition-colors duration-300 shrink-0"
                            title="Add to Cart"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span className="text-sm font-semibold tracking-wide uppercase hidden sm:inline">Add</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
