"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Minus, Plus, Trash2, ArrowLeft, SparklesIcon } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart()

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
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar às compras
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-yellow-400">Seu Carrinho Mágico</h1>
          </div>

          {items.length === 0 ? (
            <div className="bg-purple-800 rounded-2xl p-8 text-center shadow-lg border-2 border-purple-700">
              <div className="flex justify-center mb-4">
                <SparklesIcon className="h-16 w-16 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Seu carrinho está vazio</h2>
              <p className="text-purple-300 mb-6">Adicione alguns itens mágicos para começar sua jornada!</p>
              <Link href="/">
                <Button className="bg-cyan-400 hover:bg-cyan-500 text-purple-900 font-bold py-2 px-6 rounded-xl">
                  Explorar Produtos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-purple-800 rounded-2xl p-6 shadow-lg border-2 border-purple-700">
                  <h2 className="text-xl font-bold text-white mb-4">Itens do Carrinho ({totalItems})</h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-center gap-4 bg-purple-700 p-4 rounded-xl"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg?height=80&width=80"}
                            alt={item.title}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="flex-grow text-center sm:text-left">
                          <h3 className="font-bold text-white">{item.title}</h3>
                          <p className="text-cyan-400">R${item.price.toFixed(2).replace(".", ",")}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-purple-600 border-purple-500 text-white hover:bg-purple-500"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-8 text-center font-bold text-white">{item.quantity}</span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-purple-600 border-purple-500 text-white hover:bg-purple-500"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-purple-600"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="font-bold text-yellow-400 text-right min-w-[80px]">
                          R${(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-purple-800 rounded-2xl p-6 shadow-lg border-2 border-purple-700 sticky top-4">
                  <h2 className="text-xl font-bold text-white mb-4">Resumo do Pedido</h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-purple-300">
                      <span>Subtotal:</span>
                      <span>R${totalPrice.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between text-purple-300">
                      <span>Frete:</span>
                      <span>Grátis</span>
                    </div>
                    <div className="border-t border-purple-700 my-2"></div>
                    <div className="flex justify-between font-bold text-yellow-400 text-lg">
                      <span>Total:</span>
                      <span>R${totalPrice.toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-cyan-400 hover:bg-cyan-500 text-purple-900 font-bold py-6 rounded-xl">
                    FINALIZAR COMPRA
                  </Button>

                  <div className="mt-4 text-center">
                    <Link href="/">
                      <Button variant="link" className="text-cyan-400 hover:text-cyan-300">
                        Continuar comprando
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
