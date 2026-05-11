import { motion } from "framer-motion";
import { Book, Music, MessageSquare, Search, ChevronRight, Sparkles, Bookmark, ArrowRight } from "lucide-react";

const studyResources = [
  {
    title: "General Conference",
    description: "Sacred words from living prophets and apostles.",
    icon: MessageSquare,
    color: "bg-blue-600",
    lightBg: "bg-blue-50",
    count: "April 2026",
    collection: "general_conference_talks"
  },
  {
    title: "Gospel Principles",
    description: "Core doctrine and foundational teachings.",
    icon: Sparkles,
    color: "bg-teal-600",
    lightBg: "bg-teal-50",
    count: "Reference",
    collection: "gospel_principles"
  },
  {
    title: "Old Testament",
    description: "The First Testament of Jesus Christ.",
    icon: Book,
    color: "bg-amber-700",
    lightBg: "bg-amber-50",
    count: "OT",
    collection: "scriptures",
    volume: "Old Testament"
  },
  {
    title: "New Testament",
    description: "The Life and Teachings of Jesus Christ.",
    icon: Book,
    color: "bg-orange-600",
    lightBg: "bg-orange-50",
    count: "NT",
    collection: "scriptures",
    volume: "New Testament"
  },
  {
    title: "Book of Mormon",
    description: "Another Testament of Jesus Christ.",
    icon: Book,
    color: "bg-indigo-700",
    lightBg: "bg-indigo-50",
    count: "BofM",
    collection: "scriptures",
    volume: "Book of Mormon"
  },
  {
    title: "Doctrine & Covenants",
    description: "Revelations for the modern era.",
    icon: Book,
    color: "bg-slate-700",
    lightBg: "bg-slate-50",
    count: "D&C",
    collection: "scriptures",
    volume: "Doctrine and Covenants"
  },
  {
    title: "Pearl of Great Price",
    description: "Sacred writings of prophets.",
    icon: Book,
    color: "bg-cyan-700",
    lightBg: "bg-cyan-50",
    count: "PoGP",
    collection: "scriptures",
    volume: "Pearl of Great Price"
  },
];

const musicResources = [
  {
    title: "Hymns",
    description: "Standard hymns for Church services.",
    icon: Music,
    color: "bg-emerald-600",
    lightBg: "bg-emerald-50",
    count: "341 Songs",
    collection: "hymns"
  },
  {
    title: "Children's Hymns",
    description: "Sacred music for Primary children.",
    icon: Sparkles,
    color: "bg-rose-500",
    lightBg: "bg-rose-50",
    count: "200+ Songs",
    collection: "childrens_songbook"
  },
  {
    title: "New Hymns",
    description: "Recent additions to the global hymnbook.",
    icon: Music,
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    count: "New Releases",
    collection: "new_hymns"
  },
  {
    title: "Music",
    description: "Youth music and inspirational tracks.",
    icon: Music,
    color: "bg-indigo-500",
    lightBg: "bg-indigo-50",
    count: "Latest Tracks",
    collection: "youth_music"
  },
];

export function ResourcesHub() {
  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col items-center text-center gap-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">Sacred Resources</h1>
        </div>
        <div className="max-w-xl w-full">
          <div className="bg-surface-container-low flex items-center px-6 py-5 rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-slate-200/50 focus-within:ring-4 focus-within:ring-secondary/10 transition-all">
            <Search className="h-6 w-6 text-outline" />
            <input type="text" placeholder="Search the library..." className="bg-transparent border-none focus:ring-0 w-full ml-4 text-base font-medium" />
          </div>
        </div>
      </div>


      {/* Music & Hymns Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-1.5 bg-secondary rounded-full" />
          <h2 className="text-2xl font-black text-primary tracking-tight uppercase italic">Music & Hymns</h2>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {musicResources.map((item, i) => (
            <motion.a
              key={item.title}
              href={`/resources/list?collection=${item.collection}&title=${encodeURIComponent(item.title)}${(item as any).volume ? `&volume=${encodeURIComponent((item as any).volume)}` : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container-lowest group flex cursor-pointer items-center gap-6 rounded-[2rem] border border-outline-variant/30 p-6 transition-all hover:shadow-2xl hover:shadow-slate-200/60"
            >
              <div className={`${item.color} rounded-2xl p-5 text-white shadow-xl shadow-current/20 group-hover:scale-110 transition-transform`}>
                <item.icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-xl text-primary tracking-tight">{item.title}</h3>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">{item.description}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest">{item.count}</span>
                <div className="bg-surface p-2 rounded-full text-outline group-hover:text-primary group-hover:bg-secondary-container/20 transition-all">
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.a>
          ))}
        </section>
      </div>

      {/* Study Resources Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-1.5 bg-primary rounded-full" />
          <h2 className="text-2xl font-black text-primary tracking-tight uppercase italic">Gospel Study</h2>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyResources.map((item, i) => (
            <motion.a
              key={item.title}
              href={`/resources/list?collection=${item.collection}&title=${encodeURIComponent(item.title)}${(item as any).volume ? `&volume=${encodeURIComponent((item as any).volume)}` : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + musicResources.length) * 0.1 }}
              className="bg-surface-container-lowest group flex cursor-pointer items-center gap-6 rounded-[2rem] border border-outline-variant/30 p-6 transition-all hover:shadow-2xl hover:shadow-slate-200/60"
            >
              <div className={`${item.color} rounded-2xl p-5 text-white shadow-xl shadow-current/20 group-hover:scale-110 transition-transform`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-lg text-primary tracking-tight">{item.title}</h3>
                <p className="text-on-surface-variant text-xs font-medium line-clamp-1">{item.description}</p>
              </div>
              <div className="bg-surface p-2 rounded-full text-outline group-hover:text-primary transition-all">
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.a>
          ))}
        </section>
      </div>
    </div>
  );
}
