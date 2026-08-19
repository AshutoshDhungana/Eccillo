import { AlertTriangle, Calendar, CalendarDays, CheckSquare, ChevronLeft, LayoutDashboard, LogOut, Mail, Menu, Moon, Sparkles, Store, Sun, Wallet, Wand2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { Logo } from "../designed/app/components/Logo";

interface AppShellProps { children: ReactNode; eventId?: string; title?: string; }
const planningLinks = [
  { label: "Timeline", suffix: "/planning/timeline", icon: CalendarDays }, { label: "Budget", suffix: "/planning/budget", icon: Wallet },
  { label: "Tasks", suffix: "/planning/tasks", icon: CheckSquare }, { label: "Calendar", suffix: "/planning/calendar", icon: Calendar }, { label: "Risks", suffix: "/planning/risks", icon: AlertTriangle },
];
/* Manual and AI-guided planning are two views of the same event, never a fork:
   this control is present at every stage so either can be abandoned mid-way. */
function FlowSwitch({ eventId, path }: { eventId?: string; path: string }) {
  const creating = path.startsWith("/events/new");
  if (!creating && !eventId) return null;
  const aiTo = creating ? "/events/new" : `/events/${eventId}/setup`;
  const manualTo = creating ? "/events/new/manual" : `/events/${eventId}/planning/timeline`;
  const onManual = path.endsWith("/manual") || path.includes("/planning/");
  const chip = (active: boolean) =>
    "focus-ring rounded-[var(--radius-pill)] px-3 py-1.5 font-[var(--font-data)] text-[13px] transition " +
    (active ? "bg-[var(--accent)] font-bold text-[var(--onAccent)]" : "text-[var(--text2)] hover:opacity-[.82]");
  return (
    <div className="flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--panel)] p-1" role="group" aria-label="Planning mode">
      <Link to={aiTo} className={chip(!onManual)}>AI guided</Link>
      <Link to={manualTo} className={chip(onManual)}>Manual</Link>
    </div>
  );
}

function itemClass(active: boolean) { return "focus-ring flex w-full items-center gap-3 rounded-[var(--radius-nav-item)] px-3 py-2 text-left text-[15px] transition " + (active ? "bg-[var(--accent)] text-[var(--onAccent)]" : "text-white/80 hover:bg-white/10 hover:text-white"); }

function ThemeToggle() {
  const { theme, toggle } = useTheme(); const next = theme === "dark" ? "light" : "dark";
  return <button type="button" onClick={toggle} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`} aria-pressed={theme === "light"} className="focus-ring rounded-full p-2 text-white/64 transition hover:bg-white/10 hover:text-white">{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</button>;
}

export function AppShell({ children, eventId, title }: AppShellProps) {
  const [open, setOpen] = useState(false); const navigate = useNavigate(); const { pathname } = useLocation(); const { user, signOut } = useAuth(); const close = () => setOpen(false);
  const sidebar = <aside className="flex h-full w-[300px] flex-col bg-black px-4 pb-8 pt-8 text-white"><Link to="/dashboard" onClick={close} className="focus-ring mx-2"><Logo textClassName="text-white" markSize={28} className="text-white" /></Link><nav className="mt-9 flex flex-1 flex-col gap-6 overflow-y-auto pr-1"><div className="flex flex-col gap-1"><NavLink to="/dashboard" onClick={close} className={({ isActive }) => itemClass(isActive)}><LayoutDashboard size={18}/>Dashboard</NavLink><NavLink to="/events" onClick={close} className={({ isActive }) => itemClass(isActive)}><CalendarDays size={18}/>Events</NavLink></div>{eventId && <><div className="flex flex-col gap-1"><NavLink to={`/events/${eventId}/setup`} onClick={close} className={({ isActive }) => itemClass(isActive)}><Wand2 size={18}/>AI setup</NavLink><NavLink to={`/events/${eventId}/copilot`} onClick={close} className={({ isActive }) => itemClass(isActive)}><Sparkles size={18}/>Copilot</NavLink><NavLink to={`/events/${eventId}/vendors`} onClick={close} className={({ isActive }) => itemClass(isActive)}><Store size={18}/>Vendors</NavLink><NavLink to={`/events/${eventId}/procurement`} onClick={close} className={({ isActive }) => itemClass(isActive)}><Mail size={18}/>Procurement</NavLink></div><section><p className="mb-1 px-3 text-xs uppercase tracking-[.14em] text-white/40">Planning</p><div className="flex flex-col gap-1">{planningLinks.map(({ label, suffix, icon: Icon }) => <NavLink key={label} to={`/events/${eventId}${suffix}`} onClick={close} className={({ isActive }) => itemClass(isActive)}><Icon size={18}/>{label}</NavLink>)}</div></section></>}</nav><div className="mt-4 border-t border-white/10 pt-4"><button type="button" onClick={() => void signOut().then(() => navigate("/"))} className={itemClass(false)}><LogOut size={18}/>Sign out</button></div></aside>;
  return <div className="min-h-screen bg-black text-white"><div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{sidebar}</div>{open && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/60" onClick={close}/><div className="absolute inset-y-0 left-0">{sidebar}</div></div>}<main className="min-h-screen lg:pl-[300px]"><header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-white/10 bg-black/90 px-4 backdrop-blur sm:px-8"><button type="button" className="focus-ring rounded-full p-2 text-white lg:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu size={21}/></button>{eventId && <Link to="/events" className="focus-ring hidden items-center gap-1 text-sm text-white/55 sm:flex"><ChevronLeft size={16}/>Events</Link>}<div className="min-w-0 flex-1">{title && <p className="eccillo-section-title truncate">{title}</p>}{eventId && !title && <p className="truncate text-sm text-white/64">Event planning</p>}</div><FlowSwitch eventId={eventId} path={pathname} /><ThemeToggle /><Link to="/events/new" className="focus-ring inline-flex h-[37px] items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--accent)] px-4 font-[var(--font-data)] text-[13px] font-bold text-[var(--onAccent)] transition hover:opacity-[.82]"><Sparkles size={12}/><span className="hidden sm:inline">Create New Event</span></Link><span className="hidden max-w-32 truncate text-sm text-white/64 md:block">{user?.first_name || user?.email}</span></header><div className="mx-auto max-w-[1500px] p-4 sm:p-8">{children}</div></main></div>;
}
