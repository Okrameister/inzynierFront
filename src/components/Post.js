// Post.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Comments from './Comments';
import { useParams } from 'react-router-dom';
import './Post.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
const isLogged = localStorage.getItem('isLogged');

const token = localStorage.getItem('token');
const Post = ({ post, onPostUpdated }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleToggleLike = () => {
        axios.put(`/api/posts/like/${post.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const updatedPost = response.data.post;
                const liked = response.data.isLiked;
                setIsLiked(liked);
                onPostUpdated(); // Odśwież listę postów, jeśli to konieczne
            })
            .catch(error => {
                console.error('Błąd podczas przełączania polubienia posta!', error);
            });
    };

    return (
        <div className="post-container">
            <div className="post-header">
                <h3 className="post-caption post-header-align-bottom">{post.caption}</h3>
                <span className="post-author post-header-align-bottom">By: {post.user.firstName} {post.user.lastName}</span>
            </div>
            {post.image && <img src={post.image} alt="Obrazek posta" className="post-image" />}
            {post.video && <video src={post.video} controls className="post-video" />}
            <p className="post-likes">Polubienia: {post.liked.length}</p>

            {isLogged && (  <FontAwesomeIcon
                icon={isLiked ? faThumbsDown : faThumbsUp}
                className="post-like-icon"
                onClick={handleToggleLike}
            />)}

            <Comments postId={post.id} />

        </div>
    );
};

export default Post;
