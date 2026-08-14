-- Migration: 004_add_advanced_features_to_bookings.sql
-- Adds internal notes and booking status logs for advanced tracking.

-- 1. Add internal_notes to bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS internal_notes text;

-- 2. Create booking_status_logs table for Audit Trail
CREATE TABLE IF NOT EXISTS booking_status_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_by text DEFAULT 'System/Admin',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Add Row Level Security (RLS) for logs
ALTER TABLE booking_status_logs ENABLE ROW LEVEL SECURITY;

-- Allow public insert (or admin if auth exists)
CREATE POLICY "Anyone can insert booking logs" ON booking_status_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read booking logs" ON booking_status_logs FOR SELECT USING (true);
