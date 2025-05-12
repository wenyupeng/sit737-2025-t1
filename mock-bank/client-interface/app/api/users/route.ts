import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
    await connectToDatabase();
    const users = await User.find({});
    console.log('users', users);
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    await connectToDatabase();
    const { name, studentId,gender, email } = await request.json();
    const newUser = new User({ name, studentId,gender, email });
    console.log('newUser', newUser);
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
}
