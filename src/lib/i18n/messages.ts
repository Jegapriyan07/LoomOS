import type { LanguageCode } from "@/lib/voice/languages";

export type MessageKey =
  | "nav.home"
  | "nav.plan"
  | "nav.money"
  | "nav.orders"
  | "nav.profile"
  | "topbar.signOut"
  | "auth.login"
  | "auth.register"
  | "auth.weaverTitle"
  | "auth.loginSubtitle"
  | "auth.registerSubtitle"
  | "auth.phone"
  | "auth.otp"
  | "auth.sendOtp"
  | "auth.sending"
  | "auth.verify"
  | "auth.checking"
  | "auth.changeNumber"
  | "auth.codeSentTo"
  | "auth.devCode"
  | "auth.devNote"
  | "auth.yourName"
  | "auth.region"
  | "auth.language"
  | "auth.categories"
  | "auth.categoriesHint"
  | "auth.seedHint"
  | "auth.checkingSignIn"
  | "auth.skipToSignIn"
  | "home.question"
  | "home.loading"
  | "home.todaysAdvice"
  | "home.refresh"
  | "home.demandScore"
  | "home.hearAgain"
  | "home.askByVoice"
  | "home.listening"
  | "home.why"
  | "home.moneyTitle"
  | "home.moneySimNote"
  | "home.nextPayment"
  | "home.noPayment"
  | "home.advanceHeld"
  | "home.walletQuiet"
  | "home.demoSimulated"
  | "voice.speaking"
  | "voice.notSupported"
  | "voice.speakFailed"
  | "voice.listeningHint"
  | "voice.micUnavailable"
  | "voice.didntCatch"
  | "voice.micError"
  | "voice.heard"
  | "voice.speakPage"
  | "voice.stop"
  | "voice.ask"
  | "voice.a11yLabel"
  | "voice.navListening"
  | "voice.navMic"
  | "voice.navLabel"
  | "voice.navA11yLabel"
  | "chat.title"
  | "chat.subtitle"
  | "chat.placeholder"
  | "chat.send"
  | "chat.summarize"
  | "chat.thinking"
  | "chat.emptyHint"
  | "chat.you"
  | "chat.assistant"
  | "chat.error"
  | "common.loading"
  | "common.demoSimulated"
  | "plan.title"
  | "plan.subtitle"
  | "plan.whatWeave"
  | "plan.whenReady"
  | "plan.festivalNote"
  | "plan.ownDate"
  | "plan.daysHeading"
  | "plan.daysWarning"
  | "plan.resetDefaults"
  | "plan.weavingDays"
  | "plan.yarnDays"
  | "plan.qcDays"
  | "plan.shipDays"
  | "plan.settleDays"
  | "timeline.title"
  | "timeline.estimatedPlan"
  | "timeline.estimatedHint"
  | "timeline.buyYarn"
  | "timeline.buyYarnDetail"
  | "timeline.startWeaving"
  | "timeline.startWeavingDetail"
  | "timeline.finish"
  | "timeline.dispatch"
  | "timeline.dispatchDetail"
  | "timeline.ready"
  | "timeline.readyDetail"
  | "timeline.moneyExpected"
  | "timeline.moneyDetail"
  | "timeline.estimated"
  | "timeline.nhdcTitle"
  | "timeline.nhdcBody"
  | "money.title"
  | "money.subtitle"
  | "money.prototypeLabel"
  | "money.walletSnapshot"
  | "money.advanceHeld"
  | "money.noAdvance"
  | "money.nextProjected"
  | "money.noSettlement"
  | "money.yourOrders"
  | "money.buyerFallback"
  | "money.buyerTrust"
  | "money.demoNext"
  | "money.question"
  | "money.adminHint"
  | "money.loadingError"
  | "orders.title"
  | "orders.subtitle"
  | "orders.demoNote"
  | "orders.empty"
  | "orders.piecesNeeded"
  | "orders.priceRange"
  | "orders.fromBuyer"
  | "orders.buyerLink"
  | "wallet.title"
  | "wallet.subtitle"
  | "wallet.demoNote"
  | "wallet.available"
  | "wallet.reserve"
  | "wallet.floor"
  | "wallet.showRule"
  | "wallet.moveToReserve"
  | "wallet.drawFromReserve"
  | "wallet.trailingAvg"
  | "wallet.notEnoughHistory"
  | "wallet.usualMonth"
  | "wallet.howAverage"
  | "wallet.thisMonthSettled"
  | "wallet.projected"
  | "wallet.notAvailableYet"
  | "wallet.showProjection"
  | "wallet.reserveRules"
  | "wallet.reserveFloor"
  | "wallet.savePct"
  | "wallet.saveRules"
  | "wallet.incomeLog"
  | "wallet.noSettlements"
  | "wallet.loading"
  | "record.title"
  | "record.loading"
  | "record.copyLink"
  | "record.copied"
  | "record.open"
  | "record.print";

type Catalog = Record<MessageKey, string>;

const en: Catalog = {
  "nav.home": "Home",
  "nav.plan": "Plan",
  "nav.money": "Money",
  "nav.orders": "Orders",
  "nav.profile": "Profile",
  "topbar.signOut": "Sign out",
  "auth.login": "Login",
  "auth.register": "Register",
  "auth.weaverTitle": "Weaver access",
  "auth.loginSubtitle": "Sign in with your registered mobile number.",
  "auth.registerSubtitle":
    "Create your weaver profile — we use this for advice and voice.",
  "auth.phone": "Mobile number",
  "auth.otp": "6-digit OTP",
  "auth.sendOtp": "Send OTP",
  "auth.sending": "Sending…",
  "auth.verify": "Verify & continue",
  "auth.checking": "Checking…",
  "auth.changeNumber": "Change number",
  "auth.codeSentTo": "Code sent to",
  "auth.devCode": "Dev code:",
  "auth.devNote":
    "If SMS keys are not in .env, this build uses Dev OTP (code on screen). With MSG91/Twilio configured, the code is only sent by SMS.",
  "auth.yourName": "Your name",
  "auth.region": "Region / state",
  "auth.language": "Preferred language",
  "auth.categories": "What you weave",
  "auth.categoriesHint": "Select at least one category for your profile.",
  "auth.seedHint":
    "Demo weavers: 9000000001 Meena, 9000000002 Selvi, 9000000003 Kamala. New numbers can Register.",
  "auth.checkingSignIn": "Checking sign-in…",
  "auth.skipToSignIn": "Skip to sign in",
  "home.question": "What should I weave this week?",
  "home.loading": "Loading advice…",
  "home.todaysAdvice": "Today's advice",
  "home.refresh": "Refresh advice",
  "home.demandScore": "Demand score for {category}:",
  "home.hearAgain": "Hear again",
  "home.askByVoice": "Ask by voice",
  "home.listening": "Listening…",
  "home.why": "Why?",
  "home.moneyTitle": "Money coming your way",
  "home.moneySimNote":
    "Prototype / simulated payment snapshot — not real money movement.",
  "home.nextPayment":
    "Next payment is projected around {date}.",
  "home.noPayment": "No projected payment date yet for open orders.",
  "home.advanceHeld":
    "About ₹{amount} advance is held for open orders (simulated escrow pattern).",
  "home.walletQuiet":
    "Your wallet is quiet for now — no advance waiting to clear.",
  "home.demoSimulated": "Demo / Simulated",
  "voice.speaking": "Speaking…",
  "voice.notSupported":
    "Speaking is not supported in this browser. Use Chrome for the demo.",
  "voice.speakFailed": "Could not speak — try Chrome, or tap Hear again.",
  "voice.listeningHint": "Listening… ask what to weave",
  "voice.micUnavailable":
    "Listening needs Chrome (Web Speech). Mic not available here.",
  "voice.didntCatch": "Didn't catch that — tap the mic and try again.",
  "voice.micError": "Mic error — allow microphone access in Chrome.",
  "voice.heard": "Heard: “{transcript}”",
  "voice.speakPage": "Speak page",
  "voice.stop": "Stop",
  "voice.ask": "Voice ask",
  "voice.a11yLabel": "Voice accessibility",
  "voice.navListening":
    "Listening… say plan, orders, home, money, or profile",
  "voice.navMic": "Voice navigate",
  "voice.navLabel": "Voice",
  "voice.navA11yLabel": "App voice assistant",
  "chat.title": "Loom assistant",
  "chat.subtitle":
    "Tap a daily question — answers use your advice, orders, money, and stock.",
  "chat.placeholder": "Ask about today, money, or orders…",
  "chat.send": "Send",
  "chat.summarize": "Summarize everything",
  "chat.thinking": "Thinking…",
  "chat.emptyHint":
    "Tap one of the five questions above, or Summarize everything.",
  "chat.you": "You",
  "chat.assistant": "Assistant",
  "chat.error": "Could not build a summary right now. Try again.",
  "common.loading": "Loading…",
  "common.demoSimulated": "Demo / Simulated",
  "plan.title": "When to start",
  "plan.subtitle":
    "Third tab in the pitch walk — after Orders shows demand, set a ready date and we work the calendar backward for you.",
  "plan.whatWeave": "What will you weave?",
  "plan.whenReady": "When must it be ready?",
  "plan.festivalNote":
    "Sample festival dates for the demo — not a live festival calendar.",
  "plan.ownDate": "Or set your own date",
  "plan.daysHeading": "Days we use to plan",
  "plan.daysWarning":
    "Illustrative starting defaults — your cooperative should correct these. Not verified production-time data.",
  "plan.resetDefaults": "Reset to starting defaults",
  "plan.weavingDays": "Weaving days by item",
  "plan.yarnDays": "Yarn lead time used in plan",
  "plan.qcDays": "Checking & packing (days)",
  "plan.shipDays": "Shipping before ready date (days)",
  "plan.settleDays": "Days after dispatch until money (stub)",
  "timeline.title": "Your dates",
  "timeline.estimatedPlan": "Estimated plan — illustrative durations",
  "timeline.estimatedHint":
    "Worked backward from the ready date using editable day counts (defaults are illustrative, not verified loom times). Change the date or days below and these update.",
  "timeline.buyYarn": "Buy yarn",
  "timeline.buyYarnDetail": "About {days} days before weaving starts",
  "timeline.startWeaving": "Start weaving",
  "timeline.startWeavingDetail":
    "{days} weaving days planned for {category}",
  "timeline.finish": "Finish production",
  "timeline.dispatch": "Dispatch",
  "timeline.dispatchDetail":
    "{days} days for checking and packing before this",
  "timeline.ready": "Ready for the day",
  "timeline.readyDetail": "{days} days shipping before this date",
  "timeline.moneyExpected": "Money expected",
  "timeline.moneyDetail":
    "Dispatch + {days} day(s) — modeled T+1 PA settlement window (simulated). Demo / Simulated",
  "timeline.estimated": "Estimated",
  "timeline.nhdcTitle": "Check if you can get yarn help",
  "timeline.nhdcBody":
    "NHDC's Raw Material Supply Scheme offers a 15% price subsidy on yarn, paid to your linked bank account via Direct Benefit Transfer. Ask your cooperative or check with NHDC whether you are eligible — LoomOS only reminds you; it does not file claims or connect to NHDC.",
  "money.title": "Money coming your way",
  "money.subtitle": "See where each payment is — calm and clear.",
  "money.prototypeLabel": "Prototype / simulated.",
  "money.walletSnapshot": "Wallet snapshot",
  "money.advanceHeld":
    "About ₹{amount} in advance is held for your open orders — modeled on an RBI-authorised payment aggregator's escrow settlement pattern (simulated).",
  "money.noAdvance": "No advance is currently held for open orders.",
  "money.nextProjected":
    "Next money is projected around {date} (modeled T+1 after dispatch).",
  "money.noSettlement":
    "No projected settlement date yet — wait until an order is sent.",
  "money.yourOrders": "Your orders",
  "money.buyerFallback": "Buyer",
  "money.buyerTrust": "Buyer trust: {label} ({score}/100)",
  "money.demoNext": "Demo: next step → {state}",
  "money.question": "Question: {reason} ({status})",
  "money.adminHint": "Team: walk every state on Admin → Payments.",
  "money.loadingError": "Could not load money status",
  "orders.title": "Buyer demand near you",
  "orders.subtitle":
    "Second tab in the pitch walk — open requirements in your region. Same posts buyers publish in the Buyer Portal.",
  "orders.demoNote":
    "Demo Mode — seed requirements may include fictional buyers from Nila Loom Circle. Not live marketplace orders.",
  "orders.empty": "No open buyer needs in {region} right now.",
  "orders.piecesNeeded": "{qty} pieces · needed by {date}",
  "orders.priceRange": "Price range ₹{min}–₹{max}",
  "orders.fromBuyer": "From {name}",
  "orders.buyerLink": "Buyers post these at /buyer.",
  "wallet.title": "Steady income wallet",
  "wallet.subtitle":
    "Rule-based smoothing — not a prediction model. Only Settlement Released amounts count.",
  "wallet.demoNote":
    "Demo / Simulated — Available and Reserve come from Settlement Released events in the fictional Nila Loom Circle seed (not live bank balances).",
  "wallet.available": "Available",
  "wallet.reserve": "Reserve",
  "wallet.floor": "Floor {amount}",
  "wallet.showRule": "Show this rule",
  "wallet.moveToReserve": "Move {amount} to reserve",
  "wallet.drawFromReserve": "Draw {amount} from reserve",
  "wallet.trailingAvg": "Trailing average",
  "wallet.notEnoughHistory":
    "Not enough history yet — settled income in {have} of {need} months. No average is shown until then.",
  "wallet.usualMonth": "Your usual month: {amount}",
  "wallet.howAverage": "How this average is calculated",
  "wallet.thisMonthSettled": "This month settled so far:",
  "wallet.projected": "Projected",
  "wallet.notAvailableYet": "not available yet",
  "wallet.showProjection": "Show projection rule",
  "wallet.reserveRules": "Your reserve rules",
  "wallet.reserveFloor": "Reserve floor (₹)",
  "wallet.savePct": "Save % of surplus when above average",
  "wallet.saveRules": "Save rules",
  "wallet.incomeLog": "Income log (settlements only)",
  "wallet.noSettlements": "No Settlement Released events yet.",
  "wallet.loading": "Loading income wallet…",
  "record.title": "Verified Transaction Record",
  "record.loading": "Loading record…",
  "record.copyLink": "Copy share link",
  "record.copied": "Link copied",
  "record.open": "Open shareable summary",
  "record.print": "Print / save as PDF",
};

const hi: Catalog = {
  ...en,
  "nav.home": "होम",
  "nav.plan": "योजना",
  "nav.money": "पैसे",
  "nav.orders": "ऑर्डर",
  "nav.profile": "प्रोफ़ाइल",
  "topbar.signOut": "साइन आउट",
  "auth.login": "लॉगिन",
  "auth.register": "रजिस्टर",
  "auth.weaverTitle": "बुनकर प्रवेश",
  "auth.loginSubtitle": "अपने पंजीकृत मोबाइल नंबर से साइन इन करें।",
  "auth.registerSubtitle":
    "अपना बुनकर प्रोफ़ाइल बनाएं — सलाह और आवाज़ के लिए।",
  "auth.phone": "मोबाइल नंबर",
  "auth.otp": "6 अंकों का OTP",
  "auth.sendOtp": "OTP भेजें",
  "auth.sending": "भेज रहे हैं…",
  "auth.verify": "पुष्टि करें",
  "auth.checking": "जाँच…",
  "auth.changeNumber": "नंबर बदलें",
  "auth.codeSentTo": "कोड भेजा गया",
  "auth.devCode": "डेव कोड:",
  "auth.yourName": "आपका नाम",
  "auth.region": "राज्य / क्षेत्र",
  "auth.language": "पसंदीदा भाषा",
  "auth.categories": "आप क्या बुनते हैं",
  "auth.categoriesHint": "प्रोफ़ाइल के लिए कम से कम एक श्रेणी चुनें।",
  "auth.checkingSignIn": "साइन-इन जाँच…",
  "auth.skipToSignIn": "साइन इन पर जाएँ",
  "home.question": "इस हफ़्ते क्या बुनूँ?",
  "home.loading": "सलाह लोड हो रही है…",
  "home.todaysAdvice": "आज की सलाह",
  "home.refresh": "सलाह ताज़ा करें",
  "home.demandScore": "{category} के लिए माँग स्कोर:",
  "home.hearAgain": "फिर सुनें",
  "home.askByVoice": "आवाज़ से पूछें",
  "home.listening": "सुन रहे हैं…",
  "home.why": "क्यों?",
  "home.moneyTitle": "आपके रास्ते में पैसे",
  "home.moneySimNote": "प्रोटोटाइप / सिम्युलेटेड भुगतान — असली पैसा नहीं।",
  "home.nextPayment": "अगला भुगतान लगभग {date} के आसपास अनुमानित है।",
  "home.noPayment": "खुले ऑर्डर के लिए अभी कोई भुगतान तिथि नहीं।",
  "home.advanceHeld":
    "खुले ऑर्डर के लिए लगभग ₹{amount} एडवांस होल्ड है (सिम्युलेटेड)।",
  "home.walletQuiet": "वॉलेट शांत है — कोई एडवांस क्लीयर होने को नहीं।",
  "home.demoSimulated": "डेमो / सिम्युलेटेड",
  "voice.speaking": "बोल रहे हैं…",
  "voice.notSupported": "इस ब्राउज़र में आवाज़ उपलब्ध नहीं। Chrome आज़माएँ।",
  "voice.speakFailed": "बोल नहीं सके — Chrome आज़माएँ या फिर सुनें दबाएँ।",
  "voice.listeningHint": "सुन रहे हैं… पूछें क्या बुनना है",
  "voice.micUnavailable": "माइक Chrome में बेहतर काम करता है।",
  "voice.didntCatch": "समझ नहीं आया — माइक दबाकर फिर कोशिश करें।",
  "voice.micError": "माइक त्रुटि — Chrome में अनुमति दें।",
  "voice.heard": "सुना: “{transcript}”",
  "voice.speakPage": "पेज पढ़ें",
  "voice.stop": "रोकें",
  "voice.ask": "आवाज़ से पूछें",
  "voice.a11yLabel": "आवाज़ पहुँच",
  "voice.navListening":
    "सुन रहे हैं… योजना, ऑर्डर, होम, पैसे या प्रोफ़ाइल कहें",
  "voice.navMic": "आवाज़ से नेविगेट",
  "voice.navLabel": "आवाज़",
  "voice.navA11yLabel": "ऐप आवाज़ सहायक",
  "chat.title": "लूम सहायक",
  "chat.subtitle": "सलाह, पैसे और ऑर्डर का सारांश।",
  "chat.placeholder": "आज, पैसे या ऑर्डर के बारे में पूछें…",
  "chat.send": "भेजें",
  "chat.summarize": "सबका सारांश",
  "chat.thinking": "सोच रहे हैं…",
  "chat.emptyHint":
    "“सबका सारांश” दबाएँ या टेक्स्ट/आवाज़ से पूछें।",
  "chat.you": "आप",
  "chat.assistant": "सहायक",
  "chat.error": "सारांश नहीं बन सका। फिर कोशिश करें।",
  "common.loading": "लोड हो रहा है…",
  "common.demoSimulated": "डेमो / सिम्युलेटेड",
  "plan.title": "कब शुरू करें",
  "plan.subtitle":
    "चुनें क्या बुनेंगे और कब तैयार होना चाहिए। हम तिथियाँ पीछे से निकालते हैं।",
  "plan.whatWeave": "आप क्या बुनेंगे?",
  "plan.whenReady": "कब तक तैयार होना चाहिए?",
  "plan.festivalNote":
    "डेमो के लिए नमूना त्योहार तिथियाँ — लाइव कैलेंडर नहीं।",
  "plan.ownDate": "या अपनी तिथि तय करें",
  "plan.daysHeading": "योजना के दिन",
  "plan.daysWarning":
    "उदाहरण डिफ़ॉल्ट — सहकारी इन्हें सही करे। सत्यापित उत्पादन समय नहीं।",
  "plan.resetDefaults": "शुरुआती डिफ़ॉल्ट पर वापस",
  "plan.weavingDays": "वस्तु के अनुसार बुनाई दिन",
  "plan.yarnDays": "योजना में धागा लीड समय",
  "plan.qcDays": "जाँच और पैकिंग (दिन)",
  "plan.shipDays": "तैयार तिथि से पहले शिपिंग (दिन)",
  "plan.settleDays": "भेजने के बाद पैसे तक के दिन (stub)",
  "timeline.title": "आपकी तिथियाँ",
  "timeline.estimatedPlan": "अनुमानित योजना — उदाहरण अवधि",
  "timeline.estimatedHint":
    "तैयार तिथि से पीछे की ओर, संपादन योग्य दिनों से। डिफ़ॉल्ट उदाहरण हैं।",
  "timeline.buyYarn": "धागा खरीदें",
  "timeline.buyYarnDetail": "बुनाई शुरू से लगभग {days} दिन पहले",
  "timeline.startWeaving": "बुनाई शुरू",
  "timeline.startWeavingDetail":
    "{category} के लिए {days} बुनाई दिन की योजना",
  "timeline.finish": "उत्पादन पूरा",
  "timeline.dispatch": "डिस्पैच",
  "timeline.dispatchDetail": "इससे पहले जाँच-पैकिंग के {days} दिन",
  "timeline.ready": "दिन के लिए तैयार",
  "timeline.readyDetail": "इस तिथि से पहले {days} दिन शिपिंग",
  "timeline.moneyExpected": "पैसे की उम्मीद",
  "timeline.moneyDetail":
    "डिस्पैच + {days} दिन — मॉडल T+1 निपटान (सिम्युलेटेड)। डेमो / सिम्युलेटेड",
  "timeline.estimated": "अनुमानित",
  "timeline.nhdcTitle": "धागे की मदद मिल सकती है या नहीं देखें",
  "timeline.nhdcBody":
    "NHDC कच्चे माल योजना में धागे पर 15% सब्सिडी DBT से बैंक में आती है। सहकारी या NHDC से पात्रता पूछें — LoomOS केवल याद दिलाता है, दावा नहीं भरता।",
  "money.title": "आपके रास्ते में पैसे",
  "money.subtitle": "हर भुगतान कहाँ है — शांत और साफ़ देखें।",
  "money.prototypeLabel": "प्रोटोटाइप / सिम्युलेटेड।",
  "money.walletSnapshot": "वॉलेट झलक",
  "money.advanceHeld":
    "खुले ऑर्डर के लिए लगभग ₹{amount} एडवांस होल्ड है — RBI-अधिकृत एस्क्रो पैटर्न (सिम्युलेटेड)।",
  "money.noAdvance": "खुले ऑर्डर पर अभी कोई एडवांस होल्ड नहीं।",
  "money.nextProjected":
    "अगला पैसा लगभग {date} के आसपास अनुमानित है (डिस्पैच के बाद T+1)।",
  "money.noSettlement":
    "अभी कोई निपटान तिथि नहीं — ऑर्डर भेजने तक प्रतीक्षा करें।",
  "money.yourOrders": "आपके ऑर्डर",
  "money.buyerFallback": "खरीदार",
  "money.buyerTrust": "खरीदार भरोसा: {label} ({score}/100)",
  "money.demoNext": "डेमो: अगला चरण → {state}",
  "money.question": "सवाल: {reason} ({status})",
  "money.adminHint": "टीम: Admin → Payments पर हर स्थिति देखें।",
  "money.loadingError": "पैसे की स्थिति लोड नहीं हुई",
  "orders.title": "आपके ऑर्डर",
  "orders.subtitle":
    "आपके पास खरीदार ज़रूरतें — पोर्टल पर पोस्ट। होम की सलाह इन्हीं से बनती है।",
  "orders.demoNote":
    "डेमो मोड — बीज ज़रूरतों में काल्पनिक खरीदार हो सकते हैं। लाइव बाज़ार नहीं।",
  "orders.empty": "अभी {region} में कोई खुली खरीदार ज़रूरत नहीं।",
  "orders.piecesNeeded": "{qty} पीस · {date} तक चाहिए",
  "orders.priceRange": "मूल्य सीमा ₹{min}–₹{max}",
  "orders.fromBuyer": "{name} से",
  "orders.buyerLink": "खरीदार इन्हें /buyer पर पोस्ट करते हैं।",
  "wallet.title": "स्थिर आय वॉलेट",
  "wallet.subtitle":
    "नियम-आधारित समतलन — भविष्यवाणी मॉडल नहीं। केवल Settlement Released गिना जाता है।",
  "wallet.demoNote":
    "डेमो / सिम्युलेटेड — Available और Reserve निपटान घटनाओं से (लाइव बैंक नहीं)।",
  "wallet.available": "उपलब्ध",
  "wallet.reserve": "रिज़र्व",
  "wallet.floor": "फ़्लोर {amount}",
  "wallet.showRule": "यह नियम दिखाएँ",
  "wallet.moveToReserve": "{amount} रिज़र्व में डालें",
  "wallet.drawFromReserve": "रिज़र्व से {amount} निकालें",
  "wallet.trailingAvg": "पिछला औसत",
  "wallet.notEnoughHistory":
    "अभी इतिहास कम है — {need} में से {have} महीनों में आय। तब तक औसत नहीं।",
  "wallet.usualMonth": "आपका सामान्य महीना: {amount}",
  "wallet.howAverage": "यह औसत कैसे निकाला जाता है",
  "wallet.thisMonthSettled": "इस महीने अभी तक निपटान:",
  "wallet.projected": "अनुमानित",
  "wallet.notAvailableYet": "अभी उपलब्ध नहीं",
  "wallet.showProjection": "अनुमान नियम दिखाएँ",
  "wallet.reserveRules": "आपके रिज़र्व नियम",
  "wallet.reserveFloor": "रिज़र्व फ़्लोर (₹)",
  "wallet.savePct": "औसत से ऊपर अधिशेष का बचत %",
  "wallet.saveRules": "नियम सहेजें",
  "wallet.incomeLog": "आय लॉग (केवल निपटान)",
  "wallet.noSettlements": "अभी कोई Settlement Released नहीं।",
  "wallet.loading": "आय वॉलेट लोड हो रहा है…",
  "record.title": "सत्यापित लेनदेन रिकॉर्ड",
  "record.loading": "रिकॉर्ड लोड हो रहा है…",
  "record.copyLink": "शेयर लिंक कॉपी करें",
  "record.copied": "लिंक कॉपी हुआ",
  "record.open": "शेयर सारांश खोलें",
  "record.print": "प्रिंट / PDF सहेजें",
};

const ta: Catalog = {
  ...en,
  "nav.home": "முகப்பு",
  "nav.plan": "திட்டம்",
  "nav.money": "பணம்",
  "nav.orders": "ஆர்டர்கள்",
  "nav.profile": "சுயவிவரம்",
  "topbar.signOut": "வெளியேறு",
  "auth.login": "உள்நுழை",
  "auth.register": "பதிவு",
  "auth.weaverTitle": "நெசவாளர் நுழைவு",
  "auth.loginSubtitle": "பதிவு செய்த மொபைல் எண்ணால் உள்நுழையுங்கள்.",
  "auth.registerSubtitle":
    "நெசவாளர் சுயவிவரம் உருவாக்குங்கள் — ஆலோசனைக்கும் குரலுக்கும்.",
  "auth.phone": "மொபைல் எண்",
  "auth.otp": "6 இலக்க OTP",
  "auth.sendOtp": "OTP அனுப்பு",
  "auth.sending": "அனுப்புகிறது…",
  "auth.verify": "சரிபார்த்து தொடரவும்",
  "auth.checking": "சரிபார்க்கிறது…",
  "auth.changeNumber": "எண் மாற்று",
  "auth.codeSentTo": "குறியீடு அனுப்பப்பட்டது",
  "auth.devCode": "டெவ் குறியீடு:",
  "auth.yourName": "உங்கள் பெயர்",
  "auth.region": "மாநிலம் / பகுதி",
  "auth.language": "விருப்ப மொழி",
  "auth.categories": "நீங்கள் நெசவு செய்வது",
  "auth.categoriesHint": "குறைந்தது ஒரு வகையைத் தேர்ந்தெடுக்கவும்.",
  "auth.checkingSignIn": "உள்நுழைவு சரிபார்ப்பு…",
  "auth.skipToSignIn": "உள்நுழைவுக்குச் செல்",
  "home.question": "இந்த வாரம் என்ன நெசவு செய்ய வேண்டும்?",
  "home.loading": "ஆலோசனை ஏற்றுகிறது…",
  "home.todaysAdvice": "இன்றைய ஆலோசனை",
  "home.refresh": "புதுப்பி",
  "home.demandScore": "{category} கேள்வி மதிப்பெண்:",
  "home.hearAgain": "மீண்டும் கேள்",
  "home.askByVoice": "குரலால் கேள்",
  "home.listening": "கேட்கிறது…",
  "home.why": "ஏன்?",
  "home.moneyTitle": "உங்களுக்கு வரும் பணம்",
  "home.moneySimNote": "முன்மாதிரி / போலி கட்டணம் — உண்மையான பணம் அல்ல.",
  "home.nextPayment": "அடுத்த கட்டணம் சுமார் {date} அன்று எதிர்பார்க்கப்படுகிறது.",
  "home.noPayment": "திறந்த ஆர்டர்களுக்கு இன்னும் கட்டண தேதி இல்லை.",
  "home.advanceHeld":
    "திறந்த ஆர்டர்களுக்கு சுமார் ₹{amount} முன்பணம் பிடிக்கப்பட்டுள்ளது.",
  "home.walletQuiet": "வாலட் அமைதியாக உள்ளது — முன்பணம் இல்லை.",
  "home.demoSimulated": "டெமோ / போலி",
  "voice.speaking": "பேசுகிறது…",
  "voice.notSupported": "இந்த உலாவியில் பேச்சு இல்லை. Chrome பயன்படுத்துங்கள்.",
  "voice.speakFailed": "பேச முடியவில்லை — Chrome முயற்சிக்கவும்.",
  "voice.listeningHint": "கேட்கிறது… என்ன நெசவு என்று கேளுங்கள்",
  "voice.micUnavailable": "மைக் Chrome-இல் சிறப்பாக வேலை செய்யும்.",
  "voice.didntCatch": "புரியவில்லை — மீண்டும் முயற்சிக்கவும்.",
  "voice.micError": "மைக் பிழை — Chrome-இல் அனுமதி அளிக்கவும்.",
  "voice.heard": "கேட்டது: “{transcript}”",
  "voice.speakPage": "பக்கத்தைப் படி",
  "voice.stop": "நிறுத்து",
  "voice.ask": "குரல் கேள்வி",
  "voice.a11yLabel": "குரல் அணுகல்",
  "voice.navListening":
    "கேட்கிறது… திட்டம், ஆர்டர், முகப்பு, பணம் அல்லது சுயவிவரம் சொல்லுங்கள்",
  "voice.navMic": "குரல் வழிசெலுத்தல்",
  "voice.navLabel": "குரல்",
  "voice.navA11yLabel": "பயன்பாட்டு குரல் உதவியாளர்",
  "chat.title": "லூம் உதவியாளர்",
  "chat.subtitle": "ஆலோசனை, பணம், ஆர்டர் சுருக்கம்.",
  "chat.placeholder": "இன்று, பணம் அல்லது ஆர்டர் பற்றி கேளுங்கள்…",
  "chat.send": "அனுப்பு",
  "chat.summarize": "அனைத்தையும் சுருக்கு",
  "chat.thinking": "யோசிக்கிறது…",
  "chat.emptyHint":
    "“அனைத்தையும் சுருக்கு” அழுத்தவும் அல்லது உரை/குரலால் கேளுங்கள்.",
  "chat.you": "நீங்கள்",
  "chat.assistant": "உதவியாளர்",
  "chat.error": "சுருக்கம் தயாரிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  "common.loading": "ஏற்றுகிறது…",
  "common.demoSimulated": "டெமோ / போலி",
  "plan.title": "எப்போது தொடங்குவது",
  "plan.subtitle":
    "என்ன நெசவு செய்வீர்கள், எப்போது தயாராக வேண்டும் என்பதைத் தேர்வு செய்யுங்கள். நாங்கள் தேதிகளைப் பின்னோக்கிக் கணக்கிடுவோம்.",
  "plan.whatWeave": "நீங்கள் என்ன நெசவு செய்வீர்கள்?",
  "plan.whenReady": "எப்போது தயாராக வேண்டும்?",
  "plan.festivalNote":
    "டெமோவுக்கான மாதிரி விழா தேதிகள் — நேரடி நாட்காட்டி அல்ல.",
  "plan.ownDate": "அல்லது உங்கள் சொந்த தேதியை அமைக்கவும்",
  "plan.daysHeading": "திட்டத்திற்குப் பயன்படுத்தும் நாட்கள்",
  "plan.daysWarning":
    "விளக்க இயல்புநிலைகள் — கூட்டுறவு இவற்றைத் திருத்த வேண்டும். சரிபார்க்கப்பட்ட உற்பத்தி நேரம் அல்ல.",
  "plan.resetDefaults": "தொடக்க இயல்புநிலைக்கு மீட்டமை",
  "plan.weavingDays": "பொருள் வாரியாக நெசவு நாட்கள்",
  "plan.yarnDays": "திட்டத்தில் நூல் முன்னணி நேரம்",
  "plan.qcDays": "சரிபார்ப்பு & பொதி (நாட்கள்)",
  "plan.shipDays": "தயாரான தேதிக்கு முன் அனுப்புதல் (நாட்கள்)",
  "plan.settleDays": "அனுப்பிய பின் பணம் வரும் நாட்கள் (stub)",
  "timeline.title": "உங்கள் தேதிகள்",
  "timeline.estimatedPlan": "மதிப்பீட்டுத் திட்டம் — விளக்க காலங்கள்",
  "timeline.estimatedHint":
    "தயாரான தேதியிலிருந்து பின்னோக்கி, திருத்தக்கூடிய நாள் எண்ணிக்கையால். இயல்புநிலைகள் விளக்கமானவை.",
  "timeline.buyYarn": "நூல் வாங்கவும்",
  "timeline.buyYarnDetail": "நெசவு தொடங்கும் முன் சுமார் {days} நாட்கள்",
  "timeline.startWeaving": "நெசவு தொடக்கம்",
  "timeline.startWeavingDetail":
    "{category}க்கு {days} நெசவு நாட்கள் திட்டமிடப்பட்டுள்ளன",
  "timeline.finish": "உற்பத்தி முடிவு",
  "timeline.dispatch": "அனுப்புதல்",
  "timeline.dispatchDetail":
    "இதற்கு முன் சரிபார்ப்பு மற்றும் பொதிக்கு {days} நாட்கள்",
  "timeline.ready": "அந்நாளுக்குத் தயார்",
  "timeline.readyDetail": "இந்தத் தேதிக்கு முன் {days} நாள் அனுப்புதல்",
  "timeline.moneyExpected": "பணம் எதிர்பார்ப்பு",
  "timeline.moneyDetail":
    "அனுப்புதல் + {days} நாள்(கள்) — மாதிரி T+1 தீர்வு (போலி). டெமோ / போலி",
  "timeline.estimated": "மதிப்பீடு",
  "timeline.nhdcTitle": "நூல் உதவி கிடைக்குமா எனப் பாருங்கள்",
  "timeline.nhdcBody":
    "NHDC மூலப்பொருள் திட்டம் நூலுக்கு 15% மானியம் DBT மூலம் வழங்குகிறது. கூட்டுறவு அல்லது NHDC-இடம் தகுதி கேளுங்கள் — LoomOS நினைவூட்டுகிறது மட்டும்; விண்ணப்பம் செய்யாது.",
  "money.title": "உங்களுக்கு வரும் பணம்",
  "money.subtitle": "ஒவ்வொரு கட்டணமும் எங்கே — அமைதியாகத் தெளிவாக.",
  "money.prototypeLabel": "முன்மாதிரி / போலி.",
  "money.walletSnapshot": "வாலட் சுருக்கம்",
  "money.advanceHeld":
    "திறந்த ஆர்டர்களுக்கு சுமார் ₹{amount} முன்பணம் பிடிக்கப்பட்டுள்ளது — RBI அங்கீகரித்த எஸ்க்ரோ முறை (போலி).",
  "money.noAdvance": "திறந்த ஆர்டர்களுக்கு இப்போது முன்பணம் இல்லை.",
  "money.nextProjected":
    "அடுத்த பணம் சுமார் {date} அன்று எதிர்பார்க்கப்படுகிறது (அனுப்பிய பின் T+1).",
  "money.noSettlement":
    "இன்னும் தீர்வு தேதி இல்லை — ஆர்டர் அனுப்பும் வரை காத்திருங்கள்.",
  "money.yourOrders": "உங்கள் ஆர்டர்கள்",
  "money.buyerFallback": "வாங்குபவர்",
  "money.buyerTrust": "வாங்குபவர் நம்பிக்கை: {label} ({score}/100)",
  "money.demoNext": "டெமோ: அடுத்த படி → {state}",
  "money.question": "கேள்வி: {reason} ({status})",
  "money.adminHint": "குழு: Admin → Payments-இல் ஒவ்வொரு நிலையும் பாருங்கள்.",
  "money.loadingError": "பண நிலையை ஏற்ற முடியவில்லை",
  "orders.title": "உங்கள் ஆர்டர்கள்",
  "orders.subtitle":
    "உங்களுக்கு அருகில் வாங்குபவர் தேவைகள் — போர்ட்டலில் பதிவு. முகப்பு ஆலோசனையும் இவற்றிலிருந்து.",
  "orders.demoNote":
    "டெமோ முறை — விதைத் தேவைகளில் கற்பனை வாங்குபவர்கள் இருக்கலாம். நேரடி சந்தை அல்ல.",
  "orders.empty": "இப்போது {region}-இல் திறந்த வாங்குபவர் தேவை இல்லை.",
  "orders.piecesNeeded": "{qty} துண்டுகள் · {date}க்குள் தேவை",
  "orders.priceRange": "விலை வரம்பு ₹{min}–₹{max}",
  "orders.fromBuyer": "{name} இடமிருந்து",
  "orders.buyerLink": "வாங்குபவர்கள் இவற்றை /buyer-இல் பதிவிடுகின்றனர்.",
  "wallet.title": "நிலையான வருமான வாலட்",
  "wallet.subtitle":
    "விதி அடிப்படையிலான சமன்படுத்தல் — முன்னறிவிப்பு மாதிரி அல்ல. Settlement Released மட்டும்.",
  "wallet.demoNote":
    "டெமோ / போலி — Available மற்றும் Reserve தீர்வு நிகழ்வுகளிலிருந்து (நேரடி வங்கி அல்ல).",
  "wallet.available": "கிடைக்கும்",
  "wallet.reserve": "ரிசர்வ்",
  "wallet.floor": "தளம் {amount}",
  "wallet.showRule": "இந்த விதியைக் காட்டு",
  "wallet.moveToReserve": "{amount}-ஐ ரிசர்வுக்கு நகர்த்து",
  "wallet.drawFromReserve": "ரிசர்விலிருந்து {amount} எடு",
  "wallet.trailingAvg": "பின்தங்கிய சராசரி",
  "wallet.notEnoughHistory":
    "வரலாறு போதாது — {need}-இல் {have} மாதங்களில் வருமானம். அதுவரை சராசரி இல்லை.",
  "wallet.usualMonth": "உங்கள் வழக்கமான மாதம்: {amount}",
  "wallet.howAverage": "இந்த சராசரி எப்படி கணக்கிடப்படுகிறது",
  "wallet.thisMonthSettled": "இம்மாதம் இதுவரை தீர்வு:",
  "wallet.projected": "மதிப்பீடு",
  "wallet.notAvailableYet": "இன்னும் கிடைக்கவில்லை",
  "wallet.showProjection": "மதிப்பீட்டு விதியைக் காட்டு",
  "wallet.reserveRules": "உங்கள் ரிசர்வ் விதிகள்",
  "wallet.reserveFloor": "ரிசர்வ் தளம் (₹)",
  "wallet.savePct": "சராசரிக்கு மேல் உபரியின் சேமிப்பு %",
  "wallet.saveRules": "விதிகளைச் சேமி",
  "wallet.incomeLog": "வருமான பதிவு (தீர்வு மட்டும்)",
  "wallet.noSettlements": "இன்னும் Settlement Released இல்லை.",
  "wallet.loading": "வருமான வாலட் ஏற்றுகிறது…",
  "record.title": "சரிபார்க்கப்பட்ட பரிவர்த்தனை பதிவு",
  "record.loading": "பதிவு ஏற்றுகிறது…",
  "record.copyLink": "பகிர்வு இணைப்பை நகலெடு",
  "record.copied": "இணைப்பு நகலெடுக்கப்பட்டது",
  "record.open": "பகிரக்கூடிய சுருக்கத்தைத் திற",
  "record.print": "அச்சிடு / PDF சேமி",
};

const te: Catalog = {
  ...en,
  "nav.home": "హోమ్",
  "nav.plan": "ప్లాన్",
  "nav.money": "డబ్బు",
  "nav.orders": "ఆర్డర్లు",
  "nav.profile": "ప్రొఫైల్",
  "topbar.signOut": "సైన్ అవుట్",
  "auth.login": "లాగిన్",
  "auth.register": "రిజిస్టర్",
  "auth.weaverTitle": "నేత కార్మికుల ప్రవేశం",
  "auth.loginSubtitle": "మీ నమోదైన మొబైల్ నంబర్‌తో సైన్ ఇన్ చేయండి.",
  "auth.registerSubtitle":
    "మీ నేత ప్రొఫైల్ సృష్టించండి — సలహా మరియు వాయిస్ కోసం.",
  "auth.phone": "మొబైల్ నంబర్",
  "auth.otp": "6 అంకెల OTP",
  "auth.sendOtp": "OTP పంపు",
  "auth.sending": "పంపుతోంది…",
  "auth.verify": "ధృవీకరించి కొనసాగండి",
  "auth.checking": "తనిఖీ…",
  "auth.changeNumber": "నంబర్ మార్చు",
  "auth.codeSentTo": "కోడ్ పంపబడింది",
  "auth.devCode": "డెవ్ కోడ్:",
  "auth.yourName": "మీ పేరు",
  "auth.region": "రాష్ట్రం / ప్రాంతం",
  "auth.language": "ఇష్టమైన భాష",
  "auth.categories": "మీరు నేసేది",
  "auth.categoriesHint": "కనీసం ఒక వర్గం ఎంచుకోండి.",
  "auth.checkingSignIn": "సైన్-ఇన్ తనిఖీ…",
  "auth.skipToSignIn": "సైన్ ఇన్‌కు వెళ్లు",
  "home.question": "ఈ వారం ఏమి నేయాలి?",
  "home.loading": "సలహా లోడ్ అవుతోంది…",
  "home.todaysAdvice": "నేటి సలహా",
  "home.refresh": "రిఫ్రెష్",
  "home.demandScore": "{category} డిమాండ్ స్కోర్:",
  "home.hearAgain": "మళ్లీ వినండి",
  "home.askByVoice": "వాయిస్‌తో అడగండి",
  "home.listening": "వింటోంది…",
  "home.why": "ఎందుకు?",
  "home.moneyTitle": "మీ వైపు వస్తున్న డబ్బు",
  "home.moneySimNote": "ప్రోటోటైప్ / సిమ్యులేటెడ్ చెల్లింపు — నిజమైన డబ్బు కాదు.",
  "home.nextPayment": "తదుపరి చెల్లింపు సుమారు {date} నాటికి అంచనా.",
  "home.noPayment": "ఓపెన్ ఆర్డర్లకు ఇంకా చెల్లింపు తేదీ లేదు.",
  "home.advanceHeld":
    "ఓపెన్ ఆర్డర్లకు సుమారు ₹{amount} అడ్వాన్స్ హోల్డ్‌లో ఉంది.",
  "home.walletQuiet": "వాలెట్ నిశ్శబ్దంగా ఉంది — అడ్వాన్స్ లేదు.",
  "home.demoSimulated": "డెమో / సిమ్యులేటెడ్",
  "voice.speaking": "మాట్లాడుతోంది…",
  "voice.notSupported": "ఈ బ్రౌజర్‌లో స్పీచ్ లేదు. Chrome ఉపయోగించండి.",
  "voice.speakFailed": "మాట్లాడలేకపోయాం — Chrome ప్రయత్నించండి.",
  "voice.listeningHint": "వింటోంది… ఏమి నేయాలో అడగండి",
  "voice.micUnavailable": "మైక్ Chromeలో బాగా పని చేస్తుంది.",
  "voice.didntCatch": "అర్థం కాలేదు — మళ్లీ ప్రయత్నించండి.",
  "voice.micError": "మైక్ లోపం — Chromeలో అనుమతి ఇవ్వండి.",
  "voice.heard": "విన్నది: “{transcript}”",
  "voice.speakPage": "పేజీ చదువు",
  "voice.stop": "ఆపు",
  "voice.ask": "వాయిస్ అడుగు",
  "voice.a11yLabel": "వాయిస్ యాక్సెస్",
  "voice.navListening":
    "వింటోంది… ప్లాన్, ఆర్డర్లు, హోమ్, డబ్బు లేదా ప్రొఫైల్ చెప్పండి",
  "voice.navMic": "వాయిస్ నావిగేట్",
  "voice.navLabel": "వాయిస్",
  "voice.navA11yLabel": "యాప్ వాయిస్ సహాయకుడు",
  "chat.title": "లూమ్ సహాయకుడు",
  "chat.subtitle": "సలహా, డబ్బు, ఆర్డర్ల సారాంశం.",
  "chat.placeholder": "నేడు, డబ్బు లేదా ఆర్డర్ల గురించి అడగండి…",
  "chat.send": "పంపు",
  "chat.summarize": "అన్నీ సారాంశం",
  "chat.thinking": "ఆలోచిస్తోంది…",
  "chat.emptyHint":
    "“అన్నీ సారాంశం” నొక్కండి లేదా టెక్స్ట్/వాయిస్‌తో అడగండి.",
  "chat.you": "మీరు",
  "chat.assistant": "సహాయకుడు",
  "chat.error": "సారాంశం తయారు కాలేదు. మళ్లీ ప్రయత్నించండి.",
  "common.loading": "లోడ్ అవుతోంది…",
  "common.demoSimulated": "డెమో / సిమ్యులేటెడ్",
  "plan.title": "ఎప్పుడు ప్రారంభించాలి",
  "plan.subtitle":
    "మీరు ఏమి నేస్తారో, ఎప్పటికి సిద్ధం కావాలో ఎంచుకోండి. మేము తేదీలను వెనక్కి లెక్కిస్తాం.",
  "plan.whatWeave": "మీరు ఏమి నేస్తారు?",
  "plan.whenReady": "ఎప్పటికి సిద్ధం కావాలి?",
  "plan.festivalNote":
    "డెమో కోసం నమూనా పండుగ తేదీలు — లైవ్ క్యాలెండర్ కాదు.",
  "plan.ownDate": "లేదా మీ స్వంత తేదీ సెట్ చేయండి",
  "plan.daysHeading": "ప్లాన్‌కు ఉపయోగించే రోజులు",
  "plan.daysWarning":
    "ఉదాహరణ డిఫాల్ట్‌లు — సహకారం వీటిని సరిదిద్దాలి. ధృవీకరించిన ఉత్పత్తి సమయం కాదు.",
  "plan.resetDefaults": "ప్రారంభ డిఫాల్ట్‌లకు రీసెట్",
  "plan.weavingDays": "వస్తువు వారీగా నేత రోజులు",
  "plan.yarnDays": "ప్లాన్‌లో నూలు లీడ్ సమయం",
  "plan.qcDays": "తనిఖీ & ప్యాకింగ్ (రోజులు)",
  "plan.shipDays": "సిద్ధ తేదీకి ముందు షిప్పింగ్ (రోజులు)",
  "plan.settleDays": "డిస్పాచ్ తర్వాత డబ్బు వచ్చే రోజులు (stub)",
  "timeline.title": "మీ తేదీలు",
  "timeline.estimatedPlan": "అంచనా ప్లాన్ — ఉదాహరణ వ్యవధులు",
  "timeline.estimatedHint":
    "సిద్ధ తేదీ నుండి వెనక్కి, సవరించగల రోజులతో. డిఫాల్ట్‌లు ఉదాహరణ మాత్రమే.",
  "timeline.buyYarn": "నూలు కొనండి",
  "timeline.buyYarnDetail": "నేత ప్రారంభానికి సుమారు {days} రోజుల ముందు",
  "timeline.startWeaving": "నేత ప్రారంభం",
  "timeline.startWeavingDetail":
    "{category} కోసం {days} నేత రోజులు ప్లాన్ చేయబడ్డాయి",
  "timeline.finish": "ఉత్పత్తి పూర్తి",
  "timeline.dispatch": "డిస్పాచ్",
  "timeline.dispatchDetail": "దీనికి ముందు తనిఖీ-ప్యాకింగ్‌కు {days} రోజులు",
  "timeline.ready": "ఆ రోజుకు సిద్ధం",
  "timeline.readyDetail": "ఈ తేదీకి ముందు {days} రోజుల షిప్పింగ్",
  "timeline.moneyExpected": "డబ్బు అంచనా",
  "timeline.moneyDetail":
    "డిస్పాచ్ + {days} రోజు(లు) — మోడల్ T+1 సెటిల్‌మెంట్ (సిమ్యులేటెడ్). డెమో / సిమ్యులేటెడ్",
  "timeline.estimated": "అంచనా",
  "timeline.nhdcTitle": "నూలు సహాయం పొందవచ్చో చూడండి",
  "timeline.nhdcBody":
    "NHDC ముడి పదార్థ పథకం నూలుపై 15% సబ్సిడీ DBT ద్వారా ఇస్తుంది. సహకారం లేదా NHDC వద్ద అర్హత అడగండి — LoomOS గుర్తు మాత్రమే; దావా వేయదు.",
  "money.title": "మీ వైపు వస్తున్న డబ్బు",
  "money.subtitle": "ప్రతి చెల్లింపు ఎక్కడ ఉందో — ప్రశాంతంగా, స్పష్టంగా.",
  "money.prototypeLabel": "ప్రోటోటైప్ / సిమ్యులేటెడ్.",
  "money.walletSnapshot": "వాలెట్ స్నాప్‌షాట్",
  "money.advanceHeld":
    "ఓపెన్ ఆర్డర్లకు సుమారు ₹{amount} అడ్వాన్స్ హోల్డ్‌లో ఉంది — RBI అధీకృత ఎస్క్రో నమూనా (సిమ్యులేటెడ్).",
  "money.noAdvance": "ఓపెన్ ఆర్డర్లకు ప్రస్తుతం అడ్వాన్స్ లేదు.",
  "money.nextProjected":
    "తదుపరి డబ్బు సుమారు {date} నాటికి అంచనా (డిస్పాచ్ తర్వాత T+1).",
  "money.noSettlement":
    "ఇంకా సెటిల్‌మెంట్ తేదీ లేదు — ఆర్డర్ పంపే వరకు వేచి ఉండండి.",
  "money.yourOrders": "మీ ఆర్డర్లు",
  "money.buyerFallback": "కొనుగోలుదారు",
  "money.buyerTrust": "కొనుగోలుదారు నమ్మకం: {label} ({score}/100)",
  "money.demoNext": "డెమో: తదుపరి దశ → {state}",
  "money.question": "ప్రశ్న: {reason} ({status})",
  "money.adminHint": "టీమ్: Admin → Paymentsలో ప్రతి స్థితిని చూడండి.",
  "money.loadingError": "డబ్బు స్థితి లోడ్ కాలేదు",
  "orders.title": "మీ ఆర్డర్లు",
  "orders.subtitle":
    "మీ దగ్గర కొనుగోలుదారు అవసరాలు — పోర్టల్‌లో పోస్ట్. హోమ్ సలహా కూడా వీటి నుండి.",
  "orders.demoNote":
    "డెమో మోడ్ — సీడ్ అవసరాల్లో కల్పిత కొనుగోలుదారులు ఉండవచ్చు. లైవ్ మార్కెట్ కాదు.",
  "orders.empty": "ఇప్పుడు {region}లో ఓపెన్ కొనుగోలుదారు అవసరం లేదు.",
  "orders.piecesNeeded": "{qty} ముక్కలు · {date} నాటికి కావాలి",
  "orders.priceRange": "ధర పరిధి ₹{min}–₹{max}",
  "orders.fromBuyer": "{name} నుండి",
  "orders.buyerLink": "కొనుగోలుదారులు వీటిని /buyerలో పోస్ట్ చేస్తారు.",
  "wallet.title": "స్థిర ఆదాయ వాలెట్",
  "wallet.subtitle":
    "నియమ ఆధారిత సమతుల్యత — అంచనా మోడల్ కాదు. Settlement Released మాత్రమే.",
  "wallet.demoNote":
    "డెమో / సిమ్యులేటెడ్ — Available మరియు Reserve సెటిల్‌మెంట్ ఈవెంట్‌ల నుండి (లైవ్ బ్యాంక్ కాదు).",
  "wallet.available": "అందుబాటులో",
  "wallet.reserve": "రిజర్వ్",
  "wallet.floor": "ఫ్లోర్ {amount}",
  "wallet.showRule": "ఈ నియమం చూపించు",
  "wallet.moveToReserve": "{amount}ను రిజర్వ్‌కు తరలించు",
  "wallet.drawFromReserve": "రిజర్వ్ నుండి {amount} తీసుకో",
  "wallet.trailingAvg": "ట్రైలింగ్ సగటు",
  "wallet.notEnoughHistory":
    "చరిత్ర సరిపోదు — {need}లో {have} నెలల్లో ఆదాయం. అప్పటి వరకు సగటు లేదు.",
  "wallet.usualMonth": "మీ సాధారణ నెల: {amount}",
  "wallet.howAverage": "ఈ సగటు ఎలా లెక్కించబడుతుంది",
  "wallet.thisMonthSettled": "ఈ నెల ఇప్పటి వరకు సెటిల్:",
  "wallet.projected": "అంచనా",
  "wallet.notAvailableYet": "ఇంకా అందుబాటులో లేదు",
  "wallet.showProjection": "అంచనా నియమం చూపించు",
  "wallet.reserveRules": "మీ రిజర్వ్ నియమాలు",
  "wallet.reserveFloor": "రిజర్వ్ ఫ్లోర్ (₹)",
  "wallet.savePct": "సగటు పైన మిగులు పొదుపు %",
  "wallet.saveRules": "నియమాలు సేవ్ చేయి",
  "wallet.incomeLog": "ఆదాయ లాగ్ (సెటిల్‌మెంట్ మాత్రమే)",
  "wallet.noSettlements": "ఇంకా Settlement Released లేదు.",
  "wallet.loading": "ఆదాయ వాలెట్ లోడ్ అవుతోంది…",
  "record.title": "ధృవీకరించిన లావాదేవీ రికార్డు",
  "record.loading": "రికార్డు లోడ్ అవుతోంది…",
  "record.copyLink": "షేర్ లింక్ కాపీ చేయి",
  "record.copied": "లింక్ కాపీ అయింది",
  "record.open": "షేర్ సారాంశం తెరువు",
  "record.print": "ప్రింట్ / PDF సేవ్",
};

const kn: Catalog = {
  ...en,
  "nav.home": "ಮುಖಪುಟ",
  "nav.plan": "ಯೋಜನೆ",
  "nav.money": "ಹಣ",
  "nav.orders": "ಆರ್ಡರ್‌ಗಳು",
  "nav.profile": "ಪ್ರೊಫೈಲ್",
  "topbar.signOut": "ಸೈನ್ ಔಟ್",
  "auth.login": "ಲಾಗಿನ್",
  "auth.register": "ನೋಂದಣಿ",
  "auth.weaverTitle": "ನೇಕಾರರ ಪ್ರವೇಶ",
  "auth.loginSubtitle": "ನಿಮ್ಮ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯಿಂದ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
  "auth.registerSubtitle":
    "ನಿಮ್ಮ ನೇಕಾರರ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ — ಸಲಹೆ ಮತ್ತು ಧ್ವನಿಗಾಗಿ.",
  "auth.phone": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
  "auth.otp": "6 ಅಂಕಿಯ OTP",
  "auth.sendOtp": "OTP ಕಳುಹಿಸಿ",
  "auth.sending": "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…",
  "auth.verify": "ಪರಿಶೀಲಿಸಿ ಮುಂದುವರಿಸಿ",
  "auth.checking": "ಪರಿಶೀಲನೆ…",
  "auth.changeNumber": "ಸಂಖ್ಯೆ ಬದಲಾಯಿಸಿ",
  "auth.codeSentTo": "ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ",
  "auth.devCode": "ಡೆವ್ ಕೋಡ್:",
  "auth.yourName": "ನಿಮ್ಮ ಹೆಸರು",
  "auth.region": "ರಾಜ್ಯ / ಪ್ರದೇಶ",
  "auth.language": "ಆದ್ಯತೆಯ ಭಾಷೆ",
  "auth.categories": "ನೀವು ನೇಯುವುದು",
  "auth.categoriesHint": "ಕನಿಷ್ಠ ಒಂದು ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
  "auth.checkingSignIn": "ಸೈನ್-ಇನ್ ಪರಿಶೀಲನೆ…",
  "auth.skipToSignIn": "ಸೈನ್ ಇನ್‌ಗೆ ಹೋಗಿ",
  "home.question": "ಈ ವಾರ ಏನು ನೇಯಬೇಕು?",
  "home.loading": "ಸಲಹೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
  "home.todaysAdvice": "ಇಂದಿನ ಸಲಹೆ",
  "home.refresh": "ರಿಫ್ರೆಶ್",
  "home.demandScore": "{category} ಬೇಡಿಕೆ ಸ್ಕೋರ್:",
  "home.hearAgain": "ಮತ್ತೆ ಕೇಳಿ",
  "home.askByVoice": "ಧ್ವನಿಯಿಂದ ಕೇಳಿ",
  "home.listening": "ಕೇಳುತ್ತಿದೆ…",
  "home.why": "ಯಾಕೆ?",
  "home.moneyTitle": "ನಿಮ್ಮ ಕಡೆಗೆ ಬರುವ ಹಣ",
  "home.moneySimNote": "ಪ್ರೊಟೊಟೈಪ್ / ಸಿಮ್ಯುಲೇಟೆಡ್ ಪಾವತಿ — ನಿಜವಾದ ಹಣವಲ್ಲ.",
  "home.nextPayment": "ಮುಂದಿನ ಪಾವತಿ ಸುಮಾರು {date} ರಂದು ನಿರೀಕ್ಷೆ.",
  "home.noPayment": "ತೆರೆದ ಆರ್ಡರ್‌ಗಳಿಗೆ ಇನ್ನೂ ಪಾವತಿ ದಿನಾಂಕವಿಲ್ಲ.",
  "home.advanceHeld":
    "ತೆರೆದ ಆರ್ಡರ್‌ಗಳಿಗೆ ಸುಮಾರು ₹{amount} ಅಡ್ವಾನ್ಸ್ ಹೋಲ್ಡ್‌ನಲ್ಲಿದೆ.",
  "home.walletQuiet": "ವಾಲೆಟ್ ನಿಶ್ಶಬ್ದ — ಅಡ್ವಾನ್ಸ್ ಇಲ್ಲ.",
  "home.demoSimulated": "ಡೆಮೊ / ಸಿಮ್ಯುಲೇಟೆಡ್",
  "voice.speaking": "ಮಾತನಾಡುತ್ತಿದೆ…",
  "voice.notSupported": "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತು ಇಲ್ಲ. Chrome ಬಳಸಿ.",
  "voice.speakFailed": "ಮಾತನಾಡಲಾಗಲಿಲ್ಲ — Chrome ಪ್ರಯತ್ನಿಸಿ.",
  "voice.listeningHint": "ಕೇಳುತ್ತಿದೆ… ಏನು ನೇಯಬೇಕೆಂದು ಕೇಳಿ",
  "voice.micUnavailable": "ಮೈಕ್ Chromeನಲ್ಲಿ ಉತ್ತಮವಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ.",
  "voice.didntCatch": "ಅರ್ಥವಾಗಲಿಲ್ಲ — ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  "voice.micError": "ಮೈಕ್ ದೋಷ — Chromeನಲ್ಲಿ ಅನುಮತಿ ನೀಡಿ.",
  "voice.heard": "ಕೇಳಿದ್ದು: “{transcript}”",
  "voice.speakPage": "ಪುಟ ಓದು",
  "voice.stop": "ನಿಲ್ಲಿಸು",
  "voice.ask": "ಧ್ವನಿ ಪ್ರಶ್ನೆ",
  "voice.a11yLabel": "ಧ್ವನಿ ಪ್ರವೇಶ",
  "voice.navListening":
    "ಕೇಳುತ್ತಿದೆ… ಯೋಜನೆ, ಆರ್ಡರ್, ಮುಖಪುಟ, ಹಣ ಅಥವಾ ಪ್ರೊಫೈಲ್ ಹೇಳಿ",
  "voice.navMic": "ಧ್ವನಿ ನ್ಯಾವಿಗೇಟ್",
  "voice.navLabel": "ಧ್ವನಿ",
  "voice.navA11yLabel": "ಅಪ್ ಧ್ವನಿ ಸಹಾಯಕ",
  "chat.title": "ಲೂಮ್ ಸಹಾಯಕ",
  "chat.subtitle": "ಸಲಹೆ, ಹಣ, ಆರ್ಡರ್ ಸಾರಾಂಶ.",
  "chat.placeholder": "ಇಂದು, ಹಣ ಅಥವಾ ಆರ್ಡರ್ ಬಗ್ಗೆ ಕೇಳಿ…",
  "chat.send": "ಕಳುಹಿಸಿ",
  "chat.summarize": "ಎಲ್ಲವನ್ನೂ ಸಾರಾಂಶ",
  "chat.thinking": "ಯೋಚಿಸುತ್ತಿದೆ…",
  "chat.emptyHint":
    "“ಎಲ್ಲವನ್ನೂ ಸಾರಾಂಶ” ಒತ್ತಿ ಅಥವಾ ಪಠ್ಯ/ಧ್ವನಿಯಿಂದ ಕೇಳಿ.",
  "chat.you": "ನೀವು",
  "chat.assistant": "ಸಹಾಯಕ",
  "chat.error": "ಸಾರಾಂಶ ತಯಾರಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  "common.loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
  "common.demoSimulated": "ಡೆಮೊ / ಸಿಮ್ಯುಲೇಟೆಡ್",
  "plan.title": "ಯಾವಾಗ ಪ್ರಾರಂಭಿಸುವುದು",
  "plan.subtitle":
    "ನೀವು ಏನು ನೇಯುತ್ತೀರಿ ಮತ್ತು ಯಾವಾಗ ಸಿದ್ಧವಾಗಬೇಕು ಎಂದು ಆಯ್ಕೆಮಾಡಿ. ನಾವು ದಿನಾಂಕಗಳನ್ನು ಹಿಂದಕ್ಕೆ ಲೆಕ್ಕ ಹಾಕುತ್ತೇವೆ.",
  "plan.whatWeave": "ನೀವು ಏನು ನೇಯುತ್ತೀರಿ?",
  "plan.whenReady": "ಯಾವಾಗ ಸಿದ್ಧವಾಗಬೇಕು?",
  "plan.festivalNote":
    "ಡೆಮೊಗಾಗಿ ಮಾದರಿ ಹಬ್ಬದ ದಿನಾಂಕಗಳು — ಲೈವ್ ಕ್ಯಾಲೆಂಡರ್ ಅಲ್ಲ.",
  "plan.ownDate": "ಅಥವಾ ನಿಮ್ಮ ಸ್ವಂತ ದಿನಾಂಕ ಹೊಂದಿಸಿ",
  "plan.daysHeading": "ಯೋಜನೆಗೆ ಬಳಸುವ ದಿನಗಳು",
  "plan.daysWarning":
    "ಉದಾಹರಣೆ ಡಿಫಾಲ್ಟ್‌ಗಳು — ಸಹಕಾರ ಇವುಗಳನ್ನು ಸರಿಪಡಿಸಬೇಕು. ಪರಿಶೀಲಿತ ಉತ್ಪಾದನಾ ಸಮಯವಲ್ಲ.",
  "plan.resetDefaults": "ಆರಂಭಿಕ ಡಿಫಾಲ್ಟ್‌ಗೆ ಮರುಹೊಂದಿಸಿ",
  "plan.weavingDays": "ವಸ್ತು ಪ್ರಕಾರ ನೇಯುವ ದಿನಗಳು",
  "plan.yarnDays": "ಯೋಜನೆಯಲ್ಲಿ ನೂಲು ಲೀಡ್ ಸಮಯ",
  "plan.qcDays": "ಪರಿಶೀಲನೆ & ಪ್ಯಾಕಿಂಗ್ (ದಿನಗಳು)",
  "plan.shipDays": "ಸಿದ್ಧ ದಿನಾಂಕಕ್ಕೂ ಮುನ್ನ ಶಿಪ್ಪಿಂಗ್ (ದಿನಗಳು)",
  "plan.settleDays": "ರವಾನೆಯ ನಂತರ ಹಣ ಬರುವ ದಿನಗಳು (stub)",
  "timeline.title": "ನಿಮ್ಮ ದಿನಾಂಕಗಳು",
  "timeline.estimatedPlan": "ಅಂದಾಜು ಯೋಜನೆ — ಉದಾಹರಣೆ ಅವಧಿಗಳು",
  "timeline.estimatedHint":
    "ಸಿದ್ಧ ದಿನಾಂಕದಿಂದ ಹಿಂದಕ್ಕೆ, ಸಂಪಾದಿಸಬಹುದಾದ ದಿನಗಳಿಂದ. ಡಿಫಾಲ್ಟ್‌ಗಳು ಉದಾಹರಣೆ ಮಾತ್ರ.",
  "timeline.buyYarn": "ನೂಲು ಖರೀದಿಸಿ",
  "timeline.buyYarnDetail": "ನೇಯುವಿಕೆ ಪ್ರಾರಂಭಕ್ಕೂ ಮುನ್ನ ಸುಮಾರು {days} ದಿನಗಳು",
  "timeline.startWeaving": "ನೇಯುವಿಕೆ ಪ್ರಾರಂಭ",
  "timeline.startWeavingDetail":
    "{category}ಗಾಗಿ {days} ನೇಯುವ ದಿನಗಳು ಯೋಜಿಸಲಾಗಿದೆ",
  "timeline.finish": "ಉತ್ಪಾದನೆ ಮುಗಿಸಿ",
  "timeline.dispatch": "ರವಾನೆ",
  "timeline.dispatchDetail": "ಇದಕ್ಕೂ ಮುನ್ನ ಪರಿಶೀಲನೆ-ಪ್ಯಾಕಿಂಗ್‌ಗೆ {days} ದಿನಗಳು",
  "timeline.ready": "ಆ ದಿನಕ್ಕೆ ಸಿದ್ಧ",
  "timeline.readyDetail": "ಈ ದಿನಾಂಕಕ್ಕೂ ಮುನ್ನ {days} ದಿನಗಳ ಶಿಪ್ಪಿಂಗ್",
  "timeline.moneyExpected": "ಹಣ ನಿರೀಕ್ಷೆ",
  "timeline.moneyDetail":
    "ರವಾನೆ + {days} ದಿನ(ಗಳು) — ಮಾದರಿ T+1 ಸೆಟಲ್‌ಮೆಂಟ್ (ಸಿಮ್ಯುಲೇಟೆಡ್). ಡೆಮೊ / ಸಿಮ್ಯುಲೇಟೆಡ್",
  "timeline.estimated": "ಅಂದಾಜು",
  "timeline.nhdcTitle": "ನೂಲು ಸಹಾಯ ಸಿಗುತ್ತದೆಯೇ ನೋಡಿ",
  "timeline.nhdcBody":
    "NHDC ಕಚ್ಚಾ ವಸ್ತು ಯೋಜನೆ ನೂಲಿಗೆ 15% ಸಬ್ಸಿಡಿ DBT ಮೂಲಕ ನೀಡುತ್ತದೆ. ಸಹಕಾರ ಅಥವಾ NHDC ಬಳಿ ಅರ್ಹತೆ ಕೇಳಿ — LoomOS ನೆನಪು ಮಾತ್ರ; ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದಿಲ್ಲ.",
  "money.title": "ನಿಮ್ಮ ಕಡೆಗೆ ಬರುವ ಹಣ",
  "money.subtitle": "ಪ್ರತಿ ಪಾವತಿ ಎಲ್ಲಿದೆ — ಶಾಂತವಾಗಿ, ಸ್ಪಷ್ಟವಾಗಿ.",
  "money.prototypeLabel": "ಪ್ರೊಟೊಟೈಪ್ / ಸಿಮ್ಯುಲೇಟೆಡ್.",
  "money.walletSnapshot": "ವಾಲೆಟ್ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್",
  "money.advanceHeld":
    "ತೆರೆದ ಆರ್ಡರ್‌ಗಳಿಗೆ ಸುಮಾರು ₹{amount} ಅಡ್ವಾನ್ಸ್ ಹೋಲ್ಡ್‌ನಲ್ಲಿದೆ — RBI ಅಧಿಕೃತ ಎಸ್ಕ್ರೋ ಮಾದರಿ (ಸಿಮ್ಯುಲೇಟೆಡ್).",
  "money.noAdvance": "ತೆರೆದ ಆರ್ಡರ್‌ಗಳಿಗೆ ಈಗ ಅಡ್ವಾನ್ಸ್ ಇಲ್ಲ.",
  "money.nextProjected":
    "ಮುಂದಿನ ಹಣ ಸುಮಾರು {date} ರಂದು ನಿರೀಕ್ಷೆ (ರವಾನೆಯ ನಂತರ T+1).",
  "money.noSettlement":
    "ಇನ್ನೂ ಸೆಟಲ್‌ಮೆಂಟ್ ದಿನಾಂಕವಿಲ್ಲ — ಆರ್ಡರ್ ಕಳುಹಿಸುವವರೆಗೆ ಕಾಯಿರಿ.",
  "money.yourOrders": "ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಳು",
  "money.buyerFallback": "ಖರೀದಿದಾರ",
  "money.buyerTrust": "ಖರೀದಿದಾರ ನಂಬಿಕೆ: {label} ({score}/100)",
  "money.demoNext": "ಡೆಮೊ: ಮುಂದಿನ ಹಂತ → {state}",
  "money.question": "ಪ್ರಶ್ನೆ: {reason} ({status})",
  "money.adminHint": "ತಂಡ: Admin → Paymentsನಲ್ಲಿ ಪ್ರತಿ ಸ್ಥಿತಿ ನೋಡಿ.",
  "money.loadingError": "ಹಣದ ಸ್ಥಿತಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ",
  "orders.title": "ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಳು",
  "orders.subtitle":
    "ನಿಮ್ಮ ಹತ್ತಿರ ಖರೀದಿದಾರರ ಅಗತ್ಯಗಳು — ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪೋಸ್ಟ್. ಮುಖಪುಟ ಸಲಹೆಯೂ ಇವುಗಳಿಂದ.",
  "orders.demoNote":
    "ಡೆಮೊ ಮೋಡ್ — ಬೀಜ ಅಗತ್ಯಗಳಲ್ಲಿ ಕಾಲ್ಪನಿಕ ಖರೀದಿದಾರರು ಇರಬಹುದು. ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಅಲ್ಲ.",
  "orders.empty": "ಈಗ {region}ನಲ್ಲಿ ತೆರೆದ ಖರೀದಿದಾರ ಅಗತ್ಯವಿಲ್ಲ.",
  "orders.piecesNeeded": "{qty} ತುಂಡುಗಳು · {date}ರೊಳಗೆ ಬೇಕು",
  "orders.priceRange": "ಬೆಲೆ ವ್ಯಾಪ್ತಿ ₹{min}–₹{max}",
  "orders.fromBuyer": "{name} ಇಂದ",
  "orders.buyerLink": "ಖರೀದಿದಾರರು ಇವುಗಳನ್ನು /buyerನಲ್ಲಿ ಪೋಸ್ಟ್ ಮಾಡುತ್ತಾರೆ.",
  "wallet.title": "ಸ್ಥಿರ ಆದಾಯ ವಾಲೆಟ್",
  "wallet.subtitle":
    "ನಿಯಮ ಆಧಾರಿತ ಸಮತೋಲನ — ಭವಿಷ್ಯವಾಣಿ ಮಾದರಿ ಅಲ್ಲ. Settlement Released ಮಾತ್ರ.",
  "wallet.demoNote":
    "ಡೆಮೊ / ಸಿಮ್ಯುಲೇಟೆಡ್ — Available ಮತ್ತು Reserve ಸೆಟಲ್‌ಮೆಂಟ್ ಈವೆಂಟ್‌ಗಳಿಂದ (ಲೈವ್ ಬ್ಯಾಂಕ್ ಅಲ್ಲ).",
  "wallet.available": "ಲಭ್ಯ",
  "wallet.reserve": "ರಿಸರ್ವ್",
  "wallet.floor": "ಫ್ಲೋರ್ {amount}",
  "wallet.showRule": "ಈ ನಿಯಮ ತೋರಿಸಿ",
  "wallet.moveToReserve": "{amount} ಅನ್ನು ರಿಸರ್ವ್‌ಗೆ ಸರಿಸಿ",
  "wallet.drawFromReserve": "ರಿಸರ್ವ್‌ನಿಂದ {amount} ತೆಗೆಯಿರಿ",
  "wallet.trailingAvg": "ಟ್ರೈಲಿಂಗ್ ಸರಾಸರಿ",
  "wallet.notEnoughHistory":
    "ಇತಿಹಾಸ ಸಾಕಾಗಿಲ್ಲ — {need}ರಲ್ಲಿ {have} ತಿಂಗಳುಗಳಲ್ಲಿ ಆದಾಯ. ಆಗುವವರೆಗೆ ಸರಾಸರಿ ಇಲ್ಲ.",
  "wallet.usualMonth": "ನಿಮ್ಮ ಸಾಮಾನ್ಯ ತಿಂಗಳು: {amount}",
  "wallet.howAverage": "ಈ ಸರಾಸರಿ ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತದೆ",
  "wallet.thisMonthSettled": "ಈ ತಿಂಗಳು ಇಲ್ಲಿಯವರೆಗೆ ಸೆಟಲ್:",
  "wallet.projected": "ಅಂದಾಜು",
  "wallet.notAvailableYet": "ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ",
  "wallet.showProjection": "ಅಂದಾಜು ನಿಯಮ ತೋರಿಸಿ",
  "wallet.reserveRules": "ನಿಮ್ಮ ರಿಸರ್ವ್ ನಿಯಮಗಳು",
  "wallet.reserveFloor": "ರಿಸರ್ವ್ ಫ್ಲೋರ್ (₹)",
  "wallet.savePct": "ಸರಾಸರಿಗಿಂತ ಮೇಲಿನ ಹೆಚ್ಚುವರಿಯ ಉಳಿತಾಯ %",
  "wallet.saveRules": "ನಿಯಮಗಳನ್ನು ಉಳಿಸಿ",
  "wallet.incomeLog": "ಆದಾಯ ಲಾಗ್ (ಸೆಟಲ್‌ಮೆಂಟ್ ಮಾತ್ರ)",
  "wallet.noSettlements": "ಇನ್ನೂ Settlement Released ಇಲ್ಲ.",
  "wallet.loading": "ಆದಾಯ ವಾಲೆಟ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
  "record.title": "ಪರಿಶೀಲಿತ ವಹಿವಾಟು ದಾಖಲೆ",
  "record.loading": "ದಾಖಲೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
  "record.copyLink": "ಹಂಚಿಕೆ ಲಿಂಕ್ ನಕಲಿಸಿ",
  "record.copied": "ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ",
  "record.open": "ಹಂಚಬಹುದಾದ ಸಾರಾಂಶ ತೆರೆಯಿರಿ",
  "record.print": "ಮುದ್ರಿಸಿ / PDF ಉಳಿಸಿ",
};

const bn: Catalog = {
  ...en,
  "nav.home": "হোম",
  "nav.plan": "পরিকল্পনা",
  "nav.money": "টাকা",
  "nav.orders": "অর্ডার",
  "nav.profile": "প্রোফাইল",
  "topbar.signOut": "সাইন আউট",
  "auth.login": "লগইন",
  "auth.register": "নিবন্ধন",
  "auth.weaverTitle": "তাঁতি প্রবেশ",
  "auth.loginSubtitle": "আপনার নিবন্ধিত মোবাইল নম্বর দিয়ে সাইন ইন করুন।",
  "auth.registerSubtitle":
    "আপনার তাঁতি প্রোফাইল তৈরি করুন — পরামর্শ ও কণ্ঠস্বরের জন্য।",
  "auth.phone": "মোবাইল নম্বর",
  "auth.otp": "৬ সংখ্যার OTP",
  "auth.sendOtp": "OTP পাঠান",
  "auth.sending": "পাঠানো হচ্ছে…",
  "auth.verify": "যাচাই করে চালিয়ে যান",
  "auth.checking": "যাচাই হচ্ছে…",
  "auth.changeNumber": "নম্বর বদলান",
  "auth.codeSentTo": "কোড পাঠানো হয়েছে",
  "auth.devCode": "ডেভ কোড:",
  "auth.devNote":
    ".env-এ SMS কী না থাকলে এই বিল্ড Dev OTP ব্যবহার করে (স্ক্রিনে কোড)। MSG91/Twilio থাকলে কোড শুধু SMS-এ যায়।",
  "auth.yourName": "আপনার নাম",
  "auth.region": "অঞ্চল / রাজ্য",
  "auth.language": "পছন্দের ভাষা",
  "auth.categories": "আপনি কী বোনেন",
  "auth.categoriesHint": "প্রোফাইলের জন্য অন্তত একটি শ্রেণি বেছে নিন।",
  "auth.seedHint":
    "ডেমো তাঁতি: 9000000001 মীনা, 9000000002 সেলভি, 9000000003 কমলা। নতুন নম্বর নিবন্ধন করতে পারে।",
  "auth.checkingSignIn": "সাইন-ইন যাচাই…",
  "auth.skipToSignIn": "সাইন ইনে যান",
  "home.question": "এই সপ্তাহে কী বোনব?",
  "home.loading": "পরামর্শ লোড হচ্ছে…",
  "home.todaysAdvice": "আজকের পরামর্শ",
  "home.refresh": "পরামর্শ রিফ্রেশ",
  "home.demandScore": "{category}-এর চাহিদা স্কোর:",
  "home.hearAgain": "আবার শুনুন",
  "home.askByVoice": "কণ্ঠে জিজ্ঞাসা করুন",
  "home.listening": "শুনছি…",
  "home.why": "কেন?",
  "home.moneyTitle": "আপনার পথে আসা টাকা",
  "home.moneySimNote":
    "প্রোটোটাইপ / সিমুলেটেড পেমেন্ট — আসল টাকা নয়।",
  "home.nextPayment": "পরবর্তী পেমেন্ট প্রায় {date}-এর কাছাকাছি অনুমান।",
  "home.noPayment": "খোলা অর্ডারের জন্য এখনো কোনো পেমেন্ট তারিখ নেই।",
  "home.advanceHeld":
    "খোলা অর্ডারের জন্য প্রায় ₹{amount} অ্যাডভান্স হোল্ডে আছে (সিমুলেটেড)।",
  "home.walletQuiet": "ওয়ালেট শান্ত — কোনো অ্যাডভান্স ক্লিয়ার হওয়ার অপেক্ষায় নেই।",
  "home.demoSimulated": "ডেমো / সিমুলেটেড",
  "voice.speaking": "বলছি…",
  "voice.notSupported": "এই ব্রাউজারে কথা বলা নেই। ডেমোর জন্য Chrome ব্যবহার করুন।",
  "voice.speakFailed": "বলা যায়নি — Chrome চেষ্টা করুন বা আবার শুনুন চাপুন।",
  "voice.listeningHint": "শুনছি… কী বোনবেন জিজ্ঞাসা করুন",
  "voice.micUnavailable": "মাইক Chrome-এ ভালো কাজ করে।",
  "voice.didntCatch": "বুঝিনি — মাইক চেপে আবার চেষ্টা করুন।",
  "voice.micError": "মাইক ত্রুটি — Chrome-এ অনুমতি দিন।",
  "voice.heard": "শুনেছি: “{transcript}”",
  "voice.speakPage": "পৃষ্ঠা পড়ুন",
  "voice.stop": "থামান",
  "voice.ask": "কণ্ঠে জিজ্ঞাসা",
  "voice.a11yLabel": "কণ্ঠ অ্যাক্সেস",
  "voice.navListening":
    "শুনছি… পরিকল্পনা, অর্ডার, হোম, টাকা বা প্রোফাইল বলুন",
  "voice.navMic": "কণ্ঠে নেভিগেট",
  "voice.navLabel": "কণ্ঠ",
  "voice.navA11yLabel": "অ্যাপ কণ্ঠ সহায়ক",
  "chat.title": "লুম সহায়ক",
  "chat.subtitle": "পরামর্শ, টাকা ও অর্ডারের সারাংশ।",
  "chat.placeholder": "আজ, টাকা বা অর্ডার নিয়ে জিজ্ঞাসা করুন…",
  "chat.send": "পাঠান",
  "chat.summarize": "সবকিছুর সারাংশ",
  "chat.thinking": "ভাবছি…",
  "chat.emptyHint":
    "“সবকিছুর সারাংশ” চাপুন বা টেক্সট/কণ্ঠে জিজ্ঞাসা করুন।",
  "chat.you": "আপনি",
  "chat.assistant": "সহায়ক",
  "chat.error": "সারাংশ তৈরি হয়নি। আবার চেষ্টা করুন।",
  "common.loading": "লোড হচ্ছে…",
  "common.demoSimulated": "ডেমো / সিমুলেটেড",
  "plan.title": "কখন শুরু করবেন",
  "plan.subtitle":
    "কী বোনেন এবং কখন প্রস্তুত হতে হবে বেছে নিন। আমরা তারিখ পেছন থেকে বের করি।",
  "plan.whatWeave": "আপনি কী বোনেন?",
  "plan.whenReady": "কখন প্রস্তুত হতে হবে?",
  "plan.festivalNote":
    "ডেমোর জন্য নমুনা উৎসবের তারিখ — লাইভ ক্যালেন্ডার নয়।",
  "plan.ownDate": "অথবা নিজের তারিখ দিন",
  "plan.daysHeading": "পরিকল্পনায় ব্যবহৃত দিন",
  "plan.daysWarning":
    "উদাহরণ ডিফল্ট — সমবায় এগুলো সংশোধন করবে। যাচাইকৃত উৎপাদন সময় নয়।",
  "plan.resetDefaults": "শুরুর ডিফল্টে ফিরুন",
  "plan.weavingDays": "পণ্য অনুযায়ী বোনার দিন",
  "plan.yarnDays": "পরিকল্পনায় সুতা লিড সময়",
  "plan.qcDays": "যাচাই ও প্যাকিং (দিন)",
  "plan.shipDays": "প্রস্তুত তারিখের আগে শিপিং (দিন)",
  "plan.settleDays": "ডিসপ্যাচের পর টাকা আসার দিন (stub)",
  "timeline.title": "আপনার তারিখ",
  "timeline.estimatedPlan": "আনুমানিক পরিকল্পনা — উদাহরণকাল",
  "timeline.estimatedHint":
    "প্রস্তুত তারিখ থেকে পেছন দিকে, সম্পাদনযোগ্য দিন সংখ্যায়। ডিফল্ট শুধু উদাহরণ।",
  "timeline.buyYarn": "সুতা কিনুন",
  "timeline.buyYarnDetail": "বোনা শুরুর আগে প্রায় {days} দিন",
  "timeline.startWeaving": "বোনা শুরু",
  "timeline.startWeavingDetail":
    "{category}-এর জন্য {days} বোনার দিন পরিকল্পিত",
  "timeline.finish": "উৎপাদন শেষ",
  "timeline.dispatch": "ডিসপ্যাচ",
  "timeline.dispatchDetail": "এর আগে যাচাই-প্যাকিংয়ের {days} দিন",
  "timeline.ready": "সেই দিনের জন্য প্রস্তুত",
  "timeline.readyDetail": "এই তারিখের আগে {days} দিন শিপিং",
  "timeline.moneyExpected": "টাকার প্রত্যাশা",
  "timeline.moneyDetail":
    "ডিসপ্যাচ + {days} দিন — মডেল T+1 নিষ্পত্তি (সিমুলেটেড)। ডেমো / সিমুলেটেড",
  "timeline.estimated": "আনুমানিক",
  "timeline.nhdcTitle": "সুতার সাহায্য পাওয়া যায় কিনা দেখুন",
  "timeline.nhdcBody":
    "NHDC কাঁচামাল সরবরাহ প্রকল্পে সুতার উপর ১৫% ভর্তুকি DBT-তে আসে। সমবায় বা NHDC-তে যোগ্যতা জিজ্ঞাসা করুন — LoomOS শুধু মনে করায়; দাবি জমা দেয় না।",
  "money.title": "আপনার পথে আসা টাকা",
  "money.subtitle": "প্রতিটি পেমেন্ট কোথায় — শান্ত ও পরিষ্কার।",
  "money.prototypeLabel": "প্রোটোটাইপ / সিমুলেটেড।",
  "money.walletSnapshot": "ওয়ালেট স্ন্যাপশট",
  "money.advanceHeld":
    "খোলা অর্ডারের জন্য প্রায় ₹{amount} অ্যাডভান্স হোল্ডে — RBI-অনুমোদিত এসক্রো প্যাটার্ন (সিমুলেটেড)।",
  "money.noAdvance": "খোলা অর্ডারে এখন কোনো অ্যাডভান্স হোল্ড নেই।",
  "money.nextProjected":
    "পরবর্তী টাকা প্রায় {date}-এর কাছাকাছি অনুমান (ডিসপ্যাচের পর T+1)।",
  "money.noSettlement":
    "এখনো নিষ্পত্তির তারিখ নেই — অর্ডার পাঠানো পর্যন্ত অপেক্ষা করুন।",
  "money.yourOrders": "আপনার অর্ডার",
  "money.buyerFallback": "ক্রেতা",
  "money.buyerTrust": "ক্রেতার বিশ্বাস: {label} ({score}/100)",
  "money.demoNext": "ডেমো: পরবর্তী ধাপ → {state}",
  "money.question": "প্রশ্ন: {reason} ({status})",
  "money.adminHint": "টিম: Admin → Payments-এ প্রতিটি অবস্থা দেখুন।",
  "money.loadingError": "টাকার অবস্থা লোড হয়নি",
  "orders.title": "আপনার অর্ডার",
  "orders.subtitle":
    "আপনার কাছাকাছি ক্রেতার চাহিদা — পোর্টালে পোস্ট। হোমের পরামর্শও এগুলো থেকে।",
  "orders.demoNote":
    "ডেমো মোড — সিড চাহিদায় কাল্পনিক ক্রেতা থাকতে পারে। লাইভ বাজার নয়।",
  "orders.empty": "এখন {region}-এ কোনো খোলা ক্রেতার চাহিদা নেই।",
  "orders.piecesNeeded": "{qty} পিস · {date}-এর মধ্যে দরকার",
  "orders.priceRange": "মূল্য সীমা ₹{min}–₹{max}",
  "orders.fromBuyer": "{name} থেকে",
  "orders.buyerLink": "ক্রেতারা এগুলো /buyer-এ পোস্ট করেন।",
  "wallet.title": "স্থিতিশীল আয় ওয়ালেট",
  "wallet.subtitle":
    "নিয়মভিত্তিক সমতলকরণ — পূর্বাভাস মডেল নয়। শুধু Settlement Released গণনা হয়।",
  "wallet.demoNote":
    "ডেমো / সিমুলেটেড — Available ও Reserve নিষ্পত্তি ইভেন্ট থেকে (লাইভ ব্যাংক নয়)।",
  "wallet.available": "উপলব্ধ",
  "wallet.reserve": "রিজার্ভ",
  "wallet.floor": "ফ্লোর {amount}",
  "wallet.showRule": "এই নিয়ম দেখান",
  "wallet.moveToReserve": "{amount} রিজার্ভে সরান",
  "wallet.drawFromReserve": "রিজার্ভ থেকে {amount} তুলুন",
  "wallet.trailingAvg": "ট্রেইলিং গড়",
  "wallet.notEnoughHistory":
    "ইতিহাস কম — {need}-এর মধ্যে {have} মাসে আয়। ততদিন গড় নেই।",
  "wallet.usualMonth": "আপনার সাধারণ মাস: {amount}",
  "wallet.howAverage": "এই গড় কীভাবে হিসাব হয়",
  "wallet.thisMonthSettled": "এই মাসে এখন পর্যন্ত নিষ্পত্তি:",
  "wallet.projected": "আনুমানিক",
  "wallet.notAvailableYet": "এখনো উপলব্ধ নয়",
  "wallet.showProjection": "আনুমানিক নিয়ম দেখান",
  "wallet.reserveRules": "আপনার রিজার্ভ নিয়ম",
  "wallet.reserveFloor": "রিজার্ভ ফ্লোর (₹)",
  "wallet.savePct": "গড়ের উপরে উদ্বৃত্তের সঞ্চয় %",
  "wallet.saveRules": "নিয়ম সংরক্ষণ",
  "wallet.incomeLog": "আয় লগ (শুধু নিষ্পত্তি)",
  "wallet.noSettlements": "এখনো কোনো Settlement Released নেই।",
  "wallet.loading": "আয় ওয়ালেট লোড হচ্ছে…",
  "record.title": "যাচাইকৃত লেনদেন রেকর্ড",
  "record.loading": "রেকর্ড লোড হচ্ছে…",
  "record.copyLink": "শেয়ার লিংক কপি করুন",
  "record.copied": "লিংক কপি হয়েছে",
  "record.open": "শেয়ার সারাংশ খুলুন",
  "record.print": "প্রিন্ট / PDF সংরক্ষণ",
};

const as: Catalog = {
  ...en,
  "nav.home": "হোম",
  "nav.plan": "পৰিকল্পনা",
  "nav.money": "টকা",
  "nav.orders": "অৰ্ডাৰ",
  "nav.profile": "প্ৰফাইল",
  "topbar.signOut": "ছাইন আউট",
  "auth.login": "লগইন",
  "auth.register": "পঞ্জীয়ন",
  "auth.weaverTitle": "তাঁতী প্ৰৱেশ",
  "auth.loginSubtitle": "আপোনাৰ পঞ্জীয়ন কৰা ম'বাইল নম্বৰেৰে ছাইন ইন কৰক।",
  "auth.registerSubtitle":
    "আপোনাৰ তাঁতী প্ৰ'ফাইল বনাওক — পৰামৰ্শ আৰু কণ্ঠস্বৰৰ বাবে।",
  "auth.phone": "ম'বাইল নম্বৰ",
  "auth.otp": "৬ অংকৰ OTP",
  "auth.sendOtp": "OTP পঠিয়াওক",
  "auth.sending": "পঠিয়াই আছে…",
  "auth.verify": "পৰীক্ষা কৰি আগবাঢ়ক",
  "auth.checking": "পৰীক্ষা কৰি আছে…",
  "auth.changeNumber": "নম্বৰ সলনি কৰক",
  "auth.codeSentTo": "ক'ড পঠিওৱা হৈছে",
  "auth.devCode": "ডেভ ক'ড:",
  "auth.devNote":
    ".env-ত SMS কী নথকা হ'লে এই বিল্ডে Dev OTP ব্যৱহাৰ কৰে (স্ক্ৰীনত ক'ড)। MSG91/Twilio থাকিলে ক'ড কেৱল SMS-ত যায়।",
  "auth.yourName": "আপোনাৰ নাম",
  "auth.region": "অঞ্চল / ৰাজ্য",
  "auth.language": "পছন্দৰ ভাষা",
  "auth.categories": "আপুনি কি বোৱে",
  "auth.categoriesHint": "প্ৰ'ফাইলৰ বাবে কমেও এটা শ্ৰেণী বাছনি কৰক।",
  "auth.seedHint":
    "ডেম' তাঁতী: 9000000001 মীনা, 9000000002 চেल्ভি, 9000000003 কমলা। নতুন নম্বৰে পঞ্জীয়ন কৰিব পাৰে।",
  "auth.checkingSignIn": "ছাইন-ইন পৰীক্ষা…",
  "auth.skipToSignIn": "ছাইন ইনলৈ যাওক",
  "home.question": "এই সপ্তাহত কি ব'ব?",
  "home.loading": "পৰামৰ্শ ল'ড হৈ আছে…",
  "home.todaysAdvice": "আজিৰ পৰামৰ্শ",
  "home.refresh": "পৰামৰ্শ সতেজ কৰক",
  "home.demandScore": "{category}-ৰ চাহিদা স্ক'ৰ:",
  "home.hearAgain": "পুনৰ শুনক",
  "home.askByVoice": "কণ্ঠেৰে সোধক",
  "home.listening": "শুনি আছে…",
  "home.why": "কিয়?",
  "home.moneyTitle": "আপোনাৰ ফালে অহা টকা",
  "home.moneySimNote":
    "প্ৰ'ট'টাইপ / ছিমুলেটেড পেমেণ্ট — প্ৰকৃত টকা নহয়।",
  "home.nextPayment": "পৰৱৰ্তী পেমেণ্ট প্ৰায় {date}-ৰ ওচৰত অনুমান।",
  "home.noPayment": "খোলা অৰ্ডাৰৰ বাবে এতিয়াও কোনো পেমেণ্ট তাৰিখ নাই।",
  "home.advanceHeld":
    "খোলা অৰ্ডাৰৰ বাবে প্ৰায় ₹{amount} এডভান্স হ'ল্ডত আছে (ছিমুলেটেড)।",
  "home.walletQuiet": "ৱালেট শান্ত — কোনো এডভান্স ক্লিয়াৰ হ'বলৈ নাই।",
  "home.demoSimulated": "ডেম' / ছিমুলেটেড",
  "voice.speaking": "কৈ আছে…",
  "voice.notSupported": "এই ব্ৰাউজাৰত কথা কোৱা নাই। ডেম'ৰ বাবে Chrome ব্যৱহাৰ কৰক।",
  "voice.speakFailed": "ক'ব পৰা নগ'ল — Chrome চেষ্টা কৰক বা পুনৰ শুনক টিপক।",
  "voice.listeningHint": "শুনি আছে… কি ব'ব সোধক",
  "voice.micUnavailable": "মাইক Chrome-ত ভালকৈ কাম কৰে।",
  "voice.didntCatch": "বুজি পোৱা নগ'ল — মাইক টিপি পুনৰ চেষ্টা কৰক।",
  "voice.micError": "মাইক ত্ৰুটি — Chrome-ত অনুমতি দিয়ক।",
  "voice.heard": "শুনিলোঁ: “{transcript}”",
  "voice.speakPage": "পৃষ্ঠা পঢ়ক",
  "voice.stop": "বন্ধ কৰক",
  "voice.ask": "কণ্ঠেৰে সোধক",
  "voice.a11yLabel": "কণ্ঠ এক্সেছ",
  "voice.navListening":
    "শুনি আছে… পৰিকল্পনা, অৰ্ডাৰ, হোম, টকা বা প্ৰফাইল কওক",
  "voice.navMic": "কণ্ঠেৰে নেভিগেট",
  "voice.navLabel": "কণ্ঠ",
  "voice.navA11yLabel": "এপ কণ্ঠ সহায়ক",
  "chat.title": "লুম সহায়ক",
  "chat.subtitle": "পৰামৰ্শ, টকা আৰু অৰ্ডাৰৰ সাৰাংশ।",
  "chat.placeholder": "আজি, টকা বা অৰ্ডাৰ সম্পৰ্কে সোধক…",
  "chat.send": "পঠিয়াওক",
  "chat.summarize": "সকলোৰে সাৰাংশ",
  "chat.thinking": "ভাবি আছে…",
  "chat.emptyHint":
    "“সকলোৰে সাৰাংশ” টিপক বা পাঠ/কণ্ঠেৰে সোধক।",
  "chat.you": "আপুনি",
  "chat.assistant": "সহায়ক",
  "chat.error": "সাৰাংশ বনাব পৰা নগ'ল। পুনৰ চেষ্টা কৰক।",
  "common.loading": "ল'ড হৈ আছে…",
  "common.demoSimulated": "ডেম' / ছিমুলেটেড",
  "plan.title": "কেতিয়া আৰম্ভ কৰিব",
  "plan.subtitle":
    "কি ব'ব আৰু কেতিয়া সাজু হ'ব লাগে বাছনি কৰক। আমি তাৰিখ পিছফালৰ পৰা উলিয়াওঁ।",
  "plan.whatWeave": "আপুনি কি ব'ব?",
  "plan.whenReady": "কেতিয়া সাজু হ'ব লাগে?",
  "plan.festivalNote":
    "ডেম'ৰ বাবে নমুনা উৎসৱৰ তাৰিখ — লাইভ কেলেণ্ডাৰ নহয়।",
  "plan.ownDate": "নাইবা নিজৰ তাৰিখ দিয়ক",
  "plan.daysHeading": "পৰিকল্পনাত ব্যৱহাৰ কৰা দিন",
  "plan.daysWarning":
    "উদাহৰণ ডিফ'ল্ট — সমবায়ে ইয়াক শুধৰাব লাগে। পৰীক্ষিত উৎপাদন সময় নহয়।",
  "plan.resetDefaults": "আৰম্ভণিৰ ডিফ'ল্টলৈ ঘূৰাওক",
  "plan.weavingDays": "বস্তু অনুসৰি বোৱা দিন",
  "plan.yarnDays": "পৰিকল্পনাত সূতা লিড সময়",
  "plan.qcDays": "পৰীক্ষা আৰু পেকিং (দিন)",
  "plan.shipDays": "সাজু তাৰিখৰ আগৰ শ্বিপিং (দিন)",
  "plan.settleDays": "ডিস্পাচৰ পিছত টকা অহা দিন (stub)",
  "timeline.title": "আপোনাৰ তাৰিখ",
  "timeline.estimatedPlan": "আনুমানিক পৰিকল্পনা — উদাহৰণকাল",
  "timeline.estimatedHint":
    "সাজু তাৰিখৰ পৰা পিছফালে, সম্পাদনযোগ্য দিন সংখ্যাৰে। ডিফ'ল্ট কেৱল উদাহৰণ।",
  "timeline.buyYarn": "সূতা কিনক",
  "timeline.buyYarnDetail": "বোৱা আৰম্ভৰ আগে প্ৰায় {days} দিন",
  "timeline.startWeaving": "বোৱা আৰম্ভ",
  "timeline.startWeavingDetail":
    "{category}-ৰ বাবে {days} বোৱা দিন পৰিকল্পিত",
  "timeline.finish": "উৎপাদন শেষ",
  "timeline.dispatch": "ডিস্পাচ",
  "timeline.dispatchDetail": "ইয়াৰ আগে পৰীক্ষা-পেকিংৰ {days} দিন",
  "timeline.ready": "সেই দিনৰ বাবে সাজু",
  "timeline.readyDetail": "এই তাৰিখৰ আগে {days} দিন শ্বিপিং",
  "timeline.moneyExpected": "টকাৰ আশা",
  "timeline.moneyDetail":
    "ডিস্পাচ + {days} দিন — মডেল T+1 নিষ্পত্তি (ছিমুলেটেড)। ডেম' / ছিমুলেটেড",
  "timeline.estimated": "আনুমানিক",
  "timeline.nhdcTitle": "সূতাৰ সহায় পোৱা যায় নে চাওক",
  "timeline.nhdcBody":
    "NHDC কেঁচা সামগ্ৰী যোগান আঁচনিত সূতাত ১৫% ৰাজসাহায্য DBT-ত আহে। সমবায় বা NHDC-ত যোগ্যতা সোধক — LoomOS কেৱল মনত পেলায়; দাবী দাখিল নকৰে।",
  "money.title": "আপোনাৰ ফালে অহা টকা",
  "money.subtitle": "প্ৰতিটো পেমেণ্ট ক'ত আছে — শান্ত আৰু স্পষ্ট।",
  "money.prototypeLabel": "প্ৰ'ট'টাইপ / ছিমুলেটেড।",
  "money.walletSnapshot": "ৱালেট স্নেপশ্বট",
  "money.advanceHeld":
    "খোলা অৰ্ডাৰৰ বাবে প্ৰায় ₹{amount} এডভান্স হ'ল্ডত — RBI-অনুমোদিত এস্ক্ৰ' পেটাৰ্ণ (ছিমুলেটেড)।",
  "money.noAdvance": "খোলা অৰ্ডাৰত এতিয়া কোনো এডভান্স হ'ল্ড নাই।",
  "money.nextProjected":
    "পৰৱৰ্তী টকা প্ৰায় {date}-ৰ ওচৰত অনুমান (ডিস্পাচৰ পিছত T+1)।",
  "money.noSettlement":
    "এতিয়াও নিষ্পত্তিৰ তাৰিখ নাই — অৰ্ডাৰ পঠিওৱালৈকে অপেক্ষা কৰক।",
  "money.yourOrders": "আপোনাৰ অৰ্ডাৰ",
  "money.buyerFallback": "ক্ৰেতা",
  "money.buyerTrust": "ক্ৰেতাৰ বিশ্বাস: {label} ({score}/100)",
  "money.demoNext": "ডেম': পৰৱৰ্তী পদক্ষেপ → {state}",
  "money.question": "প্ৰশ্ন: {reason} ({status})",
  "money.adminHint": "টিম: Admin → Payments-ত প্ৰতিটো অৱস্থা চাওক।",
  "money.loadingError": "টকাৰ অৱস্থা ল'ড নহ'ল",
  "orders.title": "আপোনাৰ অৰ্ডাৰ",
  "orders.subtitle":
    "আপোনাৰ ওচৰৰ ক্ৰেতাৰ প্ৰয়োজন — প'ৰ্টেলত পোষ্ট। হোমৰ পৰামৰ্শো ইয়াৰ পৰা।",
  "orders.demoNote":
    "ডেম' মোড — সীড প্ৰয়োজনত কাল্পনিক ক্ৰেতা থাকিব পাৰে। লাইভ বজাৰ নহয়।",
  "orders.empty": "এতিয়া {region}-ত কোনো খোলা ক্ৰেতাৰ প্ৰয়োজন নাই।",
  "orders.piecesNeeded": "{qty} পিচ · {date}-ৰ ভিতৰত লাগে",
  "orders.priceRange": "মূল্য সীমা ₹{min}–₹{max}",
  "orders.fromBuyer": "{name}-ৰ পৰা",
  "orders.buyerLink": "ক্ৰেতাই ইয়াক /buyer-ত পোষ্ট কৰে।",
  "wallet.title": "স্থিৰ আয় ৱালেট",
  "wallet.subtitle":
    "নিয়মভিত্তিক সমতলীকৰণ — পূৰ্বাভাস মডেল নহয়। কেৱল Settlement Released গণনা হয়।",
  "wallet.demoNote":
    "ডেম' / ছিমুলেটেড — Available আৰু Reserve নিষ্পত্তি ইভেণ্টৰ পৰা (লাইভ বেংক নহয়)।",
  "wallet.available": "উপলব্ধ",
  "wallet.reserve": "ৰিজাৰ্ভ",
  "wallet.floor": "ফ্ল'ৰ {amount}",
  "wallet.showRule": "এই নিয়ম দেখুৱাওক",
  "wallet.moveToReserve": "{amount} ৰিজাৰ্ভলৈ নিয়ক",
  "wallet.drawFromReserve": "ৰিজাৰ্ভৰ পৰা {amount} উলিয়াওক",
  "wallet.trailingAvg": "ট্ৰেইলিং গড়",
  "wallet.notEnoughHistory":
    "ইতিহাস কম — {need}-ৰ ভিতৰত {have} মাহত আয়। তেতিয়ালৈকে গড় নাই।",
  "wallet.usualMonth": "আপোনাৰ সাধাৰণ মাহ: {amount}",
  "wallet.howAverage": "এই গড় কেনেকৈ হিচাপ কৰা হয়",
  "wallet.thisMonthSettled": "এই মাহত এতিয়ালৈকে নিষ্পত্তি:",
  "wallet.projected": "আনুমানিক",
  "wallet.notAvailableYet": "এতিয়াও উপলব্ধ নহয়",
  "wallet.showProjection": "আনুমানিক নিয়ম দেখুৱাওক",
  "wallet.reserveRules": "আপোনাৰ ৰিজাৰ্ভ নিয়ম",
  "wallet.reserveFloor": "ৰিজাৰ্ভ ফ্ল'ৰ (₹)",
  "wallet.savePct": "গড়ৰ ওপৰত উদ্বৃত্তৰ সঞ্চয় %",
  "wallet.saveRules": "নিয়ম সংৰক্ষণ কৰক",
  "wallet.incomeLog": "আয় লগ (কেৱল নিষ্পত্তি)",
  "wallet.noSettlements": "এতিয়াও কোনো Settlement Released নাই।",
  "wallet.loading": "আয় ৱালেট ল'ড হৈ আছে…",
  "record.title": "পৰীক্ষিত লেনদেন ৰেকৰ্ড",
  "record.loading": "ৰেকৰ্ড ল'ড হৈ আছে…",
  "record.copyLink": "শ্বেয়াৰ লিংক কপি কৰক",
  "record.copied": "লিংক কপি হ'ল",
  "record.open": "শ্বেয়াৰ সাৰাংশ খোলক",
  "record.print": "প্ৰিণ্ট / PDF সংৰক্ষণ",
};

export const MESSAGE_CATALOGS: Record<LanguageCode, Catalog> = {
  en,
  hi,
  ta,
  te,
  kn,
  bn,
  as,
};

export function translate(
  lang: LanguageCode,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  const catalog = MESSAGE_CATALOGS[lang] ?? MESSAGE_CATALOGS.en;
  let text = catalog[key] ?? MESSAGE_CATALOGS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}
