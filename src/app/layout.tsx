import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trading Dashboard',
  description: 'Real-time trading system dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen">
            <Header />
            <div className="flex">
              <aside className="hidden lg:block w-64 border-r min-h-[calc(100vh-4rem)]">
                <Sidebar />
              </aside>
              <main className="flex-1 p-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
