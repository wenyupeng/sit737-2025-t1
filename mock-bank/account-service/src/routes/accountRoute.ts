import { Router, Request, Response, RequestHandler } from "express";
import Account from '../models/Account'
import { logInfo } from "../config/logger";

const balanceService = process.env.BALANCE_SERVICE || 'http://localhost:3001';

const accountRoute = Router();

accountRoute.get('/:accountId', ((async (req: Request, res: Response) => {
    let accountId = req.params.accountId;
    logInfo('Fetching account', { accountId });
    if (!accountId) {
        return res.status(400).json({ message: 'Account ID is required' });
    }
    try {
        const account = await Account.find({ accountId });
        logInfo('Account fetched', { account });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        return res.status(200).json(account);
    } catch (error: any) {
        return res.status(500).json({ message: 'Internal server error' });
    }
})as unknown) as RequestHandler);

accountRoute.post('/', ((async (req: Request, res: Response) => {
    const { accountId, accountType, balance } = req.body;
    logInfo('Creating account', { accountId, accountType, balance });

    const createdAt = new Date();

    if (!accountId || !accountType) {
        return res.status(400).json({ message: 'Account number and account type are required' });
    }


    try {
        const account = new Account({ accountId, accountType, createdAt, updatedAt: createdAt });
        await account.save();
        logInfo('Account created', { accountId });

        const response = await fetch(`${balanceService}:3000/api/balance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accountId, balance }),
        });

        if (!response.ok) {
            logInfo('Balance creation failed. Rolling back account...');
            await Account.deleteOne({ accountId });
            return res.status(500).json({ message: 'Failed to create balance, account rolled back' });
        }

        const balanceData = await response.json();
        logInfo('Balance created', balanceData);

        if (!balanceData) {
            logInfo('Balance data missing. Rolling back account...');
            await Account.deleteOne({ accountId });
            return res.status(500).json({ message: 'Balance response invalid, account rolled back' });
        }

        return res.status(201).json(account);
    } catch (error: any) {
        logInfo('Unexpected error. Attempting rollback...', error);
        await Account.deleteOne({ accountId });
        return res.status(500).json({ message: 'Internal server error with rollback' });
    }
}) as unknown) as RequestHandler);

export { accountRoute };