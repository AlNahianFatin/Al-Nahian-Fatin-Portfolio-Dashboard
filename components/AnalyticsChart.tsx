"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

export function AnalyticsChart({ data }: { data: any[] }) {
    return (
        <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} />
                    <Line type="monotone" dataKey="messages" stroke="#06b6d4" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
