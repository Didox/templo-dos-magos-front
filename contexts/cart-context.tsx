"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/auth-context";
import { API_BASE_URL } from "@/services/api";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  finalizarCompra: (
    formaPagamento?: string,
    observacoes?: string,
  ) => Promise<{ success: boolean; message: string; pedidoId?: number }>;
  isProcessingCheckout: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const { user, token, isAuthenticated } = useAuth();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("templo-dos-magos-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("templo-dos-magos-cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("templo-dos-magos-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    // Garantir que o preço seja um número
    const numericPrice =
      typeof product.price === "string"
        ? Number.parseFloat(product.price)
        : product.price;

    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id,
      );

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { ...product, price: numericPrice, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const finalizarCompra = async (
    formaPagamento = "cartao",
    observacoes = "",
  ) => {
    if (!isAuthenticated || !user || !token) {
      return {
        success: false,
        message: "Você precisa estar autenticado para finalizar a compra.",
      };
    }

    if (items.length === 0) {
      return {
        success: false,
        message: "Seu carrinho está vazio.",
      };
    }

    try {
      setIsProcessingCheckout(true);

      // Formatar os dados para o formato esperado pela API
      const pedidoData = {
        usuario_id: user.id,
        forma_pagamento: formaPagamento,
        observacoes: observacoes,
        produtos: items.map((item) => ({
          produto_id: item.id,
          quantidade: item.quantity,
          preco_unitario: item.price.toString(),
        })),
      };

      // Enviar o pedido para a API
      const response = await fetch(`${API_BASE_URL}/api/pedidos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(pedidoData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ao criar pedido: ${response.status}`,
        );
      }

      const pedidoCriado = await response.json();

      // Limpar o carrinho após finalizar a compra com sucesso
      clearCart();

      return {
        success: true,
        message: "Pedido realizado com sucesso!",
        pedidoId: pedidoCriado.id,
      };
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao processar seu pedido.",
      };
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        finalizarCompra,
        isProcessingCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
