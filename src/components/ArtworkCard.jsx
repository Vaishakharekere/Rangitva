import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function ArtworkCard({ artwork }) {
    const handlePurchase = () => {
        const subject = encodeURIComponent(`Purchase Request: ${artwork.title}`);
        const body = encodeURIComponent(`Namaste Rangitva,\n\nI would like to purchase the art piece "${artwork.title}" priced at ${artwork.price}.\n\nPlease let me know the payment and delivery details.\n\nThank you!`);
        window.location.href = `mailto:rangitva@example.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="bg-[#FFFCF9] rounded-sm shadow-md border border-[#E9DAC1] overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
            <div className="relative h-80 overflow-hidden bg-primary-100/50 p-2">
                {/* Ornate inner border effect */}
                <div className="absolute inset-2 border-2 border-[#CFAF65]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                {/* Image Display */}
                <div className="w-full h-full relative">
                    {artwork.imageUrl ? (
                        <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-4 text-primary-900/40 font-serif italic text-center bg-primary-100">
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

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-accent-500">{artwork.price}</span>
                    <button
                        onClick={handlePurchase}
                        className="flex items-center space-x-2 bg-primary-900 text-[#F3E5D8] px-5 py-2 hover:bg-accent-500 hover:text-white transition-colors duration-300"
                    >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-semibold tracking-wide uppercase">Inquire</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
