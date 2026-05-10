"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { Edit, Save, X, Plus, Trash2, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const socialIconMap = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  whatsapp: FaWhatsapp,
};

const DEFAULT_DATA = {
  logo: "/curtains-logo.png",
  brandName: "SKF Curtains",
  socialLinks: [
    {
      key: "facebook",
      icon: "facebook",
      href: "https://www.facebook.com/skfcurtains",
    },
    {
      key: "instagram",
      icon: "instagram",
      href: "https://www.instagram.com/skfcurtains",
    },
    {
      key: "twitter",
      icon: "twitter",
      href: "https://twitter.com/yourpage",
    },
    {
      key: "whatsapp",
      icon: "whatsapp",
      href: "https://wa.me/971547219791",
    },
  ],
  translations: {
    EN: {
      tagline: "LUXURY INTERIORS",
      description:
        "Premium curtain solutions designed to bring elegance, comfort, and refined style into every space.",
      quickLinks: "Quick Links",
      links: [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Collections",
          href: "/collections",
        },
        {
          label: "Contact",
          href: "/quotation",
        },
      ],
      allRightsReserved: "All rights reserved.",
    },
    DE: {
      tagline: "LUXUS-INNENRÄUME",
      description:
        "Premium-Vorhanglösungen, die Eleganz, Komfort und stilvolle Raffinesse in jeden Raum bringen.",
      quickLinks: "Schnelllinks",
      links: [
        {
          label: "Startseite",
          href: "/",
        },
        {
          label: "Kollektionen",
          href: "/collections",
        },
        {
          label: "Kontakt",
          href: "/quotation",
        },
      ],
      allRightsReserved: "Alle Rechte vorbehalten.",
    },
    AR: {
      tagline: "تصاميم داخلية فاخرة",
      description:
        "حلول ستائر فاخرة مصممة لإضافة الأناقة والراحة والأسلوب الراقي إلى كل مساحة.",
      quickLinks: "روابط سريعة",
      links: [
        {
          label: "الرئيسية",
          href: "/",
        },
        {
          label: "المجموعات",
          href: "/collections",
        },
        {
          label: "اتصل بنا",
          href: "/quotation",
        },
      ],
      allRightsReserved: "جميع الحقوق محفوظة.",
    },
    FR: {
      tagline: "INTÉRIEURS DE LUXE",
      description:
        "Des solutions de rideaux haut de gamme conçues pour apporter élégance, confort et style raffiné à chaque espace.",
      quickLinks: "Liens rapides",
      links: [
        {
          label: "Accueil",
          href: "/",
        },
        {
          label: "Collections",
          href: "/collections",
        },
        {
          label: "Contact",
          href: "/quotation",
        },
      ],
      allRightsReserved: "Tous droits réservés.",
    },
    IT: {
      tagline: "INTERNI DI LUSSO",
      description:
        "Soluzioni premium per tende progettate per portare eleganza, comfort e stile raffinato in ogni spazio.",
      quickLinks: "Link rapidi",
      links: [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Collezioni",
          href: "/collections",
        },
        {
          label: "Contatto",
          href: "/quotation",
        },
      ],
      allRightsReserved: "Tutti i diritti riservati.",
    },
    ES: {
      tagline: "INTERIORES DE LUJO",
      description:
        "Soluciones premium de cortinas diseñadas para aportar elegancia, comodidad y estilo refinado a cada espacio.",
      quickLinks: "Enlaces rápidos",
      links: [
        {
          label: "Inicio",
          href: "/",
        },
        {
          label: "Colecciones",
          href: "/collections",
        },
        {
          label: "Contacto",
          href: "/quotation",
        },
      ],
      allRightsReserved: "Todos los derechos reservados.",
    },
  },
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const normalizeData = (apiData) => {
  if (!apiData || typeof apiData !== "object") return DEFAULT_DATA;

  return {
    ...DEFAULT_DATA,
    ...apiData,
    socialLinks: Array.isArray(apiData.socialLinks)
      ? apiData.socialLinks
      : DEFAULT_DATA.socialLinks,
    translations: {
      ...DEFAULT_DATA.translations,
      ...(apiData.translations || {}),
    },
  };
};

export default function LuxuryFooter() {
  const { lang } = useLanguage();

  const [data, setData] = useState(DEFAULT_DATA);
  const [tempData, setTempData] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const logoInputRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const ENDPOINT = `${apiUrl}/layout/footer/`;

  const year = new Date().getFullYear();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAdmin(!!authToken);
  }, []);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
          throw new Error("Failed to fetch footer data");
        }

        const jsonData = await response.json();
        const normalizedData = normalizeData(jsonData);

        setData(normalizedData);
        setTempData(normalizedData);
      } catch (error) {
        console.error("Error fetching footer data:", error);
        setData(DEFAULT_DATA);
        setTempData(DEFAULT_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, [ENDPOINT]);

  const activeData = editMode ? tempData : data;

  const copy =
    activeData?.translations?.[lang] ||
    activeData?.translations?.EN ||
    DEFAULT_DATA.translations.EN;

  const socialLinks = Array.isArray(activeData.socialLinks)
    ? activeData.socialLinks
    : [];

  const quickLinks = Array.isArray(copy.links) ? copy.links : [];

  const ensureCurrentLanguageExists = (newData) => {
    if (!newData.translations) {
      newData.translations = {};
    }

    if (!newData.translations[lang]) {
      newData.translations[lang] =
        cloneData(newData.translations.EN) ||
        cloneData(DEFAULT_DATA.translations.EN);
    }

    if (!Array.isArray(newData.translations[lang].links)) {
      newData.translations[lang].links = [];
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

  const handleQuickLinkChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].links[index][field] = value;
      return newData;
    });
  };

  const addQuickLink = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      newData.translations[lang].links.push({
        label: "New Link",
        href: "/",
      });

      return newData;
    });
  };

  const removeQuickLink = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].links.length <= 1) {
        alert("You must keep at least one quick link.");
        return prev;
      }

      newData.translations[lang].links = newData.translations[
        lang
      ].links.filter((_, i) => i !== index);

      return newData;
    });
  };

  const handleSocialLinkChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);

      if (!Array.isArray(newData.socialLinks)) {
        newData.socialLinks = [];
      }

      newData.socialLinks[index][field] = value;
      return newData;
    });
  };

  const addSocialLink = () => {
    setTempData((prev) => ({
      ...prev,
      socialLinks: [
        ...(Array.isArray(prev.socialLinks) ? prev.socialLinks : []),
        {
          key: `social-${Date.now()}`,
          icon: "facebook",
          href: "https://example.com",
        },
      ],
    }));
  };

  const removeSocialLink = (index) => {
    setTempData((prev) => {
      const socialLinks = Array.isArray(prev.socialLinks)
        ? prev.socialLinks
        : [];

      if (socialLinks.length <= 1) {
        alert("You must keep at least one social link.");
        return prev;
      }

      return {
        ...prev,
        socialLinks: socialLinks.filter((_, i) => i !== index),
      };
    });
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authentication required for logo upload.");
      return;
    }

    setIsUploadingLogo(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "footer-logo");

    try {
      const response = await fetch(`${apiUrl}/images/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Logo upload failed");
      }

      const result = await response.json();

      setTempData((prev) => ({
        ...prev,
        logo: result.image,
      }));
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Logo upload failed.");
    } finally {
      setIsUploadingLogo(false);

      if (logoInputRef.current) {
        logoInputRef.current.value = "";
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
      const response = await fetch(ENDPOINT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(tempData),
      });

      if (!response.ok) {
        throw new Error("Failed to save footer data");
      }

      const updatedData = await response.json();
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);

      alert("Footer updated successfully!");
    } catch (error) {
      console.error("Error saving footer data:", error);
      alert("Failed to save footer data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <footer className="w-full bg-[#8f744e] text-white pt-16 pb-10 px-3 sm:px-6 md:px-12">
        <div className="w-full max-w-7xl px-0 sm:px-6 mx-auto flex items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#8f744e] text-white pt-16 pb-10 px-3 sm:px-6 md:px-12 relative">
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
              title="Edit Footer"
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      <div className="w-full max-w-7xl px-0 sm:px-6 mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Left side: logo, brand, social */}
        <div className="w-full">
          {editMode && (
            <div className="mb-6">
              <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow">
                EDIT MODE ENABLED - Editing {lang}
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            {/* Logo container */}
            <div className="bg-white p-3 rounded-xl shadow-lg relative">
              {isUploadingLogo ? (
                <div className="w-[75px] h-[75px] flex items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8f744e]"></div>
                </div>
              ) : (
                <Image
                  src={activeData.logo || "/curtains-logo.png"}
                  alt="SKF Curtains Logo"
                  width={75}
                  height={75}
                  className="object-contain"
                  priority
                  unoptimized
                />
              )}

              {editMode && (
                <>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />

                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="absolute -bottom-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg disabled:opacity-60"
                    title="Upload Logo"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="min-w-0">
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={activeData.brandName || ""}
                    onChange={(e) =>
                      handleRootChange("brandName", e.target.value)
                    }
                    className="w-full text-2xl font-semibold tracking-wide bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#e6e0d8]"
                  />

                  <input
                    type="text"
                    value={copy.tagline || ""}
                    onChange={(e) =>
                      handleTextChange("tagline", e.target.value)
                    }
                    className="w-full mt-2 text-[#e6e0d8] text-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#e6e0d8]"
                  />
                </>
              ) : (
                <Link href="/" className="block">
                  <h3 className="text-2xl font-semibold tracking-wide">
                    {activeData.brandName}
                  </h3>
                  <p className="text-[#e6e0d8] text-sm">{copy.tagline}</p>
                </Link>
              )}
            </div>
          </div>

          {editMode ? (
            <textarea
              value={copy.description || ""}
              onChange={(e) =>
                handleTextChange("description", e.target.value)
              }
              rows="4"
              className="text-[#e6e0d8] leading-relaxed max-w-md w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#e6e0d8] resize-none"
            />
          ) : (
            <p className="text-[#e6e0d8] leading-relaxed max-w-md">
              {copy.description}
            </p>
          )}

          {/* Social icons */}
          <div className="flex gap-4 mt-8 flex-wrap">
            {socialLinks.map((social, index) => {
              const Icon = socialIconMap[social.icon] || FaFacebookF;

              if (editMode) {
                return (
                  <div
                    key={`${social.key}-${index}`}
                    className="bg-white/10 border border-white/20 rounded-2xl p-3 w-full sm:w-[260px] relative"
                  >
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg"
                      title="Remove Social Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <label className="block text-xs text-[#e6e0d8] mb-1">
                      Icon
                    </label>
                    <select
                      value={social.icon}
                      onChange={(e) =>
                        handleSocialLinkChange(index, "icon", e.target.value)
                      }
                      className="w-full mb-2 px-3 py-2 rounded-lg bg-[#8f744e] border border-white/20 text-white outline-none"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>

                    <label className="block text-xs text-[#e6e0d8] mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      value={social.href}
                      onChange={(e) =>
                        handleSocialLinkChange(index, "href", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                    />
                  </div>
                );
              }

              return (
                <a
                  key={`${social.key}-${index}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-[#b4a389] flex items-center justify-center hover:bg-white hover:text-[#8f744e] transition duration-300"
                >
                  <Icon />
                </a>
              );
            })}

            {editMode && (
              <button
                onClick={addSocialLink}
                className="w-11 h-11 rounded-full border-2 border-dashed border-[#e6e0d8] flex items-center justify-center hover:bg-white hover:text-[#8f744e] transition duration-300"
                title="Add Social Link"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Right side: quick links */}
        <div className="w-full">
          {editMode ? (
            <input
              type="text"
              value={copy.quickLinks || ""}
              onChange={(e) => handleTextChange("quickLinks", e.target.value)}
              className="w-full text-lg font-semibold mb-6 border border-white/20 bg-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#e6e0d8]"
            />
          ) : (
            <h4 className="text-lg font-semibold mb-6 border-b border-[#b4a389] pb-3">
              {copy.quickLinks}
            </h4>
          )}

          <ul className="space-y-4 text-[#e6e0d8]">
            {quickLinks.map((item, index) => (
              <li key={`${item.href}-${index}`}>
                {editMode ? (
                  <div className="bg-white/10 border border-white/20 rounded-xl p-3 relative">
                    <button
                      onClick={() => removeQuickLink(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg"
                      title="Remove Quick Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <label className="block text-xs text-[#e6e0d8] mb-1">
                      Link Text
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        handleQuickLinkChange(index, "label", e.target.value)
                      }
                      className="w-full mb-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                    />

                    <label className="block text-xs text-[#e6e0d8] mb-1">
                      Link URL
                    </label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) =>
                        handleQuickLinkChange(index, "href", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                    />
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-white transition duration-300"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {editMode && (
            <button
              onClick={addQuickLink}
              className="mt-5 rounded-xl border-2 border-dashed border-[#e6e0d8] text-[#e6e0d8] px-5 py-3 flex items-center gap-2 hover:bg-white hover:text-[#8f744e] transition"
            >
              <Plus className="w-5 h-5" />
              Add Quick Link
            </button>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#b4a389] mt-14 pt-6 text-center text-[#e6e0d8] text-sm">
        {editMode ? (
          <input
            type="text"
            value={copy.allRightsReserved || ""}
            onChange={(e) =>
              handleTextChange("allRightsReserved", e.target.value)
            }
            className="w-full max-w-md text-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[#e6e0d8] outline-none focus:ring-2 focus:ring-[#e6e0d8]"
          />
        ) : (
          <>
            © {year} {activeData.brandName}. {copy.allRightsReserved}
          </>
        )}
      </div>
    </footer>
  );
}