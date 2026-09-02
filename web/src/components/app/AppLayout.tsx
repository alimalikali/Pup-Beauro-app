import { Heart, LayoutDashboard, LogOut, Search, Settings, UserRound } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppAuth } from "@/lib/app-auth";

const links = [
  ["/app", "Dashboard", LayoutDashboard],
  ["/app/discover", "Discover", Search],
  ["/app/interests", "Interests", Heart],
  ["/app/profile", "My profile", UserRound],
  ["/app/settings", "Settings", Settings],
] as const;

export default function AppLayout() {
  const { user, logout } = useAppAuth();
  const navigate = useNavigate();
  return <div className="min-h-screen bg-mithaq-cream">
    <header className="glass-strong sticky top-0 z-30 border-b border-mithaq-blush/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <NavLink to="/app" className="font-display text-2xl font-bold text-mithaq-ink">Mithaq <span className="font-arabic text-mithaq-hot">مِيثَاق</span></NavLink>
        <div className="flex items-center gap-3 text-sm text-mithaq-mid2"><span className="hidden sm:inline">{user?.email}</span><button onClick={() => { logout(); navigate("/"); }} className="rounded-full p-2 hover:bg-mithaq-light" aria-label="Log out"><LogOut className="h-5 w-5" /></button></div>
      </div>
    </header>
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr] md:px-8">
      <nav className="glass flex gap-2 overflow-x-auto rounded-2xl p-2 md:flex-col md:self-start" aria-label="Account navigation">
        {links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === "/app"} className={({isActive}) => cn("flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold", isActive ? "bg-gradient-pink text-white shadow-pink" : "text-mithaq-mid2 hover:bg-mithaq-light")}><Icon className="h-4 w-4" />{label}</NavLink>)}
      </nav>
      <main><Outlet /></main>
    </div>
  </div>;
}
