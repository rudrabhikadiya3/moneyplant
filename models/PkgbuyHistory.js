import mongoose from "mongoose";
module.exports = mongoose.models.pkgBuyHistory || mongoose.model("pkgBuyHistory", new mongoose.Schema(
    {
        _id: { type: String, },
        buyer: { type: String, required: true },
        pkg: { type: String, required: true },
        amount: { type: mongoose.Types.Decimal128, required: true },
        createdAt: { type: Number, required: true }
    },
    { versionKey: false }
)
);
