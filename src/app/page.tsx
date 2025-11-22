"use client";

import { Fish, Gavel, ShoppingBag, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Home() {
  // Dados mockados para demonstração
  const featuredAuctions = [
    {
      id: "1",
      fishName: "Betta Halfmoon Blue Dragon",
      currentPrice: 85,
      timeLeft: "2h 15min",
      bids: 12,
      image: "https://images.unsplash.com/photo-1520990269031-f4f7b5e3e6a8?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      fishName: "Discus Red Melon",
      currentPrice: 320,
      timeLeft: "4h 30min",
      bids: 8,
      image: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      fishName: "Koi Kohaku Premium",
      currentPrice: 1250,
      timeLeft: "6h 45min",
      bids: 23,
      image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop",
    },
  ];

  const stats = [
    { label: "Leilões Ativos", value: "24", icon: Gavel, color: "from-blue-500 to-cyan-500" },
    { label: "Vendas Disponíveis", value: "156", icon: ShoppingBag, color: "from-emerald-500 to-teal-500" },
    { label: "Vendedores", value: "48", icon: Users, color: "from-purple-500 to-pink-500" },
    { label: "Lances Hoje", value: "342", icon: TrendingUp, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <Fish className="w-5 h-5" />
            <span className="font-semibold">Plataforma de Leilão de Peixes Ornamentais</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Encontre Peixes Raros e Exclusivos
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Participe de leilões ao vivo, compre diretamente de criadores certificados e descubra as melhores linhagens do mercado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/leiloes" prefetch={false}>
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg">
                <Gavel className="w-5 h-5" />
                Ver Leilões Ativos
              </Button>
            </Link>
            <Link href="/vendas" prefetch={false}>
              <Button size="lg" variant="outline" className="gap-2">
                <ShoppingBag className="w-5 h-5" />
                Explorar Vendas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Leilões em Destaque</h2>
            <p className="text-gray-600">Participe agora e não perca essas oportunidades</p>
          </div>
          <Link href="/leiloes" prefetch={false}>
            <Button variant="outline">Ver Todos</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAuctions.map((auction) => (
            <Card key={auction.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={auction.image} 
                  alt={auction.fishName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-red-500 text-white gap-1">
                  <Clock className="w-3 h-3" />
                  {auction.timeLeft}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{auction.fishName}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>{auction.bids} lances</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Lance Atual</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {auction.currentPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <Link href={`/leiloes/${auction.id}`} prefetch={false}>
                  <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Gavel className="w-4 h-4" />
                    Dar Lance
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Você é Criador ou Vendedor?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Cadastre-se como vendedor e comece a anunciar seus peixes em leilões ou vendas diretas. Alcance milhares de compradores!
            </p>
            <Link href="/admin/vendedores/novo" prefetch={false}>
              <Button size="lg" variant="secondary" className="gap-2">
                <Users className="w-5 h-5" />
                Cadastrar como Vendedor
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
