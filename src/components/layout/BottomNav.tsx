import { Home, Calendar, BookOpen, Wrench } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Plan", icon: Calendar, href: "/plan/sunday" },
  { label: "Resources", icon: BookOpen, href: "/resources" },
  { label: "Tools", icon: Wrench, href: "/tools" },
];

interface BottomNavProps {
  pathname?: string;
}

export function BottomNav({ pathname = "/" }: BottomNavProps) {
  return (
    <nav className="bg-white/95 backdrop-blur-xl fixed bottom-0 left-0 z-50 w-full rounded-t-[2rem] px-4 pb-8 pt-4 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] border-t border-outline-variant/10">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-6 py-1 transition-all duration-200 active:scale-90",
                isActive 
                  ? "bg-secondary-container text-on-secondary-container rounded-full" 
                  : "text-on-surface-variant hover:text-secondary"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
              <span className="font-label-sm mt-0.5 text-[10px] font-medium">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
