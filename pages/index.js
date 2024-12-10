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
        <section id='clients' className='clients section-bg'>
          <div className='container'>
            <div className='row' data-aos='zoom-in'>
              <div className='col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center'>
                <img src='/assets/img/clients/client-2.png' className='img-fluid' alt='image' />
              </div>
              <div className='col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center'>
                <img src='/assets/img/clients/client-3.png' className='img-fluid' alt='image' />
              </div>
              <div className='col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center'>
                <img src='/assets/img/clients/client-6.png' className='img-fluid' alt='image' />
              </div>
              <div className='col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center'>
                <img src='/assets/img/clients/client-5.png' className='img-fluid' alt='image' />
              </div>
              <div className='col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center'>
                <img src='/assets/img/clients/client-4.png' className='img-fluid' alt='image' />
              </div>
              <div className='col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center'>
                <img src='/assets/img/clients/client-1.png' className='img-fluid' alt='image' />
              </div>
            </div>
          </div>
        </section>

        <section id='pricing' className='pricing'>
          <div className='container' data-aos='fade-up'>
            <div className='section-title'>
              <h2>Packages</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos
                quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
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
        <section id='about' className='about'>
          <div className='container' data-aos='fade-up'>
            <div className='section-title'>
              <h2>About Us</h2>
            </div>
            <div className='row content'>
              <div className='col-lg-6'>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <ul>
                  <li>
                    <i className='ri-check-double-line' /> Ullamco laboris nisi ut aliquip ex ea commodo consequat
                  </li>
                  <li>
                    <i className='ri-check-double-line' /> Duis aute irure dolor in reprehenderit in voluptate velit
                  </li>
                  <li>
                    <i className='ri-check-double-line' /> Ullamco laboris nisi ut aliquip ex ea commodo consequat
                  </li>
                </ul>
              </div>
              <div className='col-lg-6 pt-4 pt-lg-0'>
                <p>
                  Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                  est laborum.
                </p>
                <a href='#' className='btn-learn-more'>
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>
        <section id='why-us' className='why-us section-bg'>
          <div className='container-fluid' data-aos='fade-up'>
            <div className='row'>
              <div className='col-lg-7 d-flex flex-column justify-content-center align-items-stretch order-2 order-lg-1'>
                <div className='content'>
                  <h3>
                    Eum ipsam laborum deleniti <strong>velit pariatur architecto aut nihil</strong>
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis
                    aute irure dolor in reprehenderit
                  </p>
                </div>
                <div className='accordion-list'>
                  <ul>
                    <li>
                      <a data-bs-toggle='collapse' className='collapse' data-bs-target='#accordion-list-1'>
                        <span>01</span> Non consectetur a erat nam at lectus urna duis?
                        <i className='bx bx-chevron-down icon-show' />
                        <i className='bx bx-chevron-up icon-close' />
                      </a>
                      <div id='accordion-list-1' className='collapse show' data-bs-parent='.accordion-list'>
                        <p>
                          Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus
                          magna fringilla urna porttitor rhoncus dolor purus non.
                        </p>
                      </div>
                    </li>
                    <li>
                      <a data-bs-toggle='collapse' data-bs-target='#accordion-list-2' className='collapsed'>
                        <span>02</span> Feugiat scelerisque varius morbi enim nunc?
                        <i className='bx bx-chevron-down icon-show' />
                        <i className='bx bx-chevron-up icon-close' />
                      </a>
                      <div id='accordion-list-2' className='collapse' data-bs-parent='.accordion-list'>
                        <p>
                          Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices.
                          Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris
                          ultrices eros in cursus turpis massa tincidunt dui.
                        </p>
                      </div>
                    </li>
                    <li>
                      <a data-bs-toggle='collapse' data-bs-target='#accordion-list-3' className='collapsed'>
                        <span>03</span> Dolor sit amet consectetur adipiscing elit?
                        <i className='bx bx-chevron-down icon-show' />
                        <i className='bx bx-chevron-up icon-close' />
                      </a>
                      <div id='accordion-list-3' className='collapse' data-bs-parent='.accordion-list'>
                        <p>
                          Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Faucibus pulvinar elementum integer enim. Sem
                          nulla pharetra diam sit amet nisl suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis convallis convallis
                          tellus. Urna molestie at elementum eu facilisis sed odio morbi quis
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className='col-lg-5 align-items-stretch order-1 order-lg-2 img'
                style={{ backgroundImage: 'url("/assets/img/why-us.png")' }}
                data-aos='zoom-in'
                data-aos-delay={150}
              >
                &nbsp;
              </div>
            </div>
          </div>
        </section>
        <section id='services' className='services section-bg'>
          <div className='container' data-aos='fade-up'>
            <div className='section-title'>
              <h2>Services</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos
                quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>
            <div className='row'>
              <div className='col-xl-3 col-md-6 d-flex align-items-stretch' data-aos='zoom-in' data-aos-delay={100}>
                <div className='icon-box'>
                  <div className='icon'>
                    <i className='bx bxl-dribbble' />
                  </div>
                  <h4>
                    <a href='#'>Lorem Ipsum</a>
                  </h4>
                  <p>Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                </div>
              </div>
              <div className='col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0' data-aos='zoom-in' data-aos-delay={200}>
                <div className='icon-box'>
                  <div className='icon'>
                    <i className='bx bx-file' />
                  </div>
                  <h4>
                    <a href='#'>Sed ut perspici</a>
                  </h4>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                </div>
              </div>
              <div className='col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0' data-aos='zoom-in' data-aos-delay={300}>
                <div className='icon-box'>
                  <div className='icon'>
                    <i className='bx bx-tachometer' />
                  </div>
                  <h4>
                    <a href='#'>Magni Dolores</a>
                  </h4>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia</p>
                </div>
              </div>
              <div className='col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0' data-aos='zoom-in' data-aos-delay={400}>
                <div className='icon-box'>
                  <div className='icon'>
                    <i className='bx bx-layer' />
                  </div>
                  <h4>
                    <a href='#'>Nemo Enim</a>
                  </h4>
                  <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id='team' className='team section-bg'>
          <div className='container' data-aos='fade-up'>
            <div className='section-title'>
              <h2>Team</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos
                quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>
            <div className='row'>
              <div className='col-lg-6' data-aos='zoom-in' data-aos-delay={100}>
                <div className='member d-flex align-items-start'>
                  <div className='pic'>
                    <img src='/assets/img/team/team-1.jpg' className='img-fluid' alt='image' />
                  </div>
                  <div className='member-info'>
                    <h4>Walter White</h4>
                    <span>Chief Executive Officer</span>
                    <p>Explicabo voluptatem mollitia et repellat qui dolorum quasi</p>
                    <div className='social'>
                      <a href='#'>
                        <i className='ri-twitter-fill' />
                      </a>
                      <a href='#'>
                        <i className='ri-facebook-fill' />
                      </a>
                      <a href='#'>
                        <i className='ri-instagram-fill' />
                      </a>
                      <a href='#'>
                        {' '}
                        <i className='ri-linkedin-box-fill' />{' '}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-6 mt-4 mt-lg-0' data-aos='zoom-in' data-aos-delay={200}>
                <div className='member d-flex align-items-start'>
                  <div className='pic'>
                    <img src='/assets/img/team/team-2.jpg' className='img-fluid' alt='image' />
                  </div>
                  <div className='member-info'>
                    <h4>Sarah Jhonson</h4>
                    <span>Product Manager</span>
                    <p>Aut maiores voluptates amet et quis praesentium qui senda para</p>
                    <div className='social'>
                      <a href='#'>
                        <i className='ri-twitter-fill' />
                      </a>
                      <a href='#'>
                        <i className='ri-facebook-fill' />
                      </a>
                      <a href='#'>
                        <i className='ri-instagram-fill' />
                      </a>
                      <a href='#'>
                        {' '}
                        <i className='ri-linkedin-box-fill' />{' '}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-6 mt-4' data-aos='zoom-in' data-aos-delay={300}>
                <div className='member d-flex align-items-start'>
                  <div className='pic'>
                    <img src='/assets/img/team/team-3.jpg' className='img-fluid' alt='image' />
                  </div>
                  <div className='member-info'>
                    <h4>William Anderson</h4>
                    <span>CTO</span>
                    <p>Quisquam facilis cum velit laborum corrupti fuga rerum quia</p>
                    <div className='social'>
                      <a href='#'>
                        <i className='ri-twitter-fill' />
                      </a>
                      <a href='#'>
                        <i className='ri-facebook-fill' />
                      </a>
                      <a href='#'>
                        <i className='ri-instagram-fill' />
                      </a>
                      <a href='#'>
                        {' '}
                        <i className='ri-linkedin-box-fill' />{' '}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-6 mt-4' data-aos='zoom-in' data-aos-delay={400}>
                <div className='member d-flex align-items-start'>
                  <div className='pic'>
                    <img src='/assets/img/team/team-4.jpg' className='img-fluid' alt='image' />
                  </div>
                  <div className='member-info'>
                    <h4>Amanda Jepson</h4>
                    <span>Accountant</span>
                    <p>Dolorum tempora officiis odit laborum officiis et et accusamus</p>
                    <div className='social'>
                      <a href='#'>
                        <i className='ri-twitter-fill' />
                      </a>
                      <a href='#'>
                        <i className='ri-facebook-fill' />
                      </a>
                      <a href='#'>
                        <i className='ri-instagram-fill' />
                      </a>
                      <a href='#'>
                        {' '}
                        <i className='ri-linkedin-box-fill' />{' '}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='contact' className='contact'>
          <div className='container' data-aos='fade-up'>
            <div className='section-title'>
              <h2>Contact</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos
                quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>
            <div className='row'>
              <div className='col-lg-5 d-flex align-items-stretch'>
                <div className='info'>
                  <div className='address'>
                    <i className="bi bi-geo-alt='image'" />
                    <h4>Location:</h4>
                    <p>A108 Adam Street, New York, NY 535022</p>
                  </div>
                  <div className='email'>
                    <i className='bi bi-envelope' />
                    <h4>Email:</h4>
                    <p>info@example.com</p>
                  </div>
                  <div className='phone'>
                    <i className='bi bi-phone' />
                    <h4>Call:</h4>
                    <p>+1 5589 55488 55s</p>
                  </div>
                  <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.54586578794!2d72.73989525503343!3d21.15918020387031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1702440749846!5m2!1sen!2sin'
                    frameBorder={0}
                    style={{ border: 0, width: '100%', height: 290 }}
                    allowFullScreen
                  />
                </div>
              </div>
              <div className='col-lg-7 mt-5 mt-lg-0 d-flex align-items-stretch'>
                <form>
                  <div className='row'>
                    <div className='form-group col-md-6'>
                      <label htmlFor='name'>Your Name</label>
                      <input type='text' name='name' className='form-control' id='name' required />
                    </div>
                    <div className='form-group col-md-6'>
                      <label htmlFor='name'>Your Email</label>
                      <input type='email' className='form-control' name='email' id='email' required />
                    </div>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='name'>Subject</label>
                    <input type='text' className='form-control' name='subject' id='subject' required />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='name'>Message</label>
                    <textarea className='form-control' name='message' rows={10} required defaultValue={''} />
                  </div>
                  <div className='my-3'>
                    {/* <div className="loading">Loading</div>
                    <div className="error-message" />
                    <div className="sent-message">Your message has been sent. Thank you!</div> */}
                  </div>
                  <div className='text-center'>
                    <button type='submit'>Send Message</button>
                  </div>
                </form>
              </div>
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
