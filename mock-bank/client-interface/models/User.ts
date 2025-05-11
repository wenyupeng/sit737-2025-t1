import mongoose,{Schema,models,model} from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

export const User = models.User || model("User", UserSchema);
