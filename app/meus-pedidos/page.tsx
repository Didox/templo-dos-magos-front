"use client"

import { Suspense } from "react"
import MeusPedidosPageContent from "./MeusPedidosPageContent"

export default function MeusPedidosPage() {
  return (
    <Suspense fallback={null}>
      <MeusPedidosPageContent />
    </Suspense>
  )
}
