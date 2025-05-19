import Balance from '../models/Balance';
import {logInfo,logError} from '../config/logger';


export const getBalance = async (accountId: string) => {
    try {
        const balance = await Balance.findOne({ accountId });
        if (balance) {
            logInfo(`Balance for account ${accountId} found`);
            return balance;
        } else {
            logError(`Balance for account ${accountId} not found`);
            return null;
        }
    } catch (error) {
        logError(`Error getting balance for account ${accountId}: ${error.message}`);
        return null;
    }
};

export const updateBalance = async (accountId: string, balance: number, updateDate: Date) => {
    try {
        const updatedBalance = await Balance.findOneAndUpdate(
            { accountId },
            { $set: { balance, updateDate } },
            { new: true, upsert: true }
        );
        if (updatedBalance) {
            logInfo(`Balance for account ${accountId} updated`);
            return updatedBalance;
        } else {
            logError(`Error updating balance for account ${accountId}`);
            return null;
        }
    } catch (error) {
        logError(`Error updating balance for account ${accountId}: ${error.message}`);
        return null;
    }
};

export const createBalance = async (accountId: string, balance: number, createdDate: Date) => {
    try {
        const newBalance = new Balance({ accountId, balance, createdDate,updateDate:createdDate });
        const savedBalance = await newBalance.save();
        if (savedBalance) {
            logInfo(`Balance for account ${accountId} created`);
            return savedBalance;
        } else {
            logError(`Error creating balance for account ${accountId}`);
            return null;
        }
    } catch (error) {
        logError(`Error creating balance for account ${accountId}: ${error.message}`);
        return null;
    }
};