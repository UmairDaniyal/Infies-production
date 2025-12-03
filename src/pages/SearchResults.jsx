import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/tmdb';
import './SearchResults.css';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (!query) {
            setMovies([]);
            return;
        }

        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const results = await searchMovies(query, 1);
                setMovies(results);
                setCurrentPage(1);
                setLoading(false);
            } catch (error) {
                console.error('Error searching movies:', error);
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    const loadMoreResults = async () => {
        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            const moreResults = await searchMovies(query, nextPage);
            setMovies(prev => [...prev, ...moreResults]);
            setCurrentPage(nextPage);
            setLoadingMore(false);
        } catch (error) {
            console.error('Error loading more results:', error);
            setLoadingMore(false);
        }
    };

    if (!query) {
        return (
            <div className="search-results-empty">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <h3>Start searching</h3>
                <p>Enter a movie name in the search bar to find movies</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="search-results-loading">
                <div className="search-results-spinner"></div>
                <p>Searching for "{query}"...</p>
            </div>
        );
    }

    return (
        <div className="search-results-page">
            <div className="search-results-header">
                <h2 className="search-results-title">
                    Search Results for "{query}"
                </h2>
                <p className="search-results-subtitle">
                    {movies.length} {movies.length === 1 ? 'result' : 'results'} found
                </p>
            </div>

            {movies.length > 0 ? (
                <>
                    <div className="search-results-grid">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>

                    <div className="search-results-load-more">
                        <button
                            className="search-results-load-more-btn"
                            onClick={loadMoreResults}
                            disabled={loadingMore}
                        >
                            {loadingMore ? (
                                <>
                                    <div className="search-results-load-more-spinner"></div>
                                    Loading...
                                </>
                            ) : (
                                'Load More'
                            )}
                        </button>
                    </div>
                </>
            ) : (
                <div className="search-results-no-results">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <h3>No results found</h3>
                    <p>Try searching with different keywords</p>
                </div>
            )}
        </div>
    );
}

export default SearchResults;
