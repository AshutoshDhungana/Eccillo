import { Settings, User, Menu } from "lucide-react";

interface TopbarProps {
  onMenuClick?: () => void;
  title?: string;
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const iconBtn =
    "flex size-10 items-center justify-center rounded-full bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-white/10 px-4 sm:px-6">
      {title && (
        <span className="flex-1 font-['Lora:Regular',serif] text-[22px] text-white">
          {title}
        </span>
      )}
      <div className={`flex items-center gap-3 ${title ? "" : "ml-auto"}`}>
        <button type="button" className={iconBtn} aria-label="Settings">
          <Settings className="size-5" strokeWidth={1.75} />
        </button>
        <button type="button" className={iconBtn} aria-label="Profile">
          <User className="size-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className={`${iconBtn} lg:hidden`}
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
