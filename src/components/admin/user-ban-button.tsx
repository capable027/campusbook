"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { setUserBannedAction } from "@/lib/actions/admin";

export function UserBanButton({
  userId,
  banned,
}: {
  userId: string;
  banned: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function toggle() {
    const ok = banned
      ? confirm("确定解封该用户？")
      : confirm("确定封禁该用户？");
    if (!ok) return;
    setPending(true);
    await setUserBannedAction(userId, !banned, "管理员操作");
    setPending(false);
    router.refresh();
  }

  return (
    <Button
      variant={banned ? "secondary" : "destructive"}
      size="sm"
      onClick={toggle}
      disabled={pending}
    >
      {pending ? "…" : banned ? "解封" : "封禁"}
    </Button>
  );
}
