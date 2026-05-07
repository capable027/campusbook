import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// #region agent log
(() => {
  const raw = process.env.DATABASE_URL;
  let host = "";
  let port = "";
  try {
    const normalized = raw?.replace(/^mysql:\/\//i, "http://") ?? "";
    const u = new URL(normalized);
    host = u.hostname;
    port = u.port || "3306";
  } catch {
    /* ignore parse errors */
  }
  fetch("http://127.0.0.1:7496/ingest/a0013f8f-1e73-404d-8d1a-e22cabc31f57", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8c0b33" },
    body: JSON.stringify({
      sessionId: "8c0b33",
      location: "src/lib/prisma.ts:init",
      message: "DATABASE_URL host/port (sanitized)",
      data: { hypothesisId: "H1-H3", host, port, hasUrl: Boolean(raw) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
})();
// #endregion

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
