import type { Metadata } from 'next';
import './globals.css';
import { Lora } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import SessionProvider from '@/components/session-provider';
import { Toaster } from '@/components/ui/toaster';

const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

export const metadata: Metadata = {
  title: 'summarAIze',
  description: 'Intelligent summarization and document analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lora.variable} font-body antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
