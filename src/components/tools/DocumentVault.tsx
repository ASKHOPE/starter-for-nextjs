import { motion } from "framer-motion";
import { ShieldCheck, File, Download, Search, MoreVertical, Upload } from "lucide-react";

const documents = [
  { name: "Ward Budget 2026.pdf", size: "1.2 MB", date: "Jan 15", type: "PDF" },
  { name: "Youth Calendar.xlsx", size: "450 KB", date: "Feb 02", type: "XLS" },
  { name: "Emergency Plan.docx", size: "890 KB", date: "Dec 10", type: "DOC" },
];

export function DocumentVault() {
  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Document Vault</h1>
          <p className="text-on-surface-variant mt-1">Secure organizational storage.</p>
        </div>
        <button className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-transform active:scale-95">
          <Upload className="h-6 w-6" />
        </button>
      </div>

      <div className="bg-surface-container-low flex items-center px-4 py-3 rounded-2xl border border-outline-variant/30">
        <Search className="h-5 w-5 text-outline" />
        <input type="text" placeholder="Search documents..." className="bg-transparent border-none focus:ring-0 w-full ml-2 text-sm" />
      </div>

      <div className="space-y-3">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-3xl flex items-center justify-between group hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                <File className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-sm">{doc.name}</h3>
                <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{doc.size} • {doc.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
