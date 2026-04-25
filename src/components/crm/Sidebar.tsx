import { LayoutDashboard, Users, MessageCircle, BarChart3, Database, Settings, LogOut, Moon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Leads", icon: Users, to: "/dados", badge: 24 },
  { label: "Conversas", icon: MessageCircle, to: "#", badge: 7 },
  { label: "Dados & Planilhas", icon: Database, to: "/dados" },
  { label: "Relatórios", icon: BarChart3, to: "#" },
];

export const CrmSidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="size-9 rounded-xl bg-gradient-gold flex items-center justify-center shadow-elegant">
          <Moon className="size-4 text-navy-deep" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-semibold tracking-tight text-primary-foreground">SonoCRM</p>
          <p className="text-[11px] text-sidebar-foreground/60">Colchões Premium</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="px-3 pb-2 pt-2 text-[10px] uppercase tracking-widest text-sidebar-foreground/50">Principal</p>
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.to !== "#" && pathname === item.to;
          const Wrapper = item.to === "#" ? "button" : NavLink;
          const props = item.to === "#" ? {} : { to: item.to };
          return (
            <Wrapper
              key={item.label}
              {...(props as { to: string })}
              className={cn(
                "w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-primary-foreground shadow-soft"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-primary-foreground"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className={cn("size-[18px]", active && "text-gold")} />
                {item.label}
              </span>
              {item.badge && (
                <span className="text-[11px] font-semibold bg-gold text-navy-deep rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </Wrapper>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-primary-foreground transition-colors">
          <Settings className="size-[18px]" /> Configurações
        </button>
        <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-primary-foreground transition-colors">
          <LogOut className="size-[18px]" /> Sair
        </button>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3">
          <div className="size-9 rounded-full bg-gradient-gold flex items-center justify-center text-navy-deep font-semibold text-sm">
            EM
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary-foreground truncate">Eduarda Mendes</p>
            <p className="text-[11px] text-sidebar-foreground/60 truncate">Consultora Senior</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
