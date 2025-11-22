"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { supabase, type Seller } from "@/lib/supabase";
import { toast } from "sonner";

export default function VendedoresPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSellers(data || []);
    } catch (error) {
      console.error('Erro ao carregar vendedores:', error);
      toast.error('Erro ao carregar vendedores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este vendedor?')) return;

    try {
      const { error } = await supabase
        .from('sellers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSellers(sellers.filter(s => s.id !== id));
      toast.success('Vendedor excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir vendedor:', error);
      toast.error('Erro ao excluir vendedor');
    }
  };

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      active: { color: "bg-green-500", label: "Ativo" },
      inactive: { color: "bg-gray-500", label: "Inativo" },
      pending: { color: "bg-yellow-500", label: "Pendente" },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando vendedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciar Vendedores</h1>
          <p className="text-gray-600">Visualize e gerencie todos os vendedores cadastrados</p>
        </div>
        <Link href="/admin/vendedores/novo">
          <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Plus className="w-4 h-4" />
            Novo Vendedor
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sellers List */}
      <div className="grid gap-4">
        {filteredSellers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Nenhum vendedor encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredSellers.map((seller) => (
            <Card key={seller.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{seller.name}</CardTitle>
                      {getStatusBadge(seller.status)}
                    </div>
                    <CardDescription className="space-y-1">
                      <p>Email: {seller.email}</p>
                      <p>Telefone: {seller.phone}</p>
                      <p>CPF/CNPJ: {seller.cpf_cnpj}</p>
                      <p>Endereço: {seller.address}</p>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/vendedores/${seller.id}/editar`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDelete(seller.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
