// Permanently deletes the calling user's account + data.
// Security model:
//   • The app sends the user's own access token (Bearer).
//   • We verify that token to get the user id — so a caller can only ever
//     delete THEIR OWN account.
//   • Deletion uses the service_role key, which stays server-side in Vercel
//     env (SUPABASE_SERVICE_ROLE_KEY) and is NEVER shipped in the app.

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  try {
    if (!SUPABASE_URL || !ANON || !SERVICE) {
      return json({ error: 'Server not configured (missing SUPABASE_SERVICE_ROLE_KEY).' }, 500);
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return json({ error: 'Missing access token.' }, 401);

    // 1. Verify the token and get the user id.
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: ANON, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return json({ error: 'Invalid or expired session.' }, 401);
    const user = await userRes.json();
    const uid = user && user.id;
    if (!uid) return json({ error: 'Could not identify user.' }, 401);

    const svc = {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      'Content-Type': 'application/json',
    };

    // 2. Delete the user's data (no FK cascade to auth.users, so do it explicitly).
    await fetch(`${SUPABASE_URL}/rest/v1/shifts?user_id=eq.${uid}`, { method: 'DELETE', headers: svc });
    await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${uid}`, { method: 'DELETE', headers: svc });

    // 3. Delete the auth user (admin).
    const delRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${uid}`, { method: 'DELETE', headers: svc });
    if (!delRes.ok) {
      const detail = await delRes.text();
      return json({ error: 'Failed to delete account.', detail }, 500);
    }

    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: 'Server error.' }, 500);
  }
}
