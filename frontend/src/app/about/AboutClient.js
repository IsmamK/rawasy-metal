"use client";

import React, { useMemo, useState } from "react";
import {
  FiAward,
  FiCheckCircle,
  FiEdit2,
  FiGlobe,
  FiHeart,
  FiLayers,
  FiPlus,
  FiSave,
  FiShield,
  FiStar,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import useEditableContent from "@/hooks/useEditableContent";
import PageBackdrop from "@/components/PageBackdrop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const ICON_OPTIONS = {
  FiAward,
  FiShield,
  FiLayers,
  FiUsers,
  FiGlobe,
  FiStar,
  FiCheckCircle,
  FiHeart,
};

const DEFAULT_DATA = {
  image: "/curtains-background.png",
  translations: {
    EN: {
      badge: "About SKF Curtains",
      title: "Curtains Tailored to the Way You Live and Work",
      intro:
        "SKF Curtains is a curtain-focused interiors partner for homes, offices, hospitals, clinics, hotels and commercial spaces — helping you choose fabrics, tracks, and finishes that balance beauty, privacy, durability, and everyday performance.",
      storyTitle: "Our Story",
      story:
        "SKF Curtains started with a simple observation: most people choose curtains last, after the paint and the furniture, and end up settling for whatever fits the window. We wanted to flip that — treating curtains as a real design decision with real consequences for light, privacy, noise, and comfort. Today we guide homeowners, facility managers, and business owners through that decision from the first material sample to the final fitted install, across residential rooms, medical and clinical spaces, offices, and hospitality interiors.",
      capabilitiesTitle: "What We Can Help You With",
      capabilitiesIntro:
        "From the first conversation about your space to the final installed curtain, our capabilities cover the complete journey.",
      valuesTitle: "Why Customers Choose Us",
      statsTitle: "SKF Curtains at a Glance",
      stats: [
        { value: "4", label: "Specialty Categories" },
        { value: "100%", label: "Custom-Made Solutions" },
        { value: "6", label: "Languages Supported" },
        { value: "1:1", label: "Personal Consultations" },
      ],
      ctaTitle: "Need Help Choosing the Right Curtain?",
      ctaText:
        "Explore our collections or contact our team for guidance based on your room, purpose, style, and privacy requirements.",
      ctaButton: "View Collections",
      capabilities: [
        {
          icon: "FiLayers",
          title: "Residential Curtains",
          description:
            "Curtain options for living rooms, bedrooms, dining spaces, and every other corner of the home.",
        },
        {
          icon: "FiShield",
          title: "Medical Privacy Curtains",
          description:
            "Practical, easy-to-clean curtain systems for hospitals, clinics, treatment rooms, and patient areas.",
        },
        {
          icon: "FiGlobe",
          title: "Office & Commercial Solutions",
          description:
            "Professional blinds and curtains designed for offices, meeting rooms, hotels, and commercial interiors.",
        },
        {
          icon: "FiAward",
          title: "Custom Guidance",
          description:
            "One-on-one support on curtain type, material, color, privacy, light control, and functional requirements.",
        },
      ],
      values: [
        "Curtain-focused product knowledge, not a general home-goods afterthought",
        "Proven solutions for both residential and commercial spaces",
        "Clear, honest information before you commit to a purchase",
        "Custom options tailored to your room's exact requirements",
        "Support that continues after installation, not just before the sale",
      ],
      processTitle: "How We Work",
      processIntro:
        "A straightforward path from first measurement to finished install.",
      process: [
        {
          title: "Consultation & Measurement",
          description:
            "We visit or review your space, take precise measurements, and talk through light, privacy, and style needs.",
        },
        {
          title: "Fabric & Style Selection",
          description:
            "You choose from curated fabrics, colors, and track systems suited to your room and budget.",
        },
        {
          title: "Custom Fabrication",
          description:
            "Every curtain is cut and sewn to your exact window dimensions, not a standard off-the-shelf size.",
        },
        {
          title: "Professional Installation",
          description:
            "Our team fits tracks and curtains on site and checks everything operates smoothly before we leave.",
        },
      ],
    },

    DE: {
      badge: "Über SKF Curtains",
      title: "Vorhänge, die zu Ihrem Leben und Arbeiten passen",
      intro:
        "SKF Curtains ist Ihr auf Vorhänge spezialisierter Partner für Wohnungen, Büros, Krankenhäuser, Kliniken, Hotels und Gewerbeflächen — wir helfen Ihnen, Stoffe, Schienen und Ausführungen zu wählen, die Schönheit, Privatsphäre, Haltbarkeit und Alltagstauglichkeit vereinen.",
      storyTitle: "Unsere Geschichte",
      story:
        "SKF Curtains entstand aus einer einfachen Beobachtung: Die meisten Menschen entscheiden sich erst ganz am Ende für Vorhänge, nach Farbe und Möbeln, und nehmen dann, was gerade passt. Wir wollten das ändern und Vorhänge als echte Gestaltungsentscheidung behandeln, mit spürbaren Folgen für Licht, Privatsphäre, Lärm und Komfort. Heute begleiten wir Privatkunden, Facility-Manager und Unternehmen von der ersten Stoffprobe bis zur fertigen Montage – in Wohnräumen, medizinischen und klinischen Bereichen, Büros und Hotelinterieurs.",
      capabilitiesTitle: "Wobei wir Ihnen helfen können",
      capabilitiesIntro:
        "Vom ersten Gespräch über Ihren Raum bis zum fertig montierten Vorhang begleiten wir Sie durch den gesamten Prozess.",
      valuesTitle: "Warum Kunden uns wählen",
      statsTitle: "SKF Curtains auf einen Blick",
      stats: [
        { value: "4", label: "Spezialkategorien" },
        { value: "100%", label: "Individuelle Lösungen" },
        { value: "6", label: "Unterstützte Sprachen" },
        { value: "1:1", label: "Persönliche Beratung" },
      ],
      ctaTitle: "Brauchen Sie Hilfe bei der Auswahl?",
      ctaText:
        "Entdecken Sie unsere Kollektionen oder kontaktieren Sie unser Team für eine Beratung passend zu Raum, Zweck, Stil und Privatsphäre.",
      ctaButton: "Kollektionen ansehen",
      capabilities: [
        {
          icon: "FiLayers",
          title: "Wohnvorhänge",
          description:
            "Vorhangoptionen für Wohnzimmer, Schlafzimmer, Essbereiche und jeden weiteren Wohnraum.",
        },
        {
          icon: "FiShield",
          title: "Medizinische Sichtschutzvorhänge",
          description:
            "Praktische, leicht zu reinigende Vorhangsysteme für Krankenhäuser, Kliniken, Behandlungsräume und Patientenbereiche.",
        },
        {
          icon: "FiGlobe",
          title: "Büro- und Gewerbelösungen",
          description:
            "Professionelle Jalousien und Vorhänge für Büros, Besprechungsräume, Hotels und Gewerberäume.",
        },
        {
          icon: "FiAward",
          title: "Individuelle Beratung",
          description:
            "Persönliche Unterstützung bei Typ, Material, Farbe, Privatsphäre und Lichtkontrolle.",
        },
      ],
      values: [
        "Spezialwissen rund um Vorhänge statt Nebensache im Sortiment",
        "Bewährte Lösungen für private und gewerbliche Räume",
        "Klare, ehrliche Informationen vor dem Kauf",
        "Individuelle Optionen genau für Ihren Raum",
        "Betreuung, die auch nach der Montage weitergeht",
      ],
      processTitle: "So arbeiten wir",
      processIntro:
        "Ein klarer Weg vom ersten Aufmaß bis zur fertigen Montage.",
      process: [
        {
          title: "Beratung & Aufmaß",
          description:
            "Wir besuchen oder prüfen Ihren Raum, nehmen präzise Maße und besprechen Licht, Privatsphäre und Stil.",
        },
        {
          title: "Stoff- und Stilauswahl",
          description:
            "Sie wählen aus kuratierten Stoffen, Farben und Schienensystemen passend zu Raum und Budget.",
        },
        {
          title: "Individuelle Fertigung",
          description:
            "Jeder Vorhang wird exakt nach Ihren Fenstermaßen zugeschnitten und genäht, keine Standardgröße.",
        },
        {
          title: "Professionelle Montage",
          description:
            "Unser Team montiert Schienen und Vorhänge vor Ort und prüft die einwandfreie Funktion.",
        },
      ],
    },

    AR: {
      badge: "عن SKF Curtains",
      title: "ستائر مصممة لتناسب أسلوب حياتك وعملك",
      intro:
        "SKF Curtains شريكك المتخصص في الستائر للمنازل والمكاتب والمستشفيات والعيادات والفنادق والمساحات التجارية — نساعدك على اختيار الأقمشة والسكك والتشطيبات التي تجمع بين الجمال والخصوصية والمتانة والأداء اليومي.",
      storyTitle: "قصتنا",
      story:
        "بدأت SKF Curtains من ملاحظة بسيطة: معظم الناس يختارون الستائر في آخر لحظة، بعد الدهان والأثاث، وينتهي بهم الأمر بما يناسب النافذة فقط. أردنا تغيير ذلك، والتعامل مع الستائر كقرار تصميم حقيقي له تأثير فعلي على الإضاءة والخصوصية والضجيج والراحة. اليوم نرافق أصحاب المنازل ومديري المرافق وأصحاب الأعمال في هذه الرحلة، من أول عينة قماش وحتى التركيب النهائي، عبر الغرف المنزلية والمساحات الطبية والعيادات والمكاتب وديكورات الضيافة.",
      capabilitiesTitle: "كيف يمكننا مساعدتك",
      capabilitiesIntro:
        "من أول حديث عن مساحتك وحتى تركيب الستارة النهائي، تغطي قدراتنا الرحلة الكاملة.",
      valuesTitle: "لماذا يختارنا العملاء",
      statsTitle: "SKF Curtains في لمحة",
      stats: [
        { value: "4", label: "فئات متخصصة" },
        { value: "100%", label: "حلول مخصصة بالكامل" },
        { value: "6", label: "لغات مدعومة" },
        { value: "1:1", label: "استشارات شخصية" },
      ],
      ctaTitle: "هل تحتاج إلى مساعدة في اختيار الستارة المناسبة؟",
      ctaText:
        "استكشف مجموعاتنا أو تواصل مع فريقنا للحصول على إرشاد يناسب الغرفة والغرض والأسلوب ومتطلبات الخصوصية.",
      ctaButton: "عرض المجموعات",
      capabilities: [
        {
          icon: "FiLayers",
          title: "ستائر منزلية",
          description:
            "خيارات ستائر لغرف المعيشة وغرف النوم وغرف الطعام وبقية مساحات المنزل.",
        },
        {
          icon: "FiShield",
          title: "ستائر خصوصية طبية",
          description:
            "أنظمة ستائر عملية وسهلة التنظيف للمستشفيات والعيادات وغرف العلاج ومناطق المرضى.",
        },
        {
          icon: "FiGlobe",
          title: "حلول المكاتب والمساحات التجارية",
          description:
            "ستائر وبلاندات احترافية للمكاتب وغرف الاجتماعات والفنادق والمساحات التجارية.",
        },
        {
          icon: "FiAward",
          title: "إرشاد مخصص",
          description:
            "دعم شخصي في اختيار النوع والخامة واللون والخصوصية والتحكم في الضوء.",
        },
      ],
      values: [
        "معرفة متخصصة بالستائر، وليست تفصيلاً ثانوياً ضمن منتجات أخرى",
        "حلول مثبتة للمساحات السكنية والتجارية على حد سواء",
        "معلومات واضحة وصادقة قبل اتخاذ قرار الشراء",
        "خيارات مخصصة تناسب متطلبات غرفتك بدقة",
        "دعم يستمر بعد التركيب وليس فقط قبل البيع",
      ],
      processTitle: "كيف نعمل",
      processIntro: "مسار واضح من أول قياس وحتى التركيب النهائي.",
      process: [
        {
          title: "الاستشارة والقياس",
          description:
            "نزور أو نراجع مساحتك، ونأخذ قياسات دقيقة، ونناقش احتياجات الإضاءة والخصوصية والأسلوب.",
        },
        {
          title: "اختيار القماش والتصميم",
          description:
            "تختار من بين أقمشة وألوان وأنظمة سكك منتقاة تناسب غرفتك وميزانيتك.",
        },
        {
          title: "التصنيع المخصص",
          description:
            "يتم قص وخياطة كل ستارة وفق أبعاد نافذتك الدقيقة، وليس بمقاس جاهز موحّد.",
        },
        {
          title: "التركيب الاحترافي",
          description:
            "يقوم فريقنا بتركيب السكك والستائر في الموقع والتأكد من عملها بسلاسة قبل المغادرة.",
        },
      ],
    },

    FR: {
      badge: "À propos de SKF Curtains",
      title: "Des rideaux pensés pour votre vie et votre travail",
      intro:
        "SKF Curtains est votre partenaire spécialisé en rideaux pour les maisons, bureaux, hôpitaux, cliniques, hôtels et espaces commerciaux — nous vous aidons à choisir tissus, rails et finitions alliant esthétique, intimité, durabilité et usage quotidien.",
      storyTitle: "Notre histoire",
      story:
        "SKF Curtains est né d'un constat simple : la plupart des gens choisissent leurs rideaux en dernier, après la peinture et les meubles, et se contentent de ce qui rentre dans la fenêtre. Nous avons voulu inverser cette logique en traitant le rideau comme une véritable décision de design, avec un impact réel sur la lumière, l'intimité, le bruit et le confort. Aujourd'hui, nous accompagnons particuliers, gestionnaires d'établissements et entreprises du premier échantillon de tissu jusqu'à la pose finale, dans les pièces résidentielles, les espaces médicaux et cliniques, les bureaux et les intérieurs hôteliers.",
      capabilitiesTitle: "Comment nous pouvons vous aider",
      capabilitiesIntro:
        "De la première conversation sur votre espace jusqu'à la pose finale, nos compétences couvrent tout le parcours.",
      valuesTitle: "Pourquoi nos clients nous choisissent",
      statsTitle: "SKF Curtains en un coup d'œil",
      stats: [
        { value: "4", label: "Catégories spécialisées" },
        { value: "100%", label: "Solutions sur mesure" },
        { value: "6", label: "Langues prises en charge" },
        { value: "1:1", label: "Conseils personnalisés" },
      ],
      ctaTitle: "Besoin d'aide pour choisir vos rideaux ?",
      ctaText:
        "Découvrez nos collections ou contactez notre équipe pour des conseils adaptés à votre pièce, votre usage, votre style et vos besoins d'intimité.",
      ctaButton: "Voir les collections",
      capabilities: [
        {
          icon: "FiLayers",
          title: "Rideaux résidentiels",
          description:
            "Des options pour les salons, chambres, salles à manger et tous les autres espaces de la maison.",
        },
        {
          icon: "FiShield",
          title: "Rideaux médicaux de confidentialité",
          description:
            "Des systèmes pratiques et faciles à entretenir pour hôpitaux, cliniques, salles de soins et espaces patients.",
        },
        {
          icon: "FiGlobe",
          title: "Solutions bureaux et commerces",
          description:
            "Stores et rideaux professionnels pour bureaux, salles de réunion, hôtels et espaces commerciaux.",
        },
        {
          icon: "FiAward",
          title: "Conseils personnalisés",
          description:
            "Un accompagnement individuel sur le type, le tissu, la couleur, l'intimité et le contrôle de la lumière.",
        },
      ],
      values: [
        "Une expertise dédiée aux rideaux, pas une simple ligne de produit annexe",
        "Des solutions éprouvées pour les espaces résidentiels et commerciaux",
        "Des informations claires et honnêtes avant votre achat",
        "Des options sur mesure adaptées aux exigences précises de votre pièce",
        "Un accompagnement qui continue après la pose, pas seulement avant la vente",
      ],
      processTitle: "Comment nous travaillons",
      processIntro:
        "Un parcours simple, de la première mesure à la pose finale.",
      process: [
        {
          title: "Consultation et mesures",
          description:
            "Nous visitons ou examinons votre espace, prenons des mesures précises et échangeons sur la lumière, l'intimité et le style.",
        },
        {
          title: "Choix du tissu et du style",
          description:
            "Vous choisissez parmi des tissus, couleurs et systèmes de rails sélectionnés, adaptés à votre pièce et votre budget.",
        },
        {
          title: "Fabrication sur mesure",
          description:
            "Chaque rideau est coupé et cousu aux dimensions exactes de votre fenêtre, jamais une taille standard.",
        },
        {
          title: "Installation professionnelle",
          description:
            "Notre équipe pose rails et rideaux sur place et vérifie que tout fonctionne parfaitement avant de partir.",
        },
      ],
    },

    IT: {
      badge: "Chi siamo",
      title: "Tende pensate per il tuo modo di vivere e lavorare",
      intro:
        "SKF Curtains è il tuo partner specializzato in tende per case, uffici, ospedali, cliniche, hotel e spazi commerciali — ti aiutiamo a scegliere tessuti, binari e finiture che uniscono estetica, privacy, durata e praticità quotidiana.",
      storyTitle: "La nostra storia",
      story:
        "SKF Curtains è nata da un'osservazione semplice: la maggior parte delle persone sceglie le tende per ultime, dopo la vernice e i mobili, accontentandosi di ciò che si adatta alla finestra. Abbiamo voluto ribaltare questa logica, trattando la tenda come una vera decisione di design, con conseguenze reali su luce, privacy, rumore e comfort. Oggi accompagniamo privati, responsabili di strutture e aziende dal primo campione di tessuto fino all'installazione finale, in ambienti residenziali, spazi medici e clinici, uffici e interni alberghieri.",
      capabilitiesTitle: "Come possiamo aiutarti",
      capabilitiesIntro:
        "Dalla prima conversazione sul tuo spazio fino alla tenda installata, le nostre competenze coprono l'intero percorso.",
      valuesTitle: "Perché i clienti ci scelgono",
      statsTitle: "SKF Curtains in breve",
      stats: [
        { value: "4", label: "Categorie specializzate" },
        { value: "100%", label: "Soluzioni su misura" },
        { value: "6", label: "Lingue supportate" },
        { value: "1:1", label: "Consulenze personali" },
      ],
      ctaTitle: "Hai bisogno di aiuto per scegliere la tenda giusta?",
      ctaText:
        "Esplora le nostre collezioni o contatta il nostro team per una consulenza basata sul tuo spazio, utilizzo, stile e privacy.",
      ctaButton: "Vedi le collezioni",
      capabilities: [
        {
          icon: "FiLayers",
          title: "Tende residenziali",
          description:
            "Soluzioni per soggiorni, camere da letto, sale da pranzo e ogni altro ambiente domestico.",
        },
        {
          icon: "FiShield",
          title: "Tende mediche per la privacy",
          description:
            "Sistemi pratici e facili da pulire per ospedali, cliniche, sale trattamento e aree pazienti.",
        },
        {
          icon: "FiGlobe",
          title: "Soluzioni per uffici e attività commerciali",
          description:
            "Tende e sistemi professionali per uffici, sale riunioni, hotel e spazi commerciali.",
        },
        {
          icon: "FiAward",
          title: "Consulenza personalizzata",
          description:
            "Supporto individuale nella scelta di tipologia, materiale, colore, privacy e controllo della luce.",
        },
      ],
      values: [
        "Competenza specifica sulle tende, non un dettaglio secondario del catalogo",
        "Soluzioni collaudate per spazi residenziali e commerciali",
        "Informazioni chiare e oneste prima dell'acquisto",
        "Opzioni personalizzate su misura per il tuo ambiente",
        "Assistenza che continua anche dopo l'installazione",
      ],
      processTitle: "Come lavoriamo",
      processIntro:
        "Un percorso semplice, dalla prima misurazione all'installazione finale.",
      process: [
        {
          title: "Consulenza e misurazione",
          description:
            "Visitiamo o esaminiamo il tuo spazio, prendiamo misure precise e parliamo di luce, privacy e stile.",
        },
        {
          title: "Scelta di tessuto e stile",
          description:
            "Scegli tra tessuti, colori e sistemi di binari selezionati, adatti al tuo ambiente e al tuo budget.",
        },
        {
          title: "Fabbricazione su misura",
          description:
            "Ogni tenda è tagliata e cucita secondo le dimensioni esatte della tua finestra, mai una taglia standard.",
        },
        {
          title: "Installazione professionale",
          description:
            "Il nostro team monta binari e tende sul posto e verifica che tutto funzioni perfettamente prima di andare via.",
        },
      ],
    },

    ES: {
      badge: "Sobre SKF Curtains",
      title: "Cortinas pensadas para tu forma de vivir y trabajar",
      intro:
        "SKF Curtains es tu socio especializado en cortinas para hogares, oficinas, hospitales, clínicas, hoteles y espacios comerciales — te ayudamos a elegir telas, rieles y acabados que combinan belleza, privacidad, durabilidad y funcionalidad diaria.",
      storyTitle: "Nuestra historia",
      story:
        "SKF Curtains nació de una observación sencilla: la mayoría de las personas eligen las cortinas al final, después de la pintura y los muebles, y terminan conformándose con lo que encaja en la ventana. Quisimos cambiar eso, tratando la cortina como una verdadera decisión de diseño, con consecuencias reales para la luz, la privacidad, el ruido y el confort. Hoy acompañamos a particulares, gestores de instalaciones y empresas desde la primera muestra de tela hasta la instalación final, en espacios residenciales, médicos y clínicos, oficinas e interiores hoteleros.",
      capabilitiesTitle: "Cómo podemos ayudarte",
      capabilitiesIntro:
        "Desde la primera conversación sobre tu espacio hasta la cortina instalada, nuestras capacidades cubren todo el proceso.",
      valuesTitle: "Por qué nos eligen",
      statsTitle: "SKF Curtains de un vistazo",
      stats: [
        { value: "4", label: "Categorías especializadas" },
        { value: "100%", label: "Soluciones a medida" },
        { value: "6", label: "Idiomas disponibles" },
        { value: "1:1", label: "Asesoría personalizada" },
      ],
      ctaTitle: "¿Necesitas ayuda para elegir la cortina adecuada?",
      ctaText:
        "Explora nuestras colecciones o contacta con nuestro equipo para recibir orientación según tu espacio, uso, estilo y privacidad.",
      ctaButton: "Ver colecciones",
      capabilities: [
        {
          icon: "FiLayers",
          title: "Cortinas residenciales",
          description:
            "Opciones para salas, dormitorios, comedores y cualquier otro espacio del hogar.",
        },
        {
          icon: "FiShield",
          title: "Cortinas médicas de privacidad",
          description:
            "Sistemas prácticos y fáciles de limpiar para hospitales, clínicas, salas de tratamiento y áreas de pacientes.",
        },
        {
          icon: "FiGlobe",
          title: "Soluciones para oficinas y comercios",
          description:
            "Persianas y cortinas profesionales para oficinas, salas de reuniones, hoteles y espacios comerciales.",
        },
        {
          icon: "FiAward",
          title: "Orientación personalizada",
          description:
            "Acompañamiento individual para elegir tipo, material, color, privacidad y control de luz.",
        },
      ],
      values: [
        "Conocimiento especializado en cortinas, no un producto secundario",
        "Soluciones probadas para espacios residenciales y comerciales",
        "Información clara y honesta antes de comprar",
        "Opciones personalizadas ajustadas a tu espacio exacto",
        "Acompañamiento que continúa después de la instalación",
      ],
      processTitle: "Cómo trabajamos",
      processIntro:
        "Un proceso sencillo, desde la primera medición hasta la instalación final.",
      process: [
        {
          title: "Consulta y medición",
          description:
            "Visitamos o revisamos tu espacio, tomamos medidas precisas y hablamos sobre luz, privacidad y estilo.",
        },
        {
          title: "Selección de tela y estilo",
          description:
            "Eliges entre telas, colores y sistemas de rieles seleccionados, adaptados a tu espacio y presupuesto.",
        },
        {
          title: "Fabricación a medida",
          description:
            "Cada cortina se corta y cose según las dimensiones exactas de tu ventana, nunca una talla estándar.",
        },
        {
          title: "Instalación profesional",
          description:
            "Nuestro equipo instala rieles y cortinas en el lugar y verifica que todo funcione perfectamente antes de irse.",
        },
      ],
    },
  },
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const normalizeData = (apiData) => {
  if (!apiData || typeof apiData !== "object") return cloneData(DEFAULT_DATA);

  return {
    ...DEFAULT_DATA,
    ...apiData,
    translations: {
      ...DEFAULT_DATA.translations,
      ...(apiData.translations || {}),
    },
  };
};

const readJsonOrFallback = async (response, fallback) => {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
};

// `initialContent` is the payload the server already fetched.
export default function AboutPage({ initialContent = null }) {
  const { lang } = useLanguage();

  const { isAuthenticated: isAdmin } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const ENDPOINT = `${apiUrl}/about/capabilities/`;

  const { data, setData, tempData, setTempData, isLoading } = useEditableContent(
    ENDPOINT,
    {
      normalize: normalizeData,
      buildFallback: () => cloneData(DEFAULT_DATA),
      initialContent,
    }
  );

  const activeData = editMode ? tempData : data;

  const copy =
    activeData?.translations?.[lang] ||
    activeData?.translations?.EN ||
    DEFAULT_DATA.translations.EN;

  const capabilities = Array.isArray(copy.capabilities)
    ? copy.capabilities
    : [];

  const values = Array.isArray(copy.values) ? copy.values : [];
  const stats = Array.isArray(copy.stats) ? copy.stats : [];
  const processSteps = Array.isArray(copy.process) ? copy.process : [];

  const isRTL = lang === "AR";

  const ensureCurrentLanguageExists = (newData) => {
    if (!newData.translations) {
      newData.translations = {};
    }

    if (!newData.translations[lang]) {
      newData.translations[lang] =
        cloneData(newData.translations.EN) ||
        cloneData(DEFAULT_DATA.translations.EN);
    }

    if (!Array.isArray(newData.translations[lang].capabilities)) {
      newData.translations[lang].capabilities = [];
    }

    if (!Array.isArray(newData.translations[lang].values)) {
      newData.translations[lang].values = [];
    }

    if (!Array.isArray(newData.translations[lang].stats)) {
      newData.translations[lang].stats = [];
    }

    if (!Array.isArray(newData.translations[lang].process)) {
      newData.translations[lang].process = [];
    }

    return newData;
  };

  const handleRootChange = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextChange = (field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang][field] = value;
      return newData;
    });
  };

  const handleCapabilityChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].capabilities[index][field] = value;
      return newData;
    });
  };

  const addCapability = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      newData.translations[lang].capabilities.push({
        icon: "FiStar",
        title: "New Capability",
        description: "Capability description goes here.",
      });

      return newData;
    });
  };

  const removeCapability = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].capabilities.length <= 1) {
        alert("You must keep at least one capability.");
        return prev;
      }

      newData.translations[lang].capabilities = newData.translations[
        lang
      ].capabilities.filter((_, itemIndex) => itemIndex !== index);

      return newData;
    });
  };

  const handleValueChange = (index, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].values[index] = value;
      return newData;
    });
  };

  const addValue = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].values.push("New company value");
      return newData;
    });
  };

  const removeValue = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].values.length <= 1) {
        alert("You must keep at least one company value.");
        return prev;
      }

      newData.translations[lang].values = newData.translations[
        lang
      ].values.filter((_, itemIndex) => itemIndex !== index);

      return newData;
    });
  };

  const handleStatChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].stats[index][field] = value;
      return newData;
    });
  };

  const addStat = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].stats.push({ value: "0", label: "New Stat" });
      return newData;
    });
  };

  const removeStat = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].stats.length <= 1) {
        alert("You must keep at least one stat.");
        return prev;
      }

      newData.translations[lang].stats = newData.translations[
        lang
      ].stats.filter((_, itemIndex) => itemIndex !== index);

      return newData;
    });
  };

  const handleProcessChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].process[index][field] = value;
      return newData;
    });
  };

  const addProcessStep = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].process.push({
        title: "New Step",
        description: "Step description goes here.",
      });
      return newData;
    });
  };

  const removeProcessStep = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].process.length <= 1) {
        alert("You must keep at least one step.");
        return prev;
      }

      newData.translations[lang].process = newData.translations[
        lang
      ].process.filter((_, itemIndex) => itemIndex !== index);

      return newData;
    });
  };

  const toggleEditMode = () => {
    if (!isAdmin) {
      alert("Admin access required. Please log in.");
      return;
    }

    if (editMode) {
      setTempData(cloneData(data));
    }

    setEditMode((prev) => !prev);
  };

  const saveChanges = async () => {
    if (!isAdmin) {
      alert("Authentication required to save changes.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(ENDPOINT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(tempData),
      });

      if (!response.ok) {
        throw new Error("Failed to save about page data");
      }

      const updatedData = await readJsonOrFallback(response, tempData);
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);

      alert("About page updated successfully!");
    } catch (error) {
      console.error("Error saving about page data:", error);
      alert("Failed to save about page.");
    } finally {
      setIsSaving(false);
    }
  };

  const goToCollections = () => {
    window.location.href = "/collections";
  };

  const adminControls = useMemo(() => {
    if (!isAdmin) return null;

    if (editMode) {
      return (
        <div className="flex gap-2">
          <button
            onClick={saveChanges}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center disabled:opacity-60"
            title="Save Changes"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            ) : (
              <FiSave className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={toggleEditMode}
            className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg"
            title="Cancel Editing"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={toggleEditMode}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
        title="Edit Content"
      >
        <FiEdit2 className="w-5 h-5" />
      </button>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, isAdmin, isSaving]);

  if (isLoading) {
    return (
      <section className="relative min-h-screen pb-16 flex items-center justify-center overflow-hidden">
        <PageBackdrop src={DEFAULT_DATA.image} />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]" />
      </section>
    );
  }

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="relative min-h-screen pb-16 overflow-hidden">
      {/* Shared fixed backdrop, same image + treatment used across the rest of the site.
          Left untinted here (dark overlay only lives inside the Hero section below) so
          the light marble/gold backdrop stays visible — and parallaxes — behind every
          other section, matching how AboutFeatures sits on this same image on Home. */}
      <PageBackdrop src={activeData.image || DEFAULT_DATA.image} />

      <div className="relative z-10">
        {/* Admin toggle, fixed so it stays reachable while scrolling a long page */}
        {isAdmin && (
          <div className="fixed top-28 right-4 sm:right-6 z-40">{adminControls}</div>
        )}

        {editMode && (
          <div className="pt-24 mb-6 text-center">
            <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black shadow">
              EDIT MODE ENABLED - Editing {lang}
            </span>
          </div>
        )}

        {/* Hero — starts at the true top of the page (behind the fixed navbar)
            instead of below a pt-24 gap, so the dark overlay meets the navbar
            with no light strip showing through in between. Top padding on the
            inner content clears the navbar height instead. */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/80" />
          <div className="absolute top-10 left-20 w-72 h-72 bg-[#D4AF37]/25 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-[#118a94]/25 rounded-full blur-[140px]" />

          <div className="container relative z-10 mx-auto px-4 pt-28 pb-8 sm:px-6 sm:pt-32 sm:pb-10 text-center lg:px-8 xl:px-20 2xl:px-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl"
            >
              {editMode ? (
                <input
                  value={copy.badge || ""}
                  onChange={(e) => handleTextChange("badge", e.target.value)}
                  className="mx-auto mb-5 block max-w-xs rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] px-4 py-2 text-sm font-semibold text-black outline-none ring-offset-2 focus:ring-2 focus:ring-[#D4AF37]"
                />
              ) : (
                <span className="mb-5 inline-block rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] px-4 py-2 text-sm font-semibold text-black shadow">
                  {copy.badge}
                </span>
              )}

              {editMode ? (
                <input
                  value={copy.title || ""}
                  onChange={(e) => handleTextChange("title", e.target.value)}
                  className="mb-4 mt-3 w-full rounded-xl bg-white/10 px-4 py-3 text-center text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-[#D4AF37] sm:text-3xl lg:text-4xl"
                />
              ) : (
                <h1 className="mb-4 mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                  {copy.title}
                </h1>
              )}

              {editMode ? (
                <textarea
                  value={copy.intro || ""}
                  onChange={(e) => handleTextChange("intro", e.target.value)}
                  rows="5"
                  className="w-full resize-none rounded-xl bg-white/10 px-4 py-3 text-center text-base leading-relaxed text-gray-200 outline-none focus:ring-2 focus:ring-[#D4AF37] sm:text-lg"
                />
              ) : (
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
                  {copy.intro}
                </p>
              )}

              {!editMode && (
                <button
                  onClick={goToCollections}
                  className="mt-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8962E] px-8 py-2.5 font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]"
                >
                  {copy.ctaButton}
                </button>
              )}

              {editMode && (
                <div className="mx-auto mt-6 max-w-md rounded-xl bg-black/60 p-4 text-left shadow-lg backdrop-blur">
                  <label className="mb-2 block text-xs font-semibold text-[#F5D76E]">
                    Background Image URL
                  </label>
                  <input
                    value={activeData.image || ""}
                    onChange={(e) => handleRootChange("image", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Stats strip */}
          <div className="relative z-10 border-y border-white/10 bg-black/20">
            <div className="container mx-auto px-4 py-5 sm:px-6 lg:px-8 xl:px-20 2xl:px-32">
              {editMode && (
              <input
                value={copy.statsTitle || ""}
                onChange={(e) => handleTextChange("statsTitle", e.target.value)}
                className="mb-4 w-full max-w-md rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Stats section title (admin only)"
              />
            )}

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={`${index}-${stat.label}`} className="relative text-center">
                  {editMode && stats.length > 1 && (
                    <button
                      onClick={() => removeStat(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white shadow"
                      title="Remove Stat"
                    >
                      <FiTrash2 className="h-3 w-3" />
                    </button>
                  )}

                  {editMode ? (
                    <div className="space-y-2">
                      <input
                        value={stat.value}
                        onChange={(e) =>
                          handleStatChange(index, "value", e.target.value)
                        }
                        className="w-full rounded-lg bg-white/10 px-2 py-2 text-center text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                      <input
                        value={stat.label}
                        onChange={(e) =>
                          handleStatChange(index, "label", e.target.value)
                        }
                        className="w-full rounded-lg bg-white/10 px-2 py-1 text-center text-xs text-gray-300 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-gray-300 sm:text-sm">
                        {stat.label}
                      </div>
                    </>
                  )}
                </div>
              ))}

              {editMode && (
                <button
                  onClick={addStat}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/30 py-4 text-sm font-semibold text-gray-200"
                >
                  <FiPlus /> Add Stat
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="relative">
        {/* A soft white "glass" wash over the marble backdrop for everything
            below the hero — same light tone as the background image itself
            (not a dark tint, which would clash), just enough to lift text
            contrast and give the section some vibrancy instead of reading flat. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/60 via-white/40 to-white/60 backdrop-blur-[2px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-32">
        {/* Story + Values — plain content directly on the shared backdrop,
            no nested card-in-card, so it reads as one continuous section
            instead of a box floating on a box. */}
        <section className="pt-16 mt-4 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {editMode ? (
              <input
                value={copy.storyTitle || ""}
                onChange={(e) => handleTextChange("storyTitle", e.target.value)}
                className="mb-5 w-full rounded-xl bg-white/70 px-4 py-3 text-2xl font-bold text-[#07619b] outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            ) : (
              <h2 className="mb-5 bg-gradient-to-r from-[#07619b] to-[#279ccb] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                {copy.storyTitle}
              </h2>
            )}

            {editMode ? (
              <textarea
                value={copy.story || ""}
                onChange={(e) => handleTextChange("story", e.target.value)}
                rows="10"
                className="w-full resize-none rounded-xl bg-white/70 px-4 py-3 leading-7 text-gray-700 outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            ) : (
              <p className="leading-8 text-gray-700">{copy.story}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {editMode ? (
              <input
                value={copy.valuesTitle || ""}
                onChange={(e) => handleTextChange("valuesTitle", e.target.value)}
                className="mb-6 w-full rounded-xl bg-white/70 px-4 py-3 text-2xl font-bold text-[#07619b] outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            ) : (
              <h2 className="mb-6 bg-gradient-to-r from-[#07619b] to-[#279ccb] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                {copy.valuesTitle}
              </h2>
            )}

            <div className="divide-y divide-gray-900/10">
              {values.map((value, index) => (
                <div
                  key={`${index}-${value}`}
                  className="relative flex items-start gap-3 py-3 first:pt-0"
                >
                  <FiCheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#B8962E]" />

                  {editMode ? (
                    <>
                      <input
                        value={value}
                        onChange={(e) =>
                          handleValueChange(index, e.target.value)
                        }
                        className="w-full rounded-lg bg-white/70 px-3 py-2 text-sm text-gray-900 outline-none"
                      />
                      <button
                        onClick={() => removeValue(index)}
                        className="flex-shrink-0 rounded-full bg-red-600 p-1.5 text-white"
                        title="Remove Value"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-700">{value}</span>
                  )}
                </div>
              ))}

              {editMode && (
                <button
                  onClick={addValue}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-400 py-3 font-semibold text-gray-700"
                >
                  <FiPlus />
                  Add Value
                </button>
              )}
            </div>
          </motion.div>
        </section>

        {/* Capabilities — frosted glass cards over the shared backdrop */}
        <section className="mt-20">
          <div className="mx-auto mb-9 max-w-3xl text-center">
            {editMode ? (
              <>
                <input
                  value={copy.capabilitiesTitle || ""}
                  onChange={(e) =>
                    handleTextChange("capabilitiesTitle", e.target.value)
                  }
                  className="mb-4 w-full rounded-xl bg-white/70 px-4 py-3 text-center text-3xl font-bold text-[#07619b] outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <textarea
                  value={copy.capabilitiesIntro || ""}
                  onChange={(e) =>
                    handleTextChange("capabilitiesIntro", e.target.value)
                  }
                  rows="3"
                  className="w-full resize-none rounded-xl bg-white/70 px-4 py-3 text-center text-gray-700 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </>
            ) : (
              <>
                <h2 className="mb-4 bg-gradient-to-r from-[#07619b] to-[#279ccb] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                  {copy.capabilitiesTitle}
                </h2>
                <p className="text-gray-700">{copy.capabilitiesIntro}</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((capability, index) => {
              const Icon = ICON_OPTIONS[capability.icon] || FiStar;

              return (
                <motion.article
                  key={`${capability.title}-${index}`}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8962E]" />

                  {editMode && (
                    <button
                      onClick={() => removeCapability(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-600 p-2 text-white shadow"
                      title="Remove Capability"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0760ad] to-[#118a94] text-white shadow-md transition group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>

                  {editMode ? (
                    <div className="space-y-3">
                      <select
                        value={capability.icon || "FiStar"}
                        onChange={(e) =>
                          handleCapabilityChange(index, "icon", e.target.value)
                        }
                        className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-[#07619b] outline-none"
                      >
                        {Object.keys(ICON_OPTIONS).map((iconName) => (
                          <option key={iconName} value={iconName}>
                            {iconName}
                          </option>
                        ))}
                      </select>

                      <input
                        value={capability.title || ""}
                        onChange={(e) =>
                          handleCapabilityChange(index, "title", e.target.value)
                        }
                        className="w-full rounded-lg bg-gray-50 px-3 py-2 font-semibold text-[#07619b] outline-none"
                      />

                      <textarea
                        value={capability.description || ""}
                        onChange={(e) =>
                          handleCapabilityChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows="5"
                        className="w-full resize-none rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 outline-none"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="mb-3 text-xl font-bold text-gray-900 transition group-hover:bg-gradient-to-r group-hover:from-[#07619b] group-hover:to-[#279ccb] group-hover:bg-clip-text group-hover:text-transparent">
                        {capability.title}
                      </h3>
                      <p className="leading-7 text-gray-600">
                        {capability.description}
                      </p>
                    </>
                  )}
                </motion.article>
              );
            })}

            {editMode && (
              <button
                onClick={addCapability}
                className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#D4AF37]/60 bg-white/70 text-[#07619b]"
              >
                <FiPlus className="h-8 w-8" />
                <span className="font-semibold">Add Capability</span>
              </button>
            )}
          </div>
        </section>

        {/* Process — a numbered timeline gives the added content a distinct
            rhythm from the capability cards above, on the same light backdrop. */}
        <section className="mt-20">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {editMode ? (
              <>
                <input
                  value={copy.processTitle || ""}
                  onChange={(e) => handleTextChange("processTitle", e.target.value)}
                  className="mb-4 w-full rounded-xl bg-white/70 px-4 py-3 text-center text-3xl font-bold text-[#07619b] outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <textarea
                  value={copy.processIntro || ""}
                  onChange={(e) => handleTextChange("processIntro", e.target.value)}
                  rows="2"
                  className="w-full resize-none rounded-xl bg-white/70 px-4 py-3 text-center text-gray-700 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </>
            ) : (
              <>
                <h2 className="mb-4 bg-gradient-to-r from-[#07619b] to-[#279ccb] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                  {copy.processTitle}
                </h2>
                <p className="text-gray-700">{copy.processIntro}</p>
              </>
            )}
          </div>

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connecting line behind the numbered steps, desktop only */}
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent lg:block" />

            {processSteps.map((step, index) => (
              <motion.div
                key={`${step.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative text-center"
              >
                {editMode && processSteps.length > 1 && (
                  <button
                    onClick={() => removeProcessStep(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1.5 text-white shadow z-10"
                    title="Remove Step"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                )}

                <div className="relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] text-lg font-bold text-black shadow-lg">
                  {index + 1}
                </div>

                {editMode ? (
                  <div className="space-y-2 text-left">
                    <input
                      value={step.title || ""}
                      onChange={(e) =>
                        handleProcessChange(index, "title", e.target.value)
                      }
                      className="w-full rounded-lg bg-white/70 px-3 py-2 text-center font-semibold text-gray-900 outline-none"
                    />
                    <textarea
                      value={step.description || ""}
                      onChange={(e) =>
                        handleProcessChange(index, "description", e.target.value)
                      }
                      rows="4"
                      className="w-full resize-none rounded-lg bg-white/70 px-3 py-2 text-center text-sm text-gray-700 outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="mb-2 font-bold text-gray-900">{step.title}</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      {step.description}
                    </p>
                  </>
                )}
              </motion.div>
            ))}

            {editMode && (
              <button
                onClick={addProcessStep}
                className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D4AF37]/60 bg-white/70 text-[#07619b]"
              >
                <FiPlus className="h-6 w-6" />
                <span className="text-sm font-semibold">Add Step</span>
              </button>
            )}
          </div>
        </section>

        {/* CTA — the one deliberate bold-color block on this page, same
            pattern as Home's gold buttons/badges popping against light content. */}
        <section className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-[#07619b] to-[#118a94] p-6 shadow-xl sm:p-10 lg:p-12">
          <div className="flex flex-col items-center justify-between gap-7 lg:flex-row">
            <div className="max-w-3xl">
              {editMode ? (
                <>
                  <input
                    value={copy.ctaTitle || ""}
                    onChange={(e) =>
                      handleTextChange("ctaTitle", e.target.value)
                    }
                    className="mb-4 w-full rounded-xl bg-white/10 px-4 py-3 text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  <textarea
                    value={copy.ctaText || ""}
                    onChange={(e) => handleTextChange("ctaText", e.target.value)}
                    rows="3"
                    className="w-full resize-none rounded-xl bg-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </>
              ) : (
                <>
                  <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                    {copy.ctaTitle}
                  </h2>
                  <p className="leading-7 text-white/85">{copy.ctaText}</p>
                </>
              )}
            </div>

            {editMode ? (
              <input
                value={copy.ctaButton || ""}
                onChange={(e) => handleTextChange("ctaButton", e.target.value)}
                className="w-full max-w-xs rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] px-6 py-3 text-center font-semibold text-black outline-none focus:ring-2 focus:ring-white lg:w-auto"
              />
            ) : (
              <button
                onClick={goToCollections}
                className="w-full flex-shrink-0 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8962E] px-7 py-3 font-semibold text-black shadow-lg transition hover:scale-[1.02] sm:w-auto"
              >
                {copy.ctaButton}
              </button>
            )}
          </div>
        </section>
      </div>
      </div>
      </div>

      <FloatingWhatsApp />
    </main>
  );
}
