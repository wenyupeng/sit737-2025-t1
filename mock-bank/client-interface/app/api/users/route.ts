import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import {logInfo, logError} from '@/lib/logger';
import { log } from 'console';

export async function GET() {
    logInfo('GET /api/users called');
    await connectToDatabase();
    const users = await User.find({});
    logInfo('users', users);
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    logInfo('POST /api/users called');
    await connectToDatabase();
    const { name, studentId,gender, email } = await request.json();
    const newUser = new User({ name, studentId,gender, email });
    logInfo('newUser', newUser);
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
}
