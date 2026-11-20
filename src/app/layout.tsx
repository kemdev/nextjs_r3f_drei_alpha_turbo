
import SceneCanvas from '@/components/three/SceneCanvas';
import "@/styles/globals.css";
import Navbar from "@/ui/Navbar";

export const metadata = {
  title: "Three.js Boilerplate",
  description: "WebGPU TSL and standard material examples in Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Navbar />
        <main className="app-main">
            {children}
        </main>
      </body>
    </html>
  );
}
