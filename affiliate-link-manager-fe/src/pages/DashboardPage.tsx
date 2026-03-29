import { useEffect, useState } from "react";
import {
  MousePointer2,
  Link as LinkIcon,
  Calendar,
  TrendingUp,
  Loader2,
  BarChart,
  PieChart as PieIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";

import axiosInstance from "../api/axiosInstance";
import { StatCard } from "../components/StatCard";
import type { DashboardStats } from "../types";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get<DashboardStats>("/stats/summary");
        setStats(res.data);
      } catch (error) {
        console.error("Lỗi lấy thống kê", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Hiệu suất Affiliate thời gian thực.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Cập nhật mới nhất
          </span>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng số Link"
          value={stats?.totalLinks || 0}
          icon={LinkIcon}
          iconColor="text-blue-600"
          bgColor="bg-blue-50 dark:bg-blue-500/10"
        />
        <StatCard
          title="Tổng số Click"
          value={stats?.totalClicks.toLocaleString() || 0}
          icon={MousePointer2}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <StatCard
          title="Click hôm nay"
          value={stats?.clicksToday || 0}
          icon={Calendar}
          iconColor="text-orange-600"
          bgColor="bg-orange-50 dark:bg-orange-500/10"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Xu hướng Click
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              7 ngày gần nhất
            </p>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.chartData}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
                opacity={0.1}
              />
              <XAxis
                dataKey="_id"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  backgroundColor: "#1e293b",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#4f46e5"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorClicks)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <BarChart size={20} className="text-blue-500" /> Top 5 Liên Kết
          </h3>
          <div className="space-y-3">
            {stats?.topLinks.map((link, idx) => (
              <div
                key={link._id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:scale-[1.02] transition-transform cursor-default"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded-full font-black text-blue-600 text-xs shadow-sm">
                    {idx + 1}
                  </span>
                  <div className="max-w-[150px] sm:max-w-[200px]">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {link.title}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      /r/{link.shortCode}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-blue-600 dark:text-blue-400">
                    {link.totalClicks}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    Clicks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <PieIcon size={20} className="text-emerald-500" /> Phân tích truy
            cập
          </h3>
          <div className="grid grid-cols-2 gap-4 h-64">
            {[
              { data: stats?.sourceStats, label: "Nguồn" },
              { data: stats?.deviceStats, label: "Thiết bị" },
            ].map((group, i) => (
              <div key={i} className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={group.data?.map((s) => ({
                        name: s._id,
                        value: s.count,
                      }))}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {group.data?.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={COLORS[(idx + i * 2) % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <span className="text-[10px] font-black text-slate-500 uppercase mt-2 tracking-widest">
                  {group.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
