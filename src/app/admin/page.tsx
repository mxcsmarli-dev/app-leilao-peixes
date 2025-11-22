"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Gavel, ShoppingBag, Users, Trash2, Eye, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (!authToken || userRole !== "admin") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      checkSupabaseConfig();
      loadData();
    }
    setLoading(false);
  }, [router]);

  const checkSupabaseConfig = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    setSupabaseConfigured(!!(url && key));
  };

  const loadData = async () => {
    try {
      // Carregar leilões
      const { data: auctionsData, error: auctionsError } = await supabase
        .from('auctions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!auctionsError) setAuctions(auctionsData || []);

      // Carregar vendas
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!salesError) setSales(salesData || []);

      // Carregar vendedores
      const { data: sellersData, error: sellersError } = await supabase
        .from('sellers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!sellersError) setSellers(sellersData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleDeleteAuction = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este leilão?")) return;

    try {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAuctions(auctions.filter(a => a.id !== id));
      toast.success("Leilão excluído com sucesso!");
    } catch (error) {
      console.error('Erro ao excluir leilão:', error);
      toast.error("Erro ao excluir leilão");
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta venda?")) return;

    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSales(sales.filter(s => s.id !== id));
      toast.success("Venda excluída com sucesso!");
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      toast.error("Erro ao excluir venda");
    }
  };

  const handleDeleteSeller = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este vendedor?")) return;

    try {
      const { error } = await supabase
        .from('sellers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSellers(sellers.filter(s => s.id !== id));
      toast.success("Vendedor excluído com sucesso!");
    } catch (error) {
      console.error('Erro ao excluir vendedor:', error);
      toast.error("Erro ao excluir vendedor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white px-4 py-2 rounded-full mb-4">
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-semibold text-sm">Painel Administrativo</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">
            Gerencie leilões, vendas e vendedores da plataforma
          </p>
        </div>

        {!supabaseConfigured && (
          <Alert className="mb-8 border-orange-500 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-900">Configuração Necessária</AlertTitle>
            <AlertDescription className="text-orange-800">
              Para usar o sistema administrativo completo, você precisa conectar sua conta Supabase.
              Vá em <strong>Configurações do Projeto → Integrações → Conectar Supabase</strong>.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leilões Ativos</CardTitle>
              <Gavel className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auctions.length}</div>
              <p className="text-xs text-gray-600">Total de leilões em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vendas Disponíveis</CardTitle>
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sales.length}</div>
              <p className="text-xs text-gray-600">Produtos à venda</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vendedores Ativos</CardTitle>
              <Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellers.length}</div>
              <p className="text-xs text-gray-600">Vendedores cadastrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/leiloes">
            <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Gavel className="w-4 h-4" />
              Gerenciar Leilões
            </Button>
          </Link>
          <Link href="/admin/vendas">
            <Button className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              <ShoppingBag className="w-4 h-4" />
              Gerenciar Vendas
            </Button>
          </Link>
          <Link href="/admin/vendedores">
            <Button className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Users className="w-4 h-4" />
              Gerenciar Vendedores
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="auctions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="auctions" className="gap-2">
              <Gavel className="w-4 h-4" />
              Leilões Recentes
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Vendas Recentes
            </TabsTrigger>
            <TabsTrigger value="sellers" className="gap-2">
              <Users className="w-4 h-4" />
              Vendedores Recentes
            </TabsTrigger>
          </TabsList>

          {/* Auctions Tab */}
          <TabsContent value="auctions">
            <Card>
              <CardHeader>
                <CardTitle>Últimos Leilões</CardTitle>
                <CardDescription>
                  Visualize os leilões mais recentes da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auctions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhum leilão cadastrado</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Peixe</TableHead>
                        <TableHead>Lance Atual</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auctions.map((auction) => (
                        <TableRow key={auction.id}>
                          <TableCell className="font-medium">{auction.fish_name}</TableCell>
                          <TableCell>R$ {auction.current_price?.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">{auction.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/leiloes/${auction.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteAuction(auction.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Vendas</CardTitle>
                <CardDescription>
                  Visualize as vendas mais recentes da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sales.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhuma venda cadastrada</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.fish_name}</TableCell>
                          <TableCell>R$ {sale.price?.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-500">{sale.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/vendas/${sale.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteSale(sale.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sellers Tab */}
          <TabsContent value="sellers">
            <Card>
              <CardHeader>
                <CardTitle>Últimos Vendedores</CardTitle>
                <CardDescription>
                  Visualize os vendedores mais recentes da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sellers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhum vendedor cadastrado</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellers.map((seller) => (
                        <TableRow key={seller.id}>
                          <TableCell className="font-medium">{seller.name}</TableCell>
                          <TableCell>{seller.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{seller.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/vendedores/${seller.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteSeller(seller.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
