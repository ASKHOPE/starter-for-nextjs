import { User, Bell } from "lucide-react";
import { useState } from "react";

export function TopAppBar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleAccount = () => {
    // Check if simple session exists in local storage for demo
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      window.location.href = "/profile";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <header className="bg-surface sticky top-0 z-40 w-full border-b border-outline-variant/10 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        {/* Title - Only visible on mobile/tablet, hidden on desktop where sidebar has it */}
        <h1 className="font-headline-lg text-xl font-black tracking-tighter text-primary md:hidden">
          MyChurchCalling
        </h1>
        
        {/* Spacer for desktop to push icons to the right */}
        <div className="hidden md:block flex-1" />

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="text-on-surface-variant hover:bg-surface-container-low rounded-full p-2 transition-colors"
          >
            <Bell className="h-6 w-6" />
          </button>
          
          <button 
            onClick={toggleAccount}
            className="text-primary hover:bg-surface-container-low rounded-full p-2 transition-colors border border-outline-variant/30"
          >
            <User className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
