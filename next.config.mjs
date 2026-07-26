/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Otimização nativa habilitada (PRD seção 4) para acelerar o carregamento
    // das fotos do portfólio via next/image (AVIF/WebP + redimensionamento).
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
