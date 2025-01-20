import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EventDashboard.css';
import EventForm from './EventForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const EventDashboard = () => {
    const [events, setEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventFormVisible, setIsEventFormVisible] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchEventsForMonth();
        fetchUpcomingEvents();
    }, [currentDate]);

    const fetchEventsForMonth = () => {
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

        axios.get(`/api/events?start=${start}&end=${end}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => setEvents(response.data))
            .catch(error => console.error('Błąd podczas pobierania wydarzeń:', error));
    };

    const fetchUpcomingEvents = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(today.getDate() + 30);

        const start = today.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];

        axios.get(`/api/events?start=${start}&end=${end}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const filteredEvents = response.data.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= today;
                });

                const sortedEvents = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
                setUpcomingEvents(sortedEvents);
            })
            .catch(error => console.error('Błąd podczas pobierania nadchodzących wydarzeń:', error));
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setIsEventFormVisible(true);
    };

    const handleAddEvent = () => {
        setSelectedEvent(null);
        setIsEventFormVisible(true);
    };

    const handleEventFormClose = () => {
        setIsEventFormVisible(false);
        fetchEventsForMonth();
    };

    const renderDaysOfWeek = () => {
        const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
        return daysOfWeek.map(day => (
            <div key={day} className="calendar-day-header">
                {day}
            </div>
        ));
    };

    const renderCalendar = () => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const days = [];

        const areDatesEqual = (date1, date2) => {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
        };

        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const event = events.find(event => {
                const eventDate = new Date(event.date);
                return areDatesEqual(eventDate, date);
            });

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${areDatesEqual(date, todayDate) ? 'calendar-today' : ''} ${event ? 'calendar-has-event' : ''}`}
                >
                    <div
                        className="calendar-day-content"
                        onClick={() => event && navigate(`/event/${event.id}`)}
                    >
                        {day}
                    </div>
                    {role === 'ADMIN' && event && (
                        <FontAwesomeIcon
                            icon={faEdit}
                            className="edit-icon"
                            onClick={() => handleEditEvent(event)}
                        />
                    )}
                </div>
            );
        }

        return days;
    };

    const handleEventClick = eventId => {
        navigate(`/event/${eventId}`);
    };

    const isToday = eventDate => {
        const today = new Date();
        const event = new Date(eventDate);

        return (
            today.getFullYear() === event.getFullYear() &&
            today.getMonth() === event.getMonth() &&
            today.getDate() === event.getDate()
        );
    };

    return (
        <div className="event-dashboard">
            <div className="dashboard-container">
                <div className="dashboard-sidebar">
                    <h2 className="dashboard-title">Nadchodzące wydarzenia</h2>
                    {role === 'ADMIN' && (
                        <button className="calendar-add-button" onClick={handleAddEvent}>
                            Dodaj wydarzenie
                        </button>
                    )}
                    {upcomingEvents.length === 0 ? (
                        <p className="dashboard-no-events">Brak nadchodzących wydarzeń.</p>
                    ) : (
                        upcomingEvents.map(event => (
                            <div
                                key={event.id}
                                className={`dashboard-event-item ${isToday(event.date) ? 'today-event' : ''}`}
                            >
                                <div onClick={() => handleEventClick(event.id)}>
                                    <h3 className="dashboard-event-title">{event.title}</h3>
                                    <p className="dashboard-event-date">{new Date(event.date).toLocaleDateString('pl-PL')}</p>
                                </div>
                                {role === 'ADMIN' && (
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className="edit-icon"
                                        onClick={() => handleEditEvent(event)}
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div className="dashboard-content">
                    <div className="calendar-header">
                        <button
                            className="calendar-nav-button"
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        >
                            Poprzedni
                        </button>
                        <h2 className="calendar-title">
                            {currentDate.toLocaleString('pl-PL', {
                                month: 'long',
                                year: 'numeric',
                            }).replace(/^\w/, c => c.toUpperCase())}
                        </h2>
                        <button
                            className="calendar-nav-button"
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        >
                            Następny
                        </button>
                    </div>
                    <div className="calendar-grid">
                        {renderDaysOfWeek()}
                        {renderCalendar()}
                    </div>
                </div>
            </div>
            {isEventFormVisible && (
                <EventForm
                    event={selectedEvent}
                    onClose={handleEventFormClose}
                />
            )}
        </div>
    );
};


export default EventDashboard;
