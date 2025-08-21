"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function OverviewChart() {
  // Mock data for the chart
  const data = [
    { name: "May 1", users: 40, matches: 24 },
    { name: "May 5", users: 30, matches: 13 },
    { name: "May 10", users: 20, matches: 18 },
    { name: "May 15", users: 27, matches: 23 },
    { name: "May 20", users: 18, matches: 12 },
    { name: "May 25", users: 23, matches: 19 },
    { name: "May 30", users: 34, matches: 32 },
    { name: "Jun 5", users: 45, matches: 27 },
    { name: "Jun 10", users: 65, matches: 49 },
    { name: "Jun 15", users: 60, matches: 40 },
    { name: "Jun 20", users: 70, matches: 61 },
    { name: "Jun 25", users: 95, matches: 70 },
    { name: "Jun 30", users: 102, matches: 81 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            tickLine={{ stroke: "hsl(var(--muted))" }}
            axisLine={{ stroke: "hsl(var(--muted))" }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            tickLine={{ stroke: "hsl(var(--muted))" }}
            axisLine={{ stroke: "hsl(var(--muted))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="users"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ r: 0 }}
          />
          <Line type="monotone" dataKey="matches" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
