// Panel catalog for Unbound Shop bot (prices from user's screenshots, 2026-10-15).
// platform: which phones the panel works on.
const PANELS = [
  { id: 'like', name: 'Profile Like Booster', platform: '', durations: [
    { id: 'l100', label: '100 Likes', price: '৳10' },
  ]},
  { id: 'glory', name: 'Guild Glory Booster', platform: '', durations: [
    { id: 'g1', label: '1 Basic', price: '৳125' },
    { id: 'g2', label: '2 Basic', price: '৳240' },
    { id: 'g5', label: '5 Basic', price: '৳600' },
    { id: 'g10', label: '10 Basic', price: '৳1150' },
  ]},
  { id: 'xreg', name: 'XREG', platform: 'Android + iOS', durations: [
    { id: 'x1h', label: '1 Hour', price: '৳15' },
    { id: 'x3h', label: '3 Hour', price: '৳30' },
    { id: 'x6h', label: '6 Hour', price: '৳50' },
    { id: 'x12h', label: '12 Hour', price: '৳90' },
    { id: 'x1d', label: '1 Day', price: '৳150' },
    { id: 'x3d', label: '3 Day', price: '৳250' },
    { id: 'x7d', label: '7 Day', price: '৳400' },
    { id: 'x30d', label: '30 Day', price: '৳700' },
  ]},
  { id: 'bala', name: 'BalaMod', platform: 'Android', durations: [
    { id: 'b1h', label: '1 Hour', price: '৳20' },
    { id: 'b3h', label: '3 Hour', price: '৳45' },
    { id: 'b6h', label: '6 Hour', price: '৳90' },
    { id: 'b12h', label: '12 Hour', price: '৳250' },
    { id: 'b24h', label: '24 Hour', price: '৳350' },
    { id: 'b2d', label: '2 Day', price: '৳650' },
    { id: 'b3d', label: '3 Day', price: '৳800' },
    { id: 'b7d', label: '7 Day', price: '৳2500' },
  ]},
  { id: 'troll', name: 'Troll Modz', platform: 'Android + iOS', durations: [
    { id: 't3d', label: '3 Days', price: '৳350' },
  ]},
  { id: 'drip', name: 'Drip Wire', platform: 'Android + iOS', durations: [
    { id: 'd6h', label: '6 Hour', price: '৳40' },
    { id: 'd12h', label: '12 Hour', price: '৳90' },
    { id: 'd1d', label: '1 Day', price: '৳139' },
    { id: 'd7d', label: '7 Day', price: '৳600' },
    { id: 'd30d', label: '30 Day', price: '৳1000' },
  ]},
];

function findPanel(id) { return PANELS.find(p => p.id === id); }
function findDuration(panel, durId) { return panel.durations.find(d => d.id === durId); }

function panelListButtons(L) {
  const cancel = L === 'bn' ? '❌ বাতিল' : '❌ Cancel';
  const menu = L === 'bn' ? '🏠 মেনু' : '🏠 Menu';
  const rows = [];
  for (let i = 0; i < PANELS.length; i += 2) {
    const p = PANELS[i];
    const label = p.platform ? `${p.name} (${p.platform})` : p.name;
    const row = [{ text: label, callback_data: `panel:${p.id}` }];
    const p2 = PANELS[i + 1];
    if (p2) {
      const label2 = p2.platform ? `${p2.name} (${p2.platform})` : p2.name;
      row.push({ text: label2, callback_data: `panel:${p2.id}` });
    }
    rows.push(row);
  }
  rows.push([{ text: cancel, callback_data: 'cancel' }, { text: menu, callback_data: 'menu:main' }]);
  return rows;
}

function durationButtons(panel, L) {
  const cancel = L === 'bn' ? '❌ বাতিল' : '❌ Cancel';
  const rows = [];
  for (let i = 0; i < panel.durations.length; i += 2) {
    const d = panel.durations[i];
    const row = [{ text: `${d.label} — ${d.price}`, callback_data: `dur:${panel.id}:${d.id}` }];
    const d2 = panel.durations[i + 1];
    if (d2) row.push({ text: `${d2.label} — ${d2.price}`, callback_data: `dur:${panel.id}:${d2.id}` });
    rows.push(row);
  }
  rows.push([{ text: cancel, callback_data: 'cancel' }]);
  return rows;
}

// Parse Bangladeshi WhatsApp number (01XXXXXXXXX).
function parseWhatsapp(t) {
  const m = t.replace(/[\s\-+]/g, '').match(/(01\d{9})/);
  return m ? m[1] : null;
}

module.exports = { PANELS, findPanel, findDuration, panelListButtons, durationButtons, parseWhatsapp };
