export interface Product {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  description_fr?: string;
  description_ar?: string;
  category_id?: string;
  category?: Category;
  price: number;
  original_price?: number;
  stock: number;
  sku?: string;
  images: string[];
  thumbnail?: string;
  notes_top?: string[];
  notes_heart?: string[];
  notes_base?: string[];
  gender: 'homme' | 'femme' | 'mixte';
  size_ml?: number;
  concentration?: 'EDP' | 'EDT' | 'EDC' | 'Parfum' | 'Huile';
  brand?: string;
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  description_fr?: string;
  description_ar?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address_city: string;
  address_street: string;
  address_zip?: string;
  address_notes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  status: OrderStatus;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface CartItem {
  product: Product;
  qty: number;
}

export type Language = 'fr' | 'ar';
