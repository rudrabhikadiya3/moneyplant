import React from "react";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 footer-contact">
                            <h3>{process.env.SITE_NAME}</h3>
                            <p>
                                A108 Adam Street <br />
                                New York, NY 535022<br />
                                United States <br /><br />
                                <strong>Phone:</strong> +1 5589 55488 55<br />
                                <strong>Email:</strong> info@example.com<br />
                            </p>
                        </div>
                        <div className="col-lg-3 col-md-6 footer-links">
                            <h4>Useful Links</h4>
                            <ul>
                                <li><i className="bx bx-chevron-right" /> <a href="#">Home</a></li>
                                <li><i className="bx bx-chevron-right" /> <a href="#">About us</a></li>
                                <li><i className="bx bx-chevron-right" /> <a href="#">Services</a></li>
                                <li><i className="bx bx-chevron-right" /> <a href="#">Terms of service</a></li>
                                <li><i className="bx bx-chevron-right" /> <a href="#">Privacy policy</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 footer-links">
                            <h4>Our Services</h4>
                            <ul>
                                <li><i className="bx bx-chevron-right" /> <a href="#">Web Design</a></li>
                                <li><i className="bx bx-chevron-right" /> <a href="#">Web Development</a></li>
                                <li><i className="bx bx-chevron-right" /> <a href="#">Product Management</a></li>
                                <li><i className="bx bx-chevron-right" /> <a href="#">Marketing</a></li>
                                <li><i className="bx bx-chevron-right" /> <a href="#">Graphic Design</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 footer-links">
                            <h4>Our Social Networks</h4>
                            <p>Cras fermentum odio eu feugiat lide par naso tierra videa magna derita valies</p>
                            <div className="social-links mt-3">
                                <a href="#" className="twitter"><i className="bx bxl-twitter" /></a>
                                <a href="#" className="facebook"><i className="bx bxl-facebook" /></a>
                                <a href="#" className="instagram"><i className="bx bxl-instagram" /></a>
                                <a href="#" className="google-plus"><i className="bx bxl-skype" /></a>
                                <a href="#" className="linkedin"><i className="bx bxl-linkedin" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container footer-bottom clearfix">
                <div className="copyright">
                    © Copyright <strong><span>{process.env.SITE_NAME}</span></strong>. All Rights Reserved
                </div>
                <div className="credits">
                    Designed by Rudra with BootStrap
                </div>
            </div>
        </footer>

    );
};

export default Footer;
