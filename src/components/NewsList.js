import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../styles/NewsList.css';
import {Link} from "react-router-dom"; // Import the CSS styles

function NewsList() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = () => {
        const token = localStorage.getItem('token');
        axios
            .get('/api/news', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                setNews(response.data);
            })
            .catch((error) => {
                console.error('Error fetching news!', error);
            });
    };

    const role = localStorage.getItem('role');

    return (
        <div className="news-list-container">

            {role==="ADMIN" && <Link to="/create-news">
                <button className="news-header-button" >
                    Dodaj wpis
                </button>
            </Link>}
            <h1>Aktualności</h1>
            {news.map(item => (
                <div key={item.id} className="news-item">
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                    {item.user && (
                        <p className="news-author">
                            Dodane przez: {item.user.firstName} {item.user.lastName}
                        </p>
                    )}
                    <p>Data dodania: {new Date(item.createdAt).toISOString().split('T')[0]}</p>
                </div>
            ))}
        </div>
    );
}

export default NewsList;
