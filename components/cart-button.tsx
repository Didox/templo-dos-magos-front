"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export default function CartButton() {
  const { totalItems, totalPrice } = useCart()

  return (
    <Link href="/cart">
      <Button className="bg-purple-700 hover:bg-purple-600 text-yellow-400 font-bold text-xl py-6 px-8 rounded-xl">
        VER CARRINHO {totalItems > 0 && `(${totalItems} itens - R${totalPrice.toFixed(2).replace(".", ",")})`}
      </Button>
    </Link>
  )
}
