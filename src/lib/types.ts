// Tipos do Sistema de Leilão de Peixes Ornamentais

export type UserRole = 'admin' | 'user' | 'seller';

export interface User {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  cep: string;
  city: string;
  address: string;
  role: UserRole;
  createdAt: Date;
}

export interface Seller extends User {
  role: 'seller';
  greenhouseName: string; // Nome da estufa ou criatório
  verified: boolean;
}

export type AuctionDuration = '2h' | '4h' | '6h' | '8h' | '24h';
export type AuctionType = 'incremental' | 'single-bid'; // Lance incremental ou lance único

export interface Fish {
  id: string;
  name: string;
  age: string;
  lineage: string; // Linhagem
  videoUrl?: string;
  images: string[];
  description?: string;
}

export interface Auction {
  id: string;
  sellerId: string;
  seller: Seller;
  fish: Fish;
  type: AuctionType;
  duration: AuctionDuration;
  startPrice: number;
  currentPrice: number;
  bidIncrement: number; // Incremento de R$ 1,00
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'active' | 'ended' | 'cancelled';
  winnerId?: string;
  bids: Bid[];
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  user: User;
  amount: number;
  timestamp: Date;
}

export interface Sale {
  id: string;
  sellerId: string;
  seller: Seller;
  fish: Fish;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  createdAt: Date;
  soldAt?: Date;
  buyerId?: string;
}

export interface Stats {
  totalUsers: number;
  totalSellers: number;
  activeAuctions: number;
  totalSales: number;
  revenue: number;
}
