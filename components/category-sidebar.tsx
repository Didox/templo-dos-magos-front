"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCategorias, type Categoria } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@/contexts/search-context";
import { useRouter } from "next/navigation";

interface CategorySidebarProps {
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  disabled?: boolean;
}

export default function CategorySidebar({
  selectedCategory,
  onSelectCategory,
  disabled = false,
}: CategorySidebarProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearSearch } = useSearch();
  const router = useRouter();

  useEffect(() => {
    async function loadCategorias() {
      try {
        setIsLoading(true);
        const data = await getCategorias();
        setCategorias(data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar categorias");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategorias();
  }, []);

  // Função para obter a classe de cor com base na cor da API
  const getColorClass = (cor: string, isSelected: boolean) => {
    // Se o botão estiver selecionado, usar amarelo independentemente da cor original
    if (isSelected) {
      return "bg-yellow-400 hover:bg-yellow-500 text-purple-900";
    }

    // Caso contrário, usar a cor original (substituindo laranja por roxo claro)
    if (cor.startsWith("bg-")) {
      // Se a cor contiver "orange" ou "laranja", substituir por roxo claro
      if (cor.includes("orange") || cor.includes("laranja")) {
        return "bg-purple-400 hover:bg-purple-500 text-white";
      }
      return `${cor} text-purple-900`;
    }

    switch (cor) {
      case "laranja":
        return "bg-purple-700 hover:bg-purple-800 text-white";
      case "ciano":
        return "bg-cyan-400 hover:bg-cyan-500 text-purple-900";
      case "azul":
        return "bg-blue-400 hover:bg-blue-500 text-purple-900";
      case "rosa":
        return "bg-pink-400 hover:bg-pink-500 text-purple-900";
      default:
        return "bg-purple-400 hover:bg-purple-500 text-white";
    }
  };

  // Função para limpar a busca e redirecionar para a home
  const handleClearSearch = () => {
    // Limpar o estado interno
    clearSearch();

    // Redirecionar para a página inicial
    router.push("/");
  };

  return (
    <div
      className={`bg-purple-800 rounded-2xl p-4 shadow-lg border-2 border-purple-700 ${disabled ? "opacity-70" : ""}`}
    >
      <h2 className="text-yellow-400 text-2xl font-bold mb-4 text-center">
        CATEGORIAS
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-full h-14 bg-purple-700" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-400">{error}</div>
      ) : (
        <div className="space-y-3">
          <Button
            className={`w-full font-bold text-lg py-6 rounded-xl ${
              selectedCategory === null
                ? "bg-yellow-400 hover:bg-yellow-500 text-purple-900"
                : "bg-blue-400 hover:bg-blue-500 text-purple-900"
            }`}
            onClick={() => onSelectCategory(null)}
            disabled={disabled}
          >
            Todos
          </Button>

          {categorias.map((categoria) => (
            <Button
              key={categoria.id}
              className={`w-full font-bold text-lg py-6 rounded-xl ${getColorClass(
                categoria.cor,
                selectedCategory === categoria.id,
              )}`}
              onClick={() => onSelectCategory(categoria.id)}
              disabled={disabled}
            >
              {categoria.nome}
            </Button>
          ))}
        </div>
      )}

      {disabled && (
        <button
          onClick={handleClearSearch}
          className="text-center mt-4 w-full text-cyan-400 hover:text-cyan-300 text-sm underline cursor-pointer transition-colors"
        >
          Clique aqui para limpar a busca e usar as categorias
        </button>
      )}
    </div>
  );
}
