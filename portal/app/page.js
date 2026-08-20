export const metadata = {
  title: 'Shifty — Wellbeing for Shift Workers',
  description:
    'Shifty helps shift workers plan sleep, energy, and wellbeing around their shifts — with science-backed recommendations, workouts, recipes, and member discounts at local partners.',
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root { color-scheme: light; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1E3A5F; background: #EFF6FF; line-height: 1.6; -webkit-font-smoothing: antialiased; }
  a { color: #2563EB; text-decoration: none; }
  .wrap { max-width: 1040px; margin: 0 auto; padding: 0 22px; }

  header.nav { position: sticky; top: 0; z-index: 10; background: rgba(239,246,255,0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(37,99,235,0.1); }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .brand { font-weight: 800; font-size: 22px; color: #1E3A5F; letter-spacing: -0.5px; }
  .brand span { color: #2563EB; }
  .nav-links a { margin-left: 22px; font-size: 15px; font-weight: 500; color: #1E3A5F; opacity: 0.8; }
  .nav-links a:hover { opacity: 1; }

  .hero { text-align: center; padding: 80px 0 60px; }
  .hero .badge { display: inline-block; background: rgba(37,99,235,0.1); color: #2563EB; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 999px; margin-bottom: 22px; }
  .hero h1 { font-size: 46px; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 18px; }
  .hero h1 .grad { background: linear-gradient(90deg,#1D4ED8,#60A5FA); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .hero p { font-size: 19px; color: rgba(30,58,95,0.7); max-width: 640px; margin: 0 auto 30px; }
  .cta { display: inline-block; background: #2563EB; color: #fff; font-weight: 600; font-size: 16px; padding: 14px 28px; border-radius: 14px; }
  .cta:hover { background: #1D4ED8; }
  .cta.ghost { background: #fff; color: #2563EB; border: 1px solid rgba(37,99,235,0.25); margin-left: 10px; }

  section { padding: 56px 0; }
  .section-title { text-align: center; font-size: 30px; letter-spacing: -0.8px; margin-bottom: 10px; }
  .section-sub { text-align: center; color: rgba(30,58,95,0.6); font-size: 16px; max-width: 560px; margin: 0 auto 40px; }

  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .feature { background: #fff; border: 1px solid rgba(37,99,235,0.1); border-radius: 18px; padding: 24px; }
  .feature .ico { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 14px; }
  .feature h3 { font-size: 17px; margin-bottom: 6px; }
  .feature p { font-size: 14px; color: rgba(30,58,95,0.65); }

  .biz { background: #fff; border: 1px solid rgba(37,99,235,0.12); border-radius: 22px; padding: 40px; text-align: center; }
  .biz h2 { font-size: 26px; margin-bottom: 10px; }
  .biz p { color: rgba(30,58,95,0.7); max-width: 620px; margin: 0 auto 22px; }

  footer { border-top: 1px solid rgba(37,99,235,0.12); padding: 40px 0 60px; color: rgba(30,58,95,0.6); font-size: 14px; }
  footer .foot-grid { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
  footer .foot-links a { display: inline-block; margin-right: 18px; }
  footer .company { font-size: 13px; opacity: 0.8; margin-top: 8px; }

  @media (max-width: 760px) {
    .hero h1 { font-size: 34px; }
    .grid { grid-template-columns: 1fr; }
    .nav-links a { margin-left: 14px; font-size: 14px; }
    footer .foot-grid { flex-direction: column; }
  }
`;

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <header className="nav">
        <div className="wrap nav-inner">
          <div className="brand">Shift<span>y</span></div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#business">For Businesses</a>
            <a href="/support.html">Support</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <div className="badge">Wellbeing for shift workers</div>
            <h1>Take back your sleep,<br /><span className="grad">whatever shift you work</span></h1>
            <p>
              Nurses, paramedics, hospitality, drivers, healthcare and factory workers — Shifty builds a
              personalised, science-backed plan around your shifts, so your body clock isn't constantly at war
              with your roster.
            </p>
            <a className="cta" href="#features">Explore features</a>
            <a className="cta ghost" href="#business">Partner with us</a>
            <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.6 }}>Coming soon to the App Store.</p>
          </div>
        </section>

        <section id="features">
          <div className="wrap">
            <h2 className="section-title">Built around your shifts</h2>
            <p className="section-sub">Everything a shift worker needs to sleep better, feel sharper, and get rewarded.</p>
            <div className="grid">
              <div className="feature">
                <div className="ico" style={{ background: 'rgba(37,99,235,0.12)' }}>🗓️</div>
                <h3>Smart shift calendar</h3>
                <p>Add your shifts in seconds and see your week and month at a glance.</p>
              </div>
              <div className="feature">
                <div className="ico" style={{ background: 'rgba(139,92,246,0.12)' }}>😴</div>
                <h3>Personalised sleep plan</h3>
                <p>Sleep windows, light timing, caffeine cut-offs and wind-down, based on circadian research.</p>
              </div>
              <div className="feature">
                <div className="ico" style={{ background: 'rgba(16,185,129,0.12)' }}>📈</div>
                <h3>Body-clock energy</h3>
                <p>See when you're likely to feel sharp or sluggish across the day.</p>
              </div>
              <div className="feature">
                <div className="ico" style={{ background: 'rgba(6,182,212,0.12)' }}>🏃</div>
                <h3>Fitness & nutrition</h3>
                <p>Quick workouts and recipes designed for time-poor, tired shift workers.</p>
              </div>
              <div className="feature">
                <div className="ico" style={{ background: 'rgba(245,166,35,0.15)' }}>🤝</div>
                <h3>Shifty Partners</h3>
                <p>A member card that unlocks discounts at local cafés, gyms, and more.</p>
              </div>
              <div className="feature">
                <div className="ico" style={{ background: 'rgba(99,102,241,0.12)' }}>🔁</div>
                <h3>Shift-transition plans</h3>
                <p>A gentle, day-by-day guide for switching between day and night rotations.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="business">
          <div className="wrap">
            <div className="biz">
              <h2>Become a Shifty Partner</h2>
              <p>
                Reach a loyal, local audience of shift workers by offering a member discount. Update your daily
                deal any time from the partner portal — it appears in the app instantly.
              </p>
              <a className="cta" href="/partner">Partner sign in</a>
              <a className="cta ghost" href="mailto:contact@shiftyapp.org">Get in touch</a>
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="wrap" style={{ textAlign: 'center' }}>
            <h2 className="section-title">Questions?</h2>
            <p className="section-sub">We'd love to hear from you. Email <a href="mailto:contact@shiftyapp.org">contact@shiftyapp.org</a>.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot-grid">
          <div>
            <div className="brand" style={{ fontSize: '20px' }}>Shift<span>y</span></div>
            <div className="company">
              Operated by THOMAS W M PTY LTD (ACN 701 107 262)<br />
              Victoria, Australia · contact@shiftyapp.org
            </div>
          </div>
          <div className="foot-links">
            <a href="/privacy.html">Privacy Policy</a>
            <a href="/terms.html">Terms of Service</a>
            <a href="/support.html">Support</a>
            <a href="/partner">Partner Portal</a>
          </div>
        </div>
      </footer>
    </>
  );
}
