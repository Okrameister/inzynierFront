import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/Profile.css';

const Profile = () => {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); // Identyfikator zalogowanego użytkownika
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchUserData = async () => {
            try {
                // Pobieranie danych zalogowanego użytkownika
                const profileResponse = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCurrentUserId(profileResponse.data.id); // Ustawienie ID zalogowanego użytkownika

                // Pobieranie danych użytkownika na podstawie userId
                const userResponse = userId
                    ? await axios.get(`/api/users/profile/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    : profileResponse; // Jeśli brak userId, użyj danych z zalogowanego użytkownika

                setUser(userResponse.data);
                setFormData({
                    firstName: userResponse.data.firstName,
                    lastName: userResponse.data.lastName,
                    email: userResponse.data.email,
                    gender: userResponse.data.gender,
                });
            } catch (error) {
                console.error('Błąd podczas pobierania danych użytkownika:', error);
            }
        };

        fetchUserData();
    }, [userId]);

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
        return <p>Ładowanie...</p>;
    }

    const isOwnProfile = currentUserId === user.id;

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
                    {isOwnProfile && (
                        <button onClick={handleEditClick} className="edit-button">
                            <FontAwesomeIcon icon={faEdit} /> Edytuj
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
