/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        // Load initial state from local storage if available
        const savedCart = localStorage.getItem('rangitva_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        // Save to local storage whenever cart items change
        localStorage.setItem('rangitva_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (artwork) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === artwork.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === artwork.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...artwork, quantity: 1 }];
        });
        setIsCartOpen(true); // Auto-open drawer when adding an item
    };

    const removeFromCart = (artworkId) => {
        setCartItems(prev => prev.filter(item => item.id !== artworkId));
    };

    const updateQuantity = (artworkId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(artworkId);
            return;
        }
        setCartItems(prev =>
            prev.map(item =>
                item.id === artworkId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const cartTotalCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        cartTotalCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
