import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icono aboghub.png" />
        <link rel="apple-touch-icon" href="/icono aboghub.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;500;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
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