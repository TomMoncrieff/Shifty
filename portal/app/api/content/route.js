// Public content endpoint for the Shifty iOS app.
// Returns JSON in the EXACT shape ShiftyAll.swift's ContentBundle expects,
// so you only need to point ContentManager.remoteContentURL at this URL —
// no Swift model changes required.
//
// URL once deployed:  https://<your-vercel-app>.vercel.app/api/content

import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic'; // always fetch fresh from Supabase

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [videos, advice, partners] = await Promise.all([
    supabase.from('videos').select('*').eq('active', true).order('sort_order'),
    supabase.from('advice').select('*').eq('active', true).order('sort_order'),
    supabase.from('partners').select('*').eq('active', true),
  ]);

  const mapVideo = (v) => ({
    id: v.id,
    title: v.title,
    description: v.description ?? '',
    instructions: v.instructions ?? [],
    videoURL: v.video_url ?? '',
    thumbnailURL: v.thumbnail_url ?? null,
    duration: v.duration ?? '',
    category: v.category ?? 'Meal Prep',
    tags: v.tags ?? [],
  });
  const mapAdvice = (a) => ({
    id: a.id,
    title: a.title,
    body: a.body ?? '',
    icon: a.icon ?? null,
  });
  const mapPartner = (p) => ({
    id: p.id,
    name: p.name,
    address: p.address ?? '',
    latitude: p.latitude ?? 0,
    longitude: p.longitude ?? 0,
    phone: p.phone ?? null,
    discount: p.discount ?? '',
    dailyDeal: p.daily_deal ?? null,
    rating: p.rating ?? 4.5,
    openHours: p.open_hours ?? '',
    isOpen24Hours: p.is_open_24h ?? false,
    isOpenNow: false,
  });

  const v = videos.data ?? [];
  const a = advice.data ?? [];

  const body = {
    exerciseVideos:  v.filter((x) => x.kind === 'exercise').map(mapVideo),
    nutritionVideos: v.filter((x) => x.kind === 'nutrition').map(mapVideo),
    cafePartners:    (partners.data ?? []).map(mapPartner),
    exerciseAdvice:  a.filter((x) => x.kind === 'exercise').map(mapAdvice),
    nutritionAdvice: a.filter((x) => x.kind === 'nutrition').map(mapAdvice),
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
