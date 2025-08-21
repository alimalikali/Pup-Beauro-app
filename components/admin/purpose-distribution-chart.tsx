"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function PurposeDistributionChart() {
  // Mock data for the chart
  const data = [
    { name: "Educational", value: 35, color: "hsl(var(--primary))" },
    { name: "Spiritual", value: 25, color: "hsl(var(--secondary))" },
    { name: "Social Justice", value: 15, color: "hsl(217.2, 91.2%, 59.8%)" },
    { name: "Political", value: 10, color: "hsl(47.9, 95.8%, 53.1%)" },
    { name: "Environmental", value: 8, color: "hsl(142.1, 76.2%, 36.3%)" },
    { name: "Health & Wellness", value: 7, color: "hsl(346, 77%, 49%)" },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
            formatter={(value: number) => [`${value}%`, "Percentage"]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
