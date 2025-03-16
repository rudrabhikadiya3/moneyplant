import { chk_email, chk_password } from "@/helper/common";
import { withSessionSsr } from "@/helper/session";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const login = () => {
    const [cred, setCred] = useState({ email: 'first@gmail.com', paswd: 'Test@123' });
    const [loader, setLoader] = useState(false);

    const router = useRouter()
    const validateCred = () => {
        const { email, paswd } = cred
        if (!email) {
            toast.error('Please enter email')
            return false
        }
        if (!chk_email(email)) {
            toast.error('Please enter valid email')
            return false
        }
        if (!chk_password(paswd)) {
            toast.error('Incorrect Password')
            return false
        }
        handleLogin()
    }
    const handleLogin = async () => {
        setLoader(true)
        const res = await fetch(process.env.APIURL + 'auth/login', {
            method: "POST",
            body: JSON.stringify(cred),
            headers: {
                'Accept': 'application/json',
            },
        })
        const resData = await res.json()
        if (!resData.status) {
            toast.error(resData.msg)
            setLoader(false)
            return;
        }
        toast.success(resData.msg)
        router.push('/')
        setLoader(false)
    }
    return (
        <div className="fullpage">
            <h1 className="login-logo">{process.env.SITE_NAME}</h1>
            <div className="background-container">
                <div className='ripple-background'>
                    <div className='circle xxlarge shade1'></div>
                    <div className='circle xlarge shade2'></div>
                    <div className='circle large shade3'></div>
                    <div className='circle mediun shade4'></div>
                    <div className='circle small shade5'></div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 col-xl-9 mx-auto">
                        <div className="card flex-row my-5 border-0 shadow rounded-3 overflow-hidden">
                            <div className="card-body p-4 p-sm-5 bg-custom">
                                <h4 className="card-title text-center mb-4 login-heading">Welcome Back</h4>
                                <p className="text-light text-center opacity-75">Our users are earn $30/week; big amount isn't it? Join the community today by entering below details</p>
                                <hr className="text-light" />
                                <div className='mb-3'>
                                    <input placeholder="Email" className="input" type="email" value={cred.email}
                                        onChange={(e) => setCred({ ...cred, email: e.target.value })}
                                        onKeyUp={() => event.keyCode === 13 && validateCred()}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <input placeholder="Password" className="input" type="text" value={cred.paswd}
                                        onChange={(e) => setCred({ ...cred, paswd: e.target.value })}
                                        onKeyUp={() => event.keyCode === 13 && validateCred()}
                                    />
                                </div>
                                <div className="d-grid mb-2">
                                    <button className="btn btn-login fw-bold text-uppercase" onClick={validateCred} disabled={loader}>
                                        {!loader ? 'Login' : <div className="spinner-border" role="status"></div>}
                                    </button>
                                </div>
                                <Link className="d-block text-center mt-2 text-light" href="/register">Area you new in {process.env.SITE_NAME}? Sign Up</Link>
                            </div>
                            <div className="card-img-left d-none d-md-flex"></div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
};

export default login;

export const getServerSideProps = withSessionSsr(async ({ req }) => {
    if (!req.session.userSession) {
        return {
            props: { user_id: req.session, title: 'Login' }
        }
    } else {
        return {
            // props: {},
            redirect: {
                destination: '/'
            }
        }
    }
})
