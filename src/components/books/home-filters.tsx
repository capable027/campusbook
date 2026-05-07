"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type HomeFiltersProps = {
  /** Canonical listing URL for advanced search (pagination lives here). */
  listingBasePath?: string;
};

export function HomeFilters({ listingBasePath = "/books" }: HomeFiltersProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const q = (sp.get("q") ?? "").trim();
  const major = (sp.get("major") ?? "").trim();
  const course = (sp.get("course") ?? "").trim();
  const sort = sp.get("sort") ?? "new";
  const hasAdvancedFilters = Boolean(q || major || course || (sort && sort !== "new"));

  function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const qv = String(fd.get("q") ?? "").trim();
    const majorV = String(fd.get("major") ?? "").trim();
    const courseV = String(fd.get("course") ?? "").trim();
    const sortV = String((fd.get("sort") as string) ?? "new");
    const params = new URLSearchParams();
    if (qv) params.set("q", qv);
    if (majorV) params.set("major", majorV);
    if (courseV) params.set("course", courseV);
    if (sortV && sortV !== "new") params.set("sort", sortV);
    const qs = params.toString();
    router.push(qs ? `${listingBasePath}?${qs}` : listingBasePath);
  }

  const fields = (
    <>
      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="q">关键词</Label>
        <Input
          id="q"
          name="q"
          placeholder="书名、作者、ISBN、描述"
          defaultValue={sp.get("q") ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="major">专业</Label>
        <Input id="major" name="major" placeholder="如 计算机" defaultValue={sp.get("major") ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="course">课程</Label>
        <Input id="course" name="course" placeholder="课程名" defaultValue={sp.get("course") ?? ""} />
      </div>
      <div className="space-y-2 md:col-span-2 lg:col-span-1">
        <Label htmlFor="sort">排序</Label>
        <select
          id="sort"
          name="sort"
          defaultValue={sp.get("sort") ?? "new"}
          className="flex h-10 w-full rounded-lg border-2 border-neutral-950 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-neutral-100 dark:bg-neutral-950"
        >
          <option value="new">最新发布</option>
          <option value="price_asc">价格从低到高</option>
          <option value="price_desc">价格从高到低</option>
        </select>
      </div>
      <div className="flex items-end md:col-span-2 lg:col-span-1">
        <Button type="submit" className="w-full">
          搜索
        </Button>
      </div>
    </>
  );

  return (
    <details
      className="rounded-xl border-2 border-neutral-950 bg-white shadow-none dark:border-neutral-100 dark:bg-neutral-950"
      open={hasAdvancedFilters}
    >
      <summary className="cursor-pointer list-none px-4 py-3 font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
        <span className="text-base">进阶筛选</span>
        <span className="text-muted-foreground ml-2 text-sm font-normal">
          专业、课程、排序；顶部搜索框仅关键词
        </span>
      </summary>
      <form onSubmit={apply} className="grid gap-4 border-t-2 border-neutral-950 p-4 md:grid-cols-2 lg:grid-cols-4 dark:border-neutral-100">
        {fields}
      </form>
    </details>
  );
}
