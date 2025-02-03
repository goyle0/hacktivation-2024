/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3003/api/:path*',
            },
        ];
    },
}

module.exports = nextConfig
