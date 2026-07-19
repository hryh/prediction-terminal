import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prediction Terminal | AI-Powered Prediction Market Intelligence',
  description: 'The Bloomberg Terminal for prediction markets. AI-powered decision intelligence platform for Polymarket and Kalshi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-terminal-bg text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
