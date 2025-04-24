"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { Check } from "lucide-react"

interface ProductCardProps {
  id: number
  title: string
  price: number | string
  image: string
  color: string
}

export default function ProductCard({ id, title, price, image, color }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  // Converter o preço para número, caso seja uma string
  const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

  const handleAddToCart = () => {
    addToCart({ id, title, price: numericPrice, image })

    // Show visual feedback
    setIsAdding(true)
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  // Determinar a URL da imagem, usando um placeholder se estiver vazia ou inválida
  const imageUrl = image && image.trim() !== "" ? image : "/placeholder.svg?height=200&width=200"

  return (
    <div
      className={`${color} rounded-2xl p-4 shadow-lg border-2 border-opacity-50 border-purple-700 flex flex-col items-center`}
    >
      <div className="mb-2 relative w-full h-32">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-contain" />
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 text-yellow-300"
              style={{
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
              }}
            >
              ✦
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-xl font-bold text-center text-purple-900 mb-1">{title}</h3>
      <p className="text-xl font-bold text-center text-purple-900 mb-3">
        R${isNaN(numericPrice) ? "0,00" : numericPrice.toFixed(2).replace(".", ",")}
      </p>

      <Button
        className={`${
          isAdding ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
        } text-purple-900 font-bold rounded-xl px-6 transition-colors duration-300`}
        onClick={handleAddToCart}
      >
        {isAdding ? (
          <span className="flex items-center gap-1">
            <Check size={16} />
            ADICIONADO
          </span>
        ) : (
          "ADICIONAR"
        )}
      </Button>
    </div>
  )
}
