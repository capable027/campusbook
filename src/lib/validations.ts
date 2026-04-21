import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "请输入姓名"),
    email: z.string().email("邮箱格式不正确").optional().or(z.literal("")),
    studentId: z.string().optional(),
    password: z.string().min(6, "密码至少 6 位"),
    major: z.string().optional(),
    grade: z.string().optional(),
  })
  .refine((d) => (d.email && d.email.length > 0) || (d.studentId && d.studentId.length > 0), {
    message: "请填写邮箱或学号",
    path: ["email"],
  });

export const bookCreateSchema = z.object({
  title: z.string().min(1, "请输入书名"),
  author: z.string().min(1, "请输入作者"),
  isbn: z.string().optional(),
  price: z.coerce.number().positive("价格需大于 0"),
  condition: z.string().min(1, "请选择成色"),
  description: z.string().min(1, "请填写描述"),
  major: z.string().optional(),
  course: z.string().optional(),
});

export const reviewSchema = z.object({
  orderId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1, "请输入姓名"),
  major: z.string().optional(),
  grade: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z.string().min(6, "新密码至少 6 位"),
    confirmPassword: z.string().min(1, "请确认新密码"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "两次输入的新密码不一致",
    path: ["confirmPassword"],
  });
