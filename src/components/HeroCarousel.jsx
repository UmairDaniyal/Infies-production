import { useState, useEffect } from 'react';
import { getImageUrl } from '../services/tmdb';
import './HeroCarousel.css';

function HeroCarousel({ movies }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying || !movies || movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === movies.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, movies]);

    if (!movies || movies.length === 0) {
        return <div className="hero-carousel-loading">Loading...</div>;
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === movies.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? movies.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div
            className="hero-carousel"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Render all slides stacked */}
            {movies.map((movie, index) => {
                const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop', 'original');
                const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
                const isActive = index === currentIndex;

                return (
                    <div
                        key={movie.id}
                        className={`hero-carousel-slide ${isActive ? 'active' : ''}`}
                        aria-hidden={!isActive}
                    >
                        {backdropUrl && (
                            <img
                                src={backdropUrl}
                                alt={movie.title}
                                className="hero-carousel-image"
                            />
                        )}
                        <div className="hero-carousel-gradient"></div>

                        <div className="hero-carousel-content">
                            <div className="hero-carousel-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                                <span>Now Playing</span>
                            </div>

                            <h1 className="hero-carousel-title">{movie.title}</h1>

                            <div className="hero-carousel-meta">
                                <span className="hero-carousel-rating">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffd700">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    {rating}
                                </span>
                                {movie.release_date && (
                                    <span className="hero-carousel-year">
                                        {new Date(movie.release_date).getFullYear()}
                                    </span>
                                )}
                            </div>

                            <p className="hero-carousel-overview">
                                {movie.overview}
                            </p>

                            <button className="hero-carousel-watch-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Watch Now
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Arrows */}
            <button
                className="hero-carousel-nav hero-carousel-nav-prev"
                onClick={goToPrevious}
                aria-label="Previous slide"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <button
                className="hero-carousel-nav hero-carousel-nav-next"
                onClick={goToNext}
                aria-label="Next slide"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>

            {/* Thumbnail Navigation */}
            <div className="hero-carousel-thumbnails">
                {movies.slice(0, 6).map((movie, index) => {
                    const thumbUrl = getImageUrl(movie.backdrop_path, 'backdrop', 'small');
                    return (
                        <button
                            key={movie.id}
                            className={`hero-carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to ${movie.title}`}
                        >
                            {thumbUrl && (
                                <img src={thumbUrl} alt={movie.title} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Dots Indicator */}
            <div className="hero-carousel-dots">
                {movies.slice(0, 6).map((_, index) => (
                    <button
                        key={index}
                        className={`hero-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default HeroCarousel;
