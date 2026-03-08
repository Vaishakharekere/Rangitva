import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getOrdersByUserId } from '../services/orderService';
import { Link } from 'react-router-dom';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (currentUser?.uid) {
                try {
                    const data = await getOrdersByUserId(currentUser.uid);
                    setOrders(data);
                } catch (error) {
                    console.error("Failed to fetch user orders:", error);
                }
            }
            setLoading(false);
        };
        fetchMyOrders();
    }, [currentUser]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-4 py-12 lg:py-16"
        >
            <h1 className="text-3xl font-bold text-primary-900 font-serif mb-8 text-center sm:text-left">My Order History</h1>

            {loading ? (
                <div className="p-12 text-center text-primary-600 font-serif italic">Loading your orders...</div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-sm shadow-sm border border-[#E9DAC1] p-16 text-center text-primary-600 flex flex-col items-center">
                    <Package className="w-16 h-16 mb-4 text-primary-300" strokeWidth={1} />
                    <p className="font-serif italic text-lg mb-6">You haven't placed any orders yet.</p>
                    <Link to="/" className="bg-primary-900 text-[#F3E5D8] px-6 py-2 rounded-sm hover:bg-accent-500 transition-colors shadow-md font-bold uppercase tracking-wider text-sm">
                        Start Exploring
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-sm shadow-sm border border-[#E9DAC1] p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E9DAC1] pb-4 mb-4 gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest font-bold text-primary-400">Order ID</p>
                                    <p className="text-sm font-mono text-primary-800">{order.id}</p>
                                    <p className="text-xs text-primary-500 mt-1">
                                        {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right whitespace-nowrap">
                                        <p className="text-xs uppercase tracking-widest font-bold text-primary-400">Total</p>
                                        <p className="font-bold text-accent-500">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm border ${order.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                        order.status === 'Processing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-primary-50 text-primary-700 border-primary-200'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center py-2">
                                        <div className="flex items-center space-x-3">
                                            <span className="font-bold text-primary-900 text-sm">{item.quantity}x</span>
                                            <Link to={`/artwork/${item.id}`} className="text-sm text-primary-800 hover:text-accent-500 transition-colors truncate max-w-[150px] sm:max-w-xs">
                                                {item.title}
                                            </Link>
                                        </div>
                                        <span className="text-sm text-primary-600">{item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
