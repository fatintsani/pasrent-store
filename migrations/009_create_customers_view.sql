-- Create a view for aggregated customer data from bookings
CREATE OR REPLACE VIEW customers_view AS
SELECT 
  customer_whatsapp,
  MAX(customer_name) as customer_name,
  MAX(customer_email) as customer_email,
  COUNT(id) as total_bookings,
  SUM(total_price) as total_spent,
  MAX(created_at) as last_booking_date
FROM bookings
GROUP BY customer_whatsapp;

-- Grant access to the view for authenticated users
GRANT SELECT ON customers_view TO authenticated;
GRANT SELECT ON customers_view TO anon;
