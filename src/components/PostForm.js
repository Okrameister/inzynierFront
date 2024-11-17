// PostForm.js
import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ onPostCreated }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    const [video, setVideo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const postData = {
            caption,
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
                setImage('');
                setVideo('');
                onPostCreated();
            })
            .catch(error => {
                console.error('Błąd podczas tworzenia posta!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Dodaj nowy post</h2>
            <div>
                <label>Opis:</label>
                <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <div>
                <label>URL obrazka:</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
            <div>
                <label>URL wideo:</label>
                <input type="text" value={video} onChange={(e) => setVideo(e.target.value)} />
            </div>
            <button type="submit">Opublikuj</button>
        </form>
    );
};

export default PostForm;
