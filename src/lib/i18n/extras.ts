/**
 * Extra UI strings for complete secondary-language coverage.
 * English is primary; other langs override. Missing → English.
 */
import type { LanguageCode } from "@/lib/voice/languages";

export type ExtraKey =
  | "topbar.buyer"
  | "home.voiceNote"
  | "home.scoreOf"
  | "home.advice"
  | "home.adviceFestival"
  | "home.startReady"
  | "home.start3days"
  | "home.start2weeks"
  | "home.startWeeks"
  | "home.whyTotal"
  | "cat.cotton-saree"
  | "cat.silk-saree"
  | "cat.stole-dupatta"
  | "cat.dhoti-angavastram"
  | "festival.nearby"
  | "festival.later"
  | "pitch.planEyebrow"
  | "pitch.planBody"
  | "pitch.planOneLiner"
  | "pitch.stepWhat"
  | "pitch.stepWhen"
  | "pitch.stepDates"
  | "pitch.stepTune"
  | "pitch.buyerNeeds"
  | "pitch.buyerNeedsHint"
  | "pitch.buyerNeedsLine"
  | "pitch.buyerPortal"
  | "pitch.whatHint"
  | "pitch.datesTitle"
  | "pitch.datesBody"
  | "pitch.moneyEyebrow"
  | "pitch.moneyBody"
  | "pitch.moneyOneLiner"
  | "pitch.stepSnapshot"
  | "pitch.stepOrders"
  | "pitch.stepReserve"
  | "pitch.stepProof"
  | "pitch.walletHint"
  | "pitch.ordersHint"
  | "pitch.noOrders"
  | "pitch.reserveTitle"
  | "pitch.reserveHint"
  | "pitch.proofTitle"
  | "pitch.proofHint"
  | "pitch.show"
  | "pitch.hide"
  | "pitch.ordersEyebrow"
  | "pitch.ordersOneLiner"
  | "pitch.openBuyerPortal"
  | "pitch.openBuyerPortalHint"
  | "pitch.simulatedBuyer"
  | "pitch.paymentNote"
  | "state.order_created"
  | "state.advance_requested"
  | "state.advance_paid_escrow_held"
  | "state.production_in_progress"
  | "state.dispatched"
  | "state.settlement_released"
  | "state.dispute_opened"
  | "state.under_review"
  | "state.resolved"
  | "stock.title"
  | "stock.hint"
  | "stock.simNote"
  | "stock.yarnCotton"
  | "stock.yarnSilk"
  | "stock.finishedCotton"
  | "stock.finishedSilk"
  | "stock.finishedStole"
  | "stock.finishedDhoti"
  | "stock.feedsEngine"
  | "engine.whyTags"
  | "engine.dailyTitle"
  | "engine.dailyHint"
  | "engine.fiveLabel"
  | "engine.q1"
  | "engine.a1"
  | "engine.q2"
  | "engine.a2"
  | "engine.q3"
  | "engine.a3"
  | "engine.q4"
  | "engine.a4"
  | "engine.q5"
  | "engine.a5"
  | "engine.chipHint";

type ExtraCatalog = Record<ExtraKey, string>;

const en: ExtraCatalog = {
  "topbar.buyer": "Buyer",
  "home.voiceNote":
    "English is the default. Other languages are optional from the menu. Voice works best in Chrome.",
  "home.scoreOf": "{score} of 100",
  "home.advice":
    "{category} looks like your strongest match right now (demand score {score} of 100). Start production {when}.",
  "home.adviceFestival":
    "{category} looks like your strongest match right now (demand score {score} of 100). Demand looks stronger ahead of {festival}. Start production {when}.",
  "home.startReady": "when you are ready",
  "home.start3days": "within the next three days",
  "home.start2weeks": "within the next two weeks",
  "home.startWeeks": "in the coming weeks",
  "home.whyTotal": "Total = {score}/100",
  "cat.cotton-saree": "Cotton saree",
  "cat.silk-saree": "Silk saree (complex / zari)",
  "cat.stole-dupatta": "Stole / dupatta",
  "cat.dhoti-angavastram": "Dhoti / angavastram",
  "festival.nearby": "Nearby festival season (sample)",
  "festival.later": "Later festival season (sample)",
  "pitch.planEyebrow": "Plan · 3rd tab · reverse production",
  "pitch.planBody":
    "After Orders shows demand, pick what you will weave and when it must be ready. LoomOS works the calendar backward so you know when to buy yarn and when money is projected.",
  "pitch.planOneLiner":
    "Pitch beat: buyer/festival date → start date → yarn date → projected payment — timing comes after you see the order.",
  "pitch.stepWhat": "What",
  "pitch.stepWhen": "When",
  "pitch.stepDates": "Your dates",
  "pitch.stepTune": "Tune",
  "pitch.buyerNeeds": "Simulated buyer needs (optional)",
  "pitch.buyerNeedsHint":
    "Tap a buyer post to set your ready date — same data as the Buyer Portal.",
  "pitch.buyerNeedsLine": "{category} · {qty} pcs · ready {date}",
  "pitch.buyerPortal": "Buyer Portal",
  "pitch.whatHint": "One choice — the days below use this item’s weaving length.",
  "pitch.datesTitle": "Your dates — the pitch moment",
  "pitch.datesBody":
    "This is the explainable answer: when to buy yarn, start, finish, and when money is projected.",
  "pitch.moneyEyebrow": "Money · 4th tab · simulated escrow story",
  "pitch.moneyBody":
    "See where each payment sits — advance held, next projected settlement, then a steady reserve and a shareable proof record.",
  "pitch.moneyOneLiner":
    "Pitch in one line: escrow-style advance → clear state → projected settlement → optional reserve → verified record buyers can trust.",
  "pitch.stepSnapshot": "Snapshot",
  "pitch.stepOrders": "Orders",
  "pitch.stepReserve": "Reserve",
  "pitch.stepProof": "Proof",
  "pitch.walletHint": "The first thing a weaver (or judge) should understand.",
  "pitch.ordersHint":
    "Walk each order’s state. Demo button advances the happy path for the pitch.",
  "pitch.noOrders": "No orders yet. Simulated buyer posts live in the Buyer Portal.",
  "pitch.reserveTitle": "Step 3 · Steady income wallet",
  "pitch.reserveHint":
    "Optional for the pitch: rule-based reserve when a month is above your usual settlement average.",
  "pitch.proofTitle": "Step 4 · Verified transaction record",
  "pitch.proofHint": "Shareable proof buyers can trust — simulated for the demo.",
  "pitch.show": "Show",
  "pitch.hide": "Hide",
  "pitch.ordersEyebrow": "Orders · 2nd tab · buyer demand feed",
  "pitch.ordersOneLiner":
    "Pitch beat: see work coming first — same simulated buyer posts the Buyer Portal publishes, then move to Plan for when to start.",
  "pitch.openBuyerPortal": "Open Buyer Portal",
  "pitch.openBuyerPortalHint":
    "Login as Saffron ({phone1}) or Festival ({phone2}) — simulated desks.",
  "pitch.simulatedBuyer": "Simulated buyer",
  "pitch.paymentNote":
    "This flow does not move real money and is not a licensed financial product. It is modeled on an RBI-authorised payment aggregator's escrow settlement pattern. Real deployment needs a licensed-aggregator partnership. This is not legal advice.",
  "state.order_created": "Order placed",
  "state.advance_requested": "Advance asked for",
  "state.advance_paid_escrow_held": "Advance held for your order",
  "state.production_in_progress": "You are weaving",
  "state.dispatched": "Sent to buyer",
  "state.settlement_released": "Money released",
  "state.dispute_opened": "Question raised",
  "state.under_review": "Under review",
  "state.resolved": "Resolved",
  "stock.title": "Stock & resources",
  "stock.hint": "Yarn and finished pieces on hand — feeds today’s advice.",
  "stock.simNote": "Demo / Simulated inventory — edit for the pitch story.",
  "stock.yarnCotton": "Cotton yarn (kg)",
  "stock.yarnSilk": "Silk yarn (kg)",
  "stock.finishedCotton": "Finished cotton sarees",
  "stock.finishedSilk": "Finished silk sarees",
  "stock.finishedStole": "Finished stoles / dupattas",
  "stock.finishedDhoti": "Finished dhoti / angavastram",
  "stock.feedsEngine": "Changes nudge the decision engine on Home.",
  "engine.whyTags": "Why this recommendation",
  "engine.dailyTitle": "What should I do today?",
  "engine.dailyHint": "Daily action plan from market, business, and master-weaver signals.",
  "engine.fiveLabel": "Five daily questions",
  "engine.q1": "Demand",
  "engine.a1": "Do I have work coming?",
  "engine.q2": "Product",
  "engine.a2": "What should I weave next?",
  "engine.q3": "Timing",
  "engine.a3": "When should I start?",
  "engine.q4": "Money",
  "engine.a4": "When will I get paid?",
  "engine.q5": "Today",
  "engine.a5": "What should I do today?",
  "engine.chipHint":
    "Tap a question — then walk the tabs: Home → Orders → Plan → Money.",
};

const hi: ExtraCatalog = {
  ...en,
  "topbar.buyer": "खरीदार",
  "home.voiceNote":
    "अंग्रेज़ी डिफ़ॉल्ट भाषा है। मेनू से हिंदी या अन्य भाषा चुनें। आवाज़ क्रोम में सबसे अच्छी चलती है।",
  "home.scoreOf": "{score} में से 100",
  "home.advice":
    "अभी {category} आपका सबसे मज़बूत विकल्प लगता है (माँग स्कोर {score} / 100)। उत्पादन {when} शुरू करें।",
  "home.adviceFestival":
    "अभी {category} आपका सबसे मज़बूत विकल्प लगता है (माँग स्कोर {score} / 100)। {festival} से पहले माँग मज़बूत दिखती है। उत्पादन {when} शुरू करें।",
  "home.startReady": "जब आप तैयार हों",
  "home.start3days": "अगले तीन दिनों में",
  "home.start2weeks": "अगले दो हफ़्तों में",
  "home.startWeeks": "आने वाले हफ़्तों में",
  "home.whyTotal": "कुल = {score}/100",
  "cat.cotton-saree": "सूती साड़ी",
  "cat.silk-saree": "रेशमी साड़ी (ज़री / जटिल)",
  "cat.stole-dupatta": "स्टोल / दुपट्टा",
  "cat.dhoti-angavastram": "धोती / अंगवस्त्रम",
  "festival.nearby": "नज़दीकी त्योहार सीज़न (नमूना)",
  "festival.later": "बाद का त्योहार सीज़न (नमूना)",
  "pitch.planEyebrow": "योजना · उल्टी उत्पादन समयरेखा",
  "pitch.planBody":
    "क्या बुनेंगे और कब तैयार चाहिए चुनें। LoomOS कैलेंडर पीछे से जोड़ता है — सूत कब खरीदें और पैसे कब मिल सकते हैं।",
  "pitch.planOneLiner":
    "एक पंक्ति में: खरीदार/त्योहार तिथि → शुरू तिथि → सूत तिथि → अनुमानित भुगतान — टू-डू लिस्ट नहीं, निर्णय समयरेखा।",
  "pitch.stepWhat": "क्या",
  "pitch.stepWhen": "कब",
  "pitch.stepDates": "आपकी तिथियाँ",
  "pitch.stepTune": "समायोजन",
  "pitch.buyerNeeds": "सिम्युलेटेड खरीदार ज़रूरतें (वैकल्पिक)",
  "pitch.buyerNeedsHint":
    "तैयार तिथि सेट करने के लिए खरीदार पोस्ट पर टैप करें — वही डेटा Buyer Portal में है।",
  "pitch.buyerNeedsLine": "{category} · {qty} पीस · {date} तक तैयार",
  "pitch.buyerPortal": "खरीदार पोर्टल",
  "pitch.whatHint": "एक विकल्प — नीचे के दिन इसी वस्तु की बुनाई लंबाई से हैं।",
  "pitch.datesTitle": "आपकी तिथियाँ — पिच का मुख्य पल",
  "pitch.datesBody":
    "यही स्पष्ट जवाब है: सूत कब खरीदें, कब शुरू/खत्म करें, और पैसे कब अनुमानित हैं।",
  "pitch.moneyEyebrow": "पैसे · सिम्युलेटेड एस्क्रो कहानी",
  "pitch.moneyBody":
    "हर भुगतान कहाँ है देखें — एडवांस होल्ड, अगला अनुमानित सेटलमेंट, फिर रिज़र्व और साझा करने योग्य प्रमाण।",
  "pitch.moneyOneLiner":
    "एक पंक्ति में: एस्क्रो एडवांस → साफ़ स्थिति → अनुमानित सेटलमेंट → वैकल्पिक रिज़र्व → खरीदार भरोसे वाला रिकॉर्ड।",
  "pitch.stepSnapshot": "झलक",
  "pitch.stepOrders": "ऑर्डर",
  "pitch.stepReserve": "रिज़र्व",
  "pitch.stepProof": "प्रमाण",
  "pitch.walletHint": "बुनकर (या जज) को सबसे पहले यही समझना चाहिए।",
  "pitch.ordersHint":
    "हर ऑर्डर की स्थिति देखें। डेमो बटन पिच के लिए खुशहाल रास्ता आगे बढ़ाता है।",
  "pitch.noOrders": "अभी कोई ऑर्डर नहीं। सिम्युलेटेड खरीदार पोस्ट Buyer Portal में हैं।",
  "pitch.reserveTitle": "चरण 3 · स्थिर आय वॉलेट",
  "pitch.reserveHint":
    "पिच के लिए वैकल्पिक: जब महीना सामान्य औसत से ऊपर हो तो नियम-आधारित रिज़र्व।",
  "pitch.proofTitle": "चरण 4 · सत्यापित लेन-देन रिकॉर्ड",
  "pitch.proofHint": "खरीदार भरोसे के लिए साझा प्रमाण — डेमो में सिम्युलेटेड।",
  "pitch.show": "दिखाएँ",
  "pitch.hide": "छिपाएँ",
  "pitch.ordersEyebrow": "ऑर्डर · खरीदार माँग फ़ीड",
  "pitch.ordersOneLiner":
    "Buyer Portal की वही सिम्युलेटेड पोस्ट — होम पर आज की सलाह भी इन्हीं से चलती है।",
  "pitch.openBuyerPortal": "खरीदार पोर्टल खोलें",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) या Festival ({phone2}) से लॉगिन करें — सिम्युलेटेड डेस्क।",
  "pitch.simulatedBuyer": "सिम्युलेटेड खरीदार",
  "pitch.paymentNote":
    "यह प्रवाह असली पैसे नहीं भेजता और लाइसेंस प्राप्त वित्तीय उत्पाद नहीं है। यह RBI-अधिकृत पेमेंट एग्रीगेटर एस्क्रो पैटर्न पर आधारित मॉडल है। असली तैनाती के लिए लाइसेंस पार्टनरशिप ज़रूरी है। यह कानूनी सलाह नहीं है।",
  "state.order_created": "ऑर्डर लगा",
  "state.advance_requested": "एडवांस माँगा गया",
  "state.advance_paid_escrow_held": "आपके ऑर्डर पर एडवांस होल्ड",
  "state.production_in_progress": "आप बुन रहे हैं",
  "state.dispatched": "खरीदार को भेजा",
  "state.settlement_released": "पैसे जारी",
  "state.dispute_opened": "सवाल उठा",
  "state.under_review": "जाँच में",
  "state.resolved": "हल हुआ",
};

/** Tamil — complete pitch chrome */
const ta: ExtraCatalog = {
  ...en,
  "topbar.buyer": "வாங்குபவர்",
  "home.voiceNote":
    "ஆங்கிலம் இயல்புநிலை. மெனுவில் பிற மொழிகளைத் தேர்ந்தெடுக்கவும். குரல் Chrome-இல் சிறந்தது.",
  "home.scoreOf": "100-இல் {score}",
  "home.advice":
    "இப்போது {category} உங்கள் வலுவான தேர்வாகத் தெரிகிறது (தேவை மதிப்பெண் {score}/100). உற்பத்தியை {when} தொடங்குங்கள்.",
  "home.adviceFestival":
    "இப்போது {category} உங்கள் வலுவான தேர்வாகத் தெரிகிறது (தேவை மதிப்பெண் {score}/100). {festival}-க்கு முன் தேவை வலுவாக உள்ளது. உற்பத்தியை {when} தொடங்குங்கள்.",
  "home.startReady": "நீங்கள் தயாரானதும்",
  "home.start3days": "அடுத்த மூன்று நாட்களில்",
  "home.start2weeks": "அடுத்த இரண்டு வாரங்களில்",
  "home.startWeeks": "வரும் வாரங்களில்",
  "home.whyTotal": "மொத்தம் = {score}/100",
  "cat.cotton-saree": "பருத்தி புடவை",
  "cat.silk-saree": "பட்டு புடவை (ஜரி / சிக்கலான)",
  "cat.stole-dupatta": "ஸ்டோல் / துப்பட்டா",
  "cat.dhoti-angavastram": "வேட்டி / அங்கவஸ்திரம்",
  "festival.nearby": "அருகிலுள்ள திருவிழா காலம் (மாதிரி)",
  "festival.later": "பிந்தைய திருவிழா காலம் (மாதிரி)",
  "pitch.planEyebrow": "திட்டம் · பின்னோக்கிய உற்பத்தி",
  "pitch.planBody":
    "என்ன நெசவு செய்வீர்கள், எப்போது தயாராக வேண்டும் என்பதைத் தேர்வு செய்க. நூல் வாங்கும் நாள் மற்றும் பணம் வரும் நாளை LoomOS கணக்கிடும்.",
  "pitch.planOneLiner":
    "ஒரு வரியில்: வாங்குநர்/திருவிழா தேதி → தொடக்கம் → நூல் → எதிர்பார்க்கும் பணம்.",
  "pitch.stepWhat": "என்ன",
  "pitch.stepWhen": "எப்போது",
  "pitch.stepDates": "உங்கள் தேதிகள்",
  "pitch.stepTune": "சரிசெய்தல்",
  "pitch.buyerNeeds": "உருவக வாங்குநர் தேவைகள் (விருப்பம்)",
  "pitch.buyerNeedsHint": "தயார் தேதியை அமைக்க வாங்குநர் இடுகையைத் தட்டவும்.",
  "pitch.buyerNeedsLine": "{category} · {qty} எண்ணிக்கை · {date} தயார்",
  "pitch.buyerPortal": "வாங்குநர் போர்டல்",
  "pitch.whatHint": "ஒரு தேர்வு — கீழே உள்ள நாட்கள் இந்தப் பொருளின் நெசவு நீளம்.",
  "pitch.datesTitle": "உங்கள் தேதிகள் — முக்கிய தருணம்",
  "pitch.datesBody":
    "நூல் எப்போது, தொடக்கம்/முடிவு எப்போது, பணம் எப்போது என்பதே விளக்கமான பதில்.",
  "pitch.moneyEyebrow": "பணம் · உருவக எஸ்க்ரோ கதை",
  "pitch.moneyBody":
    "ஒவ்வொரு பணமும் எங்கே உள்ளது பாருங்கள் — முன்பணம், அடுத்த தீர்வு, இருப்பு, சான்று.",
  "pitch.moneyOneLiner":
    "ஒரு வரியில்: எஸ்க்ரோ முன்பணம் → தெளிவான நிலை → தீர்வு → இருப்பு → நம்பகப் பதிவு.",
  "pitch.stepSnapshot": "சுருக்கம்",
  "pitch.stepOrders": "ஆர்டர்கள்",
  "pitch.stepReserve": "இருப்பு",
  "pitch.stepProof": "சான்று",
  "pitch.walletHint": "நெசவாளர் முதலில் புரிந்துகொள்ள வேண்டியது.",
  "pitch.ordersHint": "ஒவ்வொரு ஆர்டர் நிலையையும் பாருங்கள்.",
  "pitch.noOrders": "ஆர்டர்கள் இல்லை. உருவக வாங்குநர் இடுகைகள் Buyer Portal-இல்.",
  "pitch.reserveTitle": "படி 3 · நிலையான வருமான பணப்பை",
  "pitch.reserveHint": "சராசரிக்கு மேல் இருக்கும் மாதத்திற்கு விதி அடிப்படை இருப்பு.",
  "pitch.proofTitle": "படி 4 · சரிபார்க்கப்பட்ட பரிவர்த்தனை பதிவு",
  "pitch.proofHint": "வாங்குநர்கள் நம்பக்கூடிய பகிரத்தக்க சான்று — டெமோவில் உருவகம்.",
  "pitch.show": "காட்டு",
  "pitch.hide": "மறை",
  "pitch.ordersEyebrow": "ஆர்டர்கள் · வாங்குநர் தேவை ஊட்டம்",
  "pitch.ordersOneLiner":
    "Buyer Portal வெளியிடும் அதே உருவக இடுகைகள் — இன்றைய ஆலோசனையும் இவற்றால்.",
  "pitch.openBuyerPortal": "வாங்குநர் போர்டல் திற",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) அல்லது Festival ({phone2}) — உருவக மேசைகள்.",
  "pitch.simulatedBuyer": "உருவக வாங்குநர்",
  "pitch.paymentNote":
    "இந்த ஓட்டம் உண்மையான பணத்தை நகர்த்தாது. RBI அனுமதி பெற்ற கட்டண ஒருங்கிணைப்பாளர் எஸ்க்ரோ முறையை அடிப்படையாகக் கொண்ட மாதிரி. இது சட்ட ஆலோசனை அல்ல.",
  "state.order_created": "ஆர்டர் வைக்கப்பட்டது",
  "state.advance_requested": "முன்பணம் கேட்கப்பட்டது",
  "state.advance_paid_escrow_held": "உங்கள் ஆர்டருக்கு முன்பணம் பிடிக்கப்பட்டது",
  "state.production_in_progress": "நீங்கள் நெசவு செய்கிறீர்கள்",
  "state.dispatched": "வாங்குநருக்கு அனுப்பப்பட்டது",
  "state.settlement_released": "பணம் வெளியிடப்பட்டது",
  "state.dispute_opened": "கேள்வி எழுப்பப்பட்டது",
  "state.under_review": "ஆய்வில்",
  "state.resolved": "தீர்க்கப்பட்டது",
};

const te: ExtraCatalog = {
  ...en,
  "topbar.buyer": "కొనుగోలుదారు",
  "home.voiceNote":
    "ఇంగ్లీష్ డిఫాల్ట్. మెనూ నుండి ఇతర భాషలు ఎంచుకోండి. వాయిస్ Chromeలో బాగుంటుంది.",
  "home.scoreOf": "100లో {score}",
  "home.advice":
    "ఇప్పుడు {category} మీ బలమైన ఎంపిక (డిమాండ్ స్కోర్ {score}/100). ఉత్పత్తిని {when} ప్రారంభించండి.",
  "home.adviceFestival":
    "ఇప్పుడు {category} మీ బలమైన ఎంపిక (డిమాండ్ స్కోర్ {score}/100). {festival} ముందు డిమాండ్ బలంగా ఉంది. ఉత్పత్తిని {when} ప్రారంభించండి.",
  "home.startReady": "మీరు సిద్ధమైనప్పుడు",
  "home.start3days": "తర్వాతి మూడు రోజుల్లో",
  "home.start2weeks": "తర్వాతి రెండు వారాల్లో",
  "home.startWeeks": "రాబోయే వారాల్లో",
  "home.whyTotal": "మొత్తం = {score}/100",
  "cat.cotton-saree": "పత్తి చీర",
  "cat.silk-saree": "పట్టు చీర (జరీ / సంక్లిష్టం)",
  "cat.stole-dupatta": "స్టోల్ / దుప్పట్టా",
  "cat.dhoti-angavastram": "ధోతి / అంగవస్త్రం",
  "festival.nearby": "సమీప పండుగ సీజన్ (నమూనా)",
  "festival.later": "తర్వాతి పండుగ సీజన్ (నమూనా)",
  "pitch.planEyebrow": "ప్లాన్ · రివర్స్ ప్రొడక్షన్",
  "pitch.planBody":
    "ఏమి నేస్తారు, ఎప్పటికి సిద్ధం కావాలో ఎంచుకోండి. నూలు మరియు డబ్బు తేదీలను LoomOS లెక్కిస్తుంది.",
  "pitch.planOneLiner":
    "ఒక వాక్యం: కొనుగోలుదారు/పండుగ తేదీ → ప్రారంభం → నూలు → అంచనా చెల్లింపు.",
  "pitch.stepWhat": "ఏమి",
  "pitch.stepWhen": "ఎప్పుడు",
  "pitch.stepDates": "మీ తేదీలు",
  "pitch.stepTune": "సర్దుబాటు",
  "pitch.buyerNeeds": "సిమ్యులేటెడ్ కొనుగోలుదారు అవసరాలు",
  "pitch.buyerNeedsHint": "సిద్ధ తేదీ సెట్ చేయడానికి కొనుగోలుదారు పోస్ట్‌ను టాప్ చేయండి.",
  "pitch.buyerNeedsLine": "{category} · {qty} pcs · {date} సిద్ధం",
  "pitch.buyerPortal": "కొనుగోలుదారు పోర్టల్",
  "pitch.whatHint": "ఒక ఎంపిక — కింది రోజులు ఈ వస్తువు నేత పొడవు.",
  "pitch.datesTitle": "మీ తేదీలు — ప్రధాన క్షణం",
  "pitch.datesBody": "నూలు, ప్రారంభం/ముగింపు, డబ్బు — వివరణాత్మక సమాధానం.",
  "pitch.moneyEyebrow": "డబ్బు · సిమ్యులేటెడ్ ఎస్క్రో కథ",
  "pitch.moneyBody":
    "ప్రతి చెల్లింపు ఎక్కడ ఉందో చూడండి — అడ్వాన్స్, సెటిల్మెంట్, రిజర్వ్, ప్రూఫ్.",
  "pitch.moneyOneLiner":
    "ఒక వాక్యం: ఎస్క్రో అడ్వాన్స్ → స్పష్ట స్థితి → సెటిల్మెంట్ → రిజర్వ్ → నమ్మకమైన రికార్డ్.",
  "pitch.stepSnapshot": "స్నాప్‌షాట్",
  "pitch.stepOrders": "ఆర్డర్లు",
  "pitch.stepReserve": "రిజర్వ్",
  "pitch.stepProof": "ప్రూఫ్",
  "pitch.walletHint": "నేతగాడు మొదట అర్థం చేసుకోవాల్సింది.",
  "pitch.ordersHint": "ప్రతి ఆర్డర్ స్థితిని చూడండి.",
  "pitch.noOrders": "ఆర్డర్లు లేవు. సిమ్యులేటెడ్ పోస్టులు Buyer Portalలో.",
  "pitch.reserveTitle": "దశ 3 · స్థిర ఆదాయ వాలెట్",
  "pitch.reserveHint": "సగటు కంటే ఎక్కువ నెలకు నియమ-ఆధారిత రిజర్వ్.",
  "pitch.proofTitle": "దశ 4 · ధృవీకరించిన లావాదేవీ రికార్డ్",
  "pitch.proofHint": "కొనుగోలుదారులు నమ్మే షేరబుల్ ప్రూఫ్ — డెమోలో సిమ్యులేటెడ్.",
  "pitch.show": "చూపించు",
  "pitch.hide": "దాచు",
  "pitch.ordersEyebrow": "ఆర్డర్లు · కొనుగోలుదారు డిమాండ్ ఫీడ్",
  "pitch.ordersOneLiner":
    "Buyer Portal పోస్టులే — హోమ్‌లోని నేటి సలహాకు కూడా ఇవే.",
  "pitch.openBuyerPortal": "కొనుగోలుదారు పోర్టల్ తెరవండి",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) లేదా Festival ({phone2}) — సిమ్యులేటెడ్ డెస్క్‌లు.",
  "pitch.simulatedBuyer": "సిమ్యులేటెడ్ కొనుగోలుదారు",
  "pitch.paymentNote":
    "ఇది నిజమైన డబ్బును కదపదు. RBI అనుమతి పొందిన పేమెంట్ అగ్రిగేటర్ ఎస్క్రో నమూనా. ఇది చట్టపరమైన సలహా కాదు.",
  "state.order_created": "ఆర్డర్ పెట్టారు",
  "state.advance_requested": "అడ్వాన్స్ అడిగారు",
  "state.advance_paid_escrow_held": "మీ ఆర్డర్‌పై అడ్వాన్స్ హోల్డ్",
  "state.production_in_progress": "మీరు నేస్తున్నారు",
  "state.dispatched": "కొనుగోలుదారుకు పంపారు",
  "state.settlement_released": "డబ్బు విడుదల",
  "state.dispute_opened": "ప్రశ్న వేశారు",
  "state.under_review": "సమీక్షలో",
  "state.resolved": "పరిష్కరించబడింది",
};

const kn: ExtraCatalog = {
  ...en,
  "topbar.buyer": "ಖರೀದಿದಾರ",
  "home.voiceNote":
    "ಇಂಗ್ಲಿಷ್ ಡೀಫಾಲ್ಟ್. ಮೆನುವಿನಿಂದ ಇತರ ಭಾಷೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಧ್ವನಿ Chromeನಲ್ಲಿ ಉತ್ತಮ.",
  "home.scoreOf": "100ರಲ್ಲಿ {score}",
  "home.advice":
    "ಈಗ {category} ನಿಮ್ಮ ಬಲವಾದ ಆಯ್ಕೆ (ಬೇಡಿಕೆ ಅಂಕ {score}/100). ಉತ್ಪಾದನೆಯನ್ನು {when} ಪ್ರಾರಂಭಿಸಿ.",
  "home.adviceFestival":
    "ಈಗ {category} ನಿಮ್ಮ ಬಲವಾದ ಆಯ್ಕೆ (ಬೇಡಿಕೆ ಅಂಕ {score}/100). {festival} ಮೊದಲು ಬೇಡಿಕೆ ಬಲವಾಗಿದೆ. ಉತ್ಪಾದನೆಯನ್ನು {when} ಪ್ರಾರಂಭಿಸಿ.",
  "home.startReady": "ನೀವು ಸಿದ್ಧರಾದಾಗ",
  "home.start3days": "ಮುಂದಿನ ಮೂರು ದಿನಗಳಲ್ಲಿ",
  "home.start2weeks": "ಮುಂದಿನ ಎರಡು ವಾರಗಳಲ್ಲಿ",
  "home.startWeeks": "ಮುಂಬರುವ ವಾರಗಳಲ್ಲಿ",
  "home.whyTotal": "ಒಟ್ಟು = {score}/100",
  "cat.cotton-saree": "ಹತ್ತಿ ಸೀರೆ",
  "cat.silk-saree": "ರೇಷ್ಮೆ ಸೀರೆ (ಜರಿ / ಸಂಕೀರ್ಣ)",
  "cat.stole-dupatta": "ಸ್ಟೋಲ್ / ದುಪಟ್ಟಾ",
  "cat.dhoti-angavastram": "ಧೋತಿ / ಅಂಗವಸ್ತ್ರ",
  "festival.nearby": "ಹತ್ತಿರದ ಹಬ್ಬದ ಋತು (ಮಾದರಿ)",
  "festival.later": "ನಂತರದ ಹಬ್ಬದ ಋತು (ಮಾದರಿ)",
  "pitch.planEyebrow": "ಯೋಜನೆ · ರಿವರ್ಸ್ ಉತ್ಪಾದನೆ",
  "pitch.planBody":
    "ಏನು ನೇಯುವಿರಿ, ಯಾವಾಗ ಸಿದ್ಧವಾಗಬೇಕು ಆಯ್ಕೆಮಾಡಿ. ನೂಲು ಮತ್ತು ಹಣದ ದಿನಾಂಕಗಳನ್ನು LoomOS ಲೆಕ್ಕಹಾಕುತ್ತದೆ.",
  "pitch.planOneLiner":
    "ಒಂದು ಸಾಲು: ಖರೀದಿದಾರ/ಹಬ್ಬ ದಿನಾಂಕ → ಪ್ರಾರಂಭ → ನೂಲು → ಅಂದಾಜು ಪಾವತಿ.",
  "pitch.stepWhat": "ಏನು",
  "pitch.stepWhen": "ಯಾವಾಗ",
  "pitch.stepDates": "ನಿಮ್ಮ ದಿನಾಂಕಗಳು",
  "pitch.stepTune": "ಹೊಂದಾಣಿಕೆ",
  "pitch.buyerNeeds": "ಸಿಮ್ಯುಲೇಟೆಡ್ ಖರೀದಿದಾರ ಅಗತ್ಯಗಳು",
  "pitch.buyerNeedsHint": "ಸಿದ್ಧ ದಿನಾಂಕ ಹೊಂದಿಸಲು ಖರೀದಿದಾರ ಪೋಸ್ಟ್ ಟ್ಯಾಪ್ ಮಾಡಿ.",
  "pitch.buyerNeedsLine": "{category} · {qty} pcs · {date} ಸಿದ್ಧ",
  "pitch.buyerPortal": "ಖರೀದಿದಾರ ಪೋರ್ಟಲ್",
  "pitch.whatHint": "ಒಂದು ಆಯ್ಕೆ — ಕೆಳಗಿನ ದಿನಗಳು ಈ ವಸ್ತುವಿನ ನೇಯ್ಗೆ ಉದ್ದ.",
  "pitch.datesTitle": "ನಿಮ್ಮ ದಿನಾಂಕಗಳು — ಮುಖ್ಯ ಕ್ಷಣ",
  "pitch.datesBody": "ನೂಲು, ಪ್ರಾರಂಭ/ಮುಕ್ತಾಯ, ಹಣ — ವಿವರಣಾತ್ಮಕ ಉತ್ತರ.",
  "pitch.moneyEyebrow": "ಹಣ · ಸಿಮ್ಯುಲೇಟೆಡ್ ಎಸ್ಕ್ರೋ ಕಥೆ",
  "pitch.moneyBody":
    "ಪ್ರತಿ ಪಾವತಿ ಎಲ್ಲಿದೆ ನೋಡಿ — ಅಡ್ವಾನ್ಸ್, ಸೆಟಲ್ಮೆಂಟ್, ರಿಸರ್ವ್, ಪುರಾವೆ.",
  "pitch.moneyOneLiner":
    "ಒಂದು ಸಾಲು: ಎಸ್ಕ್ರೋ ಅಡ್ವಾನ್ಸ್ → ಸ್ಪಷ್ಟ ಸ್ಥಿತಿ → ಸೆಟಲ್ಮೆಂಟ್ → ರಿಸರ್ವ್ → ನಂಬಿಕೆಯ ದಾಖಲೆ.",
  "pitch.stepSnapshot": "ಸ್ನ್ಯಾಪ್‌ಶಾಟ್",
  "pitch.stepOrders": "ಆರ್ಡರ್‌ಗಳು",
  "pitch.stepReserve": "ರಿಸರ್ವ್",
  "pitch.stepProof": "ಪುರಾವೆ",
  "pitch.walletHint": "ನೇಕಾರ ಮೊದಲು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬೇಕಾದುದು.",
  "pitch.ordersHint": "ಪ್ರತಿ ಆರ್ಡರ್ ಸ್ಥಿತಿ ನೋಡಿ.",
  "pitch.noOrders": "ಆರ್ಡರ್‌ಗಳಿಲ್ಲ. ಸಿಮ್ಯುಲೇಟೆಡ್ ಪೋಸ್ಟ್‌ಗಳು Buyer Portalನಲ್ಲಿ.",
  "pitch.reserveTitle": "ಹಂತ 3 · ಸ್ಥಿರ ಆದಾಯ ವ್ಯಾಲೆಟ್",
  "pitch.reserveHint": "ಸರಾಸರಿಗಿಂತ ಹೆಚ್ಚಿನ ತಿಂಗಳಿಗೆ ನಿಯಮ-ಆಧಾರಿತ ರಿಸರ್ವ್.",
  "pitch.proofTitle": "ಹಂತ 4 · ಪರಿಶೀಲಿತ ವಹಿವಾಟು ದಾಖಲೆ",
  "pitch.proofHint": "ಖರೀದಿದಾರರು ನಂಬುವ ಹಂಚಿಕೊಳ್ಳಬಹುದಾದ ಪುರಾವೆ — ಡೆಮೋದಲ್ಲಿ ಸಿಮ್ಯುಲೇಟೆಡ್.",
  "pitch.show": "ತೋರಿಸು",
  "pitch.hide": "ಮರೆಮಾಡು",
  "pitch.ordersEyebrow": "ಆರ್ಡರ್‌ಗಳು · ಖರೀದಿದಾರ ಬೇಡಿಕೆ ಫೀಡ್",
  "pitch.ordersOneLiner":
    "Buyer Portalನ ಅದೇ ಸಿಮ್ಯುಲೇಟೆಡ್ ಪೋಸ್ಟ್‌ಗಳು — ಮನೆಯ ಇಂದಿನ ಸಲಹೆಗೂ ಇವೇ.",
  "pitch.openBuyerPortal": "ಖರೀದಿದಾರ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) ಅಥವಾ Festival ({phone2}) — ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೆಸ್ಕ್‌ಗಳು.",
  "pitch.simulatedBuyer": "ಸಿಮ್ಯುಲೇಟೆಡ್ ಖರೀದಿದಾರ",
  "pitch.paymentNote":
    "ಇದು ನಿಜವಾದ ಹಣವನ್ನು ಚಲಾಯಿಸುವುದಿಲ್ಲ. RBI ಅಧಿಕೃತ ಪಾವತಿ ಅಗ್ರಿಗೇಟರ್ ಎಸ್ಕ್ರೋ ಮಾದರಿ. ಇದು ಕಾನೂನು ಸಲಹೆಯಲ್ಲ.",
  "state.order_created": "ಆರ್ಡರ್ ಇಡಲಾಗಿದೆ",
  "state.advance_requested": "ಅಡ್ವಾನ್ಸ್ ಕೇಳಲಾಗಿದೆ",
  "state.advance_paid_escrow_held": "ನಿಮ್ಮ ಆರ್ಡರ್‌ಗೆ ಅಡ್ವಾನ್ಸ್ ಹೋಲ್ಡ್",
  "state.production_in_progress": "ನೀವು ನೇಯುತ್ತಿದ್ದೀರಿ",
  "state.dispatched": "ಖರೀದಿದಾರರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ",
  "state.settlement_released": "ಹಣ ಬಿಡುಗಡೆ",
  "state.dispute_opened": "ಪ್ರಶ್ನೆ ಎತ್ತಲಾಗಿದೆ",
  "state.under_review": "ಪರಿಶೀಲನೆಯಲ್ಲಿ",
  "state.resolved": "ಪರಿಹರಿಸಲಾಗಿದೆ",
};

const bn: ExtraCatalog = {
  ...en,
  "topbar.buyer": "ক্রেতা",
  "home.voiceNote":
    "ইংরেজি ডিফল্ট। মেনু থেকে অন্য ভাষা বেছে নিন। ভয়েস Chrome-এ ভালো কাজ করে।",
  "home.scoreOf": "১০০-এর মধ্যে {score}",
  "home.advice":
    "এখন {category} আপনার সবচেয়ে শক্তিশালী পছন্দ (চাহিদা স্কোর {score}/100)। উৎপাদন {when} শুরু করুন।",
  "home.adviceFestival":
    "এখন {category} আপনার সবচেয়ে শক্তিশালী পছন্দ (চাহিদা স্কোর {score}/100)। {festival}-এর আগে চাহিদা শক্তিশালী। উৎপাদন {when} শুরু করুন।",
  "home.startReady": "আপনি প্রস্তুত হলে",
  "home.start3days": "পরের তিন দিনে",
  "home.start2weeks": "পরের দুই সপ্তাহে",
  "home.startWeeks": "আসন্ন সপ্তাহগুলোতে",
  "home.whyTotal": "মোট = {score}/100",
  "cat.cotton-saree": "সুতি শাড়ি",
  "cat.silk-saree": "সিল্ক শাড়ি (জরি / জটিল)",
  "cat.stole-dupatta": "স্টোল / ওড়না",
  "cat.dhoti-angavastram": "ধুতি / অঙ্গবস্ত্র",
  "festival.nearby": "কাছের উৎসব মৌসুম (নমুনা)",
  "festival.later": "পরের উৎসব মৌসুম (নমুনা)",
  "pitch.planEyebrow": "পরিকল্পনা · উল্টো উৎপাদন",
  "pitch.planBody":
    "কী বুনবেন ও কখন তৈরি চাই বেছে নিন। সুতো ও টাকার তারিখ LoomOS হিসাব করে।",
  "pitch.planOneLiner":
    "এক লাইনে: ক্রেতা/উৎসব তারিখ → শুরু → সুতো → আনুমানিক পেমেন্ট।",
  "pitch.stepWhat": "কী",
  "pitch.stepWhen": "কখন",
  "pitch.stepDates": "আপনার তারিখ",
  "pitch.stepTune": "সমন্বয়",
  "pitch.buyerNeeds": "সিমুলেটেড ক্রেতার চাহিদা",
  "pitch.buyerNeedsHint": "তৈরি তারিখ সেট করতে ক্রেতার পোস্টে ট্যাপ করুন।",
  "pitch.buyerNeedsLine": "{category} · {qty} পিস · {date} তৈরি",
  "pitch.buyerPortal": "ক্রেতা পোর্টাল",
  "pitch.whatHint": "একটি পছন্দ — নিচের দিনগুলো এই পণ্যের বুনন দৈর্ঘ্য।",
  "pitch.datesTitle": "আপনার তারিখ — মূল মুহূর্ত",
  "pitch.datesBody": "সুতো, শুরু/শেষ, টাকা — ব্যাখ্যাযোগ্য উত্তর।",
  "pitch.moneyEyebrow": "টাকা · সিমুলেটেড এসক্রো গল্প",
  "pitch.moneyBody":
    "প্রতিটি পেমেন্ট কোথায় দেখুন — অগ্রিম, সেটেলমেন্ট, রিজার্ভ, প্রমাণ।",
  "pitch.moneyOneLiner":
    "এক লাইনে: এসক্রো অগ্রিম → স্পষ্ট অবস্থা → সেটেলমেন্ট → রিজার্ভ → বিশ্বস্ত রেকর্ড।",
  "pitch.stepSnapshot": "স্ন্যাপশট",
  "pitch.stepOrders": "অর্ডার",
  "pitch.stepReserve": "রিজার্ভ",
  "pitch.stepProof": "প্রমাণ",
  "pitch.walletHint": "তাঁতি প্রথমে যা বোঝেন।",
  "pitch.ordersHint": "প্রতিটি অর্ডারের অবস্থা দেখুন।",
  "pitch.noOrders": "অর্ডার নেই। সিমুলেটেড পোস্ট Buyer Portal-এ।",
  "pitch.reserveTitle": "ধাপ ৩ · স্থিতিশীল আয় ওয়ালেট",
  "pitch.reserveHint": "গড়ের উপরে মাসের জন্য নিয়মভিত্তিক রিজার্ভ।",
  "pitch.proofTitle": "ধাপ ৪ · যাচাইকৃত লেনদেনের রেকর্ড",
  "pitch.proofHint": "ক্রেতারা বিশ্বাস করে এমন শেয়ারযোগ্য প্রমাণ — ডেমোতে সিমুলেটেড।",
  "pitch.show": "দেখান",
  "pitch.hide": "লুকান",
  "pitch.ordersEyebrow": "অর্ডার · ক্রেতার চাহিদা ফিড",
  "pitch.ordersOneLiner":
    "Buyer Portal-এর একই সিমুলেটেড পোস্ট — হোমের আজকের পরামর্শও এগুলো দিয়ে।",
  "pitch.openBuyerPortal": "ক্রেতা পোর্টাল খুলুন",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) বা Festival ({phone2}) — সিমুলেটেড ডেস্ক।",
  "pitch.simulatedBuyer": "সিমুলেটেড ক্রেতা",
  "pitch.paymentNote":
    "এই প্রবাহ আসল টাকা চালায় না। RBI-অনুমোদিত পেমেন্ট অ্যাগ্রিগেটর এসক্রো মডেল। এটি আইনি পরামর্শ নয়।",
  "state.order_created": "অর্ডার দেওয়া হয়েছে",
  "state.advance_requested": "অগ্রিম চাওয়া হয়েছে",
  "state.advance_paid_escrow_held": "আপনার অর্ডারে অগ্রিম হোল্ড",
  "state.production_in_progress": "আপনি বুনছেন",
  "state.dispatched": "ক্রেতার কাছে পাঠানো",
  "state.settlement_released": "টাকা ছাড়া হয়েছে",
  "state.dispute_opened": "প্রশ্ন তোলা হয়েছে",
  "state.under_review": "পর্যালোচনায়",
  "state.resolved": "সমাধান হয়েছে",
};

const as: ExtraCatalog = {
  ...en,
  "topbar.buyer": "ক্ৰেতা",
  "home.voiceNote":
    "ইংৰাজী ডিফ'ল্ট। মেনুৰ পৰা অন্য ভাষা বাছক। ভইচ Chromeত ভালকৈ চলে।",
  "home.scoreOf": "১০০ৰ ভিতৰত {score}",
  "home.advice":
    "এতিয়া {category} আপোনাৰ সবলতম বিকল্প (চাহিদা স্ক'ৰ {score}/100)। উৎপাদন {when} আৰম্ভ কৰক।",
  "home.adviceFestival":
    "এতিয়া {category} আপোনাৰ সবলতম বিকল্প (চাহিদা স্ক'ৰ {score}/100)। {festival}ৰ আগতে চাহিদা সবল। উৎপাদন {when} আৰম্ভ কৰক।",
  "home.startReady": "আপুনি সাজু হ'লে",
  "home.start3days": "পিছৰ তিনি দিনত",
  "home.start2weeks": "পিছৰ দুই সপ্তাহত",
  "home.startWeeks": "আহি থকা সপ্তাহবোৰত",
  "home.whyTotal": "মুঠ = {score}/100",
  "cat.cotton-saree": "কপাহী শাৰী",
  "cat.silk-saree": "ৰেচম শাৰী (জৰি / জটিল)",
  "cat.stole-dupatta": "ষ্টোল / ওড়না",
  "cat.dhoti-angavastram": "ধুতি / অংগবস্ত্ৰ",
  "festival.nearby": "কাষৰীয়া উৎসৱৰ সময় (নমুনা)",
  "festival.later": "পিছৰ উৎসৱৰ সময় (নমুনা)",
  "pitch.planEyebrow": "পৰিকল্পনা · উলটা উৎপাদন",
  "pitch.planBody":
    "কি বোৱা হ'ব আৰু কেতিয়া সাজু লাগে বাছক। সূতা আৰু টকাৰ তাৰিখ LoomOS গণনা কৰে।",
  "pitch.planOneLiner":
    "এটা শাৰীত: ক্ৰেতা/উৎসৱ তাৰিখ → আৰম্ভ → সূতা → আনুমানিক পেমেণ্ট।",
  "pitch.stepWhat": "কি",
  "pitch.stepWhen": "কেতিয়া",
  "pitch.stepDates": "আপোনাৰ তাৰিখ",
  "pitch.stepTune": "সমন্বয়",
  "pitch.buyerNeeds": "ছিমুলেটেড ক্ৰেতাৰ প্ৰয়োজন",
  "pitch.buyerNeedsHint": "সাজু তাৰিখ ছেট কৰিবলৈ ক্ৰেতাৰ পোষ্টত টিপক।",
  "pitch.buyerNeedsLine": "{category} · {qty} পিচ · {date} সাজু",
  "pitch.buyerPortal": "ক্ৰেতা প'ৰ্টেল",
  "pitch.whatHint": "এটা বাছনি — তলৰ দিনবোৰ এই বস্তুৰ বোৱা দৈৰ্ঘ্য।",
  "pitch.datesTitle": "আপোনাৰ তাৰিখ — মূল মুহূৰ্ত",
  "pitch.datesBody": "সূতা, আৰম্ভ/শেষ, টকা — ব্যাখ্যাযোগ্য উত্তৰ।",
  "pitch.moneyEyebrow": "টকা · ছিমুলেটেড এস্ক্ৰ' কাহিনী",
  "pitch.moneyBody":
    "প্ৰতিটো পেমেণ্ট ক'ত আছে চাওক — এডভান্স, চেটেলমেণ্ট, ৰিজাৰ্ভ, প্ৰমাণ।",
  "pitch.moneyOneLiner":
    "এটা শাৰীত: এস্ক্ৰ' এডভান্স → স্পষ্ট অৱস্থা → চেটেলমেণ্ট → ৰিজাৰ্ভ → বিশ্বাসযোগ্য ৰেকৰ্ড।",
  "pitch.stepSnapshot": "স্নেপশ্বট",
  "pitch.stepOrders": "অৰ্ডাৰ",
  "pitch.stepReserve": "ৰিজাৰ্ভ",
  "pitch.stepProof": "প্ৰমাণ",
  "pitch.walletHint": "বোৱাই প্ৰথমে বুজিবলগীয়া।",
  "pitch.ordersHint": "প্ৰতিটো অৰ্ডাৰৰ অৱস্থা চাওক।",
  "pitch.noOrders": "অৰ্ডাৰ নাই। ছিমুলেটেড পোষ্ট Buyer Portalত।",
  "pitch.reserveTitle": "পৰ্যায় ৩ · স্থিৰ আয় ৱালেট",
  "pitch.reserveHint": "গড়তকৈ ওপৰৰ মাহৰ বাবে নিয়মভিত্তিক ৰিজাৰ্ভ।",
  "pitch.proofTitle": "পৰ্যায় ৪ · প্ৰমাণিত লেনদেন ৰেকৰ্ড",
  "pitch.proofHint": "ক্ৰেতাই বিশ্বাস কৰা শ্বেয়াৰযোগ্য প্ৰমাণ — ডেমোত ছিমুলেটেড।",
  "pitch.show": "দেখুৱাওক",
  "pitch.hide": "লুকুৱাওক",
  "pitch.ordersEyebrow": "অৰ্ডাৰ · ক্ৰেতাৰ চাহিদা ফিড",
  "pitch.ordersOneLiner":
    "Buyer Portalৰ একে ছিমুলেটেড পোষ্ট — হোমৰ আজিৰ পৰামৰ্শো ইয়াৰে।",
  "pitch.openBuyerPortal": "ক্ৰেতা প'ৰ্টেল খোলক",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) বা Festival ({phone2}) — ছিমুলেটেড ডেস্ক।",
  "pitch.simulatedBuyer": "ছিমুলেটেড ক্ৰেতা",
  "pitch.paymentNote":
    "এই প্ৰবাহে প্ৰকৃত টকা নিচলায়। RBI-অনুমোদিত পেমেণ্ট এগ্ৰিগেটৰ এস্ক্ৰ' মডেল। ই আইনী পৰামৰ্শ নহয়।",
  "state.order_created": "অৰ্ডাৰ দিয়া হৈছে",
  "state.advance_requested": "এডভান্স খোজা হৈছে",
  "state.advance_paid_escrow_held": "আপোনাৰ অৰ্ডাৰত এডভান্স হোল্ড",
  "state.production_in_progress": "আপুনি বোৱাই আছে",
  "state.dispatched": "ক্ৰেতালৈ পঠোৱা",
  "state.settlement_released": "টকা মুকলি",
  "state.dispute_opened": "প্ৰশ্ন তোলা হৈছে",
  "state.under_review": "পৰ্যালোচনাত",
  "state.resolved": "সমাধান হৈছে",
};

export const EXTRA_CATALOGS: Record<LanguageCode, ExtraCatalog> = {
  en,
  hi,
  ta,
  te,
  kn,
  bn,
  as,
};

export function translateExtra(
  lang: LanguageCode,
  key: ExtraKey,
  vars?: Record<string, string | number>,
): string {
  let text =
    EXTRA_CATALOGS[lang]?.[key] ?? EXTRA_CATALOGS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}

const CAT_KEY: Record<string, ExtraKey> = {
  "cotton-saree": "cat.cotton-saree",
  "silk-saree": "cat.silk-saree",
  "stole-dupatta": "cat.stole-dupatta",
  "dhoti-angavastram": "cat.dhoti-angavastram",
  cotton: "cat.cotton-saree",
  silk: "cat.silk-saree",
};

export function localizedCategoryLabel(
  lang: LanguageCode,
  categoryIdOrLabel: string,
): string {
  const id = categoryIdOrLabel.toLowerCase().replace(/\s+/g, "-");
  const byId = CAT_KEY[categoryIdOrLabel] ?? CAT_KEY[id];
  if (byId) return translateExtra(lang, byId);
  // fuzzy from English label
  if (/cotton/i.test(categoryIdOrLabel)) return translateExtra(lang, "cat.cotton-saree");
  if (/silk/i.test(categoryIdOrLabel)) return translateExtra(lang, "cat.silk-saree");
  if (/stole|dupatta/i.test(categoryIdOrLabel))
    return translateExtra(lang, "cat.stole-dupatta");
  if (/dhoti|angavastram/i.test(categoryIdOrLabel))
    return translateExtra(lang, "cat.dhoti-angavastram");
  return categoryIdOrLabel;
}

type AdviceFactor = {
  id: string;
  inputs?: { name: string; value: string }[];
};

/** Rebuild today's advice in the active UI language (not English API string). */
export function localizedAdvice(
  lang: LanguageCode,
  args: {
    categoryId: string;
    categoryLabel: string;
    demandScore: number;
    factors?: AdviceFactor[];
  },
): string {
  const category = localizedCategoryLabel(
    lang,
    args.categoryId || args.categoryLabel,
  );
  const seasonal = args.factors?.find((f) => f.id === "seasonal");
  const festivalName =
    seasonal?.inputs?.find((i) => i.name === "Nearest relevant event")?.value ??
    null;
  const daysUntilRaw = seasonal?.inputs?.find(
    (i) => i.name === "Days until start",
  )?.value;
  const daysUntil = daysUntilRaw ? Number(daysUntilRaw) : null;

  let whenKey: ExtraKey = "home.startReady";
  if (daysUntil !== null && Number.isFinite(daysUntil)) {
    if (daysUntil <= 21) whenKey = "home.start3days";
    else if (daysUntil <= 45) whenKey = "home.start2weeks";
    else whenKey = "home.startWeeks";
  }
  const when = translateExtra(lang, whenKey);

  const hasFestival =
    festivalName &&
    festivalName !== "None upcoming in seeded public calendar";

  if (hasFestival) {
    return translateExtra(lang, "home.adviceFestival", {
      category,
      score: args.demandScore,
      festival: festivalName,
      when,
    });
  }
  return translateExtra(lang, "home.advice", {
    category,
    score: args.demandScore,
    when,
  });
}

export function localizedOrderState(
  lang: LanguageCode,
  state: string,
): string {
  const key = `state.${state}` as ExtraKey;
  if (key in EXTRA_CATALOGS.en) return translateExtra(lang, key);
  return state;
}
