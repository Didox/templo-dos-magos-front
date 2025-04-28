"use client"

import { Suspense } from "react"
import CartPageContent from "./CartPageContent"

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <CartPageContent />
    </Suspense>
  )
}
