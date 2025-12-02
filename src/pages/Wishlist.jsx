import MovieCard from '../components/MovieCard';
import { useWishlist } from '../context/WishlistContext';
import './Wishlist.css';

function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <h2 className="wishlist-title">My Wishlist</h2>
                <p className="wishlist-subtitle">
                    {wishlist.length} {wishlist.length === 1 ? 'movie' : 'movies'} saved
                </p>
            </div>

            {wishlist.length > 0 ? (
                <div className="wishlist-grid">
                    {wishlist.map((movie) => (
                        <div key={movie.id} className="wishlist-item">
                            <MovieCard movie={movie} />
                            <button
                                className="wishlist-remove-btn"
                                onClick={() => removeFromWishlist(movie.id)}
                                aria-label="Remove from wishlist"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="wishlist-empty">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <h3>Your wishlist is empty</h3>
                    <p>Start adding movies you want to watch later</p>
                </div>
            )}
        </div>
    );
}

export default Wishlist;
