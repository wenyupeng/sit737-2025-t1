import { Router, Request, Response } from "express";
import { getBalance, createBalance, updateBalance } from "../service/balanceService";
import { logInfo, logError } from "../config/logger";

const balanceRoute = Router();

balanceRoute.get("/", async (req: Request, res: Response) => {
    const accountId = req.query.accountId as string;
    if (!accountId) {
        return res.status(400).json({ error: "Account ID is required" });
    }

    try {
        const balance = await getBalance(accountId);
        res.status(200).json({ balance });
    } catch (error: any) {
        logError(error.message);
        res.status(500).json({ error: error.message });
    }
});

balanceRoute.post("/", async (req: Request, res: Response) => {
    const { accountId, amount } = req.body;
    const date = new Date();

    try {
        const balance = await createBalance(accountId, amount, date);
        res.status(201).json({ balance });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

balanceRoute.put("/", async (req: Request, res: Response) => {
    const { accountId, amount } = req.body;
    const updateDate = new Date();

    try {
        const balance = await updateBalance(accountId, amount, updateDate);
        res.status(200).json({ balance });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export {balanceRoute};
