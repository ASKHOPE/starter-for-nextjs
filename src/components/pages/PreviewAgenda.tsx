import { motion } from "framer-motion";
import { Printer, Share, Download, ChevronLeft, Loader2, Church, Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { actions } from "astro:actions";

const NEW_SCHEDULE_DATE = new Date("2026-09-06");

const isNewSchedule = (dateStr: string) => {
  return new Date(dateStr) >= NEW_SCHEDULE_DATE;
};

export function PreviewAgenda({ agendaId }: { agendaId: string }) {
  const [agenda, setAgenda] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await actions.getAgendas();
      if (data?.success) {
        const found = data.agendas.find((a: any) => a.$id === agendaId);
        if (found) {
          // Migration helper
          const migratedData = { ...found.data };
          if (!migratedData.secondHour && migratedData.classes) {
            migratedData.secondHour = {
              block1: migratedData.classes,
              block2: [],
              primary: { teacher: "Primary Presidency", topic: "Singing Time & Classes" }
            };
          }
          found.data = migratedData;
        }
        setAgenda(found);
      }
      setLoading(false);
    }
    load();
  }, [agendaId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-bold text-on-surface-variant">Preparing Preview...</p>
      </div>
    );
  }

  if (!agenda) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-primary">Agenda Not Found</h2>
        <a href="/" className="text-secondary font-bold hover:underline mt-4 inline-block">Return to Dashboard</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between no-print">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors">
          <ChevronLeft className="h-5 w-5" /> Back to Editor
        </button>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 text-primary hover:bg-surface-variant transition-colors">
            <Printer className="h-5 w-5" />
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-transform">
            <Share className="h-4 w-4" /> Share
          </button>
        </div>
      </div>

      {/* Program Paper Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white text-slate-900 shadow-2xl rounded-[1rem] overflow-hidden border border-slate-200 aspect-[1/1.4] p-12 md:p-20 flex flex-col items-center text-center space-y-12"
        id="printable-area"
      >
        <div className="space-y-4">
          <Church className="h-12 w-12 mx-auto text-slate-400" />
          <div className="space-y-1">
            <h1 className="text-3xl font-serif italic tracking-tight">{agenda.title}</h1>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-[0.2em]">The Church of Jesus Christ of Latter-day Saints</p>
          </div>
        </div>

        <div className="w-24 h-px bg-slate-200" />

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-600">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(agenda.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Oak Hills 4th Ward</span>
          </div>
        </div>

        <div className="w-full space-y-10 text-left max-w-lg mx-auto">
          {/* Leadership Section */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm border-b border-slate-100 pb-8">
            <ProgramLine label="Presiding" value={agenda.data.leadership.presiding} />
            <ProgramLine label="Conducting" value={agenda.data.leadership.conducting} />
            <ProgramLine label="Organist" value={agenda.data.leadership.organist} />
            <ProgramLine label="Chorister" value={agenda.data.leadership.chorister} />
          </div>

          {/* Announcements Section */}
          {agenda.data.program.announcements && (
            <div className="bg-slate-50 p-6 rounded-xl text-left space-y-2 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Announcements</span>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{agenda.data.program.announcements}</p>
            </div>
          )}

          {/* Program Section */}
          <div className="space-y-6">
            <ProgramLine label="Opening Hymn" value={agenda.data.program.openingHymn} centered />
            <ProgramLine label="Invocation" value="By Invitation" centered />
            <ProgramLine label="Ward Business" value="As Directed" centered />
            <ProgramLine label="Sacrament Hymn" value={agenda.data.program.sacramentHymn} centered />
            
            <div className="py-4 text-center italic text-slate-400 text-sm">
              The Administration of the Sacrament
            </div>

            {/* Dynamic Items */}
            {agenda.data.program.items?.map((item: any, i: number) => (
              <ProgramLine key={i} label={item.type} value={item.label} centered />
            ))}
            {/* Speakers */}
            <ProgramLine label="1st Speaker" value={agenda.data.program.speaker1} centered />
            <ProgramLine label="2nd Speaker" value={agenda.data.program.speaker2} centered />
            <ProgramLine label="3rd Speaker" value={agenda.data.program.speaker3} centered />

            <ProgramLine label="Closing Hymn" value={agenda.data.program.closingHymn} centered />
            <ProgramLine label="Benediction" value="By Invitation" centered />
          </div>

          {/* Second Hour Section */}
          <div className="pt-12 space-y-8">
            <div className="text-center">
              <div className="w-16 h-px bg-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-serif italic">Second Hour</h2>
            </div>

            <div className="space-y-6">
              {((agenda.data.secondHour?.override === 'new') || 
                (agenda.data.secondHour?.override === 'auto' || !agenda.data.secondHour?.override) && isNewSchedule(agenda.date)) ? (
                <>
                  {/* Block 1 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Block 1: Sunday School</span>
                      <span className="text-[10px] font-bold text-slate-400">25 Minutes</span>
                    </div>
                    {agenda.data.secondHour?.block1.map((cls: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700">{cls.name}</span>
                        <span className="text-slate-500 italic">{cls.teacher}</span>
                      </div>
                    ))}
                  </div>

                  {/* Block 2 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Block 2: Quorums & Classes</span>
                      <span className="text-[10px] font-bold text-slate-400">25 Minutes</span>
                    </div>
                    {agenda.data.secondHour?.block2.map((cls: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700">{cls.name}</span>
                        <span className="text-slate-500 italic">{cls.teacher}</span>
                      </div>
                    ))}
                  </div>

                  {/* Primary */}
                  <div className="bg-slate-50/50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-end border-b border-slate-200/50 pb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary</span>
                      <span className="text-[10px] font-bold text-slate-400">55 Minutes</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700">All Children</span>
                      <span className="text-slate-500 italic">{agenda.data.secondHour?.primary.teacher}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {agenda.data.classes?.map((cls: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{cls.name}</span>
                        <span className="text-[10px] text-slate-400">{cls.topic}</span>
                      </div>
                      <span className="text-slate-500 italic">{cls.teacher}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-12 text-[10px] text-slate-400 font-medium uppercase tracking-[0.1em] flex justify-between w-full border-t border-slate-100">
          <span>Oak Hills Stake • Zion Terrace Region</span>
          <div className="flex gap-4">
            {agenda.data.attendance?.beforeSacrament && <span>Before: {agenda.data.attendance.beforeSacrament}</span>}
            {agenda.data.attendance?.afterSacrament && <span>After: {agenda.data.attendance.afterSacrament}</span>}
          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #printable-area { 
            box-shadow: none !important; 
            border: none !important; 
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}} />
    </div>
  );
}

function ProgramLine({ label, value, centered }: any) {
  if (!value) return null;
  return (
    <div className={`flex flex-col ${centered ? 'items-center' : ''}`}>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  );
}
