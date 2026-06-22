-- ==========================================
-- DATABASE SETUP SQL FOR SUPABASE
-- ==========================================
-- FILE PURPOSE: Copy-paste ENTIRE file ke Supabase SQL Editor
-- EXECUTION ORDER: Tables → Indexes → RLS Policies → Triggers
-- 
-- UPDATED: Aligned with user spec
-- - Order statuses: Pending, Processing, Completed, Cancelled
-- - Points: 1 point per Rp10,000
-- - Tiers: Bronze 0-499, Silver 500-1499, Gold 1500-2999, Platinum 3000+
-- ==========================================

-- ==========================================
-- SECTION 1: TABLES
-- ==========================================

-- Drop existing old tables to avoid conflicts
DROP TABLE IF EXISTS public.tier_config CASCADE;
DROP TABLE IF EXISTS public.points_transactions CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.calculate_points_on_completed() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_points_on_delivery() CASCADE;
DROP FUNCTION IF EXISTS public.update_member_tier() CASCADE;
DROP FUNCTION IF EXISTS public.decrease_product_stock() CASCADE;
DROP FUNCTION IF EXISTS public.revert_product_stock_on_cancel() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- ========== TABLE: profiles ==========
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  tier VARCHAR(20) NOT NULL DEFAULT 'Bronze' 
    CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  total_points INT NOT NULL DEFAULT 0,
  accumulated_points INT NOT NULL DEFAULT 0,
  role VARCHAR(20) NOT NULL DEFAULT 'member' 
    CHECK (role IN ('admin', 'member')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- ========== TABLE: products ==========
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  price DECIMAL(15, 2) NOT NULL CHECK (price > 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- ========== TABLE: orders ==========
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending' 
    CHECK (status IN ('Pending', 'Processing', 'Completed', 'Cancelled')),
  total_amount DECIMAL(15, 2) NOT NULL CHECK (total_amount >= 0),
  discount_percentage INT DEFAULT 0,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  final_amount DECIMAL(15, 2) NOT NULL CHECK (final_amount >= 0),
  points_earned INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- ========== TABLE: order_items ==========
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(15, 2) NOT NULL CHECK (price_at_time > 0),
  subtotal DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== TABLE: points_transactions ==========
CREATE TABLE IF NOT EXISTS public.points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('earned', 'redeemed', 'adjusted')),
  points_amount INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'completed', 'canceled')),
  reason TEXT,
  tier_at_time VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== TABLE: tier_config ==========
CREATE TABLE IF NOT EXISTS public.tier_config (
  id INT PRIMARY KEY,
  tier_name VARCHAR(20) NOT NULL UNIQUE,
  min_points INT NOT NULL,
  max_points INT,
  discount_percentage INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert tier configuration data (aligned with user spec)
INSERT INTO public.tier_config (id, tier_name, min_points, max_points, discount_percentage) 
VALUES
  (1, 'Bronze', 0, 499, 5),
  (2, 'Silver', 500, 1499, 10),
  (3, 'Gold', 1500, 2999, 15),
  (4, 'Platinum', 3000, NULL, 20)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- SECTION 2: INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON public.profiles(tier);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON public.products(deleted_at);

CREATE INDEX IF NOT EXISTS idx_orders_member_id ON public.orders(member_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_completed_at ON public.orders(completed_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_points_transactions_member_id ON public.points_transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_order_id ON public.points_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_status ON public.points_transactions(status);
CREATE INDEX IF NOT EXISTS idx_points_transactions_type ON public.points_transactions(type);

-- ==========================================
-- SECTION 3: UPDATE TIMESTAMP TRIGGERS
-- ==========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_points_transactions_updated_at ON public.points_transactions;
CREATE TRIGGER trg_points_transactions_updated_at
BEFORE UPDATE ON public.points_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- SECTION 4: BUSINESS LOGIC TRIGGERS
-- ==========================================

-- ========== Trigger 1: Auto Calculate Points on Order Completed ==========
CREATE OR REPLACE FUNCTION public.calculate_points_on_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_points INT;
  v_member_tier VARCHAR;
BEGIN
  -- Only process when order status changes to "Completed"
  IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
    
    -- Calculate points: 1 point per Rp10,000 of final_amount
    v_points := FLOOR(NEW.final_amount / 10000)::INT;
    
    -- Get current tier of member
    v_member_tier := (SELECT tier FROM public.profiles WHERE id = NEW.member_id);
    
    -- Insert points transaction
    INSERT INTO public.points_transactions 
      (member_id, order_id, type, points_amount, status, reason, tier_at_time)
    VALUES 
      (NEW.member_id, NEW.id, 'earned', v_points, 'completed', 
       'Earned from order: ' || NEW.id, v_member_tier);
    
    -- Update order.points_earned
    NEW.points_earned := v_points;
    
    -- Update profile.total_points and accumulated_points
    UPDATE public.profiles 
    SET total_points = total_points + v_points,
        accumulated_points = accumulated_points + v_points
    WHERE id = NEW.member_id;
    
    -- Set completed_at timestamp
    NEW.completed_at := NOW();
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_points_on_completed ON public.orders;
CREATE TRIGGER trg_calculate_points_on_completed
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.calculate_points_on_completed();

-- ========== Trigger 2: Auto Update Tier when Points Change ==========
CREATE OR REPLACE FUNCTION public.update_member_tier()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET tier = CASE
    WHEN accumulated_points >= 3000 THEN 'Platinum'
    WHEN accumulated_points >= 1500 THEN 'Gold'
    WHEN accumulated_points >= 500 THEN 'Silver'
    ELSE 'Bronze'
  END
  WHERE id = NEW.member_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_tier_on_points ON public.points_transactions;
CREATE TRIGGER trg_update_tier_on_points
AFTER INSERT ON public.points_transactions
FOR EACH ROW
WHEN (NEW.status = 'completed' AND NEW.type = 'earned')
EXECUTE FUNCTION public.update_member_tier();

-- ========== Trigger 3: Decrease Product Stock when Order Items Added ==========
CREATE OR REPLACE FUNCTION public.decrease_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id 
    AND stock >= NEW.quantity;
  
  -- Check if update succeeded (stock was sufficient)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_decrease_stock ON public.order_items;
CREATE TRIGGER trg_decrease_stock
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.decrease_product_stock();

-- ========== Trigger 4: Revert Stock when Order Cancelled ==========
CREATE OR REPLACE FUNCTION public.revert_product_stock_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
    -- Revert stock for all items in the order
    UPDATE public.products
    SET stock = stock + oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id 
      AND public.products.id = oi.product_id;
    
    -- Cancel any pending points transactions for this order
    UPDATE public.points_transactions
    SET status = 'canceled'
    WHERE order_id = NEW.id AND status = 'pending';
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_revert_stock_on_cancel ON public.orders;
CREATE TRIGGER trg_revert_stock_on_cancel
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.revert_product_stock_on_cancel();

-- ========== Trigger 5: Auto Create Profile on Auth User Creation ==========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'member',
    'Bronze'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Helper function to avoid infinite recursion in RLS policies
-- This function uses SECURITY DEFINER to bypass RLS when checking user role
CREATE OR REPLACE FUNCTION public.get_user_role(uid UUID)
RETURNS VARCHAR
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = uid;
$$;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_config ENABLE ROW LEVEL SECURITY;

-- ========== PROFILES Table RLS ==========

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = public.get_user_role(auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- ========== PRODUCTS Table RLS ==========

DROP POLICY IF EXISTS "Everyone can view active products" ON public.products;
CREATE POLICY "Everyone can view active products"
  ON public.products
  FOR SELECT
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Only admins can insert products" ON public.products;
CREATE POLICY "Only admins can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Only admins can update products" ON public.products;
CREATE POLICY "Only admins can update products"
  ON public.products
  FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Only admins can delete products" ON public.products;
CREATE POLICY "Only admins can delete products"
  ON public.products
  FOR DELETE
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ========== ORDERS Table RLS ==========

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (
    auth.uid() = member_id OR
    public.get_user_role(auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Members can create own orders" ON public.orders;
CREATE POLICY "Members can create own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() = member_id AND
    public.get_user_role(auth.uid()) = 'member'
  );

DROP POLICY IF EXISTS "Only admins can update order status" ON public.orders;
CREATE POLICY "Only admins can update order status"
  ON public.orders
  FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ========== ORDER_ITEMS Table RLS ==========

DROP POLICY IF EXISTS "Users can view order items" ON public.order_items;
CREATE POLICY "Users can view order items"
  ON public.order_items
  FOR SELECT
  USING (
    auth.uid() = (SELECT member_id FROM public.orders WHERE id = order_id) OR
    public.get_user_role(auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Members can insert order items" ON public.order_items;
CREATE POLICY "Members can insert order items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT member_id FROM public.orders WHERE id = order_id) AND
    public.get_user_role(auth.uid()) = 'member'
  );

-- ========== POINTS_TRANSACTIONS Table RLS ==========

DROP POLICY IF EXISTS "Users can view own points transactions" ON public.points_transactions;
CREATE POLICY "Users can view own points transactions"
  ON public.points_transactions
  FOR SELECT
  USING (
    auth.uid() = member_id OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- ========== TIER_CONFIG Table RLS ==========

DROP POLICY IF EXISTS "Everyone can read tier config" ON public.tier_config;
CREATE POLICY "Everyone can read tier config"
  ON public.tier_config
  FOR SELECT
  USING (true);

-- ==========================================
-- SECTION 6: VERIFICATION QUERIES
-- ==========================================

-- Verify tables created
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Verify indexes
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public';

-- Verify RLS policies
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Verify functions
-- SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- ==========================================
-- END OF DATABASE SETUP
-- ==========================================
