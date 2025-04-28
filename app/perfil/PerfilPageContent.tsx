"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Header from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PerfilForm from "@/components/perfil-form";
import AlterarSenhaForm from "@/components/alterar-senha-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Lock } from "lucide-react";
import Link from "next/link";

export default function PerfilPageContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dados");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-purple-900 bg-opacity-95 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500 opacity-20"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-purple-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à loja
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-yellow-400">Meu Perfil</h1>
          </div>

          <div className="bg-purple-800 rounded-2xl p-6 shadow-lg border-2 border-purple-700">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-purple-700">
                <TabsTrigger
                  value="dados"
                  className="data-[state=active]:bg-cyan-400 data-[state=active]:text-purple-900 data-[state=active]:font-bold"
                >
                  <User className="mr-2 h-4 w-4" />
                  Dados Pessoais
                </TabsTrigger>
                <TabsTrigger
                  value="senha"
                  className="data-[state=active]:bg-cyan-400 data-[state=active]:text-purple-900 data-[state=active]:font-bold"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Alterar Senha
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dados" className="mt-6">
                <PerfilForm />
              </TabsContent>
              <TabsContent value="senha" className="mt-6">
                <AlterarSenhaForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
