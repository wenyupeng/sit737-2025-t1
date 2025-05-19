import Account from '../models/Account';
import {logInfo, logError} from '../config/logger'

interface AccountParams {
    accountNumber: string;
    accountType: string;
}

export const createAccount = async (account: AccountParams) => {
    logInfo(`Creating account with account number ${account.accountNumber}`);
    let createdAt = new Date();
    try {
        const newAccount = new Account({...account, createdAt, updatedAt: createdAt});
        await newAccount.save();
        logInfo(`Account created with account number ${newAccount.accountNumber}`);
        return newAccount;
    } catch (error) {
        logError(`Error creating account: ${error.message}`);
        throw error;
    }
}

export const getAccount = async (accountNumber: string) => {
    logInfo(`Getting account with account number ${accountNumber}`);
    try {
        const account = await Account.findOne({accountNumber});
        if (!account) {
            logError(`Account with account number ${accountNumber} not found`);
            throw new Error(`Account with account number ${accountNumber} not found`);
        }
        logInfo(`Account with account number ${accountNumber} found`);
        return account;
    } catch (error) {
        logError(`Error getting account: ${error.message}`);
        throw error;
    }
}

