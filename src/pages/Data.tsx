import { Link } from "react-router-dom";
import { CrmSidebar } from "@/components/crm/Sidebar";
import { ImportModule } from "@/components/crm/ImportModule";
import { LeadsDataTable } from "@/components/crm/LeadsDataTable";
import { ImportLog } from "@/components/crm/ImportLog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database } from "lucide-react";

const Data = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <CrmSidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-2">
                <ArrowLeft className="size-3.5" /> Voltar ao dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-elegant">
                  <Database className="size-5 text-navy-deep" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-primary">Gerenciamento de Dados</h1>
                  <p className="text-muted-foreground">Importe, edite e exporte sua base de leads</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ImportModule />
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            <div className="xl:col-span-3"><LeadsDataTable /></div>
            <div className="xl:col-span-1"><ImportLog /></div>
          </div>

          <footer className="mt-10 text-center text-xs text-muted-foreground">
            SonoCRM · Gestão inteligente de leads para lojas de colchões
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Data;
