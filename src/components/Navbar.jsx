import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import './Navbar.css';

function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/landing');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo Section */}
                <div className="navbar-left">
                    <div className="logo-container">
                        <div className="logo-icon">I</div>
                        <span className="logo-text">
                            INFIES<span className="logo-accent"></span>
                        </span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="navbar-center">
                    <form className="search-container" onSubmit={handleSearch}>
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search everything"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Right Section */}
                <div className="navbar-right">
                    <div
                        className="profile-container"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Infies"
                            alt="User profile"
                            className="profile-image"
                        />
                        {showDropdown && (
                            <div className="profile-dropdown">
                                <div className="dropdown-item logout" onClick={handleLogout}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Sign Out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
