"use client";

import { Gavel, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function LeiloesPage() {
  const auctions = [
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
    {
      id: "4",
      fishName: "Guppy Fancy Tail",
      currentPrice: 45,
      timeLeft: "1h 30min",
      bids: 5,
      image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full mb-4">
            <Gavel className="w-4 h-4" />
            <span className="font-semibold text-sm">Leilões Ativos</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Leilões em Andamento
          </h1>
          <p className="text-gray-600">
            Participe dos leilões e leve para casa peixes ornamentais exclusivos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
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
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {auction.bids} lances
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
                
                <Link href={`/leiloes/${auction.id}`}>
                  <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Gavel className="w-4 h-4" />
                    Dar Lance
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
