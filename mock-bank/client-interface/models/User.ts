import {Schema,models,model} from "mongoose";

const UserSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    accountId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

export const User = models.User || model("User", UserSchema);
