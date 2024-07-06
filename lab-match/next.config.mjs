/** @type {import('next').NextConfig} */
export default {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:5000/api/:path*' // Proxy to backend
      }
    ];
  }
};
