import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import axiosInstance from "../api/axiosInstance";
import { loginSchema, type LoginFormData } from "../schemas/authSchema";

interface ApiErrorResponse {
  message: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("userName", res.data.name);

      toast.success(`Chào mừng trở lại, ${res.data.name}!`);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<ApiErrorResponse>;
        const errorMsg =
          serverError.response?.data?.message || "Đăng nhập thất bại";
        toast.error(errorMsg);
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl p-8 border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Welcome Back!
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Đăng nhập để tiếp tục quản lý
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
              <input
                {...register("email")}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                  errors.email ? "border-red-500" : "border-transparent"
                } rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white`}
                placeholder="Email của bạn"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-bold ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="password"
                {...register("password")}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                  errors.password ? "border-red-500" : "border-transparent"
                } rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white`}
                placeholder="Mật khẩu"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Đăng nhập ngay"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Tạo tài khoản
          </Link>
        </p>
      </div>
    </div>
  );
};
