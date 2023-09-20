import Link from "next/link";
import { useRouter } from "next/router";

const Header = ({ user }) => {

  const router = useRouter()

  const handleLogout = async () => {
    await fetch(process.env.APIURL + 'auth/logout', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    router.push('/login')
  }

  return (
    <header id="header" className="fixed-top">
      <div className="container d-flex align-items-center justify-content-between">
        <h1 className="logo "><a href="/">{process.env.SITE_NAME}</a></h1>
        {/* <a href="index.html" class="logo me-auto"><img src="/assets/img/logo.png" alt="" class="img-fluid"></a>*/}
        <nav id="navbar" className="navbar">
          <ul>
            <li><Link className="nav-link scrollto " href="/">Home</Link></li>
            <li><Link className="nav-link scrollto" href="/#about">About</Link></li>
            <li><Link className="nav-link scrollto" href="/#pricing">Packages</Link></li>
            <li><Link className="nav-link scrollto" href="/#services">Services</Link></li>
            <li><Link className="nav-link scrollto" href="/#contact">Contact</Link></li>
            {/* {!user && <li><Link className="getstarted scrollto" href="/#pricing">Get Started</Link></li>} */}
            {/*  */}
          </ul>
          <i className="bi bi-list mobile-nav-toggle" />
        </nav>
        {
          user ? <div className="dropdown text-center">
            <a href="#" className="d-block text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="/assets/img/dummy-profile.jpeg" alt="mdo" width={30} height={30} className="rounded-circle" />
            </a>
            <ul className="dropdown-menu text-small">
              <li><Link className="dropdown-item" href="/dashboard">Dashboard</Link></li>
              {/* <li><Link className="dropdown-item" href="/myaccount">My Account</Link></li> */}
              <li><Link className="dropdown-item" href="/visuals">My Tree</Link></li>
              <li><hr className="dropdown-divider divider-light" /></li>
              <li><button className='dropdown-item btn-transparent btn-hover-gray' onClick={handleLogout}>Sign out</button></li>
            </ul>
          </div> : <Link className="getstarted scrollto" href="/login">Get Started</Link>
        }

      </div>
    </header>
  )
};

export default Header;
