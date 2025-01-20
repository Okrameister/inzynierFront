// ChatComponent.jsx
import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import NewConversationModal from './NewConversationModal';
import '../styles/Chat.css'; // Importowanie pliku CSS

const Chat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);

    const token = localStorage.getItem('token'); // Zakładamy, że token jest przechowywany w localStorage

    useEffect(() => {
        fetch('/api/chat/conversations', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => setConversations(filterConversations(data)))
            .catch(error => console.error('Błąd podczas pobierania konwersacji:', error));
    }, [token]);

    const filterConversations = (conversations) => {
        return conversations.filter(conversation => conversation.eventId === null);
    };

    const handleConversationClick = (conversation) => {
        setSelectedConversation(conversation);
    };

    const handleNewConversation = (newConversation) => {
        const filteredConversations = filterConversations([...conversations, newConversation]);
        setConversations(filteredConversations);
        setShowNewConversationModal(false);
        setSelectedConversation(newConversation);
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <button className="new-conversation-button" onClick={() => setShowNewConversationModal(true)}>
                    Nowa konwersacja
                </button>
                <ConversationList
                    conversations={conversations}
                    onConversationClick={handleConversationClick}
                    token={token}
                    selectedConversation={selectedConversation}
                />
            </div>
            <div className="chat-content">
                {selectedConversation ? (
                    <MessageList
                        conversation={selectedConversation}
                        token={token}
                    />
                ) : (
                    <div className="no-conversation">
                        <p>Wybierz konwersację, aby rozpocząć czat.</p>
                    </div>
                )}
            </div>

            {showNewConversationModal && (
                <NewConversationModal
                    onClose={() => setShowNewConversationModal(false)}
                    onCreate={handleNewConversation}
                    token={token}
                />
            )}
        </div>
    );
};

export default Chat;
