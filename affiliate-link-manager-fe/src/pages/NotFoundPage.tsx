import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export const NotFoundPage = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
    <div className="text-blue-600 mb-4">
      <AlertCircle size={80} strokeWidth={1.5} />
    </div>
    <h1 className="text-6xl font-black text-slate-900"> 404 </h1>
    <p className="text-xl text-slate-500 mt-2 mb-8 text-center">
      Ốp s! Trang bạn đang tìm kiếm đã "bay màu" hoặc không tồn tại.
    </p>
    <Link
      to="/"
      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
    >
      <Home size={20} />
      Quay về trang chủ
    </Link>
  </div>
);
