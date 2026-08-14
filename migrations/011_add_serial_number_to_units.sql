-- Migration: 011_add_serial_number_to_units.sql
-- Adds the serial_number column to the units table

ALTER TABLE units ADD COLUMN IF NOT EXISTS serial_number text;
