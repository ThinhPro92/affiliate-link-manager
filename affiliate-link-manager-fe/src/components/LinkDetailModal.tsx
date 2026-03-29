import { useEffect, useState } from "react";
import { X, Loader2, BarChart3, Calendar, MousePointer2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axiosInstance from "../api/axiosInstance";
import type { LinkStats } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  linkId: string | null;
}

export const LinkDetailModal = ({ isOpen, onClose, linkId }: Props) => {
  const [data, setData] = useState<LinkStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !linkId) {
      setData(null);
      return;
    }

    const controller = new AbortController();

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/stats/link/${linkId}`, {
          signal: controller.signal,
        });
        setData(res.data);
      } catch (error: any) {
        if (error.name !== "CanceledError") {
          console.error("Lỗi tải stats:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    return () => {
      controller.abort();
    };
  }, [isOpen, linkId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center p-8 border-b dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white truncate max-w-[300px]">
                {data?.title || (loading ? "Đang tải..." : "Không có tiêu đề")}
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Thống kê 7 ngày qua
              </p>
            </div>
          </div>
          <button
            title="X"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-slate-500 text-sm font-medium">
                Đang bóc tách dữ liệu...
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-600 mb-2 font-bold text-sm uppercase">
                    <MousePointer2 size={16} /> Tổng Click
                  </div>
                  <div className="text-4xl font-black text-blue-700 dark:text-blue-400">
                    {data?.totalClicks || 0}
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-800">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2 font-bold text-sm uppercase">
                    <Calendar size={16} /> Trạng thái
                  </div>
                  <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400">
                    Live
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 ml-2">
                  Xu hướng tương tác
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.history || []}>
                    <defs>
                      <linearGradient
                        id="colorClick"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="_id"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: "bold" }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "#2563eb", fontWeight: "bold" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorClick)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
