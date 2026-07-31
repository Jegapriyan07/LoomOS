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
  | "pitch.planLinked"
  | "pitch.planLinkedMeta"
  | "pitch.planClearLink"
  | "orders.planThis"
  | "orders.boutiqueId"
  | "orders.needId"
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
  | "pitch.reserveOnPlan"
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
  | "engine.chipHint"
  | "engine.tag.festival"
  | "engine.tag.localDemand"
  | "engine.tag.yarn"
  | "engine.tag.historical"
  | "engine.tag.expert"
  | "engine.action.orders"
  | "engine.action.weave"
  | "engine.action.yarnCottonOk"
  | "engine.action.yarnCottonLow"
  | "engine.action.yarnSilkOk"
  | "engine.action.yarnSilkLow"
  | "engine.action.money"
  | "engine.action.moneyQuiet"
  | "drift.title"
  | "drift.subtitle"
  | "drift.pctOf"
  | "drift.highTrust"
  | "drift.thinkTitle"
  | "drift.whyLow"
  | "drift.mindfulness"
  | "drift.inputs"
  | "drift.showInputs"
  | "drift.hideInputs"
  | "drift.formula"
  | "drift.estimated"
  | "drift.demoTag"
  | "drift.thresholdNote";

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
    "Buyer/festival date → start date → yarn date → projected payment — timing comes after you see the order.",
  "pitch.stepWhat": "What",
  "pitch.stepWhen": "When",
  "pitch.stepDates": "Your dates",
  "pitch.stepTune": "Tune",
  "pitch.buyerNeeds": "Buyer needs (optional)",
  "pitch.buyerNeedsHint":
    "Tap a boutique post to plan from it — same Orders feed, linked by buyer id + name.",
  "pitch.buyerNeedsLine": "{category} · {qty} pcs · ready {date}",
  "pitch.buyerPortal": "Buyer Portal",
  "pitch.planLinked": "Planning for {name}",
  "pitch.planLinkedMeta": "Boutique {buyerId} · need {requirementId}",
  "pitch.planClearLink": "Clear linked order",
  "orders.planThis": "Plan this order",
  "orders.boutiqueId": "Boutique id {id}",
  "orders.needId": "Need {id}",
  "pitch.whatHint": "One choice — the days below use this item’s weaving length.",
  "pitch.datesTitle": "Your dates",
  "pitch.datesBody":
    "This is the explainable answer: when to buy yarn, start, finish, and when money is projected.",
  "pitch.moneyEyebrow": "Money",
  "pitch.moneyBody":
    "Advance held, order status, next projected settlement — then shareable proof.",
  "pitch.moneyOneLiner":
    "Escrow-style advance → clear state → projected settlement → verified record.",
  "pitch.stepSnapshot": "Snapshot",
  "pitch.stepOrders": "Orders",
  "pitch.stepReserve": "Reserve",
  "pitch.stepProof": "Proof",
  "pitch.walletHint": "The first thing a weaver should understand.",
  "pitch.ordersHint":
    "Walk each order’s state. Use Next step to advance.",
  "pitch.noOrders": "No orders yet. Buyer posts live in the Buyer Portal.",
  "pitch.reserveTitle": "Step 3 · Steady income wallet",
  "pitch.reserveHint":
    "Optional: rule-based reserve when a month is above your usual settlement average.",
  "pitch.proofTitle": "Verified transaction record",
  "pitch.proofHint": "Shareable proof buyers can trust.",
  "pitch.reserveOnPlan": "Income reserve on Plan",
  "pitch.show": "Show",
  "pitch.hide": "Hide",
  "pitch.ordersEyebrow": "Orders · 2nd tab · buyer demand feed",
  "pitch.ordersOneLiner":
    "See work coming first — same buyer posts the Buyer Portal publishes, then move to Plan for when to start.",
  "pitch.openBuyerPortal": "Open Buyer Portal",
  "pitch.openBuyerPortalHint":
    "Login as Saffron ({phone1}) or Festival ({phone2}).",
  "pitch.simulatedBuyer": "Buyer",
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
  "stock.simNote": "Your inventory — edit amounts to update advice.",
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
  "engine.tag.festival": "Festival Approaching",
  "engine.tag.localDemand": "Local Demand Increasing",
  "engine.tag.yarn": "Stable Yarn Prices",
  "engine.tag.historical": "Historical Demand",
  "engine.tag.expert": "Expert Weaver Knowledge",
  "engine.action.orders":
    "Check open buyer requirements in your region (Orders tab)",
  "engine.action.weave": "Plan {category} — start {when}",
  "engine.action.yarnCottonOk": "Cotton yarn on hand: {kg} kg",
  "engine.action.yarnCottonLow":
    "Cotton yarn low ({kg} kg) — buy before starting",
  "engine.action.yarnSilkOk": "Silk yarn on hand: {kg} kg",
  "engine.action.yarnSilkLow":
    "Silk yarn low ({kg} kg) — buy before starting",
  "engine.action.money": "Review money coming your way / escrow status",
  "engine.action.moneyQuiet":
    "No urgent payment action — keep production on track",
  "drift.title": "Drift score",
  "drift.subtitle": "Intelligence accuracy for this advice",
  "drift.pctOf": "{pct}%",
  "drift.highTrust":
    "Signals agree — this advice is above the 90% trust line. You can plan with more confidence (still Estimated).",
  "drift.thinkTitle": "Think carefully — drift below 90%",
  "drift.whyLow": "Why drift is low",
  "drift.mindfulness": "What weavers should keep in mind",
  "drift.inputs": "Inputs behind this %",
  "drift.showInputs": "Show inputs behind this %",
  "drift.hideInputs": "Hide inputs behind this %",
  "drift.formula": "Formula",
  "drift.estimated": "Estimated",
  "drift.demoTag": "Demo / Simulated",
  "drift.thresholdNote":
    "Below 90% means the app’s advice is less certain — pause before committing yarn or a full loom run.",
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
  "pitch.buyerNeeds": "खरीदार ज़रूरतें (वैकल्पिक)",
  "pitch.buyerNeedsHint":
    "तैयार तिथि सेट करने के लिए खरीदार पोस्ट पर टैप करें — वही डेटा Buyer Portal में है।",
  "pitch.buyerNeedsLine": "{category} · {qty} पीस · {date} तक तैयार",
  "pitch.buyerPortal": "खरीदार पोर्टल",
  "pitch.whatHint": "एक विकल्प — नीचे के दिन इसी वस्तु की बुनाई लंबाई से हैं।",
  "pitch.datesTitle": "आपकी तिथियाँ",
  "pitch.datesBody":
    "यही स्पष्ट जवाब है: सूत कब खरीदें, कब शुरू/खत्म करें, और पैसे कब अनुमानित हैं।",
  "pitch.moneyEyebrow": "पैसे · एस्क्रो कहानी",
  "pitch.moneyBody":
    "हर भुगतान कहाँ है देखें — एडवांस होल्ड, अगला अनुमानित सेटलमेंट, फिर रिज़र्व और साझा करने योग्य प्रमाण।",
  "pitch.moneyOneLiner":
    "एक पंक्ति में: एस्क्रो एडवांस → साफ़ स्थिति → अनुमानित सेटलमेंट → वैकल्पिक रिज़र्व → खरीदार भरोसे वाला रिकॉर्ड।",
  "pitch.stepSnapshot": "झलक",
  "pitch.stepOrders": "ऑर्डर",
  "pitch.stepReserve": "रिज़र्व",
  "pitch.stepProof": "प्रमाण",
  "pitch.walletHint": "बुनकर को सबसे पहले यही समझना चाहिए।",
  "pitch.ordersHint":
    "हर ऑर्डर की स्थिति देखें। अगला चरण से आगे बढ़ाएँ।",
  "pitch.noOrders": "अभी कोई ऑर्डर नहीं। खरीदार पोस्ट Buyer Portal में हैं।",
  "pitch.reserveTitle": "चरण 3 · स्थिर आय वॉलेट",
  "pitch.reserveHint":
    "वैकल्पिक: जब महीना सामान्य औसत से ऊपर हो तो नियम-आधारित रिज़र्व।",
  "pitch.proofTitle": "चरण 4 · सत्यापित लेन-देन रिकॉर्ड",
  "pitch.proofHint": "खरीदार भरोसे के लिए साझा प्रमाण।",
  "pitch.reserveOnPlan": "Plan पर आय रिज़र्व",
  "pitch.show": "दिखाएँ",
  "pitch.hide": "छिपाएँ",
  "pitch.ordersEyebrow": "ऑर्डर · खरीदार माँग फ़ीड",
  "pitch.ordersOneLiner":
    "Buyer Portal की वही पोस्ट — होम पर आज की सलाह भी इन्हीं से चलती है।",
  "pitch.openBuyerPortal": "खरीदार पोर्टल खोलें",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) या Festival ({phone2}) से लॉगिन करें।",
  "pitch.simulatedBuyer": "खरीदार",
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
  "drift.title": "ड्रिफ्ट स्कोर",
  "drift.subtitle": "इस सलाह की बुद्धिमत्ता सटीकता",
  "drift.pctOf": "{pct}%",
  "drift.highTrust":
    "संकेत मिलते हैं — यह सलाह 90% भरोसे की रेखा से ऊपर है। अधिक आत्मविश्वास से योजना बनाएँ (फिर भी अनुमानित)।",
  "drift.thinkTitle": "सोच-समझकर आगे बढ़ें — ड्रिफ्ट 90% से कम",
  "drift.whyLow": "ड्रिफ्ट कम क्यों है",
  "drift.mindfulness": "बुनकरों को क्या ध्यान में रखना चाहिए",
  "drift.inputs": "इस % के पीछे के इनपुट",
  "drift.showInputs": "इस % के पीछे के इनपुट दिखाएँ",
  "drift.hideInputs": "इस % के पीछे के इनपुट छिपाएँ",
  "drift.formula": "सूत्र",
  "drift.estimated": "अनुमानित",
  "drift.demoTag": "डेमो / सिम्युलेटेड",
  "drift.thresholdNote":
    "90% से कम का मतलब सलाह कम निश्चित है — सूत या पूरी बुनाई से पहले रुकें।",
  "stock.title": "स्टॉक और संसाधन",
  "stock.hint": "हाथ में सूत और तैयार टुकड़े — आज की सलाह में जाते हैं।",
  "stock.simNote": "आपकी इन्वेंटरी — सलाह अपडेट करने के लिए मात्रा बदलें।",
  "stock.yarnCotton": "सूती सूत (किलो)",
  "stock.yarnSilk": "रेशमी सूत (किलो)",
  "stock.finishedCotton": "तैयार सूती साड़ियाँ",
  "stock.finishedSilk": "तैयार रेशमी साड़ियाँ",
  "stock.finishedStole": "तैयार स्टोल / दुपट्टे",
  "stock.finishedDhoti": "तैयार धोती / अंगवस्त्रम",
  "stock.feedsEngine": "बदलाव होम की सलाह को प्रभावित करते हैं।",
  "engine.whyTags": "यह सलाह क्यों",
  "engine.dailyTitle": "आज क्या करूँ?",
  "engine.dailyHint":
    "बाज़ार, व्यवसाय और मास्टर-बुनकर संकेतों से आज की कार्य योजना।",
  "engine.fiveLabel": "पाँच रोज़ के सवाल",
  "engine.q1": "माँग",
  "engine.a1": "क्या मेरे पास काम आ रहा है?",
  "engine.q2": "उत्पाद",
  "engine.a2": "आगे क्या बुनूँ?",
  "engine.q3": "समय",
  "engine.a3": "कब शुरू करूँ?",
  "engine.q4": "पैसे",
  "engine.a4": "पैसे कब मिलेंगे?",
  "engine.q5": "आज",
  "engine.a5": "आज क्या करूँ?",
  "engine.chipHint":
    "सवाल टैप करें — फिर टैब घूमें: होम → ऑर्डर → योजना → पैसे।",
  "engine.tag.festival": "त्योहार नज़दीक",
  "engine.tag.localDemand": "स्थानीय माँग बढ़ रही है",
  "engine.tag.yarn": "सूत की कीमतें स्थिर",
  "engine.tag.historical": "ऐतिहासिक माँग",
  "engine.tag.expert": "मास्टर बुनकर ज्ञान",
  "engine.action.orders":
    "अपने क्षेत्र में खुली खरीदार ज़रूरतें देखें (ऑर्डर टैब)",
  "engine.action.weave": "{category} की योजना बनाएँ — {when} शुरू करें",
  "engine.action.yarnCottonOk": "हाथ में सूती सूत: {kg} किलो",
  "engine.action.yarnCottonLow":
    "सूती सूत कम ({kg} किलो) — शुरू करने से पहले खरीदें",
  "engine.action.yarnSilkOk": "हाथ में रेशमी सूत: {kg} किलो",
  "engine.action.yarnSilkLow":
    "रेशमी सूत कम ({kg} किलो) — शुरू करने से पहले खरीदें",
  "engine.action.money": "आने वाले पैसे / एस्क्रो स्थिति देखें",
  "engine.action.moneyQuiet":
    "कोई जरूरी भुगतान काम नहीं — उत्पादन जारी रखें",
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
  "pitch.reserveOnPlan": "Plan-இல் வருமான இருப்பு",
  "pitch.show": "காட்டு",
  "pitch.hide": "மறை",
  "pitch.ordersEyebrow": "ஆர்டர்கள் · வாங்குநர் தேவை ஊட்டம்",
  "pitch.ordersOneLiner":
    "Buyer Portal வெளியிடும் அதே உருவக இடுகைகள் — இன்றைய ஆலோசனையும் இவற்றால்.",
  "pitch.openBuyerPortal": "வாங்குநர் போர்டல் திற",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) அல்லது Festival ({phone2}) — உருவக மேசைகள்.",
  "pitch.simulatedBuyer": "வாங்குநர்",
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
  "engine.whyTags": "இந்த பரிந்துரை ஏன்",
  "engine.dailyTitle": "இன்று நான் என்ன செய்ய வேண்டும்?",
  "engine.dailyHint":
    "சந்தை, வணிகம் மற்றும் முதன்மை நெசவாளர் சமிக்ஞைகளின் அடிப்படையில் இன்றைய திட்டம்.",
  "engine.fiveLabel": "ஐந்து தினசரி கேள்விகள்",
  "engine.q1": "தேவை",
  "engine.a1": "எனக்கு வேலை வருகிறதா?",
  "engine.q2": "பொருள்",
  "engine.a2": "அடுத்து என்ன நெசவு செய்ய வேண்டும்?",
  "engine.q3": "நேரம்",
  "engine.a3": "எப்போது தொடங்க வேண்டும்?",
  "engine.q4": "பணம்",
  "engine.a4": "பணம் எப்போது கிடைக்கும்?",
  "engine.q5": "இன்று",
  "engine.a5": "இன்று நான் என்ன செய்ய வேண்டும்?",
  "engine.chipHint":
    "கேள்வியைத் தட்டவும் — பிறகு தாவல்கள்: முகப்பு → ஆர்டர் → திட்டம் → பணம்.",
  "engine.tag.festival": "திருவிழா நெருங்குகிறது",
  "engine.tag.localDemand": "உள்ளூர் தேவை அதிகரிக்கிறது",
  "engine.tag.yarn": "நூல் விலை நிலையானது",
  "engine.tag.historical": "வரலாற்றுத் தேவை",
  "engine.tag.expert": "முதன்மை நெசவாளர் அறிவு",
  "engine.action.orders":
    "உங்கள் பகுதியில் திறந்த வாங்குநர் தேவைகளைப் பாருங்கள் (ஆர்டர் தாவல்)",
  "engine.action.weave": "{category} திட்டமிடுங்கள் — {when} தொடங்குங்கள்",
  "engine.action.yarnCottonOk": "கையில் பருத்தி நூல்: {kg} கிலோ",
  "engine.action.yarnCottonLow":
    "பருத்தி நூல் குறைவு ({kg} கிலோ) — தொடங்கும் முன் வாங்குங்கள்",
  "engine.action.yarnSilkOk": "கையில் பட்டு நூல்: {kg} கிலோ",
  "engine.action.yarnSilkLow":
    "பட்டு நூல் குறைவு ({kg} கிலோ) — தொடங்கும் முன் வாங்குங்கள்",
  "engine.action.money": "வரும் பணம் / எஸ்க்ரோ நிலையைப் பாருங்கள்",
  "engine.action.moneyQuiet":
    "அவசர பண நடவடிக்கை இல்லை — உற்பத்தியைத் தொடருங்கள்",
  "drift.title": "டிரிஃப்ட் மதிப்பெண்",
  "drift.subtitle": "இந்த ஆலோசனையின் நுண்ணறிவு துல்லியம்",
  "drift.pctOf": "{pct}%",
  "drift.highTrust":
    "சமிக்ஞைகள் ஒத்துப்போகின்றன — இந்த ஆலோசனை 90% நம்பகக் கோட்டிற்கு மேல். அதிக நம்பிக்கையுடன் திட்டமிடலாம் (இன்னும் மதிப்பீடு).",
  "drift.thinkTitle": "கவனமாக சிந்தியுங்கள் — டிரிஃப்ட் 90%க்கு கீழ்",
  "drift.whyLow": "டிரிஃப்ட் ஏன் குறைவு",
  "drift.mindfulness": "நெசவாளர்கள் கவனத்தில் கொள்ள வேண்டியவை",
  "drift.inputs": "இந்த % பின்னால் உள்ள உள்ளீடுகள்",
  "drift.showInputs": "இந்த % பின்னால் உள்ள உள்ளீடுகளைக் காட்டு",
  "drift.hideInputs": "இந்த % பின்னால் உள்ள உள்ளீடுகளை மறை",
  "drift.formula": "சூத்திரம்",
  "drift.estimated": "மதிப்பீடு",
  "drift.demoTag": "டெமோ / உருவகம்",
  "drift.thresholdNote":
    "90%க்கு கீழ் என்றால் ஆலோசனை குறைந்த உறுதி — நூல் அல்லது முழு நெசவுக்கு முன் இடைநிறுத்துங்கள்.",
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
  "pitch.reserveOnPlan": "Planలో ఆదాయ రిజర్వ్",
  "pitch.show": "చూపించు",
  "pitch.hide": "దాచు",
  "pitch.ordersEyebrow": "ఆర్డర్లు · కొనుగోలుదారు డిమాండ్ ఫీడ్",
  "pitch.ordersOneLiner":
    "Buyer Portal పోస్టులే — హోమ్‌లోని నేటి సలహాకు కూడా ఇవే.",
  "pitch.openBuyerPortal": "కొనుగోలుదారు పోర్టల్ తెరవండి",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) లేదా Festival ({phone2}) — సిమ్యులేటెడ్ డెస్క్‌లు.",
  "pitch.simulatedBuyer": "కొనుగోలుదారు",
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
  "engine.whyTags": "ఈ సలహా ఎందుకు",
  "engine.dailyTitle": "ఈరోజు నేను ఏమి చేయాలి?",
  "engine.dailyHint":
    "మార్కెట్, వ్యాపారం మరియు మాస్టర్-నేత సంకేతాల నుండి ఈరోజు చర్య ప్రణాళిక.",
  "engine.fiveLabel": "ఐదు రోజువారీ ప్రశ్నలు",
  "engine.q1": "డిమాండ్",
  "engine.a1": "నాకు పని వస్తోందా?",
  "engine.q2": "ఉత్పత్తి",
  "engine.a2": "తర్వాత ఏమి నేయాలి?",
  "engine.q3": "సమయం",
  "engine.a3": "ఎప్పుడు ప్రారంభించాలి?",
  "engine.q4": "డబ్బు",
  "engine.a4": "డబ్బు ఎప్పుడు వస్తుంది?",
  "engine.q5": "ఈరోజు",
  "engine.a5": "ఈరోజు నేను ఏమి చేయాలి?",
  "engine.chipHint":
    "ప్రశ్నను టాప్ చేయండి — తర్వాత ట్యాబ్‌లు: హోమ్ → ఆర్డర్లు → ప్లాన్ → డబ్బు.",
  "engine.tag.festival": "పండుగ సమీపంలో",
  "engine.tag.localDemand": "స్థానిక డిమాండ్ పెరుగుతోంది",
  "engine.tag.yarn": "నూలు ధరలు స్థిరం",
  "engine.tag.historical": "చారిత్రక డిమాండ్",
  "engine.tag.expert": "మాస్టర్ నేత జ్ఞానం",
  "engine.action.orders":
    "మీ ప్రాంతంలో తెరిచిన కొనుగోలుదారు అవసరాలు చూడండి (ఆర్డర్లు ట్యాబ్)",
  "engine.action.weave": "{category} ప్లాన్ చేయండి — {when} ప్రారంభించండి",
  "engine.action.yarnCottonOk": "చేతిలో పత్తి నూలు: {kg} కిలో",
  "engine.action.yarnCottonLow":
    "పత్తి నూలు తక్కువ ({kg} కిలో) — ప్రారంభించే ముందు కొనండి",
  "engine.action.yarnSilkOk": "చేతిలో పట్టు నూలు: {kg} కిలో",
  "engine.action.yarnSilkLow":
    "పట్టు నూలు తక్కువ ({kg} కిలో) — ప్రారంభించే ముందు కొనండి",
  "engine.action.money": "వచ్చే డబ్బు / ఎస్క్రో స్థితి చూడండి",
  "engine.action.moneyQuiet":
    "అత్యవసర చెల్లింపు చర్య లేదు — ఉత్పత్తి కొనసాగించండి",
  "drift.title": "డ్రిఫ్ట్ స్కోర్",
  "drift.subtitle": "ఈ సలహా యొక్క ఇంటెలిజెన్స్ ఖచ్చితత్వం",
  "drift.pctOf": "{pct}%",
  "drift.highTrust":
    "సంకేతాలు ఏకీభవిస్తున్నాయి — ఈ సలహా 90% నమ్మక రేఖకు పైన. ఎక్కువ నమ్మకంతో ప్లాన్ చేయవచ్చు (ఇంకా అంచనా).",
  "drift.thinkTitle": "జాగ్రత్తగా ఆలోచించండి — డ్రిఫ్ట్ 90% కంటే తక్కువ",
  "drift.whyLow": "డ్రిఫ్ట్ ఎందుకు తక్కువ",
  "drift.mindfulness": "నేతగాళ్లు గమనించాల్సినవి",
  "drift.inputs": "ఈ % వెనుక ఉన్న ఇన్‌పుట్‌లు",
  "drift.showInputs": "ఈ % వెనుక ఉన్న ఇన్‌పుట్‌లు చూపించు",
  "drift.hideInputs": "ఈ % వెనుక ఉన్న ఇన్‌పుట్‌లు దాచు",
  "drift.formula": "ఫార్ములా",
  "drift.estimated": "అంచనా",
  "drift.demoTag": "డెమో / సిమ్యులేటెడ్",
  "drift.thresholdNote":
    "90% కంటే తక్కువ అంటే సలహా తక్కువ నిశ్చయం — నూలు లేదా పూర్తి నేతకు ముందు ఆగండి.",
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
  "pitch.reserveOnPlan": "Planನಲ್ಲಿ ಆದಾಯ ರಿಸರ್ವ್",
  "pitch.show": "ತೋರಿಸು",
  "pitch.hide": "ಮರೆಮಾಡು",
  "pitch.ordersEyebrow": "ಆರ್ಡರ್‌ಗಳು · ಖರೀದಿದಾರ ಬೇಡಿಕೆ ಫೀಡ್",
  "pitch.ordersOneLiner":
    "Buyer Portalನ ಅದೇ ಸಿಮ್ಯುಲೇಟೆಡ್ ಪೋಸ್ಟ್‌ಗಳು — ಮನೆಯ ಇಂದಿನ ಸಲಹೆಗೂ ಇವೇ.",
  "pitch.openBuyerPortal": "ಖರೀದಿದಾರ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) ಅಥವಾ Festival ({phone2}) — ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೆಸ್ಕ್‌ಗಳು.",
  "pitch.simulatedBuyer": "ಖರೀದಿದಾರ",
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
  "engine.whyTags": "ಈ ಸಲಹೆ ಏಕೆ",
  "engine.dailyTitle": "ಇಂದು ನಾನು ಏನು ಮಾಡಬೇಕು?",
  "engine.dailyHint":
    "ಮಾರುಕಟ್ಟೆ, ವ್ಯಾಪಾರ ಮತ್ತು ಮಾಸ್ಟರ್-ನೇಕಾರ ಸಂಕೇತಗಳಿಂದ ಇಂದಿನ ಕಾರ್ಯ ಯೋಜನೆ.",
  "engine.fiveLabel": "ಐದು ದೈನಂದಿನ ಪ್ರಶ್ನೆಗಳು",
  "engine.q1": "ಬೇಡಿಕೆ",
  "engine.a1": "ನನಗೆ ಕೆಲಸ ಬರುತ್ತಿದೆಯೇ?",
  "engine.q2": "ಉತ್ಪನ್ನ",
  "engine.a2": "ಮುಂದೆ ಏನು ನೇಯಬೇಕು?",
  "engine.q3": "ಸಮಯ",
  "engine.a3": "ಯಾವಾಗ ಪ್ರಾರಂಭಿಸಬೇಕು?",
  "engine.q4": "ಹಣ",
  "engine.a4": "ಹಣ ಯಾವಾಗ ಬರುತ್ತದೆ?",
  "engine.q5": "ಇಂದು",
  "engine.a5": "ಇಂದು ನಾನು ಏನು ಮಾಡಬೇಕು?",
  "engine.chipHint":
    "ಪ್ರಶ್ನೆಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ — ನಂತರ ಟ್ಯಾಬ್‌ಗಳು: ಮನೆ → ಆರ್ಡರ್ → ಯೋಜನೆ → ಹಣ.",
  "engine.tag.festival": "ಹಬ್ಬ ಹತ್ತಿರ",
  "engine.tag.localDemand": "ಸ್ಥಳೀಯ ಬೇಡಿಕೆ ಹೆಚ್ಚುತ್ತಿದೆ",
  "engine.tag.yarn": "ನೂಲು ಬೆಲೆ ಸ್ಥಿರ",
  "engine.tag.historical": "ಐತಿಹಾಸಿಕ ಬೇಡಿಕೆ",
  "engine.tag.expert": "ಮಾಸ್ಟರ್ ನೇಕಾರ ಜ್ಞಾನ",
  "engine.action.orders":
    "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ತೆರೆದ ಖರೀದಿದಾರ ಅಗತ್ಯಗಳನ್ನು ನೋಡಿ (ಆರ್ಡರ್ ಟ್ಯಾಬ್)",
  "engine.action.weave": "{category} ಯೋಜಿಸಿ — {when} ಪ್ರಾರಂಭಿಸಿ",
  "engine.action.yarnCottonOk": "ಕೈಯಲ್ಲಿ ಹತ್ತಿ ನೂಲು: {kg} ಕೆಜಿ",
  "engine.action.yarnCottonLow":
    "ಹತ್ತಿ ನೂಲು ಕಡಿಮೆ ({kg} ಕೆಜಿ) — ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ಖರೀದಿಸಿ",
  "engine.action.yarnSilkOk": "ಕೈಯಲ್ಲಿ ರೇಷ್ಮೆ ನೂಲು: {kg} ಕೆಜಿ",
  "engine.action.yarnSilkLow":
    "ರೇಷ್ಮೆ ನೂಲು ಕಡಿಮೆ ({kg} ಕೆಜಿ) — ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ಖರೀದಿಸಿ",
  "engine.action.money": "ಬರುವ ಹಣ / ಎಸ್ಕ್ರೋ ಸ್ಥಿತಿ ನೋಡಿ",
  "engine.action.moneyQuiet":
    "ತುರ್ತು ಪಾವತಿ ಕ್ರಿಯೆ ಇಲ್ಲ — ಉತ್ಪಾದನೆ ಮುಂದುವರಿಸಿ",
  "drift.title": "ಡ್ರಿಫ್ಟ್ ಸ್ಕೋರ್",
  "drift.subtitle": "ಈ ಸಲಹೆಯ ಬುದ್ಧಿಮತ್ತೆ ನಿಖರತೆ",
  "drift.pctOf": "{pct}%",
  "drift.highTrust":
    "ಸಂಕೇತಗಳು ಒಪ್ಪುತ್ತವೆ — ಈ ಸಲಹೆ 90% ನಂಬಿಕೆ ರೇಖೆಗಿಂತ ಮೇಲೆ. ಹೆಚ್ಚು ನಂಬಿಕೆಯಿಂದ ಯೋಜಿಸಬಹುದು (ಇನ್ನೂ ಅಂದಾಜು).",
  "drift.thinkTitle": "ಎಚ್ಚರಿಕೆಯಿಂದ ಯೋಚಿಸಿ — ಡ್ರಿಫ್ಟ್ 90%ಕ್ಕಿಂತ ಕಡಿಮೆ",
  "drift.whyLow": "ಡ್ರಿಫ್ಟ್ ಏಕೆ ಕಡಿಮೆ",
  "drift.mindfulness": "ನೇಕಾರರು ಗಮನಿಸಬೇಕಾದುದು",
  "drift.inputs": "ಈ % ಹಿಂದಿನ ಇನ್‌ಪುಟ್‌ಗಳು",
  "drift.showInputs": "ಈ % ಹಿಂದಿನ ಇನ್‌ಪುಟ್‌ಗಳನ್ನು ತೋರಿಸು",
  "drift.hideInputs": "ಈ % ಹಿಂದಿನ ಇನ್‌ಪುಟ್‌ಗಳನ್ನು ಮರೆಮಾಡು",
  "drift.formula": "ಸೂತ್ರ",
  "drift.estimated": "ಅಂದಾಜು",
  "drift.demoTag": "ಡೆಮೋ / ಸಿಮ್ಯುಲೇಟೆಡ್",
  "drift.thresholdNote":
    "90%ಕ್ಕಿಂತ ಕಡಿಮೆ ಎಂದರೆ ಸಲಹೆ ಕಡಿಮೆ ಖಚಿತ — ನೂಲು ಅಥವಾ ಪೂರ್ಣ ನೇಯ್ಗೆ ಮೊದಲು ನಿಲ್ಲಿಸಿ.",
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
  "pitch.reserveOnPlan": "Plan-এ আয় রিজার্ভ",
  "pitch.show": "দেখান",
  "pitch.hide": "লুকান",
  "pitch.ordersEyebrow": "অর্ডার · ক্রেতার চাহিদা ফিড",
  "pitch.ordersOneLiner":
    "Buyer Portal-এর একই সিমুলেটেড পোস্ট — হোমের আজকের পরামর্শও এগুলো দিয়ে।",
  "pitch.openBuyerPortal": "ক্রেতা পোর্টাল খুলুন",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) বা Festival ({phone2}) — সিমুলেটেড ডেস্ক।",
  "pitch.simulatedBuyer": "ক্রেতা",
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
  "engine.whyTags": "এই পরামর্শ কেন",
  "engine.dailyTitle": "আজ আমি কী করব?",
  "engine.dailyHint":
    "বাজার, ব্যবসা এবং মাস্টার-বুনকর সংকেত থেকে আজকের কাজের পরিকল্পনা।",
  "engine.fiveLabel": "পাঁচটি দৈনিক প্রশ্ন",
  "engine.q1": "চাহিদা",
  "engine.a1": "আমার কি কাজ আসছে?",
  "engine.q2": "পণ্য",
  "engine.a2": "এরপর কী বুনব?",
  "engine.q3": "সময়",
  "engine.a3": "কখন শুরু করব?",
  "engine.q4": "টাকা",
  "engine.a4": "টাকা কখন পাব?",
  "engine.q5": "আজ",
  "engine.a5": "আজ আমি কী করব?",
  "engine.chipHint":
    "প্রশ্ন ট্যাপ করুন — তারপর ট্যাব: হোম → অর্ডার → পরিকল্পনা → টাকা।",
  "engine.tag.festival": "উৎসব কাছে",
  "engine.tag.localDemand": "স্থানীয় চাহিদা বাড়ছে",
  "engine.tag.yarn": "সুতার দাম স্থিতিশীল",
  "engine.tag.historical": "ঐতিহাসিক চাহিদা",
  "engine.tag.expert": "মাস্টার বুনকর জ্ঞান",
  "engine.action.orders":
    "আপনার এলাকায় খোলা ক্রেতা চাহিদা দেখুন (অর্ডার ট্যাব)",
  "engine.action.weave": "{category} পরিকল্পনা করুন — {when} শুরু করুন",
  "engine.action.yarnCottonOk": "হাতে সুতি সুতো: {kg} কেজি",
  "engine.action.yarnCottonLow":
    "সুতি সুতো কম ({kg} কেজি) — শুরুর আগে কিনুন",
  "engine.action.yarnSilkOk": "হাতে রেশম সুতো: {kg} কেজি",
  "engine.action.yarnSilkLow":
    "রেশম সুতো কম ({kg} কেজি) — শুরুর আগে কিনুন",
  "engine.action.money": "আসছে টাকা / এসক্রো অবস্থা দেখুন",
  "engine.action.moneyQuiet":
    "জরুরি পেমেন্ট কাজ নেই — উৎপাদন চালিয়ে যান",
  "drift.title": "ড্রিফ্ট স্কোর",
  "drift.subtitle": "এই পরামর্শের বুদ্ধিমত্তার নির্ভুলতা",
  "drift.pctOf": "{pct}%",
  "drift.highTrust":
    "সংকেত মিলছে — এই পরামর্শ ৯০% বিশ্বাসের রেখার উপরে। আরও আত্মবিশ্বাসে পরিকল্পনা করুন (এখনও অনুমান)।",
  "drift.thinkTitle": "সাবধানে ভাবুন — ড্রিফ্ট ৯০%-এর নিচে",
  "drift.whyLow": "ড্রিফ্ট কম কেন",
  "drift.mindfulness": "বুনকরদের যা মনে রাখা উচিত",
  "drift.inputs": "এই %-এর পেছনের ইনপুট",
  "drift.showInputs": "এই %-এর পেছনের ইনপুট দেখান",
  "drift.hideInputs": "এই %-এর পেছনের ইনপুট লুকান",
  "drift.formula": "সূত্র",
  "drift.estimated": "অনুমানিত",
  "drift.demoTag": "ডেমো / সিমুলেটেড",
  "drift.thresholdNote":
    "৯০%-এর নিচে মানে পরামর্শ কম নিশ্চিত — সুতো বা পুরো বুননের আগে থামুন।",
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
  "pitch.reserveOnPlan": "Planত আয় ৰিজাৰ্ভ",
  "pitch.show": "দেখুৱাওক",
  "pitch.hide": "লুকুৱাওক",
  "pitch.ordersEyebrow": "অৰ্ডাৰ · ক্ৰেতাৰ চাহিদা ফিড",
  "pitch.ordersOneLiner":
    "Buyer Portalৰ একে ছিমুলেটেড পোষ্ট — হোমৰ আজিৰ পৰামৰ্শো ইয়াৰে।",
  "pitch.openBuyerPortal": "ক্ৰেতা প'ৰ্টেল খোলক",
  "pitch.openBuyerPortalHint":
    "Saffron ({phone1}) বা Festival ({phone2}) — ছিমুলেটেড ডেস্ক।",
  "pitch.simulatedBuyer": "ক্ৰেতা",
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
  "engine.whyTags": "এই পৰামৰ্শ কিয়",
  "engine.dailyTitle": "আজি মই কি কৰিম?",
  "engine.dailyHint":
    "বজাৰ, ব্যৱসায় আৰু মাষ্টাৰ-বোৱনী সংকেতৰ পৰা আজিৰ কাৰ্য পৰিকল্পনা।",
  "engine.fiveLabel": "পাঁচটা দৈনিক প্ৰশ্ন",
  "engine.q1": "চাহিদা",
  "engine.a1": "মোৰ কাম আহি আছে নেকি?",
  "engine.q2": "সামগ্ৰী",
  "engine.a2": "পৰৱৰ্তী কি ব'ম?",
  "engine.q3": "সময়",
  "engine.a3": "কেতিয়া আৰম্ভ কৰিম?",
  "engine.q4": "টকা",
  "engine.a4": "টকা কেতিয়া পাম?",
  "engine.q5": "আজি",
  "engine.a5": "আজি মই কি কৰিম?",
  "engine.chipHint":
    "প্ৰশ্ন টেপ কৰক — তাৰ পিছত টেব: হোম → অৰ্ডাৰ → পৰিকল্পনা → টকা।",
  "engine.tag.festival": "উৎসৱ ওচৰত",
  "engine.tag.localDemand": "স্থানীয় চাহিদা বাঢ়িছে",
  "engine.tag.yarn": "সূতাৰ দাম স্থিৰ",
  "engine.tag.historical": "ঐতিহাসিক চাহিদা",
  "engine.tag.expert": "মাষ্টাৰ বোৱনী জ্ঞান",
  "engine.action.orders":
    "আপোনাৰ অঞ্চলত খোলা ক্ৰেতা চাহিদা চাওক (অৰ্ডাৰ টেব)",
  "engine.action.weave": "{category} পৰিকল্পনা কৰক — {when} আৰম্ভ কৰক",
  "engine.action.yarnCottonOk": "হাতত কপাহী সূতা: {kg} কেজি",
  "engine.action.yarnCottonLow":
    "কপাহী সূতা কম ({kg} কেজি) — আৰম্ভৰ আগতে কিনক",
  "engine.action.yarnSilkOk": "হাতত ৰেচম সূতা: {kg} কেজি",
  "engine.action.yarnSilkLow":
    "ৰেচম সূতা কম ({kg} কেজি) — আৰম্ভৰ আগতে কিনক",
  "engine.action.money": "অহা টকা / এস্ক্ৰ' অৱস্থা চাওক",
  "engine.action.moneyQuiet":
    "জৰুৰী পেমেণ্ট কাম নাই — উৎপাদন অব্যাহত ৰাখক",
  "drift.title": "ড্ৰিফ্ট স্ক'ৰ",
  "drift.subtitle": "এই পৰামৰ্শৰ বুদ্ধিমত্তাৰ সঠিকতা",
  "drift.pctOf": "{pct}%",
  "drift.highTrust":
    "সংকেত মিলিছে — এই পৰামৰ্শ ৯০% বিশ্বাসৰ ৰেখাৰ ওপৰত। অধিক আত্মবিশ্বাসে পৰিকল্পনা কৰক (এতিয়াও অনুমান).",
  "drift.thinkTitle": "সাৱধানে ভাবুক — ড্ৰিফ্ট ৯০%ৰ তলত",
  "drift.whyLow": "ড্ৰিফ্ট কম কিয়",
  "drift.mindfulness": "বোৱনীসকলে মনত ৰাখিবলগীয়া",
  "drift.inputs": "এই %ৰ পিছফালৰ ইনপুট",
  "drift.showInputs": "এই %ৰ পিছফালৰ ইনপুট দেখুৱাওক",
  "drift.hideInputs": "এই %ৰ পিছফালৰ ইনপুট লুকুৱাওক",
  "drift.formula": "সূত্ৰ",
  "drift.estimated": "অনুমানিত",
  "drift.demoTag": "ডেমো / ছিমুলেটেড",
  "drift.thresholdNote":
    "৯০%ৰ তলত মানে পৰামৰ্শ কম নিশ্চিত — সূতা বা সম্পূৰ্ণ বোৱাৰ আগতে ৰুকক।",
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

const REASON_TAG_KEYS: Record<string, ExtraKey> = {
  festival: "engine.tag.festival",
  local_demand: "engine.tag.localDemand",
  yarn: "engine.tag.yarn",
  historical: "engine.tag.historical",
  expert: "engine.tag.expert",
};

export function localizedReasonTagLabel(
  lang: LanguageCode,
  tagId: string,
  fallback: string,
): string {
  const key = REASON_TAG_KEYS[tagId];
  return key ? translateExtra(lang, key) : fallback;
}

const START_WHEN_KEYS: Record<string, ExtraKey> = {
  ready: "home.startReady",
  "3days": "home.start3days",
  "2weeks": "home.start2weeks",
  weeks: "home.startWeeks",
};

const ACTION_KEYS: Record<string, ExtraKey> = {
  orders: "engine.action.orders",
  weave: "engine.action.weave",
  yarn_cotton_ok: "engine.action.yarnCottonOk",
  yarn_cotton_low: "engine.action.yarnCottonLow",
  yarn_silk_ok: "engine.action.yarnSilkOk",
  yarn_silk_low: "engine.action.yarnSilkLow",
  money: "engine.action.money",
  money_quiet: "engine.action.moneyQuiet",
};

/** Localize a home daily-action row from its stable id + vars. */
export function localizedDailyActionLabel(
  lang: LanguageCode,
  action: {
    id: string;
    label: string;
    vars?: Record<string, string | number>;
  },
): string {
  const key = ACTION_KEYS[action.id];
  if (!key) return action.label;

  if (action.id === "weave") {
    const category = localizedCategoryLabel(
      lang,
      String(action.vars?.categoryId ?? action.vars?.category ?? ""),
    );
    const whenCode = String(action.vars?.when ?? "ready");
    const whenKey = START_WHEN_KEYS[whenCode] ?? "home.startReady";
    return translateExtra(lang, key, {
      category: category || String(action.vars?.category ?? ""),
      when: translateExtra(lang, whenKey),
    });
  }

  return translateExtra(lang, key, {
    kg: action.vars?.kg ?? "",
  });
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
