import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { cn } from "@workspace/ui/lib/utils"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://deessejs.com"),
  title: "DeesseJS",
  description:
    "The SaaS template that never sleeps. Ship your agents as your developers.",
  openGraph: {
    type: "website",
    siteName: "DeesseJS",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased", geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
