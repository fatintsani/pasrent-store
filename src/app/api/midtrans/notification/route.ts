import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verify Signature Key
    // signature_key = SHA512(order_id + status_code + gross_amount + server_key)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;
    
    const hash = crypto.createHash('sha512').update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest('hex');
    
    if (hash !== signature_key) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let newPaymentStatus = 'pending';
    
    if (transaction_status === 'capture') {
        if (fraud_status === 'challenge') {
            newPaymentStatus = 'challenge';
        } else if (fraud_status === 'accept') {
            newPaymentStatus = 'paid';
        }
    } else if (transaction_status === 'settlement') {
        newPaymentStatus = 'paid';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
        newPaymentStatus = 'failed';
    } else if (transaction_status === 'pending') {
        newPaymentStatus = 'pending';
    }

    // Update the booking in Supabase
    // Assume we update both payment_status and overall status
    let newStatus = 'pending';
    if (newPaymentStatus === 'paid') newStatus = 'confirmed';
    if (newPaymentStatus === 'failed') newStatus = 'cancelled';

    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: newPaymentStatus,
        status: newStatus
      })
      .eq('booking_code', order_id);

    if (error) {
      console.error('Failed to update booking status in Supabase:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
