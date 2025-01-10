// HomePage.js
import React from 'react';
import PostList from './PostList';
import Auth from './Auth';
import '../styles/HomePage.css';
const isLogged = localStorage.getItem('isLogged');

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="post-list-section">
                <PostList />
            </div>
            {!isLogged && ( <div className="auth-section">
                <Auth />
            </div>)}
        </div>
    );
};

export default HomePage;