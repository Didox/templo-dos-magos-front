"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, ShoppingBag, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from "@/services/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatarData, formatarPreco } from "@/lib/formatters"
import PedidoDetalhes from "@/components/pedido-detalhes"

// Interface para os dados do pedido conforme o contrato da API
interface Produto {
  id: number
  nome: string
  preco: string
  descricao: string
  urlImagem: string
  categoriaId: number
  criadoEm: string
  atualizadoEm: string
}

interface ProdutoPedido {
  id: number
  pedidoId: number
  produtoId: number
  quantidade: number
  precoUnitario: string
  subtotal: string
  criadoEm: string
  atualizadoEm: string
  produto: Produto
}

interface Usuario {
  id: number
  nome: string
  sobrenome: string
  email: string
  // outros campos do usuário...
}

interface Pedido {
  id: number
  usuarioId: number
  valorTotal: string
  status: string
  formaPagamento: string
  observacoes: string
  criadoEm: string
  atualizadoEm: string
  usuario: Usuario
  produtos: ProdutoPedido[]
}

export default function MeusPedidosPage() {
  const { isAuthenticated, user, token } = useAuth()
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Buscar pedidos do usuário
  useEffect(() => {
    const fetchPedidos = async () => {
      if (!token || !user) return

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}/api/pedidos?usuario_id=${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao buscar pedidos: ${response.status}`)
        }

        const data = await response.json()
        setPedidos(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err)
        setError("Não foi possível carregar seus pedidos. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchPedidos()
    }
  }, [isAuthenticated, token, user])

  // Função para obter a classe de cor com base no status do pedido
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase() || "pendente") {
      case "pendente":
        return "bg-yellow-500/20 text-yellow-400"
      case "processando":
      case "em processamento":
        return "bg-blue-500/20 text-blue-400"
      case "enviado":
        return "bg-cyan-500/20 text-cyan-400"
      case "entregue":
        return "bg-green-500/20 text-green-400"
      case "cancelado":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-purple-500/20 text-purple-300"
    }
  }

  // Função para abrir os detalhes do pedido
  const verDetalhesPedido = (pedido: Pedido) => {
    setPedidoSelecionado(pedido)
  }

  // Função para fechar os detalhes do pedido
  const fecharDetalhesPedido = () => {
    setPedidoSelecionado(null)
  }

  // Calcular o total de itens em um pedido
  const calcularTotalItens = (produtos: ProdutoPedido[] | undefined) => {
    if (!produtos || !Array.isArray(produtos)) {
      return 0
    }
    return produtos.reduce((total, item) => total + (item.quantidade || 1), 0)
  }

  // Converter string para número
  const converterParaNumero = (valor: string | undefined): number => {
    if (!valor) return 0
    return Number.parseFloat(valor.replace(/[^\d.,]/g, "").replace(",", ".")) || 0
  }

  return (
    <main className="min-h-screen bg-purple-900 bg-opacity-95 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500 opacity-20"
            style={{
              width: Math.random() * 20 + 5 + "px",
              height: Math.random() * 20 + 5 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-purple-800">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à loja
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-yellow-400">Meus Pedidos</h1>
          </div>

          <div className="bg-purple-800 rounded-2xl p-6 shadow-lg border-2 border-purple-700">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Histórico de Pedidos</h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
                <span className="ml-2 text-white">Carregando seus pedidos...</span>
              </div>
            ) : error ? (
              <Alert className="bg-red-900/50 border-red-800 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : pedidos.length > 0 ? (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-purple-700 p-4 rounded-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-yellow-400" />
                          <span className="font-bold text-white">Pedido #{pedido.id}</span>
                        </div>
                        <p className="text-purple-300 text-sm">Data: {formatarData(pedido.criadoEm)}</p>
                      </div>

                      <div className="flex flex-col md:items-end">
                        <span className="text-white">
                          {calcularTotalItens(pedido.produtos)}{" "}
                          {calcularTotalItens(pedido.produtos) === 1 ? "item" : "itens"}
                        </span>
                        <span className="font-bold text-yellow-400">
                          {formatarPreco(converterParaNumero(pedido.valorTotal))}
                        </span>
                      </div>

                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(pedido.status)}`}>
                          {pedido.status || "Pendente"}
                        </span>
                      </div>

                      <Button
                        className="bg-cyan-400 hover:bg-cyan-500 text-purple-900 font-medium"
                        onClick={() => verDetalhesPedido(pedido)}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Nenhum pedido encontrado</h3>
                <p className="text-purple-300 mb-6">Você ainda não realizou nenhum pedido.</p>
                <Link href="/">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-purple-900 font-bold">
                    Começar a comprar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalhes do pedido */}
      {pedidoSelecionado && <PedidoDetalhes pedido={pedidoSelecionado} onClose={fecharDetalhesPedido} />}
    </main>
  )
}
