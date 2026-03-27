"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FulfilmentData {
  month: string;
  completed: number;
  ongoing: number;
}

interface WeeklyCampaignData {
  week: string;
  count: number;
}

interface SignupData {
  month: string;
  influencers: number;
  brands: number;
}

type ChartProps =
  | { type: "fulfilment"; data: FulfilmentData[] }
  | { type: "weeklyCampaigns"; data: WeeklyCampaignData[] }
  | { type: "signups"; data: SignupData[] };

const tooltipStyle = {
  backgroundColor: "rgba(255,255,255,0.95)",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  fontSize: "12px",
  padding: "8px 12px",
};

const axisStyle = { fontSize: 11, fill: "#9ca3af" };

export function DashboardCharts(props: ChartProps) {
  if (props.type === "fulfilment") {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={props.data}>
          <defs>
            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ongoingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={30} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#6366f1"
            fill="url(#completedGradient)"
            strokeWidth={2.5}
          />
          <Area
            type="monotone"
            dataKey="ongoing"
            stroke="#22d3ee"
            fill="url(#ongoingGradient)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (props.type === "weeklyCampaigns") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={props.data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={30} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={48} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (props.type === "signups") {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={props.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={30} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="influencers" fill="#22d3ee" radius={[6, 6, 0, 0]} barSize={20} />
          <Bar dataKey="brands" fill="#f472b6" radius={[6, 6, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
