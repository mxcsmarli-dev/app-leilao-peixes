"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NovaVendaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    seller: "",
    price: "",
    stock: "",
    videoUrl: "",
    age: "",
    lineage: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Venda criada:", formData);
    router.push("/admin/vendas");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/vendas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Criar Nova Venda</h1>
          <p className="text-gray-600">Configure os detalhes do anúncio</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Venda</CardTitle>
            <CardDescription>Preencha os dados do peixe e configurações do anúncio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do Peixe *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Guppy Cobra Green - Casal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller">Vendedor *</Label>
                <Select
                  value={formData.seller}
                  onValueChange={(value) => setFormData({ ...formData, seller: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aquario-premium">Aquário Premium</SelectItem>
                    <SelectItem value="peixes-tropicais">Peixes Tropicais</SelectItem>
                    <SelectItem value="criacao-silva">Criação Silva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preço e Estoque */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Quantidade em Estoque *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Informações do Peixe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Ex: 6 meses"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lineage">Linhagem</Label>
                <Input
                  id="lineage"
                  name="lineage"
                  value={formData.lineage}
                  onChange={handleChange}
                  placeholder="Ex: Tailandesa Premium"
                />
              </div>
            </div>

            {/* Vídeo */}
            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL do Vídeo</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />
              <p className="text-xs text-gray-500">Cole o link do YouTube ou outro serviço de vídeo</p>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva as características do peixe..."
                rows={4}
              />
            </div>

            {/* Upload de Imagens */}
            <div className="space-y-2">
              <Label>Imagens do Peixe</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Clique para fazer upload ou arraste as imagens</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                <Save className="w-4 h-4" />
                Criar Anúncio
              </Button>
              <Link href="/admin/vendas">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
