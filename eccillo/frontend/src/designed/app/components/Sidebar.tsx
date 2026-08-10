import { useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  CalendarDays,
  GanttChartSquare,
  Wallet,
  CheckSquare,
  Calendar,
  AlertTriangle,
  MapPin,
  Handshake,
  Users,
  ShoppingCart,
  ClipboardList,
  ListChecks,
  Ticket,
  LogIn,
  QrCode,
  Bell,
  BarChart3,
  UsersRound,
  Building2,
  Megaphone,
  HeartHandshake,
  Mic,
  MessageSquare,
  FileText,
  CheckCircle2,
  UserCheck,
  DollarSign,
  MessageCircle,
  TrendingUp,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./Logo";
import { planningApi } from "../../../api/planning";

interface NavItem {
  label: string;
  icon: LucideIcon;
  route?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const TOP_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, route: "/dashboard" },
  { label: "Events", icon: CalendarDays, route: "/events" },
];

const GROUPS: NavGroup[] = [
  {
    label: "Planning",
    items: [
      { label: "Timeline", icon: GanttChartSquare, route: "/planning/timeline" },
      { label: "Budget", icon: Wallet, route: "/planning/budget" },
      { label: "Tasks", icon: CheckSquare, route: "/planning/tasks" },
      { label: "Calendar", icon: Calendar, route: "/planning/calendar" },
      { label: "Risks", icon: AlertTriangle, route: "/planning/risks" },
    ],
  },
  {
    label: "Find",
    items: [
      { label: "Vendor", icon: MapPin, route: "/find/vendors" },
      { label: "Sponsor", icon: Handshake, route: "/find/sponsors" },
      { label: "Talents", icon: Users, route: "/find/talent" },
    ],
  },
  {
    label: "Execute",
    items: [
      { label: "Procurement", icon: ShoppingCart, route: "/execute/procurement" },
      { label: "Registration", icon: ClipboardList, route: "/execute/registration" },
      { label: "Agenda", icon: ListChecks, route: "/execute/agenda" },
      { label: "Tickets", icon: Ticket, route: "/execute/tickets" },
      { label: "Check-in", icon: LogIn, route: "/execute/check-in" },
      { label: "QR", icon: QrCode, route: "/execute/check-in" },
      { label: "Notifications", icon: Bell, route: "/execute/notifications" },
      { label: "Live Polls", icon: BarChart3, route: "/execute/polls" },
    ],
  },
  {
    label: "Collaborate",
    items: [
      { label: "Internal Team", icon: UsersRound, route: "/collaborate" },
      { label: "Vendors", icon: Building2, route: "/collaborate" },
      { label: "Sponsors", icon: Megaphone, route: "/collaborate" },
      { label: "Volunteers", icon: HeartHandshake, route: "/collaborate" },
      { label: "Speakers", icon: Mic, route: "/collaborate" },
      { label: "Chat", icon: MessageSquare, route: "/collaborate" },
      { label: "Documents", icon: FileText, route: "/collaborate" },
      { label: "Approvals", icon: CheckCircle2, route: "/collaborate" },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Attendance", icon: UserCheck, route: "/insights" },
      { label: "Revenue", icon: DollarSign, route: "/insights" },
      { label: "Feedback", icon: MessageCircle, route: "/insights" },
      { label: "ROI", icon: TrendingUp, route: "/insights" },
      { label: "Sponsor Performance", icon: Trophy, route: "/insights" },
      { label: "Budget", icon: Wallet, route: "/insights" },
    ],
  },
];

interface SidebarProps {
  /** Currently active item label (falls back to route matching). */
  active?: string;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ active, open = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const events = useQuery({ queryKey: ["events"], queryFn: planningApi.listEvents });
  const eventIdInPath = location.pathname.match(/^\/events\/([^/]+)/)?.[1];
  const selectedEventId = events.data?.some((event) => event.id === eventIdInPath)
    ? eventIdInPath
    : events.data?.[0]?.id;
  const hasEvent = Boolean(selectedEventId);

  const routeFor = (item: NavItem) => {
    if (!item.route || item.route === "/dashboard" || item.route === "/events") return item.route;
    if (!selectedEventId) return "/events";
    return "/events/" + selectedEventId + item.route;
  };

  const isActive = (item: NavItem) => {
    const route = routeFor(item);
    if (route) return location.pathname === route;
    return active === item.label;
  };

  const handleClick = (item: NavItem) => {
    navigate(routeFor(item) ?? "/events");
    onClose?.();
  };

  const renderItem = (item: NavItem) => {
    const activeState = isActive(item);
    const Icon = item.icon;
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => handleClick(item)}
        className={`flex w-full items-center gap-[10px] rounded-[10px] px-3 py-2 text-left transition-colors font-['Helvetica_Now_Display:Regular',sans-serif] ${
          activeState
            ? "bg-white text-black"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
        <span className="truncate text-[15px]">{item.label}</span>
      </button>
    );
  };

  const content = (
    <div className="flex h-full w-full flex-col gap-8 overflow-y-auto bg-black px-4 pt-8 pb-10">
      <div className="flex items-center justify-between px-2">
        <Logo textClassName="text-white" markSize={28} className="text-white" />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-6" />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">{TOP_ITEMS.map(renderItem)}</div>
        {hasEvent && GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="px-3 pb-1 font-['Helvetica_Now_Display:Bold',sans-serif] text-[12px] uppercase tracking-wide text-white/40">
              {group.label}
            </p>
            {group.items.map(renderItem)}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-[300px] shrink-0 lg:block">{content}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
