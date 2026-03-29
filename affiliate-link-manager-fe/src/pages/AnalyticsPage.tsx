import { useEffect, useState } from "react";
import { Loader2, Monitor, Smartphone, Share2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

interface StatItem {
  _id: string;
  count: number;
}

interface DashboardStats {
  totalClicks: number;
  sourceStats: StatItem[];
  deviceStats: StatItem[];
}

export const AnalyticsPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/stats/summary");
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
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Phân tích chuyên sâu
        </h1>
        <p className="text-slate-500">
          Dữ liệu chi tiết về hành vi người dùng trên tất cả các liên kết.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Share2 size={20} />
            </div>
            <h3 className="font-bold text-lg text-slate-800">
              Nguồn lưu lượng
            </h3>
          </div>
          <div className="space-y-4">
            {stats?.sourceStats.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span>{item._id}</span>
                  <span className="text-slate-400">{item.count} clicks</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${stats.totalClicks > 0 ? (item.count / stats.totalClicks) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Monitor size={20} />
            </div>
            <h3 className="font-bold text-lg text-slate-800">
              Thiết bị truy cập
            </h3>
          </div>
          <div className="space-y-6">
            {stats?.deviceStats.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  {item._id?.toLowerCase() === "mobile" ? (
                    <Smartphone className="text-slate-400" />
                  ) : (
                    <Monitor className="text-slate-400" />
                  )}
                  <span className="font-bold text-slate-700 capitalize">
                    {item._id || "Unknown"}{" "}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-black text-blue-600 text-lg">
                    {item.count}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    Lượt click
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
