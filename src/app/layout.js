import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Study Progress',
  description: 'Manage study topics, theory notes, code examples, and study progress with a premium developer workflow.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#070B16] text-[#F8FAFC] font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
