"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiUpload,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

const DEFAULT_HERO_DATA = {
  backgroundImage: "/curtains-hero.png",
  whatsappNumber: "971547219791",
  translations: {
    EN: {
      badge: "LUXURY CURTAIN COLLECTION",
      titleStart: "Transform Your Home with",
      titleHighlight: "Premium Curtains & Blinds",
      description:
        "Experience elegance, comfort, and sophistication with our exclusive luxury curtain collections designed for modern living.",
      buttons: [
        {
          label: "View Collections",
          type: "link",
          href: "/collections",
          message: "",
        },
        {
          label: "Book A Free Appointment",
          type: "whatsapp",
          href: "",
          message: "Hello, I would like to book an appointment.",
        },
      ],
    },
    DE: {
      badge: "LUXUSVORHANGKOLLEKTION",
      titleStart: "Verwandeln Sie Ihr Zuhause mit",
      titleHighlight: "Premiumvorhängen & Jalousien",
      description:
        "Erleben Sie Eleganz, Komfort und Raffinesse mit unseren exklusiven Luxusvorhangkollektionen, die für modernes Wohnen entworfen wurden.",
      buttons: [
        {
          label: "Kollektionen ansehen",
          type: "link",
          href: "/collections",
          message: "",
        },
        {
          label: "Kostenlosen Termin buchen",
          type: "whatsapp",
          href: "",
          message: "Hallo, ich möchte einen Termin buchen.",
        },
      ],
    },
    AR: {
      badge: "مجموعة الستائر الفاخرة",
      titleStart: "حوّل منزلك مع",
      titleHighlight: "ستائر وستائر فاخرة",
      description:
        "اختبر الأناقة والراحة والرقي مع مجموعات الستائر الفاخرة الحصرية المصممة للعيش العصري.",
      buttons: [
        {
          label: "عرض المجموعات",
          type: "link",
          href: "/collections",
          message: "",
        },
        {
          label: "حجز موعد مجاني",
          type: "whatsapp",
          href: "",
          message: "مرحبًا، أود حجز موعد.",
        },
      ],
    },
    FR: {
      badge: "COLLECTION DE RIDEAUX DE LUXE",
      titleStart: "Transformez votre maison avec",
      titleHighlight: "des rideaux et stores haut de gamme",
      description:
        "Découvrez l'élégance, le confort et la sophistication avec nos collections exclusives de rideaux de luxe conçues pour la vie moderne.",
      buttons: [
        {
          label: "Voir les collections",
          type: "link",
          href: "/collections",
          message: "",
        },
        {
          label: "Réserver un rendez-vous gratuit",
          type: "whatsapp",
          href: "",
          message: "Bonjour, je souhaite prendre rendez-vous.",
        },
      ],
    },
    IT: {
      badge: "COLLEZIONE DI TENDE DI LUSSO",
      titleStart: "Trasforma la tua casa con",
      titleHighlight: "tende e tapparelle di alta qualità",
      description:
        "Vivi eleganza, comfort e raffinatezza con le nostre esclusive collezioni di tende di lusso progettate per la vita moderna.",
      buttons: [
        {
          label: "Vedi le collezioni",
          type: "link",
          href: "/collections",
          message: "",
        },
        {
          label: "Prenota un appuntamento gratuito",
          type: "whatsapp",
          href: "",
          message: "Ciao, vorrei prenotare un appuntamento.",
        },
      ],
    },
    ES: {
      badge: "COLECCIÓN DE CORTINAS DE LUJO",
      titleStart: "Transforma tu hogar con",
      titleHighlight: "cortinas y persianas de primera calidad",
      description:
        "Experimenta la elegancia, comodidad y sofisticación con nuestras exclusivas colecciones de cortinas de lujo diseñadas para la vida moderna.",
      buttons: [
        {
          label: "Ver colecciones",
          type: "link",
          href: "/collections",
          message: "",
        },
        {
          label: "Reservar una cita gratuita",
          type: "whatsapp",
          href: "",
          message: "Hola, me gustaría reservar una cita.",
        },
      ],
    },
  },
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const normalizeApiData = (apiData) => {
  if (!apiData || typeof apiData !== "object") {
    return DEFAULT_HERO_DATA;
  }

  return {
    ...DEFAULT_HERO_DATA,
    ...apiData,
    translations: {
      ...DEFAULT_HERO_DATA.translations,
      ...(apiData.translations || {}),
    },
  };
};

export default function Hero() {
  const { lang } = useLanguage();

  const [data, setData] = useState(DEFAULT_HERO_DATA);
  const [tempData, setTempData] = useState(DEFAULT_HERO_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const endpoint = `${apiUrl}/home/hero/`;

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAdmin(!!authToken);
  }, []);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to fetch hero data");
        }

        const jsonData = await response.json();
        const normalizedData = normalizeApiData(jsonData);

        setData(normalizedData);
        setTempData(normalizedData);
      } catch (error) {
        console.error("Error fetching hero data:", error);
        setData(DEFAULT_HERO_DATA);
        setTempData(DEFAULT_HERO_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, [endpoint]);

  const activeData = editMode ? tempData : data;

  const activeCopy =
    activeData?.translations?.[lang] ||
    activeData?.translations?.EN ||
    DEFAULT_HERO_DATA.translations[lang] ||
    DEFAULT_HERO_DATA.translations.EN;

  const heroImage = activeData?.backgroundImage || "/curtains-hero.png";
  const whatsappNumber = activeData?.whatsappNumber || "971547219791";

  const openWhatsApp = (message) => {
    const finalMessage =
      message ||
      activeCopy?.buttons?.find((btn) => btn.type === "whatsapp")?.message;

    const encodedMessage = encodeURIComponent(
      finalMessage || "Hello, I would like to book an appointment."
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank"
    );
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

  const updateCurrentLanguageField = (field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);

      if (!newData.translations) {
        newData.translations = {};
      }

      if (!newData.translations[lang]) {
        newData.translations[lang] =
          cloneData(newData.translations.EN) ||
          cloneData(DEFAULT_HERO_DATA.translations.EN);
      }

      newData.translations[lang][field] = value;

      return newData;
    });
  };

  const updateRootField = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateButtonField = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);

      if (!newData.translations) {
        newData.translations = {};
      }

      if (!newData.translations[lang]) {
        newData.translations[lang] =
          cloneData(newData.translations.EN) ||
          cloneData(DEFAULT_HERO_DATA.translations.EN);
      }

      if (!Array.isArray(newData.translations[lang].buttons)) {
        newData.translations[lang].buttons = [];
      }

      newData.translations[lang].buttons[index][field] = value;

      return newData;
    });
  };

  const addButton = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);

      if (!newData.translations) {
        newData.translations = {};
      }

      if (!newData.translations[lang]) {
        newData.translations[lang] =
          cloneData(newData.translations.EN) ||
          cloneData(DEFAULT_HERO_DATA.translations.EN);
      }

      if (!Array.isArray(newData.translations[lang].buttons)) {
        newData.translations[lang].buttons = [];
      }

      newData.translations[lang].buttons.push({
        label: "New Button",
        type: "link",
        href: "/",
        message: "",
      });

      return newData;
    });
  };

  const removeButton = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);

      if (newData.translations?.[lang]?.buttons?.length <= 1) {
        alert("You must keep at least one button.");
        return prev;
      }

      newData.translations[lang].buttons = newData.translations[
        lang
      ].buttons.filter((_, i) => i !== index);

      return newData;
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authentication required for image upload.");
      return;
    }

    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "hero-images");

    try {
      const response = await fetch(`${apiUrl}/images/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const result = await response.json();

      setTempData((prev) => ({
        ...prev,
        backgroundImage: result.image,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed.");
    } finally {
      setIsUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const saveChanges = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authentication required to save changes.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(tempData),
      });

      if (!response.ok) {
        throw new Error("Failed to save hero data");
      }

      const updatedData = await response.json();
      const normalizedData = normalizeApiData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);

      alert("Hero updated successfully!");
    } catch (error) {
      console.error("Error saving hero data:", error);
      alert("Failed to save hero data.");
    } finally {
      setIsSaving(false);
    }
  };

  const buttonBaseClass =
    "w-full sm:w-auto px-6 sm:px-10 py-4 rounded-full font-semibold transition-all duration-300";

  const primaryButtonClass =
    "text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8962E] hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] shadow-xl";

  const secondaryButtonClass =
    "text-[#F5D76E] border border-[#D4AF37] bg-black/40 backdrop-blur-md hover:bg-[#D4AF37] hover:text-black";

  if (isLoading) {
    return (
      <section className="relative w-full h-[92vh] min-h-[650px] flex items-center justify-center overflow-hidden bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
          <p className="mt-4 text-[#F5D76E]">Loading hero...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`
        relative w-full flex justify-center overflow-hidden
        ${
          editMode
            ? "min-h-[1120px] pt-[135px] sm:pt-[145px] md:pt-[150px] pb-32 items-start"
            : "min-h-[720px] pt-[105px] pb-20 items-start md:h-[92vh] md:min-h-[650px] md:pt-0 md:pb-0 md:items-center"
        }
      `}
    >
      {/* Admin Controls */}
      {isAdmin && (
        <div className="fixed top-28 right-4 sm:right-6 z-[80] flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-xl transition disabled:opacity-60"
                title="Save Hero"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <FiSave size={20} />
                )}
              </button>

              <button
                onClick={toggleEditMode}
                className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center shadow-xl transition"
                title="Cancel Editing"
              >
                <FiX size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={toggleEditMode}
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl transition"
              title="Edit Hero"
            >
              <FiEdit2 size={18} />
            </button>
          )}
        </div>
      )}

      {/* Edit Mode Notice */}
      {editMode && (
        <div className="fixed top-28 left-4 right-4 sm:left-6 sm:right-auto z-[80] rounded-full bg-yellow-400 text-black px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold shadow-xl text-center">
          EDIT MODE ENABLED - Editing {lang}
        </div>
      )}

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url("${heroImage}")` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/85 via-black/60 to-black/80" />

      {/* Gold glow accents */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#D4AF37]/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#F5D76E]/20 rounded-full blur-[140px]" />

      {/* Image Upload Control */}
      {editMode && (
        <div className="fixed bottom-28 right-4 sm:bottom-32 sm:right-6 z-[80]">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage}
            className="flex items-center gap-2 rounded-full bg-black/70 border border-[#D4AF37]/60 text-[#F5D76E] px-4 sm:px-5 py-3 shadow-xl hover:bg-[#D4AF37] hover:text-black transition disabled:opacity-60 text-sm sm:text-base"
          >
            {isUploadingImage ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
            ) : (
              <FiUpload />
            )}
            {isUploadingImage ? "Uploading..." : "Change Hero Image"}
          </button>
        </div>
      )}

      {/* Content */}
      <div
        className={`
          relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 text-center
          ${editMode ? "mt-8" : ""}
        `}
      >
        {/* Luxury badge */}
        <div className="inline-block mb-6 px-6 py-2 rounded-full border border-[#D4AF37]/40 bg-black/30 backdrop-blur-md">
          {editMode ? (
            <input
              type="text"
              value={activeCopy.badge}
              onChange={(e) =>
                updateCurrentLanguageField("badge", e.target.value)
              }
              className="bg-transparent text-[#F5D76E] text-sm tracking-widest font-medium text-center outline-none border border-[#D4AF37]/40 rounded-full px-3 py-1 min-w-[260px] max-w-[85vw]"
            />
          ) : (
            <span className="text-[#F5D76E] text-sm tracking-widest font-medium">
              {activeCopy.badge}
            </span>
          )}
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          {editMode ? (
            <div className="flex flex-col gap-4 items-center">
              <input
                type="text"
                value={activeCopy.titleStart}
                onChange={(e) =>
                  updateCurrentLanguageField("titleStart", e.target.value)
                }
                className="bg-transparent text-white text-center outline-none border border-white/20 rounded-xl px-4 py-2 max-w-full"
              />

              <input
                type="text"
                value={activeCopy.titleHighlight}
                onChange={(e) =>
                  updateCurrentLanguageField("titleHighlight", e.target.value)
                }
                className="bg-transparent bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8962E] bg-clip-text text-transparent text-center outline-none border border-[#D4AF37]/40 rounded-xl px-4 py-2 max-w-full"
              />
            </div>
          ) : (
            <>
              {activeCopy.titleStart}{" "}
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8962E] bg-clip-text text-transparent">
                {activeCopy.titleHighlight}
              </span>
            </>
          )}
        </h1>

        {/* Description */}
        {editMode ? (
          <textarea
            value={activeCopy.description}
            onChange={(e) =>
              updateCurrentLanguageField("description", e.target.value)
            }
            rows="3"
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 bg-black/40 border border-white/20 rounded-xl px-4 py-3 outline-none w-full resize-none"
          />
        ) : (
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            {activeCopy.description}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-[390px] sm:max-w-none mx-auto">
          {(activeCopy.buttons || []).map((button, index) => {
            const buttonClass = `${buttonBaseClass} ${
              index === 0 ? primaryButtonClass : secondaryButtonClass
            }`;

            if (editMode) {
              return (
                <div
                  key={index}
                  className="relative bg-black/50 border border-[#D4AF37]/30 rounded-2xl p-4 min-w-[260px] text-left"
                >
                  <button
                    onClick={() => removeButton(index)}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg"
                    title="Remove Button"
                  >
                    <FiTrash2 size={14} />
                  </button>

                  <label className="block text-xs text-[#F5D76E] mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={button.label}
                    onChange={(e) =>
                      updateButtonField(index, "label", e.target.value)
                    }
                    className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
                  />

                  <label className="block text-xs text-[#F5D76E] mb-1">
                    Button Type
                  </label>
                  <select
                    value={button.type}
                    onChange={(e) =>
                      updateButtonField(index, "type", e.target.value)
                    }
                    className="w-full mb-3 px-3 py-2 rounded-lg bg-black text-white border border-white/20 outline-none"
                  >
                    <option value="link">Link</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>

                  {button.type === "link" ? (
                    <>
                      <label className="block text-xs text-[#F5D76E] mb-1">
                        Link URL
                      </label>
                      <input
                        type="text"
                        value={button.href}
                        onChange={(e) =>
                          updateButtonField(index, "href", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-xs text-[#F5D76E] mb-1">
                        WhatsApp Message
                      </label>
                      <textarea
                        value={button.message}
                        onChange={(e) =>
                          updateButtonField(index, "message", e.target.value)
                        }
                        rows="3"
                        className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none resize-none"
                      />
                    </>
                  )}
                </div>
              );
            }

            if (button.type === "link") {
              return (
                <Link key={index} href={button.href || "/"} className="w-full sm:w-auto">
                  <button className={buttonClass}>{button.label}</button>
                </Link>
              );
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => openWhatsApp(button.message)}
              >
                {button.label}
              </button>
            );
          })}

          {editMode && (
            <button
              onClick={addButton}
              className="min-w-[220px] rounded-2xl border-2 border-dashed border-[#D4AF37]/50 text-[#F5D76E] bg-black/30 px-6 py-4 flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-black transition"
            >
              <FiPlus />
              Add Button
            </button>
          )}
        </div>

        {/* Admin Root Settings */}
        {editMode && (
          <div className="mt-8 max-w-xl mx-auto bg-black/50 border border-[#D4AF37]/30 rounded-2xl p-4 text-left">
            <label className="block text-xs text-[#F5D76E] mb-1">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={tempData.whatsappNumber || ""}
              onChange={(e) =>
                updateRootField("whatsappNumber", e.target.value)
              }
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
              placeholder="971547219791"
            />

            <label className="block text-xs text-[#F5D76E] mt-4 mb-1">
              Background Image URL
            </label>
            <input
              type="text"
              value={tempData.backgroundImage || ""}
              onChange={(e) =>
                updateRootField("backgroundImage", e.target.value)
              }
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
              placeholder="/curtains-hero.png"
            />
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}