import mongoose from "mongoose";
import { TransactionType } from "./TransactionType";

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    transactionType: {
        type: String,
        enum: Object.values(TransactionType),
        required: true,
    },
    transactionAmount: {
        type: Number,
        required: true,
    },
    transactionDate: {
        type: Date,
        required: true,
    },
    fromAccountId: {
        type: String,
        required: true,
    },
    toAccountId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
});
const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;