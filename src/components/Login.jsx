import React, { useEffect, useState } from 'react';
import axios from 'axios';
import img1 from '../assets/avi-richards-Z3ownETsdNQ-unsplash.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };
    useEffect(() => {
        const value = localStorage.getItem('login');
        if (value === 'true') {
            setLoading(true)
            setSuccess('Logging You in')
            setTimeout(() => {
                navigate('/homepage')
                setLoading(false)
                setSuccess('')
            }, 2000);
        }
    }, [navigate])




    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password
            });

            setSuccess(response.data.message);
            localStorage.setItem("login", true)
            localStorage.setItem('username',username)
            setError('');

            // Redirect to homepage after successful login
            setTimeout(() => {
                navigate('/homepage');
                setLoading(false);
            }, 2000);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again.');
            }
            setSuccess('');
            setLoading(false);

        }
    };

    return (
        <div className='form_Container'>
            <div className='login'>
                <div className="left">
                    <Link to='/signup'><p className='register'>Register</p></Link>
                    <h1>Login</h1>
                    <h3>Welcome! Please fill in Username and Password</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                id="username"
                                value={username}
                                onChange={handleUsername}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={handlePassword}
                                required
                            />
                        </div>
                        {loading && (
                            <div className="loading-bar-container">
                                <div className="loading-bar"></div>
                            </div>
                        )}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                        <div>
                            <button type="submit" disabled={loading}>Login</button>
                        </div>
                    </form>
                </div>
                <div className='right'><img src={img1} alt="Login Visual" /></div>
            </div>
        </div>
    );
};

export default Login;
