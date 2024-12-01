import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Auth.css';

function Auth({ isLoginDefault = true }) {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: 'Mężczyzna'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setIsSignup(!isLoginDefault);
    }, [isLoginDefault]);

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

        const endpoint = isSignup ? '/auth/signup' : '/auth/signin';

        axios.post(endpoint, formData)
            .then(response => {
                const data = response.data;
                setSuccess(isSignup ? 'Registration successful!' : 'Login successful!');
                if (!isSignup) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('isLogged', true);
                }
                setFormData({
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    gender: ''
                });
                if(isSignup){
                    window.location.href = '/auth';
                }else window.location.href = '/home';
            })
            .catch(error => {
                setError('An error occurred. Please check your details and try again.');
            });
    };

    return (
        <div className="auth-container">
            <h2>{isSignup ? 'Sign Up' : 'Sign In'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
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
                        <div className="gender-selection">
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Mężczyzna"
                                    checked={formData.gender === 'Mężczyzna'}
                                    onChange={handleChange}
                                    required
                                />
                                Mężczyzna
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Kobieta"
                                    checked={formData.gender === 'Kobieta'}
                                    onChange={handleChange}
                                    required
                                />
                                Kobieta
                            </label>
                        </div>
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
                <div className="button-container">
                    <button type="submit" className="auth-submit-button">{isSignup ? 'Sign Up' : 'Sign In'}</button>
                    <button className="toggle-form-button no-hover-effect" onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Auth;