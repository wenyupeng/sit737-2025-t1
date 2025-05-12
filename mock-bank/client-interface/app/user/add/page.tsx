'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    name: string;
    studentId: string;
    gender: string;
    email: string;
}

export default function UserAddPage() {
    const [user, setUser] = useState<User>({
        name: '',
        studentId: '',
        gender: '',
        email: ''
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Logic to add new user goes here
        console.log('New user added:', user);
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('User added successfully:', data);
            })
            .catch((error) => {
                console.error('Error adding user:', error);
            });
        router.push('/user');
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-2 bg-black-100">
            <h1 className="text-4xl font-bold mb-4">Add New User</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={user.name}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2"
                />
                <input
                    type="text"
                    name="studentId"
                    placeholder="Student ID"
                    value={user.studentId}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2"
                />
                <input
                    type="text"
                    name="gender"
                    placeholder='gender'
                    value={user.gender}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2"
                />
                <button type="submit" className="bg-blue-500 w-100 text-white px-4 py-2 rounded">
                    Add User
                </button>
            </form>
            <button onClick={() => router.push('/user')} className="mt-4 w-100 bg-gray-500 text-white px-4 py-2 rounded">
                Back Welcome Page
            </button>
        </main>
    );
}