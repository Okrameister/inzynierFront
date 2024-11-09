import React, { useState } from 'react';
import axios from 'axios';

function Auth() {
    const [isSignup, setIsSignup] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const endpoint = isSignup
            ? '/auth/signup'
            : '/auth/signin';

        axios.post(endpoint, formData)
            .then(response => {
                const data = response.data;
                setSuccess(isSignup ? 'Registration successful!' : 'Login successful!');
                if (!isSignup) {
                    localStorage.setItem('token', data.token);
                }
                setFormData({
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    gender: ''
                });
            })
            .catch(error => {
                setError('An error occurred. Please check your details and try again.');
            });
    };

    return (
        <div>
            <h2>{isSignup ? 'Sign Up' : 'Sign In'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                {isSignup && (
                    <>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="gender"
                            placeholder="Gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isSignup ? 'Sign Up' : 'Sign In'}</button>
            </form>
            <button onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
            </button>
        </div>
    );
}

export default Auth;
