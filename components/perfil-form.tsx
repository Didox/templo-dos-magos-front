"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Save } from "lucide-react"
import { API_BASE_URL } from "@/services/api"

interface PerfilData {
  nome: string
  sobrenome: string
  documento: string
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  email: string
}

export default function PerfilForm() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<PerfilData>({
    nome: "",
    sobrenome: "",
    documento: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    email: "",
  })
  const [isCepLoading, setIsCepLoading] = useState(false)

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !user) return

      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/usuarios/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Erro ao carregar dados do usuário")
        }

        const userData = await response.json()
        setFormData({
          nome: userData.nome || "",
          sobrenome: userData.sobrenome || "",
          documento: userData.documento || "",
          cep: userData.cep || "",
          endereco: userData.endereco || "",
          numero: userData.numero || "",
          complemento: userData.complemento || "",
          bairro: userData.bairro || "",
          cidade: userData.cidade || "",
          estado: userData.estado || "",
          email: userData.email || "",
        })
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err)
        setError("Não foi possível carregar seus dados. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [token, user])

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    if (!cep || cep.length !== 8) return

    try {
      setIsCepLoading(true)
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

      if (!response.ok) {
        throw new Error("CEP não encontrado")
      }

      const data = await response.json()

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado e tente novamente.",
          className: "bg-red-800 border-red-700 text-white",
        })
        return
      }

      // Atualizar os campos de endereço
      setFormData((prev) => ({
        ...prev,
        endereco: data.logradouro || prev.endereco,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
      }))
    } catch (err) {
      console.error("Erro ao buscar CEP:", err)
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço pelo CEP informado.",
        className: "bg-red-800 border-red-700 text-white",
      })
    } finally {
      setIsCepLoading(false)
    }
  }

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Se for o campo CEP, remover caracteres não numéricos
    if (name === "cep") {
      const cepNumerico = value.replace(/\D/g, "")
      setFormData((prev) => ({ ...prev, [name]: cepNumerico }))

      // Se o CEP tiver 8 dígitos, buscar o endereço
      if (cepNumerico.length === 8) {
        buscarEnderecoPorCep(cepNumerico)
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Função para salvar os dados do perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !user) return

    try {
      setIsSaving(true)
      setError(null)

      // Criar objeto com os dados a serem enviados (excluindo o email)
      const dadosParaEnviar = { ...formData }
      delete dadosParaEnviar.email

      const response = await fetch(`${API_BASE_URL}/api/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao atualizar perfil")
      }

      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram atualizados com sucesso!",
        className: "bg-green-800 border-green-700 text-white",
      })
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err)
      setError("Não foi possível atualizar seus dados. Tente novamente mais tarde.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        <span className="ml-2 text-white">Carregando seus dados...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert className="mb-6 bg-red-900/50 border-red-800 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-purple-300">
            Nome
          </Label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="bg-purple-700 border-purple-600 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sobrenome" className="text-purple-300">
            Sobrenome
          </Label>
          <Input
            id="sobrenome"
            name="sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
            className="bg-purple-700 border-purple-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documento" className="text-purple-300">
            CPF/CNPJ
          </Label>
          <Input
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className="bg-purple-700 border-purple-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-purple-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            className="bg-purple-700 border-purple-600 text-white opacity-70"
            disabled
          />
          <p className="text-xs text-purple-400">O email não pode ser alterado</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cep" className="text-purple-300">
            CEP
          </Label>
          <div className="relative">
            <Input
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              maxLength={8}
              className="bg-purple-700 border-purple-600 text-white"
              placeholder="Somente números"
            />
            {isCepLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400 animate-spin" />
            )}
          </div>
          <p className="text-xs text-purple-400">Digite o CEP para buscar o endereço automaticamente</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco" className="text-purple-300">
            Endereço
          </Label>
          <Input
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            className="bg-purple-700 border-purple-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero" className="text-purple-300">
            Número
          </Label>
          <Input
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            className="bg-purple-700 border-purple-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="complemento" className="text-purple-300">
            Complemento
          </Label>
          <Input
            id="complemento"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
            className="bg-purple-700 border-purple-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bairro" className="text-purple-300">
            Bairro
          </Label>
          <Input
            id="bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            className="bg-purple-700 border-purple-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade" className="text-purple-300">
            Cidade
          </Label>
          <Input
            id="cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            className="bg-purple-700 border-purple-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado" className="text-purple-300">
            Estado
          </Label>
          <Input
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            maxLength={2}
            className="bg-purple-700 border-purple-600 text-white"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-purple-900 font-bold"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar Alterações
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
