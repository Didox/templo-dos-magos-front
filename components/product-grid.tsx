"use client";

import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import {
  getProdutos,
  getProdutosPorCategoria,
  getProdutosPorBusca,
  type Produto,
  type PaginationMeta,
} from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
  selectedCategory: number | null;
  searchTerm: string | null;
}

export default function ProductGrid({
  selectedCategory,
  searchTerm,
}: ProductGridProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    // Resetar para a primeira página quando mudar a categoria ou termo de busca
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    async function loadProdutos() {
      try {
        setIsLoading(true);
        let response;

        if (searchTerm) {
          // Se tiver termo de busca, busca produtos pelo termo
          response = await getProdutosPorBusca(searchTerm, currentPage);
          setCategoryName("");
        } else if (selectedCategory !== null) {
          // Se tiver categoria selecionada, busca produtos pela categoria
          response = await getProdutosPorCategoria(
            selectedCategory,
            currentPage,
          );

          // Tentar encontrar o nome da categoria a partir dos produtos
          if (response.data.length > 0 && response.data[0].categoria) {
            setCategoryName(response.data[0].categoria.nome);
          }
        } else {
          // Caso contrário, busca todos os produtos
          response = await getProdutos(currentPage);
          setCategoryName("");
        }

        setProdutos(response.data);
        setPaginationMeta(response.meta);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar produtos");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProdutos();
  }, [selectedCategory, searchTerm, currentPage]);

  // Determinar o título da seção com base nos filtros aplicados
  let sectionTitle = "";
  if (searchTerm) {
    sectionTitle = `${paginationMeta?.total || 0} Resultados para "${searchTerm}"`;
  } else if (selectedCategory !== null) {
    sectionTitle = `${paginationMeta?.total || 0} Produtos em ${categoryName || "Categoria Selecionada"}`;
  } else {
    sectionTitle = `${paginationMeta?.total || 0} Produtos Disponíveis`;
  }

  // Função para obter a classe de cor com base na cor da API
  const getColorClass = (cor: string) => {
    if (cor.startsWith("bg-")) {
      // Se a cor contiver "orange" ou "laranja", substituir por roxo claro
      if (cor.includes("orange") || cor.includes("laranja")) {
        return "bg-purple-400";
      }
      return cor;
    }

    switch (cor) {
      case "laranja":
        return "bg-purple-400"; // Substituído por roxo claro
      case "ciano":
        return "bg-cyan-400";
      case "azul":
        return "bg-blue-400";
      case "rosa":
        return "bg-pink-400";
      default:
        return "bg-purple-400";
    }
  };

  // Função para navegar para a página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Função para navegar para a próxima página
  const goToNextPage = () => {
    if (paginationMeta && currentPage < paginationMeta.lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        {sectionTitle}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-64 bg-purple-700 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-purple-800 rounded-2xl">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      ) : produtos.length === 0 ? (
        <div className="text-center py-12 bg-purple-800 rounded-2xl">
          <p className="text-white text-xl">
            {searchTerm
              ? `Nenhum produto encontrado para "${searchTerm}".`
              : "Nenhum produto encontrado nesta categoria."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <ProductCard
                key={produto.id}
                id={produto.id}
                title={produto.nome}
                price={produto.preco}
                image={produto.urlImagem || "/card-magic.png"}
                color={
                  produto.categoria
                    ? getColorClass(produto.categoria.cor)
                    : "bg-purple-400"
                }
              />
            ))}
          </div>

          {/* Paginação */}
          {paginationMeta && paginationMeta.lastPage > 1 && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-white">
                Página {currentPage} de {paginationMeta.lastPage}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === paginationMeta.lastPage}
                className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
