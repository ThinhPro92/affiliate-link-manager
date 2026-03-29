import { useEffect, useState, useCallback, useRef } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import {
  Plus,
  Copy,
  ExternalLink,
  Loader2,
  Search,
  Trash2,
  RotateCcw,
  Archive,
  BarChart3,
  Pencil,
  Link2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { AxiosError } from "axios";
import axiosInstance from "../api/axiosInstance";
import { CreateLinkModal } from "../components/CreateLinkModal";
import { UpdateLinkModal } from "../components/UpdateLinkModal";
import type { LinkData } from "../types";
import { LinkDetailModal } from "../components/LinkDetailModal";

interface ClickUpdatePayload {
  linkId: string;
  newTotalClicks: number;
}

export const LinksPage = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailLinkId, setDetailLinkId] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");

  const socketRef = useRef<Socket | null>(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = viewMode === "active" ? "/links" : "/links/trash";
      const res = await axiosInstance.get(endpoint, {
        params: { page, search, limit: 12 },
      });

      const data = res.data;
      if (data && Array.isArray(data.links)) {
        setLinks(data.links);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [page, search, viewMode]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  useEffect(() => {
    const socket: Socket = io("http://localhost:9225");
    socketRef.current = socket;
    const userId =
      localStorage.getItem("userId") || localStorage.getItem("user_id");
    if (userId) socket.emit("join", userId);

    socket.on("linkClicked", (data: ClickUpdatePayload) => {
      setLinks((prev) =>
        prev.map((l) =>
          l._id === data.linkId
            ? { ...l, totalClicks: data.newTotalClicks }
            : l,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCopy = (shortCode: string) => {
    const fullUrl = `http://localhost:9225/r/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Đã sao chép link rút gọn!");
  };

  const handleAction = async (
    action: "delete" | "permanent" | "restore",
    id: string,
  ) => {
    try {
      if (action === "delete") await axiosInstance.delete(`/links/${id}`);
      else if (action === "permanent")
        await axiosInstance.delete(`/links/${id}/permanent`);
      else if (action === "restore")
        await axiosInstance.patch(`/links/${id}/restore`);

      toast.success(
        action === "restore" ? "Đã khôi phục liên kết" : "Thao tác thành công",
      );
      fetchLinks();
    } catch (err) {
      console.log(err);
      toast.error("Thao tác thất bại");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Link2 size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {viewMode === "active" ? "Hub Liên Kết" : "Thùng Rác"}
            </h1>
          </div>
          <p className="text-slate-500 font-medium ml-12">
            Quản lý {links.length} liên kết khả dụng
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              className="pl-12 pr-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
              placeholder="Tìm kiếm link..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <button
            title={
              viewMode === "active" ? "Xem thùng rác" : "Quay lại danh sách"
            }
            onClick={() => {
              setViewMode(viewMode === "active" ? "trash" : "active");
              setPage(1);
            }}
            className={`p-3 rounded-2xl transition-all ${viewMode === "active" ? "bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600" : "bg-orange-600 text-white hover:bg-orange-700"}`}
          >
            {viewMode === "active" ? (
              <Archive size={22} />
            ) : (
              <RotateCcw size={22} />
            )}
          </button>

          {viewMode === "active" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
              <Plus size={20} /> Tạo Mới
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {links.map((link) => (
              <motion.div
                key={link._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white dark:bg-slate-900 p-6 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  {link.status === "active" ? (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                      <CheckCircle2 size={10} /> ACTIVE
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-full">
                      <AlertCircle size={10} /> BROKEN
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800 dark:text-white">
                      {link.totalClicks}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Lượt click
                    </p>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate mb-1">
                  {link.title}
                </h3>

                <div className="flex items-center gap-2 mb-6">
                  <code className="text-xs bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg text-blue-600 font-mono">
                    /r/{link.shortCode}
                  </code>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
                  <div className="flex gap-1">
                    {viewMode === "active" ? (
                      <>
                        <button
                          onClick={() => {
                            setDetailLinkId(link._id);
                            setIsDetailModalOpen(true);
                          }}
                          title="Thống kê chi tiết"
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                        >
                          <TrendingUp size={18} />
                        </button>
                        <button
                          onClick={() => handleCopy(link.shortCode)}
                          title="Sao chép link"
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLink(link);
                            setIsUpdateModalOpen(true);
                          }}
                          title="Chỉnh sửa"
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAction("restore", link._id)}
                        title="Khôi phục link"
                        className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all flex items-center gap-1 font-bold text-xs"
                      >
                        <RotateCcw size={18} /> Khôi phục
                      </button>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Mở link gốc"
                      className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      onClick={() =>
                        handleAction(
                          viewMode === "active" ? "delete" : "permanent",
                          link._id,
                        )
                      }
                      title={
                        viewMode === "active"
                          ? "Bỏ vào thùng rác"
                          : "Xóa vĩnh viễn"
                      }
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && links.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="inline-flex p-6 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300 mb-4">
            <Link2 size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Không tìm thấy liên kết nào
          </h3>
          <p className="text-slate-500">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo mới liên kết.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 bg-white dark:bg-slate-900 w-fit mx-auto p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <button
            title="Phan trang"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl disabled:opacity-30 transition-all"
          >
            <RotateCcw size={20} className="rotate-[-90deg]" />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            title="+"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl disabled:opacity-30 transition-all"
          >
            <RotateCcw size={20} className="rotate-90" />
          </button>
        </div>
      )}

      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLinks}
      />

      <LinkDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailLinkId(null);
        }}
        linkId={detailLinkId}
      />

      {selectedLink && (
        <UpdateLinkModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedLink(null);
          }}
          onSuccess={fetchLinks}
          link={selectedLink}
        />
      )}
    </div>
  );
};
