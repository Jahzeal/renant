import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Rent',
  description: 'Created with Next.js, Tailwind CSS, and Google Maps JavaScript API v3',
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://rent-example.vercel.app/'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${_geist.className} ${_geistMono.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}