import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { logInfo, logError } from '@/lib/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SIT737';

export async function POST(request: Request) {
    logInfo('POST /api/users/login called');

    try {
        await connectToDatabase();

        const { userName, password } = await request.json();

        const userInfo = await User.findOne({ userName });

        if (!userInfo) {
            logInfo(`Login failed: User not found [${userName}]`);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(password, userInfo.password);
        if (!passwordMatch) {
            logInfo(`Login failed: Incorrect password [${userName}]`);
            return NextResponse.json({ error: 'Password incorrect' }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: userInfo._id, userName: userInfo.userName },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        logInfo(`Login successful [${userName}]`);

        return NextResponse.json(
            {
                message: 'Login successful',
                token,
                user: {
                    userName: userInfo.userName,
                },
            },
            { status: 200 }
        );
    } catch (error: any){
        logError('Login error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
