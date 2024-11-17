// PostList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import './PostList.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        const token = localStorage.getItem('token');

        axios.get('/api/posts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania postów!', error);
            });
    };

    return (
        <div className="post-list-container">
            <h1>Posty</h1>
            {posts.map(post => (
                <div key={post.id} className="post-item">
                    <Post post={post} onPostUpdated={fetchPosts} />
                </div>
            ))}
        </div>
    );
};

export default PostList;
