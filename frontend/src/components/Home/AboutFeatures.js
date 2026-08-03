"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Truck,
  BadgeDollarSign,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import useEditableContent from "@/hooks/useEditableContent";

const iconMap = {
  LayoutGrid,
  Truck,
  BadgeDollarSign,
};

const DEFAULT_DATA = {
  translations: {
    EN: {
      features: [
        {
          key: "curtainCollection",
          icon: "LayoutGrid",
          title: "Curtain Collection",
          description: "Any Curtain for your space",
        },
        {
          key: "freeShipping",
          icon: "Truck",
          title: "Free Shipping",
          description: "Free shipping on order",
        },
        {
          key: "moneyBack",
          icon: "BadgeDollarSign",
          title: "100% Money Back",
          description: "If the item didn't suit you",
        },
      ],
    },
    DE: {
      features: [
        {
          key: "curtainCollection",
          icon: "LayoutGrid",
          title: "Vorhangkollektion",
          description: "Jeder Vorhang für Ihren Raum",
        },
        {
          key: "freeShipping",
          icon: "Truck",
          title: "Kostenloser Versand",
          description: "Kostenloser Versand bei Bestellung",
        },
        {
          key: "moneyBack",
          icon: "BadgeDollarSign",
          title: "100 % Geld-zurück-Garantie",
          description: "Wenn der Artikel Ihnen nicht zusagt",
        },
      ],
    },
    AR: {
      features: [
        {
          key: "curtainCollection",
          icon: "LayoutGrid",
          title: "مجموعة الستائر",
          description: "أي ستارة لمساحتك",
        },
        {
          key: "freeShipping",
          icon: "Truck",
          title: "شحن مجاني",
          description: "شحن مجاني على الطلب",
        },
        {
          key: "moneyBack",
          icon: "BadgeDollarSign",
          title: "استرداد 100٪",
          description: "إذا لم يناسبك المنتج",
        },
      ],
    },
    FR: {
      features: [
        {
          key: "curtainCollection",
          icon: "LayoutGrid",
          title: "Collection de rideaux",
          description: "Des rideaux pour tous vos espaces",
        },
        {
          key: "freeShipping",
          icon: "Truck",
          title: "Livraison gratuite",
          description: "Livraison gratuite sur votre commande",
        },
        {
          key: "moneyBack",
          icon: "BadgeDollarSign",
          title: "Remboursement à 100 %",
          description: "Si l'article ne vous convient pas",
        },
      ],
    },
    IT: {
      features: [
        {
          key: "curtainCollection",
          icon: "LayoutGrid",
          title: "Collezione di tende",
          description: "Qualsiasi tenda per il tuo spazio",
        },
        {
          key: "freeShipping",
          icon: "Truck",
          title: "Spedizione gratuita",
          description: "Spedizione gratuita sull'ordine",
        },
        {
          key: "moneyBack",
          icon: "BadgeDollarSign",
          title: "Rimborso al 100 %",
          description: "Se l'articolo non fa per te",
        },
      ],
    },
    ES: {
      features: [
        {
          key: "curtainCollection",
          icon: "LayoutGrid",
          title: "Colección de cortinas",
          description: "Cualquier cortina para tu espacio",
        },
        {
          key: "freeShipping",
          icon: "Truck",
          title: "Envío gratis",
          description: "Envío gratis en el pedido",
        },
        {
          key: "moneyBack",
          icon: "BadgeDollarSign",
          title: "Devolución del 100 %",
          description: "Si el artículo no te convence",
        },
      ],
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
 * A section displaying the key service features offered by the brand.
 * Each feature title and description is translated via the
 * LanguageContext. Icons are sourced from Lucide.
 */
export default function AboutFeatures({ initialContent = null }) {
  const { lang } = useLanguage();

  const { isAuthenticated: isAdmin } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const ENDPOINT = `${apiUrl}/home/about/`;

  const { data, setData, tempData, setTempData, isLoading } = useEditableContent(
    ENDPOINT,
    {
      normalize: normalizeData,
      buildFallback: () => DEFAULT_DATA,
      initialContent,
    }
  );

  const activeData = editMode ? tempData : data;

  const activeFeatures =
    activeData?.translations?.[lang]?.features ||
    activeData?.translations?.EN?.features ||
    DEFAULT_DATA.translations.EN.features;

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

  const ensureCurrentLanguageExists = (newData) => {
    if (!newData.translations) {
      newData.translations = {};
    }

    if (!newData.translations[lang]) {
      newData.translations[lang] =
        cloneData(newData.translations.EN) ||
        cloneData(DEFAULT_DATA.translations.EN);
    }

    if (!Array.isArray(newData.translations[lang].features)) {
      newData.translations[lang].features = [];
    }

    return newData;
  };

  const handleFeatureChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      newData.translations[lang].features[index][field] = value;

      return newData;
    });
  };

  const addNewFeature = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      newData.translations[lang].features.push({
        key: `newFeature${Date.now()}`,
        icon: "LayoutGrid",
        title: "New Feature",
        description: "Feature description",
      });

      return newData;
    });
  };

  const removeFeature = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].features.length <= 1) {
        alert("You must keep at least one feature.");
        return prev;
      }

      newData.translations[lang].features = newData.translations[
        lang
      ].features.filter((_, i) => i !== index);

      return newData;
    });
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
        throw new Error("Failed to save about features data");
      }

      const updatedData = await response.json();
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);

      alert("About features updated successfully!");
    } catch (error) {
      console.error("Error saving about features data:", error);
      alert("Failed to save about features data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center py-10">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-14 sm:pt-20 pb-10 sm:pb-12 overflow-hidden">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20">
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

      {/* Background glow accents */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#D4AF37]/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#118a94]/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {activeFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon] || LayoutGrid;

            return (
              <div
                key={`${feature.key}-${index}`}
                className="group relative flex flex-col sm:flex-row sm:items-center bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {editMode && (
                  <button
                    onClick={() => removeFeature(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 z-10 shadow-lg"
                    title="Remove Feature"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Colored bar */}
                <div className="h-1.5 w-full sm:w-2 sm:h-auto sm:self-stretch bg-gradient-to-r sm:bg-gradient-to-b from-[#D4AF37] via-[#F5D76E] to-[#B8962E]" />

                {/* Content */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-5 text-center sm:text-left w-full">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#0760ad] to-[#118a94] text-white shadow-md group-hover:scale-110 transition">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  <div className="min-w-0 w-full">
                    {editMode ? (
                      <>
                        <label className="block text-xs text-gray-500 mb-1">
                          Icon
                        </label>
                        <select
                          value={feature.icon}
                          onChange={(e) =>
                            handleFeatureChange(index, "icon", e.target.value)
                          }
                          className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="LayoutGrid">LayoutGrid</option>
                          <option value="Truck">Truck</option>
                          <option value="BadgeDollarSign">
                            BadgeDollarSign
                          </option>
                        </select>

                        <label className="block text-xs text-gray-500 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) =>
                            handleFeatureChange(index, "title", e.target.value)
                          }
                          className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-200 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />

                        <label className="block text-xs text-gray-500 mb-1">
                          Description
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) =>
                            handleFeatureChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows="2"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#0760ad] group-hover:to-[#339166] group-hover:bg-clip-text transition">
                          {feature.title}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                          {feature.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {editMode && (
            <button
              onClick={addNewFeature}
              className="min-h-[140px] rounded-xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-600 transition"
            >
              <Plus className="w-7 h-7" />
              <span className="font-medium">Add New Feature</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}