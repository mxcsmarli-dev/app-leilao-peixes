"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NovoAnuncio() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    videoUrl: "",
    idade: "",
    tipoFrete: "",
    duracaoLeilao: "",
    incrementoLeilao: "",
    precoInicial: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do anúncio:", formData);
    // Aqui você implementaria a lógica de salvar no banco
    router.push("/vendedor");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/vendedor">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Painel
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Criar Novo Anúncio
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Preencha os dados do seu leilão
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Leilão</CardTitle>
              <CardDescription>Preencha todos os campos obrigatórios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome do Animal */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Animal *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Cavalo Mangalarga"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva as características do animal..."
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  required
                />
              </div>

              {/* Vídeo */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL do Vídeo</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Video className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="videoUrl"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.videoUrl}
                      onChange={(e) => handleChange("videoUrl", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-slate-500">Cole o link do YouTube ou faça upload de um vídeo</p>
              </div>

              {/* Idade */}
              <div className="space-y-2">
                <Label htmlFor="idade">Idade *</Label>
                <Input
                  id="idade"
                  placeholder="Ex: 5 anos"
                  value={formData.idade}
                  onChange={(e) => handleChange("idade", e.target.value)}
                  required
                />
              </div>

              {/* Tipo de Frete */}
              <div className="space-y-2">
                <Label htmlFor="tipoFrete">Tipo de Frete *</Label>
                <Select value={formData.tipoFrete} onValueChange={(value) => handleChange("tipoFrete", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de frete" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aereo">Aéreo</SelectItem>
                    <SelectItem value="rodoviario">Rodoviário</SelectItem>
                    <SelectItem value="ambos">Aéreo e Rodoviário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preço Inicial */}
              <div className="space-y-2">
                <Label htmlFor="precoInicial">Preço Inicial (Lance Mínimo) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">R$</span>
                  <Input
                    id="precoInicial"
                    type="number"
                    placeholder="0,00"
                    value={formData.precoInicial}
                    onChange={(e) => handleChange("precoInicial", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Duração do Leilão */}
              <div className="space-y-2">
                <Label htmlFor="duracaoLeilao">Duração do Leilão *</Label>
                <Select value={formData.duracaoLeilao} onValueChange={(value) => handleChange("duracaoLeilao", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 horas</SelectItem>
                    <SelectItem value="48h">48 horas</SelectItem>
                    <SelectItem value="3d">3 dias</SelectItem>
                    <SelectItem value="5d">5 dias</SelectItem>
                    <SelectItem value="7d">7 dias</SelectItem>
                    <SelectItem value="15d">15 dias</SelectItem>
                    <SelectItem value="30d">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Incremento do Leilão */}
              <div className="space-y-2">
                <Label htmlFor="incrementoLeilao">Incremento Mínimo do Lance *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">R$</span>
                  <Input
                    id="incrementoLeilao"
                    type="number"
                    placeholder="100,00"
                    value={formData.incrementoLeilao}
                    onChange={(e) => handleChange("incrementoLeilao", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">Valor mínimo que cada lance deve aumentar</p>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Publicar Leilão
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/vendedor")}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
