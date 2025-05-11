import { notFound } from "next/navigation";
import { connectToDatabase } from '@/lib/mongodb';
import { User } from "@/models/User";

interface User {
    name: string;
    studentId: string;
    gender: string;
    email?: string;
}

interface PageProps {
    params: {
        userName: string;
    };
}

export default async function UserPage({ params }: PageProps) {
    const { userName } = await params;
    const decodedUserName = decodeURIComponent(userName);

    await connectToDatabase();
    const users: User[] = await User.find({});
    const user = users.find(
        (u) =>
            u.name.toLowerCase().replace(/\s+/g, "") ===
            decodedUserName.toLowerCase().replace(/\s+/g, "")
    );

    if (!user) {
        notFound();
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-2">
            <div>
                <h1 className="text-3xl font-bold mb-2">User: {user.name}</h1>
                <p>Student ID: {user.studentId}</p>
                <p>Gender: {user.gender}</p>
                <p>Email: {user.email}</p>
            </div>
        </main>
    );
}
