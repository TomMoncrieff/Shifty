'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const VIDEO_CATS = ['HIIT', 'Yoga', 'Stretching', 'Strength', 'Meditation', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Meal Prep'];

export default function Admin() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // null = unknown
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); setIsAdmin(null); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(data === true));
  }, [session]);

  if (loading) return <main className="wrap"><p>Loading…</p></main>;
  if (!session) return <AdminLogin />;
  if (isAdmin === null) return <main className="wrap"><p>Checking access…</p></main>;
  if (!isAdmin) return (
    <main className="wrap">
      <div className="card">
        <h1>Not authorised</h1>
        <p className="muted">This account isn't an admin. Add its UID to the <code>admins</code> table in Supabase.</p>
        <button className="ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    </main>
  );
  return <AdminDashboard session={session} />;
}

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  async function signIn(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  }
  return (
    <main className="wrap">
      <div className="card">
        <h1>Shifty Admin</h1>
        <form onSubmit={signIn}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button>Sign In</button>
        </form>
      </div>
    </main>
  );
}

function AdminDashboard({ session }) {
  const [status, setStatus] = useState(null);
  return (
    <main className="wrap">
      <div className="topbar">
        <div><h1>Shifty Admin</h1><p className="muted small">{session.user.email}</p></div>
        <button className="ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
      {status && <p className="status">{status}</p>}
      <PartnerSection onStatus={setStatus} />
      <VideoSection onStatus={setStatus} />
      <AdviceSection onStatus={setStatus} />
    </main>
  );
}

// Generic helpers -----------------------------------------------------------
function useTable(table, order = 'name') {
  const [rows, setRows] = useState(null);
  async function load() {
    const { data, error } = await supabase.from(table).select('*').order(order, { ascending: true });
    if (!error) setRows(data);
  }
  useEffect(() => { load(); }, []);
  return [rows, setRows, load];
}

async function saveRow(table, row, onStatus, load) {
  const { id, ...fields } = row;
  const res = id
    ? await supabase.from(table).update(fields).eq('id', id)
    : await supabase.from(table).insert(fields);
  onStatus(res.error ? `Error: ${res.error.message}` : 'Saved ✓');
  if (!res.error) load();
}
async function deleteRow(table, id, onStatus, load) {
  if (!confirm('Delete this row?')) return;
  const { error } = await supabase.from(table).delete().eq('id', id);
  onStatus(error ? `Error: ${error.message}` : 'Deleted ✓');
  if (!error) load();
}

function Field({ label, value, onChange, placeholder }) {
  return (<><label>{label}</label>
    <input value={value ?? ''} placeholder={placeholder || ''} onChange={(e) => onChange(e.target.value)} /></>);
}

// PARTNERS ------------------------------------------------------------------
function PartnerSection({ onStatus }) {
  const [rows, setRows, load] = useTable('partners');
  function edit(i, k, v) { setRows((r) => r.map((row, j) => j === i ? { ...row, [k]: v } : row)); }
  const blank = { name: '', address: '', latitude: null, longitude: null, phone: '', discount: '', daily_deal: null, rating: 4.5, open_hours: '', is_open_24h: false, owner_id: null, active: true, type: 'cafe', is_online: false, website: '' };
  return (
    <Section title="Partners" onAdd={() => setRows((r) => [blank, ...(r || [])])}>
      {rows === null ? <p>Loading…</p> : rows.map((v, i) => (
        <div className="subcard" key={v.id || `new-${i}`}>
          <Field label="Name" value={v.name} onChange={(x) => edit(i, 'name', x)} />
          <div><label>Type</label>
            <select value={v.type || 'cafe'} onChange={(e) => edit(i, 'type', e.target.value)}>
              <option value="cafe">Cafe</option>
              <option value="bar">Wine & Pub</option>
              <option value="gym">Gym & Pilates</option>
              <option value="spa">Sauna & Spa</option>
              <option value="online">Online store</option>
            </select></div>
          <Field label="Address (leave blank for online-only partners)" value={v.address} onChange={(x) => edit(i, 'address', x)} />
          <div className="row2">
            <Field label="Latitude" value={v.latitude} onChange={(x) => edit(i, 'latitude', parseFloat(x) || null)} />
            <Field label="Longitude" value={v.longitude} onChange={(x) => edit(i, 'longitude', parseFloat(x) || null)} />
          </div>
          <Field label="Phone" value={v.phone} onChange={(x) => edit(i, 'phone', x)} />
          <Field label="Discount (standing offer)" value={v.discount} onChange={(x) => edit(i, 'discount', x)} />
          <Field label="Daily deal (blank = none)" value={v.daily_deal} onChange={(x) => edit(i, 'daily_deal', x || null)} />
          <div className="row2">
            <Field label="Rating" value={v.rating} onChange={(x) => edit(i, 'rating', parseFloat(x) || null)} />
            <Field label="Open hours" value={v.open_hours} onChange={(x) => edit(i, 'open_hours', x)} />
          </div>
          <Field label="Website (for online partners, e.g. https://mymusclechef.com)" value={v.website} onChange={(x) => edit(i, 'website', x)} />
          <Field label="Owner user UID (links their login)" value={v.owner_id} onChange={(x) => edit(i, 'owner_id', x || null)} />
          <label className="check"><input type="checkbox" checked={!!v.is_online} onChange={(e) => edit(i, 'is_online', e.target.checked)} /> Online only (no map pin — shows in the List with a website link)</label>
          <label className="check"><input type="checkbox" checked={!!v.is_open_24h} onChange={(e) => edit(i, 'is_open_24h', e.target.checked)} /> Open 24 hours</label>
          <label className="check"><input type="checkbox" checked={!!v.active} onChange={(e) => edit(i, 'active', e.target.checked)} /> Active (visible in app)</label>
          <div className="row">
            <button onClick={() => saveRow('partners', v, onStatus, load)}>Save</button>
            {v.id && <button className="ghost" onClick={() => deleteRow('partners', v.id, onStatus, load)}>Delete</button>}
          </div>
        </div>
      ))}
    </Section>
  );
}

// VIDEOS --------------------------------------------------------------------
function VideoSection({ onStatus }) {
  const [rows, setRows, load] = useTable('videos', 'sort_order');
  function edit(i, k, v) { setRows((r) => r.map((row, j) => j === i ? { ...row, [k]: v } : row)); }
  const blank = { kind: 'exercise', title: '', description: '', instructions: [], video_url: '', thumbnail_url: '', duration: '', category: 'HIIT', tags: [], sort_order: 0, active: true, slides: [] };
  return (
    <Section title="Videos" onAdd={() => setRows((r) => [blank, ...(r || [])])}>
      {rows === null ? <p>Loading…</p> : rows.map((v, i) => (
        <div className="subcard" key={v.id || `new-${i}`}>
          <div className="row2">
            <div><label>Kind</label>
              <select value={v.kind} onChange={(e) => edit(i, 'kind', e.target.value)}>
                <option value="exercise">exercise</option><option value="nutrition">nutrition</option>
              </select></div>
            <div><label>Category</label>
              <select value={v.category} onChange={(e) => edit(i, 'category', e.target.value)}>
                {VIDEO_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select></div>
          </div>
          <Field label="Title" value={v.title} onChange={(x) => edit(i, 'title', x)} />
          <Field label="Description" value={v.description} onChange={(x) => edit(i, 'description', x)} />
          <Field label="Video URL (leave blank for a photo-only item)" value={v.video_url} onChange={(x) => edit(i, 'video_url', x)} />
          <Field label="Image URL (photo shown on the card — optional)" value={v.thumbnail_url} onChange={(x) => edit(i, 'thumbnail_url', x)} />
          <label>Recipe slideshow (optional) — one step per line as: image URL | instruction</label>
          <textarea rows={4}
            placeholder={"https://.../step1.jpg | Chop the vegetables\nhttps://.../step2.jpg | Add to the pan and cook 5 min"}
            value={(v.slides || []).map((s) => `${s.image} | ${s.text}`).join('\n')}
            onChange={(e) => edit(i, 'slides', e.target.value.split('\n').filter((l) => l.trim()).map((l) => { const k = l.indexOf('|'); return k === -1 ? { image: l.trim(), text: '' } : { image: l.slice(0, k).trim(), text: l.slice(k + 1).trim() }; }))} />
          <Field label="Duration" value={v.duration} onChange={(x) => edit(i, 'duration', x)} />
          <label>Instructions (one step per line)</label>
          <textarea rows={4} value={(v.instructions || []).join('\n')}
            onChange={(e) => edit(i, 'instructions', e.target.value.split('\n').filter((s) => s.trim()))} />
          <Field label="Tags (comma separated)" value={(v.tags || []).join(', ')}
            onChange={(x) => edit(i, 'tags', x.split(',').map((t) => t.trim()).filter(Boolean))} />
          <Field label="Sort order" value={v.sort_order} onChange={(x) => edit(i, 'sort_order', parseInt(x) || 0)} />
          <label className="check"><input type="checkbox" checked={!!v.active} onChange={(e) => edit(i, 'active', e.target.checked)} /> Active</label>
          <div className="row">
            <button onClick={() => saveRow('videos', v, onStatus, load)}>Save</button>
            {v.id && <button className="ghost" onClick={() => deleteRow('videos', v.id, onStatus, load)}>Delete</button>}
          </div>
        </div>
      ))}
    </Section>
  );
}

// ADVICE --------------------------------------------------------------------
function AdviceSection({ onStatus }) {
  const [rows, setRows, load] = useTable('advice', 'sort_order');
  function edit(i, k, v) { setRows((r) => r.map((row, j) => j === i ? { ...row, [k]: v } : row)); }
  const blank = { kind: 'exercise', title: '', body: '', icon: '', sort_order: 0, active: true };
  return (
    <Section title="Advice / Tips" onAdd={() => setRows((r) => [blank, ...(r || [])])}>
      {rows === null ? <p>Loading…</p> : rows.map((v, i) => (
        <div className="subcard" key={v.id || `new-${i}`}>
          <div><label>Kind</label>
            <select value={v.kind} onChange={(e) => edit(i, 'kind', e.target.value)}>
              <option value="exercise">exercise</option><option value="nutrition">nutrition</option>
            </select></div>
          <Field label="Title" value={v.title} onChange={(x) => edit(i, 'title', x)} />
          <label>Body</label>
          <textarea rows={4} value={v.body ?? ''} onChange={(e) => edit(i, 'body', e.target.value)} />
          <Field label="Icon (SF Symbol name, optional)" value={v.icon} onChange={(x) => edit(i, 'icon', x)} />
          <Field label="Sort order" value={v.sort_order} onChange={(x) => edit(i, 'sort_order', parseInt(x) || 0)} />
          <label className="check"><input type="checkbox" checked={!!v.active} onChange={(e) => edit(i, 'active', e.target.checked)} /> Active</label>
          <div className="row">
            <button onClick={() => saveRow('advice', v, onStatus, load)}>Save</button>
            {v.id && <button className="ghost" onClick={() => deleteRow('advice', v.id, onStatus, load)}>Delete</button>}
          </div>
        </div>
      ))}
    </Section>
  );
}

function Section({ title, onAdd, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 0 }}>
        <h2 onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>{open ? '▾' : '▸'} {title}</h2>
        <button className="ghost" style={{ marginTop: 0 }} onClick={onAdd}>+ New</button>
      </div>
      {open && children}
    </div>
  );
}
