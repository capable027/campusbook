"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNavClient({
  name,
  email,
  imageUrl,
}: {
  name: string;
  email: string;
  imageUrl?: string;
}) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2">
            {imageUrl ? (
              <span className="relative size-6 shrink-0 overflow-hidden rounded-full border bg-muted">
                <Image src={imageUrl} alt="" fill className="object-cover" sizes="24px" unoptimized />
              </span>
            ) : (
              <User className="h-4 w-4" />
            )}
            <span className="max-w-[8rem] truncate">{name}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <div className="text-muted-foreground px-2 py-1.5 text-sm">
          <div className="font-medium text-foreground">{name}</div>
          {email ? <div className="truncate text-xs">{email}</div> : null}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/me/listings")}>我的发布</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/me/orders")}>我的订单</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/me/settings")}>账号设置</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void (async () => {
              await signOut({ redirect: false, callbackUrl: "/" });
              window.location.assign("/");
            })();
          }}
        >
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
