"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatarData, formatarPreco } from "@/lib/formatters"
import Image from "next/image"
import { Package } from "lucide-react"

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

interface PedidoDetalhesProps {
  pedido: Pedido
  onClose: () => void
}

export default function PedidoDetalhes({ pedido, onClose }: PedidoDetalhesProps) {
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

  // Função para formatar o método de pagamento
  const formatarFormaPagamento = (forma: string) => {
    switch (forma?.toLowerCase()) {
      case "cartao":
        return "Cartão de Crédito"
      case "boleto":
        return "Boleto Bancário"
      case "pix":
        return "PIX"
      default:
        return forma || "Não informado"
    }
  }

  // Converter string para número
  const converterParaNumero = (valor: string | undefined): number => {
    if (!valor) return 0
    return Number.parseFloat(valor.replace(/[^\d.,]/g, "").replace(",", ".")) || 0
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-purple-800 border-purple-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalhes do Pedido #{pedido.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do pedido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-purple-700/50 p-4 rounded-lg">
            <div>
              <p className="text-purple-300 text-sm">Data do Pedido</p>
              <p className="font-medium">{formatarData(pedido.criadoEm)}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(pedido.status)}`}>
                {pedido.status || "Pendente"}
              </span>
            </div>
            <div>
              <p className="text-purple-300 text-sm">Total</p>
              <p className="font-bold text-yellow-400">{formatarPreco(converterParaNumero(pedido.valorTotal))}</p>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="bg-purple-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">Informações Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-purple-300 text-sm">Forma de Pagamento</p>
                <p className="font-medium">{formatarFormaPagamento(pedido.formaPagamento)}</p>
              </div>
              {pedido.observacoes && (
                <div>
                  <p className="text-purple-300 text-sm">Observações</p>
                  <p className="font-medium">{pedido.observacoes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Itens do pedido */}
          <div>
            <h3 className="text-lg font-bold text-cyan-400 mb-3">Itens do Pedido</h3>
            <div className="space-y-3">
              {pedido.produtos && Array.isArray(pedido.produtos) && pedido.produtos.length > 0 ? (
                pedido.produtos.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-purple-700 p-3 rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={
                          item.produto && item.produto.urlImagem && item.produto.urlImagem.trim() !== ""
                            ? item.produto.urlImagem
                            : "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.produto ? item.produto.nome : "Produto"}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.produto ? item.produto.nome : "Produto"}</h4>
                      <p className="text-sm text-purple-300">
                        {formatarPreco(converterParaNumero(item.precoUnitario))} x {item.quantidade || 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">{formatarPreco(converterParaNumero(item.subtotal))}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-purple-300">Nenhum item encontrado para este pedido.</div>
              )}
            </div>
          </div>

          {/* Resumo do pedido */}
          <div className="bg-purple-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">Resumo</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-300">Subtotal:</span>
                <span>{formatarPreco(converterParaNumero(pedido.valorTotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="border-t border-purple-600 my-2"></div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-yellow-400">{formatarPreco(converterParaNumero(pedido.valorTotal))}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
