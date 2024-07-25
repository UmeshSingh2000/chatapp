import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import img1 from '../assets/windows-J_s7hzjV9i0-unsplash.jpg'
import { Link, useNavigate } from 'react-router-dom';



const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
        if (name === 'confirmPassword') setConfirmPassword(value);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setResponse('Password does not match');
            return;
        }
        setLoading(true)
        try {
            const response = await axios.post('https://backend-v52s.onrender.com/register', {
                username,
                password
            });

            console.log(response.data);
            setResponse(response.data.message)
            setTimeout(() => {
                navigate('/');
                setLoading(false)
            }, 2000);
        } catch (err) {
            if (err.response && err.response.data) {
                setResponse(err.response.data.message);
            } else {
                setResponse('An error occurred. Please try again.');
            }
            setLoading(false)
        }
    };
    return (
        <div className='form_Container'>
            <div className='login'>
                <div className='right'><img src={img1} alt="" /></div>
                <div className="left">
                    <Link to='/'><p className='register'>Login</p></Link>
                    <h1>Register</h1>
                    <h3>Welcome! Please fill Username and Password</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                id="username"
                                value={username}
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                required
                            />
                            <input type="password" placeholder='Confirm Password' name='confirmPassword' value={confirmPassword}
                                onChange={handleInputChange} required />
                        </div>
                        {loading && (
                            <div className="loading-bar-container">
                                <div className="loading-bar"></div>
                            </div>
                        )}
                        {response && <p >{response}</p>}
                        <div>
                            <button type="submit" disabled={loading}>Register</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default SignUp
