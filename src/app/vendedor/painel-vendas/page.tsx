"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, DollarSign, Truck, CheckCircle, Clock, Search } from "lucide-react";
import Link from "next/link";

type StatusPedido = "recebido" | "pago" | "enviado" | "entregue";

interface Pedido {
  id: string;
  nomeAnimal: string;
  comprador: string;
  valor: number;
  status: StatusPedido;
  dataCompra: string;
  codigoRastreio?: string;
}

export default function PainelVendas() {
  const [pedidos] = useState<Pedido[]>([
    {
      id: "001",
      nomeAnimal: "Cavalo Mangalarga",
      comprador: "João Silva",
      valor: 15000,
      status: "entregue",
      dataCompra: "2024-01-15",
      codigoRastreio: "BR123456789",
    },
    {
      id: "002",
      nomeAnimal: "Égua Quarto de Milha",
      comprador: "Maria Santos",
      valor: 22000,
      status: "enviado",
      dataCompra: "2024-01-18",
      codigoRastreio: "BR987654321",
    },
    {
      id: "003",
      nomeAnimal: "Potro Crioulo",
      comprador: "Carlos Oliveira",
      valor: 8500,
      status: "pago",
      dataCompra: "2024-01-20",
    },
    {
      id: "004",
      nomeAnimal: "Cavalo Árabe",
      comprador: "Ana Costa",
      valor: 35000,
      status: "recebido",
      dataCompra: "2024-01-22",
    },
  ]);

  const [filtroStatus, setFiltroStatus] = useState<StatusPedido | "todos">("todos");
  const [busca, setBusca] = useState("");
  const [codigoRastreio, setCodigoRastreio] = useState<{ [key: string]: string }>({});

  const getStatusBadge = (status: StatusPedido) => {
    const configs = {
      recebido: { label: "Pedido Recebido", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      pago: { label: "Pago", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      enviado: { label: "Enviado", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
      entregue: { label: "Entregue", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    };
    return configs[status];
  };

  const getStatusIcon = (status: StatusPedido) => {
    const icons = {
      recebido: <Package className="w-5 h-5" />,
      pago: <DollarSign className="w-5 h-5" />,
      enviado: <Truck className="w-5 h-5" />,
      entregue: <CheckCircle className="w-5 h-5" />,
    };
    return icons[status];
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchStatus = filtroStatus === "todos" || pedido.status === filtroStatus;
    const matchBusca = pedido.nomeAnimal.toLowerCase().includes(busca.toLowerCase()) ||
                       pedido.comprador.toLowerCase().includes(busca.toLowerCase()) ||
                       pedido.id.includes(busca);
    return matchStatus && matchBusca;
  });

  const handleAdicionarRastreio = (pedidoId: string) => {
    console.log(`Código de rastreio adicionado para pedido ${pedidoId}:`, codigoRastreio[pedidoId]);
    // Aqui você implementaria a lógica de salvar no banco
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/vendedor">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Painel
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Painel de Vendas
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Acompanhe o status de todos os seus pedidos
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por animal, comprador ou ID..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro de Status */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filtroStatus === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("todos")}
                >
                  Todos
                </Button>
                <Button
                  variant={filtroStatus === "recebido" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("recebido")}
                >
                  Recebidos
                </Button>
                <Button
                  variant={filtroStatus === "pago" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("pago")}
                >
                  Pagos
                </Button>
                <Button
                  variant={filtroStatus === "enviado" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("enviado")}
                >
                  Enviados
                </Button>
                <Button
                  variant={filtroStatus === "entregue" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("entregue")}
                >
                  Entregues
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido) => {
            const statusConfig = getStatusBadge(pedido.status);
            return (
              <Card key={pedido.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{pedido.nomeAnimal}</CardTitle>
                        <Badge className={statusConfig.className}>
                          {getStatusIcon(pedido.status)}
                          <span className="ml-2">{statusConfig.label}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        Pedido #{pedido.id} • Comprador: {pedido.comprador} • Data: {new Date(pedido.dataCompra).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        R$ {pedido.valor.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Timeline de Status */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`flex items-center gap-2 ${pedido.status === "recebido" || pedido.status === "pago" || pedido.status === "enviado" || pedido.status === "entregue" ? "text-green-600" : "text-slate-400"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pedido.status === "recebido" || pedido.status === "pago" || pedido.status === "enviado" || pedido.status === "entregue" ? "bg-green-100 dark:bg-green-900" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">Recebido</span>
                    </div>
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700">
                      <div className={`h-full ${pedido.status === "pago" || pedido.status === "enviado" || pedido.status === "entregue" ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"}`} />
                    </div>
                    <div className={`flex items-center gap-2 ${pedido.status === "pago" || pedido.status === "enviado" || pedido.status === "entregue" ? "text-green-600" : "text-slate-400"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pedido.status === "pago" || pedido.status === "enviado" || pedido.status === "entregue" ? "bg-green-100 dark:bg-green-900" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">Pago</span>
                    </div>
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700">
                      <div className={`h-full ${pedido.status === "enviado" || pedido.status === "entregue" ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"}`} />
                    </div>
                    <div className={`flex items-center gap-2 ${pedido.status === "enviado" || pedido.status === "entregue" ? "text-green-600" : "text-slate-400"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pedido.status === "enviado" || pedido.status === "entregue" ? "bg-green-100 dark:bg-green-900" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">Enviado</span>
                    </div>
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700">
                      <div className={`h-full ${pedido.status === "entregue" ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"}`} />
                    </div>
                    <div className={`flex items-center gap-2 ${pedido.status === "entregue" ? "text-green-600" : "text-slate-400"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pedido.status === "entregue" ? "bg-green-100 dark:bg-green-900" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">Entregue</span>
                    </div>
                  </div>

                  {/* Código de Rastreio */}
                  {pedido.status === "pago" && !pedido.codigoRastreio && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Adicione o código de rastreio para atualizar o status para "Enviado"
                      </p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite o código de rastreio"
                          value={codigoRastreio[pedido.id] || ""}
                          onChange={(e) => setCodigoRastreio({ ...codigoRastreio, [pedido.id]: e.target.value })}
                        />
                        <Button onClick={() => handleAdicionarRastreio(pedido.id)}>
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  )}

                  {pedido.codigoRastreio && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Código de Rastreio:</p>
                      <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{pedido.codigoRastreio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {pedidosFiltrados.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  Nenhum pedido encontrado com os filtros selecionados
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
