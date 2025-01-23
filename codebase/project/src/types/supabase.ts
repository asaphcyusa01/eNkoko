export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          total: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'delivered'
          order_date: string
          category: 'marketplace' | 'hatchery'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone: string
          total: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'delivered'
          order_date?: string
          category: 'marketplace' | 'hatchery'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          total?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'delivered'
          order_date?: string
          category?: 'marketplace' | 'hatchery'
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          name: string
          quantity: number
          price: number
          category: 'product' | 'chick'
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          name: string
          quantity: number
          price: number
          category: 'product' | 'chick'
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          name?: string
          quantity?: number
          price?: number
          category?: 'product' | 'chick'
          created_at?: string
        }
      }
    }
  }
}