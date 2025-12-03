import { useState, useEffect } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import MovieCard from '../components/MovieCard';
import { getNowPlayingMovies, getPopularMovies } from '../services/tmdb';
import './Browse.css';

function Browse() {
    const [heroMovies, setHeroMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);

                // Fetch now playing movies for the hero carousel
                const nowPlaying = await getNowPlayingMovies();
                setHeroMovies(nowPlaying.slice(0, 6));

                // Fetch popular movies for the grid
                const popular = await getPopularMovies(1);
                setPopularMovies(popular);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const loadMoreMovies = async () => {
        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            const moreMovies = await getPopularMovies(nextPage);
            setPopularMovies(prev => [...prev, ...moreMovies]);
            setCurrentPage(nextPage);
            setLoadingMore(false);
        } catch (error) {
            console.error('Error loading more movies:', error);
            setLoadingMore(false);
        }
    };

    if (loading) {
        return (
            <div className="browse-loading">
                <div className="browse-spinner"></div>
                <p>Loading movies...</p>
            </div>
        );
    }

    return (
        <div className="browse">
            {/* Hero Carousel Section */}
            <section className="browse-hero-section">
                <HeroCarousel movies={heroMovies} />
            </section>

            {/* Popular Movies Section */}
            <section className="browse-movies-section">
                <div className="browse-section-header">
                    <h2 className="browse-section-title">Popular Movies</h2>
                    <select className="browse-filter-dropdown">
                        <option value="popular">Popular</option>
                        <option value="top-rated">Top Rated</option>
                        <option value="upcoming">Upcoming</option>
                    </select>
                </div>

                <div className="browse-movies-grid">
                    {popularMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                <div className="browse-load-more">
                    <button
                        className="browse-load-more-btn"
                        onClick={loadMoreMovies}
                        disabled={loadingMore}
                    >
                        {loadingMore ? (
                            <>
                                <div className="browse-load-more-spinner"></div>
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Browse;
