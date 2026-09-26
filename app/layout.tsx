import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const lora = Lora({ subsets: ["latin"], display: "swap", variable: "--font-lora" });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });

const title = "The Shelf — Your Personal Bookshelf";
const description =
  "A beautiful online bookshelf to collect, organize, and share the books you love. Track what you're reading and show off your collection.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s — ${SITE_NAME}`,
  },
  description,
  keywords: [
    "online bookshelf",
    "book tracker",
    "reading tracker",
    "book collection app",
    "virtual bookshelf",
    "personal library",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" data-theme="light" className={`${lora.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <SessionProvider session={session}>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
