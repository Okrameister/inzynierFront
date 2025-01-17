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
    const [userRole, setUserRole] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const endpoint = isSignup ? '/auth/signup' : '/auth/signin';

        try {
            const response = await axios.post(endpoint, formData);
            const data = response.data;
            setSuccess(isSignup ? 'Registration successful!' : 'Login successful!');

            if (!isSignup) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('isLogged', true);

                // Poczekaj na pobranie roli użytkownika
                const role = await fetchUserRole();
                localStorage.setItem('role', role);
                setUserRole(role);  // Ustawiamy stan
            }

            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                gender: 'Mężczyzna'
            });

            window.location.href = isSignup ? '/auth' : '/';

        } catch (error) {
            setError('An error occurred. Please check your details and try again.');
        }
    };

    const fetchUserRole = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Brak tokena JWT");
                return "";
            }

            const response = await fetch("/api/users/role", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Błąd podczas pobierania roli użytkownika");
            }

            const role = await response.text();  // Pobieramy rolę jako tekst
            return role; // Zwracamy ją do funkcji wywołującej

        } catch (error) {
            console.error("Wystąpił błąd:", error);
            return "";
        }
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
                {isSignup && (
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
                </div>)}

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