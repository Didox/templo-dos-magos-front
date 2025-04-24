"use client"

import type React from "react"

import { Search, User, ShoppingCart, ShoppingBag, LogOut, Sparkles, X, LogIn } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"
import { useSearch } from "@/contexts/search-context"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Header() {
  const { totalItems } = useCart()
  const { searchTerm, setSearchTerm, handleSearch, clearSearch } = useSearch()
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleClearSearch = () => {
    // Limpar o estado interno
    clearSearch()

    // Redirecionar para a página inicial
    router.push("/")
  }

  // Garantir que a URL do logo seja válida
  const logoUrl = "/logo-wizard.png"

  return (
    <header className="bg-purple-800 border-b-2 border-purple-700 rounded-b-xl shadow-lg p-4 relative z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/">
            <div className="flex items-center">
              <div className="w-14 h-14 relative mr-2">
                <Image
                  src={logoUrl || "/placeholder.svg"}
                  alt="Mago"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-yellow-400 text-2xl md:text-3xl font-bold tracking-wide">
                  TEMPLO
                  <span className="block md:inline text-cyan-400 text-xl md:text-3xl">DOS MAGOS</span>
                </h1>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
            <Input
              placeholder="Buscar..."
              className="pl-10 pr-10 bg-purple-700 border-purple-600 text-white placeholder:text-purple-300 rounded-full"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" />

            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button type="submit" className="sr-only">
              Buscar
            </button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full p-2 h-10 w-10 text-cyan-400 hover:text-cyan-300 hover:bg-purple-700"
              >
                <User size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-purple-800 border-purple-600 text-white"
              sideOffset={8}
              align="end"
              forceMount
            >
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2 text-yellow-400">
                    <Sparkles size={16} className="text-yellow-400" />
                    <span>Olá, {user?.nome || "Mago"}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-600" />
                  <DropdownMenuItem className="hover:bg-purple-700 cursor-pointer flex items-center gap-2">
                    <User size={16} className="text-cyan-400" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-purple-700 cursor-pointer flex items-center gap-2">
                    <ShoppingBag size={16} className="text-cyan-400" />
                    <span>Meus Pedidos</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-purple-600" />
                  <DropdownMenuItem
                    className="hover:bg-purple-700 cursor-pointer flex items-center gap-2 text-red-400"
                    onClick={logout}
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2 text-yellow-400">
                    <Sparkles size={16} className="text-yellow-400" />
                    <span>Portal Mágico</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-600" />
                  <Link href="/login">
                    <DropdownMenuItem className="hover:bg-purple-700 cursor-pointer flex items-center gap-2">
                      <LogIn size={16} className="text-cyan-400" />
                      <span>Entrar</span>
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative">
            <Link href="/cart">
              <Button
                variant="ghost"
                className="rounded-full p-2 h-10 w-10 text-cyan-400 hover:text-cyan-300 hover:bg-purple-700"
              >
                <ShoppingCart size={24} />
              </Button>
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-yellow-400 text-purple-900 font-bold border-none">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
