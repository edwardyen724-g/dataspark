import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DataSpark',
  description: 'Intuitive tools for data scientists to perform smart similarity searches and database updates.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar />
        <main className="flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Empower Your Data Analysis with Smart Searching Tools</h1>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}