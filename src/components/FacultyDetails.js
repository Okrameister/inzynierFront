import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FacultyDetails.css';

const FacultyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [faculty, setFaculty] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const role = localStorage.getItem('role'); // Pobranie roli z localStorage

    useEffect(() => {
        fetchFacultyDetails();
    }, [id]);

    const fetchFacultyDetails = () => {
        const token = localStorage.getItem('token');
        axios.get(`/api/faculties/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                setFaculty(response.data);
                setFormData(response.data);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania szczegółów wydziału:', error);
            });
    };

    const handleEdit = () => {
        const token = localStorage.getItem('token');
        axios.put(`/api/faculties/${id}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setIsEditing(false);
                fetchFacultyDetails();
            })
            .catch(error => {
                console.error('Błąd podczas aktualizacji wydziału:', error);
            });
    };

    const handleDelete = () => {
        const token = localStorage.getItem('token');
        axios.delete(`/api/faculties/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                navigate('/faculty'); // Powrót do listy wydziałów po usunięciu
            })
            .catch(error => {
                console.error('Błąd podczas usuwania wydziału:', error);
            });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!faculty) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div className="faculty-details-container">
            <div className="faculty-details-header">
                <h1>{isEditing ? 'Edytuj Wydział' : faculty.name}</h1>
            </div>

            <div className="faculty-details-content">
                {isEditing ? (
                    <div className="faculty-edit-form">
                        <label>Nazwa:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <label>Krótki Opis:</label>
                        <textarea
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                        />

                        <label>Długi Opis:</label>
                        <textarea
                            name="longDescription"
                            value={formData.longDescription}
                            onChange={handleChange}
                        />

                        <label>URL Obrazu:</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />

                        <label>Kierunki:</label>
                        <textarea
                            name="courses"
                            value={formData.courses.join(', ')} // Łączenie kursów w string
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    courses: e.target.value.split(',').map((c) => c.trim()),
                                })
                            }
                        />

                        <button onClick={handleEdit}>Zapisz</button>
                        <button onClick={() => setIsEditing(false)}>Anuluj</button>
                    </div>
                ) : (
                    <>
                        <img
                            src={faculty.imageUrl}
                            alt={faculty.name}
                            className="faculty-details-image"
                        />
                        <div className="faculty-details-description">
                            <p>{faculty.longDescription}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="faculty-courses">
                <h3>Kierunki</h3>
                <ul>
                    {faculty.courses.map((course, index) => (
                        <li key={index}>{course}</li>
                    ))}
                </ul>
            </div>

            {role === 'ADMIN' && !isEditing && (
                <div className="admin-actions">
                    <button onClick={() => setIsEditing(true)}>Edytuj</button>
                    <button onClick={handleDelete} style={{ backgroundColor: 'red' }}>
                        Usuń
                    </button>
                </div>
            )}
        </div>
    );
};

export default FacultyDetails;
