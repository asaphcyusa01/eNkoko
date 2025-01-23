import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Order = Database['public']['Tables']['orders']['Row'] & {
  items: Database['public']['Tables']['order_items']['Row'][]
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    subscribeToOrders();

    return () => {
      supabase.channel('orders').unsubscribe();
    };
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(orders as Order[]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  function subscribeToOrders() {
    supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: order } = await supabase
              .from('orders')
              .select(`
                *,
                items:order_items(*)
              `)
              .eq('id', payload.new.id)
              .single();

            if (order) {
              setOrders(prev => [order as Order, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => 
              prev.map(order => 
                order.id === payload.new.id 
                  ? { ...order, ...payload.new }
                  : order
              )
            );
          }
        }
      )
      .subscribe();
  }

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  }

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refreshOrders: fetchOrders
  };
}