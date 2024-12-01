// Comments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Comments.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const isLogged = localStorage.getItem('isLogged');

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');

    // Function to get JWT token from local storage or any other storage mechanism
    const token = localStorage.getItem('token');


    useEffect(() => {
        // Fetch comments for the given postId
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments/post/${postId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                // Assume response.data includes a `likedByUser` field for each comment
                setComments(response.data.map(comment => ({
                    ...comment,
                    likedByUser: comment.liked.includes(token)
                })));
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [postId]);

    // Handle adding a new comment
    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `/api/comments/post/${postId}`,
                { content: newCommentContent },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            setComments([...comments, response.data]);
            setNewCommentContent('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Handle liking a comment
    const handleLikeComment = async (commentId) => {
        try {
            const response = await axios.put(
                `/api/comments/like/${commentId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            // Update the specific comment in the state
            setComments(
                comments.map((comment) =>
                    comment.id === commentId ? {
                        ...response.data,
                        likedByUser: !comment.likedByUser
                    } : comment
                )
            );
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    // Handle deleting a comment
    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(
                `/api/comments/${commentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`

                    },
                }
            );
            // Update the state by removing the deleted comment
            setComments(comments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="comments-container">
            <h3 className="comments-title">Komentarze</h3>
            <ul className="comments-list">
                {comments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                        <p className="comment-author">{comment.user.firstName} {comment.user.lastName}</p>
                        <p className="comment-content">{comment.content}</p>
                        <div className="comment-likes-container">
                            <span className="comment-likes">Polubienia: {comment.liked.length}</span>
                            {isLogged && ( <FontAwesomeIcon
                                icon={comment.likedByUser ? faThumbsDown : faThumbsUp}
                                className="comment-like-icon"
                                onClick={() => handleLikeComment(comment.id)}
                            />)}
                        </div>
                        {isLogged && (<button className="comment-delete-button" onClick={() => handleDeleteComment(comment.id)}>Delete</button>)}
                    </li>
                ))}
            </ul>
            {isLogged && (<form className="add-comment-form" onSubmit={handleAddComment}>
                <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="new-comment-textarea"
                    required
                />
                <br />
                <button type="submit" className="add-comment-button">Add Comment</button>
            </form>)}
        </div>
    );
};

export default Comments;
