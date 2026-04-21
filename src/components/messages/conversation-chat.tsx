"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessageAction } from "@/lib/actions/messages";

type Msg = {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
};

export function ConversationChat({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: Msg[];
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const t = setInterval(async () => {
      const last = messagesRef.current[messagesRef.current.length - 1];
      const url = new URL(
        `/api/conversations/${conversationId}/messages`,
        window.location.origin,
      );
      if (last) url.searchParams.set("after", last.createdAt);
      const res = await fetch(url.toString());
      if (!res.ok) return;
      const data = (await res.json()) as { messages: Msg[] };
      if (data.messages?.length) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const next = [...prev];
          for (const m of data.messages) {
            if (!ids.has(m.id)) next.push(m);
          }
          return next.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
        });
      }
    }, 30_000);
    return () => clearInterval(t);
  }, [conversationId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const v = text.trim();
    if (!v) return;
    setPending(true);
    const res = await sendMessageAction(conversationId, v);
    setPending(false);
    if (res.error) {
      setErr(res.error);
      return;
    }
    setText("");
    const refresh = await fetch(`/api/conversations/${conversationId}/messages`);
    if (refresh.ok) {
      const data = (await refresh.json()) as { messages: Msg[] };
      setMessages(data.messages ?? []);
    }
  }

  return (
    <div className="flex h-[min(70vh,560px)] flex-col rounded-lg border">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const mine = m.sender.id === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  mine ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {!mine ? (
                  <p className="text-muted-foreground mb-1 text-xs">{m.sender.name}</p>
                ) : null}
                <p className="whitespace-pre-wrap">{m.content}</p>
                <p className={`mt-1 text-[10px] opacity-70`}>
                  {new Date(m.createdAt).toLocaleString("zh-CN")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {err ? <p className="text-destructive px-4 text-sm">{err}</p> : null}
      <form onSubmit={onSubmit} className="flex gap-2 border-t p-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入消息…"
          maxLength={4000}
        />
        <Button type="submit" disabled={pending}>
          发送
        </Button>
      </form>
    </div>
  );
}
