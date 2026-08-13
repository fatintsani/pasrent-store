-- Migration: 007_drop_pesanan_sewa.sql
-- Drop the obsolete pesanan_sewa table as it has been replaced by the advanced bookings schema

DROP TABLE IF EXISTS pesanan_sewa CASCADE;
