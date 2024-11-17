import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Sprawdzenie, czy token jest dostępny
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Brak tokenu. Użytkownik nie jest zalogowany.');
            navigate('/login');
            return;
        }

        // Pobranie danych użytkownika po załadowaniu komponentu
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    gender: response.data.gender,
                });
            } catch (error) {
                console.error('Błąd podczas pobierania danych użytkownika:', error);
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender,
        });
    };

    const handleSaveClick = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Brak tokenu. Użytkownik nie jest zalogowany.');
                navigate('/login');
                return;
            }
            const response = await axios.put('/api/users', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Błąd podczas aktualizacji danych użytkownika:', error);
        }
    };

    if (!user) {
        return <p></p>;
    }

    return (
        <div className="user-profile">
            <div className="profile-header">
                <FontAwesomeIcon icon={faUser} className="profile-icon" />
                <h2>Profil Użytkownika</h2>
            </div>
            {isEditing ? (
                <div className="user-edit-form">
                    <label>
                        Imię:
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Nazwisko:
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Płeć:
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Wybierz...</option>
                            <option value="Mężczyzna">Mężczyzna</option>
                            <option value="Kobieta">Kobieta</option>
                        </select>
                    </label>
                    <div className="button-group">
                        <button onClick={handleSaveClick} className="save-button">
                            <FontAwesomeIcon icon={faSave} /> Zapisz
                        </button>
                        <button onClick={handleCancelClick} className="cancel-button">
                            <FontAwesomeIcon icon={faTimes} /> Anuluj
                        </button>
                    </div>
                </div>
            ) : (
                <div className="user-details">
                    <p><strong>Imię:</strong> {user.firstName}</p>
                    <p><strong>Nazwisko:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Płeć:</strong> {user.gender}</p>
                    <button onClick={handleEditClick} className="edit-button">
                        <FontAwesomeIcon icon={faEdit} /> Edytuj
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;