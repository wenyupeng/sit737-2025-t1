import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { logInfo, logError } from '@/lib/logger';

let balanceService = process.env.BALANCE_SERVICE || 'http://localhost:3001';
if (balanceService === 'http://localhost:3001') {
    logInfo('Using local balance service');
} else {
    logInfo('Using remote balance service');
    balanceService = balanceService + ':3000';
}

export async function POST(request: Request) {
    logInfo('POST /api/transaction called');
    await connectToDatabase();
    const { type, accountId, toAccount, amount } = await request.json();
    logInfo(`Transaction type: ${type} Account ID: ${accountId} Amount: ${amount} To Account: ${toAccount}`);
    if (!type || !accountId || !amount) {
        logInfo('Transaction type, account ID, and amount are required');
        return NextResponse.json({ error: 'Transaction type, account ID, and amount are required' }, { status: 400 });
    }

    if (type === 'transfer' && !toAccount) {
        logInfo('To account ID is required for transfer');
        return NextResponse.json({ error: 'To account ID is required for transfer' }, { status: 400 });
    }

    try {
        
        const transaction = {
            transactionType: type || '', transactionAmount: amount, transactionDate: new Date(), fromAccountId: accountId, toAccountId: toAccount
        }
        const response = await fetch(`${balanceService}/api/transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });

        if (!response.ok) {
            const errorData = await response.json();
            logError(`Transaction failed: ${errorData.error}`);
            return NextResponse.json({ error: errorData.error }, { status: 500 });
        }

        const data = await response.json();
        logInfo(`Transaction successful: ${JSON.stringify(data)}`);
        return NextResponse.json(data);
    } catch (error) {
        logError(`Transaction error: ${error}`);
        return NextResponse.json({ error: 'Transaction failed. Please try again.' }, { status: 500 });
    }
}