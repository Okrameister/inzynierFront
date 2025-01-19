import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupCreator from './GroupCreator';
import '../styles/AdminPanel.css';


const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Pobierz token z localStorage

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

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="admin-container">
            <h1>Panel Administratora</h1>
            <div className="admin-sections">
                <div className="admin-section-users">
                    <h2>Użytkownicy</h2>
                    <ul className="admin-users-list">
                        {users.map(user => (
                            <li
                                key={user.id}
                                className="admin-user-item"
                                onClick={() => handleUserClick(user.id)}
                                style={{ cursor: 'pointer'}}
                            >
                                {`${user.firstName} ${user.lastName}`}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="admin-section-groups">
                    <GroupCreator></GroupCreator>
                </div>

            </div>
        </div>
    );
};

export default AdminPanel;
