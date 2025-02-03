/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOOGLE_MAPS_API_KEY: 'AIzaSyCFMqkdOccm1x91KUohKd2FqWGu6sdfM-E',
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
