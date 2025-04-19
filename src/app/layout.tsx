import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import ClientNav from "@/components/ClientNav"
import { ThemeProvider } from "@/components/theme-provider"
import { Zap } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Byte Highlight",
  description: "Your source for the latest tech news and insights",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ClientNav />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 sm:py-8 mt-8 sm:mt-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
                    BYTE HIGHLIGHT
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-md text-center px-4">
                  Delivering the latest tech insights and news straight to your inbox
                </p>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6 text-center">
                <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400">
                  © <span suppressHydrationWarning>{new Date().getFullYear()}</span> The Byte Highlight. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
