import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  adminApi,
  AdminUser,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from "./api";

interface AdminAuthState {
  token: string | null;
  user: AdminUser | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthState | undefined>(undefined);

function readStoredUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [user, setUser] = useState<AdminUser | null>(() => readStoredUser());

  // Keep state in sync across tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_STORAGE_KEY) setToken(e.newValue);
      if (e.key === USER_STORAGE_KEY) setUser(readStoredUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminApi.login(email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AdminAuthState>(
    () => ({
      token,
      user,
      isAdmin: !!token && (user?.role ?? "").toLowerCase() === "admin",
      login,
      logout,
    }),
    [token, user, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  }
  return ctx;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { token, user } = useAdminAuth();
  const location = useLocation();

  const isAdmin = !!token && (user?.role ?? "").toLowerCase() === "admin";

  if (!isAdmin) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }
  return <>{children}</>;
}
