import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/NewsForm.css'; // Import the CSS styles

function NewsForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role'); // Check user role
        if (role !== 'ADMIN') {
            alert('Brak uprawnień do dodawania aktualności!');
            return;
        }

        try {
            const response = await axios.post(
                '/api/news',
                { title, content },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 201) {
                alert('Aktualność została dodana pomyślnie!');
                setTitle('');
                setContent('');
                navigate('/news');
            }
        } catch (error) {
            console.error('Błąd podczas dodawania newsów!', error);
        }
    };

    return (
        <form className="news-form" onSubmit={handleSubmit}>
            <h2>Dodaj nowy wpis</h2>
            <div className="form-group">
                <label>Tytuł:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Treść:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows="5"
                ></textarea>
            </div>
            <button type="submit" className="news-form-button">Dodaj aktualność</button>
        </form>
    );
}

export default NewsForm;
