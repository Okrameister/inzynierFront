import React from 'react';
import {Link, redirect} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
    const handleLogout = () => {
        localStorage.removeItem('isLogged');
        window.location.href = '/auth';
    };

    const handleProfile = () => {
        window.location.href = '/profile';
    };

    const isLogged = localStorage.getItem('isLogged');

    return (
        <header className="header-container">
            <div className="header-content">
                <div className="header-logo">
                    <Link to="/home">
                        <img src={logo} alt="Student Link Logo" className="header-logo-image" />
                    </Link>
                </div>
                {isLogged && (
                    <>
                        <button className="header-profile-button" onClick={handleProfile}>
                            <FontAwesomeIcon icon={faUser} /> My Profile
                        </button>
                        <button className="header-logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
