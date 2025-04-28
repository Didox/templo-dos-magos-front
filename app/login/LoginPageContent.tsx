"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPageContent() {
  const [email, setEmail] = useState("danilo@teste.com");
  const [senha, setSenha] = useState("1234567890");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
        router.push("/");
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

  const logoUrl = "/logo-wizard.png";

  return (
    <main className="min-h-screen bg-purple-900 bg-opacity-95 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500 opacity-20"
            style={{
              width: Math.random() * 20 + 5 + "px",
              height: Math.random() * 20 + 5 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <Link href="/" className="mb-8 flex items-center">
          <div className="w-16 h-16 relative mr-2">
            <Image
              src={logoUrl}
              alt="Mago"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-yellow-400 text-3xl font-bold tracking-wide">
              TEMPLO
              <span className="block md:inline text-cyan-400 text-2xl md:text-3xl">
                DOS MAGOS
              </span>
            </h1>
          </div>
        </Link>

        <Card className="w-full max-w-md bg-purple-800 border-purple-700 text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-yellow-400 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              Portal Mágico
            </CardTitle>
            <CardDescription className="text-center text-purple-300">
              Entre com suas credenciais para acessar o portal
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-purple-900 font-bold"
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
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href="/"
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              Voltar para a loja
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
