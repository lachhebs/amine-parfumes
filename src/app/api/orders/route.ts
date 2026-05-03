/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customer_name, customer_phone, customer_email,
      address_city, address_street, address_zip, address_notes,
      items, subtotal, shipping_cost, total, payment_method,
    } = body;

    if (!customer_name || !customer_phone || !address_city || !address_street) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data, error } = await db
      .from('orders')
      .insert({
        order_number: '', // Trigger will set it
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        address_city,
        address_street,
        address_zip: address_zip || null,
        address_notes: address_notes || null,
        items,
        subtotal,
        shipping_cost,
        total,
        payment_method: payment_method || 'cash_on_delivery',
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Log status history
    await db.from('order_status_history').insert({
      order_id: data.id,
      status: 'pending',
      note: 'Commande créée',
    });

    return NextResponse.json({ order_number: data.order_number, id: data.id });
  } catch (err: any) {
    console.error('Order error:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
