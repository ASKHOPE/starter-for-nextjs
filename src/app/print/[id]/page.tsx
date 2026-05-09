"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDatabase } from '@/lib/offline-db';
import { Printer, ArrowLeft } from 'lucide-react';

export default function PrintAgenda() {
  const params = useParams();
  const router = useRouter();
  const [agenda, setAgenda] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgenda() {
      try {
        const db = await getDatabase();
        // Since params.id might be URL encoded
        const id = decodeURIComponent(params.id as string);
        const doc = await db.sundayAgendas.findOne(id).exec();
        if (doc) {
          setAgenda(doc.toJSON());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAgenda();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Loading printing layout...</div>;
  if (!agenda) return <div className="p-8 text-center text-red-500">Agenda not found.</div>;

  const dateStr = new Date(agenda.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 20mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}} />
      <div className="min-h-screen bg-white">
      {/* Non-printable header controls */}
      <div className="print:hidden p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-sky-600 transition-colors">
          <Printer size={16} /> Print Agenda
        </button>
      </div>

      {/* Printable Area */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 print:p-0">
        <div className="text-center mb-8 border-b-2 border-black pb-6">
          <h1 className="text-3xl font-black text-black uppercase tracking-widest">{agenda.title}</h1>
          <p className="text-lg text-gray-600 mt-2 font-medium">{dateStr}</p>
          <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Week {agenda.weekOfMonth} • {agenda.eventType}</p>
        </div>

        {/* Sacrament Meeting Section */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-black uppercase tracking-widest mb-4 border-b border-gray-300 pb-2">Sacrament Meeting</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Leadership</h3>
              <p className="text-base text-black mb-1"><span className="font-bold">Conducting:</span> {agenda.sacrament?.conducting || "TBD"}</p>
              <p className="text-base text-black mb-1"><span className="font-bold">Organist:</span> {agenda.sacrament?.organist || "TBD"}</p>
              <p className="text-base text-black"><span className="font-bold">Chorister:</span> {agenda.sacrament?.chorister || "TBD"}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Prayers</h3>
              <p className="text-base text-black mb-1"><span className="font-bold">Opening Prayer:</span> {agenda.sacrament?.prayers?.opening || "TBD"}</p>
              <p className="text-base text-black"><span className="font-bold">Closing Prayer:</span> {agenda.sacrament?.prayers?.closing || "TBD"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Ward Business</h3>
            <p className="text-base text-black italic">{agenda.sacrament?.business || "None"}</p>
          </div>

          <table className="w-full text-left border-collapse mb-8">
            <tbody>
              <tr className="border-b border-gray-200">
                <th className="py-3 w-1/4 text-sm font-bold text-gray-500 uppercase tracking-wider">Opening Hymn</th>
                <td className="py-3 text-base text-black font-medium">{agenda.sacrament?.hymns?.opening || "TBD"}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Sacrament Hymn</th>
                <td className="py-3 text-base text-black font-medium">{agenda.sacrament?.hymns?.sacrament || "TBD"}</td>
              </tr>
              
              {agenda.sacrament?.talks?.map((talk: any, idx: number) => (
                <React.Fragment key={idx}>
                  <tr className="border-b border-gray-200 bg-gray-50 print:bg-transparent">
                    <th className="py-3 text-sm font-bold text-gray-500 uppercase tracking-wider pl-4 print:pl-0">Speaker {idx + 1}</th>
                    <td className="py-3 text-base text-black font-bold">{talk.speaker || "TBD"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-xs font-medium text-gray-400 pl-4 print:pl-0">Topic</th>
                    <td className="py-2 text-sm text-gray-600 italic">{talk.topicReference || talk.talkReference || talk.customTopic || "TBD"}</td>
                  </tr>
                  {/* Insert intermediate hymn after second speaker if it exists */}
                  {idx === 1 && agenda.sacrament?.hymns?.intermediate && agenda.sacrament.hymns.intermediate !== "TBD" && (
                     <tr className="border-b border-gray-200">
                       <th className="py-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Intermediate Hymn</th>
                       <td className="py-3 text-base text-black font-medium">{agenda.sacrament.hymns.intermediate}</td>
                     </tr>
                  )}
                </React.Fragment>
              ))}

              <tr className="border-b border-gray-200">
                <th className="py-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Closing Hymn</th>
                <td className="py-3 text-base text-black font-medium">{agenda.sacrament?.hymns?.closing || "TBD"}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Second Hour Section */}
        {agenda.secondHour && (
          <section className="mb-10 page-break-inside-avoid">
            <h2 className="text-xl font-black text-black uppercase tracking-widest mb-4 border-b border-gray-300 pb-2">
               {agenda.secondHour.meetingType === 'SundaySchool' ? 'Sunday School' : agenda.secondHour.meetingType === 'PriesthoodRS' ? 'Priesthood & Relief Society' : 'Combined Meeting'}
            </h2>
            
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Class Structure</h3>
                <p className="text-base text-black mb-1"><span className="font-bold">Opening Hymn:</span> {agenda.secondHour.hymns?.opening || "TBD"}</p>
                <p className="text-base text-black mb-1"><span className="font-bold">Opening Prayer:</span> {agenda.secondHour.prayers?.opening || "TBD"}</p>
                <p className="text-base text-black"><span className="font-bold">Closing Prayer:</span> {agenda.secondHour.prayers?.closing || "TBD"}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Announcements</h3>
                <p className="text-base text-black italic">{agenda.secondHour.announcements || "None"}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 print:bg-transparent print:border-black">
              <p className="text-lg text-black mb-2"><span className="font-bold">Teacher / Instructor:</span> {agenda.secondHour.teacher || "TBD"}</p>
              <p className="text-base text-gray-700"><span className="font-bold text-gray-500 uppercase tracking-wider text-sm mr-2">Lesson Topic:</span> {agenda.secondHour.topicReference || "TBD"}</p>
            </div>
          </section>
        )}

        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400 print:block hidden">
          Generated by Gospel Agenda • Printed on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
    </>
  );
}
