import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    accountId: { type: String, required: true },
    accountType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Account = mongoose.model("Account", AccountSchema);

export default Account;

