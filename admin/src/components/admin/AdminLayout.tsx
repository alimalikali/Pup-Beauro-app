import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/lib/admin-auth";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/verifications", label: "Verifications", icon: ShieldCheck },
  { to: "/admin/users", label: "Users", icon: Users },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { logout, user } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-mithaq-blush/40">
        <Link
          to="/admin"
          onClick={onNavigate}
          className="flex items-center gap-2"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-mithaq-hot text-white font-display text-lg font-bold">
            M
          </span>
          <span className="font-display text-lg font-semibold text-mithaq-ink">
            Mithaq Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-mithaq-hot text-white shadow-pink"
                  : "text-mithaq-ink/80 hover:bg-mithaq-blush/40 hover:text-mithaq-ink",
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-mithaq-blush/40 px-3 py-3">
        {user?.email ? (
          <p
            className="px-3 pb-2 text-xs text-mithaq-mid2 truncate"
            title={user.email}
          >
            {user.email}
          </p>
        ) : null}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-mithaq-ink/80 hover:bg-mithaq-blush/40 hover:text-mithaq-ink"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-mithaq-cream/40">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-mithaq-blush/40 bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen ? (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex w-64 flex-col bg-white border-r border-mithaq-blush/40">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-mithaq-blush/40 bg-white/90 backdrop-blur px-4 md:px-8 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <h1 className="font-display text-base md:text-lg text-mithaq-ink">
              Admin Console
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-mithaq-mid2 truncate max-w-[16rem]">
              {user?.email ?? ""}
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-mithaq-hot text-white text-xs font-semibold">
              {(user?.email ?? "A").charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
