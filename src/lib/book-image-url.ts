/** True when the URL is served from this app’s `public/uploads` (local driver). Safe for client components. */
export function isLocallyServedBookImage(src: string): boolean {
  return src.startsWith("/uploads/");
}
