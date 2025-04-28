"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

export default function AlterarSenhaForm() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    senha_atual: "",
    senha_nova: "",
    senha_confirmacao: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    atual: false,
    nova: false,
    confirmacao: false,
  });

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para alternar a visibilidade da senha
  const togglePasswordVisibility = (
    field: "atual" | "nova" | "confirmacao",
  ) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Função para salvar a nova senha
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !user) return;

    // Validar se as senhas coincidem
    if (formData.senha_nova !== formData.senha_confirmacao) {
      setError("A nova senha e a confirmação não coincidem.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/usuarios/${user.id}/senha`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            senha_atual: formData.senha_atual,
            senha: formData.senha_nova,
            senha_confirmacao: formData.senha_confirmacao,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao atualizar senha");
      }

      // Limpar o formulário
      setFormData({
        senha_atual: "",
        senha_nova: "",
        senha_confirmacao: "",
      });

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso!",
        className: "bg-green-800 border-green-700 text-white",
      });
    } catch (err) {
      console.error("Erro ao atualizar senha:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar sua senha. Tente novamente mais tarde.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert className="mb-6 bg-red-900/50 border-red-800 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="senha_atual" className="text-purple-300">
            Senha Atual
          </Label>
          <div className="relative">
            <Input
              id="senha_atual"
              name="senha_atual"
              type={showPasswords.atual ? "text" : "password"}
              value={formData.senha_atual}
              onChange={handleChange}
              className="bg-purple-700 border-purple-600 text-white pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
              onClick={() => togglePasswordVisibility("atual")}
            >
              {showPasswords.atual ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha_nova" className="text-purple-300">
            Nova Senha
          </Label>
          <div className="relative">
            <Input
              id="senha_nova"
              name="senha_nova"
              type={showPasswords.nova ? "text" : "password"}
              value={formData.senha_nova}
              onChange={handleChange}
              className="bg-purple-700 border-purple-600 text-white pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
              onClick={() => togglePasswordVisibility("nova")}
            >
              {showPasswords.nova ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-purple-400">
            A senha deve ter pelo menos 6 caracteres
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha_confirmacao" className="text-purple-300">
            Confirmar Nova Senha
          </Label>
          <div className="relative">
            <Input
              id="senha_confirmacao"
              name="senha_confirmacao"
              type={showPasswords.confirmacao ? "text" : "password"}
              value={formData.senha_confirmacao}
              onChange={handleChange}
              className="bg-purple-700 border-purple-600 text-white pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
              onClick={() => togglePasswordVisibility("confirmacao")}
            >
              {showPasswords.confirmacao ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-purple-900 font-bold"
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Atualizando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Atualizar Senha
              </span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
