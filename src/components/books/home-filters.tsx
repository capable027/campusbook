"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function HomeFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = String(fd.get("q") ?? "").trim();
    const major = String(fd.get("major") ?? "").trim();
    const course = String(fd.get("course") ?? "").trim();
    const sort = String((fd.get("sort") as string) ?? "new");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (major) params.set("major", major);
    if (course) params.set("course", course);
    if (sort && sort !== "new") params.set("sort", sort);
    router.push(`/?${params.toString()}`);
  }

  return (
    <form
      onSubmit={apply}
      className="grid gap-4 rounded-xl border-2 border-neutral-950 bg-white p-4 shadow-none md:grid-cols-2 lg:grid-cols-4 dark:border-neutral-100 dark:bg-neutral-950"
    >
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
    </form>
  );
}
