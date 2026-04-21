"use client";

import { useActionState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  changePasswordAction,
  type PasswordActionState,
  updateProfileAction,
  type ProfileActionState,
} from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const profileInitial: ProfileActionState = {};
const passwordInitial: PasswordActionState = {};

type UserRow = {
  name: string;
  email: string | null;
  studentId: string | null;
  major: string | null;
  grade: string | null;
};

export function SettingsForms({ user }: { user: UserRow }) {
  const { update } = useSession();
  const [profileState, profileFormAction, profilePending] = useActionState(
    updateProfileAction,
    profileInitial,
  );
  const [passwordState, passwordFormAction, passwordPending] = useActionState(
    changePasswordAction,
    passwordInitial,
  );

  useEffect(() => {
    if (profileState.success && profileState.name && update) {
      void update({ name: profileState.name });
    }
  }, [profileState.success, profileState.name, update]);

  const loginHint = user.email
    ? `邮箱：${user.email}`
    : user.studentId
      ? `学号：${user.studentId}`
      : "登录账号";

  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">账号设置</h1>
        <p className="text-muted-foreground mt-1 text-sm">管理资料与登录安全</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本资料</CardTitle>
          <CardDescription>修改后在站内展示的名称与专业信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={profileFormAction} className="space-y-4">
            {profileState.error ? (
              <p className="text-destructive text-sm" role="alert">
                {profileState.error}
              </p>
            ) : null}
            {profileState.success ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-500" role="status">
                资料已保存
              </p>
            ) : null}
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              <p className="text-muted-foreground">登录账号（不可在此修改）</p>
              <p className="font-medium">{loginHint}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                如需更换邮箱或学号，请联系管理员处理。
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" name="name" required defaultValue={user.name} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="major">专业</Label>
                <Input id="major" name="major" placeholder="计算机" defaultValue={user.major ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">年级</Label>
                <Input id="grade" name="grade" placeholder="大三" defaultValue={user.grade ?? ""} />
              </div>
            </div>
            <Button type="submit" disabled={profilePending}>
              {profilePending ? "保存中…" : "保存资料"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>账号安全</CardTitle>
          <CardDescription>修改登录密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={passwordFormAction} className="space-y-4">
            {passwordState.error ? (
              <p className="text-destructive text-sm" role="alert">
                {passwordState.error}
              </p>
            ) : null}
            {passwordState.success ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-500" role="status">
                密码已更新。当前会话仍有效，下次登录请使用新密码。
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={passwordPending} variant="secondary">
              {passwordPending ? "更新中…" : "更新密码"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
