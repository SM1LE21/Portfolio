import type { Metadata } from 'next'
import './globals.css'
import './index.css'
import ChatInterface from '../components/ChatInterface'

export const metadata: Metadata = {
  title: 'Tun Keltesch - Portfolio',
  description: 'Project Engineer | Software Engineer - I build robust, user-friendly, and visually appealing web and mobile solutions, with a passion for continuous technical innovation.',
  icons: {
    icon: '/TK_Logo_alt.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
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
        <ChatInterface />
      </body>
    </html>
  )
}
