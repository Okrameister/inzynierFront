import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/EventDetails.css';
import MessageList from './MessageList'; // Import the MessageList component

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isParticipating, setIsParticipating] = useState(false);
    const [conversation, setConversation] = useState(null); // State for the conversation
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchEventDetails();
        fetchParticipants();
        fetchConversation(); // Fetch the conversation for this event
    }, [id]);

    const fetchEventDetails = () => {
        axios.get(`/api/events/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => setEvent(response.data))
            .catch(error => console.error('Błąd podczas pobierania szczegółów wydarzenia:', error));
    };

    const fetchParticipants = () => {
        axios.get(`/api/events/${id}/participants`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setParticipants(response.data);
                checkParticipation(response.data);
            })
            .catch(error => console.error('Błąd podczas pobierania listy uczestników:', error));
    };

    const checkParticipation = (participantList) => {
        axios.get('/api/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const currentUser = response.data;
                setIsParticipating(participantList.some(participant => participant.id === currentUser.id));
            })
            .catch(error => console.error('Błąd podczas sprawdzania uczestnictwa:', error));
    };

    const fetchConversation = () => {
        axios.get('/api/chat/conversations', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const conversations = response.data;
                const eventConversation = conversations.find(convo => convo.eventId === Number(id));
                setConversation(eventConversation); // Set the conversation for this event
            })
            .catch(error => console.error('Błąd podczas pobierania konwersacji:', error));
    };

    const handleJoinLeave = () => {
        const endpoint = isParticipating ? `/api/events/${id}/leave` : `/api/events/${id}/join`;
        axios.post(endpoint, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                fetchParticipants(); // Refresh the participants list
            })
            .catch(error => console.error('Błąd podczas aktualizacji uczestnictwa:', error));
    };

    if (!event) {
        return <div>Ładowanie szczegółów wydarzenia...</div>;
    }

    return (
        <div className="event-details-container">
            {/* Główna zawartość wydarzenia */}
            <div className="event-details-content">
                <h1>{event.title}</h1>
                <p className="event-date">{event.date}</p>
                <p className="event-description">{event.description}</p>

                <div className="event-participants">
                    <h3>Uczestnicy ({participants.length})</h3>
                    <ul>
                        {participants.map(participant => (
                            <li key={participant.id}>{participant.firstName} {participant.lastName}</li>
                        ))}
                    </ul>
                    <button
                        onClick={handleJoinLeave}
                        className={`participation-button ${isParticipating ? 'leave-button' : 'join-button'}`}
                    >
                        {isParticipating ? 'Wypisz się z wydarzenia' : 'Dołącz do wydarzenia'}
                    </button>
                </div>
            </div>

            {conversation && (
                <div className="event-chat">
                    <MessageList className="event-chat-window" conversation={conversation} token={token} />
                </div>
            )}
        </div>
    );

};

export default EventDetails;
