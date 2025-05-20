import Account from '../models/Account';
import {logInfo, logError} from '../config/logger'

interface AccountParams {
    accountId: string;
    accountType: string;
}

export const createAccount = async (account: AccountParams) => {
    logInfo(`Creating account with account number ${account.accountId}`);
    let createdAt = new Date();
    try {
        const newAccount = new Account({...account, createdAt, updatedAt: createdAt});
        await newAccount.save();
        logInfo(`Account created with account number ${newAccount.accountId}`);
        return newAccount;
    } catch (error: any) {
        logError(`Error creating account: ${error.message}`);
        throw error;
    }
}

export const getAccount = async (accountId: string) => {
    logInfo(`Getting account with account number ${accountId}`);
    try {
        const account = await Account.findOne({accountId});
        if (!account) {
            logError(`Account with account number ${accountId} not found`);
            throw new Error(`Account with account number ${accountId} not found`);
        }
        logInfo(`Account with account number ${accountId} found`);
        return account;
    } catch (error: any) {
        logError(`Error getting account: ${error.message}`);
        throw error;
    }
}

