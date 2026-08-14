-- Migration: 012_add_units_rls_policies.sql
-- Adds RLS policies to allow inserting, updating, and deleting units

-- Allow insert
CREATE POLICY "Enable insert for all users" ON units 
FOR INSERT 
WITH CHECK (true);

-- Allow update
CREATE POLICY "Enable update for all users" ON units 
FOR UPDATE 
USING (true) WITH CHECK (true);

-- Allow delete
CREATE POLICY "Enable delete for all users" ON units 
FOR DELETE 
USING (true);
