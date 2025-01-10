import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PostForm.css';
import {useNavigate} from "react-router-dom";

const PostForm = ({ onPostCreated }) => {
    const [caption, setCaption] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [video, setVideo] = useState('');

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const postData = {
            caption,
            content,
            image,
            video
        };

        axios.post('api/posts', postData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setCaption('');
                setContent('');
                setImage('');
                setVideo('');
            })
            .catch(error => {
                console.error('Błąd podczas tworzenia posta!', error);
            });
        navigate("/");
    };

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <h2>Dodaj nowy post</h2>
            <div className="form-group">
                <label>Opis:</label>
                <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Treść:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="4"></textarea>
            </div>
            <div className="form-group">
                <label>URL obrazka:</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
            <div className="form-group">
                <label>URL wideo:</label>
                <input type="text" value={video} onChange={(e) => setVideo(e.target.value)} />
            </div>
            <button type="submit" className="post-form-button">Opublikuj</button>
        </form>
    );
};

export default PostForm;
