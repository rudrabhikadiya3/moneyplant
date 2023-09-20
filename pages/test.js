import axios from 'axios';
import React, { useEffect } from "react";

const test = () => {
  // const query = new URLSearchParams({
  //   as_of_time: 'stringstringstringst',
  //   currency_code: 'str'
  // }).toString();

  // const callAPI = async () => {
  //   const resp = await fetch(
  //     `https://api-m.paypal.com/v1/reporting/balances?${query}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Authorization: 'Bearer <YOUR_TOKEN_HERE>'
  //       }
  //     }
  //   );

  //   const data = await resp.text();
  //   console.log(data);
  // }
  const CLIENT_ID = 'AaZ6Eoy7S6nKGCVZCdnT4TnpumXg0H_LkL0SWp3Ad3hk3wNseUoleU6_0dAuyRJ792irCeJtNYKfzPgO'
  const APP_SECRET = 'EM9seMZZw5nyGQqItPxUEAvWoYcw0m9PHXeXncq1ILzBajqjbJj9wmS6MzxAVTRn_4Q-yagl_hjlLPSs'

  const base = "https://api-m.sandbox.paypal.com";
  const fetchAccessToken = async () => {
    const res = await fetch(base + "/v1/oauth2/token", {
      method: 'POST',
      body: "grant_type=client_credentials",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: "Basic " + Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
      }
    })
    const resData = await res.json()
    console.log('resData', resData)
  }

  useEffect(() => {
    // callAPI()
    fetchAccessToken()
    // generateAccessToken()
  }, [])

  return <div>test</div>;
};

export default test;