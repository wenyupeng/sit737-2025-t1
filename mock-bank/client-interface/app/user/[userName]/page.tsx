import { notFound } from "next/navigation";
import { connectToDatabase } from '@/lib/mongodb';
import { User } from "@/models/User";
import { logInfo } from "@/lib/logger";
import { log } from "console";

interface User {
    userName: string;
    password: string;
    accountId: string;
    createAt: string;
    updateAt: string;
}

interface PageProps {
    params: Promise<{ userName: string }>;
}

const accountService = process.env.ACCOUNT_SERVICE || "http://localhost:3002";
const balanceService = process.env.BALANCE_SERVICE || "http://localhost:3001";

export default async function UserPage({ params }: PageProps) {
    const { userName } = await params;
    const decodedUserName = decodeURIComponent(userName);

    await connectToDatabase();
    const users: User[] = await User.find({ userName: decodedUserName });
    const user = users.find(
        (u) =>
            u.userName.toLowerCase().replace(/\s+/g, "") ===
            decodedUserName.toLowerCase().replace(/\s+/g, "")
    );

    logInfo(`User found: ${user ? user.userName : "not found"}`);

    if (!user) {
        notFound();
    }

    const accountResponse = await fetch(`${accountService}:3000/api/accounts/${user.accountId}`);
    if (!accountResponse.ok) {
        logInfo(`Error fetching account for user ${user.userName}: ${accountResponse.status}`);
        notFound();
    }
    const accountData = await accountResponse.json();
    if (!accountData) {
        notFound();
    }
    const account = accountData[0];

    const balanceResponse = await fetch(`${balanceService}:3000/api/balance?accountId=${user.accountId}`);
    if (!balanceResponse.ok) {
        logInfo(`Error fetching balance for accountId ${user.accountId}: ${balanceResponse.status}`);
        notFound();
    }
    const balanceData = await balanceResponse.json();
    if (!balanceData) {
        notFound();
    }
    logInfo(`Balance data: ${JSON.stringify(balanceData)}`);
    const balanceObj = balanceData.balanceObj;
    const transactionResponse = await fetch(`${balanceService}:3000/api/transaction?accountId=${user.accountId}`);
    const transactionData = await transactionResponse.json();
    if (!transactionData) {
        notFound();
    }
    const transactions = transactionData;
    

    return (
        <main className="flex items-center justify-center min-h-screen py-8 bg-black-100">
            <div className="grid grid-cols-3 gap-6 w-full max-w-6xl p-6 bg-white shadow-lg rounded-xl text-gray-800">

                <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">👤 User Info</h2>
                    <p className="mb-2"><span className="font-medium">User Name:</span> {user.userName}</p>
                    <p className="mb-2"><span className="font-medium">Account ID:</span> {user.accountId}</p>
                    <p className="mb-2"><span className="font-medium">Account Type:</span> {account.accountType}</p>
                    <p className="mb-2"><span className="font-medium">Created At:</span> {new Date(user.createdAt).toLocaleString()}</p>
                </div>

                <div className="col-span-2 grid grid-rows-2 gap-4">

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">💰 Balance Info</h2>
                        <p className="mb-2"><span className="font-medium">Account Balance:</span> {balanceObj.balance}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg overflow-auto">
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">📄 Transaction Info</h2>
                        <ul className="list-disc list-inside space-y-1">
                            {transactions?.length ? (
                                transactions.map((txn, index) => (
                                    <li key={index}>
                                        {txn.description} - {txn.amount} ({new Date(txn.date).toLocaleDateString()})
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500">No transactions available.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </main>


    );
}
