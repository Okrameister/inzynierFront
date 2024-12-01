// NewConversationModal.jsx
import React, { useEffect, useState } from 'react';
import '../styles/NewConversationModal.css'; // Importowanie pliku CSS

const NewConversationModal = ({ onClose, onCreate, token }) => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        fetch('/api/users', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Błąd podczas pobierania użytkowników:', error));
    }, [token]);

    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const createConversation = () => {
        if (selectedUsers.length === 0) {
            alert('Wybierz co najmniej jednego użytkownika.');
            return;
        }

        fetch('/api/chat/conversations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                userIds: selectedUsers,
                name: isGroup ? name : '',
                isGroup
            })
        })
            .then(response => response.json())
            .then(conversation => {
                onCreate(conversation);
            })
            .catch(error => console.error('Błąd podczas tworzenia konwersacji:', error));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Nowa konwersacja</h2>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={isGroup}
                        onChange={(e) => setIsGroup(e.target.checked)}
                    />
                    Konwersacja grupowa
                </label>
                {isGroup && (
                    <input
                        type="text"
                        placeholder="Nazwa konwersacji"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="conversation-name-input"
                    />
                )}
                <div className="user-list">
                    {users.map(user => (
                        <div key={user.id} className="user-item">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => toggleUserSelection(user.id)}
                                />
                                {user.firstName} {user.lastName}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button onClick={createConversation} className="create-button">Utwórz</button>
                    <button onClick={onClose} className="cancel-button">Anuluj</button>
                </div>
            </div>
        </div>
    );
};

export default NewConversationModal;
