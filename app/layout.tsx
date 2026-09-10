import "./globals.css";

export const metadata = {
  title: "Marketplace3D",
  description: "3D model marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}