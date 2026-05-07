"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** On `/`, scroll to `#books` when URL carries browse-related params so results are visible. */
export function ScrollToBooksWhenSearching() {
  const pathname = usePathname();
  const sp = useSearchParams();

  useEffect(() => {
    if (pathname !== "/") return;

    const q = (sp.get("q") ?? "").trim();
    const major = (sp.get("major") ?? "").trim();
    const course = (sp.get("course") ?? "").trim();
    const sort = sp.get("sort") ?? "new";
    const pageRaw = sp.get("page");
    const page = Math.max(1, parseInt(pageRaw ?? "1", 10) || 1);

    const hasBrowseIntent =
      q.length > 0 ||
      major.length > 0 ||
      course.length > 0 ||
      (sort !== "new" && sort !== "") ||
      page > 1;

    if (!hasBrowseIntent) return;

    requestAnimationFrame(() => {
      document.getElementById("books")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname, sp]);

  return null;
}
