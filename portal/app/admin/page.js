'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <main className="wrap"><p>Loading…</p></main>;
  return session ? <Dashboard session={session} /> : <Login />;
}

// ---------------------------------------------------------------- Login
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function signIn(e) {
    e.preventDefault();
    setBusy(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <main className="wrap">
      <div className="card">
        <h1>Shifty Partners</h1>
        <p className="muted">Sign in to update your daily deal.</p>
        <form onSubmit={signIn}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</button>
        </form>
        <p className="muted small">
          No account? Your Shifty contact will invite you and link your venue.
        </p>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------- Dashboard
function Dashboard({ session }) {
  const [venues, setVenues] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data, error } = await supabase.from('partners').select('*').order('name');
    if (error) setStatus(error.message);
    else setVenues(data);
  }

  async function save(v) {
    setStatus(null);
    const { error } = await supabase
      .from('partners')
      .update({ daily_deal: v.daily_deal, discount: v.discount, open_hours: v.open_hours })
      .eq('id', v.id);
    setStatus(error ? `Error: ${error.message}` : `Saved “${v.name}” ✓`);
  }

  function edit(id, field, value) {
    setVenues((vs) => vs.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  }

  return (
    <main className="wrap">
      <div className="topbar">
        <div>
          <h1>Shifty Partners</h1>
          <p className="muted small">{session.user.email}</p>
        </div>
        <button className="ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>

      {status && <p className="status">{status}</p>}

      {venues === null && <p>Loading your venues…</p>}
      {venues !== null && venues.length === 0 && (
        <div className="card"><p>No venues are linked to your account yet. Contact your Shifty representative.</p></div>
      )}

      {venues?.map((v) => (
        <div className="card" key={v.id}>
          <h2>{v.name}</h2>
          <p className="muted small">{v.address}</p>

          <label>🔥 Today's deal <span className="muted">(leave blank for none)</span></label>
          <input
            type="text"
            placeholder="e.g. Free banana bread with any large coffee — today only!"
            value={v.daily_deal ?? ''}
            onChange={(e) => edit(v.id, 'daily_deal', e.target.value || null)}
          />

          <label>Standing member discount</label>
          <input
            type="text"
            value={v.discount ?? ''}
            onChange={(e) => edit(v.id, 'discount', e.target.value)}
          />

          <label>Opening hours</label>
          <input
            type="text"
            value={v.open_hours ?? ''}
            onChange={(e) => edit(v.id, 'open_hours', e.target.value)}
          />

          <div className="row">
            <button onClick={() => save(v)}>Save</button>
            <button className="ghost" onClick={() => { edit(v.id, 'daily_deal', null); }}>
              Clear today's deal
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}
