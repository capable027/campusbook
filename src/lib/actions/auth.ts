"use server";

import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export type RegisterState = { error?: string; success?: boolean };

export async function registerAction(
  _prev: RegisterState | undefined,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    studentId: formData.get("studentId") ?? "",
    password: formData.get("password"),
    major: formData.get("major") ?? "",
    grade: formData.get("grade") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join("；") || "表单校验失败" };
  }

  const { name, email, studentId, password, major, grade } = parsed.data;
  const emailNorm = email && email.length > 0 ? email : null;
  const studentNorm = studentId && studentId.length > 0 ? studentId : null;

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        ...(emailNorm ? [{ email: emailNorm }] : []),
        ...(studentNorm ? [{ studentId: studentNorm }] : []),
      ],
    },
  });
  if (existing) {
    return { error: "该邮箱或学号已注册" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      name,
      email: emailNorm,
      studentId: studentNorm,
      passwordHash,
      role: UserRole.USER,
      major: major || null,
      grade: grade || null,
    },
  });

  return { success: true };
}
