import { useState, useRef, useEffect, useCallback } from "react";

// ── MOCK STORE DATA ──────────────────────────────────────────────────────────
const STORE = {
  name: "Boi Burguer",
  tagline: "Hambúrgueres artesanais quentinhos na sua porta",
  banner: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=1200&h=400&fit=crop",
  avatar: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
  whatsapp: "(11) 99999-0000",
  deliveryTime: "30–45 min",
  deliveryFee: 5.90,
  minOrder: 25.00,
  rating: 4.8,
  reviews: 312,
  theme: { primary: "#1a1a2e", accent: "#e8a838" },
};

const CATEGORIES = [
  { id: 1, name: "Hambúrgueres", icon: "🍔" },
  { id: 2, name: "Acompanhamentos", icon: "🍟" },
  { id: 3, name: "Bebidas", icon: "🥤" },
  { id: 4, name: "Combos", icon: "🎁" },
];

const PRODUCTS = [
  {
    id: 1, categoryId: 1, name: "Boi Clássico",
    description: "Blend 180g, queijo cheddar, alface, tomate, cebola caramelizada e molho especial da casa",
    price: 29.90, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    available: true, badge: "🔥 Mais Pedido",
    variations: [
      { name: "Tamanho", required: true, options: [{ label: "Individual (180g)", price: 0 }, { label: "Grande (250g)", price: 8 }] },
      { name: "Ponto da Carne", required: true, options: [{ label: "Ao Ponto", price: 0 }, { label: "Bem Passado", price: 0 }, { label: "Mal Passado", price: 0 }] },
    ],
    extras: [{ label: "Bacon extra", price: 4 }, { label: "Ovo frito", price: 3 }, { label: "Queijo extra", price: 3 }],
  },
  {
    id: 2, categoryId: 1, name: "Boi Smash",
    description: "Dois smash burgers 80g cada, queijo americano duplo, picles, mostarda e ketchup artesanal",
    price: 34.90, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    available: true, badge: "⭐ Novo",
    variations: [
      { name: "Ponto da Carne", required: true, options: [{ label: "Ao Ponto", price: 0 }, { label: "Bem Passado", price: 0 }] },
    ],
    extras: [{ label: "Bacon extra", price: 4 }, { label: "Picles extra", price: 2 }],
  },
  {
    id: 3, categoryId: 1, name: "Boi Bacon Supreme",
    description: "Blend 200g, bacon crocante, queijo gouda, cebola crispy e molho BBQ defumado",
    price: 39.90, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    available: true,
    variations: [
      { name: "Tamanho", required: true, options: [{ label: "Individual (200g)", price: 0 }, { label: "Grande (280g)", price: 10 }] },
    ],
    extras: [{ label: "Bacon extra", price: 4 }, { label: "Ovo frito", price: 3 }],
  },
  {
    id: 4, categoryId: 2, name: "Batata Frita",
    description: "Porção 300g de batatas fritas crocantes com tempero especial da casa",
    price: 14.90, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    available: true,
    variations: [
      { name: "Tamanho", required: true, options: [{ label: "Média (300g)", price: 0 }, { label: "Grande (500g)", price: 8 }] },
    ],
    extras: [{ label: "Cheddar", price: 4 }, { label: "Bacon bits", price: 3 }],
  },
  {
    id: 5, categoryId: 2, name: "Onion Rings",
    description: "Anéis de cebola empanados na cerveja, crocantes e dourados",
    price: 16.90, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop",
    available: true, extras: [],
  },
  {
    id: 6, categoryId: 3, name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná, Sprite ou Fanta (350ml)",
    price: 6.90, image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=300&fit=crop",
    available: true,
    variations: [
      { name: "Sabor", required: true, options: [{ label: "Coca-Cola", price: 0 }, { label: "Guaraná", price: 0 }, { label: "Sprite", price: 0 }, { label: "Fanta Laranja", price: 0 }] },
    ],
    extras: [],
  },
  {
    id: 7, categoryId: 3, name: "Milk Shake",
    description: "Shake cremoso 400ml feito na hora",
    price: 18.90, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    available: true, badge: "❤️ Favorito",
    variations: [
      { name: "Sabor", required: true, options: [{ label: "Chocolate", price: 0 }, { label: "Morango", price: 0 }, { label: "Baunilha", price: 0 }, { label: "Doce de Leite", price: 0 }, { label: "Ovomaltine", price: 3 }] },
    ],
    extras: [],
  },
  {
    id: 8, categoryId: 4, name: "Combo Solo",
    description: "Boi Clássico + Batata Frita Média + Refrigerante Lata — economize R$ 7,80",
    price: 44.90, image: "https://images.unsplash.com/photo-1603064752734-4c48eff3f5e1?w=400&h=300&fit=crop",
    available: true, badge: "💰 Economia",
    extras: [],
  },
  {
    id: 9, categoryId: 4, name: "Combo Duplo",
    description: "2 Boi Clássico + 2 Batatas Fritas + 2 Refrigerantes — economize R$ 15,60",
    price: 79.90, image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop",
    available: true, badge: "💰 Melhor Valor",
    extras: [],
  },
];

const STATUS = {
  pending:   { label: "Aguardando confirmação", short: "Aguardando", color: "#f59e0b", bg: "#fffbeb", icon: "⏳", next: "preparing",  nextLabel: "Confirmar" },
  preparing: { label: "Preparando seu pedido",  short: "Preparando", color: "#3b82f6", bg: "#eff6ff", icon: "👨‍🍳", next: "delivery",   nextLabel: "Saiu p/ entrega" },
  delivery:  { label: "Saiu para entrega! 🛵",  short: "Na entrega", color: "#7c3aed", bg: "#f5f3ff", icon: "🛵", next: "delivered",  nextLabel: "Entregue" },
  delivered: { label: "Pedido entregue! 🎉",    short: "Entregue",   color: "#059669", bg: "#ecfdf5", icon: "✅", next: null,         nextLabel: null },
};

const PAYMENT = [
  { id: "pix",     label: "PIX",               icon: "📱", desc: "Aprovação instantânea" },
  { id: "card",    label: "Cartão na entrega",  icon: "💳", desc: "Débito ou crédito" },
  { id: "cash",    label: "Dinheiro",           icon: "💵", desc: "Troco se necessário" },
];

const fmt = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const uuid = () => "PED" + Math.random().toString(36).substring(2, 7).toUpperCase();

// ── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,800;1,700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --p:#1a1a2e; --a:#e8a838; --bg:#f5f4f0; --surf:#fff;
  --bdr:#ebe9e4; --txt:#1a1a2e; --mut:#92908a;
  --r:16px; --sh:0 2px 12px rgba(0,0,0,.07);
  --sh2:0 8px 40px rgba(0,0,0,.12);
  --safe-b:env(safe-area-inset-bottom,0px);
}
html{scroll-behavior:smooth}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--txt);
  -webkit-font-smoothing:antialiased;min-height:100vh;max-width:480px;margin:0 auto;
  position:relative;box-shadow:0 0 60px rgba(0,0,0,.1)}

/* scrollbar */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:4px}

/* HEADER */
.header{
  background:var(--surf);position:sticky;top:0;z-index:50;
  border-bottom:1px solid var(--bdr);
}
.header-inner{display:flex;align-items:center;justify-content:space-between;padding:12px 16px}
.header-logo{font-family:'Fraunces',serif;font-size:1.15rem;font-weight:800;color:var(--p);
  display:flex;align-items:center;gap:8px}
.header-logo img{width:28px;height:28px;border-radius:50%;object-fit:cover;border:2px solid var(--a)}
.cart-fab{
  position:relative;background:var(--p);color:#fff;
  border:none;border-radius:12px;padding:9px 16px;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.82rem;
  cursor:pointer;display:flex;align-items:center;gap:7px;
  transition:transform .15s,opacity .15s;
}
.cart-fab:active{transform:scale(.96)}
.cart-fab-badge{
  position:absolute;top:-7px;right:-7px;
  background:var(--a);color:var(--p);
  border-radius:50%;width:20px;height:20px;
  display:flex;align-items:center;justify-content:center;
  font-size:0.68rem;font-weight:800;border:2px solid var(--surf);
}

/* STORE HERO */
.hero-banner{width:100%;height:200px;position:relative;overflow:hidden}
.hero-banner img{width:100%;height:100%;object-fit:cover}
.hero-banner::after{content:'';position:absolute;inset:0;
  background:linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.6))}
.hero-avatar-wrap{
  position:absolute;bottom:-40px;left:50%;transform:translateX(-50%);z-index:5
}
.hero-avatar-ring{
  width:80px;height:80px;border-radius:50%;
  background:linear-gradient(135deg,var(--a),var(--p));
  padding:3px;box-shadow:var(--sh2);
}
.hero-avatar-ring img{width:100%;height:100%;border-radius:50%;object-fit:cover;
  border:3px solid #fff;display:block}

.store-info{background:var(--surf);padding:52px 16px 20px;text-align:center;
  border-bottom:1px solid var(--bdr)}
.store-name{font-family:'Fraunces',serif;font-size:1.5rem;font-weight:800;color:var(--p)}
.store-tagline{font-size:0.82rem;color:var(--mut);margin-top:3px}
.store-chips{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:12px}
.chip{
  display:flex;align-items:center;gap:5px;
  font-size:0.75rem;font-weight:600;color:var(--mut);
  background:var(--bg);padding:5px 10px;border-radius:100px;
  border:1px solid var(--bdr);
}
.chip.green{color:#059669;background:#ecfdf5;border-color:#a7f3d0}
.chip.yellow{color:#b45309;background:#fffbeb;border-color:#fde68a}

/* CATEGORIES */
.cat-scroll{
  display:flex;gap:8px;padding:14px 16px;
  overflow-x:auto;background:var(--surf);
  border-bottom:1px solid var(--bdr);
  -webkit-overflow-scrolling:touch;
}
.cat-scroll::-webkit-scrollbar{display:none}
.cat-pill{
  display:flex;align-items:center;gap:5px;
  padding:8px 14px;border-radius:100px;
  border:1.5px solid var(--bdr);background:transparent;
  color:var(--mut);font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:600;font-size:0.8rem;cursor:pointer;
  transition:all .18s;white-space:nowrap;
}
.cat-pill.on{background:var(--p);border-color:var(--p);color:#fff}

/* SECTION */
.prod-section{padding:20px 16px 4px}
.sec-hdr{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.sec-icon{font-size:1.2rem}
.sec-title{font-family:'Fraunces',serif;font-size:1.1rem;font-weight:700;color:var(--p)}
.sec-line{flex:1;height:1px;background:var(--bdr)}

/* PRODUCT CARDS (horizontal list style) */
.prod-card{
  display:flex;gap:12px;background:var(--surf);
  border-radius:var(--r);border:1px solid var(--bdr);
  padding:14px;margin-bottom:10px;cursor:pointer;
  transition:box-shadow .2s,transform .15s;
  position:relative;overflow:hidden;
}
.prod-card:active{transform:scale(.99)}
.prod-card:hover{box-shadow:var(--sh2)}
.prod-card-img{
  width:90px;height:90px;border-radius:12px;
  object-fit:cover;flex-shrink:0;
}
.prod-card-img-ph{
  width:90px;height:90px;border-radius:12px;
  background:var(--bg);display:flex;align-items:center;
  justify-content:center;font-size:2rem;flex-shrink:0;
}
.prod-card-body{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between}
.prod-badge{
  display:inline-flex;align-items:center;gap:3px;
  font-size:0.68rem;font-weight:700;
  background:var(--bg);color:var(--p);
  border-radius:6px;padding:3px 7px;
  margin-bottom:4px;align-self:flex-start;
  border:1px solid var(--bdr);
}
.prod-name{font-weight:700;font-size:0.93rem;color:var(--txt);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prod-desc{font-size:0.76rem;color:var(--mut);line-height:1.4;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
  margin:3px 0 8px}
.prod-footer{display:flex;align-items:center;justify-content:space-between}
.prod-price{font-family:'Fraunces',serif;font-size:1.1rem;font-weight:700;color:var(--p)}
.prod-add{
  width:34px;height:34px;border-radius:10px;border:none;
  background:var(--p);color:#fff;font-size:1.3rem;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:transform .15s,opacity .15s;flex-shrink:0;
}
.prod-add:active{transform:scale(.9)}
.prod-unavail{font-size:0.75rem;color:var(--mut);background:var(--bg);
  padding:5px 10px;border-radius:8px;font-weight:600}

/* PRODUCT MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:200;
  display:flex;align-items:flex-end;justify-content:center;
  animation:fadeO .2s}
@keyframes fadeO{from{opacity:0}to{opacity:1}}
.prod-modal{
  background:var(--surf);border-radius:24px 24px 0 0;
  width:100%;max-width:480px;max-height:92vh;
  overflow-y:auto;animation:slideUp .28s cubic-bezier(.32,1,.28,1);
  padding-bottom:calc(20px + var(--safe-b));
}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.prod-modal-img{width:100%;height:220px;object-fit:cover;display:block}
.prod-modal-body{padding:20px}
.prod-modal-name{font-family:'Fraunces',serif;font-size:1.4rem;font-weight:800;color:var(--p)}
.prod-modal-desc{font-size:0.87rem;color:var(--mut);margin-top:6px;line-height:1.55}
.prod-modal-price{font-family:'Fraunces',serif;font-size:1.6rem;font-weight:700;
  color:var(--p);margin-top:10px}
.divider{height:1px;background:var(--bdr);margin:16px 0}

/* VARIATIONS */
.var-section{margin-bottom:16px}
.var-title{font-weight:700;font-size:0.88rem;color:var(--txt);margin-bottom:8px;
  display:flex;align-items:center;justify-content:space-between}
.var-req{font-size:0.72rem;font-weight:700;color:#fff;
  background:var(--p);padding:2px 7px;border-radius:4px}
.var-options{display:flex;flex-direction:column;gap:6px}
.var-opt{
  display:flex;align-items:center;justify-content:space-between;
  padding:11px 14px;border-radius:12px;border:1.5px solid var(--bdr);
  cursor:pointer;transition:all .15s;
}
.var-opt.on{border-color:var(--p);background:rgba(26,26,46,.04)}
.var-opt-left{display:flex;align-items:center;gap:10px}
.var-radio{
  width:20px;height:20px;border-radius:50%;border:2px solid var(--bdr);
  display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;
}
.var-opt.on .var-radio{border-color:var(--p);background:var(--p)}
.var-radio-dot{width:8px;height:8px;border-radius:50%;background:#fff}
.var-opt-label{font-weight:600;font-size:0.88rem}
.var-opt-price{font-size:0.82rem;font-weight:700;color:var(--mut)}
.var-opt.on .var-opt-price{color:var(--p)}

/* EXTRAS (checkboxes) */
.extra-opt{
  display:flex;align-items:center;justify-content:space-between;
  padding:11px 14px;border-radius:12px;border:1.5px solid var(--bdr);
  cursor:pointer;transition:all .15s;margin-bottom:6px;
}
.extra-opt.on{border-color:var(--a);background:rgba(232,168,56,.06)}
.extra-check{
  width:20px;height:20px;border-radius:6px;border:2px solid var(--bdr);
  display:flex;align-items:center;justify-content:center;
  transition:all .15s;flex-shrink:0;font-size:0.7rem;
}
.extra-opt.on .extra-check{border-color:var(--a);background:var(--a);color:#fff}

/* OBS */
.obs-input{
  width:100%;padding:12px 14px;background:var(--bg);
  border:1.5px solid var(--bdr);border-radius:12px;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:0.87rem;
  color:var(--txt);outline:none;resize:none;height:80px;
  transition:border-color .2s;
}
.obs-input:focus{border-color:var(--p)}

/* QTY CTRL */
.qty-row{display:flex;align-items:center;justify-content:space-between;margin-top:20px}
.qty-ctrl{display:flex;align-items:center;gap:14px}
.qty-btn{
  width:38px;height:38px;border-radius:11px;border:1.5px solid var(--bdr);
  background:var(--bg);color:var(--txt);font-size:1.2rem;font-weight:700;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all .15s;
}
.qty-btn:active{transform:scale(.9)}
.qty-btn.minus:disabled{opacity:.3;cursor:not-allowed}
.qty-num{font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700;min-width:24px;text-align:center}
.add-cart-btn{
  flex:1;padding:14px;background:var(--p);color:#fff;
  border:none;border-radius:14px;margin-left:14px;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.95rem;
  cursor:pointer;transition:opacity .18s,transform .15s;
}
.add-cart-btn:active{transform:scale(.98)}
.add-cart-btn:disabled{opacity:.4;cursor:not-allowed}

/* CART DRAWER */
.drawer-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300;
  display:flex;align-items:flex-end;justify-content:center;
  animation:fadeO .2s;
}
.cart-sheet{
  background:var(--surf);border-radius:24px 24px 0 0;
  width:100%;max-width:480px;max-height:96vh;
  display:flex;flex-direction:column;
  animation:slideUp .28s cubic-bezier(.32,1,.28,1);
}
.cart-handle{width:40px;height:4px;border-radius:2px;
  background:var(--bdr);margin:12px auto 4px}
.cart-header{padding:4px 20px 16px;display:flex;align-items:center;justify-content:space-between}
.cart-title{font-family:'Fraunces',serif;font-size:1.35rem;font-weight:800;color:var(--p)}
.cart-close{width:32px;height:32px;border-radius:50%;background:var(--bg);
  border:none;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center}
.cart-body{flex:1;overflow-y:auto;padding:0 20px}

.cart-item{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--bdr)}
.cart-item-img{width:56px;height:56px;border-radius:10px;object-fit:cover;flex-shrink:0}
.cart-item-info{flex:1;min-width:0}
.cart-item-name{font-weight:700;font-size:0.9rem}
.cart-item-mods{font-size:0.75rem;color:var(--mut);margin-top:2px}
.cart-item-price{font-family:'Fraunces',serif;font-size:1rem;font-weight:700;
  color:var(--p);white-space:nowrap}
.cart-item-qty{display:flex;align-items:center;gap:8px;margin-top:6px}
.ci-btn{width:26px;height:26px;border-radius:8px;border:1px solid var(--bdr);
  background:var(--bg);cursor:pointer;font-size:0.9rem;font-weight:700;
  display:flex;align-items:center;justify-content:center;transition:all .15s}
.ci-btn:active{transform:scale(.9)}

/* CHECKOUT FORM */
.checkout-form{padding:16px 20px}
.form-section-title{font-weight:700;font-size:0.88rem;color:var(--mut);
  text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px;margin-top:18px}
.form-section-title:first-child{margin-top:0}
.fi{
  width:100%;padding:12px 14px;background:var(--bg);
  border:1.5px solid var(--bdr);border-radius:12px;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;
  color:var(--txt);outline:none;margin-bottom:8px;transition:border-color .2s;
}
.fi:focus{border-color:var(--p);background:var(--surf)}
.fi-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
textarea.fi{resize:none;height:64px}

/* PAYMENT OPTIONS */
.pay-grid{display:flex;flex-direction:column;gap:8px;margin-bottom:8px}
.pay-opt{
  display:flex;align-items:center;gap:12px;padding:13px 14px;
  border-radius:12px;border:1.5px solid var(--bdr);cursor:pointer;
  transition:all .18s;
}
.pay-opt.on{border-color:var(--p);background:rgba(26,26,46,.04)}
.pay-icon{font-size:1.3rem}
.pay-info{flex:1}
.pay-label{font-weight:700;font-size:0.9rem}
.pay-desc{font-size:0.75rem;color:var(--mut)}
.pay-radio{width:20px;height:20px;border-radius:50%;border:2px solid var(--bdr);
  transition:all .15s;display:flex;align-items:center;justify-content:center}
.pay-opt.on .pay-radio{border-color:var(--p);background:var(--p)}

/* ORDER SUMMARY */
.order-summary-box{
  background:var(--bg);border-radius:14px;padding:14px;margin:12px 0;
  border:1px solid var(--bdr);
}
.summ-row{display:flex;justify-content:space-between;font-size:0.85rem;
  color:var(--mut);padding:3px 0}
.summ-row.total{font-family:'Fraunces',serif;font-size:1.1rem;font-weight:700;
  color:var(--p);border-top:1px solid var(--bdr);margin-top:6px;padding-top:10px}

/* BOTTOM CTA */
.bottom-cta{
  padding:16px 20px calc(16px + var(--safe-b));
  background:var(--surf);border-top:1px solid var(--bdr);
}
.cta-btn{
  width:100%;padding:15px;background:var(--p);color:#fff;
  border:none;border-radius:16px;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:1rem;
  cursor:pointer;transition:opacity .18s,transform .15s;
  display:flex;align-items:center;justify-content:center;gap:8px;
}
.cta-btn:active{transform:scale(.98)}
.cta-btn:disabled{opacity:.4;cursor:not-allowed;transform:none}
.cta-btn.accent{background:var(--a);color:var(--p)}

/* STEP INDICATOR */
.steps-bar{
  display:flex;align-items:center;padding:14px 20px;
  background:var(--surf);border-bottom:1px solid var(--bdr);
  gap:6px;
}
.step-dot-sm{
  width:8px;height:8px;border-radius:50%;background:var(--bdr);
  transition:all .3s;
}
.step-dot-sm.on{background:var(--p);width:24px;border-radius:4px}
.steps-label{font-size:0.8rem;font-weight:600;color:var(--mut);margin-left:4px}

/* SUCCESS */
.success-screen{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;min-height:60vh;padding:40px 24px;text-align:center;
}
.success-icon{font-size:5rem;margin-bottom:16px;animation:popIn .4s cubic-bezier(.18,1.4,.4,1)}
@keyframes popIn{from{transform:scale(0)}to{transform:scale(1)}}
.success-title{font-family:'Fraunces',serif;font-size:1.8rem;font-weight:800;color:var(--p)}
.success-id{
  font-size:1rem;font-weight:700;color:var(--a);letter-spacing:2px;
  background:var(--bg);padding:8px 20px;border-radius:100px;
  border:1px solid var(--bdr);margin:12px 0;
}
.success-msg{font-size:0.9rem;color:var(--mut);line-height:1.6}

/* TRACKING */
.track-wrap{padding:20px}
.track-card{
  background:var(--surf);border-radius:20px;border:1px solid var(--bdr);
  overflow:hidden;box-shadow:var(--sh);
}
.track-status-header{
  padding:28px 20px;text-align:center;
}
.track-big-icon{font-size:3.5rem;display:block;margin-bottom:12px;animation:float 2s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.track-status-label{font-family:'Fraunces',serif;font-size:1.35rem;font-weight:700}
.track-order-id{font-size:0.8rem;color:var(--mut);margin-top:4px}

/* PROGRESS BAR */
.progress-steps{
  display:flex;justify-content:space-between;position:relative;
  padding:0 20px 24px;
}
.prog-line{position:absolute;top:14px;left:calc(20px + 14px);right:calc(20px + 14px);
  height:2px;background:var(--bdr);z-index:0}
.prog-fill{position:absolute;top:14px;left:calc(20px + 14px);
  height:2px;background:var(--a);z-index:1;transition:width .5s ease}
.prog-step{display:flex;flex-direction:column;align-items:center;gap:6px;z-index:2}
.prog-dot{width:28px;height:28px;border-radius:50%;border:2px solid var(--bdr);
  background:var(--bg);display:flex;align-items:center;justify-content:center;
  font-size:0.85rem;transition:all .3s}
.prog-dot.done{background:var(--a);border-color:var(--a);
  box-shadow:0 0 0 4px rgba(232,168,56,.2)}
.prog-lbl{font-size:0.65rem;font-weight:700;color:var(--mut);text-align:center;max-width:60px}
.prog-lbl.done{color:var(--p)}

.track-items{padding:16px 20px;border-top:1px solid var(--bdr)}
.track-item-row{display:flex;justify-content:space-between;
  font-size:0.85rem;padding:4px 0;color:var(--mut)}
.track-total-row{display:flex;justify-content:space-between;
  font-weight:700;font-size:0.95rem;color:var(--p);
  padding:10px 0 0;border-top:1px solid var(--bdr);margin-top:6px}
.track-addr{padding:0 20px 20px;font-size:0.8rem;color:var(--mut);
  display:flex;align-items:center;gap:6px}

/* TOAST */
.toast{
  position:fixed;top:70px;left:50%;transform:translateX(-50%);
  background:var(--p);color:#fff;border-radius:100px;
  padding:10px 20px;font-weight:700;font-size:0.85rem;
  z-index:1000;white-space:nowrap;
  animation:toastIn .3s cubic-bezier(.18,1.4,.4,1);
  box-shadow:0 8px 32px rgba(0,0,0,.2);
  max-width:90%;text-align:center;
}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

/* BOTTOM NAV */
.bottom-nav{
  position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:480px;
  background:var(--surf);border-top:1px solid var(--bdr);
  display:flex;padding-bottom:var(--safe-b);z-index:40;
}
.bnav-item{
  flex:1;display:flex;flex-direction:column;align-items:center;
  gap:4px;padding:10px 0;border:none;background:transparent;
  cursor:pointer;transition:all .18s;
}
.bnav-icon{font-size:1.3rem}
.bnav-label{font-size:0.65rem;font-weight:700;color:var(--mut)}
.bnav-item.on .bnav-label{color:var(--p)}
.bnav-item.on .bnav-icon{filter:brightness(0)}

.pb-nav{padding-bottom:calc(68px + var(--safe-b))}

/* EMPTY STATE */
.empty-st{display:flex;flex-direction:column;align-items:center;
  padding:52px 20px;text-align:center;color:var(--mut)}
.empty-ic{font-size:3rem;margin-bottom:12px}
.empty-tx{font-size:0.9rem;font-weight:600}

/* TRACK SEARCH */
.track-search{display:flex;gap:8px;margin-bottom:20px}
.track-input{flex:1;padding:12px 14px;background:var(--surf);
  border:1.5px solid var(--bdr);border-radius:12px;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;
  color:var(--txt);outline:none;transition:border-color .2s}
.track-input:focus{border-color:var(--p)}
.track-go{padding:12px 18px;background:var(--p);color:#fff;
  border:none;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:700;font-size:0.88rem;cursor:pointer}

/* MIN ORDER WARN */
.min-warn{
  background:#fffbeb;border:1px solid #fde68a;border-radius:10px;
  padding:10px 14px;font-size:0.8rem;font-weight:600;color:#b45309;
  margin-bottom:10px;display:flex;gap:6px;align-items:center;
}
`;

// ── APP ──────────────────────────────────────────────────────────────────────
export default function StoreApp() {
  const [tab, setTab] = useState("menu");          // menu | track
  const [activeCat, setActiveCat] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(0);     // 0=items 1=checkout 2=confirm
  const [productModal, setProductModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [orders, setOrders] = useState([]);
  const [trackId, setTrackId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "", phone: "", cep: "", address: "", number: "", complement: "",
    payment: "pix", change: "",
  });
  const [lastOrder, setLastOrder] = useState(null);
  const toastRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2200);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.totalPrice * i.qty, 0);
  const cartTotal = cartSubtotal + STORE.deliveryFee;
  const meetsMinOrder = cartSubtotal >= STORE.minOrder;

  // Cart ops
  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
    showToast("✅ " + item.name + " adicionado!");
    setProductModal(null);
  };

  const updateCartQty = (cartId, delta) => {
    setCart(prev => {
      const next = prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0);
      return next;
    });
  };

  const placeOrder = () => {
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      return showToast("⚠️ Preencha os campos obrigatórios");
    }
    if (!meetsMinOrder) return showToast("⚠️ Pedido mínimo não atingido");
    const id = uuid();
    const order = {
      id, status: "pending",
      customer: checkoutForm.name,
      phone: checkoutForm.phone,
      address: checkoutForm.address + ", " + checkoutForm.number + (checkoutForm.complement ? " - " + checkoutForm.complement : ""),
      payment: checkoutForm.payment,
      change: checkoutForm.change,
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee: STORE.deliveryFee,
      total: cartTotal,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setOrders(prev => [order, ...prev]);
    setLastOrder(order);
    setTrackedOrder(order);
    setCart([]);
    setCartStep(2);
  };

  const findOrder = () => {
    const o = orders.find(x => x.id === trackId.toUpperCase());
    setTrackedOrder(o || null);
    if (!o) showToast("❌ Pedido não encontrado");
  };

  // Advance order status (for demo)
  const advanceStatus = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next = STATUS[o.status].next;
      if (!next) return o;
      const updated = { ...o, status: next };
      if (trackedOrder?.id === id) setTrackedOrder(updated);
      return updated;
    }));
    showToast("Status atualizado!");
  };

  const openCart = () => { setCartStep(0); setCartOpen(true); };
  const closeCart = () => { setCartOpen(false); setTimeout(() => setCartStep(0), 300); };

  const filteredProducts = (catId) => PRODUCTS.filter(p => p.categoryId === catId);

  return (
    <>
      <style>{CSS}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <img src={STORE.avatar} alt="" onError={e => e.target.style.display = "none"} />
            {STORE.name}
          </div>
          <button className="cart-fab" onClick={openCart}>
            🛒 {cartCount > 0 ? fmt(cartSubtotal) : "Carrinho"}
            {cartCount > 0 && <span className="cart-fab-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* PAGES */}
      <div className="pb-nav">
        {tab === "menu" && (
          <MenuPage
            activeCat={activeCat} setActiveCat={setActiveCat}
            filteredProducts={filteredProducts}
            onProduct={setProductModal}
          />
        )}
        {tab === "track" && (
          <TrackPage
            orders={orders} trackId={trackId} setTrackId={setTrackId}
            trackedOrder={trackedOrder} findOrder={findOrder}
            advanceStatus={advanceStatus}
          />
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <button className={"bnav-item" + (tab === "menu" ? " on" : "")} onClick={() => setTab("menu")}>
          <span className="bnav-icon">🏪</span>
          <span className="bnav-label">Cardápio</span>
        </button>
        <button className={"bnav-item" + (tab === "track" ? " on" : "")} onClick={() => setTab("track")}>
          <span className="bnav-icon">📦</span>
          <span className="bnav-label">Meu Pedido</span>
        </button>
      </nav>

      {/* PRODUCT MODAL */}
      {productModal && (
        <ProductModal product={productModal} onClose={() => setProductModal(null)} onAdd={addToCart} />
      )}

      {/* CART SHEET */}
      {cartOpen && (
        <div className="drawer-overlay" onClick={e => e.target === e.currentTarget && closeCart()}>
          <div className="cart-sheet">
            <div className="cart-handle" />

            {/* Steps indicator */}
            {cartStep < 2 && (
              <div className="steps-bar">
                {["Itens", "Entrega & Pagamento"].map((s, i) => (
                  <div key={i} className={"step-dot-sm" + (cartStep >= i ? " on" : "")} />
                ))}
                <span className="steps-label">{["Revise seu pedido", "Finalizar pedido"][cartStep]}</span>
              </div>
            )}

            <div className="cart-header">
              <div className="cart-title">
                {cartStep === 0 ? "🛒 Carrinho" : cartStep === 1 ? "📋 Dados" : ""}
              </div>
              <button className="cart-close" onClick={closeCart}>✕</button>
            </div>

            {/* STEP 0 — ITEMS */}
            {cartStep === 0 && (
              <>
                <div className="cart-body">
                  {cart.length === 0 ? (
                    <div className="empty-st"><div className="empty-ic">🛒</div><p className="empty-tx">Nenhum item ainda</p></div>
                  ) : (
                    <>
                      {!meetsMinOrder && (
                        <div className="min-warn">
                          ⚠️ Pedido mínimo {fmt(STORE.minOrder)} · faltam {fmt(STORE.minOrder - cartSubtotal)}
                        </div>
                      )}
                      {cart.map(item => (
                        <div key={item.cartId} className="cart-item">
                          <img className="cart-item-img" src={item.image || ""} alt="" onError={e => e.target.style.display = "none"} />
                          <div className="cart-item-info">
                            <div className="cart-item-name">{item.name}</div>
                            {item.mods && <div className="cart-item-mods">{item.mods}</div>}
                            {item.obs && <div className="cart-item-mods">📝 {item.obs}</div>}
                            <div className="cart-item-qty">
                              <button className="ci-btn" onClick={() => updateCartQty(item.cartId, -1)}>−</button>
                              <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                              <button className="ci-btn" onClick={() => updateCartQty(item.cartId, 1)}>+</button>
                            </div>
                          </div>
                          <div className="cart-item-price">{fmt(item.totalPrice * item.qty)}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="bottom-cta">
                  <div className="order-summary-box">
                    <div className="summ-row"><span>Subtotal</span><span>{fmt(cartSubtotal)}</span></div>
                    <div className="summ-row"><span>Taxa de entrega</span><span>{fmt(STORE.deliveryFee)}</span></div>
                    <div className="summ-row total"><span>Total</span><span>{fmt(cartTotal)}</span></div>
                  </div>
                  <button className="cta-btn" disabled={cart.length === 0 || !meetsMinOrder} onClick={() => setCartStep(1)}>
                    Continuar →
                  </button>
                </div>
              </>
            )}

            {/* STEP 1 — CHECKOUT FORM */}
            {cartStep === 1 && (
              <>
                <div className="cart-body">
                  <div className="checkout-form">
                    <div className="form-section-title">Seus dados</div>
                    <input className="fi" placeholder="Nome completo *" value={checkoutForm.name} onChange={e => setCheckoutForm(p => ({ ...p, name: e.target.value }))} />
                    <input className="fi" placeholder="WhatsApp *" value={checkoutForm.phone} onChange={e => setCheckoutForm(p => ({ ...p, phone: e.target.value }))} />

                    <div className="form-section-title">Endereço de entrega</div>
                    <input className="fi" placeholder="CEP" value={checkoutForm.cep} onChange={e => setCheckoutForm(p => ({ ...p, cep: e.target.value }))} />
                    <input className="fi" placeholder="Rua / Avenida *" value={checkoutForm.address} onChange={e => setCheckoutForm(p => ({ ...p, address: e.target.value }))} />
                    <div className="fi-row">
                      <input className="fi" placeholder="Número *" value={checkoutForm.number} onChange={e => setCheckoutForm(p => ({ ...p, number: e.target.value }))} />
                      <input className="fi" placeholder="Complemento" value={checkoutForm.complement} onChange={e => setCheckoutForm(p => ({ ...p, complement: e.target.value }))} />
                    </div>

                    <div className="form-section-title">Forma de pagamento</div>
                    <div className="pay-grid">
                      {PAYMENT.map(p => (
                        <div key={p.id} className={"pay-opt" + (checkoutForm.payment === p.id ? " on" : "")} onClick={() => setCheckoutForm(prev => ({ ...prev, payment: p.id }))}>
                          <span className="pay-icon">{p.icon}</span>
                          <div className="pay-info">
                            <div className="pay-label">{p.label}</div>
                            <div className="pay-desc">{p.desc}</div>
                          </div>
                          <div className="pay-radio">
                            {checkoutForm.payment === p.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} />}
                          </div>
                        </div>
                      ))}
                    </div>
                    {checkoutForm.payment === "cash" && (
                      <input className="fi" placeholder="Troco para quanto? (opcional)" value={checkoutForm.change} onChange={e => setCheckoutForm(p => ({ ...p, change: e.target.value }))} />
                    )}

                    <div className="form-section-title">Resumo</div>
                    <div className="order-summary-box">
                      {cart.map(i => (
                        <div key={i.cartId} className="summ-row"><span>{i.qty}x {i.name}</span><span>{fmt(i.totalPrice * i.qty)}</span></div>
                      ))}
                      <div className="summ-row"><span>Taxa de entrega</span><span>{fmt(STORE.deliveryFee)}</span></div>
                      <div className="summ-row total"><span>Total</span><span>{fmt(cartTotal)}</span></div>
                    </div>
                  </div>
                </div>
                <div className="bottom-cta">
                  <button className="cta-btn" onClick={placeOrder}>
                    🚀 Fazer Pedido · {fmt(cartTotal)}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 — SUCCESS */}
            {cartStep === 2 && lastOrder && (
              <>
                <div className="cart-body">
                  <div className="success-screen">
                    <span className="success-icon">🎉</span>
                    <div className="success-title">Pedido realizado!</div>
                    <div className="success-id">{lastOrder.id}</div>
                    <p className="success-msg">
                      Seu pedido foi recebido e está sendo preparado.<br />
                      Guarde o código acima para acompanhar a entrega!
                    </p>
                  </div>
                </div>
                <div className="bottom-cta">
                  <button className="cta-btn" onClick={() => { closeCart(); setTab("track"); setTrackedOrder(lastOrder); setTrackId(lastOrder.id); }}>
                    📦 Acompanhar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// ── MENU PAGE ────────────────────────────────────────────────────────────────
function MenuPage({ activeCat, setActiveCat, filteredProducts, onProduct }) {
  return (
    <div>
      {/* HERO */}
      <div className="hero-banner">
        <img src={STORE.banner} alt="" />
        <div className="hero-avatar-wrap">
          <div className="hero-avatar-ring">
            <img src={STORE.avatar} alt="" onError={e => e.target.style.display = "none"} />
          </div>
        </div>
      </div>
      <div className="store-info">
        <div className="store-name">{STORE.name}</div>
        <div className="store-tagline">{STORE.tagline}</div>
        <div className="store-chips">
          <span className="chip yellow">⏱ {STORE.deliveryTime}</span>
          <span className="chip">🛵 {fmt(STORE.deliveryFee)}</span>
          <span className="chip green">⭐ {STORE.rating} ({STORE.reviews})</span>
          <span className="chip">📦 Mín. {fmt(STORE.minOrder)}</span>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="cat-scroll">
        <button className={"cat-pill" + (!activeCat ? " on" : "")} onClick={() => setActiveCat(null)}>Todos</button>
        {CATEGORIES.map(c => (
          <button key={c.id} className={"cat-pill" + (activeCat === c.id ? " on" : "")} onClick={() => setActiveCat(c.id)}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      {(!activeCat ? CATEGORIES : CATEGORIES.filter(c => c.id === activeCat)).map(cat => {
        const prods = filteredProducts(cat.id);
        if (!prods.length) return null;
        return (
          <div key={cat.id} className="prod-section">
            <div className="sec-hdr">
              <span className="sec-icon">{cat.icon}</span>
              <span className="sec-title">{cat.name}</span>
              <div className="sec-line" />
            </div>
            {prods.map(p => (
              <div key={p.id} className="prod-card" onClick={() => p.available && onProduct(p)}>
                {p.image
                  ? <img className="prod-card-img" src={p.image} alt={p.name} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                  : null}
                <div className="prod-card-img-ph" style={{ display: p.image ? "none" : "flex" }}>🍔</div>
                <div className="prod-card-body">
                  {p.badge && <span className="prod-badge">{p.badge}</span>}
                  <div className="prod-name">{p.name}</div>
                  <div className="prod-desc">{p.description}</div>
                  <div className="prod-footer">
                    <span className="prod-price">{fmt(p.price)}</span>
                    {p.available
                      ? <button className="prod-add" onClick={e => { e.stopPropagation(); onProduct(p); }}>+</button>
                      : <span className="prod-unavail">Indisponível</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── PRODUCT MODAL ────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [selectedVars, setSelectedVars] = useState({});
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [obs, setObs] = useState("");

  const varExtra = Object.values(selectedVars).reduce((s, v) => s + (v?.price || 0), 0);
  const extrasExtra = selectedExtras.reduce((s, e) => s + e.price, 0);
  const unitPrice = product.price + varExtra + extrasExtra;
  const totalPrice = unitPrice * qty;

  const allRequiredFilled = (product.variations || []).filter(v => v.required).every(v => selectedVars[v.name]);

  const toggleExtra = (extra) => {
    setSelectedExtras(prev => prev.find(e => e.label === extra.label) ? prev.filter(e => e.label !== extra.label) : [...prev, extra]);
  };

  const handleAdd = () => {
    const mods = [
      ...Object.entries(selectedVars).map(([, v]) => v?.label),
      ...selectedExtras.map(e => "+" + e.label),
    ].filter(Boolean).join(", ");

    onAdd({ ...product, qty, totalPrice: unitPrice, mods, obs });
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="prod-modal">
        {product.image && <img className="prod-modal-img" src={product.image} alt={product.name} />}
        <div className="prod-modal-body">
          <div className="prod-modal-name">{product.name}</div>
          <div className="prod-modal-desc">{product.description}</div>
          <div className="prod-modal-price">{fmt(product.price)}</div>

          {/* VARIATIONS */}
          {(product.variations || []).map(v => (
            <div key={v.name}>
              <div className="divider" />
              <div className="var-section">
                <div className="var-title">
                  {v.name}
                  {v.required && <span className="var-req">Obrigatório</span>}
                </div>
                <div className="var-options">
                  {v.options.map(opt => {
                    const on = selectedVars[v.name]?.label === opt.label;
                    return (
                      <div key={opt.label} className={"var-opt" + (on ? " on" : "")} onClick={() => setSelectedVars(p => ({ ...p, [v.name]: opt }))}>
                        <div className="var-opt-left">
                          <div className="var-radio">{on && <div className="var-radio-dot" />}</div>
                          <span className="var-opt-label">{opt.label}</span>
                        </div>
                        <span className="var-opt-price">{opt.price > 0 ? "+" + fmt(opt.price) : "Incluso"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* EXTRAS */}
          {product.extras?.length > 0 && (
            <div>
              <div className="divider" />
              <div className="var-title">Adicionais <span style={{ fontSize: "0.75rem", color: "var(--mut)", fontWeight: 500 }}>Opcional</span></div>
              {product.extras.map(ex => {
                const on = selectedExtras.find(e => e.label === ex.label);
                return (
                  <div key={ex.label} className={"extra-opt" + (on ? " on" : "")} onClick={() => toggleExtra(ex)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="extra-check">{on && "✓"}</div>
                      <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{ex.label}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--mut)" }}>+{fmt(ex.price)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* OBS */}
          <div className="divider" />
          <div className="var-title" style={{ marginBottom: 8 }}>Observações <span style={{ fontSize: "0.75rem", color: "var(--mut)", fontWeight: 500 }}>Opcional</span></div>
          <textarea className="obs-input" placeholder="Ex: sem cebola, molho à parte..." value={obs} onChange={e => setObs(e.target.value)} />

          {/* QTY + ADD */}
          <div className="qty-row">
            <div className="qty-ctrl">
              <button className="qty-btn minus" disabled={qty <= 1} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="add-cart-btn" disabled={!allRequiredFilled} onClick={handleAdd}>
              Adicionar · {fmt(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TRACK PAGE ───────────────────────────────────────────────────────────────
function TrackPage({ orders, trackId, setTrackId, trackedOrder, findOrder, advanceStatus }) {
  const steps = ["pending", "preparing", "delivery", "delivered"];
  const currIdx = trackedOrder ? steps.indexOf(trackedOrder.status) : -1;
  const pct = currIdx >= 0 ? (currIdx / (steps.length - 1)) * 100 : 0;

  return (
    <div className="track-wrap">
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: "1.4rem", fontWeight: 800, color: "var(--p)", marginBottom: 4 }}>Meu Pedido</div>
        <div style={{ fontSize: "0.82rem", color: "var(--mut)" }}>Acompanhe o status em tempo real</div>
      </div>

      <div className="track-search">
        <input className="track-input" placeholder="Código do pedido (ex: PED7K2X)" value={trackId} onChange={e => setTrackId(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && findOrder()} />
        <button className="track-go" onClick={findOrder}>Buscar</button>
      </div>

      {trackedOrder ? (
        <div className="track-card">
          <div className="track-status-header" style={{ background: STATUS[trackedOrder.status].bg }}>
            <span className="track-big-icon">{STATUS[trackedOrder.status].icon}</span>
            <div className="track-status-label" style={{ color: STATUS[trackedOrder.status].color }}>
              {STATUS[trackedOrder.status].label}
            </div>
            <div className="track-order-id">Pedido #{trackedOrder.id} · {trackedOrder.time}</div>
          </div>

          {/* PROGRESS */}
          <div className="progress-steps">
            <div className="prog-line" />
            <div className="prog-fill" style={{ width: `calc(${pct * 0.72}%)` }} />
            {steps.map((s, i) => (
              <div key={s} className="prog-step">
                <div className={"prog-dot" + (i <= currIdx ? " done" : "")}>{STATUS[s].icon}</div>
                <div className={"prog-lbl" + (i <= currIdx ? " done" : "")}>{STATUS[s].short}</div>
              </div>
            ))}
          </div>

          {trackedOrder.status === "delivery" && (
            <div style={{ margin: "0 20px 16px", background: "#f5f3ff", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", fontWeight: 600, color: "#6d28d9" }}>
              🛵 O motoboy já saiu! Prepare-se para receber seu pedido.
            </div>
          )}

          {/* ITEMS */}
          <div className="track-items">
            <div style={{ fontSize: "0.73rem", fontWeight: 700, color: "var(--mut)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Itens do pedido</div>
            {trackedOrder.items.map((item, i) => (
              <div key={i} className="track-item-row">
                <span>{item.qty}x {item.name}</span>
                <span>{fmt(item.totalPrice * item.qty)}</span>
              </div>
            ))}
            <div className="track-item-row"><span>Taxa de entrega</span><span>{fmt(trackedOrder.deliveryFee)}</span></div>
            <div className="track-total-row"><span>Total</span><span>{fmt(trackedOrder.total)}</span></div>
            <div style={{ marginTop: 8, fontSize: "0.8rem", color: "var(--mut)", display: "flex", gap: 6, alignItems: "center" }}>
              {PAYMENT.find(p => p.id === trackedOrder.payment)?.icon} {PAYMENT.find(p => p.id === trackedOrder.payment)?.label}
              {trackedOrder.change && ` · Troco para ${trackedOrder.change}`}
            </div>
          </div>

          <div className="track-addr">📍 {trackedOrder.address}</div>

          {/* DEMO: advance status button */}
          {STATUS[trackedOrder.status].next && (
            <div style={{ padding: "0 20px 20px" }}>
              <button style={{ width: "100%", padding: "11px", background: STATUS[trackedOrder.status].color, color: "#fff", border: "none", borderRadius: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }} onClick={() => advanceStatus(trackedOrder.id)}>
                🎬 [DEMO] Avançar: {STATUS[STATUS[trackedOrder.status].next].short}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-st">
          <div className="empty-ic">🔍</div>
          <p className="empty-tx">Digite o código do seu pedido acima</p>
        </div>
      )}

      {orders.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: "0.73rem", fontWeight: 700, color: "var(--mut)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Histórico</div>
          {orders.map(o => (
            <div key={o.id} style={{ background: "var(--surf)", borderRadius: 12, border: "1px solid var(--bdr)", padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => { setTrackedOrder(o); setTrackId(o.id); }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{o.id}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--mut)" }}>{o.time} · {fmt(o.total)}</div>
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: STATUS[o.status].bg, color: STATUS[o.status].color }}>
                {STATUS[o.status].icon} {STATUS[o.status].short}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
