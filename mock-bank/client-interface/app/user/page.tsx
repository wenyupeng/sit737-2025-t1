'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
    const [userName, setUserName] = useState('');

    const router = useRouter();

    const handleSearch = () => {
        if(userName.trim() !== '') {
            router.push(`/user/${userName}`);
        }
    };

    return (
        <main>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black-100">
                <h1 className="text-4xl font-bold mb-4">User Page</h1>
                <p className="text-lg mb-8">Welcome to the user page!</p>
                <input
                    type="text"
                    placeholder="Enter user name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 mb-4"
                />
                <button onClick={handleSearch} 
                    className='bg-blue-500 text-white px-4 py-2 rounded'
                >Search</button>
            </div>
        </main>
    );
}