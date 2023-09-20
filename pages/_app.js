import Layout from "@/components/Layout"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { SSRProvider } from "react-bootstrap";
const initialOptions = {
  "client-id": "AZNEKRgn1RRhf-2l0T8ruZViSrARv5nsaVFl4WOQPPflSuf5lHJDAkhfLUdNPQxc15k4Po21Cj_vbAFf",
  // currency: "USD",
  // intent: "capture",
  "data-client-token": "access_token$production$d7w5tmd6w2gytc6n$a2e64d5f14ab6292f60fd372d01e14ef",
}
function MyApp({ Component, pageProps }) {

  return (
    <SSRProvider>
      <PayPalScriptProvider options={{ "client-id": "AaZ6Eoy7S6nKGCVZCdnT4TnpumXg0H_LkL0SWp3Ad3hk3wNseUoleU6_0dAuyRJ792irCeJtNYKfzPgO" }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PayPalScriptProvider >
    </SSRProvider>
  )
}
export default MyApp;