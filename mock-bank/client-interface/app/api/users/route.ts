import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
    await connectToDatabase();
    const users = await User.find({});
    console.log('users', users);
    return NextResponse.json(users);
}

