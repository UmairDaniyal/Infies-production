import './About.css';

function About() {
    return (
        <div className="about-page">
            <div className="about-content">
                <h1>About Infies</h1>
                <p className="about-description">
                    Infies is your ultimate destination for discovering movies.
                    Powered by the TMDB API, we bring you the latest trending movies,
                    popular hits, and detailed information about your favorite films.
                </p>

                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Discover</h3>
                        <p>Explore thousands of movies from various genres and languages.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Track</h3>
                        <p>Create your personal wishlist and keep track of movies you want to watch.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Stay Updated</h3>
                        <p>Get the latest information on now playing and upcoming releases.</p>
                    </div>
                </div>

                <div className="tech-stack">
                    <h3>Built With</h3>
                    <div className="tech-icons">
                        <span>React</span>
                        <span>Firebase</span>
                        <span>TMDB API</span>
                        <span>Vite</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
