import { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { categories } from '../data/mockArtworks';
import ArtworkCard from '../components/ArtworkCard';
import { getArtworks } from '../services/artworkService';

export default function Storefront() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortOption, setSortOption] = useState('Newest');
    const [artworks, setArtworks] = useState([]);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const fetchStoreArtworks = async () => {
            try {
                const data = await getArtworks();
                setArtworks(data);
            } catch (error) {
                console.error("Error fetching artworks:", error);
            }
        };
        fetchStoreArtworks();
    }, []);

    let filteredArtworks = activeCategory === 'All'
        ? artworks
        : artworks.filter(art => art.category === activeCategory);

    // Apply Search Filter
    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        filteredArtworks = filteredArtworks.filter(art =>
            art.title.toLowerCase().includes(lowerQ) ||
            art.category.toLowerCase().includes(lowerQ)
        );
    }

    // Helper to get numeric price
    const getNumericPrice = (priceStr) => {
        if (!priceStr) return 0;
        return parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
    };

    // Apply Sorting
    if (sortOption === 'Price: Low to High') {
        filteredArtworks.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortOption === 'Price: High to Low') {
        filteredArtworks.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    }

    // Removed expensive useScroll and useTransform for performance

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen border-t-8 border-accent-500"
        >
            <Helmet>
                <title>Storefront | Rangitva</title>
                <meta name="description" content="A space for handmade paintings, custom art, graphic design, animation, and craft — rooted in Indian tradition while exploring global artforms." />
                <meta property="og:title" content="Storefront | Rangitva" />
                <meta property="og:description" content="A space for handmade paintings, custom art, graphic design, animation, and craft — rooted in Indian tradition while exploring global artforms." />
            </Helmet>

            {/* Decorative top border pattern element */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSI4Ij48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iOCIgZmlsbD0iI0E3MjgxNCIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iNCIgcj0iMiIgZmlsbD0iI0NGQUY2NSIvPjwvc3ZnPg==')] opacity-80 z-10"></div>

            {/* Hero Section */}
            <section className="relative px-4 pt-28 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
                {/* Decorative Mandala/Lotus hint in background with Parallax */}
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
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
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
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
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
                    </motion.div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="bg-transparent border border-[#E9DAC1] text-primary-800 text-sm font-semibold p-2 uppercase tracking-wide focus:outline-none focus:border-accent-500 cursor-pointer"
                    >
                        <option value="Newest">Newest</option>
                        <option value="Price: Low to High">Price: Low to High</option>
                        <option value="Price: High to Low">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Gallery */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-14">
                    <AnimatePresence mode="wait">
                        {filteredArtworks.map(artwork => (
                            <motion.div
                                key={artwork.id}
                                layoutId={`card-${artwork.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <ArtworkCard artwork={artwork} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredArtworks.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center text-primary-600 py-32 font-serif text-xl border border-[#E9DAC1] rounded-sm bg-[#FFFCF9]/50 shadow-inner"
                    >
                        No artworks found in this category right now.
                    </motion.div>
                )}
            </section>

            {/* About Section */}
            <section id="about" className="pb-32 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
                <div className="bg-[#FFFCF9] border border-[#E9DAC1] p-12 md:p-20 text-center relative overflow-hidden shadow-sm">
                    {/* Decorative element */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-300 to-transparent"></div>
                    <h2 className="text-4xl font-serif font-bold text-primary-900 mb-6">Our Story</h2>
                    <p className="text-primary-800 max-w-3xl mx-auto leading-relaxed text-lg">
                        Rangitva is a celebration of colors and tradition. Born out of a deep love for Indian heritage, we specialize in curating and creating handmade paintings, custom artwork, graphic design, and animation. Every piece tells a unique story, blending age-old techniques with contemporary vision, ensuring our art finds a special place in modern homes and hearts.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 text-center">
                <hr className="border-[#E9DAC1] mb-16" />
                <h2 className="text-4xl font-serif font-bold text-primary-900 mb-6">Get In Touch</h2>
                <p className="text-primary-800 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                    Have a vision for custom artwork or want to collaborate on an animation or design project? Reach out to us. We’d love to bring your ideas to vibrant reality.
                </p>
                <a
                    href="mailto:contact@rangitva.com"
                    className="inline-block bg-primary-900 text-[#F3E5D8] px-8 py-4 hover:bg-accent-500 hover:text-white transition-colors duration-300 font-semibold uppercase tracking-widest text-sm shadow-md"
                >
                    Contact Us
                </a>
            </section>
        </motion.div>
    );
}
