"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Star, Package, TrendingUp, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { getSeller, getSellerAuctions, getSellerSales, type Seller, type Auction, type Sale } from "@/lib/supabase";

export default function PerfilVendedor() {
  const params = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      const sellerData = await getSeller(params.id as string);
      const auctionsData = await getSellerAuctions(params.id as string);
      const salesData = await getSellerSales(params.id as string);
      
      setSeller(sellerData);
      setAuctions(auctionsData);
      setSales(salesData);
    } catch (error) {
      console.error("Erro ao carregar vendedor:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!mounted) return "Carregando...";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vendedor não encontrado</p>
          <Link href="/" prefetch={false}>
            <Button>Voltar para Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" prefetch={false}>
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Perfil do Vendedor */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-4xl font-bold">
                  {seller.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Informações */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{seller.name}</h1>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-lg">{seller.rating.toFixed(1)}</span>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Package className="w-3 h-3" />
                        {seller.total_sales} vendas
                      </Badge>
                      <Badge 
                        className={
                          seller.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {seller.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {seller.bio && (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {seller.bio}
                  </p>
                )}

                {/* Informações de Contato */}
                <div className="grid md:grid-cols-2 gap-3">
                  {seller.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{seller.email}</span>
                    </div>
                  )}
                  {seller.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{seller.phone}</span>
                    </div>
                  )}
                  {seller.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{seller.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Membro desde {formatDate(seller.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs - Leilões e Vendas */}
        <Tabs defaultValue="auctions" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-6">
            <TabsTrigger value="auctions" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Leilões ({auctions.length})
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2">
              <Package className="w-4 h-4" />
              Vendas Diretas ({sales.length})
            </TabsTrigger>
          </TabsList>

          {/* Leilões */}
          <TabsContent value="auctions">
            {auctions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum leilão ativo no momento</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auction) => (
                  <Link key={auction.id} href={`/leiloes/${auction.id}`} prefetch={false}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-0">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={auction.image_url || "https://images.unsplash.com/photo-1520990269031-f4f7b5e3e6a8?w=400&h=300&fit=crop"}
                            alt={auction.fish_name}
                            className="w-full h-full object-cover"
                          />
                          <Badge className={`absolute top-2 right-2 ${
                            auction.status === 'active' 
                              ? 'bg-green-500' 
                              : auction.status === 'finished'
                              ? 'bg-gray-500'
                              : 'bg-red-500'
                          }`}>
                            {auction.status === 'active' ? 'Ativo' : auction.status === 'finished' ? 'Encerrado' : 'Cancelado'}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 line-clamp-1">{auction.fish_name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {auction.description || "Sem descrição"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500">Lance Atual</p>
                              <p className="text-xl font-bold text-green-600">
                                R$ {auction.current_price.toFixed(2)}
                              </p>
                            </div>
                            <Badge variant="outline">
                              Min: R$ {auction.min_increment.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Vendas Diretas */}
          <TabsContent value="sales">
            {sales.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma venda direta disponível</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sales.map((sale) => (
                  <Card key={sale.id} className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={sale.image_url || "https://images.unsplash.com/photo-1520990269031-f4f7b5e3e6a8?w=400&h=300&fit=crop"}
                          alt={sale.fish_name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${
                          sale.status === 'available' 
                            ? 'bg-green-500' 
                            : sale.status === 'sold'
                            ? 'bg-gray-500'
                            : 'bg-yellow-500'
                        }`}>
                          {sale.status === 'available' ? 'Disponível' : sale.status === 'sold' ? 'Vendido' : 'Reservado'}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{sale.fish_name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {sale.description || "Sem descrição"}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Preço</p>
                            <p className="text-xl font-bold text-blue-600">
                              R$ {sale.price.toFixed(2)}
                            </p>
                          </div>
                          {sale.status === 'available' && (
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                              Comprar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
