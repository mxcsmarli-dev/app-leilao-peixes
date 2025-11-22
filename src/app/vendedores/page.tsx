"use client";

import { Users, Star, MapPin, Fish } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function VendedoresPage() {
  const sellers = [
    {
      id: "1",
      name: "Aquário Premium",
      location: "São Paulo, SP",
      rating: 4.8,
      totalSales: 156,
      specialties: ["Bettas", "Discus", "Koi"],
      image: "https://images.unsplash.com/photo-1520990269031-f4f7b5e3e6a8?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      name: "Peixes & Cia",
      location: "Rio de Janeiro, RJ",
      rating: 4.5,
      totalSales: 89,
      specialties: ["Guppys", "Platys", "Mollys"],
      image: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      name: "AquaWorld",
      location: "Belo Horizonte, MG",
      rating: 4.9,
      totalSales: 234,
      specialties: ["Koi", "Carpas", "Goldfish"],
      image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full mb-4">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-sm">Vendedores Certificados</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Nossos Vendedores
          </h1>
          <p className="text-gray-600">
            Conheça os criadores e vendedores certificados da nossa plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <Card key={seller.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={seller.image} 
                  alt={seller.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-purple-500 text-white gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  {seller.rating}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{seller.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {seller.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Especialidades:</p>
                  <div className="flex flex-wrap gap-2">
                    {seller.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        <Fish className="w-3 h-3" />
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total de Vendas</p>
                    <p className="text-xl font-bold text-purple-600">
                      {seller.totalSales}
                    </p>
                  </div>
                </div>
                
                <Link href={`/vendedores/${seller.id}`}>
                  <Button className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Users className="w-4 h-4" />
                    Ver Perfil
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
