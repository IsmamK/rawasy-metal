"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit, Save, X } from "lucide-react";

const DEFAULT_DATA = {
  phoneNumber: "971547219791",
  translations: {
    EN: {
      heading: "Need Help Choosing The Right Curtain?",
      button: "Contact Us On WhatsApp",
      whatsappMessage: "Hello, I need help choosing the right curtain.",
      seeMore: "See More",
      showLess: "Show Less",
      paragraph:
        "Choosing the perfect curtain can transform your space by adding comfort, privacy, and elegance. Our team helps you select the right curtain style, fabric, color, and fitting based on your room type and interior design. Whether you need curtains for your home, office, clinic, or commercial space, we guide you with suitable options that match your needs. Contact us today and we will help you find the best curtain solution for your space.",
    },
    DE: {
      heading: "Brauchen Sie Hilfe bei der Auswahl des richtigen Vorhangs?",
      button: "Kontaktieren Sie uns auf WhatsApp",
      whatsappMessage:
        "Hallo, ich brauche Hilfe bei der Auswahl des richtigen Vorhangs.",
      seeMore: "Mehr anzeigen",
      showLess: "Weniger anzeigen",
      paragraph:
        "Die Wahl des perfekten Vorhangs kann Ihren Raum durch Komfort, Privatsphäre und Eleganz verwandeln. Unser Team hilft Ihnen bei der Auswahl des passenden Stils, Stoffes, der Farbe und der Montage basierend auf Ihrem Raumtyp und Ihrer Einrichtung. Ob Sie Vorhänge für Zuhause, Büro, Klinik oder Gewerbeflächen benötigen, wir beraten Sie mit passenden Optionen. Kontaktieren Sie uns noch heute und wir helfen Ihnen, die beste Vorhanglösung für Ihren Raum zu finden.",
    },
    AR: {
      heading: "هل تحتاج إلى مساعدة في اختيار الستارة المناسبة؟",
      button: "تواصل معنا عبر واتساب",
      whatsappMessage: "مرحبًا، أحتاج إلى مساعدة في اختيار الستارة المناسبة.",
      seeMore: "عرض المزيد",
      showLess: "عرض أقل",
      paragraph:
        "اختيار الستارة المناسبة يمكن أن يغيّر شكل المساحة ويضيف الراحة والخصوصية والأناقة. يساعدك فريقنا في اختيار نوع الستارة والقماش واللون والتركيب المناسب حسب نوع الغرفة والتصميم الداخلي. سواء كنت تحتاج إلى ستائر للمنزل أو المكتب أو العيادة أو المساحات التجارية، سنرشدك إلى الخيارات المناسبة. تواصل معنا اليوم وسنساعدك في العثور على أفضل حل للستائر لمساحتك.",
    },
    FR: {
      heading: "Besoin d’aide pour choisir le bon rideau ?",
      button: "Contactez-nous sur WhatsApp",
      whatsappMessage:
        "Bonjour, j’ai besoin d’aide pour choisir le bon rideau.",
      seeMore: "Voir plus",
      showLess: "Voir moins",
      paragraph:
        "Choisir le rideau parfait peut transformer votre espace en ajoutant confort, intimité et élégance. Notre équipe vous aide à sélectionner le bon style, tissu, coloris et type de pose selon votre pièce et votre décoration. Que vous ayez besoin de rideaux pour la maison, le bureau, une clinique ou un espace commercial, nous vous guidons vers les meilleures options. Contactez-nous aujourd’hui et nous vous aiderons à trouver la meilleure solution de rideaux pour votre espace.",
    },
    IT: {
      heading: "Hai bisogno di aiuto per scegliere la tenda giusta?",
      button: "Contattaci su WhatsApp",
      whatsappMessage:
        "Ciao, ho bisogno di aiuto per scegliere la tenda giusta.",
      seeMore: "Vedi di più",
      showLess: "Mostra meno",
      paragraph:
        "Scegliere la tenda perfetta può trasformare il tuo spazio aggiungendo comfort, privacy ed eleganza. Il nostro team ti aiuta a scegliere stile, tessuto, colore e installazione in base al tipo di ambiente e al design interno. Che tu abbia bisogno di tende per casa, ufficio, clinica o spazio commerciale, ti guidiamo verso le opzioni più adatte. Contattaci oggi e ti aiuteremo a trovare la migliore soluzione per il tuo spazio.",
    },
    ES: {
      heading: "¿Necesitas ayuda para elegir la cortina adecuada?",
      button: "Contáctanos por WhatsApp",
      whatsappMessage: "Hola, necesito ayuda para elegir la cortina adecuada.",
      seeMore: "Ver más",
      showLess: "Ver menos",
      paragraph:
        "Elegir la cortina perfecta puede transformar tu espacio añadiendo comodidad, privacidad y elegancia. Nuestro equipo te ayuda a seleccionar el estilo, la tela, el color y la instalación adecuados según el tipo de habitación y el diseño interior. Ya sea que necesites cortinas para el hogar, oficina, clínica o espacio comercial, te guiamos con opciones adecuadas. Contáctanos hoy y te ayudaremos a encontrar la mejor solución de cortinas para tu espacio.",
    },
  },
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const normalizeData = (apiData) => {
  if (!apiData || typeof apiData !== "object") return DEFAULT_DATA;

  return {
    ...DEFAULT_DATA,
    ...apiData,
    translations: {
      ...DEFAULT_DATA.translations,
      ...(apiData.translations || {}),
    },
  };
};

/**
 * Help section offering guidance on choosing the right curtain.
 * It displays a translated heading, a call-to-action button linking to
 * WhatsApp and a descriptive card explaining how to select curtains.
 */
export default function CurtainHelpSection() {
  const { lang } = useLanguage();

  const [data, setData] = useState(DEFAULT_DATA);
  const [tempData, setTempData] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const ENDPOINT = `${apiUrl}/home/contact/`;

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAdmin(!!authToken);
  }, []);

  useEffect(() => {
    const fetchHelpData = async () => {
      try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
          throw new Error("Failed to fetch curtain help data");
        }

        const jsonData = await response.json();
        const normalizedData = normalizeData(jsonData);

        setData(normalizedData);
        setTempData(normalizedData);
      } catch (error) {
        console.error("Error fetching curtain help data:", error);
        setData(DEFAULT_DATA);
        setTempData(DEFAULT_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHelpData();
  }, [ENDPOINT]);

  const activeData = editMode ? tempData : data;

  const copy =
    activeData?.translations?.[lang] ||
    activeData?.translations?.EN ||
    DEFAULT_DATA.translations.EN;

  const fullParagraph = copy.paragraph || "";

  const shortParagraph =
    fullParagraph.length > 260
      ? `${fullParagraph.slice(0, 260).trim()}...`
      : fullParagraph;

  const visibleParagraph = expanded || editMode ? fullParagraph : shortParagraph;

  const phoneNumber = activeData.phoneNumber || "971547219791";

  const whatsappText =
    copy.whatsappMessage ||
    copy.button ||
    "Hello, I need help choosing the right curtain.";

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappText
  )}`;

  const ensureCurrentLanguageExists = (newData) => {
    if (!newData.translations) {
      newData.translations = {};
    }

    if (!newData.translations[lang]) {
      newData.translations[lang] =
        cloneData(newData.translations.EN) ||
        cloneData(DEFAULT_DATA.translations.EN);
    }

    return newData;
  };

  const toggleEditMode = () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Admin access required. Please log in.");
      return;
    }

    if (editMode) {
      setTempData(cloneData(data));
    }

    setEditMode((prev) => !prev);
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

  const saveChanges = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authentication required to save changes.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(ENDPOINT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(tempData),
      });

      if (!response.ok) {
        throw new Error("Failed to save curtain help data");
      }

      const updatedData = await response.json();
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);

      alert("Curtain help section updated successfully!");
    } catch (error) {
      console.error("Error saving curtain help data:", error);
      alert("Failed to save curtain help section.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-14 sm:py-20 px-3 sm:px-6 md:px-12 lg:px-20 relative">
        <div className="max-w-7xl w-full px-0 sm:px-6 mx-auto flex items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8f744e]"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 sm:py-20 px-3 sm:px-6 md:px-12 lg:px-20 relative">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-30">
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center disabled:opacity-60"
                title="Save Changes"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={toggleEditMode}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg"
                title="Cancel Editing"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={toggleEditMode}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
              title="Edit Content"
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      <div className="max-w-7xl w-full px-0 sm:px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left side: call to action */}
        <div className="relative w-full">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#e6e0d8] rounded-full blur-3xl opacity-60" />

          {editMode && (
            <div className="mb-6">
              <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow">
                EDIT MODE ENABLED - Editing {lang}
              </span>
            </div>
          )}

          {editMode ? (
            <textarea
              value={copy.heading || ""}
              onChange={(e) => handleTextChange("heading", e.target.value)}
              rows="3"
              className="w-full text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8f744e] leading-tight bg-white/80 border border-[#e6e0d8] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e] resize-none"
            />
          ) : (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8f744e] leading-tight">
              {copy.heading}
            </h2>
          )}

          {editMode ? (
            <div className="mt-8 bg-white rounded-2xl p-5 shadow-xl border border-[#e6e0d8] space-y-4">
              <div>
                <label className="block text-xs text-[#8f744e] mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={copy.button || ""}
                  onChange={(e) => handleTextChange("button", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e6e0d8] text-[#8f744e] outline-none focus:ring-2 focus:ring-[#8f744e]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8f744e] mb-1">
                  WhatsApp Message
                </label>
                <textarea
                  value={copy.whatsappMessage || ""}
                  onChange={(e) =>
                    handleTextChange("whatsappMessage", e.target.value)
                  }
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-[#e6e0d8] text-[#8f744e] outline-none focus:ring-2 focus:ring-[#8f744e] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8f744e] mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={activeData.phoneNumber || ""}
                  onChange={(e) =>
                    handleRootChange("phoneNumber", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#e6e0d8] text-[#8f744e] outline-none focus:ring-2 focus:ring-[#8f744e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8f744e] mb-1">
                    See More Text
                  </label>
                  <input
                    type="text"
                    value={copy.seeMore || ""}
                    onChange={(e) =>
                      handleTextChange("seeMore", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#e6e0d8] text-[#8f744e] outline-none focus:ring-2 focus:ring-[#8f744e]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8f744e] mb-1">
                    Show Less Text
                  </label>
                  <input
                    type="text"
                    value={copy.showLess || ""}
                    onChange={(e) =>
                      handleTextChange("showLess", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#e6e0d8] text-[#8f744e] outline-none focus:ring-2 focus:ring-[#8f744e]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full sm:w-fit text-center mt-8 px-6 sm:px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #8f744e, #b4a389)",
                boxShadow: "0 10px 30px rgba(143,116,78,0.3)",
              }}
            >
              {copy.button}
            </a>
          )}
        </div>

        {/* Right side: information card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-[#e6e0d8] w-full">
          {editMode ? (
            <textarea
              value={copy.paragraph || ""}
              onChange={(e) => handleTextChange("paragraph", e.target.value)}
              rows="10"
              className="w-full text-[#8f744e] leading-relaxed rounded-xl px-4 py-3 border border-[#e6e0d8] outline-none focus:ring-2 focus:ring-[#8f744e] resize-none"
            />
          ) : (
            <p className="text-[#8f744e] leading-relaxed text-base sm:text-lg">
              {visibleParagraph}
            </p>
          )}

          {!editMode && fullParagraph.length > 260 && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-6 text-[#8f744e] font-semibold hover:text-[#b4a389] transition"
            >
              {expanded ? copy.showLess : copy.seeMore}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}