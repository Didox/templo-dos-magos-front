import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { SearchProvider } from "@/contexts/search-context"

const nunito = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Templo dos Magos",
  description: "Sua loja de cartas mágicas e jogos de tabuleiro",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={nunito.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CartProvider>
            <SearchProvider>{children}</SearchProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'