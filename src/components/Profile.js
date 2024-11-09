import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch user profile data from backend using /users/profile
        axios.get('/users/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`.trim()
            }
        })
            .then(response => {
                setProfileData(response.data);
            })
            .catch(error => {
                setError('Unable to fetch profile data. Please try again later.');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Update user profile data using /api/users endpoint
        axios.put('/api/users', profileData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`.trim()
            }
        })
            .then(response => {
                setSuccess('Profile updated successfully!');
                setEditMode(false);
            })
            .catch(error => {
                setError('An error occurred while updating profile. Please try again.');
            });
    };

    return (
        <div>
            <h2>User Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSave}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={profileData.firstName}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={profileData.lastName}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled
                />
                <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={profileData.gender}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                />
                {editMode ? (
                    <button type="submit">Save Changes</button>
                ) : (
                    <button type="button" onClick={() => setEditMode(true)}>Edit Profile</button>
                )}
            </form>
        </div>
    );
}

export default Profile;
