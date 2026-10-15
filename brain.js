// UNBOUND Messenger bot — brain engine.
// Faithful implementation of brain.md (v1). No invented facts.
// All business facts below are copied from brain.md "Business facts".

const IDENTITY_ANSWER = {
  bn: "আমি লিমনের AI বট 🤖",
  bng: "Ami Limon er AI bot 🤖",
  en: "I'm Limon's AI bot 🤖",
};
const BUSY_ANSWER = {
  bn: "ভাই, লিমন এখন ব্যস্ত, পরে মেসেজ করুন 🙂",
  bng: "Vai, Limon ekhon busy, pore message koren 🙂",
  en: "Bro, Limon is busy now, message later 🙂",
};
const UNSURE_ANSWER = {
  bn: "এটা আমি সিউর না, ওনারকে জিজ্ঞেস করে জানাচ্ছি 🙂",
  bng: "Eita ami sure na, owner ke jigges kore janacchi 🙂",
  en: "Not sure about this, asking the owner 🙂",
};
const ESCALATE_ANSWER = {
  bn: "এক মিনিট ভাই, ওনারকে দেখাচ্ছি 🙂",
  bng: "Ek minute vai, owner ke dekhacchi 🙂",
  en: "One minute bro, checking with the owner 🙂",
};

const GREETING = {
  bn: ["আসসালামু আলাইকুম স্যার 🙂 কেমন আছেন?", "আমি লিমন, আপনাকে কিভাবে হেল্প করতে পারি?"],
  bng: ["Assalamualaikum sir 🙂 Kemon acho?", "Ami Limon, apnake kivabe help korte pari?"],
  en: ["Hello sir 🙂 How are you?", "I'm Limon, how can I help you?"],
};

const FALLBACK = "Bujhi nai vai, ektu clear kore bolo 🙂";

// --- Business facts (from brain.md — do not invent) ---
const PRICES = {
  uid: "UID Topup BD:\n2090 diamond — 1358tk\n2530 diamond — 1610tk (popular)\n10120 diamond — 6440tk\n12650 diamond — 8050tk 🙂",
  weekly: "Weekly/Monthly:\n1 Weekly — 156tk\n1 Monthly — 780tk\n3-Weekly — 468tk\n3-Monthly — 2340tk 🙂",
  levelup: "Level Up Pass:\n25 Level — 70tk\n30 Level — 100tk\nLevel up pass all — 400tk 🙂",
};
const ALL_PRICES =
  "Price list:\n" +
  "💎 2090 diamond — 1358tk\n" +
  "💎 2530 diamond — 1610tk (popular)\n" +
  "💎 10120 diamond — 6440tk\n" +
  "💎 12650 diamond — 8050tk\n" +
  "📅 1 Weekly — 156tk | 1 Monthly — 780tk\n" +
  "📅 3-Weekly — 468tk | 3-Monthly — 2340tk\n" +
  "⬆️ Level up: 25=70tk, 30=100tk, all=400tk 🙂";

const BKASH_NUMBER = "01865124362";

function normalize(t) {
  return (t || "").toLowerCase().replace(/[?!.,।]/g, " ").replace(/\s+/g, " ").trim();
}
function has(t, ...words) {
  return words.some((w) => t.includes(w));
}

class Brain {
  constructor() {
    // psid -> { greeted: bool, misses: number }
    this.state = new Map();
    this.seenPsids = new Set();
  }

  // Load PSIDs the bot has already talked to (from the learning log) so a
  // restart does not re-greet old customers.
  loadSeen(psids) {
    for (const p of psids) {
      this.seenPsids.add(p);
      this.state.set(p, { greeted: true, misses: 0 });
    }
  }

  markSeen(psid) {
    this.seenPsids.add(psid);
  }

  /**
   * Decide the reply/replies for one incoming text message.
   * Returns { replies: string[], escalate: boolean, tag: string }
   */
  decide(psid, rawText, lang) {
    const L = (lang === 'bn' || lang === 'en' || lang === 'bng') ? lang : 'bn';
    const text = normalize(rawText);
    let st = this.state.get(psid);
    if (!st) {
      st = { greeted: false, misses: 0 };
      this.state.set(psid, st);
    }

    // 1) New conversation → greeting flow (two short messages).
    if (!st.greeted && !this.seenPsids.has(psid)) {
      st.greeted = true;
      return { replies: GREETING[L], escalate: false, tag: "greeting" };
    }
    st.greeted = true;

    // 2) Identity question → honest answer.
    if (
      has(text, "apni ke", "tumi ke", "tui ke", "ke tumi", "ke apni", "bot naki", "ai bot", "robot") ||
      (has(text, "bot") && has(text, "tumi", "apni", "tui"))
    ) {
      st.misses = 0;
      return { replies: [IDENTITY_ANSWER[L]], escalate: false, tag: "identity" };
    }

    // 3) FAQ matching (owner's style, short replies).
    const faq = this.faq(text);
    if (faq) {
      st.misses = 0;
      return { replies: [faq.reply], escalate: faq.escalate, tag: faq.tag };
    }

    // 4) Can't answer → count misses; after 2 → busy/defer to owner.
    st.misses += 1;
    if (st.misses >= 2) {
      st.misses = 0;
      return { replies: [BUSY_ANSWER[L]], escalate: true, tag: "busy" };
    }
    return { replies: [UNSURE_ANSWER[L]], escalate: false, tag: "unsure" };
  }

  faq(text) {
    // What products/packages do you have? (handled by main bot menu now — keep as fallback)
    if (has(text, "ki ki ace", "ki ki ase", "ki pawa jay", "ki paoa jay", "ki sell", "sell koro", "becho", "bikri koro", "diamond sell", "dimond sell", "product list", "package list", "dokane ki", "kache ki", "tomar kache", "kiki ache", "kiki ase"))
      return r(
        "MENU_FALLBACK",
        "faq-products"
      );

    // Specific package prices
    if (has(text, "2090")) return r("2090 diamond 1358tk 🙂", "faq-price");
    if (has(text, "2530")) return r("2530 diamond 1610tk 🙂 (popular)", "faq-price");
    if (has(text, "10120") || has(text, "10k")) return r("10120 diamond 6440tk 🙂", "faq-price");
    if (has(text, "12650")) return r("12650 diamond 8050tk 🙂", "faq-price");
    if (has(text, "weekly") && has(text, "monthly")) return r(PRICES.weekly, "faq-price");
    if (has(text, "weekly")) return r("1 Weekly 156tk 🙂 3-Weekly 468tk", "faq-price");
    if (has(text, "monthly") || has(text, "monthli")) return r("1 Monthly 780tk 🙂 3-Monthly 2340tk", "faq-price");
    if (has(text, "level") && has(text, "pass"))
      return r(PRICES.levelup, "faq-price");
    if (has(text, "level up") || has(text, "levelup")) return r(PRICES.levelup, "faq-price");

    // General price question
    if (has(text, "price", "dam", "koto", "rate", "cost") && has(text, "diamond", "top", "up", "uid", "weekly", "monthly", "level", "pass", "dam"))
      return r(ALL_PRICES, "faq-price");
    if (has(text, "price koto", "dam koto", "koto taka", "koto tk", "price list"))
      return r(ALL_PRICES, "faq-price");

    // How to buy → give the app link
    if (has(text, "kivabe kinbo", "kivabe kimbo", "kivabe konbo", "kemne kinbo", "kivabe nibo", "kivabe order", "order korbo", "order korte", "kinte chai", "kinbo", "kimbo", "konbo", "nite chai", "kothay kinbo", "kotha theke kinbo"))
      return r("Eita amader app, check koro 🙂\nhttps://unbound-topup-zone.base44.app\n\nApp e package select kore UID dao, bKash e Send Money kore TrxID ta dio — 5-15 min e delivery paba", "faq-order");

    // Delivery time
    if (has(text, "kotokkhon", "koto khon", "kotokhon", "koy minute", "koto minute", "kobe pabo", "kokhon pabo", "delivery", "aste koto"))
      return r("5-15 min lage vai, payment verify hoilei delivery 🙂", "faq-time");

    // Standalone number request — no "bkash" word: "Numbar deo", "নম্বর দাও"
    if (has(text, "numbar deo", "number deo", "numbar dao", "number dao", "numbar den", "number den", "numbar daw", "number daw", "numbar diben", "number diben", "numbar ta", "number ta", "নম্বর দাও", "নাম্বার দাও", "নম্বর দেন", "নম্বর দিবেন"))
      return r(BKASH_NUMBER + " — Send Money korba, Cash Out na 🙂", "faq-payment");

    // bKash number
    if ((has(text, "bkash") || has(text, "bikash")) && has(text, "number", "numbar", "nmbr", "koto", "dao", "den", "daw", "ta"))
      return r(BKASH_NUMBER + " — Send Money korba, Cash Out na 🙂", "faq-payment");
    if (has(text, "bkash number", "bikash number", "nogod number", "nagad number", "rocket number", "upay number"))
      return r(
        has(text, "bkash", "bikash")
          ? BKASH_NUMBER + " — Send Money korba, Cash Out na 🙂"
          : "Number ta app e deya ache 🙂 bKash: " + BKASH_NUMBER,
        "faq-payment"
      );

    // Payment methods
    if (has(text, "payment", "pay korbo", "taka dibo", "tk dibo", "kivabe dibo", "send money"))
      return r("bKash/Nagad/Rocket/Upay te Send Money korba 🙂 TrxID ta mone raikho", "faq-payment");

    // TrxID
    if (has(text, "trxid", "trx id", "trx", "transaction"))
      return r("App e Add Money te giye TrxID ta boshao 🙂", "faq-trxid");

    // UID / player id
    if (has(text, "uid", "player id", "game id", "id dibo", "id koi"))
      return r("Tomar Free Fire UID ta dao 🙂 oitay diamond jabe", "faq-uid");

    // Discount
    if (has(text, "discount", "kom", "komano", "kombe", "offer"))
      return r("Fixed price vai 🙂", "faq-discount");

    // Trust / scam
    if (has(text, "scam", "fake", "batpar", "biswas", "trust", "real naki", "sotti"))
      return r("Na vai, 5-15 min e delivery paba 🙂", "faq-trust");

    // Greetings from customer (after greeting flow)
    if (has(text, "assalamualaikum", "salam", "hello", "hi", "hey", "adar")) {
      return r("Walaikum assalam 🙂 bolo, ki lagbe?", "faq-hello");
    }
    if (has(text, "kemon acho", "kemon aso", "kmn aso"))
      return r("Alhamdulillah valo 🙂 tomar ki lagbe bolo", "faq-hello");
    if (has(text, "valo", "alhamdulillah") && text.length < 25)
      return r("🙂 bolo, kon package lagbe?", "faq-hello");

    // What are you doing? (casual)
    if (has(text, "korco", "korcho", "ki koro", "ki korteso", "ki kortecho"))
      return r("Customer der help kortesi 🙂 tomar ki lagbe bolo", "faq-casual");

    // Thanks / ok
    if (has(text, "thanks", "dhonnobad", "shukriya", "ok", "thik", "accha", "bujhsi", "bujhechi"))
      return r("Welcome vai 🙂 lagle abar boilo", "faq-thanks");

    // Angry / complaint → apologize + escalate
    if (has(text, "baje", "kharap", "rag", "faltu", "dhanda", "taka back", "refund", "ferot", "pai nai", "painai", "ashe nai", "aseni"))
      return { reply: "দুঃখিত ভাই 😔 " + ESCALATE_ANSWER[L], escalate: true, tag: "complaint" };

    // Wrong UID / failed delivery → escalate
    if (has(text, "vul uid", "wrong uid", "uid vul", "delivery fail", "jaini"))
      return { reply: ESCALATE_ANSWER[L], escalate: true, tag: "delivery-issue" };

    return null;
  }
}

function r(reply, tag, escalate = false) {
  return { reply, tag, escalate };
}

module.exports = { Brain };
