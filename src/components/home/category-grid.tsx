import Link from "next/link";
import {
  BookMarked,
  BookOpen,
  Code2,
  GraduationCap,
  Languages,
  MoreHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "教材", q: "教材", icon: BookOpen },
  { name: "考研", q: "考研", icon: GraduationCap },
  { name: "编程", q: "编程", icon: Code2 },
  { name: "小说", q: "小说", icon: BookMarked },
  { name: "英语", q: "英语", icon: Languages },
  { name: "其他", q: "二手书", icon: MoreHorizontal },
] as const;

export function CategoryGrid({ className }: { className?: string }) {
  return (
    <section className={cn("space-y-4", className)} aria-labelledby="category-heading">
      <div className="flex items-end justify-between gap-4">
        <h2 id="category-heading" className="text-lg font-semibold tracking-tight">
          热门分类
        </h2>
        <p className="text-muted-foreground text-sm">一键筛选，快速找书</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map(({ name, q, icon: Icon }) => (
          <Link key={name} href={`/?q=${encodeURIComponent(q)}`} className="group block outline-none">
            <Card className="flex flex-row items-center gap-3 rounded-xl p-4 transition-all duration-300 hover:scale-105">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 transition-colors group-hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:group-hover:bg-neutral-700">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="font-medium">{name}</span>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
