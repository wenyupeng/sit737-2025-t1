'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    return (
        <button
            type="button"
            className="w-600 p-4 font-bold hover:bg-black hover:text-white"
            onClick={() => router.push('/user')}
        >
            Log Out
        </button>
    );
}
