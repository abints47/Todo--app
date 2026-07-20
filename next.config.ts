/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  
  images: {
    unoptimized: true, // Required because GitHub Pages is static hosting
  },
  // GitHub Pages serves sites at: https://username.github.io/repo-name/
  // basePath sets this subpath so links and assets don't break
  basePath: isProd ? '/Todo--app' : '', 
};

export default nextConfig;