
import dbConnect from "@/helper/dbConnect"
import { withSessionRoute } from "@/helper/session";
import Packages from '../../../models/Packages';
// import { NOW } from "@/helper/common";
// import mongoose from "mongoose";

export default withSessionRoute(async (req, res) => {
    let resData = [false, [], '']
    const { method, body } = req
    if (method === 'GET') {
        try {
            await dbConnect()
            // await Packages.create({
            //     _id: new mongoose.Types.ObjectId(),
            //     productId: 4,
            //     name: 'Package 04',
            //     price: 100,
            //     createdAt: NOW
            // })

            const packagesData = await Packages.find({ status: 1 }, 'name price productId').lean()
            const packages = []
            packagesData.map((p) => packages.push({ ...p, price: parseFloat(p.price) }))

            resData[0] = true
            resData[1] = packages
            resData[2] = ''
        } catch (e) {
            console.log(e.message);
        }
    } else {
        resData[2] = method + ' method is not allowed'
    }
    return res.json({ status: resData[0], data: resData[1], msg: resData[2] })
})