import { Router, Request, Response } from "express";
import Account from '../models/Account'

const accountRoute = Router();

accountRoute.get('/:accountId', async(req:Request, res:Response)=>{
    let accountId = req.params.accountId;

    if (!accountId) {
        return res.status(400).json({ message: 'Account ID is required' });
    }
    try {
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        return res.status(200).json(account);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

accountRoute.post('/', async(req:Request, res:Response)=>{
    const { accountId, accountType } = req.body;
    let createdAt = new Date();
    if (!accountId || !accountType) {
        return res.status(400).json({ message: 'Account number and account type are required' });
    }
    try {
        const account = new Account({ accountId, accountType,createdAt,updatedAt:createdAt });
        await account.save();
        return res.status(201).json(account);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export {accountRoute};