// CreateTaskForm.jsx
import React, { useState } from 'react';
import '../styles/CreateTaskForm.css'; // Importowanie stylów CSS

const CreateTaskForm = ({ token, onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const createTask = () => {
        if (title.trim() === '' || description.trim() === '') {
            alert('Proszę podać tytuł i opis zadania.');
            return;
        }

        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ title, description })
        })
            .then(response => response.json())
            .then(task => {
                onTaskCreated(task);
            })
            .catch(error => console.error('Błąd podczas tworzenia zadania:', error));
    };

    return (
        <div className="create-task-form">
            <h2>Utwórz nowe zadanie</h2>
            <input
                type="text"
                placeholder="Tytuł zadania"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Opis zadania"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={createTask}>Utwórz zadanie</button>
        </div>
    );
};

export default CreateTaskForm;
