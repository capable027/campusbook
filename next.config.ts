import type { NextConfig } from "next";

/** Allow `next/image` for remote book photos (S3/R2/CDN/Blob). Local `/uploads` needs no entry. */
function storageRemotePatterns(): { protocol: "https"; hostname: string; pathname: string }[] {
  const patterns: { protocol: "https"; hostname: string; pathname: string }[] = [];
  const bases = [process.env.ASSET_PUBLIC_BASE_URL, process.env.STORAGE_PUBLIC_BASE_URL].filter(
    Boolean,
  ) as string[];
  for (const b of bases) {
    try {
      const u = new URL(b);
      if (u.protocol === "https:" && u.hostname) {
        patterns.push({ protocol: "https", hostname: u.hostname, pathname: "/**" });
      }
    } catch {
      /* ignore invalid URL */
    }
  }
  const extra = process.env.STORAGE_IMAGE_HOST;
  if (extra) {
    patterns.push({ protocol: "https", hostname: extra, pathname: "/**" });
  }
  return patterns;
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      ...storageRemotePatterns(),
      /* Homepage demo / mock covers */
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
