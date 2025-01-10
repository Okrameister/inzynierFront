// PostList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import '../styles/PostList.css';
import {Link} from "react-router-dom";
const isLogged = localStorage.getItem('isLogged');

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
            <div className="post-container-header">
                {isLogged && <Link to="/create-post">
                    <button className="post-header-button" >
                        Dodaj post
                    </button>
                </Link>}
                <h1>Posty</h1>
            </div>
            {posts.map(post => (
                <div key={post.id} className="post-item">
                    <Post post={post} onPostUpdated={fetchPosts} />
                </div>
            ))}
        </div>
    );
};

export default PostList;
