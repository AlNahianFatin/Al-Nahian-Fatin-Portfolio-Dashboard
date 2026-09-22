"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface MessageContextType {
    unreadCount: number;
    refreshUnreadCount: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0);

    async function refreshUnreadCount() {
        try {
            const r = await fetch("/api/messages/unread");
            const d = await r.json();
            setUnreadCount(d.count || 0);
        } catch (e) {
            console.error("Failed to fetch unread count", e);
        }
    }

    useEffect(() => {
        refreshUnreadCount();
    }, []);

    async function markAsRead(id: string) {
        try {
            await fetch("/api/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            await refreshUnreadCount();
        } catch (e) {
            console.error("Failed to mark message as read", e);
        }
    }

    async function markAllAsRead() {
        try {
            await fetch("/api/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ all: true }),
            });
            await refreshUnreadCount();
        } catch (e) {
            console.error("Failed to mark all as read", e);
        }
    }

    return (
        <MessageContext.Provider value={{ unreadCount, refreshUnreadCount, markAsRead, markAllAsRead }}>
            {children}
        </MessageContext.Provider>
    );
}

export function useMessages() {
    const context = useContext(MessageContext);
    if (!context) throw new Error("useMessages must be used within a MessageProvider");
    return context;
}
