"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const [email, setEmail] = useState("danilo@teste.com");
  const [senha, setSenha] = useState("1234567890");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, senha);

      if (result.success) {
        onSuccess();
      } else {
        setError(
          result.message || "Erro ao fazer login. Verifique suas credenciais.",
        );
      }
    } catch (err) {
      setError("Ocorreu um erro durante o login. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-purple-800 border-purple-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-yellow-400 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5" />
            Portal Mágico
          </DialogTitle>
          <DialogDescription className="text-center text-purple-300">
            Entre com suas credenciais para finalizar a compra
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="mb-4 bg-red-900/50 border-red-800 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-purple-700 border-purple-600 text-white placeholder:text-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-300">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="bg-purple-700 border-purple-600 text-white placeholder:text-purple-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-purple-300 hover:text-purple-200 hover:bg-purple-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-purple-900 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
