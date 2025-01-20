import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EventForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EventForm = ({ event, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setDate(event.date);
        }
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = { title, description, date };

        if (event) {
            axios.put(`/api/events/${event.id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    onClose();
                })
                .catch((error) => {
                    console.error('Błąd podczas edycji wydarzenia:', error);
                });
        } else {
            axios.post('/api/events', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    onClose();
                })
                .catch((error) => {
                    console.error('Błąd podczas dodawania wydarzenia:', error);
                });
        }
    };

    const handleDelete = () => {
        axios.delete(`/api/events/${event.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                onClose();
            })
            .catch((error) => {
                console.error('Błąd podczas usuwania wydarzenia:', error);
            });
    };

    return (
        <div className="event-form-container">
            <div className="event-form">
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>{event ? 'Edytuj wydarzenie' : 'Dodaj wydarzenie'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Tytuł</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Opis</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Data</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="delete-button" onClick={handleDelete}>
                            Usuń wydarzenie
                        </button>
                        <button type="submit" className="submit-button">
                            {event ? 'Zapisz zmiany' : 'Dodaj wydarzenie'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
