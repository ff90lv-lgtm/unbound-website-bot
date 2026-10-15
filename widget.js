/* UNBOUND SHOP — Website chat widget. Embed: <script src="https://YOUR-SERVER/widget.js" data-api="https://YOUR-SERVER"></script> */
(function () {
  var script = document.currentScript;
  var API = (script && script.getAttribute('data-api')) || '';
  if (!API) return;
  var sessionId = 'w' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  var open = false, greeted = false;

  var css = '#ub-chat-btn{position:fixed;bottom:20px;right:20px;width:58px;height:58px;border-radius:50%;background:#7c3aed;color:#fff;border:none;font-size:28px;cursor:pointer;z-index:99999;box-shadow:0 4px 14px rgba(0,0,0,.3)}'
    + '#ub-chat-win{display:none;position:fixed;bottom:90px;right:20px;width:340px;max-width:calc(100vw - 40px);height:480px;max-height:calc(100vh - 120px);background:#1e1e2e;border-radius:14px;z-index:99999;flex-direction:column;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.4);font-family:system-ui,sans-serif}'
    + '#ub-chat-win.open{display:flex}'
    + '#ub-chat-head{background:#7c3aed;color:#fff;padding:12px 14px;font-weight:700;font-size:15px}'
    + '#ub-chat-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#14141f}'
    + '.ub-msg{max-width:85%;padding:9px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}'
    + '.ub-bot{background:#2a2a3d;color:#eee;align-self:flex-start;border-bottom-left-radius:4px}'
    + '.ub-user{background:#7c3aed;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}'
    + '.ub-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}'
    + '.ub-btn{background:#3a3a55;color:#fff;border:1px solid #7c3aed;border-radius:18px;padding:7px 13px;font-size:13px;cursor:pointer}'
    + '.ub-btn:hover{background:#7c3aed}'
    + '#ub-chat-input{display:flex;border-top:1px solid #333;padding:8px;background:#1e1e2e}'
    + '#ub-chat-text{flex:1;background:#2a2a3d;border:none;border-radius:20px;padding:9px 14px;color:#fff;font-size:14px;outline:none}'
    + '#ub-chat-send{background:#7c3aed;border:none;color:#fff;border-radius:50%;width:38px;height:38px;margin-left:8px;cursor:pointer;font-size:16px}';

  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var btn = document.createElement('button'); btn.id = 'ub-chat-btn'; btn.textContent = '💬';
  var win = document.createElement('div'); win.id = 'ub-chat-win';
  win.innerHTML = '<div id="ub-chat-head">💎 UNBOUND SHOP</div><div id="ub-chat-body"></div>'
    + '<div id="ub-chat-input"><input id="ub-chat-text" placeholder="লিখুন..." autocomplete="off"/><button id="ub-chat-send">➤</button></div>';
  document.body.appendChild(btn); document.body.appendChild(win);
  var body = win.querySelector('#ub-chat-body'), input = win.querySelector('#ub-chat-text');

  btn.onclick = function () {
    open = !open; win.classList.toggle('open', open);
    if (open && !greeted) { greeted = true; send('', null); }
  };
  function addMsg(text, cls, buttons) {
    var d = document.createElement('div'); d.className = 'ub-msg ' + cls; d.textContent = text;
    body.appendChild(d);
    if (buttons && buttons.length) {
      var wrap = document.createElement('div'); wrap.className = 'ub-btns';
      buttons.forEach(function (row) {
        row.forEach(function (b) {
          var be = document.createElement('button'); be.className = 'ub-btn'; be.textContent = b.text;
          be.onclick = function () { addMsg(b.text, 'ub-user'); send('', b.action); };
          wrap.appendChild(be);
        });
      });
      var wd = document.createElement('div'); wd.style.alignSelf = 'flex-start'; wd.appendChild(wrap); body.appendChild(wd);
    }
    body.scrollTop = body.scrollHeight;
  }
  function send(text, action) {
    var payload = { sessionId: sessionId };
    if (action) payload.action = action; else payload.text = text;
    fetch(API + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (d) { (d.replies || []).forEach(function (r) { addMsg(r.text, 'ub-bot', r.buttons); }); })
      .catch(function () { addMsg('দুঃখিত, সমস্যা হচ্ছে 😔', 'ub-bot'); });
  }
  win.querySelector('#ub-chat-send').onclick = function () {
    var v = input.value.trim(); if (!v) return;
    addMsg(v, 'ub-user'); input.value = ''; send(v, null);
  };
  input.onkeydown = function (e) { if (e.key === 'Enter') win.querySelector('#ub-chat-send').click(); };
})();
