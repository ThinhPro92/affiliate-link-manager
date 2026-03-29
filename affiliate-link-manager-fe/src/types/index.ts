import type { LucideIcon } from "lucide-react";

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface Campaign {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface LinkData {
  _id: string;
  title: string;
  originalUrl: string;
  shortCode: string;
  totalClicks: number;
  isDeleted: boolean;
  createdAt: string;
  fallbackUrl: string;
  status: "active" | "broken";
  campaignId?: string | null;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface UpdateLinkModalProps extends ModalProps {
  link: LinkData | null;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

export interface UserInfo {
  id: string;
  name?: string;
  token: string;
}

export interface ChartData {
  _id: string;
  clicks: number;
}

export interface TopLink {
  _id: string;
  title: string;
  shortCode: string;
  totalClicks: number;
}

export interface DistributionStats {
  _id: string;
  count: number;
}

export interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  clicksToday: number;
  chartData: ChartData[];
  topLinks: TopLink[];
  sourceStats: DistributionStats[];
  deviceStats: DistributionStats[];
}
export interface LinkStats {
  title: string;
  totalClicks: number;
  history: {
    _id: string;
    count: number;
  }[];
}
