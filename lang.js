// Trilingual strings (bn = Bengali, bng = Banglish/romanized, en = English).
function detectLang(raw) {
  if (/[\u0980-\u09FF]/.test(raw)) return 'bn';
  const t = (raw || '').toLowerCase();
  const enWords = ['what', 'how ', 'price', 'buy', 'order', 'hello', 'hey', 'thanks', 'thank you', 'where', 'when ', 'do you have', 'i want', 'i need', 'please', 'bro'];
  if (enWords.some(w => t.includes(w))) return 'en';
  return 'bng';
}

const STR = {
  pkg_select: {
    bn: 'জি স্যার, ডায়মন্ড আছে 🙂 কোন প্যাকেজ নিবেন? 👇',
    bng: 'Ji sir, diamond ache 🙂 kon package niben? 👇',
    en: 'Yes sir, diamonds available 🙂 which package? 👇',
  },
  panel_select: {
    bn: 'জি স্যার, প্যানেল আছে 🙂 কোনটা নিবেন? 👇',
    bng: 'Ji sir, panel ache 🙂 konta niben? 👇',
    en: 'Yes sir, panels available 🙂 which one? 👇',
  },
  panel_pick: {
    bn: 'কত দিনের জন্য নিবেন? 👇',
    bng: 'Koto diner jonno niben? 👇',
    en: 'For how long? 👇',
  },
  your_selection: {
    bn: 'আপনার সিলেকশন:',
    bng: 'Apnar selection:',
    en: 'Your selection:',
  },
  confirm_q: {
    bn: 'কনফার্ম করুন? 👇',
    bng: 'Confirm koren? 👇',
    en: 'Confirm? 👇',
  },
  btn_paid: { bn: '✅ পেমেন্ট করেছি', bng: '✅ Payment korechi', en: '✅ Paid' },
  btn_cancel: { bn: '❌ বাতিল', bng: '❌ Cancel', en: '❌ Cancel' },
  btn_confirm: { bn: '✅ কনফার্ম', bng: '✅ Confirm', en: '✅ Confirm' },
  btn_real: { bn: '✅ রিয়েল', bng: '✅ Real', en: '✅ Real' },
  btn_fake: { bn: '❌ ফেক', bng: '❌ Fake', en: '❌ Fake' },
  btn_done: { bn: '✅ ডান', bng: '✅ Done', en: '✅ Done' },
  pay_info: {
    bn: 'বিকাশ/নগদ/রকেটে Send Money করুন\nনম্বর: {num}\n\nপেমেন্ট করে নিচে tap করুন 🙂',
    bng: 'bKash/Nagad/Rocket e Send Money korun\nNumber: {num}\n\nPayment kore niche tap korun 🙂',
    en: 'Send Money via bKash/Nagad/Rocket\nNumber: {num}\n\nTap below after payment 🙂',
  },
  panel_wa_note: {
    bn: '⚠️ প্যানেল WhatsApp-এ পাঠানো হবে',
    bng: '⚠️ Panel WhatsApp e pathano hobe',
    en: '⚠️ Panel will be sent via WhatsApp',
  },
  ask_trxid: {
    bn: 'TrxID টা লিখে পাঠান 🙂',
    bng: 'TrxID ta likhe pathan 🙂',
    en: 'Send your TrxID 🙂',
  },
  trxid_bad: {
    bn: 'TrxID টা ঠিকমতো লিখুন 🙂',
    bng: 'TrxID ta thik moto likhun 🙂',
    en: 'Please write the TrxID correctly 🙂',
  },
  verifying: {
    bn: 'Verify করছি, একটু অপেক্ষা করুন 🙂',
    bng: 'Verify kortesi, ektu wait korun 🙂',
    en: 'Verifying, please wait 🙂',
  },
  ask_uid: {
    bn: 'পেমেন্ট কনফার্ম ✅\nগেম UID + Free Fire নাম লিখুন 🙂',
    bng: 'Payment confirm ✅\nGame UID + Free Fire name likhun 🙂',
    en: 'Payment confirmed ✅\nSend game UID + Free Fire name 🙂',
  },
  ask_wa: {
    bn: 'পেমেন্ট কনফার্ম ✅\nWhatsApp নম্বরটা লিখুন 🙂',
    bng: 'Payment confirm ✅\nWhatsApp number ta likhun 🙂',
    en: 'Payment confirmed ✅\nSend your WhatsApp number 🙂',
  },
  ask_uid_retry: {
    bn: 'UID (নম্বর) + FF নাম লিখুন 🙂',
    bng: 'UID (number) + FF name likhun 🙂',
    en: 'Write UID (number) + FF name 🙂',
  },
  ask_wa_retry: {
    bn: 'WhatsApp নম্বরটা ঠিকমতো লিখুন 🙂',
    bng: 'WhatsApp number ta thik moto likhun 🙂',
    en: 'Write the WhatsApp number correctly 🙂',
  },
  details_ok: {
    bn: 'পেয়েছি ✅ ৫-১৫ মিনিটে ডায়মন্ড পাবেন 🙂',
    bng: 'Paisi ✅ 5-15 min e diamond paben 🙂',
    en: 'Got it ✅ you\'ll get diamonds in 5-15 min 🙂',
  },
  wa_ok: {
    bn: 'পেয়েছি ✅ WhatsApp-এ প্যানেল পাবেন 🙂',
    bng: 'Paisi ✅ WhatsApp e panel paben 🙂',
    en: 'Got it ✅ you\'ll get the panel on WhatsApp 🙂',
  },
  order_done: {
    bn: 'ডান ✅ পাঠিয়ে দিয়েছি, চেক করুন 🙂',
    bng: 'Done ✅ pathiye disi, check korun 🙂',
    en: 'Done ✅ sent, please check 🙂',
  },
  cancelled: {
    bn: 'বাতিল করে দিয়েছি 🙂',
    bng: 'Cancel kore disi 🙂',
    en: 'Cancelled 🙂',
  },
  pending_wait: {
    bn: 'অর্ডার প্রসেস হচ্ছে, একটু অপেক্ষা করুন 🙂',
    bng: 'Order process hoitese, ektu wait korun 🙂',
    en: 'Order is processing, please wait 🙂',
  },
  abuse: {
    bn: 'স্যার, দয়া করে গালি দিবেন না 🙂 কিভাবে হেল্প করতে পারি বলুন?',
    bng: 'Sir, doya kore gali diben na 🙂 kivabe help korte pari bolun?',
    en: 'Sir, please don\'t use bad words 🙂 how can I help?',
  },
  limon_busy: {
    bn: 'লিমন একটু ব্যস্ত আছে 🙂 আমি হেল্প করছি, বলুন কি লাগবে?',
    bng: 'Limon ektu busy ache 🙂 ami help kortesi, bolun ki lagbe?',
    en: 'Limon is a bit busy 🙂 I\'m here, what do you need?',
  },
  website_wait: {
    bn: 'স্যার একটু অপেক্ষা করুন, চেক করে জানাচ্ছি 🙂\nTrxID টা লিখে পাঠান',
    bng: 'Sir ektu wait korun, check kore janacchi 🙂\nTrxID ta likhe pathan',
    en: 'Sir please wait, checking 🙂\nSend your TrxID',
  },
  st_valo: {
    bn: 'আলহামদুলিল্লাহ, ভালো লাগলো 🙂 কি হেল্প লাগবে?',
    bng: 'Alhamdulillah, valo laglo 🙂 ki help lagbe?',
    en: 'Alhamdulillah, glad 🙂 how can I help?',
  },
  st_khabar: {
    bn: 'বাহ, ভালো 🙂 এখন বলুন কি লাগবে?',
    bng: 'Bah, valo 🙂 ekhon bolun ki lagbe?',
    en: 'Nice 🙂 now tell me what you need?',
  },
  st_ghum: {
    bn: 'ঠিক আছে, রেস্ট নিন 🙂',
    bng: 'Thik ache, rest nin 🙂',
    en: 'Ok, take rest 🙂',
  },
  st_kikoro: {
    bn: 'কাস্টমারদের হেল্প করছি 🙂 আপনার কি লাগবে?',
    bng: 'Customer der help kortesi 🙂 apnar ki lagbe?',
    en: 'Helping customers 🙂 what do you need?',
  },
  st_bye: {
    bn: 'আল্লাহ হাফেজ 🙂',
    bng: 'Allah hafez 🙂',
    en: 'Bye 🙂',
  },
  st_thanks: {
    bn: 'ওয়েলকাম 🙂',
    bng: 'Welcome 🙂',
    en: 'Welcome 🙂',
  },
  st_acho: {
    bn: 'জি, আছি 🙂 কিভাবে হেল্প করতে পারি?',
    bng: 'Ji, achi 🙂 kivabe help korte pari?',
    en: 'Yes, I\'m here 🙂 how can I help?',
  },
  // Main menu
  menu_welcome: {
    bn: '👋 হ্যালো স্যার! কেমন আছেন?\n\n❤️ *UNBOUND SHOP*-এ আপনাকে স্বাগতম!\n\nবলুন স্যার, কীভাবে আপনাকে সাহায্য করতে পারি?\n\nআমাদের শপে বর্তমানে কী কী পণ্য পাওয়া যাচ্ছে, সেগুলোর নাম, দাম ও বিস্তারিত নিচে দেখতে পারবেন। পছন্দের পণ্য নির্বাচন করে সহজেই অর্ডার করতে পারবেন 😊',
    bng: '👋 Hello sir! Kemon achen?\n\n❤️ *UNBOUND SHOP* e apnake swagotom!\n\nBolun sir, kivabe apnake sahajjo korte pari?\n\nAmader shop e ki ki product ache, nam, dam o details niche dekhte parben. Posonder product select kore easily order korte parben 😊',
    en: '👋 Hello sir! How are you?\n\n❤️ Welcome to *UNBOUND SHOP*!\n\nTell me sir, how can I help you?\n\nSee all our products, prices and details below. Select your favorite and order easily 😊',
  },
  menu_short: {
    bn: 'মেনু 👇',
    bng: 'Menu 👇',
    en: 'Menu 👇',
  },
  menu_diamond: { bn: '💎 ডায়মন্ড দেখুন', bng: '💎 Diamond dekhun', en: '💎 View Diamonds' },
  menu_panel: { bn: '🎮 সব প্যানেল দেখুন', bng: '🎮 Sob panel dekhun', en: '🎮 View All Panels' },
  menu_catalog: { bn: '🛍️ আমাদের সব পণ্য', bng: '🛍️ Amader sob ponno', en: '🛍️ All Products' },
  menu_orders: { bn: '📦 আমার অর্ডার', bng: '📦 Amar order', en: '📦 My Orders' },
  menu_payment: { bn: '💳 পেমেন্ট সহায়তা', bng: '💳 Payment help', en: '💳 Payment Help' },
  menu_support_btn: { bn: '👨‍💻 কাস্টমার সাপোর্ট', bng: '👨‍💻 Customer support', en: '👨‍💻 Support' },
  menu_ticket: { bn: '🎫 সমস্যা জানান', bng: '🎫 Somossa janan', en: '🎫 Report Issue' },
  menu_chat_admin: { bn: '👤 অ্যাডমিনের সাথে কথা', bng: '👤 Admin er sathe kotha', en: '👤 Talk to Admin' },
  menu_admin: { bn: '👤 অ্যাডমিন', bng: '👤 Admin', en: '👤 Admin' },
  menu_main: { bn: '🏠 মেনু', bng: '🏠 Menu', en: '🏠 Menu' },
  diamond_list: {
    bn: '💎 *ডায়মন্ড প্যাকেজ*\n\n{list}\n\nপছন্দের প্যাকেজে tap করুন 👇',
    bng: '💎 *Diamond Package*\n\n{list}\n\nPosonder package e tap korun 👇',
    en: '💎 *Diamond Packages*\n\n{list}\n\nTap your package 👇',
  },
  panel_list: {
    bn: '🎮 *সব প্যানেল*\n\n{list}\n\nপছন্দের প্যানেলে tap করুন 👇',
    bng: '🎮 *Sob Panel*\n\n{list}\n\nPosonder panel e tap korun 👇',
    en: '🎮 *All Panels*\n\n{list}\n\nTap your panel 👇',
  },
  support_menu: {
    bn: '👨‍💻 *কাস্টমার সাপোর্ট*\n\nকীভাবে সাহায্য করতে পারি? 👇',
    bng: '👨‍💻 *Customer Support*\n\nKivabe sahajjo korte pari? 👇',
    en: '👨‍💻 *Customer Support*\n\nHow can I help? 👇',
  },
  btn_back: { bn: '⬅️ ফিরে যান', bng: '⬅️ Fire jan', en: '⬅️ Back' },
  btn_order_now: { bn: '✅ অর্ডার নিশ্চিত করুন', bng: '✅ Order confirm korun', en: '✅ Confirm Order' },
  btn_pick_product: { bn: '🛍️ পণ্য নির্বাচন করুন', bng: '🛍️ Product select korun', en: '🛍️ Select Product' },
  // Conversational intents
  what_have: {
    bn: 'জি স্যার! 😊 আমাদের শপে বর্তমানে যা যা পাওয়া যাচ্ছে:\n\n💎 ডায়মন্ড প্যাকেজ\n🎮 গেমিং প্যানেল\n📱 Android ও iOS-এর জন্য প্যানেল\n\nস্যার, কোনটি দেখতে চান? নিচে tap করুন 👇',
    bng: 'Ji sir! 😊 Amader shop e ekhon ja ja pawa jacche:\n\n💎 Diamond package\n🎮 Gaming panel\n📱 Android o iOS er jonno panel\n\nSir, konta dekhte chan? Niche tap korun 👇',
    en: 'Yes sir! 😊 Here\'s what we have:\n\n💎 Diamond packages\n🎮 Gaming panels\n📱 Panels for Android & iOS\n\nWhich one? Tap below 👇',
  },
  diamond_price: {
    bn: 'অবশ্যই স্যার! 💎 আমাদের ডায়মন্ড প্যাকেজ ও দাম নিচে দিলাম। পছন্দেরটা tap করুন 👇',
    bng: 'Obosshoi sir! 💎 Amader diamond package o dam niche dilam. Posonderta tap korun 👇',
    en: 'Of course sir! 💎 Our diamond packages and prices below. Tap your choice 👇',
  },
  discount_no: {
    bn: 'বুঝতে পারছি স্যার! ❤️ আমাদের নির্ধারিত দামেই দিতে হবে। কোনো অফার এলে জানিয়ে দেব 🙂',
    bng: 'Bujhte parchi sir! ❤️ Amader fixed dam ei dite hobe. Kono offer asle janiye dibo 🙂',
    en: 'I understand sir! ❤️ We have fixed prices. I\'ll let you know of any offer 🙂',
  },
  how_order: {
    bn: 'খুব সহজ স্যার! 😊\n\n1️⃣ পছন্দের পণ্য নির্বাচন করুন\n2️⃣ দাম দেখে নিশ্চিত করুন\n3️⃣ পেমেন্ট করুন\n4️⃣ TrxID জমা দিন\n5️⃣ অ্যাডমিন যাচাই করে জানাবেন\n\nশুরু করতে নিচে tap করুন 👇',
    bng: 'Khub sohoj sir! 😊\n\n1️⃣ Posonder product select korun\n2️⃣ Dam dekhe confirm korun\n3️⃣ Payment korun\n4️⃣ TrxID joma din\n5️⃣ Admin verify kore janaben\n\nShuru korte niche tap korun 👇',
    en: 'Very easy sir! 😊\n\n1️⃣ Select product\n2️⃣ Confirm price\n3️⃣ Pay\n4️⃣ Submit TrxID\n5️⃣ Admin will verify\n\nTap below to start 👇',
  },
  paid_claim: {
    bn: 'ধন্যবাদ স্যার! ❤️ TrxID টা আর পেমেন্টের স্ক্রিনশট (থাকলে) পাঠান। অ্যাডমিন যাচাই করবেন 🙂',
    bng: 'Dhonnobad sir! ❤️ TrxID ta ar payment er screenshot (thakle) pathan. Admin verify korben 🙂',
    en: 'Thanks sir! ❤️ Send the TrxID and payment screenshot (if any). Admin will verify 🙂',
  },
  trxid_received: {
    bn: 'জি স্যার, তথ্য পেয়েছি ✅ যাচাইয়ের জন্য পাঠানো হচ্ছে। সম্পন্ন হলে জানাব 🙂',
    bng: 'Ji sir, info paisi ✅ jachai er jonno pathano hocche. Complete hole janabo 🙂',
    en: 'Got it sir ✅ sent for verification. I\'ll update you 🙂',
  },
  pay_confirmed: {
    bn: 'ধন্যবাদ স্যার! ✅ আমাদের অ্যাডমিন আপনার পেমেন্ট নিশ্চিত করেছেন। এখন পরবর্তী ধাপে এগোচ্ছি 🙂',
    bng: 'Dhonnobad sir! ✅ Amader admin apnar payment confirm korechen. Ekhon porer step e agocchi 🙂',
    en: 'Thanks sir! ✅ Our admin confirmed your payment. Moving to next step 🙂',
  },
  where_order: {
    bn: 'অবশ্যই স্যার! 😊 অর্ডার আইডি টা দিন, অথবা নিচে tap করুন 👇',
    bng: 'Obosshoi sir! 😊 Order ID ta din, othoba niche tap korun 👇',
    en: 'Of course sir! 😊 Give the order ID, or tap below 👇',
  },
  diamond_missing: {
    bn: 'দুঃখিত স্যার, অপেক্ষা করাচ্ছি ❤️ অর্ডার আইডি টা দিন, যাচাই করে দেখছি। প্রয়োজনে অ্যাডমিনকে জানাব 🙂',
    bng: 'Dukkho sir, wait koracchi ❤️ Order ID ta din, check kore dekhchi. Proyojone admin ke janabo 🙂',
    en: 'Sorry sir for the wait ❤️ give the order ID, I\'ll check. Will inform admin if needed 🙂',
  },
  complaint: {
    bn: 'দুঃখিত স্যার, সমস্যাটা বুঝতে পারছি ❤️ অর্ডারের তথ্য দিন, যাচাই করে সাহায্য করছি। প্রয়োজনে অ্যাডমিনকে পাঠাব 🙂',
    bng: 'Dukkho sir, somossa ta bujhte parchi ❤️ Order er info din, check kore help kortesi. Proyojone admin ke pathabo 🙂',
    en: 'Sorry sir, I understand ❤️ share order info, I\'ll check and help. Will escalate to admin if needed 🙂',
  },
  st_kemon: {
    bn: 'ভালো আছি স্যার! 😊 আমি আপনার এআই শপ সহকারী। বলুন, কীভাবে সাহায্য করতে পারি?',
    bng: 'Valo achi sir! 😊 Ami apnar AI shop assistant. Bolun, kivabe help korte pari?',
    en: 'I\'m good sir! 😊 I\'m your AI shop assistant. How can I help?',
  },
  st_accha: {
    bn: 'জি স্যার! 😊 আর কিছু লাগলে বলবেন',
    bng: 'Ji sir! 😊 Ar kichu lagle bolben',
    en: 'Yes sir! 😊 let me know if you need anything',
  },
  ios_panels: {
    bn: 'জি স্যার! 😊 iOS-এর জন্য উপলব্ধ প্যানেল:\n\n{list}\n\nপছন্দেরটায় tap করুন 👇',
    bng: 'Ji sir! 😊 iOS er jonno available panel:\n\n{list}\n\nPosondertay tap korun 👇',
    en: 'Yes sir! 😊 Panels available for iOS:\n\n{list}\n\nTap your choice 👇',
  },
  android_panels: {
    bn: 'জি স্যার! 😊 Android-এর জন্য উপলব্ধ প্যানেল:\n\n{list}\n\nপছন্দেরটায় tap করুন 👇',
    bng: 'Ji sir! 😊 Android er jonno available panel:\n\n{list}\n\nPosondertay tap korun 👇',
    en: 'Yes sir! 😊 Panels available for Android:\n\n{list}\n\nTap your choice 👇',
  },
  no_ios: {
    bn: 'দুঃখিত স্যার, iOS-এর জন্য এখন প্যানেল নেই 😔 Android-এর গুলো দেখবেন?',
    bng: 'Dukkho sir, iOS er jonno ekhon panel nei 😔 Android er gulo dekhben?',
    en: 'Sorry sir, no panels for iOS right now 😔 want to see Android ones?',
  },
  ask_method: {
    bn: 'কোন মাধ্যমে পেমেন্ট করেছেন? 👇',
    bng: 'Kon maddhome payment korechen? 👇',
    en: 'Which payment method did you use? 👇',
  },
  trxid_invalid: {
    bn: 'দুঃখিত! আপনার দেওয়া ট্রানজ্যাকশন আইডিটি সঠিক হিসেবে যাচাই করা যায়নি। দয়া করে পেমেন্টের রসিদ থেকে সঠিক ট্রানজ্যাকশন আইডিটি আবার দিন ❤️',
    bng: 'Dukkho! Apnar deya TrxID ta sothik hisebe jachai kora jayni. Doya kore payment er receipt theke sothik TrxID ta abar din ❤️',
    en: 'Sorry! Your TrxID could not be verified. Please send the correct TrxID from your payment receipt ❤️',
  },
  pay_not_received: {
    bn: 'আপনার পেমেন্টটি এখনো আমাদের অ্যাডমিন নিশ্চিত করতে পারেননি। দয়া করে পেমেন্টের রসিদ ও ট্রানজ্যাকশন আইডি যাচাই করুন। প্রয়োজনে আমাদের সঙ্গে যোগাযোগ করুন 🙂',
    bng: 'Apnar payment ta ekhono admin confirm korte pareni. Doya kore receipt o TrxID check korun. Proyojone amader sathe jogajog korun 🙂',
    en: 'Your payment could not be confirmed yet. Please check your receipt and TrxID. Contact us if needed 🙂',
  },
  panel_done_msg: {
    bn: 'প্যানেল ডেলিভারি সম্পন্ন ✅\nব্যবহার করে দেখুন 🙂',
    bng: 'Panel delivery somponno ✅\nUse kore dekhun 🙂',
    en: 'Panel delivered ✅\nEnjoy 🙂',
  },
  no_orders: {
    bn: 'আপনার কোনো অর্ডার নেই 🙂',
    bng: 'Apnar kono order nei 🙂',
    en: 'You have no orders 🙂',
  },
  your_orders: {
    bn: 'আপনার অর্ডারগুলো: 👇',
    bng: 'Apnar order gulo: 👇',
    en: 'Your orders: 👇',
  },
  pay_help: {
    bn: '💳 *পেমেন্ট সহায়তা*\n\nবিকাশ/নগদ/রকেটে Send Money করুন\nনম্বর: {num}\n\nপেমেন্ট করে TrxID টা এখানে পাঠান 🙂',
    bng: '💳 *Payment Help*\n\nbKash/Nagad/Rocket e Send Money korun\nNumber: {num}\n\nPayment kore TrxID ta ekhane pathan 🙂',
    en: '💳 *Payment Help*\n\nSend Money via bKash/Nagad/Rocket\nNumber: {num}\n\nSend your TrxID here after payment 🙂',
  },
  support_ask: {
    bn: 'কী সমস্যা হচ্ছে? লিখে জানান 🙂\n(অর্ডার আইডি থাকলে সেটাও দিন)',
    bng: 'Ki problem hocche? Likhe janan 🙂\n(Order ID thakle setao din)',
    en: 'What\'s the problem? Tell me 🙂\n(Share order ID if you have)',
  },
  ticket_created: {
    bn: 'টিকিট তৈরি হয়েছে ✅\n🎫 টিকিট: {id}\nশীঘ্রই জানাচ্ছি 🙂',
    bng: 'Ticket toiri hoyeche ✅\n🎫 Ticket: {id}\nShighroi janacchi 🙂',
    en: 'Ticket created ✅\n🎫 Ticket: {id}\nWe\'ll update soon 🙂',
  },
  admin_contact: {
    bn: 'অ্যাডমিনকে জানিয়ে দিয়েছি ✅\nআপনার মেসেজ পৌঁছে গেছে, শীঘ্রই উত্তর পাবেন 🙂',
    bng: 'Admin ke janiye disi ✅\nApnar message pouche geche, shighroi uttor paben 🙂',
    en: 'Admin notified ✅\nYour message was delivered 🙂',
  },
  admin_ask: {
    bn: 'অ্যাডমিনের জন্য মেসেজ লিখুন 👇',
    bng: 'Admin er jonno message likhun 👇',
    en: 'Write your message for admin 👇',
  },
  cancel_requested: {
    bn: 'বাতিলের অনুরোধ পাঠিয়েছি ✅\nঅ্যাডমিন দেখে জানাবে 🙂',
    bng: 'Batiler onurodh pathiyechi ✅\nAdmin dekhe janabe 🙂',
    en: 'Cancellation requested ✅\nAdmin will confirm 🙂',
  },
  screenshot_ok: {
    bn: 'স্ক্রিনশট পেয়েছি ✅ যাচাই করছি 🙂',
    bng: 'Screenshot paisi ✅ jachai kortesi 🙂',
    en: 'Screenshot received ✅ verifying 🙂',
  },
  // Order statuses
  status_awaiting: { bn: '⏳ অপেক্ষায়', bng: '⏳ Opekkhay', en: '⏳ Pending' },
  status_verifying: { bn: '🔍 যাচাই হচ্ছে', bng: '🔍 Jachai hocche', en: '🔍 Verifying' },
  status_processing: { bn: '⚙️ কাজ চলছে', bng: '⚙️ Kaj cholche', en: '⚙️ Processing' },
  status_done: { bn: '✅ সম্পন্ন', bng: '✅ Somponno', en: '✅ Done' },
  status_cancel_req: { bn: '🚫 বাতিলের অনুরোধ', bng: '🚫 Batil request', en: '🚫 Cancel requested' },
};

function T(lang, key, vars) {
  let s = (STR[key] && STR[key][lang]) || (STR[key] && STR[key]['bng']) || key;
  if (vars) for (const k in vars) s = s.replace(`{${k}}`, vars[k]);
  return s;
}

module.exports = { detectLang, T };
