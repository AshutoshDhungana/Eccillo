import type { ReactNode } from "react";
import { AppShell as SharedAppShell } from "../../../components/AppShell";

interface AppShellProps {
  children: ReactNode;
  active?: string;
  title?: string;
}

/**
 * Compatibility wrapper for the supplied Dashboard and Events pages.
 * It deliberately delegates navigation to the same live shell as every workspace.
 */
export function AppShell({ children, title }: AppShellProps) {
  return <SharedAppShell title={title}>{children}</SharedAppShell>;
}
