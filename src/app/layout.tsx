import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}