import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { getMovieDetails, getMovieCredits, getImageUrl } from '../services/tmdb';
import './MovieDetails.css';

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState({ cast: [], crew: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setLoading(true);
                const [movieData, creditsData] = await Promise.all([
                    getMovieDetails(id),
                    getMovieCredits(id)
                ]);
                setMovie(movieData);
                setCredits(creditsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movie data:', error);
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    if (loading) {
        return (
            <div className="movie-details-loading">
                <div className="movie-details-spinner"></div>
                <p>Loading movie details...</p>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="movie-details-error">
                <h2>Movie not found</h2>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop', 'original');
    const posterUrl = getImageUrl(movie.poster_path, 'poster', 'large');
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';

    // Get director from crew
    const director = credits.crew.find(person => person.job === 'Director');

    // Get top cast members
    const topCast = credits.cast.slice(0, 10);

    return (
        <div className="movie-details">
            {/* Backdrop Section */}
            <div className="movie-details-backdrop">
                {backdropUrl && (
                    <img src={backdropUrl} alt={movie.title} className="movie-details-backdrop-image" />
                )}
                <div className="movie-details-backdrop-gradient"></div>

                <button className="movie-details-back-btn" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back
                </button>
            </div>

            {/* Content Section */}
            <div className="movie-details-content">
                <div className="movie-details-main">
                    {/* Poster */}
                    <div className="movie-details-poster-container">
                        {posterUrl && (
                            <img src={posterUrl} alt={movie.title} className="movie-details-poster" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="movie-details-info">
                        <h1 className="movie-details-title">{movie.title}</h1>

                        {movie.tagline && (
                            <p className="movie-details-tagline">"{movie.tagline}"</p>
                        )}

                        {/* Meta Info */}
                        <div className="movie-details-meta">
                            <span className="movie-details-rating">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                {rating}
                            </span>
                            <span className="movie-details-separator">•</span>
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span className="movie-details-separator">•</span>
                            <span>{runtime}</span>
                        </div>

                        {/* Genres */}
                        {movie.genres && movie.genres.length > 0 && (
                            <div className="movie-details-genres">
                                {movie.genres.map(genre => (
                                    <span key={genre.id} className="movie-details-genre-tag">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                            className={`movie-details-wishlist-btn ${isInWishlist(movie.id) ? 'in-wishlist' : ''}`}
                            onClick={() => {
                                if (isInWishlist(movie.id)) {
                                    removeFromWishlist(movie.id);
                                } else {
                                    addToWishlist(movie);
                                }
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(movie.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {isInWishlist(movie.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>

                        {/* Overview */}
                        <div className="movie-details-section">
                            <h3>Overview</h3>
                            <p className="movie-details-overview">{movie.overview}</p>
                        </div>

                        {/* Director */}
                        {director && (
                            <div className="movie-details-section">
                                <h3>Director</h3>
                                <p className="movie-details-director">{director.name}</p>
                            </div>
                        )}

                        {/* Release Date */}
                        <div className="movie-details-section">
                            <h3>Release Date</h3>
                            <p>{new Date(movie.release_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                    </div>
                </div>

                {/* Cast Section */}
                {topCast.length > 0 && (
                    <div className="movie-details-cast-section">
                        <h2>Cast</h2>
                        <div className="movie-details-cast-grid">
                            {topCast.map(actor => {
                                const actorImage = actor.profile_path
                                    ? getImageUrl(actor.profile_path, 'poster', 'small')
                                    : null;

                                return (
                                    <div key={actor.id} className="movie-details-cast-card">
                                        <div className="movie-details-cast-image">
                                            {actorImage ? (
                                                <img src={actorImage} alt={actor.name} />
                                            ) : (
                                                <div className="movie-details-cast-placeholder">
                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="movie-details-cast-info">
                                            <p className="movie-details-cast-name">{actor.name}</p>
                                            <p className="movie-details-cast-character">{actor.character}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetails;
