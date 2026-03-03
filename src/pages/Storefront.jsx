import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockArtworks, categories } from '../data/mockArtworks';
import ArtworkCard from '../components/ArtworkCard';

export default function Storefront() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredArtworks = activeCategory === 'All'
        ? mockArtworks
        : mockArtworks.filter(art => art.category === activeCategory);

    return (
        <div className="relative min-h-screen border-t-8 border-accent-500">

            {/* Decorative top border pattern element */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSI4Ij48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iOCIgZmlsbD0iI0E3MjgxNCIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iNCIgcj0iMiIgZmlsbD0iI0NGQUY2NSIvPjwvc3ZnPg==')] opacity-80 z-10"></div>

            {/* Hero Section */}
            <section className="relative px-4 pt-28 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
                {/* Decorative Mandala/Lotus hint in background */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5 pointer-events-none"
                >
                    <svg viewBox="0 0 100 100" fill="#A72814"><path d="M50 0 C55 40, 90 45, 100 50 C90 55, 55 60, 50 100 C45 60, 10 55, 0 50 C10 45, 45 40, 50 0 Z" /></svg>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-primary-900 tracking-tight font-serif mb-4">
                        Welcome to <span className="text-accent-500 italic px-2 relative inline-block">
                            Rangitva
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold-500 opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10" fill="none" stroke="currentColor" strokeWidth="4" /></svg>
                        </span> 🪷
                    </h1>
                    <p className="mt-8 text-lg md:text-xl text-primary-800 max-w-3xl mx-auto font-medium leading-relaxed">
                        A space for handmade paintings, custom art, graphic design, animation, and craft —
                        <br className="hidden md:block" /> rooted in Indian tradition while exploring global artforms.
                    </p>

                    <div className="flex justify-center items-center mt-10 space-x-4 opacity-70">
                        <span className="w-16 h-px bg-primary-600"></span>
                        <span className="text-gold-500 text-2xl">♦</span>
                        <span className="w-16 h-px bg-primary-600"></span>
                    </div>
                </motion.div>
            </section>

            {/* Category / Filter Nav */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 border-b-2 transition-all text-sm font-semibold tracking-wider uppercase bg-transparent
                ${activeCategory === cat
                                    ? 'border-accent-500 text-accent-500'
                                    : 'border-transparent text-primary-600 hover:text-primary-900 hover:border-gold-500'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 relative z-10">
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-14">
                    <AnimatePresence mode="popLayout">
                        {filteredArtworks.map(artwork => (
                            <motion.div
                                key={artwork.id}
                                layout
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                            >
                                <ArtworkCard artwork={artwork} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredArtworks.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center text-primary-600 py-32 font-serif text-xl border border-[#E9DAC1] rounded-sm bg-[#FFFCF9]/50 shadow-inner"
                    >
                        No artworks found in this category right now.
                    </motion.div>
                )}
            </section>
        </div>
    );
}
