import { Router, Request, Response,RequestHandler } from "express";
import { getBalance, createBalance, updateBalance } from "../service/balanceService";
import { logInfo, logError } from "../config/logger";
import { log } from "console";

const balanceRoute = Router();

balanceRoute.get("/", (async (req: Request, res: Response) => {
    const accountId = req.query.accountId as string;
    logInfo("Fetching balance", { accountId });
    if (!accountId) {
        return res.status(400).json({ error: "Account ID is required" });
    }

    try {
        const balanceObj = await getBalance(accountId);
        logInfo("Balance fetched", { balanceObj });
        res.status(200).json({ balanceObj });
    } catch (error: any) {
        logError(error.message);
        res.status(500).json({ error: error.message });
    }
}) as RequestHandler);

balanceRoute.post("/", (async (req, res) => {
    const { accountId, balance } = req.body;
    const createdDate = new Date();
    logInfo("Creating balance", { accountId, balance, createdDate });

    try {
        const balanceObj = await createBalance(accountId, balance, createdDate);
        if (!balanceObj) {
            logError("Failed to create balance");
            return res.status(500).json({ error: "Failed to create balance" });
        }
        res.status(201).json({ balanceObj });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}) as RequestHandler);

balanceRoute.put("/", (async (req, res) => {
    const { accountId, balance } = req.body;
    const updateDate = new Date();

    try {
        const balanceObj = await updateBalance(accountId, balance, updateDate);
        res.status(200).json({ balanceObj });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}) as RequestHandler);

export {balanceRoute};
