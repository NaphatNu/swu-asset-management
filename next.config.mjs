/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // 1. เส้นทาง Auth: ให้ทำงานในโปรเจกต์ตัวเอง (ไม่ต้องส่งไปไหน)
      // การไม่ใส่ destination หรือใส่ source ทับตัวเองจะทำให้ Next.js ข้ามกฎข้อนี้ไปทำตามปกติ
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*', 
      },
      // 2. เส้นทาง API อื่นๆ: ส่งไปที่ Backend (localhost:3002)
      {
        source: '/api/:path*',
        destination: 'http://localhost:5204/api/:path*',
      },
    ];
  },
};

export default nextConfig;