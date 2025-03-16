import { chk_email, chk_password, chk_username } from "@/helper/common";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const register = ({ total_users }) => {
  const router = useRouter()

  const [loader, setLoader] = useState(false);
  const [userDeatils, setUserDeatils] = useState({ name: '', email: '', paswd: '', cpaswd: '', referral: 'H9l2L11' });

  const validateUserData = () => {
    const { name, email, referral, paswd, cpaswd } = userDeatils

    if (!name) {
      toast.error('Please enter username')
      return false
    }
    if (!chk_username(name)) {
      toast.error('Username must be in 5-15 characters')
      return false
    }
    if (!email) {
      toast.error('Please enter email')
      return false
    }
    if (!chk_email(email)) {
      toast.error('Please enter valid email')
      return false
    }
    if (!chk_password(paswd)) {
      toast.error('Password is not strong enough')
      return false
    }
    if (!paswd) {
      toast.error('Please enter password')
      return false
    }
    if (!cpaswd) {
      toast.error('Please enter confirm password')
      return false
    }
    if (cpaswd !== paswd) {
      toast.error('Password and Confirm Password are not matched')
      return false
    }

    if (total_users !== 0) {
      if (!referral) {
        toast.error('Refferal code is neccesary')
        return false
      }
      if (parseFloat(referral.length) < 6 + 1) {
        toast.error('Invalid Referral code')
        return false
      }
    }
    handleRegistration()
  }
  const handleRegistration = async () => {
    // delete userDeatils.cpaswd
    setLoader(true)
    const res = await fetch(process.env.APIURL + 'auth/registration', {
      method: 'POST',
      body: JSON.stringify(userDeatils),
      headers: {
        'Accept': 'application/json',
      },
    })
    const resData = await res.json()
    if (resData.status === true) {
      toast.success(resData.msg)
      // setTimeout(() => {
      //   router.push('/login')
      // }, 1000);
    } else {
      toast.error(resData.msg)
    }
    setLoader(false)
  }

  return (

    <div className="fullpage">
      <h1 className="login-logo">{process.env.SITE_NAME}</h1>
      <div className="background-container">
        {/* <Image height={1180} width={1165} src="/assets/img/moon2.png" alt='moon' className="moon" />
                    <div className="stars" />
                    <div className="twinkling" />
                    <div className="clouds" /> */}
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
              <div className="card-img-left d-none d-md-flex"></div>
              <div className="card-body p-4 p-sm-5 bg-custom">
                <h4 className="card-title text-center mb-4 login-heading">Registration</h4>
                <p className="text-light text-center opacity-75">Our users are earn $30/week; big amount isn't it? Join the community today by entering below details</p>
                <hr className="text-light" />
                <div className='mb-3'>
                  <input placeholder="Username"
                    className="input" type="text" value={userDeatils.name}
                    onChange={(e) => setUserDeatils({ ...userDeatils, name: e.target.value })}
                  />
                </div>
                <div className='mb-3'>
                  <input placeholder="Email" value={userDeatils.email}
                    className="input" type="email"
                    onChange={(e) => setUserDeatils({ ...userDeatils, email: e.target.value })}
                  />
                </div>
                <div className='mb-3'>
                  <input placeholder="Create Password"
                    value={userDeatils.paswd}
                    className="input" type="text"
                    onChange={(e) => setUserDeatils({ ...userDeatils, paswd: e.target.value })}
                  />
                </div>
                <div className='mb-3'>
                  <input placeholder="Confirm Password"
                    value={userDeatils.cpaswd}
                    className="input" type="text"
                    onChange={(e) => setUserDeatils({ ...userDeatils, cpaswd: e.target.value })}
                  />
                </div>
                {
                  total_users !== 0 && <>
                    <hr className="my-4 text-light" />
                    <div className='mb-3'>
                      <input placeholder="Referral code"
                        className="input" type="text"
                        value={userDeatils.referral}
                        onChange={(e) => setUserDeatils({ ...userDeatils, referral: e.target.value })}
                      />
                    </div>
                  </>
                }
                <div className="d-grid mb-3">
                  <button className="btn btn-login fw-bold text-uppercase" onClick={validateUserData} disabled={loader}>
                    {!loader ? 'Singup' : <div className="spinner-border" role="status"></div>}
                  </button>
                </div>
                <Link className="d-block text-center mt-2 text-light" href="/login">Already {process.env.SITE_NAME} user? Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default register;

export async function getServerSideProps() {
  const res = await fetch(process.env.APIURL + 'auth/get_totaluser', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
  const resData = await res.json()

  const total_users = await resData.data
  return {
    props: { total_users, title: 'Register' }
  }
}
