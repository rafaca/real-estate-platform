import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "Castello - Luxury European Real Estate",
    template: "%s | Castello",
  },
  description:
    "Discover exceptional properties across Europe. Castello offers curated luxury real estate with personalized service and unparalleled expertise.",
  keywords: [
    "luxury real estate",
    "european properties",
    "premium homes",
    "luxury apartments",
    "exclusive estates",
    "castello international",
  ],
  authors: [{ name: "Castello International" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Castello",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Castello - Luxury European Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@castello",
  },
  metadataBase: new URL("https://castello.international"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Adobe Fonts / Typekit for Futura PT */}
        <link rel="stylesheet" href="https://use.typekit.net/your-kit-id.css" />
        {/* Fallback: Google Fonts alternative */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-accent-50">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
