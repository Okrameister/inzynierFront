// ConversationList.jsx
import React, { useEffect, useState } from 'react';
import '../styles/ConversationList.css';

const ConversationList = ({ conversations, onConversationClick, token, selectedConversation }) => {
    const [lastMessages, setLastMessages] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        // Pobierz dane aktualnego użytkownika z backendu
        fetch('/api/users/profile', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd sieci');
                }
                return response.json();
            })
            .then(user => {
                setCurrentUserId(user.id);
                setIsLoadingUser(false);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania profilu użytkownika:', error);
                setIsLoadingUser(false);
            });
    }, [token]);

    useEffect(() => {
        conversations.forEach(conversation => {
            fetch(`/api/chat/conversations/${conversation.id}/messages`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(response => response.json())
                .then(messages => {
                    if (messages.length > 0) {
                        setLastMessages(prev => ({
                            ...prev,
                            [conversation.id]: messages[messages.length - 1]
                        }));
                    }
                })
                .catch(error => console.error('Błąd podczas pobierania wiadomości:', error));
        });
    }, [conversations, token]);

    const getConversationName = (conversation) => {
        if (isLoadingUser) {
            return 'Ładowanie...';
        }

        if (conversation.isGroup) {
            return conversation.name || 'Konwersacja grupowa';
        } else {
            // Konwersacja indywidualna
            const participants = conversation.participants;
            const otherParticipant = participants.find(user => user.id !== currentUserId);
            if (otherParticipant) {
                return `${otherParticipant.firstName} ${otherParticipant.lastName}`;
            } else {
                return 'Konwersacja';
            }
        }
    };

    if (isLoadingUser) {
        return <div className="conversation-list">Ładowanie...</div>;
    }

    return (
        <div className="conversation-list">
            {conversations.map(conversation => (
                <div
                    key={conversation.id}
                    className={`conversation-item ${selectedConversation && selectedConversation.id === conversation.id ? 'active' : ''}`}
                    onClick={() => onConversationClick(conversation)}
                >
                    <h4 className="conversation-name">{getConversationName(conversation)}</h4>
                    <p className="conversation-last-message">
                        {lastMessages[conversation.id]
                            ? lastMessages[conversation.id].content
                            : 'Brak wiadomości'}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ConversationList;
