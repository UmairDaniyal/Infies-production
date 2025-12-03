const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image size configurations
export const IMAGE_SIZES = {
    backdrop: {
        small: 'w300',
        medium: 'w780',
        large: 'w1280',
        original: 'original'
    },
    poster: {
        small: 'w185',
        medium: 'w342',
        large: 'w500',
        original: 'original'
    }
};

// Helper function to build image URL
export const getImageUrl = (path, type = 'poster', size = 'medium') => {
    if (!path) return null;
    const sizeParam = IMAGE_SIZES[type][size];
    return `${IMAGE_BASE_URL}/${sizeParam}${path}`;
};

// Fetch now playing movies (latest in theaters)
export const getNowPlayingMovies = async (page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching now playing movies:', error);
        return [];
    }
};

// Fetch popular movies
export const getPopularMovies = async (page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
};

// Fetch trending movies
export const getTrendingMovies = async (timeWindow = 'week') => {
    try {
        const response = await fetch(
            `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
};

// Fetch movie details
export const getMovieDetails = async (movieId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

// Fetch movie credits (cast and crew)
export const getMovieCredits = async (movieId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie credits:', error);
        return { cast: [], crew: [] };
    }
};

// Search movies
export const searchMovies = async (query, page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
};

// Fetch genres
export const getGenres = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        return data.genres || [];
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
};

// Fetch movies by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        return [];
    }
};
