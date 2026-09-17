import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What Do You See? — A shared imagination exercise",
  description: "Draw an original surreal card and share what you see with your team.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
