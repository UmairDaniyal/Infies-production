import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Browse from './pages/Browse';
import Trending from './pages/Trending';
import MovieDetails from './pages/MovieDetails';
import Wishlist from './pages/Wishlist';
import SearchResults from './pages/SearchResults';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="app-loading">
                <div className="app-spinner"></div>
            </div>
        );
    }

    // Check if we are on the landing page
    const isLandingPage = location.pathname === '/landing';

    // If not authenticated and not on landing page, redirect to landing
    if (!isAuthenticated && !isLandingPage) {
        return <Navigate to="/landing" replace />;
    }

    return (
        <WishlistProvider>
            <ScrollToTop />
            <div className="app">
                {!isLandingPage && <Navbar />}
                <div className={!isLandingPage ? "app-layout" : ""}>
                    {!isLandingPage && <Sidebar />}
                    <main className={!isLandingPage ? "main-content" : ""}>
                        <Routes>
                            <Route path="/landing" element={<LandingPage />} />
                            <Route path="/" element={<Browse />} />
                            <Route path="/trending" element={<Trending />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/movie/:id" element={<MovieDetails />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </WishlistProvider>
    );
}

export default App