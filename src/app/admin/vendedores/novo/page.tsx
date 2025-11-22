"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, MapPin, FileText, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function NovoVendedor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
    especialidade: "",
    descricao: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de cadastro - em produção, salvaria no Supabase
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push("/admin/vendedores");
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/vendedores">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar para Vendedores
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Cadastrar Novo Vendedor</h1>
          <p className="text-gray-600">Preencha os dados para cadastrar um novo vendedor na plataforma</p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ✅ Vendedor cadastrado com sucesso! Redirecionando...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Vendedor
              </CardTitle>
              <CardDescription>
                Dados básicos e informações de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo / Nome da Empresa *
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Ex: João Silva ou Aquário Premium"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-mail *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone / WhatsApp *
                </Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Localização */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Cidade *
                  </Label>
                  <Input
                    id="cidade"
                    name="cidade"
                    placeholder="Ex: São Paulo"
                    value={formData.cidade}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    name="estado"
                    placeholder="Ex: SP"
                    maxLength={2}
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Especialidade */}
              <div className="space-y-2">
                <Label htmlFor="especialidade" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Especialidade
                </Label>
                <Input
                  id="especialidade"
                  name="especialidade"
                  placeholder="Ex: Bettas, Discus, Kois, Peixes Marinhos"
                  value={formData.especialidade}
                  onChange={handleChange}
                />
                <p className="text-sm text-gray-500">
                  Informe os tipos de peixes que você trabalha
                </p>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição / Sobre</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Conte um pouco sobre você ou sua empresa, experiência no mercado, diferenciais..."
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Salvando..." : "Cadastrar Vendedor"}
                </Button>
                
                <Link href="/admin/vendedores" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Informações Adicionais */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> Após o cadastro, o vendedor receberá um e-mail com instruções para acessar a plataforma e começar a anunciar seus peixes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
