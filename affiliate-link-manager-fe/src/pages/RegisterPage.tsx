import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, User, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../api/axiosInstance";
import { registerSchema, type RegisterFormData } from "../schemas/authSchema";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await axiosInstance.post("/auth/register", data);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl p-10 border border-slate-100 dark:border-slate-800 transition-all">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Tạo tài khoản
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              Họ tên
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-3.5 text-slate-400"
                size={18}
              />
              <input
                {...register("name")}
                type="text"
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${
                  errors.name
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                } rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all`}
                placeholder="Nguyễn Văn A"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs font-bold ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-slate-400"
                size={18}
              />
              <input
                {...register("email")}
                type="email"
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${
                  errors.email
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                } rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-bold ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-slate-400"
                size={18}
              />
              <input
                {...register("password")}
                type="password"
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${
                  errors.password
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                } rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-bold ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Tham gia ngay <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-black hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};
