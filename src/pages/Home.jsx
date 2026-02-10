import React, { useState } from "react";

// /C:/Users/dc741/OneDrive/Desktop/imccmini/frontend/src/pages/Home.jsx

/**
 * Home page inspired by service marketplace layouts (original implementation).
 * Self-contained component with styles injected via a <style> tag so you can drop this file into your project.
 *
 * Usage: import Home from "./pages/Home"; <Home />
 */

const CATEGORIES = [
  { id: 1, name: "Salon & Beauty", color: "#FFDDE6" },
  { id: 2, name: "Cleaning", color: "#E8F7FF" },
  { id: 3, name: "Plumbing", color: "#FFF4E0" },
  { id: 4, name: "Electrician", color: "#F0FFE6" },
  { id: 5, name: "Appliance Repair", color: "#F5E8FF" },
  { id: 6, name: "Painting", color: "#EAF8F1" },
];

const SERVICES = [
//   {
//     id: 1,
//     title: "Full Home Deep Cleaning",
//     desc: "2-3 hours • Professional equipment • Trusted experts",
//     price: "From ₹29",
//     img: "https://via.placeholder.com/280x160?text=Cleaning",
//   },
//   {
//     id: 2,
//     title: "AC Installation & Repair",
//     desc: "Certified technicians • Spare parts available",
//     price: "From ₹49",
//     img: "https://via.placeholder.com/280x160?text=AC+Repair",
//   },
//   {
//     id: 3,
//     title: "At-home Haircut & Styling",
//     desc: "Experienced stylists • Sanitized tools",
//     price: "From ₹19",
//     img: "https://via.placeholder.com/280x160?text=Salon",
//   },
//   {
//     id: 4,
//     title: "Domestic Plumbing Service",
//     desc: "Leak fixes • Pipe replacement • 24/7 support",
//     price: "From ₹39",
//     img: "https://via.placeholder.com/280x160?text=Plumbing",
//   },
// ];
]
export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filtered = SERVICES.filter((s) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
    const matchesCat = !selectedCategory || s.title.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesQuery && matchesCat;
  });

  return (
    <div className="hc-root">
      <style>{`
        .hc-root { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#1f2937; }
        .hc-hero { display:flex; align-items:center; justify-content:space-between; padding:48px 40px; gap:32px; background: linear-gradient(180deg,#fff 0%, #f8fafc 60%); }
        .hc-hero-left { max-width:640px; }
        .hc-eyebrow { color:#6366f1; font-weight:600; font-size:13px; margin-bottom:12px; display:inline-block; background:#eef2ff; padding:6px 10px; border-radius:999px; }
        .hc-title { font-size:34px; font-weight:700; margin:0 0 14px; line-height:1.05; }
        .hc-sub { color:#374151; margin-bottom:20px; }
        .hc-search { display:flex; gap:12px; align-items:center; background:#fff; padding:12px; border-radius:10px; box-shadow:0 6px 18px rgba(15,23,42,0.06); }
        .hc-input { flex:1; border:0; outline:none; font-size:15px; padding:8px 6px; }
        .hc-btn { background:#6366f1; color:white; padding:10px 16px; border-radius:8px; border:0; cursor:pointer; font-weight:600; }
        .hc-hero-right { width:420px; display:flex; justify-content:center; align-items:center; }
        .hc-hero-card { width:380px; border-radius:14px; background:linear-gradient(180deg,#ffffff,#fbfdff); box-shadow:0 8px 30px rgba(2,6,23,0.08); padding:18px; }
        .hc-cat-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; margin-top:18px; }
        .hc-cat { padding:10px; border-radius:10px; text-align:center; font-weight:600; font-size:13px; cursor:pointer; }
        .hc-section { padding:40px; }
        .hc-services { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:20px; }
        .hc-card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 6px 20px rgba(2,6,23,0.06); }
        .hc-card img { display:block; width:100%; height:140px; object-fit:cover; }
        .hc-card-body { padding:12px 14px; }
        .hc-card-title { font-weight:700; margin-bottom:6px; font-size:16px; }
        .hc-card-desc { color:#6b7280; font-size:13px; margin-bottom:10px; }
        .hc-card-cta { display:flex; justify-content:space-between; align-items:center; font-weight:700; padding-top:6px; }
        .hc-how { display:flex; gap:18px; flex-wrap:wrap; margin-top:18px; }
        .hc-step { background:#fff; border-radius:10px; padding:16px; width:220px; box-shadow:0 6px 20px rgba(2,6,23,0.04); }
        .hc-footer { text-align:center; padding:28px; color:#6b7280; font-size:14px; margin-top:14px; }
        @media (max-width:900px) {
          .hc-hero { flex-direction:column; padding:28px 18px; }
          .hc-hero-right { width:100%; margin-top:18px; }
          .hc-cat-grid { grid-template-columns:repeat(3,1fr); }
        }
      `}</style>

      <header className="hc-hero">
        <div className="hc-hero-left">
          <div className="hc-eyebrow">Trusted professionals near you</div>
          <h1 className="hc-title">Home services made simple</h1>
          <p className="hc-sub">Book vetted professionals for cleaning, repairs, beauty and more. Transparent pricing, flexible slots, and guaranteed service quality.</p>

          <div style={{ marginTop: 12 }}>
            <div className="hc-search" role="search" aria-label="Find services">
              <input
                className="hc-input"
                placeholder="Search for services (e.g., cleaning, electrician, haircut)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="hc-btn"
                onClick={() => {
                  // in a real app you'd navigate to search results
                  if (!query) window.alert("Try typing something like 'cleaning' or 'AC repair'");
                }}
              >
                Search
              </button>
            </div>

            <div className="hc-cat-grid" style={{ marginTop: 14 }}>
              {CATEGORIES.map((c) => (
                <div
                  key={c.id}
                  className="hc-cat"
                  onClick={() => setSelectedCategory(selectedCategory === c.name ? null : c.name)}
                  style={{
                    background: c.color,
                    border: selectedCategory === c.name ? "2px solid #6366f1" : "2px solid transparent",
                  }}
                >
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hc-hero-right">
          <div className="hc-hero-card">
            <h3 style={{ margin: 0 }}>Featured: Home Deep Cleaning</h3>
            <p style={{ color: "#6b7280", marginTop: 8 }}>Top-rated cleaners · 4.8★ average · Book within 24 hours</p>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <div style={{ flex: 1 }}>
                <small style={{ color: "#6b7280" }}>Duration</small>
                <div style={{ fontWeight: 700 }}>2–4 hours</div>
              </div>
              <div style={{ flex: 1 }}>
                <small style={{ color: "#6b7280" }}>Price</small>
                <div style={{ fontWeight: 700 }}>$29+</div>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <button className="hc-btn bg-blue-700" style={{ width: "100%" }}>Book Now</button>
              <Link 
            to="/providers"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow text-sm font-medium"
          >
            Book Now
          </Link>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="hc-section">
          <h2 style={{ marginTop: 0 }}>Popular services</h2>
          <p style={{ color: "#6b7280", marginTop: 6 }}>Quickly book trusted professionals with transparent pricing.</p>

          <div style={{ marginTop: 18 }} className="hc-services">
            {filtered.map((s) => (
              <article key={s.id} className="hc-card">
                <img src={s.img} alt={s.title} />
                <div className="hc-card-body">
                  <div className="hc-card-title">{s.title}</div>
                  <div className="hc-card-desc">{s.desc}</div>
                  <div className="hc-card-cta">
                    <div style={{ color: "#10b981" }}>{s.price}</div>
                    <button
                      className="hc-btn"
                      style={{ background: "#0ea5a4", padding: "8px 12px", fontSize: 14 }}
                      onClick={() => window.alert(`Starting booking flow for: ${s.title}`)}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="hc-section" style={{ background: "#f8fafc", marginTop: 10 }}>
          <h2 style={{ marginTop: 0 }}>How it works</h2>
          <div className="hc-how">
            <div className="hc-step">
              <div style={{ fontSize: 22, fontWeight: 800 }}>1</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>Search & choose</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>Find the service and slot that fits your schedule.</div>
            </div>
            <div className="hc-step">
              <div style={{ fontSize: 22, fontWeight: 800 }}>2</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>Book securely</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>Book online with transparent pricing and confirmation.</div>
            </div>
            <div className="hc-step">
              <div style={{ fontSize: 22, fontWeight: 800 }}>3</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>Service delivered</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>Experts arrive at your doorstep with the right tools.</div>
            </div>
          </div>
        </section>

        <section className="hc-section">
          <h2 style={{ marginTop: 0 }}>Why users love us</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 12 }}>
            <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 20px rgba(2,6,23,0.04)" }}>
              <div style={{ fontWeight: 800 }}>4.8★</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>Average rating across thousands of jobs.</div>
            </div>
            <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 20px rgba(2,6,23,0.04)" }}>
              <div style={{ fontWeight: 800 }}>Vetted pros</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>Background checked & trained professionals.</div>
            </div>
            <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 20px rgba(2,6,23,0.04)" }}>
              <div style={{ fontWeight: 800 }}>Easy rescheduling</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>Manage bookings from your account dashboard.</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="hc-footer">
        © {new Date().getFullYear()} YourCompany — Simple, reliable home services.
      </footer>
    </div>
  );
}