'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TransactionPage() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const user = searchParams.get('user') || '';
    const accountId = searchParams.get('accountId') || '';
    const router = useRouter();

    const [amount, setAmount] = useState('');
    const [toAccount, setToAccount] = useState('');

    useEffect(() => {
        if (!['deposit', 'withdraw', 'transfer'].includes(type || '')) {
            alert('Invalid transaction type.');
            router.push('/');
        }
    }, [type, router]);

    const handleSubmit = () => {
        if (!amount) {
            alert('Please enter an amount.');
            return;
        }

        if (type === 'transfer' && !toAccount) {
            alert('Please enter the destination account ID.');
            return;
        }

        fetch('/api/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type,
                accountId,
                toAccount,
                amount,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                alert(`Transaction successful: ${JSON.stringify(data)}`);
                router.back();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Transaction failed. Please try again.');
            });


    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-black-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h1 className="text-2xl font-bold text-center text-black">
                    {type === 'deposit'
                        ? `💰 Deposit Funds — ${user}`
                        : type === 'withdraw'
                            ? `🏧 Withdraw Funds — ${user}`
                            : `🔁 Transfer Funds — ${user}`}
                </h1>

                {type === 'transfer' ? (
                    <>
                        <input
                            type="text"
                            value={accountId}
                            readOnly
                            className="w-full p-2 border rounded text-black bg-gray-100"
                            placeholder="From Account ID"
                        />
                        <input
                            type="text"
                            placeholder="To Account ID"
                            value={toAccount}
                            onChange={(e) => setToAccount(e.target.value)}
                            className="w-full p-2 border rounded text-black"
                        />
                        <input
                            type="number"
                            placeholder="Transfer Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded text-black"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Confirm Transfer
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            type="number"
                            placeholder={`${type === 'deposit' ? 'Deposit' : 'Withdraw'} Amount`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded text-black"
                        />
                        <button
                            onClick={handleSubmit}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Confirm {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </main>
    );
}
