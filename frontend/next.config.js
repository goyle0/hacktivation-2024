/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOOGLE_MAPS_API_KEY: 'AIzaSyCNDW8Tmx_FIpsLXhYQhpWp9Tgo5qf3Ivg',
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
