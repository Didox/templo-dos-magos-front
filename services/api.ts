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
const API_BASE_URL = "https://templo-dos-magos-api-80fee8432048.herokuapp.com"
const CATEGORIAS_URL = `${API_BASE_URL}/categorias`
const PRODUTOS_URL = `${API_BASE_URL}/produtos`

// Funções para buscar dados da API
export async function getCategorias(): Promise<Categoria[]> {
  try {
    const response = await fetch(CATEGORIAS_URL)

    if (!response.ok) {
      throw new Error(`Erro ao buscar categorias: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.data || []
  } catch (error) {
    console.error("Falha ao buscar categorias:", error)
    return []
  }
}

export async function getProdutos(page = 1): Promise<PaginatedResponse<Produto>> {
  try {
    const response = await fetch(`${PRODUTOS_URL}?page=${page}`)

    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos: ${response.status}`)
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
    console.error("Falha ao buscar produtos:", error)
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
    // Usar o novo padrão de URL para filtrar por categoria
    const response = await fetch(`${PRODUTOS_URL}?categoria=${categoriaId}&page=${page}`)

    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos da categoria: ${response.status}`)
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
    console.error(`Falha ao buscar produtos da categoria ${categoriaId}:`, error)
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

// Função para buscar produtos por termo de busca
export async function getProdutosPorBusca(termo: string, page = 1): Promise<PaginatedResponse<Produto>> {
  try {
    // Usar o parâmetro "nome" para buscar produtos por nome
    const response = await fetch(`${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=${page}`)

    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos com termo de busca: ${response.status}`)
    }

    const data = await response.json()

    // Verificar se a resposta já está no formato paginado
    if (data.meta && data.data) {
      return data as PaginatedResponse<Produto>
    }

    // Caso contrário, filtrar manualmente e criar uma resposta paginada simulada
    const termoBusca = termo.toLowerCase()
    const filteredData = Array.isArray(data)
      ? data.filter(
          (produto) =>
            produto.nome.toLowerCase().includes(termoBusca) ||
            (produto.descricao && produto.descricao.toLowerCase().includes(termoBusca)),
        )
      : []

    return {
      meta: {
        total: filteredData.length,
        perPage: filteredData.length,
        currentPage: 1,
        lastPage: 1,
        firstPage: 1,
        firstPageUrl: `${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=1`,
        lastPageUrl: `${PRODUTOS_URL}?nome=${encodeURIComponent(termo)}&page=1`,
        nextPageUrl: null,
        previousPageUrl: null,
      },
      data: filteredData,
    }
  } catch (error) {
    console.error(`Falha ao buscar produtos com o termo "${termo}":`, error)
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
