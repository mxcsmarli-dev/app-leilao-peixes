"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Gavel, TrendingUp, User, AlertCircle, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { 
  getAuction, 
  getAuctionBids, 
  placeBid, 
  subscribeToAuctionBids,
  type Bid,
  type Auction 
} from "@/lib/supabase";

export default function LeilaoDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [lanceValue, setLanceValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadAuctionData();
  }, []);

  useEffect(() => {
    if (!params.id) return;

    // Subscrever a novos lances em tempo real
    const channel = subscribeToAuctionBids(params.id as string, (newBid) => {
      setBids((prev) => [newBid, ...prev]);
      // Atualizar o preço atual do leilão
      setAuction((prev: any) => ({
        ...prev,
        current_price: newBid.bid_value,
      }));
    });

    return () => {
      channel.unsubscribe();
    };
  }, [params.id]);

  const loadAuctionData = async () => {
    try {
      setLoading(true);
      const auctionData = await getAuction(params.id as string);
      const bidsData = await getAuctionBids(params.id as string);
      
      setAuction(auctionData);
      setBids(bidsData);
    } catch (error: any) {
      console.error("Erro ao carregar leilão:", {
        message: error?.message || "Erro desconhecido",
        error: error,
        stack: error?.stack
      });
      
      const errorMsg = error?.message || "Erro ao carregar dados do leilão";
      setErrorMessage(errorMsg);
      setShowError(true);
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

  const formatTime = (date: string) => {
    if (!mounted) return "Carregando...";
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatTimeAgo = (date: string) => {
    if (!mounted) return "";
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `há ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `há ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `há ${diffDays}d`;
  };

  const calculateTimeLeft = (endDate: string) => {
    if (!mounted) return "Carregando...";
    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Encerrado";
    
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ${diffHours % 24}h`;
    }
    
    return `${diffHours}h ${diffMins}min`;
  };

  const handleLance = async () => {
    if (!auction) return;
    
    const valor = parseFloat(lanceValue);
    const minValue = auction.current_price + auction.min_increment;
    
    if (valor < minValue) {
      setErrorMessage(`O lance mínimo é R$ ${minValue.toFixed(2)}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      setSubmitting(true);
      
      // Simular usuário (em produção viria da autenticação)
      const userId = "user-" + Math.random().toString(36).substr(2, 9);
      const userName = "Usuário " + Math.floor(Math.random() * 1000);
      
      await placeBid(auction.id, userId, userName, valor);
      
      setShowSuccess(true);
      setLanceValue("");
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error("Erro ao dar lance:", {
        message: error?.message || "Erro desconhecido",
        error: error,
        stack: error?.stack
      });
      
      const errorMsg = error?.message || "Erro ao processar lance";
      setErrorMessage(errorMsg);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando leilão...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Leilão não encontrado</h2>
          {showError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}
          <Link href="/leiloes" prefetch={false}>
            <Button className="mt-4">Voltar para Leilões</Button>
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
          <Link href="/leiloes" prefetch={false}>
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar para Leilões
            </Button>
          </Link>
        </div>

        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Lance realizado com sucesso! O vendedor foi notificado.
            </AlertDescription>
          </Alert>
        )}

        {showError && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagem e Info Principal */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 overflow-hidden rounded-t-lg">
                  <img
                    src={auction.image_url || "https://images.unsplash.com/photo-1520990269031-f4f7b5e3e6a8?w=800&h=600&fit=crop"}
                    alt={auction.fish_name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white gap-2 text-lg px-4 py-2">
                    <Clock className="w-5 h-5" />
                    {calculateTimeLeft(auction.end_date)}
                  </Badge>
                </div>

                <div className="p-6">
                  <h1 className="text-3xl font-bold mb-2">{auction.fish_name}</h1>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <Link href={`/vendedores/${auction.seller_id}`} prefetch={false}>
                      <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                        <User className="w-4 h-4" />
                        <span>{auction.sellers?.name || "Vendedor"}</span>
                      </div>
                    </Link>
                    <Badge variant="secondary">
                      ⭐ {auction.sellers?.rating?.toFixed(1) || "0.0"} ({auction.sellers?.total_sales || 0} vendas)
                    </Badge>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {auction.description || "Sem descrição disponível"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">{bids.length} lances realizados</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Lances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Histórico de Lances (Tempo Real)
                </CardTitle>
                <CardDescription>Lances atualizados automaticamente</CardDescription>
              </CardHeader>
              <CardContent>
                {bids.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum lance ainda. Seja o primeiro!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bids.map((bid, index) => (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          index === 0 ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? "bg-green-500" : "bg-gray-300"
                          } text-white font-semibold`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{bid.user_name}</p>
                            <p className="text-sm text-gray-600">{formatTimeAgo(bid.created_at)}</p>
                          </div>
                        </div>
                        <p className={`text-xl font-bold ${
                          index === 0 ? "text-green-600" : "text-gray-700"
                        }`}>
                          R$ {bid.bid_value.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Dar Lance */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  Dar Lance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lance Atual</p>
                  <p className="text-4xl font-bold text-green-600">
                    R$ {auction.current_price.toFixed(2)}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Incremento mínimo:</strong> R$ {auction.min_increment.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <strong>Próximo lance mínimo:</strong> R$ {(auction.current_price + auction.min_increment).toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Seu Lance (R$)</label>
                  <Input
                    type="number"
                    placeholder={(auction.current_price + auction.min_increment).toFixed(2)}
                    value={lanceValue}
                    onChange={(e) => setLanceValue(e.target.value)}
                    min={auction.current_price + auction.min_increment}
                    step={auction.min_increment}
                    disabled={submitting}
                  />
                </div>

                <Button
                  className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  size="lg"
                  onClick={handleLance}
                  disabled={!lanceValue || parseFloat(lanceValue) < auction.current_price + auction.min_increment || submitting}
                >
                  <Gavel className="w-5 h-5" />
                  {submitting ? "Processando..." : "Confirmar Lance"}
                </Button>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Término:</span>
                    <span className="font-semibold">
                      {formatDate(auction.end_date)} às {formatTime(auction.end_date)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total de Lances:</span>
                    <span className="font-semibold">{bids.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
