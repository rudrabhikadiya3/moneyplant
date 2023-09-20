import mongoose from "mongoose";
module.exports = mongoose.models.Users || mongoose.model("Users", new mongoose.Schema(
  {
    _id: { type: String, default: new mongoose.Types.ObjectId() },
    userId: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true, },
    paswd: { type: String, required: true },
    referralCode: { type: String, required: true, },
    sponsor: { type: String, ref: 'User' },
    childOf: { type: String, ref: 'User' },
    balance: { type: mongoose.Types.Decimal128, default: 1000 },
    createdAt: { type: Number, required: true }
  },
  { versionKey: false }
)
);
