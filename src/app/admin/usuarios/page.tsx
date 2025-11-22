"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados mockados com estado para permitir exclusão
  const [usuarios, setUsuarios] = useState([
    {
      id: "1",
      name: "João Silva",
      phone: "(11) 98765-4321",
      whatsapp: "(11) 98765-4321",
      cep: "01310-100",
      city: "São Paulo",
      address: "Av. Paulista, 1000",
      role: "user",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Maria Santos",
      phone: "(21) 97654-3210",
      whatsapp: "(21) 97654-3210",
      cep: "20040-020",
      city: "Rio de Janeiro",
      address: "Rua da Carioca, 50",
      role: "user",
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Pedro Oliveira",
      phone: "(31) 96543-2109",
      whatsapp: "(31) 96543-2109",
      cep: "30130-010",
      city: "Belo Horizonte",
      address: "Av. Afonso Pena, 500",
      role: "user",
      createdAt: "2024-02-01",
    },
  ]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${name}"?`)) {
      setUsuarios(usuarios.filter(user => user.id !== id));
      alert(`Usuário "${name}" excluído com sucesso!`);
    }
  };

  const filteredUsuarios = usuarios.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciar Usuários</h1>
          <p className="text-gray-600">Cadastro e gestão de usuários da plataforma</p>
        </div>
        <Link href="/admin/usuarios/novo">
          <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Plus className="w-4 h-4" />
            Novo Usuário
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold mb-1">{usuarios.length}</div>
            <p className="text-sm text-gray-600">Total de Usuários</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold mb-1 text-green-600">
              {usuarios.filter(u => u.role === "user").length}
            </div>
            <p className="text-sm text-gray-600">Usuários Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold mb-1 text-blue-600">
              {usuarios.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-sm text-gray-600">Novos (30 dias)</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsuarios.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{user.name}</CardTitle>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                      <Badge variant="outline" className="ml-2">WhatsApp: {user.whatsapp}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{user.address}, {user.city} - CEP: {user.cep}</span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(user.id, user.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {filteredUsuarios.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum usuário encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
