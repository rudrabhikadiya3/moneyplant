import mongoose from "mongoose";
module.exports = mongoose.models.TxnHistory || mongoose.model("TxnHistory", new mongoose.Schema(
    {
        _id: { type: String },
        amount: { type: mongoose.Types.Decimal128, required: true },
        userId: { type: String, required: true },
        type: { type: Number, required: true }, //0:User-pay 1:User-get 
        status: { type: Number, required: true, }, //0:initial-deposit($1000) 1:buy-package, 2:1st-level-reward(5%) 3:2nd-level-reward(2%) 4:Wallet reload
        createdAt: { type: Number, required: true }
    },
    { versionKey: false })
);
