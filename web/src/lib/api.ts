import axios, { AxiosError, AxiosResponse } from "axios";

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:5000/api";

// Uploads are served at /uploads/* (NOT /api/uploads/*).
export const UPLOAD_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const TOKEN_STORAGE_KEY = "mithaq.admin.token";
export const USER_STORAGE_KEY = "mithaq.admin.user";
export const APP_TOKEN_STORAGE_KEY = "mithaq.user.token";
export const APP_USER_STORAGE_KEY = "mithaq.user.account";

function createApiClient(tokenStorageKey: string) {
  const client = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem(tokenStorageKey);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  client.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError<{ message?: string | string[] }>) => {
      const message =
        error.response?.data?.message || error.message || "Request failed";
      return Promise.reject(
        new Error(Array.isArray(message) ? message.join(", ") : message),
      );
    },
  );
  return client;
}

const memberClient = createApiClient(APP_TOKEN_STORAGE_KEY);
const adminClient = createApiClient(TOKEN_STORAGE_KEY);

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

export interface MatchProfile {
  profile: AdminProfile & {
    userId: string;
    profession?: string;
    education?: string;
    purposeStatement?: string;
    lifeTags?: string[];
    bio?: string;
  };
  score: number;
}

export interface RegistrationRequest {
  displayName: string;
  email: string;
  password: string;
  gender: "male" | "female";
  city: string;
  phone?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    memberClient.post<unknown, LoginResponse>("/auth/login", {
      email,
      password,
    }),
  register: (body: RegistrationRequest) =>
    memberClient.post<unknown, LoginResponse>("/auth/register", body),
  me: () => memberClient.get<unknown, AdminUser>("/auth/me"),
};

export const profileApi = {
  get: () => memberClient.get<unknown, MatchProfile["profile"]>("/profile"),
  update: (body: Record<string, unknown>) => memberClient.put("/profile", body),
  purpose: (body: Record<string, unknown>) =>
    memberClient.post("/profile/purpose", body),
  priorities: (body: Record<string, number>) =>
    memberClient.post("/profile/priorities", body),
  publish: () => memberClient.post("/profile/publish"),
};

export const matchApi = {
  feed: () => memberClient.get<unknown, MatchProfile[]>("/matches/feed"),
  interest: (userId: string) =>
    memberClient.post(`/matches/interest/${userId}`),
  mutual: () => memberClient.get("/matches/mutual"),
};

export const safetyApi = {
  favorite: (userId: string) => memberClient.post(`/favorites/${userId}`),
  block: (userId: string) => memberClient.post(`/blocks/${userId}`),
  report: (reportedUserId: string, category: string, details: string) =>
    memberClient.post("/reports", { reportedUserId, category, details }),
  notifications: () => memberClient.get("/notifications"),
};

// ---- Helpers ---------------------------------------------------------------

export const adminApi = {
  login: (email: string, password: string) =>
    adminClient.post<unknown, LoginResponse>("/auth/login", {
      email,
      password,
    }),
  me: () => adminClient.get<unknown, AdminUser>("/auth/me"),
  stats: () => adminClient.get<unknown, AdminStats>("/admin/stats"),
  users: () => adminClient.get<unknown, AdminUser[]>("/admin/users"),
  suspendUser: (id: string) =>
    adminClient.put<unknown, AdminUser>(`/admin/users/${id}/suspend`),
  unsuspendUser: (id: string) =>
    adminClient.put<unknown, AdminUser>(`/admin/users/${id}/unsuspend`),
  verifications: () =>
    adminClient.get<unknown, AdminVerification[]>("/admin/verifications"),
  reviewVerification: (
    id: string,
    status: "approved" | "rejected",
    note?: string,
  ) =>
    adminClient.put<unknown, AdminVerification>(`/admin/verifications/${id}`, {
      status,
      note,
    }),
  verificationFile: (id: string, side: "front" | "back") =>
    adminClient.get<unknown, Blob>(`/admin/verification-files/${id}/${side}`, {
      responseType: "blob",
    }),
};
