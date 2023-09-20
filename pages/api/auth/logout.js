import { withSessionRoute } from "@/helper/session"

export default withSessionRoute(async function logout(req, res) {
  let resData = [false, [], '']
  try {
    req.session.destroy('userSession')
    resData[0] = true
    resData[2] = 'Successfully Logout'
  } catch (e) {
    console.log('logout err', e.message);
  }
  return res.json({ status: resData[0], data: resData[1], msg: resData[2] })
})