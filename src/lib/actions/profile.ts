"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, profileUpdateSchema } from "@/lib/validations";

export type ProfileActionState = { error?: string; success?: boolean; name?: string };

export async function updateProfileAction(
  _prev: ProfileActionState | undefined,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const parsed = profileUpdateSchema.safeParse({
    name: formData.get("name"),
    major: formData.get("major") ?? "",
    grade: formData.get("grade") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join("；") || "校验失败" };
  }

  const { name, major, grade } = parsed.data;
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      major: major && major.length > 0 ? major : null,
      grade: grade && grade.length > 0 ? grade : null,
    },
  });

  revalidatePath("/me/settings");
  revalidatePath("/");
  return { success: true, name };
}

export type PasswordActionState = { error?: string; success?: boolean };

export async function changePasswordAction(
  _prev: PasswordActionState | undefined,
  formData: FormData,
): Promise<PasswordActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join("；") || "校验失败" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "用户不存在" };

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) return { error: "当前密码不正确" };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  revalidatePath("/me/settings");
  return { success: true };
}
