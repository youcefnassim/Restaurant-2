-- =====================================================================
-- MENUORA SaaS — Multi-Tenant PostgreSQL Schema with Supabase RLS
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'restaurant_owner', 'restaurant_staff');
CREATE TYPE restaurant_status AS ENUM ('active', 'suspended', 'trial');
CREATE TYPE subscription_status AS ENUM ('active', 'trial', 'past_due', 'canceled', 'expired');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'completed', 'cancelled');
CREATE TYPE order_type AS ENUM ('dine_in', 'takeaway', 'delivery');

-- 3. PROFILES TABLE (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'restaurant_owner',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SUBSCRIPTION PLANS TABLE
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0,
    price_yearly NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'DZD',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    max_products INTEGER NOT NULL DEFAULT 50,
    max_categories INTEGER NOT NULL DEFAULT 10,
    max_qr_codes INTEGER NOT NULL DEFAULT 5,
    can_customize_theme BOOLEAN NOT NULL DEFAULT false,
    can_order_online BOOLEAN NOT NULL DEFAULT false,
    can_view_advanced_stats BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. RESTAURANTS TABLE (Multi-tenant core)
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    address TEXT,
    phone TEXT,
    wifi_password TEXT,
    opening_hours JSONB DEFAULT '{"monday": "10:00 - 23:00", "tuesday": "10:00 - 23:00", "wednesday": "10:00 - 23:00", "thursday": "10:00 - 23:00", "friday": "15:00 - 00:00", "saturday": "10:00 - 00:00", "sunday": "10:00 - 23:00"}'::jsonb,
    social_links JSONB DEFAULT '{"instagram": "", "facebook": "", "tiktok": ""}'::jsonb,
    gps_coordinates JSONB DEFAULT '{"lat": 36.7538, "lng": 3.0588}'::jsonb,
    default_language TEXT NOT NULL DEFAULT 'fr',
    currency TEXT NOT NULL DEFAULT 'DZD',
    status restaurant_status NOT NULL DEFAULT 'active',
    is_ordering_enabled BOOLEAN NOT NULL DEFAULT false,
    whatsapp_number TEXT,
    table_count INTEGER NOT NULL DEFAULT 15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. RESTAURANT MEMBERS (Team access: managers, staff)
CREATE TABLE IF NOT EXISTS public.restaurant_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'staff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(restaurant_id, user_id)
);

-- 7. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_ar TEXT,
    name_en TEXT,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_ar TEXT,
    name_en TEXT,
    description TEXT,
    description_ar TEXT,
    description_en TEXT,
    image_url TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    prep_time_minutes INTEGER,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PRODUCT VARIANTS (Sizes, portions)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_ar TEXT,
    name_en TEXT,
    price_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PRODUCT EXTRAS / TOPPINGS
CREATE TABLE IF NOT EXISTS public.product_extras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_ar TEXT,
    name_en TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. RESTAURANT THEMES (Customization engine)
CREATE TABLE IF NOT EXISTS public.restaurant_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL UNIQUE REFERENCES public.restaurants(id) ON DELETE CASCADE,
    primary_color TEXT NOT NULL DEFAULT '#E76F35',
    secondary_color TEXT NOT NULL DEFAULT '#222222',
    font_family TEXT NOT NULL DEFAULT 'Plus Jakarta Sans',
    card_style TEXT NOT NULL DEFAULT 'modern', -- modern, compact, visual
    category_style TEXT NOT NULL DEFAULT 'pill', -- pill, tabs, grid
    theme_mode TEXT NOT NULL DEFAULT 'light', -- light, dark, auto
    banner_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. QR CODES TABLE
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number INTEGER,
    label TEXT NOT NULL,
    qr_slug TEXT NOT NULL,
    scan_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(restaurant_id, table_number)
);

-- 13. MENU VIEWS / ANALYTICS
CREATE TABLE IF NOT EXISTS public.menu_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    qr_code_id UUID REFERENCES public.qr_codes(id) ON DELETE SET NULL,
    table_number INTEGER,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_agent TEXT,
    referrer TEXT,
    language TEXT DEFAULT 'fr'
);

-- 14. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status subscription_status NOT NULL DEFAULT 'trial',
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'DZD',
    payment_method TEXT NOT NULL, -- cash, ccp, baridimob, bank_transfer
    status TEXT NOT NULL DEFAULT 'completed',
    reference_number TEXT,
    notes TEXT,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. ORDERS (Optional WhatsApp / Dine-in queue)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number INTEGER,
    customer_name TEXT,
    customer_phone TEXT,
    order_type order_type NOT NULL DEFAULT 'dine_in',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status order_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_owner ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON public.categories(restaurant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_restaurant ON public.products(restaurant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id, is_available);
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_extras_product ON public.product_extras(product_id);
CREATE INDEX IF NOT EXISTS idx_menu_views_restaurant_time ON public.menu_views(restaurant_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_qr_codes_restaurant ON public.qr_codes(restaurant_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user owns or manages restaurant
CREATE OR REPLACE FUNCTION public.can_manage_restaurant(rest_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        public.is_super_admin() OR
        EXISTS (
            SELECT 1 FROM public.restaurants
            WHERE id = rest_id AND owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.restaurant_members
            WHERE restaurant_id = rest_id AND user_id = auth.uid()
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can read their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND (role = 'restaurant_owner' OR public.is_super_admin()));

-- PUBLIC RESTAURANTS (Public Menu Access)
CREATE POLICY "Anyone can view active restaurants"
    ON public.restaurants FOR SELECT
    USING (status = 'active' OR public.can_manage_restaurant(id));

CREATE POLICY "Owners can update their restaurant"
    ON public.restaurants FOR UPDATE
    USING (public.can_manage_restaurant(id));

CREATE POLICY "Owners can insert their restaurant"
    ON public.restaurants FOR INSERT
    WITH CHECK (auth.uid() = owner_id OR public.is_super_admin());

-- CATEGORIES & PRODUCTS (Public read, Owner manage)
CREATE POLICY "Public read active categories"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Owners manage categories"
    ON public.categories FOR ALL
    USING (public.can_manage_restaurant(restaurant_id));

CREATE POLICY "Public read products"
    ON public.products FOR SELECT
    USING (true);

CREATE POLICY "Owners manage products"
    ON public.products FOR ALL
    USING (public.can_manage_restaurant(restaurant_id));

-- VARIANTS & EXTRAS
CREATE POLICY "Public read variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Owners manage variants" ON public.product_variants FOR ALL
    USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND public.can_manage_restaurant(p.restaurant_id)));

CREATE POLICY "Public read extras" ON public.product_extras FOR SELECT USING (true);
CREATE POLICY "Owners manage extras" ON public.product_extras FOR ALL
    USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND public.can_manage_restaurant(p.restaurant_id)));

-- THEMES
CREATE POLICY "Public read themes" ON public.restaurant_themes FOR SELECT USING (true);
CREATE POLICY "Owners manage themes" ON public.restaurant_themes FOR ALL
    USING (public.can_manage_restaurant(restaurant_id));

-- QR CODES
CREATE POLICY "Public read qr codes" ON public.qr_codes FOR SELECT USING (true);
CREATE POLICY "Owners manage qr codes" ON public.qr_codes FOR ALL
    USING (public.can_manage_restaurant(restaurant_id));

-- MENU VIEWS (Insert allowed by anyone, read by restaurant owners/super admin)
CREATE POLICY "Anyone can record menu view" ON public.menu_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners view restaurant analytics" ON public.menu_views FOR SELECT
    USING (public.can_manage_restaurant(restaurant_id));

-- SUBSCRIPTION PLANS (Public read active, Super admin manage)
CREATE POLICY "Public read plans" ON public.subscription_plans FOR SELECT USING (is_active = true OR public.is_super_admin());
CREATE POLICY "Super admin manage plans" ON public.subscription_plans FOR ALL USING (public.is_super_admin());

-- SUBSCRIPTIONS & PAYMENTS
CREATE POLICY "Owners read their subscriptions" ON public.subscriptions FOR SELECT USING (public.can_manage_restaurant(restaurant_id));
CREATE POLICY "Super admin manage subscriptions" ON public.subscriptions FOR ALL USING (public.is_super_admin());

CREATE POLICY "Owners read their payments" ON public.payments FOR SELECT USING (public.can_manage_restaurant(restaurant_id));
CREATE POLICY "Super admin manage payments" ON public.payments FOR ALL USING (public.is_super_admin());

-- ORDERS
CREATE POLICY "Customers create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners manage restaurant orders" ON public.orders FOR ALL USING (public.can_manage_restaurant(restaurant_id));

