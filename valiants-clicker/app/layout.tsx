import type { Metadata } from 'next'
import { Fugaz_One, Open_Sans } from 'next/font/google'
import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['500', '400', '600', '700', '800'],
  variable: '--font-open-sans',
})

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'], variable: '--font-fugaz-one' })

export const metadata: Metadata = {
  title: 'Valiant - ETH Chile',
  description: 'Valiant es una plataforma de juegos de estrategia basada en blockchain.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${openSans.variable} ${fugaz.variable} `}>{children}</body>
    </html>
  )
}
