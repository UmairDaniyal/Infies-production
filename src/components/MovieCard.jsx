import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdb';
import './MovieCard.css';

function MovieCard({ movie }) {
    const posterUrl = getImageUrl(movie.poster_path, 'poster', 'medium');
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card">
            <div className="movie-card-image-container">
                {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={movie.title}
                        className="movie-card-image"
                        loading="lazy"
                    />
                ) : (
                    <div className="movie-card-placeholder">
                        <span>No Image</span>
                    </div>
                )}
                <div className="movie-card-overlay">
                    <button className="movie-card-play-btn" onClick={(e) => e.preventDefault()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="movie-card-info">
                <h3 className="movie-card-title">{movie.title}</h3>
                <div className="movie-card-meta">
                    <span className="movie-card-rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffd700">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {rating}
                    </span>
                    {movie.release_date && (
                        <span className="movie-card-year">
                            {new Date(movie.release_date).getFullYear()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default MovieCard;
