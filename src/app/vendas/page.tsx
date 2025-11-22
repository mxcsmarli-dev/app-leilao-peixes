"use client";

import { ShoppingBag, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function VendasPage() {
  const sales = [
    {
      id: "1",
      fishName: "Neon Tetra (10 unidades)",
      price: 35,
      seller: "Aquário Premium",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1520990269031-f4f7b5e3e6a8?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      fishName: "Platy Variado",
      price: 15,
      seller: "Peixes & Cia",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      fishName: "Molly Balloon",
      price: 25,
      seller: "AquaWorld",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full mb-4">
            <ShoppingBag className="w-4 h-4" />
            <span className="font-semibold text-sm">Vendas Diretas</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Compre Agora
          </h1>
          <p className="text-gray-600">
            Peixes disponíveis para compra imediata de vendedores certificados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => (
            <Card key={sale.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={sale.image} 
                  alt={sale.fishName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                  Disponível
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{sale.fishName}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {sale.rating} • {sale.seller}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Preço</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      R$ {sale.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <Link href={`/vendas/${sale.id}`}>
                  <Button className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                    <ShoppingBag className="w-4 h-4" />
                    Comprar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
