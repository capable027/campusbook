import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { SiteHeader } from "@/components/layout/site-header";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <AuthPageShell
        heroTitle="加入 CampusBook"
        heroDescription="创建账号后即可发布或求购二手教材，与同学安全、便捷地完成交易。"
      >
        <RegisterForm />
      </AuthPageShell>
    </div>
  );
}
