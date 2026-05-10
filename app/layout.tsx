import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Humor Study — Vote on Captions",
  description: "Vote on AI-generated captions and help power humor research.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
