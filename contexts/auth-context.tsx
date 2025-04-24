"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { login as apiLogin } from "@/services/api"

interface User {
  id: number
  nome: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  tokenType: string | null
  expiresAt: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    tokenType: null,
    expiresAt: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const storedAuth = localStorage.getItem("templo-dos-magos-auth")
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth) as AuthState
        setAuthState(parsedAuth)
      } catch (error) {
        console.error("Erro ao analisar dados de autenticação:", error)
        localStorage.removeItem("templo-dos-magos-auth")
      }
    }
    setIsLoading(false)
  }, [])

  // Função para extrair informações do token JWT
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Erro ao decodificar token JWT:", error)
      return null
    }
  }

  const login = async (email: string, senha: string) => {
    try {
      setIsLoading(true)

      // Usar a função de login do serviço de API
      const loginResponse = await apiLogin(email, senha)

      if (!loginResponse.token) {
        return {
          success: false,
          message: "Token não encontrado na resposta. Por favor, tente novamente.",
        }
      }

      // Extrair informações do usuário do token JWT
      const tokenPayload = parseJwt(loginResponse.token)

      if (!tokenPayload) {
        return {
          success: false,
          message: "Token inválido. Por favor, tente novamente.",
        }
      }

      // Criar objeto de estado de autenticação
      const newAuthState: AuthState = {
        user: {
          id: tokenPayload.sub,
          nome: tokenPayload.nome,
          email: tokenPayload.email,
        },
        token: loginResponse.token,
        tokenType: loginResponse.type,
        expiresAt: loginResponse.expires_at,
      }

      // Salvar dados de autenticação no localStorage
      localStorage.setItem("templo-dos-magos-auth", JSON.stringify(newAuthState))
      setAuthState(newAuthState)

      return { success: true }
    } catch (error) {
      console.error("Erro durante o login:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro durante o login. Tente novamente mais tarde."
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("templo-dos-magos-auth")
    setAuthState({
      user: null,
      token: null,
      tokenType: null,
      expiresAt: null,
    })
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!authState.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
