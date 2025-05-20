import { Router, Request, Response, RequestHandler } from "express";
import { createTransaction, getTransactionById, getTransactionsByAccountId } from "../service/transactionService";
import { logInfo, logError } from "../config/logger";

const transactionRoute = Router();

// GET /transaction/:transactionId
transactionRoute.get('/:transactionId', (async (req, res) => {
    const transactionId = req.params.transactionId;
    logInfo(`GET /transaction/${transactionId}`);

    if (!transactionId) {
        return res.status(400).json({ message: "Transaction ID is required" });
    }

    try {
        const transaction = await getTransactionById(transactionId);
        res.status(200).json(transaction);
    } catch (error: any) {
        logError(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}) as RequestHandler);

// GET /transaction?accountId=123
transactionRoute.get('/', (async (req, res) => {
    const accountId = req.query.accountId as string;
    logInfo(`GET /transaction?accountId=${accountId}`);

    if (!accountId) {
        return res.status(400).json({ message: "Account ID is required" });
    }

    try {
        const transactions = await getTransactionsByAccountId(accountId);
        res.status(200).json(transactions);
    } catch (error: any) {
        logError(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}) as RequestHandler);

// POST /transaction
transactionRoute.post('/', (async (req, res) => {
    const transaction = req.body;
    logInfo('POST /transaction');

    if (!transaction) {
        return res.status(400).json({ message: "Transaction data is required" });
    }

    try {
        const newTransaction = await createTransaction(transaction);
        res.status(201).json(newTransaction);
    } catch (error: any) {
        logError(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}) as RequestHandler);

export { transactionRoute };
