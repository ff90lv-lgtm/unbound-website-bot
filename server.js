// UNBOUND SHOP — Website chat bot server.
// Reuses the Telegram bot's brain, packages, panels, orders, tickets.
// Provides: POST /api/chat  +  serves widget.js and chat.html
// Railway-ready (uses PORT env).

const http = require('http');
const fs = require('fs');
const path = require('path');
const { Brain } = require('../server/brain.js');
const { detectLang, T } = require('../telegram/lang.js');
const panels = require('../telegram/panels.js');
const orders = require('../telegram/orders.js');
const tickets = require('../telegram/tickets.js');

const PORT = process.env.PORT || 8090;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_ID = '8654162902';
const PAYMENT_NUMBER = '01865124362';

const brain = new Brain();

// ---- Telegram notify (to Limon) ----
async function notifyLimon(text, buttons) {
  if (!TG_TOKEN) return;
  try {
    const body = { chat_id: ADMIN_ID, text, parse_mode: 'Markdown' };
    if (buttons) body.reply_markup = JSON.stringify({ inline_keyboard: buttons });
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
  } catch (e) { console.error('notify error:', e.message); }
}

// ---- Session state ----
const sessions = new Map(); // sessionId -> {lang, greeted}
function sess(id) {
  if (!sessions.has(id)) sessions.set(id, { lang: 'bng', greeted: false });
  return sessions.get(id);
}

// ---- Data (mirror telegram bot) ----
const PACKAGES = [
  { id: 'p2090', label: '2090💎', price: '1358', name: '2090 diamond (1358tk)' },
  { id: 'p2530', label: '2530💎⭐', price: '1610', name: '2530 diamond (1610tk)' },
  { id: 'p10120', label: '10120💎', price: '6440', name: '10120 diamond (6440tk)' },
  { id: 'p12650', label: '12650💎', price: '8050', name: '12650 diamond (8050tk)' },
  { id: 'pweekly', label: 'Weekly📅', price: '156', name: 'Weekly (156tk)' },
  { id: 'pmonthly', label: 'Monthly📅', price: '780', name: 'Monthly (780tk)' },
  { id: 'plevel', label: 'LevelUp⬆️', price: '', name: 'Level Up Pass' },
];

function btns(list) { return list.map(r => r.map(b => ({ text: b.t, action: b.a }))); }
function mainMenu(L) {
  return btns([
    [{ t: T(L, 'menu_diamond'), a: 'menu:diamond' }, { t: T(L, 'menu_panel'), a: 'menu:panel' }],
    [{ t: T(L, 'menu_catalog'), a: 'menu:catalog' }, { t: T(L, 'menu_orders'), a: 'menu:orders' }],
    [{ t: T(L, 'menu_payment'), a: 'menu:payment' }, { t: T(L, 'menu_support_btn'), a: 'menu:supportmenu' }],
  ]);
}
function pkgBtns(L) {
  const rows = [];
  for (let i = 0; i < PACKAGES.length; i += 2) {
    const p = PACKAGES[i], p2 = PACKAGES[i + 1];
    const row = [{ t: p.price ? `💎 ${p.label} ৳${p.price}` : `💎 ${p.label}`, a: `pkg:${p.id}` }];
    if (p2) row.push({ t: p2.price ? `💎 ${p2.label} ৳${p2.price}` : `💎 ${p2.label}`, a: `pkg:${p2.id}` });
    rows.push(row);
  }
  rows.push([{ t: T(L, 'menu_main'), a: 'menu:main' }]);
  return btns(rows);
}
function panelBtns(L) {
  const rows = panels.PANELS.map(p => [{ t: `🎮 ${p.name}${p.platform ? ` (${p.platform})` : ''}`, a: `panel:${p.id}` }]);
  rows.push([{ t: T(L, 'menu_main'), a: 'menu:main' }]);
  return btns(rows);
}

// ---- Core chat handler. Returns [{text, buttons}] ----
async function handleChat(sessionId, input) {
  const s = sess(sessionId);
  const replies = [];
  const say = (text, buttons) => replies.push({ text, buttons: buttons || [] });

  // Action (button tap)
  if (input.action) {
    return handleAction(sessionId, s, input.action, say, replies);
  }

  const text = (input.text || '').trim();
  if (!text) return replies;
  s.lang = detectLang(text);
  const L = s.lang;
  const t = text.toLowerCase().replace(/[?!।,]/g, ' ').replace(/\s+/g, ' ').trim();
  const has = (...ws) => ws.some(w => t.includes(w));

  // Greeting on first message
  if (!s.greeted) {
    s.greeted = true;
    say(T(L, 'menu_welcome'), mainMenu(L));
    return replies;
  }

  // Menu actions via text
  if (t === '/start' || t === 'start' || t === 'menu') {
    say(T(L, 'menu_short'), mainMenu(L));
    return replies;
  }

  // Intents (mirror telegram bot)
  const open = orders.getOpen('web:' + sessionId);
  if (!open && has('ki ki ache', 'ki ki ace', 'what do you have', 'ki bikri koro')) {
    say(T(L, 'what_have'), mainMenu(L)); return replies;
  }
  if (!open && has('dam koto', 'diamond price', 'price koto')) {
    const o = orders.create('web:' + sessionId, ''); o.status = 'awaiting_package'; orders.update(o);
    const list = PACKAGES.map(p => `• 💎 ${p.label}${p.price ? ` — ৳${p.price}` : ''}`).join('\n');
    say(`${T(L, 'diamond_price')}\n\n${list}`, pkgBtns(L)); return replies;
  }
  if (!open && has('kom hobe', 'discount', 'offer ache')) { say(T(L, 'discount_no')); return replies; }
  if (!open && has('kivabe order', 'how to order')) {
    say(T(L, 'how_order'), btns([[{ t: T(L, 'btn_pick_product'), a: 'menu:catalog' }]])); return replies;
  }
  if (!open && has('amar order kothay', 'order kothay', 'where is my order')) {
    return showOrders(sessionId, s, say, replies);
  }
  if (!open && has('diamond paini', 'diamond aseni')) { say(T(L, 'diamond_missing')); return replies; }
  if (!open && has('limon')) {
    say(T(L, 'limon_busy'));
    notifyLimon(`👤 Website visitor খুঁজছে (session ${sessionId}): "${text.slice(0, 80)}"`);
    return replies;
  }

  // Order flow text input
  if (open) {
    return handleOrderText(sessionId, s, open, text, t, has, say, replies);
  }

  // Brain fallback
  const { replies: br } = brain.decide('web:' + sessionId, text, L);
  for (const r of br) if (r !== 'MENU_FALLBACK') say(r);
  if (!replies.length) say(T(L, 'what_have'), mainMenu(L));
  return replies;
}

function showOrders(sessionId, s, say, replies) {
  const L = s.lang;
  const mine = orders.list().filter(o => o.chatId === 'web:' + sessionId && o.package).slice(-5).reverse();
  if (!mine.length) say(T(L, 'no_orders'), mainMenu(L));
  else {
    const lines = mine.map(o => `#${o.id} — ${o.package}`);
    say(`${T(L, 'your_orders')}\n\n${lines.join('\n')}`, mainMenu(L));
  }
  return replies;
}

async function handleAction(sessionId, s, action, say, replies) {
  const L = s.lang;
  const cid = 'web:' + sessionId;

  if (action === 'menu:main') { say(T(L, 'menu_short'), mainMenu(L)); return replies; }
  if (action === 'menu:diamond') {
    const o = orders.create(cid, ''); o.status = 'awaiting_package'; orders.update(o);
    const list = PACKAGES.map(p => `• 💎 ${p.label}${p.price ? ` — ৳${p.price}` : ''}`).join('\n');
    say(T(L, 'diamond_list', { list }), pkgBtns(L)); return replies;
  }
  if (action === 'menu:panel') {
    const o = orders.create(cid, ''); o.type = 'panel'; o.status = 'awaiting_panel'; orders.update(o);
    const list = panels.PANELS.map(p => `• 🎮 ${p.name}${p.platform ? ` (${p.platform})` : ''} — ${p.durations.map(d => d.price).join(' / ')}`).join('\n');
    say(T(L, 'panel_list', { list }), panelBtns(L)); return replies;
  }
  if (action === 'menu:catalog') {
    const rows = [];
    for (const p of PACKAGES) rows.push([{ t: `💎 ${p.label}${p.price ? ` ৳${p.price}` : ''}`, a: `pkg:${p.id}` }]);
    for (const p of panels.PANELS) rows.push([{ t: `🎮 ${p.name}`, a: `panel:${p.id}` }]);
    rows.push([{ t: T(L, 'menu_main'), a: 'menu:main' }]);
    say(T(L, 'menu_catalog') + ' 👇', btns(rows)); return replies;
  }
  if (action === 'menu:orders') return showOrders(sessionId, s, say, replies);
  if (action === 'menu:payment') {
    say(T(L, 'pay_help', { num: PAYMENT_NUMBER }), mainMenu(L)); return replies;
  }
  if (action === 'menu:supportmenu') {
    say(T(L, 'support_menu'), btns([
      [{ t: T(L, 'menu_ticket'), a: 'menu:support' }],
      [{ t: T(L, 'menu_chat_admin'), a: 'menu:admin' }],
      [{ t: T(L, 'menu_main'), a: 'menu:main' }],
    ])); return replies;
  }
  if (action === 'menu:support' || action === 'menu:admin') {
    const o = orders.create(cid, ''); o.status = action === 'menu:support' ? 'awaiting_support' : 'awaiting_admin_msg'; orders.update(o);
    say(action === 'menu:support' ? T(L, 'support_ask') : T(L, 'admin_ask')); return replies;
  }
  if (action.startsWith('pkg:')) {
    const pkg = PACKAGES.find(p => p.id === action.slice(4));
    if (!pkg) return replies;
    const o = orders.create(cid, pkg.name); o.type = 'diamond'; o.status = 'awaiting_confirm'; orders.update(o);
    say(`📦 *${pkg.name}*${pkg.price ? `\n💰 ৳${pkg.price}` : ''}\n\n${T(L, 'confirm_q')}`,
      btns([[{ t: T(L, 'btn_order_now'), a: 'confirm' }], [{ t: T(L, 'btn_back'), a: 'menu:diamond' }]]));
    return replies;
  }
  if (action.startsWith('panel:')) {
    const panel = panels.findPanel(action.slice(6));
    if (!panel) return replies;
    const o = orders.create(cid, panel.name); o.type = 'panel'; o.panelId = panel.id; o.status = 'awaiting_duration'; orders.update(o);
    const rows = panel.durations.map(d => [{ t: `${d.label} — ${d.price}`, a: `dur:${panel.id}:${d.id}` }]);
    rows.push([{ t: T(L, 'menu_main'), a: 'menu:main' }]);
    say(`🎮 *${panel.name}*\n${T(L, 'panel_pick')}`, btns(rows)); return replies;
  }
  if (action.startsWith('dur:')) {
    const [, pid, did] = action.split(':');
    const panel = panels.findPanel(pid), dur = panel && panels.findDuration(panel, did);
    if (!dur) return replies;
    const open = orders.getOpen(cid);
    if (!open) return replies;
    open.package = `${panel.name} — ${dur.label} (${dur.price})`;
    open.status = 'awaiting_confirm'; orders.update(open);
    say(`${T(L, 'your_selection')}\n📦 *${open.package}*\n\n${T(L, 'confirm_q')}`,
      btns([[{ t: T(L, 'btn_order_now'), a: 'confirm' }], [{ t: T(L, 'btn_back'), a: 'menu:panel' }]]));
    return replies;
  }
  if (action === 'confirm') {
    const open = orders.getOpen(cid);
    if (!open) return replies;
    open.status = 'awaiting_paid'; orders.update(open);
    const waNote = open.type === 'panel' ? `\n\n${T(L, 'panel_wa_note')}` : '';
    say(`✅ *${open.package}*${waNote}\n\n${T(L, 'pay_info', { num: PAYMENT_NUMBER })}`,
      btns([[{ t: T(L, 'btn_paid'), a: 'paid' }], [{ t: T(L, 'btn_cancel'), a: 'cancel' }]]));
    return replies;
  }
  if (action === 'paid') {
    const open = orders.getOpen(cid);
    if (!open) return replies;
    open.status = 'awaiting_method'; orders.update(open);
    say(T(L, 'ask_method'), btns([
      [{ t: 'বিকাশ', a: 'method:bKash' }, { t: 'নগদ', a: 'method:Nagad' }, { t: 'রকেট', a: 'method:Rocket' }],
    ])); return replies;
  }
  if (action.startsWith('method:')) {
    const open = orders.getOpen(cid);
    if (!open) return replies;
    open.payMethod = action.slice(7); open.status = 'awaiting_trxid'; orders.update(open);
    say(T(L, 'ask_trxid')); return replies;
  }
  if (action === 'cancel') {
    const open = orders.getOpen(cid);
    if (open) { open.status = 'done'; orders.update(open); }
    say(T(L, 'cancelled'), mainMenu(L)); return replies;
  }
  return replies;
}

async function handleOrderText(sessionId, s, open, text, t, has, say, replies) {
  const L = s.lang, cid = 'web:' + sessionId;
  if (open.status === 'awaiting_support') {
    const tk = tickets.create(cid, '', text, '');
    open.status = 'done'; orders.update(open);
    say(T(L, 'ticket_created', { id: tk.id }), mainMenu(L));
    notifyLimon(`🎫 *WEBSITE SUPPORT* ${tk.id}\nSession: \`${sessionId}\`\nবলেছে: "${text.slice(0, 120)}"`);
    return replies;
  }
  if (open.status === 'awaiting_admin_msg') {
    open.status = 'done'; orders.update(open);
    say(T(L, 'admin_contact'), mainMenu(L));
    notifyLimon(`👤 *WEBSITE ADMIN MSG*\nSession: \`${sessionId}\`\nবলেছে: "${text.slice(0, 150)}"`);
    return replies;
  }
  if (open.status === 'awaiting_trxid' && text.replace(/\s/g, '').length >= 6) {
    open.trxId = text.replace(/\s/g, '').toUpperCase();
    open.status = 'awaiting_verify'; open.submittedAt = new Date().toISOString(); orders.update(open);
    say(T(L, 'verifying'));
    const kind = open.type === 'panel' ? '🎮 PANEL' : '💎 DIAMOND';
    notifyLimon(`${kind} — Website order পেমেন্ট যাচাই করুন\n\n🆔 #${open.id}\n📦 ${open.package}\n💳 ${open.payMethod || '-'}\n🔢 \`${open.trxId}\``,
      [[{ text: '✅ পেমেন্ট পেয়েছি', callback_data: `vok:${open.id}` }],
       [{ text: '❌ পেমেন্ট পাইনি', callback_data: `vno:${open.id}` }],
       [{ text: '🔎 আবার যাচাই করব', callback_data: `vre:${open.id}` }]]);
    return replies;
  }
  if (open.status === 'awaiting_details' && /\d{5,}/.test(text)) {
    const m = text.match(/(\d{5,})/);
    open.uid = m[1]; open.name = text.replace(m[1], '').trim() || '-';
    open.status = 'pending'; orders.update(open);
    say(T(L, 'details_ok'));
    notifyLimon(`💎 *WEBSITE DIAMOND ORDER* #${open.id}\n📦 ${open.package}\n🎮 UID: \`${open.uid}\` 👤 ${open.name}\n💳 \`${open.trxId || '-'}\` ✅`,
      [[{ text: '✅ ডান', callback_data: `done:${open.id}` }]]);
    return replies;
  }
  if (open.status === 'awaiting_whatsapp' && /01\d{9}/.test(text.replace(/\D/g, ''))) {
    const wa = '0' + text.replace(/\D/g, '').slice(-10);
    open.uid = wa; open.status = 'pending'; orders.update(open);
    say(T(L, 'wa_ok'));
    notifyLimon(`🎮 *WEBSITE PANEL ORDER* #${open.id}\n📦 ${open.package}\n📱 WhatsApp: \`${wa}\`\n💳 \`${open.trxId || '-'}\` ✅`,
      [[{ text: '✅ প্যানেল ডেলিভারি সম্পন্ন', callback_data: `pdone:${open.id}` }]]);
    return replies;
  }
  // Fallback: brain
  const { replies: br } = brain.decide(cid, text, L);
  for (const r of br) if (r !== 'MENU_FALLBACK') say(r);
  return replies;
}

// ---- HTTP server ----
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (url.pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { sessionId, text, action } = JSON.parse(body);
        const id = String(sessionId || 'anon').slice(0, 64);
        const replies = await handleChat(id, { text, action });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ replies }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  if (url.pathname === '/health') { res.writeHead(200); res.end('ok'); return; }

  // Static files
  let fp = path.join(__dirname, url.pathname === '/' ? 'chat.html' : url.pathname.slice(1));
  if (!fp.startsWith(__dirname)) { res.writeHead(403); res.end(); return; }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Website bot server on :${PORT}`));
