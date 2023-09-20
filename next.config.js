/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    SITE_NAME: process.env.SITE_NAME,
    APIURL: process.env.APIURL,
    PASWD_KEY: process.env.PASWD_KEY,
    DATA_PER_VIEW: process.env.DATA_PER_VIEW,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  }
}
module.exports = nextConfig
