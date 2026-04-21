"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
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
import Link from "next/link";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const justRegistered = searchParams.get("registered") === "1";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const identifier = String(form.get("identifier") ?? "");
    const password = String(form.get("password") ?? "");
    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
      callbackUrl,
    });
    setPending(false);
    if (res?.error) {
      setError("邮箱/学号或密码错误，或账号已被封禁");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <Card className="w-full border-border/80 shadow-sm">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-xl">登录</CardTitle>
        <CardDescription>使用注册时的邮箱或学号</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4 pt-2">
          {justRegistered ? (
            <p
              className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground"
              role="status"
            >
              注册成功，请使用下方信息登录
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="identifier">邮箱或学号</Label>
            <Input
              id="identifier"
              name="identifier"
              required
              autoComplete="username"
              placeholder="name@school.edu 或学号"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t pt-6">
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "登录中…" : "登录"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            没有账号？{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              去注册
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
