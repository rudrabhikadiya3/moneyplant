import mongoose from "mongoose";
module.exports = mongoose.models.Package || mongoose.model("Package", new mongoose.Schema(
    {
        _id: { type: String, default: new mongoose.Types.ObjectId() },
        productId: { type: String, unique: true, required: true },
        name: { type: String, unique: true, required: true },
        price: { type: mongoose.Types.Decimal128, required: true, },
        status: { type: Number, default: 1 }, //0:discontinue 1:on sale
        createdAt: { type: Number, required: true }
    },
    { versionKey: false }
))