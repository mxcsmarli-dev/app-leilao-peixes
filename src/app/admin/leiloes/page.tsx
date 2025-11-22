"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { supabase, type Auction } from "@/lib/supabase";
import { toast } from "sonner";

export default function LeiloesPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuctions(data || []);
    } catch (error) {
      console.error('Erro ao carregar leilões:', error);
      toast.error('Erro ao carregar leilões');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este leilão?')) return;

    try {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAuctions(auctions.filter(a => a.id !== id));
      toast.success('Leilão excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir leilão:', error);
      toast.error('Erro ao excluir leilão');
    }
  };

  const filteredAuctions = auctions.filter(auction =>
    auction.fish_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      active: { color: "bg-green-500", label: "Ativo" },
      finished: { color: "bg-gray-500", label: "Finalizado" },
      cancelled: { color: "bg-red-500", label: "Cancelado" },
    };
    const variant = variants[status] || variants.active;
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
          <p className="text-gray-600">Carregando leilões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciar Leilões</h1>
          <p className="text-gray-600">Visualize e gerencie todos os leilões cadastrados</p>
        </div>
        <Link href="/admin/leiloes/novo">
          <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Plus className="w-4 h-4" />
            Novo Leilão
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome do peixe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Auctions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuctions.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Nenhum leilão encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredAuctions.map((auction) => (
            <Card key={auction.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {auction.image_url ? (
                  <img
                    src={auction.image_url}
                    alt={auction.fish_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem imagem
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(auction.status)}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{auction.fish_name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {auction.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lance Atual</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {auction.current_price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Termina em: {new Date(auction.end_date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/leiloes/${auction.id}/editar`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDelete(auction.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
