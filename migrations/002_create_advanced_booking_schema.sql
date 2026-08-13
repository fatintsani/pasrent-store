-- Migration: 004_create_advanced_booking_schema.sql
-- Creates advanced schema for inventory, games, packages, and bookings

-- 1. Units Table (Inventory of consoles)
CREATE TABLE IF NOT EXISTS units (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL, -- e.g. "PS5 #01", "PS4 #03"
  type text NOT NULL, -- "PS4", "PS5"
  status text DEFAULT 'available', -- 'available', 'maintenance', 'rented'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Games Table (Catalog of games)
CREATE TABLE IF NOT EXISTS games (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL, -- e.g. "EA Sports FC 26"
  console_type text NOT NULL, -- "PS4", "PS5", "ALL"
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Rental Packages (2 Jam, 4 Jam, 12 Jam, Weekend)
CREATE TABLE IF NOT EXISTS rental_packages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL, -- e.g. "2 Jam", "Paket Midnight"
  duration_hours integer NOT NULL, -- 2, 4, 12, 24
  price decimal NOT NULL, -- 30000, 50000
  console_type text NOT NULL, -- "PS4", "PS5"
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bookings (Header / Cart / Transaction)
CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code text NOT NULL UNIQUE, -- e.g. "BKG-20260814-XYZ"
  customer_name text NOT NULL,
  customer_whatsapp text NOT NULL,
  customer_email text,
  delivery_address text,
  total_price decimal NOT NULL DEFAULT 0,
  payment_method text, -- 'qris', 'transfer', 'cod'
  payment_status text DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  status text DEFAULT 'pending', -- 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Booking Items (Specific units booked in a transaction)
CREATE TABLE IF NOT EXISTS booking_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
  rental_package_id uuid NOT NULL REFERENCES rental_packages(id) ON DELETE RESTRICT,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  extra_controllers integer DEFAULT 0,
  subtotal decimal NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Booking Item Games (Games chosen for a specific booked unit)
CREATE TABLE IF NOT EXISTS booking_item_games (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_item_id uuid NOT NULL REFERENCES booking_items(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(booking_item_id, game_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_item_games ENABLE ROW LEVEL SECURITY;

-- Allow public read for inventory and packages
CREATE POLICY "Public profiles are viewable by everyone" ON units FOR SELECT USING (true);
CREATE POLICY "Public games are viewable by everyone" ON games FOR SELECT USING (true);
CREATE POLICY "Public packages are viewable by everyone" ON rental_packages FOR SELECT USING (true);

-- Allow public insert for bookings and items
CREATE POLICY "Anyone can insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read their own bookings (via ID)" ON bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can update their bookings" ON bookings FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert booking items" ON booking_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read booking items" ON booking_items FOR SELECT USING (true);

CREATE POLICY "Anyone can insert booking games" ON booking_item_games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read booking games" ON booking_item_games FOR SELECT USING (true);
