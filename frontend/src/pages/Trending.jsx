import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getTrendingMovies } from '../services/tmdb';
import './Trending.css';

function Trending() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setLoading(true);
                const trending = await getTrendingMovies('week');
                setMovies(trending);
                setFilteredMovies(trending);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trending movies:', error);
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMovies(movies);
        } else {
            const filtered = movies.filter(movie =>
                movie.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMovies(filtered);
        }
    }, [searchQuery, movies]);

    const loadMoreMovies = async () => {
        try {
            setLoadingMore(true);
            // Note: TMDB trending endpoint doesn't support pagination the same way
            // We'll fetch day trending as additional content
            const moreTrending = await getTrendingMovies('day');
            const uniqueMovies = moreTrending.filter(
                newMovie => !movies.some(existingMovie => existingMovie.id === newMovie.id)
            );
            setMovies(prev => [...prev, ...uniqueMovies]);
            setCurrentPage(prev => prev + 1);
            setLoadingMore(false);
        } catch (error) {
            console.error('Error loading more movies:', error);
            setLoadingMore(false);
        }
    };

    return (
        <div className="trending-page">
            <div className="trending-header">
                <h2 className="trending-title">Trending Now</h2>
                <div className="trending-search">
                    <svg className="trending-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        className="trending-search-input"
                        placeholder="Search trending movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="trending-loading">
                    <div className="trending-spinner"></div>
                    <p>Loading trending movies...</p>
                </div>
            ) : (
                <>
                    <div className="trending-grid">
                        {filteredMovies.length > 0 ? (
                            filteredMovies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))
                        ) : (
                            <div className="trending-no-results">
                                <p>No trending movies found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>

                    {!searchQuery && (
                        <div className="trending-load-more">
                            <button
                                className="trending-load-more-btn"
                                onClick={loadMoreMovies}
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <div className="trending-load-more-spinner"></div>
                                        Loading...
                                    </>
                                ) : (
                                    'Load More'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Trending;
