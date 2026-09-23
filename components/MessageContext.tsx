"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface MessageContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const mounted = useRef(true);

  async function refreshUnreadCount() {
    try {
      const r = await fetch("/api/messages/unread", { cache: "no-store" });
      const d = await r.json();
      if (r.ok && mounted.current) setUnreadCount(Number(d.count) || 0);
    } catch (e) {
      console.error("Failed to fetch unread count", e);
    }
  }

  useEffect(() => {
    mounted.current = true;
    refreshUnreadCount();
    const interval = window.setInterval(refreshUnreadCount, 2000);
    return () => {
      mounted.current = false;
      window.clearInterval(interval);
    };
  }, []);

  async function markAsRead(id: string) {
    try {
      const r = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!r.ok) return false;
      await refreshUnreadCount();
      return true;
    } catch (e) {
      console.error("Failed to mark message as read", e);
      return false;
    }
  }

  async function markAllAsRead() {
    try {
      const r = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (!r.ok) return false;
      await refreshUnreadCount();
      return true;
    } catch (e) {
      console.error("Failed to mark all messages as read", e);
      return false;
    }
  }

  async function deleteMessage(id: string) {
    try {
      const r = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      if (!r.ok) return false;
      await refreshUnreadCount();
      return true;
    } catch (e) {
      console.error("Failed to delete message", e);
      return false;
    }
  }

  return (
    <MessageContext.Provider value={{ unreadCount, refreshUnreadCount, markAsRead, markAllAsRead, deleteMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) throw new Error("useMessages must be used within a MessageProvider");
  return context;
}
