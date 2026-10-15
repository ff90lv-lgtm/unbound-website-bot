// Support tickets: {id, chatId, username, issue, orderId, status, created}
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'data', 'tickets.json');

function load() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
  catch { return []; }
}
function save(t) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(t, null, 1));
}
function newId() {
  const c = '0123456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)];
  return 'T' + s;
}
function create(chatId, username, issue, orderId) {
  const tickets = load();
  const t = { id: newId(), chatId, username: username || '', issue, orderId: orderId || '', status: 'open', created: new Date().toISOString() };
  tickets.push(t); save(tickets);
  return t;
}
function getById(id) {
  return load().find(t => t.id === id.toUpperCase());
}
function update(ticket) {
  const tickets = load();
  const i = tickets.findIndex(t => t.id === ticket.id);
  if (i >= 0) { tickets[i] = ticket; save(tickets); }
}
function openTickets() {
  return load().filter(t => t.status === 'open');
}

module.exports = { create, getById, update, openTickets };
