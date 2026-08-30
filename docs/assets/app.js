/* =====================================================================
   LusoNetworks — shared app.js (vanilla, no deps). Loaded on every page.
   Features: i18n (EN/PT), theme toggle, mobile nav, contact links,
   reveal-on-scroll, scroll-spy, hero canvas, price list, quote builder.
   Any feature that needs a missing element simply no-ops.
   ===================================================================== */
'use strict';

/* ============ EDIT-ME: your contact details ============ */
const WA_NUMBER = '351900000000';      // WhatsApp, intl format, digits only. e.g. 351912345678
const CONTACT_EMAIL = 'hello@lusonetworks.pt'; // your email
/* ======================================================= */

const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const euros = n => '€'+Math.round(n).toLocaleString('en-US');

/* =====================================================================
   PRICING CATALOG — single source of truth (labour prices).
   name = EN, name_pt = PT. Keep the two lists in sync if you edit.
   ===================================================================== */
const CATALOG = [
  { id:'pkg-home',   group:'g-pkg', name:'Smart Home Starter',      name_pt:'Casa Inteligente — Início', price:390, kind:'oneoff' },
  { id:'pkg-rental', group:'g-pkg', name:'Airbnb / Rental Ready',   name_pt:'Pronto para Airbnb / AL',   price:650, kind:'oneoff' },
  { id:'pkg-farm',   group:'g-pkg', name:'Farm & Outdoor',          name_pt:'Campo & Exterior',          price:520, kind:'oneoff' },
  { id:'pkg-full',   group:'g-pkg', name:'Full Smart Home',         name_pt:'Casa Inteligente Completa', price:820, kind:'oneoff' },

  { id:'wifi-home',  group:'g-wifi', name:'Whole-home / office Wi-Fi', name_pt:'Wi-Fi para toda a casa / escritório', price:220, to:360, kind:'oneoff',
    desc:'Mesh Wi-Fi planned and installed so every room is fast — I map your space, place the units and tune the channels.', desc_pt:'Wi-Fi mesh planeado e instalado para todas as divisões terem sinal rápido — mapeio o espaço, coloco os equipamentos e afino os canais.' },
  { id:'wifi-fix',   group:'g-wifi', name:'Fix my Wi-Fi',              name_pt:'Reparar o meu Wi-Fi',                 price:130, to:190, kind:'oneoff',
    desc:'Dead zones, drop-outs, slow speeds — I diagnose the real cause and fix it, not just move the router.', desc_pt:'Zonas sem sinal, quedas, lentidão — diagnostico a causa real e resolvo, não é só mudar o router de sítio.' },
  { id:'wifi-ap',    group:'g-wifi', name:'Extra access point',        name_pt:'Ponto de acesso extra',               price:40,  kind:'oneoff', unit:'each', unit_pt:'cada',
    desc:'Add an access point to push signal into a far room, garden or extra floor.', desc_pt:'Adicionar um ponto de acesso para levar sinal a uma divisão distante, jardim ou piso extra.' },
  { id:'wifi-guest', group:'g-wifi', name:'Guest / separate Wi-Fi',    name_pt:'Wi-Fi de convidados / separado',      price:45,  kind:'oneoff',
    desc:'A separate guest network so visitors (or the till) never touch your main devices.', desc_pt:'Uma rede de convidados separada para que as visitas (ou a caixa) nunca toquem nos seus dispositivos.' },
  { id:'wifi-vpn',   group:'g-wifi', name:'Remote access (VPN)',       name_pt:'Acesso remoto (VPN)',                 price:75,  to:110, kind:'oneoff',
    desc:'Reach your home or shop network securely from your phone anywhere — cameras, files, devices.', desc_pt:'Aceder à rede de casa ou da loja em segurança a partir do telemóvel, em qualquer lado — câmaras, ficheiros, dispositivos.' },
  { id:'cable-run',  group:'g-wifi', name:'Network cable to a room',   name_pt:'Cabo de rede até uma divisão',        price:55,  kind:'oneoff', unit:'room', unit_pt:'divisão',
    desc:'A tidy wired connection run to a room or camera — rock-solid where Wi-Fi struggles.', desc_pt:'Uma ligação por cabo, arrumada, até uma divisão ou câmara — fiável onde o Wi-Fi falha.' },

  { id:'dev-plugs',  group:'g-dev', name:'Smart plugs & lights',   name_pt:'Tomadas e luzes inteligentes', price:50, kind:'oneoff', unit:'set of 5', unit_pt:'conj. 5',
    desc:'Up to 5 plugs/bulbs installed, named and grouped in the app, with schedules if you want them.', desc_pt:'Até 5 tomadas/lâmpadas instaladas, nomeadas e agrupadas na app, com horários se quiser.' },
  { id:'dev-lock',   group:'g-dev', name:'Smart lock + keypad',    name_pt:'Fechadura inteligente + teclado', price:85, to:120, kind:'oneoff', unit:'lock', unit_pt:'fechadura',
    desc:'Keypad/app lock fitted and tested, with codes for guests or cleaners you can change anytime.', desc_pt:'Fechadura com teclado/app instalada e testada, com códigos para hóspedes ou limpeza que pode mudar quando quiser.' },
  { id:'dev-bell',   group:'g-dev', name:'Video doorbell',         name_pt:'Campainha com vídeo',          price:75, kind:'oneoff', unit:'unit', unit_pt:'unidade',
    desc:'Video doorbell mounted, wired or battery, with phone alerts and two-way talk set up.', desc_pt:'Campainha com vídeo montada, com fios ou bateria, com alertas no telemóvel e conversa nos dois sentidos.' },
  { id:'dev-cam',    group:'g-dev', name:'Security camera',        name_pt:'Câmara de segurança',          price:65, to:90, kind:'oneoff', unit:'camera', unit_pt:'câmara',
    desc:'Camera positioned, mounted and set up with recording and motion alerts to your phone.', desc_pt:'Câmara posicionada, montada e configurada com gravação e alertas de movimento no telemóvel.' },
  { id:'dev-thermo', group:'g-dev', name:'Smart thermostat / AC',  name_pt:'Termostato / AC inteligente',  price:80, to:120, kind:'oneoff', unit:'unit', unit_pt:'unidade',
    desc:'Control your heating or AC from your phone, with schedules that cut wasted energy.', desc_pt:'Controlar o aquecimento ou AC pelo telemóvel, com horários que reduzem o desperdício.' },
  { id:'dev-blinds', group:'g-dev', name:'Smart blinds / shutter', name_pt:'Estores inteligentes',         price:40, to:70, kind:'oneoff', unit:'each', unit_pt:'cada',
    desc:'Motorise an existing blind or shutter — app control, schedules and sun/scene automations.', desc_pt:'Motorizar um estore existente — controlo por app, horários e automações de sol/cenário.' },
  { id:'dev-voice',  group:'g-dev', name:'Voice assistant setup',  name_pt:'Assistente de voz',            price:40, kind:'oneoff',
    desc:'Alexa / Google / Siri set up and linked to your devices, with the commands that matter to you.', desc_pt:'Alexa / Google / Siri configurado e ligado aos seus dispositivos, com os comandos que lhe interessam.' },

  { id:'sen-pack',   group:'g-sen', name:'Sensor pack',            name_pt:'Pacote de sensores',           price:75, kind:'oneoff', unit:'5 sensors', unit_pt:'5 sensores',
    desc:'Up to 5 sensors (door, motion, temperature…) placed and wired into alerts and automations.', desc_pt:'Até 5 sensores (porta, movimento, temperatura…) colocados e ligados a alertas e automações.' },
  { id:'sen-leak',   group:'g-sen', name:'Water-leak protection',  name_pt:'Proteção contra fugas de água',price:60, to:95, kind:'oneoff',
    desc:'Leak sensors under sinks, washer or boiler that ping your phone before a small drip floods the place.', desc_pt:'Sensores de fuga sob lava-loiças, máquina ou esquentador que avisam o telemóvel antes de um pingo inundar tudo.' },
  { id:'sen-noise',  group:'g-sen', name:'Noise / occupancy (rental)', name_pt:'Ruído / ocupação (AL)',    price:70, kind:'oneoff',
    desc:'Privacy-safe noise & occupancy monitoring for rentals — catch parties and over-occupancy, no cameras indoors.', desc_pt:'Monitorização de ruído e ocupação para alojamento, respeitando a privacidade — deteta festas e excesso de pessoas, sem câmaras dentro.' },
  { id:'sen-energy', group:'g-sen', name:'Energy monitoring',      name_pt:'Monitorização de energia',     price:90, to:140, kind:'oneoff',
    desc:'See exactly what your home or shop is spending in real time, so you can cut the waste.', desc_pt:'Ver exatamente o que a casa ou loja gasta em tempo real, para reduzir o desperdício.' },
  { id:'sen-air',    group:'g-sen', name:'Air quality / CO₂',      name_pt:'Qualidade do ar / CO₂',        price:45, kind:'oneoff', unit:'unit', unit_pt:'unidade',
    desc:'CO₂ / air-quality monitor set up with alerts — great for bedrooms, offices and busy shops.', desc_pt:'Monitor de CO₂ / qualidade do ar com alertas — ótimo para quartos, escritórios e lojas movimentadas.' },
  { id:'sen-fridge', group:'g-sen', name:'Fridge / freezer alarm', name_pt:'Alarme de frigorífico / arca', price:55, kind:'oneoff', unit:'unit', unit_pt:'unidade',
    desc:'Temperature alarm for a fridge or freezer — get warned before stock spoils. Ideal for cafés & shops.', desc_pt:'Alarme de temperatura para frigorífico ou arca — avisado antes do stock estragar. Ideal para cafés e lojas.' },

  { id:'farm-soil',  group:'g-farm', name:'Soil, temp & humidity', name_pt:'Solo, temp. e humidade',      price:90,  kind:'oneoff', unit:'zone', unit_pt:'zona',
    desc:'Per zone: soil-moisture, temperature and humidity sensing with readings and alerts on your phone.', desc_pt:'Por zona: humidade do solo, temperatura e humidade do ar, com leituras e alertas no telemóvel.' },
  { id:'farm-irrig', group:'g-farm', name:'Automated irrigation',  name_pt:'Rega automática',             price:140, to:240, kind:'oneoff',
    desc:'Watering that runs itself on a schedule or on soil readings — save water and stop guessing.', desc_pt:'Rega que funciona sozinha por horário ou pelas leituras do solo — poupa água e acaba com a adivinhação.' },
  { id:'farm-tank',  group:'g-farm', name:'Water tank / level',    name_pt:'Depósito / nível de água',    price:90,  kind:'oneoff',
    desc:'Know how full a tank or well is at a glance, with a low-level alert before it runs dry.', desc_pt:'Saber num relance quão cheio está um depósito ou poço, com alerta de nível baixo antes de secar.' },
  { id:'farm-lora',  group:'g-farm', name:'Long-range sensor (LoRa)', name_pt:'Sensor de longo alcance (LoRa)', price:110, to:160, kind:'oneoff', unit:'unit', unit_pt:'unidade',
    desc:'Readings from fields with no Wi-Fi — long-range LoRa link back to your dashboard, per sensor point.', desc_pt:'Leituras de campos sem Wi-Fi — ligação LoRa de longo alcance até ao seu painel, por ponto de sensor.' },

  { id:'auto-hub',   group:'g-auto', name:'Home Assistant hub',    name_pt:'Central Home Assistant',      price:240, to:360, kind:'oneoff',
    desc:'A private local hub that ties all your brands together, keeps working offline, and answers to no cloud.', desc_pt:'Uma central local e privada que junta todas as marcas, continua a funcionar offline e não depende da nuvem.' },
  { id:'auto-rules', group:'g-auto', name:'Automations pack',      name_pt:'Pacote de automações',        price:130, kind:'oneoff', unit:'5 rules', unit_pt:'5 regras',
    desc:'Up to 5 automations built around your routine — "everyone left", "sunset", "too humid", and so on.', desc_pt:'Até 5 automações à medida da sua rotina — "saíram todos", "pôr do sol", "muita humidade", etc.' },
  { id:'auto-dash',  group:'g-auto', name:'Dashboard for your data', name_pt:'Painel para os seus dados', price:300, to:480, kind:'oneoff',
    desc:'A clean dashboard bringing your sensors and devices into one screen — phone, tablet or wall panel.', desc_pt:'Um painel limpo que reúne sensores e dispositivos num só ecrã — telemóvel, tablet ou painel de parede.' },
  { id:'auto-custom',group:'g-auto', name:'Custom sensor / build', name_pt:'Sensor / projeto à medida',   price:360, to:700, kind:'oneoff', unit:'from', unit_pt:'desde',
    desc:'Something off-the-shelf can\'t do? I design and build it — custom sensors, integrations, one-off gadgets.', desc_pt:'Algo que não existe pronto? Eu desenho e construo — sensores à medida, integrações, aparelhos únicos.' },

  { id:'plan-home',  group:'g-plan', name:'Home plan',             name_pt:'Plano Casa',                  price:35,  kind:'monthly',
    desc:'Remote check-ups, updates, priority WhatsApp help and one free remote fix a month.', desc_pt:'Verificações remotas, atualizações, ajuda prioritária por WhatsApp e uma reparação remota grátis por mês.' },
  { id:'plan-host',  group:'g-plan', name:'Host / Rental plan',    name_pt:'Plano Anfitrião / AL',        price:99,  kind:'monthly',
    desc:'Monitoring of locks, Wi-Fi & sensors, same-day remote response and a quarterly on-site visit.', desc_pt:'Monitorização de fechaduras, Wi-Fi e sensores, resposta remota no próprio dia e visita trimestral.' },
  { id:'plan-biz',   group:'g-plan', name:'Business plan',         name_pt:'Plano Negócios',              price:249, kind:'monthly',
    desc:'Everything monitored — cameras & network — with a monthly on-site visit and priority scheduling.', desc_pt:'Tudo monitorizado — câmaras e rede — com visita mensal ao local e agendamento prioritário.' }
];
const GROUP_ORDER = ['g-pkg','g-wifi','g-dev','g-sen','g-farm','g-auto','g-plan'];
const GROUP_LABEL = {
  'g-pkg':{en:'Starter packages',pt:'Pacotes iniciais'},
  'g-wifi':{en:'Wi-Fi & network',pt:'Wi-Fi & rede'},
  'g-dev':{en:'Smart devices',pt:'Dispositivos inteligentes'},
  'g-sen':{en:'Sensors & alerts',pt:'Sensores & alertas'},
  'g-farm':{en:'Farm & outdoor',pt:'Campo & exterior'},
  'g-auto':{en:'Automation & data',pt:'Automação & dados'},
  'g-plan':{en:'Monthly care plans',pt:'Planos mensais'}
};
const GROUP_ICON = {
  'g-wifi':'M5 12a10 10 0 0 1 14 0 M8.5 15.5a5 5 0 0 1 7 0 M12 19h.01',
  'g-dev':'M9 3h6v4H9z M6 7h12v14H6z M12 17h.01',
  'g-sen':'M12 3v2 M12 21a7 7 0 0 0 7-7V9a7 7 0 0 0-14 0v5a7 7 0 0 0 7 7z',
  'g-farm':'M12 2v6 M12 22a7 7 0 0 0 7-7c0-4-7-9-7-9s-7 5-7 9a7 7 0 0 0 7 7z',
  'g-auto':'M4 4h16v12H4z M2 20h20 M8 8l3 3-3 3',
  'g-plan':'M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z'
};
const CALLOUT_FEE = 45, CREDIT_THRESHOLD = 150;

/* =====================================================================
   I18N — every UI string. data-i18n="key" on an element swaps its text.
   data-i18n-html allows inline markup. Missing keys leave text as-is.
   ===================================================================== */
const I18N = {
  en:{
    'nav.services':'Services','nav.quote':'Build a quote','nav.about':'About','nav.contact':'Contact','nav.home':'Home',
    'nav.wa':'WhatsApp','skip':'Skip to content',
    'nf.lede':"Sorry, this page doesn't exist. It may have moved, or the link was mistyped.",'nf.home':'Back to home','nf.services':'See services',
    'foot.tag':'Smart home, Wi-Fi, cameras & sensors — set up for you across Greater Lisbon. One friendly engineer, fair fixed prices.',
    'foot.services':'Services','foot.info':'Info','foot.packages':'Packages','foot.pricelist':'Price list','foot.plans':'Care plans','foot.quote':'Build a quote',
    'foot.about':'About','foot.faq':'FAQ','foot.process':'How it works','foot.contact':'Contact',
    'foot.rights':'LusoNetworks — smart home & networks, Lisbon','foot.line':'Greater Lisbon · EN & PT · Fixed prices, no lock-in',
    'foot.remote':'Remote · anywhere',

    'home.badge':'Available now · Greater Lisbon · EN & PT',
    'home.h1a':'Your home, smarter —','home.h1b':'without the headache',
    'home.sub':'I set up smart devices, stronger Wi-Fi, cameras and sensors for homes, expats, Airbnbs, hotels, small shops and farms. Fair fixed prices, plain language, no lock-in.',
    'home.cta.wa':'Message me on WhatsApp','home.cta.quote':'Build a quote →',
    'home.assure1':'Fixed price agreed before I start','home.assure2':'Hardware at cost — no markup','home.assure3':'Nothing locked to me',
    'trust1a':'Engineering-student run','trust1b':'· real training, not guesswork',
    'trust2a':'I come to','trust2b':'you','trust2c':'— home visits across Lisbon',
    'trust3a':'Remote setup','trust3b':'anywhere','trust4a':'Works with','trust4b':'your','trust4c':'devices & budget',

    'aud.eyebrow':'Who I help','aud.h2':'Built for real Lisbon places','aud.lede':'Different places, different needs. Here\'s where I fit — pick the one that sounds like you.',
    'aud.home.t':'Homes & expats','aud.home.d':'Smart lights, better Wi-Fi, a video doorbell, an app that just works — set up and explained in English or Portuguese.',
    'aud.rental.t':'Airbnb & rentals','aud.rental.d':'Self check-in smart locks, guest Wi-Fi, noise and occupancy sensors, leak alerts — fewer messages, fewer 2am problems.',
    'aud.hotel.t':'Hotels & guesthouses','aud.hotel.d':'Reliable Wi-Fi in every room, cameras at entrances, energy and climate monitoring, a simple dashboard for staff.',
    'aud.shop.t':'Small shops & cafés','aud.shop.d':'Cameras, guest Wi-Fi split from the till, a fridge-temperature alarm, opening-hours automations, remote access.',
    'aud.farm.t':'Farms & outdoor','aud.farm.d':'Soil, tank and temperature sensors, automated irrigation, long-range (LoRa) readings from fields with no Wi-Fi.',
    'aud.maker.t':'Makers & custom','aud.maker.d':'A specific idea — a custom sensor, a data dashboard, an automation nobody sells off the shelf? I build those too.',

    'home.pkg.eyebrow':'Starter packages','home.pkg.h2':'Popular bundles, one clear price','home.pkg.lede':'Ready-made combinations for the most common jobs. See all of them, plus the full price list, on the services page.',
    'home.pkg.cta':'See all services & prices →',

    'home.why.eyebrow':'Why me','home.why.h2':'A real engineer, not a random handyman','home.why.lede':'I\'m a master\'s student in Informatics & Telecommunications Engineering — this is what I study and love.',
    'home.why.cta':'More about me →',

    'home.cta2.eyebrow':'Let\'s do it','home.cta2.h2':'Tell me what you\'ve got in mind','home.cta2.p':'One message is all it takes. Describe the place and what you\'d like — a photo helps — and I\'ll come back with a clear, fixed price.',
    'home.cta2.wa':'Chat on WhatsApp','home.cta2.quote':'Build a quote',

    'svc.title':'Services & prices','svc.eyebrow':'Packages','svc.h2':'Popular bundles, one clear price','svc.lede':'Ready-made combinations for the most common jobs. Labour is fixed; devices are extra and always shown at what they cost. Mix and match — or build your own quote.',
    'svc.mostbooked':'Most booked','svc.startwith':'Start with this','svc.labour':'labour','svc.from':'from',
    'pkg.home.title':'Smart Home Starter','pkg.rental.title':'Airbnb / Rental Ready','pkg.farm.title':'Farm & Outdoor','pkg.full.title':'Full Smart Home',
    'plan.home.title':'Home','plan.host.title':'Host / Rental','plan.biz.title':'Business',
    'pkg.home.for':'// homes & first-timers','pkg.rental.for':'// hosts & short-term rentals','pkg.farm.for':'// land, quintas & growers','pkg.full.for':'// whole-place, done properly',
    'pkg.home.l1':'Smart lights & plugs set up in your main rooms','pkg.home.l2':'Voice assistant (Alexa / Google / Home app)','pkg.home.l3':'One-tap “scenes” — leaving, movie, goodnight','pkg.home.l4':'Everything explained + a written cheat-sheet',
    'pkg.rental.l1':'Keypad smart lock for self check-in','pkg.rental.l2':'Fast guest Wi-Fi, separate from your network','pkg.rental.l3':'Noise & occupancy sensor (privacy-safe, no cameras inside)','pkg.rental.l4':'Water-leak alert to your phone','pkg.rental.l5':'Handover guide for guests & cleaners',
    'pkg.farm.l1':'Soil moisture, temperature & humidity sensors','pkg.farm.l2':'Water tank / level monitoring','pkg.farm.l3':'Long-range (LoRa) readings where there\'s no Wi-Fi','pkg.farm.l4':'Alerts & a simple dashboard on your phone',
    'pkg.full.l1':'Whole-home Wi-Fi that reaches every corner','pkg.full.l2':'Lights, plugs, thermostat & blinds automated','pkg.full.l3':'Video doorbell + a camera or two','pkg.full.l4':'Local hub (Home Assistant) — private, works offline','pkg.full.l5':'Custom automations tuned to your routine',

    'svc.pl.eyebrow':'À la carte price list','svc.pl.h2':'Every service, every price — upfront','svc.pl.lede':'These are labour prices. Where you see a range, it reflects the size of the job — you always get one fixed number in your quote. Any devices are bought at cost, no markup, and you approve the shopping list first.',
    'svc.chip1a':'on-site visit fee','svc.chip1b':'credited on any job over €150','svc.chip2a':'Free','svc.chip2b':'quick video call to scope small jobs','svc.chip3':'Prices from Aug 2026 · confirmed in your quote',
    'svc.plan.eyebrow':'Care plans (optional)','svc.plan.h2':'Keep it running — without lifting a finger','svc.plan.lede':'One-off installs need no plan. But if you\'d rather someone watch over it, update it and pick up the phone, these are month-to-month. Cancel anytime.',
    'svc.plan.mo':'/mo',
    'plan.home.p':'For a smart home you\'d rather not babysit.','plan.home.l1':'Remote check-ups & updates','plan.home.l2':'Priority WhatsApp help','plan.home.l3':'One free remote fix a month','plan.home.l4':'10% off new work',
    'plan.host.p':'For hosts who can\'t afford downtime between guests.','plan.host.l1':'Everything in Home','plan.host.l2':'Monitoring of locks, Wi-Fi & sensors','plan.host.l3':'Same-day remote response','plan.host.l4':'One on-site visit / quarter included',
    'plan.biz.p':'For shops, cafés & guesthouses that depend on it.','plan.biz.l1':'Everything in Host','plan.biz.l2':'Cameras & network monitored','plan.biz.l3':'Monthly on-site visit','plan.biz.l4':'Priority scheduling for new work',
    'svc.proc.eyebrow':'How it works','svc.proc.h2':'From first message to done','svc.proc.lede':'No hourly meter running, no surprises. Four steps.',
    'proc.1.t':'Say hi','proc.1.d':'Message me on WhatsApp or build a quote. Tell me the place and what you\'d like — a photo helps.',
    'proc.2.t':'Fixed quote','proc.2.d':'You get one clear price for the work, plus a device shopping list at cost. Nothing starts until you say yes.',
    'proc.3.t':'I install it','proc.3.d':'I come to you, set everything up, test it, and walk you through it. Tidy, quiet, respectful of your place.',
    'proc.4.t':'You\'re covered','proc.4.d':'Two weeks of free tweaks after any job. Add a care plan later if you want ongoing peace of mind.',

    'about.title':'About LusoNetworks','about.eyebrow':'Why me','about.h2':'A real engineer, not a random handyman',
    'about.p1':'I\'m a master\'s student in Informatics & Telecommunications Engineering in Lisbon, and this is the stuff I actually study and love — IoT, sensors, embedded systems, networking and automation. I build electronics projects for fun.',
    'about.p2':'That means two things for you: I understand why your Wi-Fi drops or your sensor won\'t connect, and I set things up so you stay in control — open standards, your accounts, no lock-in to me. If I ever vanish, everything keeps working.',
    'about.p3':'I keep prices fair because I\'m building a reputation, not milking clients. Honest work, explained in plain language, in English or Portuguese.',
    'about.card.h':'What you can count on','about.stat1':'markup on any hardware','about.stat2':'free tweaks after a job','about.stat3':'languages — EN & PT','about.stat4':'person — you always talk to me',
    'about.card.p':'Fully mobile — I drive to you anywhere in Greater Lisbon, and set up remote-only jobs for clients further out.',
    'faq.eyebrow':'Good questions','faq.h2':'Things people ask',
    'faq.q1':'Do I pay for the devices too?','faq.a1':'Yes — but at cost, with zero markup. I give you a shopping list (or buy them for you and show the receipts). My price is only for the work. You own everything and it\'s tied to your accounts, not mine.',
    'faq.q2':'What\'s the €45 visit fee?','faq.a2':'It covers me driving out and diagnosing your setup properly. If you go ahead with any job over €150, it comes straight off the price — so on most jobs it effectively costs nothing.',
    'faq.q3':'Do you speak Portuguese and English?','faq.a3':'Both, fluently. A lot of my clients are expats or hosts who want someone who can explain things clearly in English — but I\'m local, so Portuguese is no problem.',
    'faq.q4':'What if I move, or want to change things later?','faq.a4':'Everything I install uses open, standard tech tied to your own accounts — no lock-in. You can take it with you, hand it to another technician, or call me back. Your choice.',
    'faq.q5':'Are you insured / is this a real business?','faq.a5':'I invoice properly and work as a registered self-employed technician in Portugal. For businesses that need specifics (insurance, invoicing details), just ask and I\'ll sort it before we start.',
    'faq.q6':'Where do you cover?','faq.a6':'On-site across Greater Lisbon — the city plus Cascais, Sintra, Oeiras, Almada, Loures and nearby. Anywhere further, I can often do the whole thing remotely.',
    'faq.q7':'How soon can you come?','faq.a7':'Usually within a few days, often sooner for small jobs. Message me on WhatsApp with roughly what you need and where, and I\'ll give you a slot.',

    'quote.title':'Build a quote','quote.eyebrow':'Instant estimate','quote.h2':'Build your quote','quote.lede':'Tap the things you\'re interested in. You\'ll get a ballpark labour price and can send it straight to me on WhatsApp — I\'ll confirm the exact number after a quick look.',
    'quote.sum.h':'Your estimate','quote.sum.empty':'Nothing selected yet — pick a few items on the left.','quote.sum.total':'One-time labour',
    'quote.sum.send':'Send this to me','quote.sum.copy':'Copy quote to clipboard',
    'quote.fine':'Estimate only — labour, before devices. Your final fixed price is confirmed after I see the place (a photo or quick call is usually enough).',
    'quote.fee.none':'+ €45 visit fee','quote.fee.credited':'Visit fee credited ✓','quote.fee.over':'+ €45 visit fee (credited over €150)','quote.added':'Added to your quote ✓','quote.copied':'Quote copied ✓',

    'contact.title':'Contact','contact.eyebrow':'Let\'s do it','contact.h2':'Tell me what you\'ve got in mind','contact.lede':'One message is all it takes. Describe the place and what you\'d like — a photo helps — and I\'ll come back with a clear, fixed price. No pressure, no jargon.',
    'contact.wa.h':'WhatsApp','contact.wa.p':'Fastest way to reach me. Send a photo of the place and roughly what you need — I usually reply the same day.','contact.wa.btn':'Chat on WhatsApp',
    'contact.em.h':'Email','contact.em.p':'Prefer email, or need a formal quote or invoice details for a business? Drop me a line and I\'ll get back to you.','contact.em.btn':'Email me',
    'contact.cov.eyebrow':'Coverage','contact.cov.h2':'Where I work','contact.cov.lede':'On-site across Greater Lisbon, and remote setup anywhere.'
  },
  pt:{
    'nav.services':'Serviços','nav.quote':'Fazer orçamento','nav.about':'Sobre','nav.contact':'Contacto','nav.home':'Início',
    'nav.wa':'WhatsApp','skip':'Ir para o conteúdo',
    'nf.lede':'Lamentamos, esta página não existe. Pode ter mudado, ou o link foi mal escrito.','nf.home':'Voltar ao início','nf.services':'Ver serviços',
    'foot.tag':'Casa inteligente, Wi-Fi, câmaras & sensores — instalados para si na Grande Lisboa. Um engenheiro acessível, preços fixos e justos.',
    'foot.services':'Serviços','foot.info':'Informação','foot.packages':'Pacotes','foot.pricelist':'Preços','foot.plans':'Planos','foot.quote':'Orçamento',
    'foot.about':'Sobre','foot.faq':'Perguntas','foot.process':'Como funciona','foot.contact':'Contacto',
    'foot.rights':'LusoNetworks — casa inteligente & redes, Lisboa','foot.line':'Grande Lisboa · EN & PT · Preços fixos, sem dependência',
    'foot.remote':'Remoto · qualquer lugar',

    'home.badge':'Disponível agora · Grande Lisboa · EN & PT',
    'home.h1a':'A sua casa, mais inteligente —','home.h1b':'sem complicações',
    'home.sub':'Instalo e configuro dispositivos inteligentes, Wi-Fi mais forte, câmaras e sensores para casas, expats, Airbnbs, hotéis, pequenos comércios e quintas. Preços fixos e justos, linguagem simples, sem dependência.',
    'home.cta.wa':'Fale comigo no WhatsApp','home.cta.quote':'Fazer orçamento →',
    'home.assure1':'Preço fixo acordado antes de começar','home.assure2':'Equipamento ao custo — sem margem','home.assure3':'Nada fica dependente de mim',
    'trust1a':'Feito por estudante de engenharia','trust1b':'· formação real, não adivinhação',
    'trust2a':'Vou','trust2b':'ter consigo','trust2c':'— visitas em toda a Lisboa',
    'trust3a':'Configuração remota','trust3b':'em qualquer lugar','trust4a':'Funciona com os','trust4b':'seus','trust4c':'aparelhos & orçamento',

    'aud.eyebrow':'Quem ajudo','aud.h2':'Feito para lugares reais de Lisboa','aud.lede':'Lugares diferentes, necessidades diferentes. Escolha o que soa a si.',
    'aud.home.t':'Casas & expats','aud.home.d':'Luzes inteligentes, melhor Wi-Fi, campainha com vídeo, uma app que funciona — instalado e explicado em português ou inglês.',
    'aud.rental.t':'Airbnb & alojamento','aud.rental.d':'Fechaduras para check-in autónomo, Wi-Fi de convidados, sensores de ruído e ocupação, alertas de fugas — menos mensagens, menos problemas às 2 da manhã.',
    'aud.hotel.t':'Hotéis & guesthouses','aud.hotel.d':'Wi-Fi fiável em todos os quartos, câmaras nas entradas, monitorização de energia e clima, um painel simples para a equipa.',
    'aud.shop.t':'Comércio & cafés','aud.shop.d':'Câmaras, Wi-Fi de convidados separado da caixa, alarme de temperatura do frigorífico, automações de horários, acesso remoto.',
    'aud.farm.t':'Quintas & exterior','aud.farm.d':'Sensores de solo, depósito e temperatura, rega automática, leituras de longo alcance (LoRa) de campos sem Wi-Fi.',
    'aud.maker.t':'Projetos à medida','aud.maker.d':'Uma ideia específica — um sensor à medida, um painel de dados, uma automação que ninguém vende? Também construo isso.',

    'home.pkg.eyebrow':'Pacotes iniciais','home.pkg.h2':'Combinações populares, um preço claro','home.pkg.lede':'Combinações prontas para os trabalhos mais comuns. Veja todas, e a lista de preços completa, na página de serviços.',
    'home.pkg.cta':'Ver todos os serviços & preços →',

    'home.why.eyebrow':'Porquê eu','home.why.h2':'Um engenheiro a sério, não um faz-tudo qualquer','home.why.lede':'Sou mestrando em Engenharia Informática e de Telecomunicações — é isto que estudo e adoro.',
    'home.why.cta':'Saber mais sobre mim →',

    'home.cta2.eyebrow':'Vamos a isso','home.cta2.h2':'Diga-me o que tem em mente','home.cta2.p':'Basta uma mensagem. Descreva o local e o que gostaria — uma foto ajuda — e eu respondo com um preço fixo e claro.',
    'home.cta2.wa':'Falar no WhatsApp','home.cta2.quote':'Fazer orçamento',

    'svc.title':'Serviços & preços','svc.eyebrow':'Pacotes','svc.h2':'Combinações populares, um preço claro','svc.lede':'Combinações prontas para os trabalhos mais comuns. A mão-de-obra é fixa; os equipamentos são à parte e sempre mostrados ao custo. Misture — ou faça o seu próprio orçamento.',
    'svc.mostbooked':'Mais pedido','svc.startwith':'Começar por aqui','svc.labour':'mão-de-obra','svc.from':'desde',
    'pkg.home.title':'Casa Inteligente — Início','pkg.rental.title':'Pronto para Airbnb / AL','pkg.farm.title':'Campo & Exterior','pkg.full.title':'Casa Inteligente Completa',
    'plan.home.title':'Casa','plan.host.title':'Anfitrião / AL','plan.biz.title':'Negócios',
    'pkg.home.for':'// casas & principiantes','pkg.rental.for':'// anfitriões & alojamento local','pkg.farm.for':'// terrenos, quintas & produtores','pkg.full.for':'// casa toda, bem feito',
    'pkg.home.l1':'Luzes e tomadas inteligentes nas divisões principais','pkg.home.l2':'Assistente de voz (Alexa / Google / app Casa)','pkg.home.l3':'“Cenários” de um toque — sair, cinema, boa noite','pkg.home.l4':'Tudo explicado + um guia escrito',
    'pkg.rental.l1':'Fechadura com teclado para check-in autónomo','pkg.rental.l2':'Wi-Fi de convidados rápido, separado da sua rede','pkg.rental.l3':'Sensor de ruído & ocupação (privado, sem câmaras dentro)','pkg.rental.l4':'Alerta de fuga de água no telemóvel','pkg.rental.l5':'Guia de entrega para hóspedes & limpeza',
    'pkg.farm.l1':'Sensores de humidade do solo, temperatura & humidade','pkg.farm.l2':'Monitorização de depósito / nível de água','pkg.farm.l3':'Leituras de longo alcance (LoRa) onde não há Wi-Fi','pkg.farm.l4':'Alertas & um painel simples no telemóvel',
    'pkg.full.l1':'Wi-Fi em toda a casa, chega a todos os cantos','pkg.full.l2':'Luzes, tomadas, termostato & estores automatizados','pkg.full.l3':'Campainha com vídeo + uma câmara ou duas','pkg.full.l4':'Central local (Home Assistant) — privada, funciona offline','pkg.full.l5':'Automações à medida da sua rotina',

    'svc.pl.eyebrow':'Lista de preços à la carte','svc.pl.h2':'Cada serviço, cada preço — à frente','svc.pl.lede':'Estes são preços de mão-de-obra. Quando vê um intervalo, reflete o tamanho do trabalho — recebe sempre um valor fixo no seu orçamento. Os equipamentos são comprados ao custo, sem margem, e aprova a lista primeiro.',
    'svc.chip1a':'taxa de deslocação','svc.chip1b':'creditada em trabalhos acima de €150','svc.chip2a':'Grátis','svc.chip2b':'videochamada rápida para avaliar trabalhos pequenos','svc.chip3':'Preços de Ago 2026 · confirmados no seu orçamento',
    'svc.plan.eyebrow':'Planos (opcional)','svc.plan.h2':'Mantê-lo a funcionar — sem esforço','svc.plan.lede':'Instalações pontuais não precisam de plano. Mas se prefere que alguém tome conta, atualize e atenda o telefone, estes são mensais. Cancela quando quiser.',
    'svc.plan.mo':'/mês',
    'plan.home.p':'Para uma casa inteligente sem preocupações.','plan.home.l1':'Verificações & atualizações remotas','plan.home.l2':'Ajuda prioritária por WhatsApp','plan.home.l3':'Uma reparação remota grátis por mês','plan.home.l4':'10% de desconto em trabalhos novos',
    'plan.host.p':'Para anfitriões que não podem ter falhas entre hóspedes.','plan.host.l1':'Tudo do plano Casa','plan.host.l2':'Monitorização de fechaduras, Wi-Fi & sensores','plan.host.l3':'Resposta remota no próprio dia','plan.host.l4':'Uma visita por trimestre incluída',
    'plan.biz.p':'Para comércio, cafés & guesthouses que dependem disto.','plan.biz.l1':'Tudo do plano Anfitrião','plan.biz.l2':'Câmaras & rede monitorizadas','plan.biz.l3':'Visita mensal ao local','plan.biz.l4':'Prioridade no agendamento de trabalhos',
    'svc.proc.eyebrow':'Como funciona','svc.proc.h2':'Da primeira mensagem ao concluído','svc.proc.lede':'Sem contador à hora, sem surpresas. Quatro passos.',
    'proc.1.t':'Diga olá','proc.1.d':'Mande mensagem no WhatsApp ou faça um orçamento. Diga-me o local e o que gostaria — uma foto ajuda.',
    'proc.2.t':'Orçamento fixo','proc.2.d':'Recebe um preço claro para o trabalho, mais uma lista de equipamentos ao custo. Nada começa sem o seu sim.',
    'proc.3.t':'Eu instalo','proc.3.d':'Vou ter consigo, configuro tudo, testo e explico-lhe. Limpo, discreto, com respeito pelo seu espaço.',
    'proc.4.t':'Fica coberto','proc.4.d':'Duas semanas de ajustes grátis após qualquer trabalho. Adicione um plano depois se quiser tranquilidade contínua.',

    'about.title':'Sobre a LusoNetworks','about.eyebrow':'Porquê eu','about.h2':'Um engenheiro a sério, não um faz-tudo qualquer',
    'about.p1':'Sou mestrando em Engenharia Informática e de Telecomunicações em Lisboa, e isto é o que estudo e adoro — IoT, sensores, sistemas embebidos, redes e automação. Faço projetos de eletrónica por gosto.',
    'about.p2':'Isso significa duas coisas para si: percebo porque é que o seu Wi-Fi cai ou o sensor não liga, e configuro tudo para que fique no controlo — normas abertas, as suas contas, sem dependência de mim. Se eu desaparecer, tudo continua a funcionar.',
    'about.p3':'Mantenho os preços justos porque estou a construir reputação, não a explorar clientes. Trabalho honesto, explicado em linguagem simples, em português ou inglês.',
    'about.card.h':'Com o que pode contar','about.stat1':'margem em equipamento','about.stat2':'dias de ajustes grátis','about.stat3':'línguas — PT & EN','about.stat4':'pessoa — fala sempre comigo',
    'about.card.p':'Totalmente móvel — vou ter consigo a qualquer ponto da Grande Lisboa, e faço trabalhos remotos para clientes mais longe.',
    'faq.eyebrow':'Boas perguntas','faq.h2':'O que costumam perguntar',
    'faq.q1':'Também pago os equipamentos?','faq.a1':'Sim — mas ao custo, sem qualquer margem. Dou-lhe uma lista de compras (ou compro por si e mostro os recibos). O meu preço é só pelo trabalho. Fica dono de tudo, ligado às suas contas, não às minhas.',
    'faq.q2':'O que é a taxa de €45?','faq.a2':'Cobre a deslocação e o diagnóstico correto da sua instalação. Se avançar com qualquer trabalho acima de €150, é descontada do preço — por isso na maioria dos casos sai de graça.',
    'faq.q3':'Fala português e inglês?','faq.a3':'Ambos, fluentemente. Muitos clientes são expats ou anfitriões que querem alguém que explique bem em inglês — mas sou local, por isso português não é problema.',
    'faq.q4':'E se me mudar, ou quiser alterar depois?','faq.a4':'Tudo o que instalo usa tecnologia aberta e padrão, ligada às suas contas — sem dependência. Pode levar consigo, dar a outro técnico, ou voltar a chamar-me. À sua escolha.',
    'faq.q5':'Tem seguro / é um negócio a sério?','faq.a5':'Passo recibo e trabalho como técnico independente registado em Portugal. Para empresas que precisem de detalhes (seguro, faturação), é só pedir e trato disso antes de começar.',
    'faq.q6':'Que zonas cobre?','faq.a6':'No local em toda a Grande Lisboa — a cidade mais Cascais, Sintra, Oeiras, Almada, Loures e arredores. Mais longe, muitas vezes faço tudo remotamente.',
    'faq.q7':'Em quanto tempo pode vir?','faq.a7':'Normalmente em poucos dias, muitas vezes mais cedo para trabalhos pequenos. Mande mensagem no WhatsApp com o que precisa e onde, e dou-lhe um horário.',

    'quote.title':'Fazer orçamento','quote.eyebrow':'Estimativa instantânea','quote.h2':'Faça o seu orçamento','quote.lede':'Toque no que lhe interessa. Recebe um preço aproximado de mão-de-obra e pode enviá-lo diretamente para mim no WhatsApp — confirmo o valor exato depois de ver.',
    'quote.sum.h':'A sua estimativa','quote.sum.empty':'Ainda nada selecionado — escolha alguns itens à esquerda.','quote.sum.total':'Mão-de-obra (uma vez)',
    'quote.sum.send':'Enviar isto para mim','quote.sum.copy':'Copiar orçamento',
    'quote.fine':'Apenas estimativa — mão-de-obra, sem equipamentos. O preço fixo final é confirmado depois de ver o local (uma foto ou chamada rápida costuma bastar).',
    'quote.fee.none':'+ €45 taxa de deslocação','quote.fee.credited':'Taxa de deslocação creditada ✓','quote.fee.over':'+ €45 deslocação (creditada acima de €150)','quote.added':'Adicionado ao orçamento ✓','quote.copied':'Orçamento copiado ✓',

    'contact.title':'Contacto','contact.eyebrow':'Vamos a isso','contact.h2':'Diga-me o que tem em mente','contact.lede':'Basta uma mensagem. Descreva o local e o que gostaria — uma foto ajuda — e eu respondo com um preço fixo e claro. Sem pressão, sem jargão.',
    'contact.wa.h':'WhatsApp','contact.wa.p':'A forma mais rápida de me contactar. Envie uma foto do local e mais ou menos o que precisa — costumo responder no próprio dia.','contact.wa.btn':'Falar no WhatsApp',
    'contact.em.h':'Email','contact.em.p':'Prefere email, ou precisa de um orçamento formal ou dados de faturação para uma empresa? Escreva-me e eu respondo.','contact.em.btn':'Enviar email',
    'contact.cov.eyebrow':'Cobertura','contact.cov.h2':'Onde trabalho','contact.cov.lede':'No local em toda a Grande Lisboa, e configuração remota em qualquer lugar.'
  }
};

let LANG = 'en';
function getSavedLang(){ try{ return localStorage.getItem('luso-lang'); }catch{ return null; } }
function applyLang(lang){
  LANG = (lang==='pt')?'pt':'en';
  const dict = I18N[LANG];
  document.documentElement.setAttribute('lang', LANG);
  $$('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if(dict[k]!=null) el.textContent = dict[k]; });
  $$('[data-i18n-attr]').forEach(el=>{
    el.getAttribute('data-i18n-attr').split(',').forEach(pair=>{
      const [attr,key]=pair.split(':'); if(dict[key]!=null) el.setAttribute(attr.trim(), dict[key]);
    });
  });
  const cur = $('#lang .cur'), oth = $('#lang .oth');
  if(cur&&oth){ cur.textContent = LANG.toUpperCase(); oth.textContent = LANG==='en'?'PT':'EN'; }
  // re-render dynamic bits that carry catalog text
  if($('#price-cats')) renderPriceList();
  if($('#quote-pick')){ renderQuote(); recalc(); }
  updateContactLinks();
}
function t(k){ return I18N[LANG][k] ?? k; }
function nm(i){ return LANG==='pt' && i.name_pt ? i.name_pt : i.name; }
function unitOf(i){ return LANG==='pt' && i.unit_pt ? i.unit_pt : i.unit; }
function descOf(i){ return LANG==='pt' && i.desc_pt ? i.desc_pt : i.desc; }
/* price shown for an item: range "€X–€Y", monthly "€X/mo", per-unit "€X / unit", else "from €X".
   `small`=true wraps the suffix in <small> for the price-list; false = plain text for the quote list. */
function priceText(i, small){
  const S = small ? (s=>'<small>'+s+'</small>') : (s=>s);
  if(i.kind==='monthly') return euros(i.price)+S(t('svc.plan.mo'));
  const u = unitOf(i);
  const base = i.to ? (euros(i.price)+'–'+euros(i.to).replace('€','')) : euros(i.price);
  if(u) return base+S(' / '+u);            // per-unit (with or without a range)
  if(i.to) return base;                    // range, no unit
  return S(t('svc.from')+' ')+euros(i.price); // single price, shown as "from €X"
}

/* ---- contact links ---- */
function waLink(text){ return 'https://wa.me/'+WA_NUMBER+(text?('?text='+encodeURIComponent(text)):''); }
function updateContactLinks(){
  const hello = LANG==='pt'
    ? 'Olá! Encontrei o site da LusoNetworks e gostava de perguntar sobre um trabalho.'
    : 'Hi! I found the LusoNetworks site and I\'d like to ask about a job.';
  $$('[data-wa]').forEach(a=>{ if(!a.classList.contains('js-quote-wa')) a.href = waLink(hello); });
  $$('[data-email]').forEach(a=>{
    const subj = LANG==='pt' ? 'LusoNetworks — pedido de orçamento' : 'LusoNetworks — quote request';
    a.href = 'mailto:'+CONTACT_EMAIL+'?subject='+encodeURIComponent(subj);
  });
}

/* ---- price list (services page) ---- */
function renderPriceList(){
  const host = $('#price-cats'); if(!host) return;
  const groups = GROUP_ORDER.filter(g=>g!=='g-pkg');
  host.innerHTML = groups.map(g=>{
    const items = CATALOG.filter(i=>i.group===g); if(!items.length) return '';
    const rows = items.map(i=>{
      const d = descOf(i);
      return `<div class="price-row"><div class="name">${nm(i)}${d?`<span>${d}</span>`:''}</div><div class="amt">${priceText(i,true)}</div></div>`;
    }).join('');
    return `<div class="price-card reveal"><h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${GROUP_ICON[g]||''}"/></svg>${GROUP_LABEL[g][LANG]}</h3>${rows}</div>`;
  }).join('');
  revealScan();
}

/* ---- quote builder (quote page) ---- */
const qty = {};
function renderQuote(){
  const host = $('#quote-pick'); if(!host) return;
  host.innerHTML = GROUP_ORDER.map(g=>{
    const items = CATALOG.filter(i=>i.group===g); if(!items.length) return '';
    const rows = items.map(i=>{
      return `<div class="qitem${qty[i.id]>0?' on':''}" data-id="${i.id}">
        <div class="qname">${nm(i)}<small>${priceText(i,false)}</small></div>
        <div class="stepper">
          <button type="button" data-act="dec" ${qty[i.id]>0?'':'disabled'} aria-label="−">−</button>
          <span class="val" data-val>${qty[i.id]||0}</span>
          <button type="button" data-act="inc" aria-label="+">+</button>
        </div></div>`;
    }).join('');
    return `<div class="qgroup"><h4>${GROUP_LABEL[g][LANG]}</h4>${rows}</div>`;
  }).join('');
  if(!host.dataset.bound){
    host.dataset.bound='1';
    host.addEventListener('click', e=>{
      const btn=e.target.closest('button[data-act]'); if(!btn) return;
      const row=btn.closest('.qitem'); const id=row.dataset.id;
      qty[id]=Math.max(0,(qty[id]||0)+(btn.dataset.act==='inc'?1:-1));
      row.querySelector('[data-val]').textContent=qty[id];
      row.classList.toggle('on',qty[id]>0);
      row.querySelector('[data-act=dec]').disabled=qty[id]===0;
      recalc();
    });
  }
}
function curLines(){ return CATALOG.filter(i=>qty[i.id]>0).map(i=>({item:i,n:qty[i.id],sum:i.price*qty[i.id]})); }
function recalc(){
  if(!$('#quote-pick')) return;
  const lines=curLines();
  const oneoff=lines.filter(l=>l.item.kind==='oneoff');
  const monthly=lines.filter(l=>l.item.kind==='monthly');
  const total=oneoff.reduce((a,l)=>a+l.sum,0);
  const mon=monthly.reduce((a,l)=>a+l.sum,0);
  const box=$('#sum-lines');
  if(!lines.length){ box.innerHTML=`<p class="sum-empty">${t('quote.sum.empty')}</p>`; }
  else{ box.innerHTML=lines.map(l=>`<div class="sum-line"><span class="l">${nm(l.item)}${l.n>1?' ×'+l.n:''}</span><span class="r">${euros(l.sum)}${l.item.kind==='monthly'?(LANG==='pt'?'/mês':'/mo'):''}</span></div>`).join(''); }
  $('#sum-total').textContent=euros(total);
  $('#sum-sub').textContent = total===0?t('quote.fee.none'):(total>CREDIT_THRESHOLD?t('quote.fee.credited'):t('quote.fee.over'));
  $('#sum-monthly').textContent = mon>0?('+ '+euros(mon)+(LANG==='pt'?'/mês':'/mo')+(LANG==='pt'?' plano':' care plan')):'';
  const wa=$('#quote-wa'); if(wa) wa.href=waLink(buildQuoteText(lines,total,mon));
}
function buildQuoteText(lines,total,mon){
  if(!lines.length) return LANG==='pt'?'Olá! Gostava de um orçamento.':'Hi! I\'d like a quote.';
  let x = LANG==='pt'?'Olá! Fiz este orçamento no site da LusoNetworks:\n\n':'Hi! I built this quote on the LusoNetworks site:\n\n';
  lines.forEach(l=>{ x+=`• ${nm(l.item)}${l.n>1?' ×'+l.n:''} — ${euros(l.sum)}${l.item.kind==='monthly'?(LANG==='pt'?'/mês':'/mo'):''}\n`; });
  x += (LANG==='pt'?'\nEstimativa de mão-de-obra: ':'\nLabour estimate: ')+euros(total);
  if(total<=CREDIT_THRESHOLD) x+=(LANG==='pt'?` (+€${CALLOUT_FEE} deslocação)`:` (+€${CALLOUT_FEE} visit fee)`);
  if(mon>0) x+=(LANG==='pt'?`\nPlano: ${euros(mon)}/mês`:`\nCare plan: ${euros(mon)}/month`);
  x += (LANG==='pt'?'\n\nO meu local é em: ____\nPode confirmar um preço? Obrigado!':'\n\nMy place is in: ____\nCould you confirm a price? Thanks!');
  return x;
}

/* ---- toast ---- */
let toastT;
function showToast(msg){ const el=$('#toast'); if(!el) return; el.textContent=msg; el.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),2200); }

/* ---- reveal ---- */
let revealObs;
function revealScan(){
  const els=$$('.reveal:not(.in)');
  if(reduced||!('IntersectionObserver'in window)){ els.forEach(e=>e.classList.add('in')); return; }
  if(!revealObs){ revealObs=new IntersectionObserver((es,o)=>{ es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); o.unobserve(en.target); } }); },{rootMargin:'0px 0px -8% 0px'}); }
  els.forEach(e=>revealObs.observe(e));
}

/* ===================== INIT (on DOM ready) ===================== */
document.addEventListener('DOMContentLoaded', ()=>{
  // year
  $$('#year, .year').forEach(el=>el.textContent=new Date().getFullYear());

  // theme (dark default; toggle to light, persisted)
  const root=document.documentElement;
  let savedTheme=null; try{ savedTheme=localStorage.getItem('luso-theme'); }catch{}
  if(savedTheme==='light') root.setAttribute('data-theme','light');
  const themeBtn=$('#theme');
  if(themeBtn) themeBtn.addEventListener('click', ()=>{
    const light = root.getAttribute('data-theme')==='light';
    if(light){ root.removeAttribute('data-theme'); try{localStorage.setItem('luso-theme','dark');}catch{} }
    else { root.setAttribute('data-theme','light'); try{localStorage.setItem('luso-theme','light');}catch{} }
  });

  // language
  const startLang = getSavedLang() || 'en';
  applyLang(startLang);
  const langBtn=$('#lang');
  if(langBtn) langBtn.addEventListener('click', ()=>{ const next=LANG==='en'?'pt':'en'; try{localStorage.setItem('luso-lang',next);}catch{} applyLang(next); });

  // mobile nav
  const nt=$('#navtoggle'), nl=$('#navlinks');
  if(nt&&nl){
    const set=o=>{ nt.setAttribute('aria-expanded',String(o)); nl.classList.toggle('open',o); };
    nt.addEventListener('click',()=>set(nt.getAttribute('aria-expanded')!=='true'));
    nl.addEventListener('click',e=>{ if(e.target.closest('a')) set(false); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') set(false); });
  }

  // copy quote
  const cb=$('#copy-btn');
  if(cb) cb.addEventListener('click', async ()=>{
    const lines=curLines();
    const total=lines.filter(l=>l.item.kind==='oneoff').reduce((a,l)=>a+l.sum,0);
    const mon=lines.filter(l=>l.item.kind==='monthly').reduce((a,l)=>a+l.sum,0);
    try{ await navigator.clipboard.writeText(buildQuoteText(lines,total,mon)); showToast(t('quote.copied')); }
    catch{ showToast(LANG==='pt'?'Prima Ctrl/Cmd+C':'Press Ctrl/Cmd+C'); }
  });

  // add-from-package (services page buttons pointing at quote page carry ?add=)
  const params=new URLSearchParams(location.search);
  const add=params.get('add');
  if(add && $('#quote-pick')){ qty[add]=(qty[add]||0)+1; renderQuote(); recalc();
    const el=$('#quote'); if(el) setTimeout(()=>el.scrollIntoView({behavior:reduced?'auto':'smooth'}),120);
  }

  // reveal + scroll-spy
  revealScan();
  const links=$$('#navlinks a'); const map={};
  links.forEach(a=>{ const id=(a.getAttribute('data-spy')||''); if(id){ const s=document.getElementById(id); if(s) map[id]=a; } });
  if(Object.keys(map).length){
    const obs=new IntersectionObserver(es=>{ es.forEach(en=>{ if(en.isIntersecting){ links.forEach(a=>a.classList.remove('active')); if(map[en.target.id]) map[en.target.id].classList.add('active'); } }); },{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(map).forEach(id=>obs.observe(document.getElementById(id)));
  }

  // hero canvas
  initSignal();
});

/* ---- hero signal-field canvas ---- */
function initSignal(){
  const cv=$('#signal'); if(!cv) return;
  if(reduced){ cv.style.display='none'; return; }
  const ctx=cv.getContext('2d'); let w,h,dpr,nodes,raf;
  const COUNT=()=>Math.min(52,Math.round(window.innerWidth/26));
  const color=()=>getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()||'#22c6e6';
  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2); w=cv.clientWidth; h=cv.clientHeight;
    cv.width=w*dpr; cv.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=COUNT();
    nodes=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.6+1}));
  }
  function step(){
    ctx.clearRect(0,0,w,h); const c=color();
    for(const p of nodes){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1; }
    for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
      if(d<130){ ctx.globalAlpha=(1-d/130)*.3; ctx.strokeStyle=c; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    }
    ctx.globalAlpha=.8; ctx.fillStyle=c;
    for(const p of nodes){ ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); }
    ctx.globalAlpha=1; raf=requestAnimationFrame(step);
  }
  resize(); step();
  let rt; window.addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(resize,200); });
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) cancelAnimationFrame(raf); else step(); });
}
