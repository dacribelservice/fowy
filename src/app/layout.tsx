import type { Metadata } from "next";
import { Inter, Poppins, Nunito } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-poppins',
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: '--font-nunito',
});

// --- SEO & OPEN GRAPH CONFIGURATION (FASE 5.4) ---
export const metadata: Metadata = {
  title: "FOWY | El Futuro del Menú Digital en Cali",
  description: "Descubre los mejores locales de Cali, navega por menús digitales premium y pide por WhatsApp sin complicaciones. FOWY une a los mejores negocios con los mejores clientes.",
  keywords: ["Digital Menu", "Cali", "Restaurantes", "WhatsApp Order", "FOWY", "Marketplace"],
  authors: [{ name: "Dacribel Service" }],
  openGraph: {
    title: "FOWY - Digital Menu Marketplace",
    description: "Navega, elige y pide. La forma más rápida de disfrutar la ciudad.",
    url: 'https://fowy.app',
    siteName: 'FOWY',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'FOWY Digital Experience',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FOWY | Menú Digital Premium',
    description: 'La revolución de los pedidos por WhatsApp en Cali.',
    images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${poppins.variable} ${nunito.variable} antialiased selection:bg-red-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
