import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Amesi Improvement Union (AIU) | Community Portal",
  description: "Official portal of the Amesi Improvement Union (AIU). Connecting Amesi indigenes locally and globally, showcasing our rich heritage and cultural ancestry.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
