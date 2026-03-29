import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X, Loader2, FolderKanban } from "lucide-react";

import axiosInstance from "../api/axiosInstance";
import { linkSchema, type LinkFormData } from "../schemas/linkSchema";
import type { Campaign, ModalProps } from "../types";

export const CreateLinkModal = ({ isOpen, onClose, onSuccess }: ModalProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
  });

  useEffect(() => {
    if (isOpen) {
      axiosInstance
        .get<Campaign[]>("/campaigns")
        .then((res) => setCampaigns(res.data))
        .catch(() => toast.error("Lỗi: Không thể lấy danh sách chiến dịch"));
    }
  }, [isOpen]);

  const onSubmit = async (data: LinkFormData) => {
    try {
      await axiosInstance.post("/links", {
        ...data,
        campaignId: data.campaignId || null,
      });

      toast.success("Tạo link thành công!");
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Không thể tạo link! Vui lòng thử lại.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200 border dark:border-slate-800 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-800 dark:text-white">
            Tạo Link mới
          </h2>
          <button
            title="X"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Tên gợi nhớ
            </label>
            <input
              {...register("title")}
              placeholder="Ví dụ: Giày Nike Sale"
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border ${
                errors.title ? "border-red-500" : "border-transparent"
              } focus:border-blue-500 outline-none transition`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Chiến dịch
            </label>
            <div className="relative">
              <select
                {...register("campaignId")}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
              >
                <option value="">-- Không chọn --</option>
                {campaigns.map((camp) => (
                  <option key={camp._id} value={camp._id}>
                    {camp.name}
                  </option>
                ))}
              </select>
              <FolderKanban
                size={18}
                className="absolute right-4 top-3.5 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Link đích
            </label>
            <input
              {...register("originalUrl")}
              placeholder="https://shopee.vn/..."
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border ${
                errors.originalUrl ? "border-red-500" : "border-transparent"
              } focus:border-blue-500 outline-none transition`}
            />
            {errors.originalUrl && (
              <p className="text-red-500 text-xs">
                {errors.originalUrl.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Link dự phòng (Nếu link chính hỏng)
            </label>
            <input
              {...register("fallbackUrl")}
              placeholder="https://google.com hoặc link sản phẩm khác"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent focus:border-blue-500 outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "XÁC NHẬN TẠO LINK"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
