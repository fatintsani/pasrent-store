-- Migration: 005_seed_advanced_booking_data.sql
-- Seed data for testing the advanced booking schema

-- Insert Units
INSERT INTO units (name, type) VALUES
('PS4 #01', 'PS4'),
('PS4 #02', 'PS4'),
('PS4 #03', 'PS4'),
('PS5 #01', 'PS5'),
('PS5 #02', 'PS5'),
('PS5 #03', 'PS5');

-- Insert Games
INSERT INTO games (name, console_type, image_url) VALUES
('EA Sports FC 24', 'ALL', 'https://via.placeholder.com/150/0000FF/808080?Text=FC+24'),
('EA Sports FC 25', 'PS5', 'https://via.placeholder.com/150/0000FF/808080?Text=FC+25'),
('GTA V', 'ALL', 'https://via.placeholder.com/150/008000/FFFFFF?Text=GTA+V'),
('Tekken 8', 'PS5', 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Tekken+8'),
('eFootball 2024', 'ALL', 'https://via.placeholder.com/150/FFFF00/000000?Text=eFootball'),
('NBA 2K24', 'ALL', 'https://via.placeholder.com/150/FFA500/000000?Text=NBA+2K24');

-- Insert Rental Packages for PS4
INSERT INTO rental_packages (name, duration_hours, price, console_type) VALUES
('2 Jam', 2, 20000, 'PS4'),
('4 Jam', 4, 35000, 'PS4'),
('6 Jam', 6, 50000, 'PS4'),
('12 Jam', 12, 80000, 'PS4'),
('24 Jam', 24, 120000, 'PS4');

-- Insert Rental Packages for PS5
INSERT INTO rental_packages (name, duration_hours, price, console_type) VALUES
('2 Jam', 2, 40000, 'PS5'),
('4 Jam', 4, 75000, 'PS5'),
('6 Jam', 6, 110000, 'PS5'),
('12 Jam', 12, 180000, 'PS5'),
('24 Jam', 24, 250000, 'PS5');
