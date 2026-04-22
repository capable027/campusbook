import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { put as vercelBlobPut } from "@vercel/blob";
import { isLocallyServedBookImage } from "@/lib/book-image-url";

const MAX_BYTES = 5 * 1024 * 1024;

function storageDriver(): "local" | "s3" | "vercel-blob" {
  const d = (process.env.STORAGE_DRIVER ?? "local").toLowerCase().trim();
  if (d === "s3") return "s3";
  if (d === "vercel-blob" || d === "vercel_blob") return "vercel-blob";
  return "local";
}

function safeFileName(original: string): string {
  return original.replace(/[^a-zA-Z0-9.-]/g, "") || "img";
}

export { isLocallyServedBookImage };

async function saveLocal(files: File[]): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const urls: string[] = [];
  for (const f of files) {
    if (!f || f.size === 0) continue;
    if (f.size > MAX_BYTES) continue;
    const buf = Buffer.from(await f.arrayBuffer());
    const name = `${randomUUID()}-${safeFileName(f.name)}`;
    const dest = path.join(dir, name);
    await writeFile(dest, buf);
    urls.push(`/uploads/${name}`);
  }
  return urls;
}

async function saveS3(files: File[]): Promise<string[]> {
  const bucket = process.env.S3_BUCKET;
  const base = process.env.ASSET_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!bucket || !base) {
    throw new Error("S3 存储需要设置 S3_BUCKET 与 ASSET_PUBLIC_BASE_URL");
  }

  const client = new S3Client({
    region: process.env.AWS_REGION ?? "auto",
    ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        }
      : {}),
    ...(process.env.S3_ENDPOINT
      ? {
          endpoint: process.env.S3_ENDPOINT,
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "1" || process.env.S3_FORCE_PATH_STYLE === "true",
        }
      : {}),
  });

  const urls: string[] = [];
  for (const f of files) {
    if (!f || f.size === 0) continue;
    if (f.size > MAX_BYTES) continue;
    const buf = Buffer.from(await f.arrayBuffer());
    const fileName = `${randomUUID()}-${safeFileName(f.name)}`;
    const key = `uploads/${fileName}`;
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buf,
        ContentType: f.type && f.type.length > 0 ? f.type : "application/octet-stream",
      }),
    );
    urls.push(`${base}/${key}`);
  }
  return urls;
}

async function saveVercelBlob(files: File[]): Promise<string[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Vercel Blob 需要设置 BLOB_READ_WRITE_TOKEN");
  }
  const urls: string[] = [];
  for (const f of files) {
    if (!f || f.size === 0) continue;
    if (f.size > MAX_BYTES) continue;
    const buf = Buffer.from(await f.arrayBuffer());
    const fileName = `${randomUUID()}-${safeFileName(f.name)}`;
    const pathname = `campusbook/uploads/${fileName}`;
    const blob = await vercelBlobPut(pathname, buf, {
      access: "public",
      token,
      contentType: f.type && f.type.length > 0 ? f.type : "application/octet-stream",
    });
    urls.push(blob.url);
  }
  return urls;
}

/**
 * Persist uploaded book images and return public URLs stored on `Book.images`.
 * Empty files are skipped; each file max 5MB.
 */
export async function saveUploadedImages(files: File[]): Promise<string[]> {
  const driver = storageDriver();
  if (driver === "s3") return saveS3(files);
  if (driver === "vercel-blob") return saveVercelBlob(files);
  return saveLocal(files);
}
