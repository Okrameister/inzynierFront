import React, { useState } from 'react';
import '../styles/ScheduleForm.css';

function ScheduleForm({ onSubmit, onClose, initialData, onDelete }) {
    const [subject, setSubject] = useState(initialData.subject || '');
    const [room, setRoom] = useState(initialData.room || '');
    const [classType, setClassType] = useState(initialData.classType || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            subject,
            room,
            classType,
        });
    };

    const handleDelete = () => {
        if (window.confirm('Czy na pewno chcesz usunąć te zajęcia?')) {
            onDelete(initialData.id);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Dodaj/Edytuj zajęcia</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nazwa zajęć:</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Sala:</label>
                        <input
                            type="text"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Typ zajęć:</label>
                        <select
                            value={classType}
                            onChange={(e) => setClassType(e.target.value)}
                            required
                        >
                            <option value="">-- Wybierz --</option>
                            <option value="Wykład">Wykład</option>
                            <option value="Ćwiczenia">Ćwiczenia</option>
                            <option value="Laboratoria">Laboratoria</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        {initialData.id && (
                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDelete}
                            >
                                Usuń
                            </button>
                        )}
                        <button type="submit" className="save-button">
                            Zapisz
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ScheduleForm;