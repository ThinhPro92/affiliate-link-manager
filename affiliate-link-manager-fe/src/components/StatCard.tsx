import type { StatCardProps } from "../types";

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor,
}: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${bgColor} ${iconColor}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
};
