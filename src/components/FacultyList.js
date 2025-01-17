import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/FacultyList.css';

const FacultyList = () => {
    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = () => {
        const token = localStorage.getItem('token');

        axios.get('/api/faculties', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                setFaculties(response.data);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania wydziałów:', error);
            });
    };

    return (
        <div className="faculty-list-container">
            <h1>Informacje o Uczelni</h1>
            <h2>Wydziały</h2>
            <div className="faculty-cards">
                {faculties.map(faculty => (
                    <Link to={`/faculty/${faculty.id}`} key={faculty.id} className="faculty-card">
                        <img src={faculty.imageUrl} alt={faculty.name} className="faculty-image" />
                        <div className="faculty-content">
                            <h3>{faculty.name}</h3>
                            <p>{faculty.shortDescription}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FacultyList;
