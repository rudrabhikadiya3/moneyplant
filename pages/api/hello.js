import { withSessionRoute } from '../../helper/session';

export default withSessionRoute(async (req, res) => {
  const user = req.session.userSession;
  if (user) {
    return res
      .status(200)
      .json({ success: true, message: "User is logged in." });

  } else {
    return res
      .status(200)
      .json({ success: false, message: "Please login to access." });
  }
});

