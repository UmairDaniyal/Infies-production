import { useState, useEffect } from 'react';
import { getGenres, getMoviesByGenre } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import './Categories.css';

function Categories() {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            const genreList = await getGenres();
            setGenres(genreList);
            if (genreList.length > 0) {
                setSelectedGenre(genreList[0]);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        if (selectedGenre) {
            const fetchMovies = async () => {
                setLoading(true);
                const movieList = await getMoviesByGenre(selectedGenre.id);
                setMovies(movieList);
                setLoading(false);
            };
            fetchMovies();
        }
    }, [selectedGenre]);

    return (
        <div className="categories-page">
            <div className="genres-sidebar">
                <h2>Categories</h2>
                <div className="genres-list">
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            className={`genre-button ${selectedGenre?.id === genre.id ? 'active' : ''}`}
                            onClick={() => setSelectedGenre(genre)}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="movies-content">
                <h2>{selectedGenre ? `${selectedGenre.name} Movies` : 'Select a Category'}</h2>
                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    <div className="movies-grid">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Categories;
