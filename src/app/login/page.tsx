import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";
import { SiteHeader } from "@/components/layout/site-header";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <AuthPageShell
        heroTitle="欢迎回来"
        heroDescription="使用邮箱或学号登录，继续浏览教材、管理消息与发布闲置书本。"
      >
        <Suspense fallback={<p className="text-center text-muted-foreground">加载中…</p>}>
          <LoginForm />
        </Suspense>
      </AuthPageShell>
    </div>
  );
}
