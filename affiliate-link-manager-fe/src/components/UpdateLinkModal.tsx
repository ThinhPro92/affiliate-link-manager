import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  X,
  Loader2,
  Save,
  FolderKanban,
  Link as LinkIcon,
  Globe,
} from "lucide-react";

import axiosInstance from "../api/axiosInstance";
import { linkSchema, type LinkFormData } from "../schemas/linkSchema";
import type { Campaign, UpdateLinkModalProps } from "../types";

export const UpdateLinkModal = ({
  isOpen,
  onClose,
  onSuccess,
  link,
}: UpdateLinkModalProps) => {
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
    if (isOpen && link) {
      reset({
        title: link.title,
        originalUrl: link.originalUrl,
        fallbackUrl: link.fallbackUrl || "",
        campaignId: link.campaignId || "",
      });

      axiosInstance
        .get<Campaign[]>("/campaigns")
        .then((res) => setCampaigns(res.data))
        .catch(() => toast.error("Không thể tải danh sách chiến dịch"));
    }
  }, [isOpen, link, reset]);

  if (!isOpen || !link) return null;

  const onSubmit = async (data: LinkFormData) => {
    try {
      const payload = {
        ...data,
        campaignId: data.campaignId === "" ? null : data.campaignId,
      };

      await axiosInstance.patch(`/links/${link._id}`, payload);
      toast.success("Cập nhật link thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Lỗi cập nhật! Vui lòng kiểm tra lại đường dẫn.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-none mb-1">
              Chỉnh sửa
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Mã code: {link.shortCode}
            </p>
          </div>
          <button
            title="X"
            onClick={onClose}
            className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
              Tên gợi nhớ
            </label>
            <div className="relative">
              <input
                {...register("title")}
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border ${
                  errors.title ? "border-red-500" : "border-transparent"
                } outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium`}
                placeholder="Ví dụ: Campaign Tháng 10"
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-[10px] font-bold ml-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
              Chiến dịch
            </label>
            <div className="relative">
              <select
                {...register("campaignId")}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer font-medium"
              >
                <option value="">-- Để trống --</option>
                {campaigns.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FolderKanban
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
              Link đích (Original)
            </label>
            <div className="relative">
              <LinkIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                {...register("originalUrl")}
                className={`w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 dark:text-blue-500 rounded-2xl border ${
                  errors.originalUrl ? "border-red-500" : "border-transparent"
                } outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all`}
              />
            </div>
            {errors.originalUrl && (
              <p className="text-red-500 text-[10px] font-bold ml-1">
                {errors.originalUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
              Link dự phòng (Fallback)
            </label>
            <div className="relative">
              <Globe
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                {...register("fallbackUrl")}
                placeholder="Dùng khi link chính bị lỗi..."
                className="w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 dark:text-orange-500 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all"
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 font-bold py-4 rounded-[1.5rem] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} /> LƯU THAY ĐỔI
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
