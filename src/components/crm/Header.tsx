import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CrmHeader = () => {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Sexta-feira, 25 de abril</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-primary">
          Bem-vinda, Eduarda <span className="text-gold">·</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Você tem <span className="text-primary font-medium">7 leads</span> aguardando resposta hoje.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lead, telefone…"
            className="pl-9 w-64 bg-card border-border rounded-xl"
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-xl border-border bg-card relative">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-gold" />
        </Button>
        <Button className="rounded-xl bg-primary hover:bg-navy-deep text-primary-foreground gap-2 shadow-elegant">
          <Plus className="size-4" /> Novo Lead
        </Button>
      </div>
    </header>
  );
};
