'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const login = async () => {
        if (userName.trim() === '' || password.trim() === '') {
            setError('Username and password cannot be empty.');
            return;
        }

        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });

            if (res.ok) {
                router.push(`/user/${userName}`);
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error. Please try again later.');
        }
    };

    const addUsers = () => {
        router.push('/user/add');
    };

    return (
        <main>
            <div className="flex flex-col items-center justify-center min-h-screen py-4 bg-black-100">
                <h1 className="text-4xl font-bold mb-4 w-full text-center">User Page</h1>
                <p className="text-lg mb-8 w-full text-center">Welcome to the user page!</p>

                <div className="w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Enter user name"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        className="border border-gray-300 rounded-lg p-4 mb-2 w-full"
                    />
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg p-4 mb-4 w-full"
                    />

                    {error && (
                        <div className="text-red-500 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={login}
                        className="bg-blue-500 w-full text-white px-4 py-2 rounded"
                    >
                        Enter
                    </button>

                    <button
                        onClick={addUsers}
                        className="bg-red-500 w-full text-white px-4 py-2 rounded mt-4"
                    >
                        Add New Customers
                    </button>
                </div>
            </div>
        </main>
    );
}
