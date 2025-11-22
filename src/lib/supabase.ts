import { createClient } from '@supabase/supabase-js';

// Valores placeholder válidos para desenvolvimento
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

// Validação para garantir que a URL seja válida
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

// Verificar se está usando configuração placeholder
const isPlaceholderConfig = supabaseUrl === 'https://placeholder.supabase.co' || 
                            !process.env.NEXT_PUBLIC_SUPABASE_URL;

// Criar cliente apenas se a URL for válida
export const supabase = isValidUrl(supabaseUrl) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', supabaseAnonKey);

// Tipos para o banco de dados
export type Seller = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf_cnpj: string | null;
  address: string | null;
  bio: string | null;
  avatar_url: string | null;
  rating: number;
  total_sales: number;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
};

export type Auction = {
  id: string;
  fish_name: string;
  description: string | null;
  starting_price: number;
  current_price: number;
  min_increment: number;
  end_date: string;
  seller_id: string;
  image_url: string | null;
  status: 'active' | 'finished' | 'cancelled';
  winner_id: string | null;
  created_at: string;
};

export type Bid = {
  id: string;
  auction_id: string;
  user_id: string;
  user_name: string;
  bid_value: number;
  created_at: string;
};

export type Sale = {
  id: string;
  fish_name: string;
  description: string | null;
  price: number;
  seller_id: string;
  buyer_id: string | null;
  image_url: string | null;
  status: 'available' | 'sold' | 'reserved';
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: 'new_bid' | 'auction_won' | 'auction_ended' | 'sale_completed';
  title: string;
  message: string;
  auction_id: string | null;
  sale_id: string | null;
  read: boolean;
  created_at: string;
};

// Função auxiliar para verificar configuração
function checkSupabaseConfig() {
  if (isPlaceholderConfig) {
    throw new Error('Supabase não configurado. Configure suas credenciais nas variáveis de ambiente.');
  }
}

// Funções auxiliares para lances
export async function placeBid(auctionId: string, userId: string, userName: string, bidValue: number) {
  checkSupabaseConfig();
  
  const { data, error } = await supabase
    .from('bids')
    .insert({
      auction_id: auctionId,
      user_id: userId,
      user_name: userName,
      bid_value: bidValue,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao dar lance:', error);
    throw new Error(error.message || 'Erro ao processar lance');
  }
  return data;
}

export async function getAuctionBids(auctionId: string) {
  checkSupabaseConfig();
  
  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('auction_id', auctionId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar lances:', error);
    throw new Error(error.message || 'Erro ao carregar lances');
  }
  return data || [];
}

export async function getAuction(auctionId: string) {
  checkSupabaseConfig();
  
  const { data, error } = await supabase
    .from('auctions')
    .select(`
      *,
      sellers (
        id,
        name,
        rating,
        total_sales
      )
    `)
    .eq('id', auctionId)
    .single();

  if (error) {
    console.error('Erro ao buscar leilão:', error);
    throw new Error(error.message || 'Erro ao carregar leilão');
  }
  
  if (!data) {
    throw new Error('Leilão não encontrado');
  }
  
  return data;
}

export async function getUserNotifications(userId: string) {
  checkSupabaseConfig();
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar notificações:', error);
    throw new Error(error.message || 'Erro ao carregar notificações');
  }
  return data || [];
}

export async function markNotificationAsRead(notificationId: string) {
  checkSupabaseConfig();
  
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw new Error(error.message || 'Erro ao atualizar notificação');
  }
}

// Função para subscrever a notificações em tempo real
export function subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
  if (isPlaceholderConfig) {
    console.warn('Supabase não configurado. Subscriptions em tempo real não funcionarão.');
    return { unsubscribe: () => {} };
  }
  
  return supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();
}

// Função para subscrever a lances em tempo real
export function subscribeToAuctionBids(auctionId: string, callback: (bid: Bid) => void) {
  if (isPlaceholderConfig) {
    console.warn('Supabase não configurado. Subscriptions em tempo real não funcionarão.');
    return { unsubscribe: () => {} };
  }
  
  return supabase
    .channel(`auction-${auctionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'bids',
        filter: `auction_id=eq.${auctionId}`,
      },
      (payload) => {
        callback(payload.new as Bid);
      }
    )
    .subscribe();
}

export async function getSeller(sellerId: string) {
  checkSupabaseConfig();
  
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', sellerId)
    .single();

  if (error) {
    console.error('Erro ao buscar vendedor:', error);
    throw new Error(error.message || 'Erro ao carregar vendedor');
  }
  
  if (!data) {
    throw new Error('Vendedor não encontrado');
  }
  
  return data;
}

export async function getSellerAuctions(sellerId: string) {
  checkSupabaseConfig();
  
  const { data, error } = await supabase
    .from('auctions')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar leilões do vendedor:', error);
    throw new Error(error.message || 'Erro ao carregar leilões');
  }
  return data || [];
}

export async function getSellerSales(sellerId: string) {
  checkSupabaseConfig();
  
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar vendas do vendedor:', error);
    throw new Error(error.message || 'Erro ao carregar vendas');
  }
  return data || [];
}
