import { createClient } from '@supabase/supabase-js';

// Force every request to read fresh from Supabase — no caching whatsoever.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );

  const [videos, advice, partners] = await Promise.all([
    supabase.from('videos').select('*').eq('active', true).order('sort_order'),
    supabase.from('advice').select('*').eq('active', true).order('sort_order'),
    supabase.from('partners').select('*').eq('active', true),
  ]);

  const mapVideo = (v) => ({ id: v.id, title: v.title, description: v.description ?? '', instructions: v.instructions ?? [], videoURL: v.video_url ?? '', thumbnailURL: v.thumbnail_url ?? null, duration: v.duration ?? '', category: v.category ?? 'Meal Prep', tags: v.tags ?? [] });
  const mapAdvice = (a) => ({ id: a.id, title: a.title, body: a.body ?? '', icon: a.icon ?? null });
  const mapPartner = (p) => ({ id: p.id, name: p.name, address: p.address ?? '', latitude: p.latitude ?? 0, longitude: p.longitude ?? 0, phone: p.phone ?? null, discount: p.discount ?? '', dailyDeal: p.daily_deal ?? null, rating: p.rating ?? 4.5, openHours: p.open_hours ?? '', isOpen24Hours: p.is_open_24h ?? false, isOpenNow: false, type: p.type ?? 'cafe', isOnline: p.is_online ?? false, website: p.website ?? null });

  const v = videos.data ?? [];
  const a = advice.data ?? [];

  const body = {
    exerciseVideos:  v.filter((x) => x.kind === 'e
