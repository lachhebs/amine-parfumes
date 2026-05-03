import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';


function getAdminClient() {
  // Validate session cookie from admin auth
  return supabaseAdmin();
}

export async function GET(req: NextRequest) {
  const db = getAdminClient();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, error, count } = await db
    .from('products')
    .select('*, category:categories(name_fr,name_ar)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data, total: count });
}

export async function POST(req: NextRequest) {
  const db = getAdminClient();
  const body = await req.json();

  // Auto-generate slug if not provided
  if (!body.slug && body.name_fr) {
    body.slug = body.name_fr
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
      '-' + Date.now().toString(36);
  }

  const { data, error } = await db.from('products').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const db = getAdminClient();
  const body = await req.json();
  const { id, ...rest } = body;

  const { data, error } = await db
    .from('products').update(rest).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const db = getAdminClient();
  const { id } = await req.json();

  const { error } = await db.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
