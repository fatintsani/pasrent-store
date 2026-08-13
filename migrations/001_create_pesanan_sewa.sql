-- Migration: Create pesanan_sewa table for Booking System
-- Run this in your Supabase SQL Editor

CREATE TABLE pesanan_sewa (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_lengkap text NOT NULL,
  no_whatsapp text NOT NULL,
  tipe_konsol text NOT NULL,
  durasi_sewa text NOT NULL,
  tanggal_booking date NOT NULL,
  waktu_booking time NOT NULL,
  alamat_pengiriman text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
