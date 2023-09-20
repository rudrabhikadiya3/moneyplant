import { chk_email, chk_password, dec, enc } from "@/helper/common";
import dbConnect from "@/helper/dbConnect"
import { withSessionRoute } from "@/helper/session";
import Users from '../../../models/Users';


export default withSessionRoute(async (req, res) => {
    let resData = [false, [], '']
    const { method, body } = req
    if (method === "POST") {
        try {
            const cred = JSON.parse(body)
            if (chk_email(cred.email)) {
                if (chk_password(cred.paswd)) {
                    await dbConnect()
                    const user = await Users.findOne({ email: cred.email }, '_id paswd').lean()
                    if (user) {
                        if (cred.paswd === dec(user.paswd, process.env.PASWD_KEY)) {
                            // user login
                            req.session.userSession = enc(user._id.toString(), process.env.USER_SESSION_KEY)
                            await req.session.save()
                            resData[0] = true
                            resData[1] = []
                            resData[2] = 'Login successfully'
                        } else {
                            resData[2] = 'Incorrect Password'
                        }
                    } else {
                        resData[2] = 'Email is not registred. Please register before login'
                    }
                } else {
                    resData[2] = 'Incorrect Password'
                }
            } else {
                resData[2] = 'Invalid email'
            }
        } catch (e) {
            console.log('login err', e.message);
        }
    } else {
        resData[2] = method + ' method is not allowed'
    }
    return res.json({ status: resData[0], data: resData[1], msg: resData[2] })
})
