import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import ClientNav from "@/components/ClientNav"

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientNav />
        <main>{children}</main>
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm md:text-base">© <span suppressHydrationWarning>{new Date().getFullYear()}</span> The Byte Highlight. All rights reserved.</p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}
