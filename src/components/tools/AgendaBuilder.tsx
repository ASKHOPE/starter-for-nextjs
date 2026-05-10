import { Plus, Search, Calendar, ChevronRight, Clock, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { actions } from "astro:actions";

export function AgendaBuilder() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await actions.getAgendas();
      if (data?.success) {
        setAgendas(data.agendas);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }
  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Agenda Builder</h1>
          <p className="text-on-surface-variant mt-1">Manage and create service programs.</p>
        </div>
        <a href="/plan/sunday" className="bg-secondary text-on-secondary p-4 rounded-2xl shadow-lg shadow-secondary/20 transition-transform active:scale-95">
          <Plus className="h-6 w-6" />
        </a>
      </div>

      <div className="bg-surface-container-low flex items-center px-4 py-3 rounded-2xl border border-outline-variant/30">
        <Search className="h-5 w-5 text-outline" />
        <input type="text" placeholder="Search agendas..." className="bg-transparent border-none focus:ring-0 w-full ml-2 text-sm" />
      </div>

      <div className="space-y-4">
        {agendas.map((item, i) => (
          <a
            key={item.$id}
            href={`/plan/sunday?id=${item.$id}`}
            className="bg-surface-container-lowest border border-outline-variant/20 p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-2xl text-secondary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary">{item.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(item.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Draft</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-outline group-hover:translate-x-1 transition-transform" />
          </a>
        ))}
      </div>
    </div>
  );
}
