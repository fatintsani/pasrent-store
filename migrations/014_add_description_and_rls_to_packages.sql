-- Migration: 014_add_description_and_rls_to_packages.sql
-- Adds description column to rental_packages and enables INSERT/UPDATE/DELETE policies for admin tables

ALTER TABLE rental_packages ADD COLUMN IF NOT EXISTS description text;

-- Add RLS policies for rental_packages
CREATE POLICY "Enable insert for all users" ON rental_packages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON rental_packages FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON rental_packages FOR DELETE USING (true);

-- Add RLS policies for games (to prevent the same error when adding games later)
CREATE POLICY "Enable insert for all users" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON games FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON games FOR DELETE USING (true);
