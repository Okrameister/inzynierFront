import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';
import logo from '../assets/logo.png';

const Header = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState(localStorage.getItem("role")); // Pobierz rolę z localStorage
    const [isLogged, setIsLogged] = useState(localStorage.getItem('isLogged')); // Sprawdź zalogowanie

    useEffect(() => {
        // Aktualizuj rolę i zalogowanie przy każdej zmianie w localStorage
        const handleStorageChange = () => {
            setRole(localStorage.getItem("role"));
            setIsLogged(localStorage.getItem('isLogged'));
        };

        // Dodaj nasłuchiwanie na zmiany w localStorage
        window.addEventListener('storage', handleStorageChange);

        return () => {
            // Usuń nasłuchiwanie po odmontowaniu komponentu
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isLogged');
        localStorage.removeItem('role');
        window.location.href = '/auth';
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleAdmin = () => {
        if (role === 'ADMIN') {
            navigate('/adminPanel');
        } else {
            alert('Nie masz uprawnień do tego panelu!');
        }
    };

    const handleHomeClick = () => {
        localStorage.setItem("groupId", "0");
        window.location.href = '/';
    };

    return (
        <header className="header-container">
            <div className="header-content">
                <div className="header-logo">
                    <img
                        src={logo}
                        alt="Student Link Logo"
                        className="header-logo-image"
                        onClick={handleHomeClick}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                {isLogged && (
                    <>
                        {role === 'ADMIN' && (
                            <button
                                className="header-admin-button"
                                onClick={handleAdmin}
                            >
                                <FontAwesomeIcon icon={faUser} /> Admin panel
                            </button>
                        )}
                        <button className="header-profile-button" onClick={handleProfile}>
                            <FontAwesomeIcon icon={faUser} /> Mój Profil
                        </button>
                        <button className="header-logout-button" onClick={handleLogout}>
                            Wyloguj
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
