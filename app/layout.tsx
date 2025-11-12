import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Roboto, Open_Sans, Source_Code_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { LayoutContent } from "./layout-content"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TeamFlow - AI Collaborative Platform",
  description: "Local-first collaborative platform with AI agents",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${jetbrainsMono.variable} ${sourceCodePro.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
