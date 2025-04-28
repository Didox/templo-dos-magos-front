"use client"

import { Suspense } from "react"
import PerfilPageContent from "./PerfilPageContent"

export default function PerfilPage() {
  return (
    <Suspense fallback={null}>
      <PerfilPageContent />
    </Suspense>
  )
}
