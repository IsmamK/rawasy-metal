import './globals.css';
import Link from 'next/link';
import '../../polyfills'; // ✅ adjust path if polyfills.js is at project root

export const metadata = {
  title: 'Rawasy Metal',
  description: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
