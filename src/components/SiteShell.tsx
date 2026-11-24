import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/demo", label: "Live prices" },
  { to: "/features", label: "Features" },
  { to: "/team", label: "Team" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
            <Sprout className="h-6 w-6" /> MarketMind
          </Link>
          <nav className="flex gap-1 overflow-x-auto text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground" activeProps={{ className: "bg-secondary text-foreground font-medium" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-secondary/50">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          MarketMind by Team AGRINYX · Prices from Agmarknet via data.gov.in. Decision support only — verify before selling.
        </div>
      </footer>
    </div>
  );
}
