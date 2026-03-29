import { useState, useEffect } from "react";
import { Plus, FolderKanban, Trash2, Calendar } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

interface Campaign {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    const res = await axiosInstance.get("/campaigns");
    setCampaigns(res.data);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/campaigns", { name, description });
      setName("");
      setDescription("");
      fetchCampaigns();
    } catch (error) {
      console.log(error);
      alert("Lỗi khi tạo chiến dịch");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Xóa chiến dịch sẽ không xóa link, nhưng các link sẽ không còn thuộc nhóm này. Tiếp tục?",
      )
    )
      return;
    await axiosInstance.delete(`/campaigns/${id}`);
    fetchCampaigns();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">
            Chiến dịch
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Gom nhóm và quản lý hiệu quả link Affiliate
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form
            onSubmit={handleCreate}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-4"
          >
            <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
              <Plus size={20} className="text-blue-500" /> Tạo chiến dịch mới
            </h3>
            <input
              type="text"
              placeholder="Tên chiến dịch (VD: Sale Trung Thu)"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              placeholder="Mô tả ngắn..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-none focus:ring-2 focus:ring-blue-500 outline-none h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Xác nhận tạo"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <div
              key={camp._id}
              className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-blue-500 dark:hover:border-blue-500 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
                  <FolderKanban size={24} />
                </div>
                <button
                  onClick={() => handleDelete(camp._id)}
                  title="Xóa chiến dịch"
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h4 className="font-bold text-xl dark:text-white mb-1">
                {camp.name}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                {camp.description || "Không có mô tả"}
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />{" "}
                  {new Date(camp.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              Chưa có chiến dịch nào được tạo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
