import { CrmSidebar } from "@/components/crm/Sidebar";
import { CrmHeader } from "@/components/crm/Header";
import { KpiCards } from "@/components/crm/KpiCards";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { Funnel } from "@/components/crm/Funnel";
import { Conversations } from "@/components/crm/Conversations";
import { SourceSplit } from "@/components/crm/SourceSplit";

const Index = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <CrmSidebar />

      <main className="flex-1 min-w-0">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">
          <CrmHeader />
          <KpiCards />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2">
              <LeadsTable />
            </div>
            <div className="space-y-6">
              <SourceSplit />
              <Conversations />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-card rounded-2xl border border-border shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-primary">Atividade Semanal</h2>
                  <p className="text-sm text-muted-foreground">Leads recebidos por dia</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gold"/>Instagram</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success"/>WhatsApp</span>
                </div>
              </div>
              <WeeklyChart />
            </div>
            <Funnel />
          </div>

          <footer className="mt-10 text-center text-xs text-muted-foreground">
            SonoCRM · Gestão inteligente de leads para lojas de colchões
          </footer>
        </div>
      </main>
    </div>
  );
};

const data = [
  { d: "Seg", i: 14, w: 10 },
  { d: "Ter", i: 22, w: 16 },
  { d: "Qua", i: 18, w: 12 },
  { d: "Qui", i: 28, w: 20 },
  { d: "Sex", i: 34, w: 24 },
  { d: "Sáb", i: 42, w: 28 },
  { d: "Dom", i: 18, w: 14 },
];

const WeeklyChart = () => {
  const max = Math.max(...data.map((x) => x.i + x.w));
  return (
    <div className="flex items-end justify-between gap-3 h-56">
      {data.map((day) => {
        const iH = (day.i / max) * 100;
        const wH = (day.w / max) * 100;
        return (
          <div key={day.d} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center gap-1 h-full">
              <div
                className="w-1/2 max-w-[18px] rounded-t-md bg-gold/90 hover:bg-gold transition-all"
                style={{ height: `${iH}%` }}
                title={`Instagram: ${day.i}`}
              />
              <div
                className="w-1/2 max-w-[18px] rounded-t-md bg-success/90 hover:bg-success transition-all"
                style={{ height: `${wH}%` }}
                title={`WhatsApp: ${day.w}`}
              />
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">{day.d}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Index;
