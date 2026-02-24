import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tun Keltesch',
  description: 'Entrepreneur-focused AI engineer building products around negotiation, money, and visual AI through TK MEDIA.',
  icons: {
    icon: [
      { url: '/TK_Logo_alt.png', sizes: '32x32', type: 'image/png' },
      { url: '/TK_Logo_alt.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/TK_Logo_alt.png',
    shortcut: '/TK_Logo_alt.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Prevent dark mode flash: set body class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('lightMode')==='true'){document.documentElement.dataset.theme='light'}}catch(e){}})()`,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VGZ0RYLC5K"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VGZ0RYLC5K');
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
