// Order management: persistent order tracking for the Telegram bot.
// Orders: {id, chatId, package, trxId, uid, name, status, created}
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'data', 'orders.json');

function load() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
  catch { return []; }
}
function save(orders) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(orders, null, 1));
}
function newId() {
  const c = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

function create(chatId, pkg) {
  const orders = load();
  // one active order per chat — reuse if still open
  const open = orders.find(o => o.chatId === chatId && o.status !== 'done');
  if (open) return open;
  const o = { id: newId(), chatId, package: pkg || '', trxId: '', uid: '', name: '', status: 'awaiting_trxid', created: new Date().toISOString() };
  orders.push(o); save(orders);
  return o;
}
function getOpen(chatId) {
  return load().find(o => o.chatId === chatId && o.status !== 'done');
}
function getById(id) {
  return load().find(o => o.id === id.toUpperCase() && o.status !== 'done');
}
function update(order) {
  const orders = load();
  const i = orders.findIndex(o => o.id === order.id);
  if (i >= 0) { orders[i] = order; save(orders); }
}
function pending() {
  return load().filter(o => o.status !== 'done');
}

module.exports = { create, getOpen, getById, update, pending, list: () => load() };
