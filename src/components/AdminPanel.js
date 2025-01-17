import React, { useEffect, useState } from 'react';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Pobierz token z localStorage lub innego źródła

        fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);



    return (
        <div className="admin-container">
            <h1>Panel Administratora</h1>
            <div className="admin-sections">
                <div className="admin-section">
                    <h2>Użytkownicy</h2>
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>{`${user.firstName} ${user.lastName}`} </li>
                        ))}
                    </ul>
                </div>
                <div className="admin-section">
                    <h2>Grupy</h2>
                    <p>Zarządzaj grupami.</p>
                </div>
                <div className="admin-section">
                    <h2>Zadania</h2>
                    <p>Zarządzaj zadaniami.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
