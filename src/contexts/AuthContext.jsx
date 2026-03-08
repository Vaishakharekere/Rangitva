/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, ADMIN_EMAIL, googleProvider } from '../firebase.config';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    async function signup(email, password, name, phone, address) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: name
        });

        // Save extra user details to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name,
            email,
            phone: phone || '',
            address: address || '',
            role: email === ADMIN_EMAIL ? 'admin' : 'user',
            createdAt: new Date().toISOString()
        });

        return userCredential;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function signInWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsAdmin(user?.email === ADMIN_EMAIL);
            setLoading(false);

            if (user) {
                // Run Firestore user doc check asynchronously in the background so it doesn't block the UI
                const checkAndCreateUserDoc = async () => {
                    try {
                        const userDocRef = doc(db, 'users', user.uid);
                        const userDocSnap = await getDoc(userDocRef);
                        if (!userDocSnap.exists()) {
                            await setDoc(userDocRef, {
                                name: user.displayName || '',
                                email: user.email,
                                phone: '',
                                address: '',
                                role: user.email === ADMIN_EMAIL ? 'admin' : 'user',
                                createdAt: new Date().toISOString()
                            });
                        }
                    } catch (error) {
                        console.error("Error checking/creating user doc during auth state change:", error);
                    }
                };
                checkAndCreateUserDoc();
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        isAdmin,
        login,
        signup,
        signInWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
