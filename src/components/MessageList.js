// MessageList.jsx
import React, { useEffect, useState, useRef } from 'react';
import '../styles/MessageList.css'; // Import pliku CSS


const MessageList = ({ conversation, token }) => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const messagesEndRef = useRef(null);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
      fetch('/api/users/profile', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
        .then(response => response.json())
        .then(user => setCurrentUser(user))
        .catch(error => console.error('Błąd podczas pobierania profilu użytkownika:', error));
    }, [token]);

    useEffect(() => {
        fetch(`/api/chat/conversations/${conversation.id}/messages`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                setMessages(data);
                scrollToBottom();
            })
            .catch(error => console.error('Błąd podczas pobierania wiadomości:', error));
    }, [conversation.id, token]);

    const sendMessage = () => {
        if (content.trim() === '') return;

        fetch(`/api/chat/conversations/${conversation.id}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ content })
        })
            .then(response => response.json())
            .then(message => {
                setMessages([...messages, message]);
                setContent('');
                scrollToBottom();
            })
            .catch(error => console.error('Błąd podczas wysyłania wiadomości:', error));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!currentUser) {
        return <div className="message-list-container">Ładowanie...</div>;
    }

    return (
        <div className="message-list-container">
            <div className="message-list-header">
                <h3>{conversation.name || 'Konwersacja'}</h3>
            </div>
            <div className="message-list">
                {messages.map(message => {
                    const isOwnMessage = message.sender.id === currentUser.id;
                    return (
                        <div
                            key={message.id}
                            className={`message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}
                        >
                            <div className="message-sender">{message.sender.firstName}:</div>
                            <div className="message-content">{message.content}</div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="message-input-container">
                <input
                    type="text"
                    placeholder="Napisz wiadomość..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="message-input"
                />
                <button onClick={sendMessage} className="send-button">Wyślij</button>
            </div>
        </div>
    );
};

export default MessageList;
