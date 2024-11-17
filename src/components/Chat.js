import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = ({ currentUserEmail, otherUserEmail }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Fetch messages when the component is mounted or when otherUserEmail changes
        const fetchMessages = async () => {
            try {
                const response = await axios.get('/api/chat/messages', {
                    params: { otherEmail: otherUserEmail },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [otherUserEmail]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const response = await axios.post('/api/chat/send', null, {
                params: {
                    receiverEmail: otherUserEmail,
                    content: newMessage
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Append the new message to the chat
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender.email === currentUserEmail ? 'sent' : 'received'}`}>
                        <div className="message-content">{message.content}</div>
                        <div className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</div>
                    </div>
                ))}
            </div>
            <div className="new-message-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;