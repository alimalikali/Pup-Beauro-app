import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  APP_TOKEN_STORAGE_KEY,
  APP_USER_STORAGE_KEY,
  AdminUser,
  RegistrationRequest,
  authApi,
} from "./api";

type AuthContextValue = {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegistrationRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AppAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const value = localStorage.getItem(APP_USER_STORAGE_KEY);
      return value ? JSON.parse(value) : null;
    } catch {
      localStorage.removeItem(APP_USER_STORAGE_KEY);
      localStorage.removeItem(APP_TOKEN_STORAGE_KEY);
      return null;
    }
  });

  const save = (response: { token: string; user: AdminUser }) => {
    localStorage.setItem(APP_TOKEN_STORAGE_KEY, response.token);
    localStorage.setItem(APP_USER_STORAGE_KEY, JSON.stringify(response.user));
    setUser(response.user);
  };

  const value = useMemo(
    () => ({
      user,
      login: async (email: string, password: string) =>
        save(await authApi.login(email, password)),
      register: async (data: RegistrationRequest) =>
        save(await authApi.register(data)),
      logout: () => {
        localStorage.removeItem(APP_TOKEN_STORAGE_KEY);
        localStorage.removeItem(APP_USER_STORAGE_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAppAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAppAuth must be used inside AppAuthProvider");
  return value;
};

export function RequireUser({ children }: { children: ReactNode }) {
  const { user } = useAppAuth();
  const location = useLocation();
  return user ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}
