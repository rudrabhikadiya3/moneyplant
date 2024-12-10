import Head from 'next/head'
import { useRouter } from 'next/router'
import Footer from './Footer'
import Header from './Header'

export default function Layout({ children }) {
  const router = useRouter()
  const { pathname } = router
  const blackRoutes = ['/login', '/register', '/_error']
  return (
    <>
      <Head>
        <title>{children.props.title + ' | Money Plant'}</title>
      </Head>
      {!blackRoutes.includes(pathname) ? (
        <>
          {' '}
          <Header user={children.props.user} />
          {children}
        </>
      ) : (
        <>{children}</>
      )}
    </>
  )
}
