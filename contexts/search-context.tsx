"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface SearchContextType {
  searchTerm: string
  setSearchTerm: (term: string) => void
  handleSearch: (e: React.FormEvent) => void
  clearSearch: () => void
  isSearching: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Sincronizar o termo de busca com o parâmetro da URL apenas na inicialização
  // ou quando a URL mudar por navegação externa
  useEffect(() => {
    const search = searchParams.get("search")
    if (search) {
      setSearchTerm(search)
      setIsSearching(true)
    } else if (!searchParams.has("search")) {
      setSearchTerm("")
      setIsSearching(false)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Criar uma nova instância de URLSearchParams
    const params = new URLSearchParams(searchParams.toString())

    if (searchTerm.trim()) {
      // Adicionar ou atualizar o parâmetro de busca
      params.set("search", searchTerm.trim())
      setIsSearching(true)
    } else {
      // Se a busca estiver vazia, remover o parâmetro
      params.delete("search")
      setIsSearching(false)
    }

    // Construir a nova URL
    const newUrl = pathname + (params.toString() ? `?${params.toString()}` : "")
    router.push(newUrl)
  }

  const clearSearch = () => {
    // Forçar a limpeza do campo de busca imediatamente
    setSearchTerm("")
    setIsSearching(false)
  }

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        handleSearch,
        clearSearch,
        isSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
