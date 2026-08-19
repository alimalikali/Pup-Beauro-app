import axios, { AxiosError, AxiosResponse } from "axios";

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000/api";

// Uploads are served at /uploads/* (NOT /api/uploads/*).
export const UPLOAD_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const TOKEN_STORAGE_KEY = "mithaq.admin.token";
export const USER_STORAGE_KEY = "mithaq.admin.user";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<any>) => {
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(Array.isArray(message) ? message.join(", ") : message));
  },
);

// ---- Types -----------------------------------------------------------------

export type AdminRole = "admin" | "user" | string;

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  isVerified?: boolean;
  isActive?: boolean;
  profile?: AdminProfile | null;
}

export interface AdminProfile {
  id?: string;
  displayName?: string | null;
  gender?: "male" | "female" | string | null;
  age?: number | null;
  city?: string | null;
}

export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingVerifications: number;
  activeMatches: number;
}

export interface AdminVerification {
  id: string;
  status: "pending" | "approved" | "rejected" | string;
  cnicFront?: string | null;
  cnicBack?: string | null;
  adminNote?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt?: string;
  user?: AdminUser | null;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

// ---- Helpers ---------------------------------------------------------------

export const adminApi = {
  login: (email: string, password: string) =>
    api.post<unknown, LoginResponse>("/auth/login", { email, password }),
  me: () => api.get<unknown, AdminUser>("/auth/me"),
  stats: () => api.get<unknown, AdminStats>("/admin/stats"),
  users: () => api.get<unknown, AdminUser[]>("/admin/users"),
  suspendUser: (id: string) =>
    api.put<unknown, AdminUser>(`/admin/users/${id}/suspend`),
  unsuspendUser: (id: string) =>
    api.put<unknown, AdminUser>(`/admin/users/${id}/unsuspend`),
  verifications: () =>
    api.get<unknown, AdminVerification[]>("/admin/verifications"),
  reviewVerification: (
    id: string,
    status: "approved" | "rejected",
    note?: string,
  ) =>
    api.put<unknown, AdminVerification>(`/admin/verifications/${id}`, {
      status,
      note,
    }),
};

export function uploadUrl(relativeOrAbsolute?: string | null): string | undefined {
  if (!relativeOrAbsolute) return undefined;
  if (/^https?:\/\//i.test(relativeOrAbsolute)) return relativeOrAbsolute;
  const path = relativeOrAbsolute.startsWith("/")
    ? relativeOrAbsolute
    : `/${relativeOrAbsolute}`;
  return `${UPLOAD_BASE_URL}${path}`;
}
