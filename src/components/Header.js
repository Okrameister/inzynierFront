import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../ThemeContext"; // Import kontekstu motywu
import "../styles/Header.css";
import logo from "../assets/logo.png";

const Header = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [isLogged, setIsLogged] = useState(localStorage.getItem("isLogged"));
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext); // Pobierz dane z ThemeContext

    useEffect(() => {
        const handleStorageChange = () => {
            setRole(localStorage.getItem("role"));
            setIsLogged(localStorage.getItem("isLogged"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLogged");
        localStorage.removeItem("role");
        window.location.href = "/auth";
    };

    const handleProfile = () => {
        navigate("/profile");
    };

    const handleAdmin = () => {
        if (role === "ADMIN") {
            navigate("/adminPanel");
        } else {
            alert("Nie masz uprawnień do tego panelu!");
        }
    };

    const handleHomeClick = () => {
        localStorage.setItem("groupId", "0");
        window.location.href = "/";
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
                        style={{ cursor: "pointer" }}
                    />
                </div>
                <div className="theme-toggle">
                    <FontAwesomeIcon
                        icon={isDarkMode ? faSun : faMoon}
                        onClick={toggleDarkMode}
                        className="theme-icon"
                    />
                </div>
                {isLogged && (
                    <>
                        {role === "ADMIN" && (
                            <button className="header-admin-button" onClick={handleAdmin}>
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
