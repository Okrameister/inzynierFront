import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const [subGroups, setSubGroups] = useState([]);
    const [groupPath, setGroupPath] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const groupId = localStorage.getItem('groupId');

        if (!groupId) {
            setError("Nie znaleziono grupy w localStorage.");
            setLoading(false);
            return;
        }

        // Pobieranie podrzędnych grup
        fetch(`/api/groups/${groupId}/subgroups`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        })
            .then(response => response.json())
            .then(data => setSubGroups(Array.isArray(data) ? data : []))
            .catch(error => setError(error.message));

        // Pobieranie ścieżki grupy
        fetch(`/api/groups/${groupId}/path`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        })
            .then(response => response.json())
            .then(data => setGroupPath(Array.isArray(data) ? data : []))
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    // Obsługa kliknięcia w grupę w ścieżce
    const handleGroupClick = (groupId) => {
        localStorage.setItem("groupId", groupId);
        window.location.reload(); // Odświeżenie, aby załadować nową grupę
    };

    // Obsługa kliknięcia w podrzędną grupę
    const handleSubGroupClick = (groupId) => {
        localStorage.setItem("groupId", groupId);
        window.location.reload(); // Odświeżenie, aby załadować nową grupę
    };

    if (loading) {
        return <div className="sidebar-container">Ładowanie...</div>;
    }

    if (error) {
        return <div className="sidebar-container">Błąd: {error}</div>;
    }

    return (
        <div className="sidebar-container">
            {/* Przyciski "Plan lekcji" i "Zadania" */}
            <button className="sidebar-button" onClick={() => navigate(`/task`)}>Zadania</button>
            <button className="sidebar-button" onClick={() => navigate('/schedule')}>Plan zajęć</button>
            <h2>Moje grupy</h2>

            {/* Ścieżka grupy */}
            {groupPath.length > 1 && (
                <div className="breadcrumb-container">
                    {groupPath.map((group, index) => (
                        <span key={group.id} onClick={() => handleGroupClick(group.id)} className="breadcrumb-item">
                            {group.name} {index < groupPath.length - 1 ? ' / ' : ''}
                        </span>
                    ))}
                </div>
            )}

            {/* Podrzędne grupy jako przyciski */}
            <div className="group-buttons">
                {subGroups.length > 0 ? (
                    subGroups.map(group => (
                        <button className="group-button" key={group.id} onClick={() => handleSubGroupClick(group.id)}>
                            {group.name}
                        </button>
                    ))
                ) : (
                    <p>Brak podrzędnych grup</p>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
