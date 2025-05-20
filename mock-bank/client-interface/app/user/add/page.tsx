'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

interface User {
    userName: string;
    password: string;
    accountId: string;
    accountType: string;
    balance?: number;
}

const accountTypes = ['normal', 'gold', 'diamond'];

const getBalanceByType = (type: string): number => {
    switch (type) {
        case 'normal':
            return 1000;
        case 'gold':
            return 10000;
        case 'diamond':
            return 100000;
        default:
            return 0;
    }
};

export default function UserAddPage() {
    const [user, setUser] = useState<User>({
        userName: '',
        password: '',
        accountId: '',
        accountType: 'normal',
        balance: 1000,
    });

    const router = useRouter();

    useEffect(() => {
        setUser(prev => ({ ...prev, accountId: uuidv4() }));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'accountType') {
            const newBalance = getBalanceByType(value);
            setUser(prev => ({
                ...prev,
                accountType: value,
                balance: newBalance,
            }));
        } else {
            setUser(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const msg= await response.json();
                alert('Failed to add user: ' + msg.error);
                return;
            };

            const data = await response.json();
            console.log('User added successfully:', data);
            router.push('/user');
        } catch (error: any){
            console.error('Error adding user:', error);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-2 bg-black-100">
            <h1 className="text-4xl font-bold mb-4">Add New User</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
                <input
                    type="text"
                    name="userName"
                    placeholder="User Name"
                    value={user.userName}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2"
                    required
                />
                <input
                    type="text"
                    name="accountId"
                    value={user.accountId}
                    readOnly
                    className="border border-gray-300 rounded-lg p-2 bg-black-200"
                />
                <select
                    name="accountType"
                    value={user.accountType}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 bg-black"
                >
                    {accountTypes.map(type => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>
                <div className="text-lg">
                    Balance: <strong>${user.balance}</strong>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
                    Add User
                </button>
                <button
                    onClick={() => router.push('/user')}
                    className="w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Back to User Page
                </button>
            </form>
        </main>
    );
}
