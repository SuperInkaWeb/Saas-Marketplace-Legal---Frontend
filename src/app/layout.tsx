import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-slate-50 text-slate-900 font-['Inter',sans-serif]">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}