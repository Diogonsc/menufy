import { useState } from "react";

// ── MOCK DATA ────────────────────────────────────────────────────────────────
const TENANTS = [
  {
    id: "boi-burguer", name: "Boi Burguer", owner: "Carlos Melo",
    email: "carlos@boiburguer.com.br", phone: "(11) 99234-5678",
    plan: "pro", status: "active",
    url: "boiburguer.deliveryhub.com.br",
    since: "Jan 2025", revenue: 4820.50, orders: 312, mrr: 97,
    avatar: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop",
    theme: { primary: "#1a1a2e", accent: "#e8a838" },
  },
  {
    id: "pizza-bella", name: "Pizza Bella", owner: "Ana Souza",
    email: "ana@pizzabella.com", phone: "(21) 98765-4321",
    plan: "starter", status: "active",
    url: "pizzabella.deliveryhub.com.br",
    since: "Fev 2025", revenue: 2310.00, orders: 178, mrr: 47,
    avatar: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop",
    theme: { primary: "#7c1d1d", accent: "#f87171" },
  },
  {
    id: "sushi-zen", name: "Sushi Zen", owner: "Kenji Tanaka",
    email: "kenji@sushizen.com", phone: "(11) 91234-9876",
    plan: "pro", status: "active",
    url: "sushizen.deliveryhub.com.br",
    since: "Mar 2025", revenue: 6100.00, orders: 421, mrr: 97,
    avatar: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=80&h=80&fit=crop",
    theme: { primary: "#0f4c75", accent: "#1b6ca8" },
  },
  {
    id: "tacos-el-rey", name: "Tacos El Rey", owner: "Miguel Torres",
    email: "miguel@tacosrey.com", phone: "(11) 97654-3210",
    plan: "starter", status: "trial",
    url: "tacosrey.deliveryhub.com.br",
    since: "Abr 2025", revenue: 540.00, orders: 44, mrr: 0,
    avatar: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=80&h=80&fit=crop",
    theme: { primary: "#4a1942", accent: "#e040fb" },
  },
  {
    id: "acai-roots", name: "Açaí Roots", owner: "Camila Nunes",
    email: "camila@acairoots.com", phone: "(85) 99876-1234",
    plan: "pro", status: "active",
    url: "acairoots.deliveryhub.com.br",
    since: "Fev 2025", revenue: 3980.00, orders: 289, mrr: 97,
    avatar: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=80&h=80&fit=crop",
    theme: { primary: "#3b1a6b", accent: "#a855f7" },
  },
];

const PLANS = [
  {
    id: "starter", name: "Starter", price: 47, color: "#3b82f6",
    desc: "Para quem está começando",
    features: ["1 loja", "Até 30 produtos", "Página pública personalizada", "Rastreamento de pedidos", "Suporte via WhatsApp"],
    highlight: false,
  },
  {
    id: "pro", name: "Pro", price: 97, color: "#7c3aed",
    desc: "Para quem quer crescer",
    features: ["1 loja", "Produtos ilimitados", "Domínio personalizado", "Painel analytics completo", "Notificações WhatsApp", "Suporte prioritário", "Variações e adicionais", "Cupons de desconto"],
    highlight: true,
  },
  {
    id: "agency", name: "Agency", price: 297, color: "#059669",
    desc: "Para agências e revendedores",
    features: ["Lojas ilimitadas", "White-label completo", "Painel multi-tenant", "API de integração", "Manager dedicado", "SLA garantido"],
    highlight: false,
  },
];

const fmt = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f8f7f4; --surf:#fff; --bdr:#e9e7e2;
  --txt:#111118; --mut:#8a8880;
  --p:#111118; --a:#6366f1;
  --r:14px; --sh:0 2px 12px rgba(0,0,0,.06); --sh2:0 10px 40px rgba(0,0,0,.1);
}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--txt);
  -webkit-font-smoothing:antialiased;min-height:100vh}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:4px}

/* TOP NAV */
.saas-nav{
  position:sticky;top:0;z-index:100;background:rgba(255,255,255,.92);
  backdrop-filter:blur(12px);border-bottom:1px solid var(--bdr);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 28px;height:60px;
}
.saas-logo{font-family:'Fraunces',serif;font-size:1.25rem;font-weight:800;
  color:var(--p);display:flex;align-items:center;gap:8px}
.saas-logo-dot{width:10px;height:10px;border-radius:50%;background:var(--a)}
.nav-actions{display:flex;align-items:center;gap:10px}
.nav-btn{padding:8px 18px;border-radius:9px;border:none;font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:700;font-size:0.84rem;cursor:pointer;transition:all .18s}
.nav-btn.ghost{background:transparent;color:var(--mut);border:1px solid var(--bdr)}
.nav-btn.ghost:hover{border-color:var(--p);color:var(--p)}
.nav-btn.fill{background:var(--p);color:#fff}
.nav-btn.fill:hover{opacity:.88}

/* INNER NAV TABS */
.inner-tabs{display:flex;gap:2px;padding:0 28px;
  background:var(--surf);border-bottom:1px solid var(--bdr)}
.itab{padding:14px 18px;border:none;border-bottom:2.5px solid transparent;
  background:transparent;color:var(--mut);font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:600;font-size:0.85rem;cursor:pointer;transition:all .18s;
  display:flex;align-items:center;gap:7px}
.itab:hover{color:var(--txt)}
.itab.on{color:var(--p);border-bottom-color:var(--a);font-weight:700}

/* LANDING */
.landing{max-width:1100px;margin:0 auto;padding:80px 28px 60px}
.hero-eyebrow{display:inline-flex;align-items:center;gap:6px;
  background:rgba(99,102,241,.08);color:var(--a);
  border:1px solid rgba(99,102,241,.2);border-radius:100px;
  padding:5px 14px;font-size:0.8rem;font-weight:700;margin-bottom:20px}
.hero-h1{font-family:'Fraunces',serif;font-size:clamp(2.4rem,5vw,3.8rem);
  font-weight:800;line-height:1.12;color:var(--p);max-width:700px}
.hero-h1 em{font-style:italic;color:var(--a)}
.hero-sub{font-size:1.05rem;color:var(--mut);max-width:520px;
  line-height:1.65;margin-top:16px}
.hero-ctas{display:flex;gap:12px;margin-top:28px;flex-wrap:wrap}
.btn-lg{padding:14px 28px;border-radius:12px;border:none;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:1rem;
  cursor:pointer;transition:all .18s}
.btn-lg.fill{background:var(--p);color:#fff;box-shadow:0 4px 20px rgba(17,17,24,.2)}
.btn-lg.fill:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(17,17,24,.25)}
.btn-lg.outline{background:transparent;color:var(--p);border:2px solid var(--bdr)}
.btn-lg.outline:hover{border-color:var(--p)}

/* STATS ROW */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:60px 0}
.stat-box{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);padding:20px;
  text-align:center}
.stat-val{font-family:'Fraunces',serif;font-size:2rem;font-weight:800;color:var(--p)}
.stat-lbl{font-size:0.8rem;font-weight:600;color:var(--mut);margin-top:2px}

/* HOW IT WORKS */
.section-tag{font-size:0.75rem;font-weight:700;color:var(--a);text-transform:uppercase;
  letter-spacing:1.5px;margin-bottom:8px}
.section-h{font-family:'Fraunces',serif;font-size:clamp(1.6rem,3vw,2.2rem);
  font-weight:800;color:var(--p);margin-bottom:8px}
.section-sub{font-size:0.95rem;color:var(--mut);max-width:520px;line-height:1.6}
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px}
.step-card{background:var(--surf);border:1px solid var(--bdr);border-radius:20px;
  padding:24px;transition:box-shadow .2s,transform .2s}
.step-card:hover{box-shadow:var(--sh2);transform:translateY(-3px)}
.step-num{font-family:'Fraunces',serif;font-size:2.5rem;font-weight:800;color:var(--bdr);
  line-height:1;margin-bottom:12px}
.step-title{font-weight:700;font-size:1rem;color:var(--p);margin-bottom:6px}
.step-desc{font-size:0.85rem;color:var(--mut);line-height:1.6}

/* PRICING */
.plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px}
.plan-card{background:var(--surf);border:1.5px solid var(--bdr);border-radius:20px;
  padding:28px;transition:box-shadow .2s;position:relative;overflow:hidden}
.plan-card.highlight{border-color:var(--a);box-shadow:0 0 0 4px rgba(99,102,241,.12)}
.plan-badge{position:absolute;top:16px;right:16px;background:var(--a);color:#fff;
  font-size:0.72rem;font-weight:800;padding:4px 10px;border-radius:100px}
.plan-name{font-family:'Fraunces',serif;font-size:1.3rem;font-weight:800;color:var(--p)}
.plan-desc{font-size:0.82rem;color:var(--mut);margin:4px 0 16px}
.plan-price{display:flex;align-items:baseline;gap:4px;margin-bottom:4px}
.plan-price-val{font-family:'Fraunces',serif;font-size:2.4rem;font-weight:800;color:var(--p)}
.plan-price-per{font-size:0.82rem;color:var(--mut);font-weight:600}
.plan-features{list-style:none;margin:20px 0 24px}
.plan-features li{display:flex;align-items:center;gap:8px;font-size:0.85rem;
  padding:5px 0;color:var(--txt)}
.plan-features li::before{content:'✓';font-weight:800;color:var(--a);flex-shrink:0}
.plan-btn{width:100%;padding:12px;border-radius:12px;border:none;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.9rem;
  cursor:pointer;transition:all .18s}
.plan-btn.dark{background:var(--p);color:#fff}
.plan-btn.dark:hover{opacity:.88}
.plan-btn.light{background:var(--bg);color:var(--p);border:1.5px solid var(--bdr)}
.plan-btn.light:hover{border-color:var(--p)}
.plan-btn.purple{background:var(--a);color:#fff}
.plan-btn.purple:hover{opacity:.88}

/* DASHBOARD */
.dash-wrap{padding:24px 28px;max-width:1200px;margin:0 auto}
.dash-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px}
.dash-title{font-family:'Fraunces',serif;font-size:1.6rem;font-weight:800;color:var(--p)}
.dash-sub{font-size:0.85rem;color:var(--mut);margin-top:2px}
.btn-sm{padding:9px 18px;border-radius:9px;border:none;font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:700;font-size:0.83rem;cursor:pointer;transition:all .18s}
.btn-sm.fill{background:var(--p);color:#fff}
.btn-sm.fill:hover{opacity:.85}
.btn-sm.outline{background:transparent;color:var(--p);border:1.5px solid var(--bdr)}
.btn-sm.outline:hover{border-color:var(--p)}

/* MRR CARDS */
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-bottom:28px}
.kpi-card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);padding:18px;
  transition:box-shadow .2s}
.kpi-card:hover{box-shadow:var(--sh2)}
.kpi-icon{font-size:1.5rem;margin-bottom:8px}
.kpi-val{font-family:'Fraunces',serif;font-size:1.65rem;font-weight:800;color:var(--p)}
.kpi-label{font-size:0.78rem;font-weight:600;color:var(--mut);margin-top:2px}
.kpi-delta{font-size:0.75rem;font-weight:700;margin-top:4px}
.kpi-delta.up{color:#059669}
.kpi-delta.down{color:#dc2626}

/* TENANT TABLE */
.table-card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);overflow:hidden}
.table-header{display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px;border-bottom:1px solid var(--bdr)}
.table-header-title{font-weight:700;font-size:0.95rem;color:var(--p)}
.table-search{padding:7px 12px;background:var(--bg);border:1px solid var(--bdr);
  border-radius:9px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.84rem;
  color:var(--txt);outline:none;width:200px;transition:border-color .2s}
.table-search:focus{border-color:var(--a)}
table{width:100%;border-collapse:collapse}
th{padding:11px 16px;text-align:left;font-size:0.72rem;font-weight:700;
  color:var(--mut);text-transform:uppercase;letter-spacing:1px;
  background:var(--bg);border-bottom:1px solid var(--bdr)}
td{padding:14px 16px;border-bottom:1px solid var(--bdr);font-size:0.86rem}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(0,0,0,.012)}

/* TENANT ROW */
.tenant-name-cell{display:flex;align-items:center;gap:10px}
.tenant-avatar{width:36px;height:36px;border-radius:10px;object-fit:cover;flex-shrink:0}
.tenant-avatar-ph{width:36px;height:36px;border-radius:10px;background:var(--bg);
  display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.tenant-name{font-weight:700;font-size:0.9rem}
.tenant-owner{font-size:0.75rem;color:var(--mut)}
.plan-badge-sm{display:inline-block;padding:3px 9px;border-radius:100px;
  font-size:0.72rem;font-weight:700}
.plan-starter{background:#dbeafe;color:#1d4ed8}
.plan-pro{background:#ede9fe;color:#6d28d9}
.plan-agency{background:#d1fae5;color:#065f46}
.status-dot{display:inline-flex;align-items:center;gap:5px;font-size:0.8rem;font-weight:600}
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.dot.active{background:#10b981}
.dot.trial{background:#f59e0b}
.dot.inactive{background:#94a3b8}
.action-btn{padding:6px 12px;border-radius:8px;border:1px solid var(--bdr);
  background:transparent;color:var(--mut);font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:600;font-size:0.78rem;cursor:pointer;transition:all .15s;margin-right:4px}
.action-btn:hover{border-color:var(--p);color:var(--p)}

/* STORE URL */
.store-url{display:flex;align-items:center;gap:5px;font-size:0.78rem;color:var(--a);font-weight:600}
.store-url-icon{font-size:0.7rem}

/* MODAL / DRAWER */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;
  display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--surf);border-radius:20px;width:min(540px,100%);
  max-height:90vh;overflow-y:auto;animation:scaleIn .22s;
  box-shadow:0 20px 60px rgba(0,0,0,.15);border:1px solid var(--bdr)}
@keyframes scaleIn{from{transform:scale(.96) translateY(12px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
.modal-head{padding:20px 24px;border-bottom:1px solid var(--bdr);
  display:flex;align-items:center;justify-content:space-between}
.modal-title{font-family:'Fraunces',serif;font-size:1.2rem;font-weight:700;color:var(--p)}
.modal-close{width:30px;height:30px;border-radius:50%;background:var(--bg);
  border:none;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center}
.modal-body{padding:24px}
.fi{width:100%;padding:10px 13px;background:var(--bg);border:1.5px solid var(--bdr);
  border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;
  color:var(--txt);outline:none;margin-bottom:9px;transition:border-color .2s}
.fi:focus{border-color:var(--a);background:var(--surf)}
.fi-label{font-size:0.75rem;font-weight:700;color:var(--mut);text-transform:uppercase;
  letter-spacing:.5px;margin-bottom:5px;display:block}
.fi-group{margin-bottom:14px}
.fi-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.plan-select-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
.plan-select-opt{padding:10px;border-radius:10px;border:1.5px solid var(--bdr);
  cursor:pointer;transition:all .15s;text-align:center}
.plan-select-opt.on{border-color:var(--a);background:rgba(99,102,241,.06)}
.plan-select-name{font-weight:700;font-size:0.85rem}
.plan-select-price{font-size:0.75rem;color:var(--mut)}

/* TOAST */
.toast{position:fixed;top:70px;right:24px;background:var(--p);color:#fff;
  border-radius:100px;padding:10px 20px;font-weight:700;font-size:0.84rem;
  z-index:1000;box-shadow:0 8px 32px rgba(0,0,0,.15);animation:toastIn .3s;
  white-space:nowrap}
@keyframes toastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

/* DETAIL PANEL */
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
.detail-box{background:var(--bg);border-radius:10px;padding:12px 14px;border:1px solid var(--bdr)}
.detail-val{font-family:'Fraunces',serif;font-size:1.25rem;font-weight:700;color:var(--p)}
.detail-lbl{font-size:0.75rem;font-weight:600;color:var(--mut)}
.theme-swatch-row{display:flex;gap:8px;margin-top:8px}
.theme-swatch{width:36px;height:36px;border-radius:9px;border:2px solid var(--bdr)}

/* SECTION DIVIDER */
.sec-divider{padding:60px 0 0;border-top:1px solid var(--bdr);margin-top:60px}

@media(max-width:900px){
  .plans-grid,.steps-grid{grid-template-columns:1fr}
  .stats-row{grid-template-columns:repeat(2,1fr)}
  .fi-row{grid-template-columns:1fr}
  .saas-nav{padding:0 16px}
  .landing{padding:48px 16px 40px}
  .dash-wrap{padding:20px 16px}
}
`;

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SaasApp() {
  const [view, setView] = useState("landing");   // landing | dashboard
  const [dashTab, setDashTab] = useState("tenants");
  const [tenants, setTenants] = useState(TENANTS);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);      // null | 'new' | 'detail'
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = typeof window !== "undefined" ? useRef(null) : { current: null };

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const totalMRR = tenants.filter(t => t.status === "active").reduce((s, t) => s + t.mrr, 0);
  const totalOrders = tenants.reduce((s, t) => s + t.orders, 0);
  const totalRevenue = tenants.reduce((s, t) => s + t.revenue, 0);
  const activeCount = tenants.filter(t => t.status === "active").length;
  const trialCount = tenants.filter(t => t.status === "trial").length;

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.owner.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  const addTenant = (data) => {
    const newT = { ...data, id: Date.now().toString(), status: "trial", since: "Agora", revenue: 0, orders: 0, mrr: 0 };
    setTenants(prev => [newT, ...prev]);
    setModal(null);
    showToast("✅ Loja " + data.name + " criada!");
  };

  const updateTenant = (id, updates) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast("✅ Alterações salvas!");
  };

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="saas-nav">
        <div className="saas-logo">
          <div className="saas-logo-dot" />
          DeliveryHub
        </div>
        <div className="nav-actions">
          {view === "landing" ? (
            <>
              <button className="nav-btn ghost" onClick={() => { setView("dashboard"); setDashTab("tenants"); }}>Entrar</button>
              <button className="nav-btn fill" onClick={() => { setView("dashboard"); setDashTab("tenants"); }}>Começar grátis →</button>
            </>
          ) : (
            <>
              <button className="nav-btn ghost" onClick={() => setView("landing")}>← Landing Page</button>
              <button className="nav-btn fill" onClick={() => { setModal("new"); }}>+ Nova Loja</button>
            </>
          )}
        </div>
      </nav>

      {/* INNER TABS — only in dashboard */}
      {view === "dashboard" && (
        <div className="inner-tabs">
          {[
            { id: "tenants", icon: "🏪", label: "Lojas" },
            { id: "analytics", icon: "📊", label: "Analytics" },
            { id: "plans", icon: "💎", label: "Planos" },
          ].map(t => (
            <button key={t.id} className={"itab" + (dashTab === t.id ? " on" : "")} onClick={() => setDashTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      )}

      {/* VIEWS */}
      {view === "landing" && <LandingPage onCTA={() => { setView("dashboard"); }} />}
      {view === "dashboard" && dashTab === "tenants" && (
        <TenantsPage
          tenants={filteredTenants}
          search={search} setSearch={setSearch}
          onDetail={(t) => { setSelectedTenant(t); setModal("detail"); }}
          onNew={() => setModal("new")}
          totalMRR={totalMRR} totalOrders={totalOrders}
          totalRevenue={totalRevenue} activeCount={activeCount} trialCount={trialCount}
        />
      )}
      {view === "dashboard" && dashTab === "analytics" && (
        <AnalyticsPage tenants={tenants} totalMRR={totalMRR} totalRevenue={totalRevenue} totalOrders={totalOrders} />
      )}
      {view === "dashboard" && dashTab === "plans" && <PlansPage />}

      {/* MODALS */}
      {modal === "new" && <NewTenantModal onClose={() => setModal(null)} onSave={addTenant} />}
      {modal === "detail" && selectedTenant && (
        <TenantDetailModal
          tenant={selectedTenant}
          onClose={() => setModal(null)}
          onSave={(updates) => { updateTenant(selectedTenant.id, updates); setModal(null); }}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// ── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onCTA }) {
  return (
    <div>
      <div className="landing">
        {/* HERO */}
        <div className="hero-eyebrow">🚀 Plataforma SaaS de Delivery</div>
        <h1 className="hero-h1">
          Seu restaurante<br />
          vende mais com a <em>plataforma certa</em>
        </h1>
        <p className="hero-sub">
          Crie a loja de delivery do seu restaurante em minutos. Cardápio digital, carrinho otimizado para mobile, rastreamento de pedidos e painel admin — tudo com a sua cara.
        </p>
        <div className="hero-ctas">
          <button className="btn-lg fill" onClick={onCTA}>Criar minha loja grátis →</button>
          <button className="btn-lg outline" onClick={onCTA}>Ver demonstração</button>
        </div>

        {/* STATS */}
        <div className="stats-row">
          {[
            { val: "5+", lbl: "Lojas ativas" },
            { val: "1.200+", lbl: "Pedidos processados" },
            { val: "R$ 0", lbl: "Taxa por pedido" },
            { val: "< 5min", lbl: "Para configurar" },
          ].map(s => (
            <div key={s.val} className="stat-box">
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div>
          <div className="section-tag">Como funciona</div>
          <div className="section-h">Três passos para vender mais</div>
          <p className="section-sub">Do cadastro ao primeiro pedido em menos de uma hora.</p>
          <div className="steps-grid">
            {[
              { n: "01", t: "Crie sua loja", d: "Cadastre o nome, logo, banner e configure as cores da sua marca. Sua URL exclusiva fica pronta na hora." },
              { n: "02", t: "Adicione seu cardápio", d: "Crie categorias, produtos com fotos, variações (tamanho, ponto) e adicionais. Simples como montar uma planilha." },
              { n: "03", t: "Comece a receber pedidos", d: "Compartilhe o link com seus clientes. Receba pedidos, gerencie o status e acompanhe suas vendas em tempo real." },
            ].map(s => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.t}</div>
                <div className="step-desc">{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="sec-divider">
          <div className="section-tag">Funcionalidades</div>
          <div className="section-h">Tudo que seu restaurante precisa</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14, marginTop: 28 }}>
            {[
              { icon: "📱", t: "100% Mobile-First", d: "Interface projetada para quem pede pelo celular. 80% dos pedidos vêm do mobile." },
              { icon: "🛒", t: "Carrinho Inteligente", d: "Variações, adicionais, observações por item, pedido mínimo e taxa de entrega automática." },
              { icon: "📦", t: "Rastreamento ao Vivo", d: "Cliente acompanha o pedido em tempo real: confirmado, preparando, saiu, entregue." },
              { icon: "🎨", t: "Totalmente Personalizável", d: "Cores, logo, banner, nome — cada loja com a identidade visual da sua marca." },
              { icon: "💳", t: "Múltiplas Formas de Pag.", d: "PIX, cartão na entrega ou dinheiro com troco. Sem integrações complicadas." },
              { icon: "📊", t: "Analytics Completo", d: "Faturamento, pedidos, produtos mais vendidos, ticket médio e horário de pico." },
            ].map(f => (
              <div key={f.t} style={{ background: "#fff", border: "1px solid var(--bdr)", borderRadius: 16, padding: 20, transition: "box-shadow .2s" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.96rem", marginBottom: 5 }}>{f.t}</div>
                <div style={{ fontSize: "0.83rem", color: "var(--mut)", lineHeight: 1.55 }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING */}
        <div className="sec-divider">
          <div className="section-tag">Planos</div>
          <div className="section-h">Preço justo para todo tamanho</div>
          <div className="plans-grid">
            {PLANS.map(p => (
              <div key={p.id} className={"plan-card" + (p.highlight ? " highlight" : "")}>
                {p.highlight && <div className="plan-badge">⭐ Mais popular</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-desc">{p.desc}</div>
                <div className="plan-price">
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, marginTop: 4 }}>R$</span>
                  <span className="plan-price-val">{p.price}</span>
                  <span className="plan-price-per">/mês</span>
                </div>
                <ul className="plan-features">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className={"plan-btn " + (p.highlight ? "purple" : p.id === "agency" ? "dark" : "light")} onClick={onCTA}>
                  {p.id === "agency" ? "Falar com vendas" : "Começar agora →"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA FINAL */}
        <div style={{ background: "var(--p)", borderRadius: 24, padding: "48px 36px", textAlign: "center", marginTop: 60 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            Pronto para começar?
          </div>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1rem", marginBottom: 24 }}>
            Crie a loja do seu restaurante agora e receba seus primeiros pedidos hoje.
          </p>
          <button className="btn-lg fill" style={{ background: "#fff", color: "var(--p)" }} onClick={onCTA}>
            Criar minha loja grátis →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TENANTS PAGE ─────────────────────────────────────────────────────────────
function TenantsPage({ tenants, search, setSearch, onDetail, onNew, totalMRR, totalOrders, totalRevenue, activeCount, trialCount }) {
  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <div>
          <div className="dash-title">Suas Lojas</div>
          <div className="dash-sub">{activeCount} ativas · {trialCount} em trial</div>
        </div>
        <button className="btn-sm fill" onClick={onNew}>+ Nova Loja</button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">💰</div>
          <div className="kpi-val">{fmt(totalMRR)}</div>
          <div className="kpi-label">MRR (recorrência)</div>
          <div className="kpi-delta up">↑ +2 lojas este mês</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🏪</div>
          <div className="kpi-val">{tenants.length + activeCount}</div>
          <div className="kpi-label">Total de Lojas</div>
          <div className="kpi-delta up">↑ crescendo</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">📦</div>
          <div className="kpi-val">{totalOrders.toLocaleString()}</div>
          <div className="kpi-label">Pedidos Processados</div>
          <div className="kpi-delta up">↑ este mês</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">💳</div>
          <div className="kpi-val">{fmt(totalRevenue)}</div>
          <div className="kpi-label">Volume de Vendas</div>
          <div className="kpi-delta up">↑ das lojas parceiras</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="table-header-title">Todas as Lojas</span>
          <input className="table-search" placeholder="🔍 Buscar loja..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Loja</th>
              <th>URL</th>
              <th>Plano</th>
              <th>Status</th>
              <th>Pedidos</th>
              <th>Faturamento</th>
              <th>MRR</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id}>
                <td>
                  <div className="tenant-name-cell">
                    {t.avatar
                      ? <img className="tenant-avatar" src={t.avatar} alt="" onError={e => e.target.style.display = "none"} />
                      : <div className="tenant-avatar-ph">🍔</div>
                    }
                    <div>
                      <div className="tenant-name">{t.name}</div>
                      <div className="tenant-owner">{t.owner}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="store-url">
                    <span className="store-url-icon">🔗</span>
                    <span>{t.url}</span>
                  </div>
                </td>
                <td>
                  <span className={"plan-badge-sm plan-" + t.plan}>
                    {t.plan.charAt(0).toUpperCase() + t.plan.slice(1)}
                  </span>
                </td>
                <td>
                  <span className="status-dot">
                    <span className={"dot " + t.status} />
                    {t.status === "active" ? "Ativa" : t.status === "trial" ? "Trial" : "Inativa"}
                  </span>
                </td>
                <td>{t.orders.toLocaleString()}</td>
                <td>{fmt(t.revenue)}</td>
                <td style={{ fontWeight: 700, color: t.mrr > 0 ? "#059669" : "var(--mut)" }}>
                  {t.mrr > 0 ? fmt(t.mrr) : "—"}
                </td>
                <td>
                  <button className="action-btn" onClick={() => onDetail(t)}>Ver detalhes</button>
                  <button className="action-btn">Abrir loja ↗</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ANALYTICS PAGE ───────────────────────────────────────────────────────────
function AnalyticsPage({ tenants, totalMRR, totalRevenue, totalOrders }) {
  const byPlan = { starter: 0, pro: 0, agency: 0 };
  tenants.filter(t => t.status === "active").forEach(t => byPlan[t.plan]++);

  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <div>
          <div className="dash-title">Analytics</div>
          <div className="dash-sub">Visão consolidada de todas as lojas</div>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { icon: "💰", val: fmt(totalMRR), lbl: "MRR total", delta: "↑ +R$ 144 vs mês anterior", up: true },
          { icon: "📈", val: fmt(totalRevenue), lbl: "Volume de vendas gerado", delta: "↑ pelas suas lojas parceiras", up: true },
          { icon: "📦", val: totalOrders, lbl: "Pedidos processados", delta: "↑ +289 esta semana", up: true },
          { icon: "🏆", val: fmt(totalRevenue / (totalOrders || 1)), lbl: "Ticket médio por pedido", delta: "Acima da média do setor", up: true },
          { icon: "🏪", val: tenants.filter(t => t.status === "active").length, lbl: "Lojas ativas pagando", delta: "+" + tenants.filter(t => t.status === "trial").length + " em trial para converter", up: true },
          { icon: "🔄", val: (tenants.filter(t => t.status === "active").length / tenants.length * 100).toFixed(0) + "%", lbl: "Taxa de conversão trial→pago", delta: "Boa retenção", up: true },
        ].map(k => (
          <div key={k.lbl} className="kpi-card">
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-label">{k.lbl}</div>
            <div className={"kpi-delta " + (k.up ? "up" : "down")}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* DISTRIBUTION */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="table-card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: "0.95rem" }}>Distribuição por Plano</div>
          {PLANS.map(p => {
            const count = byPlan[p.id] || 0;
            const pct = tenants.length ? Math.round(count / tenants.length * 100) : 0;
            return (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: 5 }}>
                  <span>{p.name}</span>
                  <span style={{ color: "var(--mut)" }}>{count} loja(s) · {pct}%</span>
                </div>
                <div style={{ height: 8, background: "var(--bg)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: p.color, borderRadius: 4, transition: "width .4s" }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="table-card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: "0.95rem" }}>Top Lojas por Faturamento</div>
          {[...tenants].sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((t, i) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--bdr)" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, color: "var(--mut)", width: 20, textAlign: "center" }}>{i + 1}</span>
              {t.avatar && <img src={t.avatar} alt="" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
              <span style={{ flex: 1, fontWeight: 700, fontSize: "0.88rem" }}>{t.name}</span>
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, color: "#059669" }}>{fmt(t.revenue)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PLANS PAGE ────────────────────────────────────────────────────────────────
function PlansPage() {
  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <div>
          <div className="dash-title">Planos & Preços</div>
          <div className="dash-sub">Configure os planos que você oferece aos seus clientes</div>
        </div>
      </div>
      <div className="plans-grid">
        {PLANS.map(p => (
          <div key={p.id} className={"plan-card" + (p.highlight ? " highlight" : "")}>
            {p.highlight && <div className="plan-badge">⭐ Mais popular</div>}
            <div className="plan-name">{p.name}</div>
            <div className="plan-desc">{p.desc}</div>
            <div className="plan-price">
              <span style={{ fontSize: "0.9rem", fontWeight: 700, marginTop: 4 }}>R$</span>
              <span className="plan-price-val">{p.price}</span>
              <span className="plan-price-per">/mês</span>
            </div>
            <ul className="plan-features">
              {p.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <div style={{ display: "flex", gap: 8 }}>
              <button className={"plan-btn " + (p.highlight ? "purple" : "light")} style={{ flex: 1 }}>Editar plano</button>
            </div>
            <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--bg)", borderRadius: 10, fontSize: "0.8rem", color: "var(--mut)", fontWeight: 600, textAlign: "center" }}>
              {TENANTS.filter(t => t.plan === p.id).length} loja(s) neste plano
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MODALS ────────────────────────────────────────────────────────────────────
function NewTenantModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "", owner: "", email: "", phone: "",
    plan: "starter",
    url: "", avatar: "", banner: "",
    theme: { primary: "#1a1a2e", accent: "#e8a838" },
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.owner || !form.email) return;
    const slug = form.name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
    onSave({ ...form, url: slug + ".deliveryhub.com.br" });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">🏪 Nova Loja</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="fi-group">
            <label className="fi-label">Nome da Loja *</label>
            <input className="fi" placeholder="Ex: Boi Burguer" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="fi-row">
            <div className="fi-group">
              <label className="fi-label">Responsável *</label>
              <input className="fi" placeholder="Nome completo" value={form.owner} onChange={e => set("owner", e.target.value)} />
            </div>
            <div className="fi-group">
              <label className="fi-label">WhatsApp</label>
              <input className="fi" placeholder="(11) 99999-0000" value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
          </div>
          <div className="fi-group">
            <label className="fi-label">E-mail *</label>
            <input className="fi" type="email" placeholder="email@restaurante.com" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>

          <div className="fi-group" style={{ marginTop: 4 }}>
            <label className="fi-label">Plano</label>
            <div className="plan-select-row">
              {PLANS.map(p => (
                <div key={p.id} className={"plan-select-opt" + (form.plan === p.id ? " on" : "")} onClick={() => set("plan", p.id)}>
                  <div className="plan-select-name">{p.name}</div>
                  <div className="plan-select-price">R$ {p.price}/mês</div>
                </div>
              ))}
            </div>
          </div>

          <div className="fi-row">
            <div className="fi-group">
              <label className="fi-label">Cor Primária</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.theme.primary} onChange={e => set("theme", { ...form.theme, primary: e.target.value })} style={{ width: 38, height: 36, padding: 2, border: "1px solid var(--bdr)", borderRadius: 8, cursor: "pointer" }} />
                <input className="fi" value={form.theme.primary} onChange={e => set("theme", { ...form.theme, primary: e.target.value })} style={{ marginBottom: 0 }} />
              </div>
            </div>
            <div className="fi-group">
              <label className="fi-label">Cor de Destaque</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.theme.accent} onChange={e => set("theme", { ...form.theme, accent: e.target.value })} style={{ width: 38, height: 36, padding: 2, border: "1px solid var(--bdr)", borderRadius: 8, cursor: "pointer" }} />
                <input className="fi" value={form.theme.accent} onChange={e => set("theme", { ...form.theme, accent: e.target.value })} style={{ marginBottom: 0 }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn-sm outline" onClick={onClose}>Cancelar</button>
            <button className="btn-sm fill" onClick={handleSave} disabled={!form.name || !form.owner || !form.email}>
              Criar Loja →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TenantDetailModal({ tenant, onClose, onSave }) {
  const [form, setForm] = useState({ plan: tenant.plan, status: tenant.status });

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {tenant.avatar && <img src={tenant.avatar} alt="" style={{ width: 36, height: 36, borderRadius: 9, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
            <div className="modal-title">{tenant.name}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Metrics */}
          <div className="detail-grid">
            <div className="detail-box"><div className="detail-val">{fmt(tenant.revenue)}</div><div className="detail-lbl">Faturamento total</div></div>
            <div className="detail-box"><div className="detail-val">{tenant.orders}</div><div className="detail-lbl">Pedidos</div></div>
            <div className="detail-box"><div className="detail-val">{fmt(tenant.mrr)}</div><div className="detail-lbl">MRR</div></div>
            <div className="detail-box"><div className="detail-val">{tenant.since}</div><div className="detail-lbl">Cliente desde</div></div>
          </div>

          {/* Info */}
          <div style={{ background: "var(--bg)", borderRadius: 12, padding: 14, marginBottom: 16, fontSize: "0.85rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--mut)", width: 80, flexShrink: 0 }}>E-mail</span><span style={{ fontWeight: 600 }}>{tenant.email}</span></div>
              <div style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--mut)", width: 80, flexShrink: 0 }}>WhatsApp</span><span style={{ fontWeight: 600 }}>{tenant.phone}</span></div>
              <div style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--mut)", width: 80, flexShrink: 0 }}>URL</span><span style={{ fontWeight: 600, color: "var(--a)" }}>{tenant.url}</span></div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "var(--mut)", width: 80, flexShrink: 0 }}>Cores</span>
                <div className="theme-swatch-row">
                  <div className="theme-swatch" style={{ background: tenant.theme?.primary }} title="Primária" />
                  <div className="theme-swatch" style={{ background: tenant.theme?.accent }} title="Destaque" />
                </div>
              </div>
            </div>
          </div>

          {/* Edit plan/status */}
          <div className="fi-row">
            <div className="fi-group">
              <label className="fi-label">Plano</label>
              <select className="fi" value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} style={{ marginBottom: 0 }}>
                {PLANS.map(p => <option key={p.id} value={p.id}>{p.name} — R$ {p.price}/mês</option>)}
              </select>
            </div>
            <div className="fi-group">
              <label className="fi-label">Status</label>
              <select className="fi" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ marginBottom: 0 }}>
                <option value="active">Ativa</option>
                <option value="trial">Trial</option>
                <option value="inactive">Inativa</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
            <button className="btn-sm outline" onClick={onClose}>Fechar</button>
            <button className="btn-sm fill" onClick={() => onSave(form)}>Salvar alterações</button>
          </div>
        </div>
      </div>
    </div>
  );
}
