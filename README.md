# CampusBook

校内二手教材交易平台（Next.js App Router + Prisma + MySQL + NextAuth）。

## 本地开发

1. **MySQL**：复制环境变量并启动数据库

   ```bash
   cp .env.example .env
   # 编辑 .env 中的 DATABASE_URL、AUTH_SECRET
   docker compose up -d
   ```

2. **数据库迁移与种子**

   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

   默认管理员：`admin@campusbook.local` / `admin123`

3. **启动**

   ```bash
   npm install
   npm run dev
   ```

打开 [http://localhost:3000](http://localhost:3000)。

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发 |
| `npm run build` | 生产构建 |
| `npm run db:migrate` | 开发迁移 |
| `npm run db:push` | 快速同步 schema（开发） |
| `npm run db:seed` | 种子数据 |
| `npm run db:studio` | Prisma Studio |

## 功能概要

- 用户注册/登录（邮箱或学号）、个人中心（我的发布 / 订单 / **账号设置**：资料与改密）
- 教材发布（图片可本地或对象存储）、搜索/筛选/排序/分页
- 图书详情展示**卖家历史评价**与综合评分（不展示买家姓名）
- 订单状态：待确认 → 已确认 → 交易中 → 已完成 / 取消
- 会话内聊天（30s 轮询拉取新消息）
- 订单完成后买家评价
- 管理后台：用户封禁、教材审核、订单查看、数据统计

## 图片存储与环境变量

默认 `STORAGE_DRIVER` 未设置或为 `local`：图片写入 `public/uploads`，需目录可写，适合本地开发。

生产可切换为 S3 兼容存储（含 Cloudflare R2）或 Vercel Blob，并在 `next.config.ts` 中通过 `ASSET_PUBLIC_BASE_URL` / `STORAGE_IMAGE_HOST` 等配置 `next/image` 允许的远程域名。

| 变量 | 说明 |
|------|------|
| `STORAGE_DRIVER` | `local`（默认）\|`s3`\|`vercel-blob` |
| **local** | 无需额外变量；确保 `public/uploads` 可写 |
| **s3** | `S3_BUCKET`、`ASSET_PUBLIC_BASE_URL`（公开访问 URL 前缀，与对象 Key 拼接）、`AWS_REGION`；密钥 `AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY`。R2 等需另设 `S3_ENDPOINT`，必要时 `S3_FORCE_PATH_STYLE=true` |
| **vercel-blob** | `BLOB_READ_WRITE_TOKEN`；部署在 Vercel 时可由平台注入 |
| `STORAGE_PUBLIC_BASE_URL` | 与 `ASSET_PUBLIC_BASE_URL` 二选一，用于生成 `images.remotePatterns` |
| `STORAGE_IMAGE_HOST` | 可选；额外允许的图片域名（不含协议），用于 CDN |

详见仓库根目录 [`.env.example`](.env.example) 中的注释示例。
