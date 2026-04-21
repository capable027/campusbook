"use client";

import { useRouter } from "next/navigation";
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

export function UserNavClient({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="max-w-[8rem] truncate">{name}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
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
