// Tipos de dados da API
export interface Categoria {
  id: number
  nome: string
  slug: string
  cor: string
  criadoEm?: string
  atualizadoEm?: string
}

export interface Produto {
  id: number
  nome: string
  preco: number | string
  descricao: string
  urlImagem: string
  categoriaId: number
  criadoEm?: string
  atualizadoEm?: string
  categoria?: Categoria
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta
  data: T[]
}

// URLs da API
export const API_BASE_URL = "https://templo-dos-magos-api-80fee8432048.herokuapp.com"
const CATEGORIAS_URL = `${API_BASE_URL}/api/categorias` // Corrigido para incluir /api
const PRODUTOS_URL = `${API_BASE_URL}/api/produtos` // Corrigido para incluir /api
const AUTH_URL = `${API_BASE_URL}/api/auth/login`

// Interface para resposta de login
export interface LoginResponse {
  type: string
  token: string
  expires_at: string
}

// Função para login
export async function login(email: string, senha: string): Promise<LoginResponse> {
  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, senha }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erro ao fazer login: ${response.status}`)
  }

  return await response.json()
}

// Funções para buscar dados da API
export async function getCategorias(): Promise<Categoria[]> {
  try {
    // Adicionar um timestamp para evitar cache
    const timestamp = new Date().getTime()
    const response = await fetch(`${CATEGORIAS_URL}?_=${timestamp}`, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      console.warn(`API de categorias retornou status ${response.status}.`)
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.data || []
  } catch (error) {
    console.warn("Falha ao buscar categorias da API.", error)
    return []
  }
}

export async function getProdutos(page = 1): Promise<PaginatedResponse<Produto>> {
  try {
    // Adicionar um timestamp para evitar cache
    const timestamp = new Date().getTime()
    const response = await fetch(`${PRODUTOS_URL}?page=${page}&_=${timestamp}`, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      console.warn(`API de produtos retornou status ${response.status}.`)
      return {
        meta: {
          total: 0,
          perPage: 10,
          currentPage: page,
          lastPage: 1,
          firstPage: 1,
          firstPageUrl: `${PRODUTOS_URL}?page=1`,
          lastPageUrl: `${PRODUTOS_URL}?page=1`,
          nextPageUrl: null,
          previousPageUrl: null,
        },
        data: [],
      }
    }

    const data = await response.json()

    // Verificar se a resposta já está no formato paginado
    if (data.meta && data.data) {
      return data as PaginatedResponse<Produto>
    }

    // Caso contrário, criar uma resposta paginada simulada
    return {
      meta: {
        total: data.length,
        perPage: data.length,
        currentPage: 1,
        lastPage: 1,
        firstPage: 1,
        firstPageUrl: `${PRODUTOS_URL}?page=1`,
        lastPageUrl: `${PRODUTOS_URL}?page=1`,
        nextPageUrl: null,
        previousPageUrl: null,
      },
      data: data,
    }
  } catch (error) {
    console.warn("Falha ao buscar produtos da API.", error)
    return {
      meta: {
        total: 0,
        perPage: 10,
        currentPage: page,
        lastPage: 1,
        firstPage: 1,
        firstPageUrl: `${PRODUTOS_URL}?page=1`,
        lastPageUrl: `${PRODUTOS_URL}?page=1`,
        nextPageUrl: null,
        previousPageUrl: null,
      },
      data: [],
    }
  }
}

// Função para buscar produtos por categoria
export async function getProdutosPorCategoria(categoriaId: number, page = 1): Promise<PaginatedResponse<Produto>> {
  try {
    // Adicionar um timestamp para evitar cache
    const timestamp = new Date().getTime()
    // Usar o novo padrão de URL para filtrar por categoria
    const response = await fetch(`${PRODUTOS_URL}?categoria=${categoriaId}&page=${page}&_=${timestamp}`, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      console.warn(`API de produtos por categoria retornou status ${response.status}.`)
      return {
        meta: {
          total: 0,
          perPage: 10,
          currentPage: page,
          lastPage: 1,
          firstPage: 1,
          firstPageUrl: `${PRODUTOS_URL}?categoria=${categoriaId}&page=1`,
          lastPageUrl: `${PRODUTOS_URL}?categoria=${categoriaId}&page=1`,
          nextPageUrl: null,
          previousPageUrl: null,
        },
        data: [],
      }
    }

    const data = await response.json()

    // Verificar se a resposta já está no formato paginado
    if (data.meta && data.data) {
      return data as PaginatedResponse<Produto>
    }

    // Caso contrário, criar uma resposta paginada simulada
    return {
      meta: {
        total: data.length,
        perPage: data.length,
        currentPage: 1,
        lastPage: 1,
        firstPage: 1,
        firstPageUrl: `${PRODUTOS_URL}?categoria=${categoriaId}&page=1`,
        lastPageUrl: `${PRODUTOS_URL}?categoria=${categoriaId}&page=1`,
        nextPageUrl: null,
        previousPageUrl: null,
      },
      data: data,
    }
  } catch (error) {
    console.warn(`Falha ao buscar produtos da categoria ${categoriaId}.`, error)
    return {
      meta: {
        total: 0,
        perPage: 10,
        currentPage: page,
        lastPage: 1,
        firstPage: 1,
        firstPageUrl: `${PRODUTOS_URL}?categoria=${categoriaId}&page=1`,
        lastPageUrl: `${PRODUTOS_URL}?categoria=${categoriaId}&page=1`,
        nextPageUrl: null,
        previousPageUrl: null,
      },
      data: [],
    }
  }
}

// Função para buscar produtos por termo de busca
export async function getProdutosPorBusca(termo: string, page = 1): Promise<PaginatedResponse<Produto>> {
  try {
    // Adicionar um timestamp para evitar cache
    const timestamp = new Date().getTime()
    // Usar o parâmetro "nome" para buscar produtos por nome
    const response = await fetch(`${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=${page}&_=${timestamp}`, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      console.warn(`API de busca de produtos retornou status ${response.status}.`)
      return {
        meta: {
          total: 0,
          perPage: 10,
          currentPage: page,
          lastPage: 1,
          firstPage: 1,
          firstPageUrl: `${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=1`,
          lastPageUrl: `${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=1`,
          nextPageUrl: null,
          previousPageUrl: null,
        },
        data: [],
      }
    }

    const data = await response.json()

    // Verificar se a resposta já está no formato paginado
    if (data.meta && data.data) {
      return data as PaginatedResponse<Produto>
    }

    // Caso contrário, criar uma resposta paginada simulada
    return {
      meta: {
        total: data.length,
        perPage: data.length,
        currentPage: 1,
        lastPage: 1,
        firstPage: 1,
        firstPageUrl: `${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=1`,
        lastPageUrl: `${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=1`,
        nextPageUrl: null,
        previousPageUrl: null,
      },
      data: data,
    }
  } catch (error) {
    console.warn(`Falha ao buscar produtos com o termo "${termo}".`, error)
    return {
      meta: {
        total: 0,
        perPage: 10,
        currentPage: page,
        lastPage: 1,
        firstPage: 1,
        firstPageUrl: `${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=1`,
        lastPageUrl: `${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=1`,
        nextPageUrl: null,
        previousPageUrl: null,
      },
      data: [],
    }
  }
}
