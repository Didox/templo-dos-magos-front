import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/services/api"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Encaminhar a requisição para a API real
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    // Obter os dados da resposta
    const data = await response.json().catch(() => null)

    // Retornar a resposta com o mesmo status
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
