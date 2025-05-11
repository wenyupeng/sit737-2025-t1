import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface User {
    name: string;
    studentId: string;
    gender: string;
    email?: string;
}

interface PageProps {
    params: Promise<{ userName: string }>; 
}

export default async function UserPage({ params }: PageProps) { 
    const { userName } = await params;
    const decodedUserName = decodeURIComponent(userName);

    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";

    let users: User[] = [];

    try {
        const res = await fetch(`${protocol}://${host}/api/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch users");
        users = await res.json();
    } catch (error) {
        console.error("Failed to fetch users:", error);
        notFound();
    }
    const user = users.find(
        (u) => {
            console.log("u.name", u.name.toLowerCase().replaceAll(" ", ""));
            console.log("userName", decodedUserName.toLowerCase().replaceAll(" ", ""));
            return u.name.toLowerCase().replaceAll("%20", "") === decodedUserName.toLowerCase().replaceAll("", "");
        }
    );

    console.log("user", user);
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