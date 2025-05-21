import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { logInfo, logError } from '@/lib/logger';
import bcrypt from 'bcrypt';

let accountService = process.env.ACCOUNT_SERVICE || 'http://localhost:3002';

if (accountService === 'http://localhost:3002') {
    logInfo('Using local account service');
} else {
    logInfo('Using remote account service');
    accountService = accountService + ':3000';
}

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

    const { userName, password, accountId, accountType,balance } = await request.json();

    if (!userName || !password) {
        logInfo('User name and password are required');
        return NextResponse.json({ error: 'User name and password are required' }, { status: 400 });
    }

    if (!accountId) {
        logInfo('Account ID is required');
        return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
        logInfo(`User already exists [${userName}]`);
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const createdAt = new Date();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userName,
            password: hashedPassword,
            accountId,
            createdAt,
            updateAt: createdAt,
        });

        await newUser.save();
        logInfo(`User created [${userName}]`);

        const response = await fetch(`${accountService}/api/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accountId, accountType, balance }),
        });

        if (!response.ok) {
            logError(`response from account service: ${response.statusText}`);
            logError(`Failed to create account for user [${userName}], rolling back user creation`);
            await User.deleteOne({ userName });
            return NextResponse.json({ error: 'Failed to create account, user rolled back' }, { status: 500 });
        }

        const accountData = await response.json();
        logInfo(`Account created for [${userName}]`);

        return NextResponse.json(
            {
                message: 'User and account created successfully',
                user: {
                    userName: newUser.userName,
                    accountId: newUser.accountId,
                    createdAt: newUser.createdAt,
                },
                accountType: accountData.accountType,
            },
            { status: 201 }
        );
    } catch (error: any) {
        logError('Error creating user or account', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
