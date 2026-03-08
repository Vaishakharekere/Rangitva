/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { generateEmailTemplate } from '../utils/emailTemplate';

export default function CartDrawer() {
    const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [isCheckoutMode, setIsCheckoutMode] = useState(false);
    const [checkoutComplete, setCheckoutComplete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState(() => {
        const savedInfo = localStorage.getItem('rangitva_customer_info');
        return savedInfo ? JSON.parse(savedInfo) : {
            name: '',
            email: '',
            phone: '',
            address: '',
            notes: ''
        };
    });

    // Pre-populate email/name if logged in & no saved info exists
    import('react').then(({ useEffect }) => {
        useEffect(() => {
            if (currentUser && !formData.email) {
                setFormData(prev => ({
                    ...prev,
                    name: prev.name || currentUser.displayName || '',
                    email: prev.email || currentUser.email || ''
                }));
            }
        }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps
    });

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
            return total + (numericPrice * item.quantity);
        }, 0);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderData = {
            userId: currentUser.uid,
            customerInfo: {
                ...formData,
                email: currentUser.email // force matching email
            },
            items: cartItems.map(item => ({
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: calculateTotal(),
            currency: 'INR'
        };

        try {
            await createOrder(orderData);

            // Send Email Notification via Vercel Serverless Function
            const content = `
                <p><strong>Customer:</strong> ${formData.name} (${formData.email})</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>
                <p><strong>Shipping Address:</strong><br/>${formData.address.replace(/\n/g, '<br/>') || 'None provided'}</p>
                <p><strong>Notes:</strong> ${formData.notes || 'None provided'}</p>
                <br/>
                <h3>Order Items:</h3>
                <ul>
                    ${cartItems.map(item => `<li>${item.quantity}x ${item.title} (₹${item.price})</li>`).join('\n                    ')}
                </ul>
                <br/>
                <h3 style="color: #A72814;">Total Amount: ₹${calculateTotal().toLocaleString('en-IN')}</h3>
            `;

            const emailHtml = generateEmailTemplate(
                "New Order Request Received!",
                content,
                {
                    text: "Login to Admin Dashboard",
                    link: `${window.location.origin}/login`
                }
            );

            fetch('/api/sendEmail', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    // 'to' is omitted so the backend defaults to the admin email
                    replyTo: { email: formData.email, name: formData.name },
                    subject: `New Order Request from ${formData.name}`,
                    htmlContent: emailHtml
                })
            })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    console.log('Admin notification email sent securely via Backend');
                })
                .catch(err => console.error('Failed to send admin email via Backend:', err));

            // Save address info to local storage for future use
            localStorage.setItem('rangitva_customer_info', JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                notes: '' // Do not save notes
            }));

            setCheckoutComplete(true);
            clearCart();
            // Reset form
            setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
        } catch (error) {
            console.error("Failed to submit order:", error);
            alert("Failed to send order request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseProcess = () => {
        toggleCart();
        setTimeout(() => {
            setIsCheckoutMode(false);
            setCheckoutComplete(false);
        }, 300); // Wait for drawer close animation
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseProcess}
                        className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-[#FFFCF9] shadow-2xl z-50 flex flex-col border-l border-[#E9DAC1]"
                    >
                        <div className="px-6 py-5 border-b border-[#E9DAC1] flex items-center justify-between bg-white shrink-0">
                            <h2 className="text-xl font-serif font-bold text-primary-900 flex items-center">
                                {checkoutComplete ? 'Request Sent' : (isCheckoutMode ? 'Checkout' : 'Your Selection')}
                            </h2>
                            <button onClick={handleCloseProcess} className="text-primary-600 hover:text-accent-500 transition-colors p-1">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                            {checkoutComplete ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                                    <h3 className="text-2xl font-serif text-primary-900 mb-2">Order Request Sent!</h3>
                                    <p className="text-primary-800/80 mb-8">
                                        We have received your request and will contact you shortly regarding payment and fulfillment details.
                                    </p>
                                    <button
                                        onClick={handleCloseProcess}
                                        className="bg-primary-900 text-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-accent-500 transition-colors shadow-md"
                                    >
                                        Continue Exploring
                                    </button>
                                </motion.div>
                            ) : isCheckoutMode ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                                    className="p-6"
                                >
                                    <button onClick={() => setIsCheckoutMode(false)} className="text-sm font-semibold tracking-wide text-primary-600 hover:text-accent-500 mb-6 flex items-center uppercase">
                                        ← Back to Cart
                                    </button>

                                    <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest font-bold text-primary-800">Full Name *</label>
                                            <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full bg-white border border-[#E9DAC1] p-3 text-sm focus:outline-none focus:border-accent-500" placeholder="e.g. Aditi Rao" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest font-bold text-primary-800">Email Address *</label>
                                            <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-white border border-[#E9DAC1] p-3 text-sm focus:outline-none focus:border-accent-500" placeholder="aditi@example.com" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest font-bold text-primary-800">Phone Number *</label>
                                            <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-white border border-[#E9DAC1] p-3 text-sm focus:outline-none focus:border-accent-500" placeholder="+91 98765 43210" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest font-bold text-primary-800">Shipping Address *</label>
                                            <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full bg-white border border-[#E9DAC1] p-3 text-sm focus:outline-none focus:border-accent-500 resize-none" placeholder="Complete address with pincode / zip..."></textarea>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest font-bold text-primary-800">Order Notes (Optional)</label>
                                            <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2} className="w-full bg-white border border-[#E9DAC1] p-3 text-sm focus:outline-none focus:border-accent-500 resize-none" placeholder="Special requests or framing instructions..."></textarea>
                                        </div>

                                        <div className="pt-4 border-t border-[#E9DAC1] mt-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-primary-800 font-medium font-serif italic">Total to pay later</span>
                                                <span className="text-2xl font-bold text-accent-500">₹{calculateTotal().toLocaleString('en-IN')}</span>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold text-white uppercase tracking-widest shadow-[0_4px_14px_0_rgba(167,40,20,0.39)] transition-colors ${isSubmitting ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary-900 hover:bg-accent-500'}`}
                                            >
                                                {isSubmitting ? 'Sending Request...' : 'Submit Order Request'}
                                            </button>
                                            <p className="text-[10px] uppercase text-center text-primary-400 font-bold mt-4 tracking-wider leading-relaxed">
                                                No payment required now.<br />We will contact you to finalize the order.
                                            </p>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="p-6 space-y-6">
                                    {cartItems.length === 0 ? (
                                        <div className="h-48 flex flex-col items-center justify-center text-primary-600/60 opacity-70">
                                            <ShoppingBag className="w-16 h-16 mb-4" strokeWidth={1} />
                                            <p className="font-serif italic text-lg text-center">Your canvas is empty.</p>
                                        </div>
                                    ) : (
                                        <AnimatePresence mode="popLayout">
                                            {cartItems.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                                    className="flex gap-4 p-3 border border-[#E9DAC1] bg-white shadow-sm"
                                                >
                                                    <div className="w-20 h-20 bg-primary-50 shrink-0 overflow-hidden relative">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-[10px] text-primary-400 font-serif italic text-center p-1">No Image</div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 flex flex-col">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="font-bold text-primary-900 text-sm leading-tight pr-2">{item.title}</h3>
                                                            <button onClick={() => removeFromCart(item.id)} className="text-primary-400 hover:text-red-500 transition-colors p-1">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-accent-500 font-bold text-sm mt-1">{item.price}</p>

                                                        <div className="mt-auto flex items-center space-x-3 bg-primary-50 w-fit px-2 py-1 border border-primary-100">
                                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-primary-600 hover:text-accent-500 transition-colors p-0.5">
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="text-xs font-bold text-primary-900 w-4 text-center">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-primary-600 hover:text-accent-500 transition-colors p-0.5">
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Standard Cart Footer */}
                        {!isCheckoutMode && !checkoutComplete && cartItems.length > 0 && (
                            <div className="border-t border-[#E9DAC1] bg-white p-6 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] shrink-0">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-primary-800 font-medium">Estimated Total</span>
                                    <span className="text-2xl font-bold text-primary-900">₹{calculateTotal().toLocaleString('en-IN')}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        if (currentUser) {
                                            setIsCheckoutMode(true);
                                        } else {
                                            toggleCart();
                                            navigate('/login');
                                        }
                                    }}
                                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold text-white bg-primary-900 hover:bg-accent-500 focus:outline-none transition-colors uppercase tracking-widest shadow-[0_4px_14px_0_rgba(167,40,20,0.39)]"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
