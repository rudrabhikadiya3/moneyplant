
import dbConnect from "@/helper/dbConnect";
import Users from '../../../models/Users';

export default async function (req, res) {
    let resData = [false, [], '']
    if (req.method === "GET") {
        try {
            await dbConnect()
            const total_user = await Users.find({}).count()
            resData[0] = true
            resData[1] = total_user
        } catch (e) {
            console.log('registation err', e.message);
        }
    } else {
        resData[2] = req.method + ' method is not allowed'
    }
    return res.json({ status: resData[0], data: resData[1], msg: resData[2] })
}