import { motion } from "framer-motion";
import { ChevronLeft, Search, Loader2, ExternalLink, BookOpen, Music, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { actions } from "astro:actions";

export function LibraryList({ collection, title, volume }: { collection: string, title: string | null, volume?: string | null }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [collection, volume]);

  async function load(query = "") {
    setLoading(true);
    setError(null);
    const { data } = await actions.getLibraryItems({ 
      collection: collection as any, 
      search: query,
      volume: volume || undefined
    });
    if (data?.success) {
      setItems(data.items);
    } else {
      setError(data?.error || "Failed to load content.");
    }
    setLoading(false);
  }

  const getIcon = () => {
    if (collection.includes('hymn')) return Music;
    if (collection.includes('talk')) return MessageSquare;
    return BookOpen;
  };

  const Icon = getIcon();

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest mb-2 hover:translate-x-[-4px] transition-transform">
            <ChevronLeft className="h-3 w-3" /> Back to Library
          </button>
          <h1 className="text-4xl font-black text-primary tracking-tight">{title || "Library Content"}</h1>
        </div>
        
        <div className="max-w-md w-full">
          <div className="bg-surface-container-low flex items-center px-5 py-4 rounded-2xl border border-outline-variant/30 shadow-sm focus-within:shadow-md transition-shadow">
            <Search className="h-5 w-5 text-outline" />
            <input 
              type="text" 
              placeholder={`Search in ${title}...`} 
              className="bg-transparent border-none focus:ring-0 w-full ml-3 text-sm font-medium" 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.length === 0 || e.target.value.length > 2) {
                    load(e.target.value);
                }
              }}
            />
          </div>
        </div>
      </div>



      {error ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-[2rem] text-center">
          <p className="text-red-600 font-bold mb-2">Error Loading Content</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-secondary" />
          <p className="mt-4 font-bold text-on-surface-variant uppercase tracking-widest text-xs">Loading Sacred Content...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.a
              key={item.$id}
              href={item.url}
              target="_blank"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-surface-container-lowest group p-6 rounded-[2rem] border border-outline-variant/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-surface-container-low p-3 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                {item.number && (
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest">#{item.number}</span>
                )}
              </div>
              <h3 className="font-bold text-primary mb-2">{item.title}</h3>
              {collection === 'scriptures' && item.content && (
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-4 italic leading-relaxed">
                  "{item.content}"
                </p>
              )}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest">
                  Read More <ExternalLink className="h-3 w-3" />
                </div>
                {item.book && (
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">{item.book}</span>
                )}
              </div>
            </motion.a>
          ))}
          {items.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-on-surface-variant font-bold">No content found in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
