import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '../firebase.config';

const COLLECTION_NAME = 'orders';

export const createOrder = async (orderData) => {
    const ordersCol = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(ordersCol, {
        ...orderData,
        status: 'Pending',
        createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...orderData, status: 'Pending' };
};

export const getOrders = async () => {
    const ordersCol = collection(db, COLLECTION_NAME);
    const orderSnapshot = await getDocs(ordersCol);
    return orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getOrdersByEmail = async (email) => {
    const ordersCol = collection(db, COLLECTION_NAME);
    const q = query(ordersCol, where('customerInfo.email', '==', email));
    const orderSnapshot = await getDocs(q);
    const orders = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt descending (newest first)
    return orders.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
};

export const updateOrderStatus = async (id, newStatus) => {
    const orderRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(orderRef, { status: newStatus });
    return { id, status: newStatus };
};
