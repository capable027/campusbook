"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerAction, type RegisterState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const initial: RegisterState = {};

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerAction, initial);

  useEffect(() => {
    if (state.success) {
      router.push("/login?registered=1");
    }
  }, [state.success, router]);

  return (
    <Card className="w-full border-border/80 shadow-sm">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-xl">注册</CardTitle>
        <CardDescription>邮箱与学号至少填写一项，作为登录账号</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-5 pt-2">
          {state.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">基本信息</p>
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" name="name" required placeholder="张三" />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">登录账号</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱（可选）</Label>
                <Input id="email" name="email" type="email" placeholder="name@school.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">学号（可选）</Label>
                <Input id="studentId" name="studentId" placeholder="2021000000" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">密码</p>
            <div className="space-y-2">
              <Label htmlFor="password">密码（至少 6 位）</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">校园信息（选填）</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="major">专业</Label>
                <Input id="major" name="major" placeholder="计算机" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">年级</Label>
                <Input id="grade" name="grade" placeholder="大三" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t pt-6">
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "提交中…" : "创建账号"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            已有账号？{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              去登录
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
