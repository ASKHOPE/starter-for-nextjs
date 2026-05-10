import { motion } from "framer-motion";
import { Settings, Bell, Shield, Moon, Globe, ChevronRight } from "lucide-react";

const settingGroups = [
  { title: "Notifications", description: "Agenda alerts and reminders", icon: Bell, color: "text-rose-600" },
  { title: "Privacy & Security", description: "Two-factor and data access", icon: Shield, color: "text-blue-600" },
  { title: "Appearance", description: "Dark mode and accent colors", icon: Moon, color: "text-indigo-600" },
  { title: "Localization", description: "Language and time zone", icon: Globe, color: "text-emerald-600" },
];

export function AppSettings() {
  return (
    <div className="space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-bold text-primary">App Settings</h1>
        <p className="text-on-surface-variant mt-1">Customize your platform experience.</p>
      </div>

      <div className="space-y-2">
        {settingGroups.map((group, i) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-container-lowest border border-outline-variant/20 p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`${group.color} bg-white p-3 rounded-2xl shadow-sm border border-outline-variant/10 group-hover:scale-110 transition-transform`}>
                <group.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-sm">{group.title}</h3>
                <p className="text-[10px] text-on-surface-variant font-medium">{group.description}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-outline opacity-50" />
          </motion.div>
        ))}
      </div>

      <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/20 mt-8">
        <h2 className="text-sm font-bold text-primary mb-4">About MyChurchCalling</h2>
        <div className="flex justify-between text-xs text-on-surface-variant mb-2">
          <span>Version</span>
          <span className="font-bold text-primary">2.4.0 (Astro)</span>
        </div>
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Build ID</span>
          <span className="font-mono">8cb91eb2</span>
        </div>
      </div>
    </div>
  );
}
