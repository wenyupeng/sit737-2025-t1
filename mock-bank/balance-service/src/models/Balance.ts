import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Balance = mongoose.model("Balance", balanceSchema);

export default Balance;