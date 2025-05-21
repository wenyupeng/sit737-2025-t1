import Transaction from '../models/Transaction';
import Balance from '../models/Balance';
import {logInfo,logError} from '../config/logger';

interface TransactionParams{
    transactionType: string,
    transactionAmount: number,
    transactionDate: Date,
    fromAccountId: string,
    toAccountId: string,
}

export const createTransaction = async (transaction: TransactionParams) => {
    const { transactionType, transactionAmount, transactionDate, fromAccountId, toAccountId } = transaction;
    const fromAccount = await Balance.findOne({ accountId: fromAccountId });
    const toAccount = await Balance.findOne({ accountId: toAccountId });

    if ( !fromAccount || (!toAccount && transactionType === 'transfer') ) {
        logInfo(`Account not found for transaction: ${transaction}`);
        return null;
    }

    const newTransaction = new Transaction({
        transactionId: crypto.randomUUID(),
        transactionType,
        transactionAmount,
        transactionDate,
        fromAccountId,
        toAccountId,
        status: 'pending',
    });        

    try{
        await newTransaction.save();
        if (transactionType === 'deposit') {
            await Balance.updateOne({ accountId: fromAccountId }, { $inc: { balance: +transactionAmount } });
        }else if (transactionType === 'withdraw') {
            await Balance.updateOne({ accountId: fromAccountId }, { $inc: { balance: -transactionAmount } });
        }else if (transactionType === 'transfer') {
            await Balance.updateOne({ accountId: fromAccountId }, { $inc: { balance: -transactionAmount } });
            await Balance.updateOne({ accountId: toAccountId }, { $inc: { balance: transactionAmount } });
        }
        logInfo(`Transaction created: ${newTransaction}`);
        await Transaction.updateOne({ _id: newTransaction._id }, { $set: { status: 'completed' } });
        logInfo(`Transaction status updated: ${newTransaction}`);
        return newTransaction;
    } catch(error) {
        logError(`Error creating transaction: ${error}`);
        return null;
    }
}

export const getTransactionsByAccountId = async (accountId: string) => {
    const transactions = await Transaction.find({ $or: [{ fromAccountId: accountId }, { toAccountId: accountId }] }).sort({ transactionDate: -1 });
    return transactions;
}

export const getTransactionById = async (transactionId: string) => {
    const transaction = await Transaction.findOne({ transactionId });
    return transaction;
}