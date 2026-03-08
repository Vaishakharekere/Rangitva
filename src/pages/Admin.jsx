import { useState, useEffect } from 'react';
import { getArtworks, addArtwork, updateArtwork, deleteArtwork } from '../services/artworkService';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { Pencil, Trash2, Plus, X, Package, Image as ImageIcon } from 'lucide-react';
import { generateEmailTemplate } from '../utils/emailTemplate';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Admin() {
    const [activeTab, setActiveTab] = useState('Artworks');
    const [artworks, setArtworks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Handmade Paintings',
        description: '',
        price: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (activeTab === 'Artworks') {
            fetchArtworks();
        } else {
            fetchOrdersData();
        }
    }, [activeTab]);

    const fetchArtworks = async () => {
        setLoading(true);
        try {
            const data = await getArtworks();
            setArtworks(data);
        } catch (error) {
            console.error("Error fetching artworks:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrdersData = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            // Sort by newest first
            data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderStatusChange = async (orderId, newStatus) => {
        const order = orders.find(o => o.id === orderId);
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrdersData(); // Re-fetch to guarantee sync

            // Send Email Notification to Customer via Vercel Backend
            if (order && order.customerInfo?.email) {
                const content = `
                    <p>Hi ${order.customerInfo.name},</p>
                    <p>Your order status for the artwork request has been updated to: <strong><span style="color: #A72814;">${newStatus}</span></strong></p>
                    <p>If you have any questions about this update or your order, feel free to reply to this email.</p>
                    <br/>
                    <p>Thank you for choosing Rangitva!</p>
                `;

                const emailHtml = generateEmailTemplate(
                    "Order Status Update",
                    content,
                    {
                        text: "View My Orders",
                        link: `${window.location.origin}/my-orders`
                    }
                );

                fetch('/api/sendEmail', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: [{ email: order.customerInfo.email, name: order.customerInfo.name }],
                        subject: `Order Status Update: ${newStatus}`,
                        htmlContent: emailHtml
                    })
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        console.log('Customer notification email sent securely via Backend');
                    })
                    .catch(err => console.error('Failed to send customer email via Backend:', err));
            }

        } catch (error) {
            console.error("Failed to update status", error);
            fetchOrdersData(); // revert
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsUploading(true);
        let finalImageUrl = formData.imageUrl;

        if (imageFile) {
            try {
                const imgData = new FormData();
                imgData.append('image', imageFile);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: imgData
                });

                const data = await response.json();

                if (data.success) {
                    finalImageUrl = data.data.url;
                } else {
                    throw new Error(data.error.message || 'Error occurred while uploading');
                }
            } catch (err) {
                console.error("Image upload failed via ImgBB", err);
                alert("Image upload failed. Please check the file size (Max 32MB) or try again.");
                setIsUploading(false);
                return;
            }
        }
        setIsUploading(false);

        // Optimistic UI update for instant feedback
        const temporaryId = editingId || Date.now().toString();
        const artworkToSave = { ...formData, imageUrl: finalImageUrl, id: temporaryId };

        setShowForm(false);
        resetForm();

        try {
            if (editingId) {
                // Optimistically update local state
                setArtworks(prev => prev.map(art => art.id === editingId ? artworkToSave : art));
                await updateArtwork(editingId, { ...formData, imageUrl: finalImageUrl });
            } else {
                // Optimistically add to local state
                setArtworks(prev => [artworkToSave, ...prev]);
                const newArtwork = await addArtwork({ ...formData, imageUrl: finalImageUrl });
                // Replace temporary optimistic ID with real Firestore ID
                setArtworks(prev => prev.map(art => art.id === temporaryId ? newArtwork : art));
            }
        } catch (error) {
            console.error("Error saving artwork:", error);
            // Revert on failure by refetching actual state
            fetchArtworks();
            alert("Failed to save artwork. Please check your database rules or connection.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this artwork?")) {
            // Optimistic delete
            const previousArtworks = [...artworks];
            setArtworks(prev => prev.filter(art => art.id !== id));

            try {
                await deleteArtwork(id);
            } catch (error) {
                console.error("Error deleting artwork:", error);
                // Revert on failure
                setArtworks(previousArtworks);
                alert("Failed to delete artwork. Please check your database rules.");
            }
        }
    };

    const handleEdit = (artwork) => {
        setFormData({
            title: artwork.title,
            category: artwork.category,
            description: artwork.description,
            price: artwork.price,
            imageUrl: artwork.imageUrl || ''
        });
        setEditingId(artwork.id);
        setImageFile(null);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'Handmade Paintings',
            description: '',
            price: '',
            imageUrl: ''
        });
        setImageFile(null);
        setEditingId(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 py-12 lg:py-16"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 font-serif">Admin Dashboard</h1>
                    <p className="mt-2 text-primary-600">Manage your portfolio and track orders efficiently.</p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex bg-white shadow-sm border border-[#E9DAC1] rounded-sm overflow-hidden">
                        <button
                            onClick={() => setActiveTab('Artworks')}
                            className={`px-4 py-2 flex items-center text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'Artworks' ? 'bg-primary-900 text-[#F3E5D8]' : 'text-primary-600 hover:bg-primary-50'}`}
                        >
                            <ImageIcon className="w-4 h-4 mr-2" /> Artworks
                        </button>
                        <button
                            onClick={() => setActiveTab('Orders')}
                            className={`px-4 py-2 flex items-center text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'Orders' ? 'bg-primary-900 text-[#F3E5D8]' : 'text-primary-600 hover:bg-primary-50'}`}
                        >
                            <Package className="w-4 h-4 mr-2" /> Orders
                        </button>
                    </div>

                    {activeTab === 'Artworks' && (
                        <button
                            onClick={() => {
                                resetForm();
                                setShowForm(!showForm);
                            }}
                            className="flex items-center space-x-2 bg-accent-500 text-white px-5 py-2.5 rounded-sm hover:bg-accent-600 transition-colors shadow-md font-medium uppercase tracking-wider text-sm"
                        >
                            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            <span className="hidden sm:inline">{showForm ? 'Close Form' : 'Add Artwork'}</span>
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[#FFFCF9] p-8 rounded-sm shadow-lg border border-[#E9DAC1]">
                            <h2 className="text-2xl font-bold text-primary-900 mb-6 font-serif border-b border-[#E9DAC1] pb-4">
                                {editingId ? 'Edit Artwork' : 'Publish New Artwork'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold tracking-wide uppercase text-primary-800 mb-2">Title</label>
                                        <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 border border-[#E9DAC1] bg-white text-primary-900 focus:outline-none focus:border-accent-500 transition-colors shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold tracking-wide uppercase text-primary-800 mb-2">Category</label>
                                        <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 border border-[#E9DAC1] bg-white text-primary-900 focus:outline-none focus:border-accent-500 transition-colors shadow-sm cursor-pointer">
                                            <option value="Handmade Paintings">Handmade Paintings</option>
                                            <option value="Custom Art">Custom Art</option>
                                            <option value="Graphic Design">Graphic Design</option>
                                            <option value="Animation">Animation</option>
                                            <option value="Craft">Craft</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold tracking-wide uppercase text-primary-800 mb-2">Price (e.g. ₹1,500)</label>
                                        <input required type="text" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-3 border border-[#E9DAC1] bg-white text-primary-900 focus:outline-none focus:border-accent-500 transition-colors shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold tracking-wide uppercase text-primary-800 mb-2">Image Upload</label>
                                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-2.5 border border-[#E9DAC1] bg-white text-primary-900 focus:outline-none focus:border-accent-500 transition-colors shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:bg-primary-50 file:text-primary-800 hover:file:bg-primary-100 cursor-pointer" />
                                        {formData.imageUrl && !imageFile && (
                                            <p className="text-xs text-primary-500 mt-2 truncate">Current: {formData.imageUrl}</p>
                                        )}
                                        {imageFile && (
                                            <p className="text-xs text-accent-500 mt-2 truncate">Selected: {imageFile.name}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold tracking-wide uppercase text-primary-800 mb-2">Description</label>
                                        <textarea required name="description" rows="4" value={formData.description} onChange={handleInputChange} className="w-full p-3 border border-[#E9DAC1] bg-white text-primary-900 focus:outline-none focus:border-accent-500 transition-colors shadow-sm resize-none"></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-6 border-t border-[#E9DAC1]">
                                    <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="text-primary-600 hover:text-primary-900 px-6 py-2.5 mr-4 transition-colors font-medium">Cancel</button>
                                    <button type="submit" disabled={isUploading} className={`text-[#F3E5D8] px-8 py-2.5 rounded-sm shadow-md font-bold uppercase tracking-wider text-sm flex items-center transition-colors ${isUploading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-900 hover:bg-accent-500'}`}>
                                        {isUploading ? 'Uploading...' : (editingId ? 'Update Masterpiece' : 'Publish Masterpiece')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {activeTab === 'Artworks' ? (
                <div className="bg-white rounded-sm shadow-xl border border-[#E9DAC1] overflow-hidden mt-4">
                    {/* Header Row (Hidden on Mobile) */}
                    <div className="hidden md:flex bg-primary-900 text-[#F3E5D8] border-b border-[#E9DAC1] p-5">
                        <div className="w-1/2 text-xs font-bold uppercase tracking-widest">Artwork Info</div>
                        <div className="w-1/6 text-xs font-bold uppercase tracking-widest">Category</div>
                        <div className="w-1/6 text-xs font-bold uppercase tracking-widest">Price</div>
                        <div className="w-1/6 text-xs font-bold uppercase tracking-widest text-right">Actions</div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-primary-600 font-serif italic">Loading masterpieces...</div>
                    ) : artworks.length === 0 ? (
                        <div className="p-16 text-center text-primary-600 flex flex-col items-center">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-300">
                                <Plus size={32} />
                            </div>
                            <p className="font-serif italic text-lg">No artworks published yet. Add your first piece!</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="flex flex-col divide-y divide-[#E9DAC1]"
                        >
                            {artworks.map(art => (
                                <motion.div
                                    variants={itemVariants}
                                    key={art.id}
                                    className="flex flex-col md:flex-row md:items-center w-full hover:bg-primary-50 transition-colors p-4 md:p-5 gap-4 md:gap-0"
                                >
                                    <div className="w-full md:w-1/2 flex items-center space-x-5 pr-4">
                                        <div className="w-20 h-20 rounded-sm overflow-hidden bg-primary-100 flex-shrink-0 shadow-inner border border-primary-200">
                                            {art.imageUrl ? (
                                                <img src={art.imageUrl} alt={art.title} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image' }} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-primary-400 font-serif italic">No image</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-primary-900 text-lg leading-tight truncate">{art.title}</div>
                                            <div className="text-sm text-primary-600 truncate mt-1 max-w-xs md:max-w-md">{art.description}</div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/6 flex items-center md:items-start justify-between md:justify-start">
                                        <span className="md:hidden text-xs font-bold text-primary-400 uppercase tracking-wider">Category</span>
                                        <span className="inline-block px-3 py-1 bg-white text-accent-500 text-[10px] uppercase tracking-widest font-bold shadow-sm border border-[#E9DAC1]">
                                            {art.category}
                                        </span>
                                    </div>

                                    <div className="w-full md:w-1/6 flex items-center md:items-start justify-between md:justify-start font-bold text-primary-900">
                                        <span className="md:hidden text-xs font-bold text-primary-400 uppercase tracking-wider">Price</span>
                                        <span>{art.price}</span>
                                    </div>

                                    <div className="w-full md:w-1/6 flex justify-end space-x-3 mt-2 md:mt-0 pt-4 md:pt-0 border-t border-[#E9DAC1] md:border-0">
                                        <button onClick={() => handleEdit(art)} className="flex items-center justify-center p-2.5 flex-1 md:flex-none bg-white border border-[#E9DAC1] text-primary-600 hover:text-accent-500 hover:border-accent-500 shadow-sm transition-all rounded-sm" title="Edit">
                                            <Pencil className="w-4 h-4 mr-2 md:mr-0" /> <span className="md:hidden text-xs font-bold">Edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(art.id)} className="flex items-center justify-center p-2.5 flex-1 md:flex-none bg-white border border-[#E9DAC1] text-primary-600 hover:text-red-500 hover:border-red-500 shadow-sm transition-all rounded-sm" title="Delete">
                                            <Trash2 className="w-4 h-4 mr-2 md:mr-0" /> <span className="md:hidden text-xs font-bold">Delete</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-sm shadow-xl border border-[#E9DAC1] overflow-hidden mt-4 p-6">
                    <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6 border-b border-[#E9DAC1] pb-4">Order Requests</h2>

                    {loading ? (
                        <div className="p-12 text-center text-primary-600 font-serif italic">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="p-16 text-center text-primary-600 flex flex-col items-center">
                            <Package className="w-16 h-16 mb-4 text-primary-300" strokeWidth={1} />
                            <p className="font-serif italic text-lg">No order requests yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {orders.map(order => (
                                <div key={order.id} className="border border-[#E9DAC1] p-5 shadow-sm bg-[#FFFCF9]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-primary-900">{order.customerInfo.name}</h3>
                                            <p className="text-sm text-primary-600 border-b border-primary-200 pb-2 mb-2 inline-block"><a href={`mailto:${order.customerInfo.email}`}>{order.customerInfo.email}</a> • {order.customerInfo.phone}</p>
                                        </div>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                            className={`text-xs font-bold uppercase tracking-widest p-1.5 border ${order.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : order.status === 'Processing' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-primary-600 border-[#E9DAC1]'}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-xs uppercase tracking-widest font-bold text-primary-400 mb-1">Shipping Address Note</div>
                                        <p className="text-sm text-primary-800">{order.customerInfo.address}</p>
                                        {order.customerInfo.notes && <p className="text-sm text-primary-600 mt-2 p-2 bg-primary-50 italic">Note: {order.customerInfo.notes}</p>}
                                    </div>

                                    <div className="bg-white p-3 border border-primary-100 mb-4">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm py-1">
                                                <span>{item.quantity}x {item.title}</span>
                                                <span className="text-primary-600">{item.price}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-[#E9DAC1]">
                                        <span className="text-sm font-bold uppercase tracking-widest text-primary-600">Total</span>
                                        <span className="font-bold text-accent-500">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
