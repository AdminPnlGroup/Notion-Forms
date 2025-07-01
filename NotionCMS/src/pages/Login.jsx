import React, { useState } from 'react';
import pnl from '../assets/images/PNL.png';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import users from '../data/users';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // ต้องรับ parameter
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const matchedUser = users.find(
            user =>
                user.username.toLowerCase() === username.toLowerCase() &&
                user.password === password
        );

        if (matchedUser) {
            login(matchedUser); // ✅ ส่งข้อมูล user ที่ล็อกอิน
            navigate('/');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="w-full mx-auto">
                <img alt="PNL group" src={pnl} className="mx-auto h-40 w-auto" loading="lazy" />
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">Username</label>
                        <input
                            id="email"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-2 block w-full rounded-md px-3 py-1.5 border border-gray-300 text-gray-900 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-2 block w-full rounded-md px-3 py-1.5 border border-gray-300 text-gray-900 sm:text-sm"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-indigo-500">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
