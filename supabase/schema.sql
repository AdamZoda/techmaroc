-- # TECHMAROC SUPABASE SCHEMA
-- Create a custom type for roles
CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');

-- 1. PROFILES (Extends Supabase Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    role user_role DEFAULT 'user',
    avatar_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    sub_categories JSONB DEFAULT '[]'::jsonb, -- Array of {id, name, image}
    filters JSONB DEFAULT '[]'::jsonb,        -- Array of FilterOption types
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    promo_price DECIMAL(12,2),
    category TEXT REFERENCES categories(id) ON DELETE SET NULL,
    sub_category TEXT,
    brand TEXT,
    image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    description TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    is_new BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_promo BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS
CREATE TABLE orders (
    id TEXT PRIMARY KEY, -- e.g., ORD-001
    user_id UUID REFERENCES profiles(id),
    customer_name TEXT NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, shipped, delivered, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER ITEMS
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(12,2) NOT NULL
);

-- 6. SITE CONFIG
CREATE TABLE site_config (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Only one row allowed
    logo TEXT DEFAULT 'TECHMAROC',
    logo_url TEXT,
    primary_color TEXT DEFAULT '#7c3aed',
    tax_rate INTEGER DEFAULT 20,
    hero JSONB DEFAULT '{"image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop", "video_url": "", "bg_type": "image", "title": "LEVEL UP YOUR GAMING EXPERIENCE", "subtitle": "Découvrez nos PC Gamer assemblés avec passion pour des performances extrêmes."}'::jsonb,
    contact JSONB DEFAULT '{"email": "contact@techmaroc.com", "phone": "+212 5 22 00 00 00", "address": "123 Boulevard Zerktouni, Casablanca, Maroc"}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STORES
CREATE TABLE stores (
    id TEXT PRIMARY KEY,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    hours TEXT,
    map_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PARTNERS
CREATE TABLE partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- # SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Utility function to check if user is admin or superadmin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role IN ('admin', 'superadmin') 
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ## Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ## Policies for Categories, Products, Stores, Partners, SiteConfig
-- (Read for everyone, Write only for Admins)
CREATE POLICY "Enable read for everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable write for admins" ON categories FOR ALL USING (is_admin());

CREATE POLICY "Enable read for everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Enable write for admins" ON products FOR ALL USING (is_admin());

CREATE POLICY "Enable read for everyone" ON stores FOR SELECT USING (true);
CREATE POLICY "Enable write for admins" ON stores FOR ALL USING (is_admin());

CREATE POLICY "Enable read for everyone" ON partners FOR SELECT USING (true);
CREATE POLICY "Enable write for admins" ON partners FOR ALL USING (is_admin());

CREATE POLICY "Enable read for everyone" ON site_config FOR SELECT USING (true);
CREATE POLICY "Enable write for admins" ON site_config FOR ALL USING (is_admin());

-- ## Policies for Orders
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (is_admin());

-- # TRIGGERS
-- Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
