import type { Metadata } from "next";
import "./app.css";

export const metadata: Metadata = {
  title: "Gospel Agenda | MyCalling PWA",
  description: "A super fast, lightweight communication PWA powered by Appwrite.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gospel Agenda",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Plus+Jakarta+Sans:wght@200;400;600;800&family=Poppins:wght@300;400&family=Outfit:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={"bg-[#f0f9ff] font-['Plus_Jakarta_Sans'] text-sm text-[#56565C]"}>
        {children}
      </body>
    </html>
  );
}
