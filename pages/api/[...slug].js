import { withSessionRoute } from '@/helper/session';

const usrHelp = require('../../helper/apiHelper')
// user's private APIs
export default withSessionRoute(async (req, res) => {
  const user = req.session.userSession;
  if (user) {
    try {
      const y = req.query.slug[0]
      const resData = await usrHelp[y](req, res)
      return res.json({ status: resData[0], data: resData[1], msg: resData[2] })
    } catch (err) {
      console.log(err.message)
    }
  } else {
    return res.json({ status: false, data: [], msg: 'Session expired' })
  }
})
