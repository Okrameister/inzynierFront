import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';
import logo from '../assets/logo.png';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLogged');
        window.location.href = '/auth';
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleHomeClick = () => {
        localStorage.setItem("groupId", "0");
        window.location.href = '/';
    };

    const isLogged = localStorage.getItem('isLogged');

    return (
        <header className="header-container">
            <div className="header-content">
                <div className="header-logo">
                    <img
                        src={logo}
                        alt="Student Link Logo"
                        className="header-logo-image"
                        onClick={handleHomeClick}
                        style={{ cursor: 'pointer' }} // Ustawienie kursora na klikalny
                    />
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
