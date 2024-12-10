import { withSessionSsr } from '@/helper/session'
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Home({ user, pkgData }) {
  const router = useRouter()

  const buyPackage = async ({ pckgid }) => {
    if (user) {
      const alert = await Swal.fire({
        title: 'Are you sure?',
        // text: sponsors.sponsor ? sponsors.sponsor == sponsors.childOf ? `By purchasing ${name}, ${sponsors.sponsor} will get $${(amount * 0.07).toFixed(1)} ` : `By purchasing ${name}, ${sponsors.sponsor} will get $${amount * 0.05} and ${sponsors.childOf} get $${amount * 0.02}` : `You are a root of tree, still want to purchase ${name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#59c0ef',
        cancelButtonColor: '#838383',
        confirmButtonText: 'Buy',
      })
      if (alert.isConfirmed) {
        const res = await fetch(process.env.APIURL + 'buypackage', {
          method: 'POST',
          body: JSON.stringify({
            package: pckgid,
            buyer: user,
          }),
          headers: {
            Accept: 'application/json',
          },
        })
        const resData = await res.json()
        if (resData.status) {
          toast.success(resData.msg)
          return
        }
        toast.error(resData.msg)
      }
    } else {
      toast.info('Please log in to buy packages')
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    }
  }

  const getFeatures = (index) => {
    switch (index) {
      case 0:
        return (
          <>
            <li>
              <i className='bx bx-check' />
              Quam adipiscing vitae proin
            </li>
            <li>
              <i className='bx bx-check' />
              Nec feugiat nisl pretium
            </li>
            <li className='na'>
              <i className='bx bx-x' />
              <span>Nulla at volutpat diam uteera</span>
            </li>
            <li className='na'>
              <i className='bx bx-x' />
              <span>Pharetra massa massa ultricies</span>
            </li>
            <li className='na'>
              <i className='bx bx-x' />
              <span>Massa ultricies mi quis hendrerit</span>
            </li>
          </>
        )
      case 1:
        return (
          <>
            <li>
              <i className='bx bx-check' />
              Quam adipiscing vitae proin
            </li>
            <li>
              <i className='bx bx-check' />
              Nec feugiat nisl pretium
            </li>
            <li>
              <i className='bx bx-check' />
              Nulla at volutpat diam uteera
            </li>
            <li className='na'>
              <i className='bx bx-x' />
              <span>Pharetra massa massa ultricies</span>
            </li>
            <li className='na'>
              <i className='bx bx-x' />
              <span>Massa ultricies mi quis hendrerit</span>
            </li>
          </>
        )
      case 2:
        return (
          <>
            <li>
              <i className='bx bx-check' />
              Quam adipiscing vitae proin
            </li>
            <li>
              <i className='bx bx-check' />
              Nec feugiat nisl pretium
            </li>
            <li>
              <i className='bx bx-check' />
              Nulla at volutpat diam uteera
            </li>
            <li>
              <i className='bx bx-check' />
              Pharetra massa massa ultricies
            </li>
            <li className='na'>
              <i className='bx bx-x' />
              <span>Massa ultricies mi quis hendrerit</span>
            </li>
          </>
        )
      case 3:
        return (
          <>
            <li>
              <i className='bx bx-check' />
              Quam adipiscing vitae proin
            </li>
            <li>
              <i className='bx bx-check' />
              Nec feugiat nisl pretium
            </li>
            <li>
              <i className='bx bx-check' />
              Nulla at volutpat diam uteera
            </li>
            <li>
              <i className='bx bx-check' />
              Pharetra massa massa ultricies
            </li>
            <li>
              <i className='bx bx-check' />
              Massa ultricies mi quis hendrerit
            </li>
          </>
        )
      default:
        return ''
    }
  }

  return (
    <>
      <section id='hero' className='d-flex align-items-center'>
        <div className='container'>
          <div className='row'>
            <div
              className='col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1'
              data-aos='fade-up'
              data-aos-delay={200}
            >
              <h1>Referrals that pay you back everytime</h1>
              <p>
                Earn rewards by sharing our packages with others and help them discover the benefits of what we offer through our referral program
              </p>
              <div className='d-flex justify-content-center justify-content-lg-start'>
                <a href='#pricing' className='btn-get-started scrollto'>
                  Get Started
                </a>
                <a href='https://www.youtube.com/watch?v=jDDaplaOz7Q' className='glightbox btn-watch-video'>
                  <i className='bi bi-play-circle' />
                  <span>Watch Video</span>
                </a>
              </div>
            </div>
            <div className='col-lg-6 order-1 order-lg-2 hero-img' data-aos='zoom-in' data-aos-delay={200}>
              <img src='/assets/img/hero-img.png' className='img-fluid animated' alt='image' />
            </div>
          </div>
        </div>
      </section>
      <main id='main'>
        <section id='pricing' className='pricing'>
          <div className='container' data-aos='fade-up'>
            <div className='section-title'>
              <h2>Packages</h2>
            </div>
            <div className='row'>
              {pkgData.map((d, i) => {
                return (
                  <div className='col-lg-3 mt-4 mt-lg-0' data-aos='fade-up' data-aos-delay={100} key={i}>
                    <div className='box'>
                      <h3>{d.name}</h3>
                      <h4>
                        <sup>$</sup>
                        {d.price}
                      </h4>
                      <ul>{getFeatures(i)}</ul>
                      <button className='btn btn-login fw-bold' onClick={() => buyPackage({ pckgid: d._id, name: d.name, amount: d.price })}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <ToastContainer />
      </main>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  // const session = req.session.userSession + '!'
  const res = await fetch(process.env.APIURL + 'packages/get_packages', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
  const pkgData = await res.json()
  return {
    props: { user: req.session.userSession || false, pkgData: pkgData.data, title: 'Home' },
  }
})
