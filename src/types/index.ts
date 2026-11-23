export type UserRole = 'super_admin' | 'restaurant_owner' | 'restaurant_staff';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  restaurant_id?: string; // Quick reference for single-restaurant owners
  created_at: string;
}

export type RestaurantStatus = 'active' | 'suspended';

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
}

export interface GPSCoordinates {
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  cover_url: string;
  address: string;
  phone: string;
  wifi_password?: string;
  opening_hours: OpeningHours;
  social_links: SocialLinks;
  gps_coordinates: GPSCoordinates;
  default_language: 'fr' | 'ar' | 'en';
  currency: string; // e.g. 'DZD', 'EUR', 'USD'
  status: RestaurantStatus;
  is_ordering_enabled: boolean;
  whatsapp_number?: string;
  table_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  price_adjustment: number; // e.g. +200 DZD
  is_default?: boolean;
}

export interface ProductExtra {
  id: string;
  product_id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  price: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  image_url: string;
  price: number;
  is_available: boolean;
  is_popular: boolean;
  prep_time_minutes?: number;
  sort_order: number;
  variants?: ProductVariant[];
  extras?: ProductExtra[];
  created_at: string;
  updated_at: string;
}

export type CardStyle = 'modern' | 'compact' | 'visual';
export type CategoryStyle = 'pill' | 'tabs' | 'grid';
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface RestaurantTheme {
  id: string;
  restaurant_id: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  card_style: CardStyle;
  category_style: CategoryStyle;
  theme_mode: ThemeMode;
  banner_url?: string;
  created_at: string;
  updated_at: string;
}

export interface QrCode {
  id: string;
  restaurant_id: string;
  table_number?: number;
  label: string;
  qr_slug: string;
  scan_count: number;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: 'starter' | 'professional' | 'business';
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: string[];
  max_products: number;
  max_categories: number;
  max_qr_codes: number;
  can_customize_theme: boolean;
  can_order_online: boolean;
  can_view_advanced_stats: boolean;
  is_active: boolean;
  is_popular?: boolean;
}

export interface Subscription {
  id: string;
  restaurant_id: string;
  plan_id: string;
  status: 'active' | 'trial' | 'past_due' | 'canceled' | 'expired';
  start_date: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  selected_variant?: { name: string; price_adjustment: number };
  selected_extras: { name: string; price: number }[];
  unit_price: number;
  quantity: number;
  instructions?: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_number?: number;
  customer_name?: string;
  customer_phone?: string;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface MenuView {
  id: string;
  restaurant_id: string;
  qr_code_id?: string;
  table_number?: number;
  viewed_at: string;
  user_agent?: string;
  language: string;
}

export interface RestaurantMember {
  id: string;
  restaurant_id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: 'owner' | 'manager' | 'staff';
  created_at: string;
}

