"use client";

/**
 * A simple language provider to handle runtime translations.
 *
 * This context stores the currently selected language and exposes a
 * translation function (`t`) to look up localized strings using dot
 * separated keys. It also manages persistence by saving the selected
 * language to `localStorage` and toggling the document's `lang` and
 * `dir` attributes to reflect right‑to‑left languages such as Arabic.
 *
 * To add support for more languages, extend the `translations` object
 * with additional locale codes and their corresponding dictionaries.
 */

import React, { createContext, useContext, useEffect, useState } from "react";

// Translation dictionaries keyed by two‑letter language code.  Each
// dictionary should mirror the structure of all strings used in the
// application.  When adding new phrases to the UI, please update the
// appropriate section below for every supported language.
const translations = {
  EN: {
    hero: {
      badge: "LUXURY CURTAIN COLLECTION",
      titleStart: "Transform Your Home with",
      titleHighlight: "Premium Curtains & Blinds",
      description:
        "Experience elegance, comfort, and sophistication with our exclusive luxury curtain collections designed for modern living.",
      viewCollections: "View Collections",
      bookAppointment: "Book A Free Appointment",
    },
    features: {
      curtainCollection: {
        title: "Curtain Collection",
        description: "Any Curtain for your space",
      },
      freeShipping: {
        title: "Free Shipping",
        description: "Free shipping on order",
      },
      moneyBack: {
        title: "100% Money Back",
        description: "If the item didn't suit you",
      },
    },
    collections: {
      heading: "Our Curtain Collections",
      home: "Home Curtains",
      office: "Office Curtains",
      medicalClinic: "Medical & Clinic Curtains",
      accessories: "Curtain Accessories",

      // Additional keys used in the collections category page
      categoryTitle: "Categories", // heading for the sidebar listing categories
      needHelp: "Need Help?", // text for the help button on the category page
      noProducts: "No products found in this category yet.", // shown when there are no items
      showing: "Showing", // prefix for the product count line
      products: "products", // suffix for the product count line
    },
    help: {
      heading: "Need help in choosing the right Curtain?",
      button: "Ask For Help",
      paragraph1:
        "Choosing the right curtain can depend on several factors such as the purpose of the space, the style of the room, and your personal taste.",
      paragraph2:
        "First, consider the purpose of the space. Are you looking for curtains to block out light and provide privacy, or are you looking for curtains to simply enhance the aesthetic appeal of the room? This can help you determine the type of fabric and curtain style that will best suit your needs.",
      paragraph3:
        "Next, consider the style of the room. Are you looking for curtains that will blend in with the existing decor, or do you want curtains that will make a statement and become a focal point in the room? This can help you choose the color, pattern, and design of the curtains.",
      paragraph4:
        "Finally, consider your personal taste. Do you prefer modern or traditional styles? Do you like bold and bright colors or subtle and neutral tones? This can help you narrow down your choices and select the curtains that best reflect your personal style.",
    },
    footer: {
      tagline: "Luxury Interiors",
      description:
        "Premium quality curtains crafted with precision and elegance. Transform your space with timeless luxury and comfort.",
      quickLinks: "Quick Links",
      home: "Home",
      about: "About Us",
      collections: "Collections",
      contact: "Contact",
      allRightsReserved: "All rights reserved.",
    },
    navbar: {
      home: "Home",
      about: "About Us",
      collections: "Collections",
      contact: "Contact",
    },
    quotation: {
      badge: "GET A QUOTATION",
      title: "Request a Quote",
      description:
        "Fill out the form below and we'll get back to you with a personalized quotation within 24 hours.",
      nameLabel: "Full Name *",
      phoneLabel: "Phone Number *",
      emailLabel: "Email *",
      descriptionLabel: "Project Description *",
      namePlaceholder: "Enter your full name",
      phonePlaceholder: "Enter your phone number",
      emailPlaceholder: "Enter your email address",
      descriptionPlaceholder: "Describe your project",
      successTitle: "Thank You!",
      successMessage:
        "Your quotation request has been submitted successfully. We'll contact you soon.",
      errorNameRequired: "Name is required",
      errorPhoneRequired: "Phone number is required",
      errorPhoneInvalid: "Please enter a valid phone number",
      errorEmailRequired: "Email is required",
      errorEmailInvalid: "Please enter a valid email",
      errorDescriptionRequired: "Description is required",
      submitButton: "Submit",
      cards: {
        quickResponse: {
          title: "Quick Response",
          description: "Within 24 hours",
        },
        freeConsultation: {
          title: "Free Consultation",
          description: "No obligation",
        },
        customSolutions: {
          title: "Custom Solutions",
          description: "Tailored to you",
        },
      },
      immediateAssistance: "Need immediate assistance? Call us at",
      whatsappMessage: "Hello, I would like to request a quotation for curtains.",
    },
  },
  DE: {
    hero: {
      badge: "LUXUSVORHANGKOLLEKTION",
      titleStart: "Verwandeln Sie Ihr Zuhause mit",
      titleHighlight: "Premiumvorhängen & Jalousien",
      description:
        "Erleben Sie Eleganz, Komfort und Raffinesse mit unseren exklusiven Luxusvorhangkollektionen, die für modernes Wohnen entworfen wurden.",
      viewCollections: "Kollektionen ansehen",
      bookAppointment: "Kostenlosen Termin buchen",
    },
    features: {
      curtainCollection: {
        title: "Vorhangkollektion",
        description: "Jeder Vorhang für Ihren Raum",
      },
      freeShipping: {
        title: "Kostenloser Versand",
        description: "Kostenloser Versand bei Bestellung",
      },
      moneyBack: {
        title: "100 % Geld‑zurück‑Garantie",
        description: "Wenn der Artikel Ihnen nicht zusagt",
      },
    },
    collections: {
      heading: "Unsere Vorhangkollektionen",
      home: "Vorhänge für Zuhause",
      office: "Bürovorhänge",
      medicalClinic: "Medizinische & Klinikvorhänge",
      accessories: "Vorhangzubehör",

      // Zusätzliche Schlüssel für die Kategorie-Seite
      categoryTitle: "Kategorien", // Überschrift für die Seitenleiste mit den Kategorien
      needHelp: "Brauchen Sie Hilfe?", // Text für die Hilfe-Schaltfläche auf der Kategorieseite
      noProducts: "In dieser Kategorie wurden noch keine Produkte gefunden.", // angezeigt, wenn es keine Artikel gibt
      showing: "Es werden", // Präfix für die Zeile mit der Produktanzahl
      products: "Produkte", // Suffix für die Zeile mit der Produktanzahl
    },
    help: {
      heading: "Benötigen Sie Hilfe bei der Auswahl des richtigen Vorhangs?",
      button: "Um Hilfe bitten",
      paragraph1:
        "Die Auswahl des richtigen Vorhangs kann von mehreren Faktoren abhängen, wie dem Zweck des Raums, dem Stil des Zimmers und Ihrem persönlichen Geschmack.",
      paragraph2:
        "Zuerst sollten Sie den Zweck des Raums berücksichtigen. Möchten Sie Vorhänge, die Licht blockieren und Privatsphäre bieten, oder Vorhänge, die lediglich das ästhetische Erscheinungsbild des Raums verbessern? Dies kann Ihnen helfen, die Art des Stoffes und des Vorhangstils zu bestimmen, der am besten zu Ihren Bedürfnissen passt.",
      paragraph3:
        "Berücksichtigen Sie als Nächstes den Stil des Raums. Möchten Sie Vorhänge, die sich in die bestehende Einrichtung einfügen, oder Vorhänge, die ein Statement setzen und zum Mittelpunkt des Raums werden? Dies kann Ihnen helfen, die Farbe, das Muster und das Design der Vorhänge auszuwählen.",
      paragraph4:
        "Berücksichtigen Sie schließlich Ihren persönlichen Geschmack. Bevorzugen Sie moderne oder traditionelle Stile? Mögen Sie kräftige und helle Farben oder dezente und neutrale Töne? Dies kann Ihnen helfen, Ihre Auswahl einzugrenzen und die Vorhänge auszuwählen, die Ihren persönlichen Stil am besten widerspiegeln.",
    },
    footer: {
      tagline: "Luxus‑Innenräume",
      description:
        "Vorhänge von erstklassiger Qualität, gefertigt mit Präzision und Eleganz. Verwandeln Sie Ihren Raum mit zeitlosem Luxus und Komfort.",
      quickLinks: "Schnellzugriff",
      home: "Startseite",
      about: "Über uns",
      collections: "Kollektionen",
      contact: "Kontakt",
      allRightsReserved: "Alle Rechte vorbehalten.",
    },
    navbar: {
      home: "Startseite",
      about: "Über uns",
      collections: "Kollektionen",
      contact: "Kontakt",
    },
    quotation: {
      badge: "HOLEN SIE EIN ANGEBOT",
      title: "Ein Angebot anfordern",
      description:
        "Füllen Sie das untenstehende Formular aus und wir melden uns innerhalb von 24 Stunden mit einem persönlichen Angebot zurück.",
      nameLabel: "Vollständiger Name *",
      phoneLabel: "Telefonnummer *",
      emailLabel: "E‑Mail *",
      descriptionLabel: "Projektbeschreibung *",
      namePlaceholder: "Geben Sie Ihren vollständigen Namen ein",
      phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
      emailPlaceholder: "Geben Sie Ihre E‑Mail-Adresse ein",
      descriptionPlaceholder: "Beschreiben Sie Ihr Projekt",
      successTitle: "Vielen Dank!",
      successMessage:
        "Ihre Angebotsanfrage wurde erfolgreich übermittelt. Wir kontaktieren Sie in Kürze.",
      errorNameRequired: "Name ist erforderlich",
      errorPhoneRequired: "Telefonnummer ist erforderlich",
      errorPhoneInvalid: "Bitte geben Sie eine gültige Telefonnummer ein",
      errorEmailRequired: "E‑Mail ist erforderlich",
      errorEmailInvalid: "Bitte geben Sie eine gültige E‑Mail-Adresse ein",
      errorDescriptionRequired: "Beschreibung ist erforderlich",
      submitButton: "Absenden",
      cards: {
        quickResponse: {
          title: "Schnelle Antwort",
          description: "Innerhalb von 24 Stunden",
        },
        freeConsultation: {
          title: "Kostenlose Beratung",
          description: "Keine Verpflichtung",
        },
        customSolutions: {
          title: "Individuelle Lösungen",
          description: "Maßgeschneidert für Sie",
        },
      },
      immediateAssistance: "Benötigen Sie sofortige Hilfe? Rufen Sie uns an unter",
      whatsappMessage: "Hallo, ich möchte ein Angebot für Vorhänge anfordern.",
    },
  },
  AR: {
    hero: {
      badge: "مجموعة الستائر الفاخرة",
      titleStart: "حوّل منزلك مع",
      titleHighlight: "ستائر وستائر فاخرة",
      description:
        "اختبر الأناقة والراحة والرقي مع مجموعات الستائر الفاخرة الحصرية المصممة للعيش العصري.",
      viewCollections: "عرض المجموعات",
      bookAppointment: "حجز موعد مجاني",
    },
    features: {
      curtainCollection: {
        title: "مجموعة الستائر",
        description: "أي ستارة لمساحتك",
      },
      freeShipping: {
        title: "شحن مجاني",
        description: "شحن مجاني على الطلب",
      },
      moneyBack: {
        title: "استرداد 100٪",
        description: "إذا لم يناسبك المنتج",
      },
    },
    collections: {
      heading: "مجموعات الستائر الخاصة بنا",
      home: "ستائر منزلية",
      office: "ستائر مكتبية",
      medicalClinic: "ستائر طبية وعيادات",
      accessories: "إكسسوارات الستائر",

      // مفاتيح إضافية مستخدمة في صفحة الفئة
      categoryTitle: "الفئات", // عنوان الشريط الجانبي الذي يعرض الفئات
      needHelp: "بحاجة إلى مساعدة؟", // نص زر المساعدة في صفحة الفئة
      noProducts: "لا توجد منتجات في هذه الفئة بعد.", // يظهر عند عدم وجود عناصر
      showing: "عرض", // بادئة لسطر عدد المنتجات
      products: "منتجات", // لاحقة لسطر عدد المنتجات
    },
    help: {
      heading: "بحاجة إلى مساعدة في اختيار الستارة المناسبة؟",
      button: "اطلب المساعدة",
      paragraph1:
        "يعتمد اختيار الستارة المناسبة على عدة عوامل مثل غرض المساحة، أسلوب الغرفة وذوقك الشخصي.",
      paragraph2:
        "أولاً، يجب مراعاة غرض المساحة. هل تبحث عن ستائر لحجب الضوء وتوفير الخصوصية، أم تبحث عن ستائر لتعزيز جاذبية الغرفة الجمالية فحسب؟ يمكن أن يساعدك هذا في تحديد نوع القماش وأسلوب الستارة الذي يناسب احتياجاتك.",
      paragraph3:
        "بعد ذلك، ضع في اعتبارك أسلوب الغرفة. هل تريد ستائر تتناغم مع الديكور الحالي، أم تريد ستائر تجعل بياناً وتصبح محور الغرفة؟ يمكن أن يساعدك هذا في اختيار لون الستائر ونمطها وتصميمها.",
      paragraph4:
        "أخيراً، ضع في اعتبارك ذوقك الشخصي. هل تفضل الأساليب الحديثة أم التقليدية؟ هل تحب الألوان الجريئة والمشرقة أم الألوان الهادئة والمحايدة؟ يمكن أن يساعدك هذا في تضييق نطاق اختياراتك واختيار الستائر التي تعكس أسلوبك الشخصي.",
    },
    footer: {
      tagline: "التصاميم الفاخرة",
      description:
        "ستائر عالية الجودة مصنوعة بدقة وأناقة. حوّل مساحتك بفخامة وراحة خالدة.",
      quickLinks: "روابط سريعة",
      home: "الصفحة الرئيسية",
      collections: "المجموعات",
      contact: "اتصل بنا",
      allRightsReserved: "جميع الحقوق محفوظة.",
    },
    navbar: {
      home: "الرئيسية",
      about: "من نحن",
      collections: "المجموعات",
      contact: "اتصل بنا",
    },
    quotation: {
      badge: "احصل على عرض أسعار",
      title: "طلب عرض أسعار",
      description:
        "يرجى ملء النموذج أدناه وسنعاود الاتصال بك بعرض أسعار مخصص خلال 24 ساعة.",
      nameLabel: "الاسم الكامل *",
      phoneLabel: "رقم الهاتف *",
      emailLabel: "البريد الإلكتروني *",
      descriptionLabel: "وصف المشروع *",
      namePlaceholder: "أدخل اسمك الكامل",
      phonePlaceholder: "أدخل رقم هاتفك",
      emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
      descriptionPlaceholder: "صف مشروعك",
      successTitle: "شكراً لك!",
      successMessage:
        "تم إرسال طلب عرض الأسعار بنجاح. سنتواصل معك قريباً.",
      errorNameRequired: "الاسم مطلوب",
      errorPhoneRequired: "رقم الهاتف مطلوب",
      errorPhoneInvalid: "يرجى إدخال رقم هاتف صالح",
      errorEmailRequired: "البريد الإلكتروني مطلوب",
      errorEmailInvalid: "يرجى إدخال بريد إلكتروني صالح",
      errorDescriptionRequired: "الوصف مطلوب",
      submitButton: "إرسال",
      cards: {
        quickResponse: {
          title: "استجابة سريعة",
          description: "خلال 24 ساعة",
        },
        freeConsultation: {
          title: "استشارة مجانية",
          description: "بدون التزام",
        },
        customSolutions: {
          title: "حلول مخصصة",
          description: "مصممة خصيصاً لك",
        },
      },
      immediateAssistance: "تحتاج مساعدة فورية؟ اتصل بنا على",
      whatsappMessage: "مرحبًا، أود طلب عرض أسعار للستائر.",
    },
  },
  FR: {
    hero: {
      badge: "COLLECTION DE RIDEAUX DE LUXE",
      titleStart: "Transformez votre maison avec",
      titleHighlight: "des rideaux et stores haut de gamme",
      description:
        "Découvrez l'élégance, le confort et la sophistication avec nos collections exclusives de rideaux de luxe conçues pour la vie moderne.",
      viewCollections: "Voir les collections",
      bookAppointment: "Réserver un rendez‑vous gratuit",
    },
    features: {
      curtainCollection: {
        title: "Collection de rideaux",
        description: "Des rideaux pour tous vos espaces",
      },
      freeShipping: {
        title: "Livraison gratuite",
        description: "Livraison gratuite sur votre commande",
      },
      moneyBack: {
        title: "Remboursement à 100 %",
        description: "Si l'article ne vous convient pas",
      },
    },
    collections: {
      heading: "Nos collections de rideaux",
      home: "Rideaux pour la maison",
      office: "Rideaux de bureau",
      medicalClinic: "Rideaux médicaux et de clinique",
      accessories: "Accessoires de rideaux",

      // Clés supplémentaires utilisées dans la page de catégorie
      categoryTitle: "Catégories", // Titre de la barre latérale listant les catégories
      needHelp: "Besoin d'aide ?", // Texte du bouton d'aide sur la page de catégorie
      noProducts: "Aucun produit trouvé dans cette catégorie pour l'instant.", // Affiché lorsqu'aucun article n'est disponible
      showing: "Affichage", // Préfixe pour la ligne du nombre de produits
      products: "produits", // Suffixe pour la ligne du nombre de produits
    },
    help: {
      heading: "Besoin d'aide pour choisir le bon rideau ?",
      button: "Demander de l'aide",
      paragraph1:
        "Le choix du bon rideau peut dépendre de plusieurs facteurs tels que la destination de l'espace, le style de la pièce et vos goûts personnels.",
      paragraph2:
        "Tout d'abord, considérez la destination de l'espace. Cherchez‑vous des rideaux pour bloquer la lumière et offrir de l'intimité, ou cherchez‑vous des rideaux pour simplement améliorer l'attrait esthétique de la pièce ? Cela peut vous aider à déterminer le type de tissu et le style de rideau qui conviendra le mieux à vos besoins.",
      paragraph3:
        "Ensuite, considérez le style de la pièce. Voulez‑vous des rideaux qui se fondent dans la décoration existante, ou voulez‑vous des rideaux qui font une déclaration et deviennent le point focal de la pièce ? Cela peut vous aider à choisir la couleur, le motif et le design des rideaux.",
      paragraph4:
        "Enfin, tenez compte de vos goûts personnels. Préférez‑vous les styles modernes ou traditionnels ? Aimez‑vous les couleurs audacieuses et vives ou les tons subtils et neutres ? Cela peut vous aider à affiner vos choix et à sélectionner les rideaux qui reflètent le mieux votre style personnel.",
    },
    footer: {
      tagline: "Intérieurs de luxe",
      description:
        "Des rideaux de qualité supérieure fabriqués avec précision et élégance. Transformez votre espace avec un luxe et un confort intemporels.",
      quickLinks: "Liens rapides",
      home: "Accueil",
      about: "À propos",
      collections: "Collections",
      contact: "Contact",
      allRightsReserved: "Tous droits réservés.",
    },
    navbar: {
      home: "Accueil",
      about: "À propos",
      collections: "Collections",
      contact: "Contact",
    },
    quotation: {
      badge: "OBTENIR UN DEVIS",
      title: "Demander un devis",
      description:
        "Remplissez le formulaire ci-dessous et nous reviendrons vers vous avec un devis personnalisé dans les 24 heures.",
      nameLabel: "Nom complet *",
      phoneLabel: "Numéro de téléphone *",
      emailLabel: "E-mail *",
      descriptionLabel: "Description du projet *",
      namePlaceholder: "Saisissez votre nom complet",
      phonePlaceholder: "Saisissez votre numéro de téléphone",
      emailPlaceholder: "Saisissez votre adresse e-mail",
      descriptionPlaceholder: "Décrivez votre projet",
      successTitle: "Merci !",
      successMessage:
        "Votre demande de devis a été envoyée avec succès. Nous vous contacterons bientôt.",
      errorNameRequired: "Le nom est requis",
      errorPhoneRequired: "Le numéro de téléphone est requis",
      errorPhoneInvalid: "Veuillez saisir un numéro de téléphone valide",
      errorEmailRequired: "L’e-mail est requis",
      errorEmailInvalid: "Veuillez saisir une adresse e-mail valide",
      errorDescriptionRequired: "La description est requise",
      submitButton: "Envoyer",
      cards: {
        quickResponse: {
          title: "Réponse rapide",
          description: "Sous 24 heures",
        },
        freeConsultation: {
          title: "Consultation gratuite",
          description: "Sans obligation",
        },
        customSolutions: {
          title: "Solutions personnalisées",
          description: "Adaptées à vous",
        },
      },
      immediateAssistance: "Besoin d’une assistance immédiate ? Appelez-nous au",
      whatsappMessage: "Bonjour, je souhaite demander un devis pour des rideaux.",
    },
  },
  IT: {
    hero: {
      badge: "COLLEZIONE DI TENDE DI LUSSO",
      titleStart: "Trasforma la tua casa con",
      titleHighlight: "tende e tapparelle di alta qualità",
      description:
        "Vivi eleganza, comfort e raffinatezza con le nostre esclusive collezioni di tende di lusso progettate per la vita moderna.",
      viewCollections: "Vedi le collezioni",
      bookAppointment: "Prenota un appuntamento gratuito",
    },
    features: {
      curtainCollection: {
        title: "Collezione di tende",
        description: "Qualsiasi tenda per il tuo spazio",
      },
      freeShipping: {
        title: "Spedizione gratuita",
        description: "Spedizione gratuita sull'ordine",
      },
      moneyBack: {
        title: "Rimborso al 100 %",
        description: "Se l'articolo non fa per te",
      },
    },
    collections: {
      heading: "Le nostre collezioni di tende",
      home: "Tende per la casa",
      office: "Tende per ufficio",
      medicalClinic: "Tende mediche e da clinica",
      accessories: "Accessori per tende",

      // Chiavi aggiuntive utilizzate nella pagina delle categorie
      categoryTitle: "Categorie", // Intestazione per la barra laterale con l'elenco delle categorie
      needHelp: "Hai bisogno di aiuto?", // Testo del pulsante di aiuto sulla pagina della categoria
      noProducts: "Nessun prodotto trovato in questa categoria per il momento.", // Mostrato quando non sono presenti articoli
      showing: "Visualizzazione", // Prefisso per la riga che indica il numero di prodotti
      products: "prodotti", // Suffisso per la riga che indica il numero di prodotti
    },
    help: {
      heading: "Hai bisogno di aiuto per scegliere la tenda giusta?",
      button: "Chiedi aiuto",
      paragraph1:
        "La scelta della tenda giusta può dipendere da diversi fattori come la destinazione dello spazio, lo stile della stanza e il tuo gusto personale.",
      paragraph2:
        "Innanzitutto, considera la destinazione dello spazio. Cerchi tende per bloccare la luce e offrire privacy, oppure cerchi tende che migliorino semplicemente l'appeal estetico della stanza? Questo può aiutarti a determinare il tipo di tessuto e lo stile di tenda più adatto alle tue esigenze.",
      paragraph3:
        "Successivamente, considera lo stile della stanza. Cerchi tende che si fondano con l'arredamento esistente, o vuoi tende che facciano una dichiarazione e diventino il fulcro della stanza? Questo può aiutarti a scegliere il colore, il motivo e il design delle tende.",
      paragraph4:
        "Infine, considera il tuo gusto personale. Preferisci stili moderni o tradizionali? Ti piacciono i colori audaci e vivaci o i toni sottili e neutri? Questo può aiutarti a restringere le scelte e selezionare le tende che meglio riflettono il tuo stile personale.",
    },
    footer: {
      tagline: "Interni di lusso",
      description:
        "Tende di alta qualità realizzate con precisione ed eleganza. Trasforma il tuo spazio con un lusso e un comfort senza tempo.",
      quickLinks: "Collegamenti rapidi",
      home: "Casa",
      about: "Chi siamo",
      collections: "Collezioni",
      contact: "Contatto",
      allRightsReserved: "Tutti i diritti riservati.",
    },
    navbar: {
      home: "Casa",
      about: "Chi siamo",
      collections: "Collezioni",
      contact: "Contatto",
    },
    quotation: {
      badge: "OTTENERE UN PREVENTIVO",
      title: "Richiedi un preventivo",
      description:
        "Compila il modulo qui sotto e ti ricontatteremo con un preventivo personalizzato entro 24 ore.",
      nameLabel: "Nome completo *",
      phoneLabel: "Numero di telefono *",
      emailLabel: "E-mail *",
      descriptionLabel: "Descrizione del progetto *",
      namePlaceholder: "Inserisci il tuo nome completo",
      phonePlaceholder: "Inserisci il tuo numero di telefono",
      emailPlaceholder: "Inserisci il tuo indirizzo e-mail",
      descriptionPlaceholder: "Descrivi il tuo progetto",
      successTitle: "Grazie!",
      successMessage:
        "La tua richiesta di preventivo è stata inviata con successo. Ti contatteremo a breve.",
      errorNameRequired: "Il nome è obbligatorio",
      errorPhoneRequired: "Il numero di telefono è obbligatorio",
      errorPhoneInvalid: "Inserisci un numero di telefono valido",
      errorEmailRequired: "L’e-mail è obbligatoria",
      errorEmailInvalid: "Inserisci un indirizzo email valido",
      errorDescriptionRequired: "La descrizione è obbligatoria",
      submitButton: "Invia",
      cards: {
        quickResponse: {
          title: "Risposta rapida",
          description: "Entro 24 ore",
        },
        freeConsultation: {
          title: "Consulenza gratuita",
          description: "Senza impegno",
        },
        customSolutions: {
          title: "Soluzioni personalizzate",
          description: "Su misura per te",
        },
      },
      immediateAssistance: "Hai bisogno di assistenza immediata? Chiamaci al",
      whatsappMessage: "Ciao, vorrei richiedere un preventivo per le tende.",
    },
  },
  ES: {
    hero: {
      badge: "COLECCIÓN DE CORTINAS DE LUJO",
      titleStart: "Transforma tu hogar con",
      titleHighlight: "cortinas y persianas de primera calidad",
      description:
        "Experimenta la elegancia, comodidad y sofisticación con nuestras exclusivas colecciones de cortinas de lujo diseñadas para la vida moderna.",
      viewCollections: "Ver colecciones",
      bookAppointment: "Reservar una cita gratuita",
    },
    features: {
      curtainCollection: {
        title: "Colección de cortinas",
        description: "Cualquier cortina para tu espacio",
      },
      freeShipping: {
        title: "Envío gratis",
        description: "Envío gratis en el pedido",
      },
      moneyBack: {
        title: "Devolución del 100 %",
        description: "Si el artículo no te convence",
      },
    },
    collections: {
      heading: "Nuestras colecciones de cortinas",
      home: "Cortinas para el hogar",
      office: "Cortinas para oficina",
      medicalClinic: "Cortinas médicas y de clínica",
      accessories: "Accesorios para cortinas",

      // Claves adicionales utilizadas en la página de categorías
      categoryTitle: "Categorías", // Título de la barra lateral con la lista de categorías
      needHelp: "¿Necesitas ayuda?", // Texto del botón de ayuda en la página de categorías
      noProducts: "No se encontraron productos en esta categoría.", // Se muestra cuando no hay artículos
      showing: "Mostrando", // Prefijo para la línea con el número de productos
      products: "productos", // Sufijo para la línea con el número de productos
    },
    help: {
      heading: "¿Necesitas ayuda para elegir la cortina adecuada?",
      button: "Pedir ayuda",
      paragraph1:
        "Elegir la cortina adecuada puede depender de varios factores como el propósito del espacio, el estilo de la habitación y tu gusto personal.",
      paragraph2:
        "Primero, considera el propósito del espacio. ¿Buscas cortinas para bloquear la luz y proporcionar privacidad, o buscas cortinas para simplemente mejorar el atractivo estético de la habitación? Esto puede ayudarte a determinar el tipo de tela y estilo de cortina que se adaptará mejor a tus necesidades.",
      paragraph3:
        "Luego, considera el estilo de la habitación. ¿Deseas cortinas que se mezclen con la decoración existente o deseas cortinas que hagan una declaración y se conviertan en el punto focal de la habitación? Esto puede ayudarte a elegir el color, el patrón y el diseño de las cortinas.",
      paragraph4:
        "Por último, considera tu gusto personal. ¿Prefieres estilos modernos o tradicionales? ¿Te gustan los colores audaces y brillantes o tonos sutiles y neutros? Esto puede ayudarte a limitar tus elecciones y seleccionar las cortinas que mejor reflejen tu estilo personal.",
    },
    footer: {
      tagline: "Interiores de lujo",
      description:
        "Cortinas de calidad superior hechas con precisión y elegancia. Transforma tu espacio con lujo y comodidad atemporales.",
      quickLinks: "Enlaces rápidos",
      home: "Inicio",
      about: "Sobre nosotros",
      collections: "Colecciones",
      contact: "Contacto",
      allRightsReserved: "Todos los derechos reservados.",
    },
    navbar: {
      home: "Inicio",
      about: "Sobre nosotros",
      collections: "Colecciones",
      contact: "Contacto",
    },
    quotation: {
      badge: "SOLICITAR UNA COTIZACIÓN",
      title: "Solicitar un presupuesto",
      description:
        "Completa el siguiente formulario y nos pondremos en contacto contigo con una cotización personalizada en 24 horas.",
      nameLabel: "Nombre completo *",
      phoneLabel: "Número de teléfono *",
      emailLabel: "Correo electrónico *",
      descriptionLabel: "Descripción del proyecto *",
      namePlaceholder: "Introduce tu nombre completo",
      phonePlaceholder: "Introduce tu número de teléfono",
      emailPlaceholder: "Introduce tu dirección de correo electrónico",
      descriptionPlaceholder: "Describe tu proyecto",
      successTitle: "¡Gracias!",
      successMessage:
        "Tu solicitud de cotización ha sido enviada con éxito. Nos pondremos en contacto contigo pronto.",
      errorNameRequired: "El nombre es obligatorio",
      errorPhoneRequired: "El número de teléfono es obligatorio",
      errorPhoneInvalid: "Por favor, introduce un número de teléfono válido",
      errorEmailRequired: "El correo electrónico es obligatorio",
      errorEmailInvalid: "Por favor, introduce una dirección de correo electrónico válida",
      errorDescriptionRequired: "La descripción es obligatoria",
      submitButton: "Enviar",
      cards: {
        quickResponse: {
          title: "Respuesta rápida",
          description: "En 24 horas",
        },
        freeConsultation: {
          title: "Consulta gratuita",
          description: "Sin compromiso",
        },
        customSolutions: {
          title: "Soluciones personalizadas",
          description: "Adaptadas a ti",
        },
      },
      immediateAssistance: "¿Necesitas asistencia inmediata? Llámanos al",
      whatsappMessage: "Hola, me gustaría solicitar una cotización para cortinas.",
    },
  },
};

// Create a React context for language management.  The default value is
// undefined because we always wrap our application in the provider.
const LanguageContext = createContext();

/**
 * LanguageProvider wraps your application and exposes the current
 * language, a function to change languages and a translation helper.
 */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("EN");

  // On mount, read the user's preferred language from localStorage and
  // update the document's language attributes.  If no preference exists
  // the default of "EN" is used.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("preferred-language");
      if (saved && translations[saved]) {
        setLang(saved);
        setDocumentLanguageAttributes(saved);
      }
    } catch (e) {
      // Ignore errors if localStorage is unavailable (e.g. server render)
    }
  }, []);

  /**
   * Update the HTML `lang` attribute and `dir` attribute based on the
   * selected language.  Arabic is rendered right‑to‑left; all others
   * default to left‑to‑right.
   */
  function setDocumentLanguageAttributes(code) {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.lang = code.toLowerCase();
    html.dir = code === "AR" ? "rtl" : "ltr";
  }

  /**
   * Change the current language.  This function stores the selection
   * in localStorage and updates document attributes accordingly.
   *
   * @param {string} code Two‑letter language code matching a key in the
   * `translations` object.
   */
  const changeLanguage = (code) => {
    if (!translations[code]) return;
    setLang(code);
    try {
      localStorage.setItem("preferred-language", code);
    } catch (e) {
      // ignore
    }
    setDocumentLanguageAttributes(code);
  };

  /**
   * Look up a localized string using a dotted key.  If the key is not
   * defined for the current language, the key itself is returned as
   * fallback which helps during development.
   *
   * @param {string} key E.g. "hero.titleStart"
   */
  const t = (key) => {
    const parts = key.split(".");
    let result = translations[lang];
    for (const part of parts) {
      if (result && Object.prototype.hasOwnProperty.call(result, part)) {
        result = result[part];
      } else {
        return key; // fallback to key if translation missing
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to access language context.  Throws if used outside of provider.
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      "useLanguage must be used within a LanguageProvider. Wrap your app in LanguageProvider."
    );
  }
  return context;
}
