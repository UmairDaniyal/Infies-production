import { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);



    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Listen to wishlist changes from Firestore
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const wishlistRef = collection(db, 'wishlists', userId, 'movies');

        const unsubscribe = onSnapshot(
            wishlistRef,
            (snapshot) => {
                const movies = [];
                snapshot.forEach((doc) => {
                    movies.push({ id: doc.id, ...doc.data() });
                });
                setWishlist(movies);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching wishlist:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    const addToWishlist = async (movie) => {
        if (!userId) {
            console.error('User not authenticated');
            return;
        }

        try {
            const movieRef = doc(db, 'wishlists', userId, 'movies', movie.id.toString());
            await setDoc(movieRef, {
                ...movie,
                addedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const removeFromWishlist = async (movieId) => {
        if (!userId) {
            console.error('User not authenticated');
            return;
        }

        try {
            const movieRef = doc(db, 'wishlists', userId, 'movies', movieId.toString());
            await deleteDoc(movieRef);
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const isInWishlist = (movieId) => {
        return wishlist.some(item => item.id === movieId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            loading
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
