import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingMovies } from '../services/tmdb';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import './LandingPage.css';

function LandingPage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if already authenticated
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/');
            }
        });

        // Fetch movies for background
        const fetchMovies = async () => {
            try {
                const [page1, page2, page3] = await Promise.all([
                    getTrendingMovies('week', 1),
                    getTrendingMovies('week', 2),
                    getTrendingMovies('week', 3)
                ]);
                setMovies([...page1, ...page2, ...page3]);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, googleProvider);
            // Redirect handled by onAuthStateChanged
        } catch (error) {
            console.error('Error signing in:', error);
            setLoading(false);
        }
    };

    // Split movies into 3 rows
    const row1 = movies.slice(0, 20);
    const row2 = movies.slice(20, 40);
    const row3 = movies.slice(40, 60);

    return (
        <div className="landing-page">
            <div className="landing-background">
                <div className="marquee-row row-1">
                    <div className="marquee-content">
                        {row1.map(movie => (
                            <img
                                key={movie.id}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                        ))}
                        {row1.map(movie => (
                            <img
                                key={`dup-${movie.id}`}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                        ))}
                    </div>
                </div>
                <div className="marquee-row row-2">
                    <div className="marquee-content reverse">
                        {row2.map(movie => (
                            <img
                                key={movie.id}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                        ))}
                        {row2.map(movie => (
                            <img
                                key={`dup-${movie.id}`}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                        ))}
                    </div>
                </div>
                <div className="marquee-row row-3">
                    <div className="marquee-content">
                        {row3.map(movie => (
                            <img
                                key={movie.id}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                        ))}
                        {row3.map(movie => (
                            <img
                                key={`dup-${movie.id}`}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                        ))}
                    </div>
                </div>
                <div className="landing-overlay"></div>
            </div>

            <div className="landing-content">
                <div className="landing-card">
                    <div className="landing-logo">
                        <div className="logo-icon">I</div>
                        <span className="logo-text">INFIES</span>
                    </div>
                    <h1>One stop for every genre</h1>
                    <p>Get an overview. Save your time</p>

                    <button
                        className="landing-btn"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in with Google'}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
