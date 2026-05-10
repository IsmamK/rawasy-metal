"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit, Save, X, Plus, Trash2, Upload } from "lucide-react";

const DEFAULT_DATA = {
  translations: {
    EN: {
      heading: "Our Curtain Collections",
      collections: [
        {
          key: "home",
          title: "Home Curtains",
          image: "/curtain_home.png",
          video: "/home.mp4",
          href: "/collections/home",
        },
        {
          key: "office",
          title: "Office Curtains",
          image: "/curtain_office.png",
          video: "/office.mp4",
          href: "/collections/office",
        },
        {
          key: "medicalClinic",
          title: "Medical & Clinic Curtains",
          image: "/curtain_medical.png",
          video: "/medical.mp4",
          href: "/collections/medical-clinic",
        },
        {
          key: "accessories",
          title: "Curtain Accessories",
          image: "/accessories.jpeg",
          video: "/others.mp4",
          href: "/collections/accessories",
        },
      ],
    },
    DE: {
      heading: "Unsere Vorhangkollektionen",
      collections: [
        {
          key: "home",
          title: "Vorhänge für Zuhause",
          image: "/curtain_home.png",
          video: "/home.mp4",
          href: "/collections/home",
        },
        {
          key: "office",
          title: "Bürovorhänge",
          image: "/curtain_office.png",
          video: "/office.mp4",
          href: "/collections/office",
        },
        {
          key: "medicalClinic",
          title: "Medizinische & Klinikvorhänge",
          image: "/curtain_medical.png",
          video: "/medical.mp4",
          href: "/collections/medical-clinic",
        },
        {
          key: "accessories",
          title: "Vorhangzubehör",
          image: "/accessories.jpeg",
          video: "/others.mp4",
          href: "/collections/accessories",
        },
      ],
    },
    AR: {
      heading: "مجموعات الستائر الخاصة بنا",
      collections: [
        {
          key: "home",
          title: "ستائر منزلية",
          image: "/curtain_home.png",
          video: "/home.mp4",
          href: "/collections/home",
        },
        {
          key: "office",
          title: "ستائر مكتبية",
          image: "/curtain_office.png",
          video: "/office.mp4",
          href: "/collections/office",
        },
        {
          key: "medicalClinic",
          title: "ستائر طبية وعيادات",
          image: "/curtain_medical.png",
          video: "/medical.mp4",
          href: "/collections/medical-clinic",
        },
        {
          key: "accessories",
          title: "إكسسوارات الستائر",
          image: "/accessories.jpeg",
          video: "/others.mp4",
          href: "/collections/accessories",
        },
      ],
    },
    FR: {
      heading: "Nos collections de rideaux",
      collections: [
        {
          key: "home",
          title: "Rideaux pour la maison",
          image: "/curtain_home.png",
          video: "/home.mp4",
          href: "/collections/home",
        },
        {
          key: "office",
          title: "Rideaux de bureau",
          image: "/curtain_office.png",
          video: "/office.mp4",
          href: "/collections/office",
        },
        {
          key: "medicalClinic",
          title: "Rideaux médicaux et de clinique",
          image: "/curtain_medical.png",
          video: "/medical.mp4",
          href: "/collections/medical-clinic",
        },
        {
          key: "accessories",
          title: "Accessoires de rideaux",
          image: "/accessories.jpeg",
          video: "/others.mp4",
          href: "/collections/accessories",
        },
      ],
    },
    IT: {
      heading: "Le nostre collezioni di tende",
      collections: [
        {
          key: "home",
          title: "Tende per la casa",
          image: "/curtain_home.png",
          video: "/home.mp4",
          href: "/collections/home",
        },
        {
          key: "office",
          title: "Tende per ufficio",
          image: "/curtain_office.png",
          video: "/office.mp4",
          href: "/collections/office",
        },
        {
          key: "medicalClinic",
          title: "Tende mediche e da clinica",
          image: "/curtain_medical.png",
          video: "/medical.mp4",
          href: "/collections/medical-clinic",
        },
        {
          key: "accessories",
          title: "Accessori per tende",
          image: "/accessories.jpeg",
          video: "/others.mp4",
          href: "/collections/accessories",
        },
      ],
    },
    ES: {
      heading: "Nuestras colecciones de cortinas",
      collections: [
        {
          key: "home",
          title: "Cortinas para el hogar",
          image: "/curtain_home.png",
          video: "/home.mp4",
          href: "/collections/home",
        },
        {
          key: "office",
          title: "Cortinas para oficina",
          image: "/curtain_office.png",
          video: "/office.mp4",
          href: "/collections/office",
        },
        {
          key: "medicalClinic",
          title: "Cortinas médicas y de clínica",
          image: "/curtain_medical.png",
          video: "/medical.mp4",
          href: "/collections/medical-clinic",
        },
        {
          key: "accessories",
          title: "Accesorios para cortinas",
          image: "/accessories.jpeg",
          video: "/others.mp4",
          href: "/collections/accessories",
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
 * Display a grid of collection cards. When hovered, each card reveals a
 * video preview. The heading and card titles are translated via
 * LanguageContext.
 */
export default function CollectionsSection() {
  const { lang } = useLanguage();

  const [data, setData] = useState(DEFAULT_DATA);
  const [tempData, setTempData] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState({});

  const imageInputRefs = useRef({});
  const videoInputRefs = useRef({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const ENDPOINT = `${apiUrl}/home/service/`;

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAdmin(!!authToken);
  }, []);

  useEffect(() => {
    const fetchCollectionsData = async () => {
      try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
          throw new Error("Failed to fetch collections data");
        }

        const jsonData = await response.json();
        const normalizedData = normalizeData(jsonData);

        setData(normalizedData);
        setTempData(normalizedData);
      } catch (error) {
        console.error("Error fetching collections data:", error);
        setData(DEFAULT_DATA);
        setTempData(DEFAULT_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionsData();
  }, [ENDPOINT]);

  const activeData = editMode ? tempData : data;

  const activeContent =
    activeData?.translations?.[lang] ||
    activeData?.translations?.EN ||
    DEFAULT_DATA.translations.EN;

  const activeCollections =
    activeContent?.collections || DEFAULT_DATA.translations.EN.collections;

  const ensureCurrentLanguageExists = (newData) => {
    if (!newData.translations) {
      newData.translations = {};
    }

    if (!newData.translations[lang]) {
      newData.translations[lang] =
        cloneData(newData.translations.EN) ||
        cloneData(DEFAULT_DATA.translations.EN);
    }

    if (!Array.isArray(newData.translations[lang].collections)) {
      newData.translations[lang].collections = [];
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

  const handleHeadingChange = (value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].heading = value;
      return newData;
    });
  };

  const handleCollectionChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].collections[index][field] = value;
      return newData;
    });
  };

  const addCollection = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      newData.translations[lang].collections.push({
        key: `newCollection${Date.now()}`,
        title: "New Collection",
        image: "/curtain_home.png",
        video: "/home.mp4",
        href: "/collections/home",
      });

      return newData;
    });
  };

  const removeCollection = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].collections.length <= 1) {
        alert("You must keep at least one collection.");
        return prev;
      }

      newData.translations[lang].collections = newData.translations[
        lang
      ].collections.filter((_, i) => i !== index);

      return newData;
    });
  };

  const handleMediaUpload = async (event, index, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authentication required for upload.");
      return;
    }

    const uploadKey = `${index}-${field}`;
    setUploadingMedia((prev) => ({ ...prev, [uploadKey]: true }));

    const formData = new FormData();

    // Backend upload API expects the file in the "image" field and returns { image: "uploaded-url" }
    formData.append("image", file);
    formData.append(
      "category",
      field === "video" ? "collection-videos" : "collection-images"
    );

    try {
      const response = await fetch(`${apiUrl}/images/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`${field} upload failed`);
      }

      const result = await response.json();

      handleCollectionChange(index, field, result.image);
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
      alert(`${field === "video" ? "Video" : "Image"} upload failed.`);
    } finally {
      setUploadingMedia((prev) => ({ ...prev, [uploadKey]: false }));

      if (field === "image" && imageInputRefs.current[index]) {
        imageInputRefs.current[index].value = "";
      }

      if (field === "video" && videoInputRefs.current[index]) {
        videoInputRefs.current[index].value = "";
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
        throw new Error("Failed to save collections data");
      }

      const updatedData = await response.json();
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);

      alert("Collections section updated successfully!");
    } catch (error) {
      console.error("Error saving collections data:", error);
      alert("Failed to save collections section.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="relative pt-15 pb-5 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-black/60" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-center items-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-15 pb-5 overflow-hidden">
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

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-black/60" />

      {/* Luxury glow accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/20 blur-[140px] rounded-full -z-10" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F5D76E]/10 blur-[140px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {editMode && (
          <div className="mb-6 text-center">
            <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow">
              EDIT MODE ENABLED - Editing {lang}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          {editMode ? (
            <input
              type="text"
              value={activeContent.heading || ""}
              onChange={(e) => handleHeadingChange(e.target.value)}
              className="w-full max-w-3xl mx-auto text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-white/10 border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-[#279ccb] outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          ) : (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#07619b] to-[#279ccb] bg-clip-text text-transparent">
              {activeContent.heading}
            </h2>
          )}

          <div className="w-24 h-[5px] mx-auto mt-4 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {activeCollections.map((item, index) => {
            const imageUploading = uploadingMedia[`${index}-image`];
            const videoUploading = uploadingMedia[`${index}-video`];

            const CardContent = (
              <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_25px_60px_rgba(212,175,55,0.35)] perspective-1500">
                {/* Image */}
                <div className="relative w-full h-full">
                  {imageUploading ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/50">
                      <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37]"></div>
                    </div>
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition-all duration-500 group-hover:opacity-0"
                    />
                  )}

                  {/* Video preview on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <video
                      className="w-full h-full object-cover"
                      src={item.video}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      autoPlay
                    />
                  </div>

                  {videoUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37]"></div>
                        <p className="text-white text-sm mt-3">
                          Uploading video...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[#D4AF37]/20 to-transparent transition duration-500" />

                {/* Title */}
                <div className="absolute bottom-6 left-6 right-6">
                  {editMode ? (
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleCollectionChange(index, "title", e.target.value)
                      }
                      className="w-full text-xl md:text-2xl font-semibold text-white bg-black/40 border border-white/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  ) : (
                    <h3 className="text-xl md:text-2xl font-semibold text-white">
                      {item.title}
                    </h3>
                  )}

                  <div className="w-10 h-[2px] mt-2 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] group-hover:w-20 transition-all duration-300" />
                </div>
              </div>
            );

            if (editMode) {
              return (
                <div key={`${item.key}-${index}`} className="group relative">
                  <button
                    onClick={() => removeCollection(index)}
                    className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 z-20 shadow-lg"
                    title="Remove Collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {CardContent}

                  <div className="mt-4 bg-black/50 border border-[#D4AF37]/30 rounded-2xl p-4 space-y-3">
                    <div>
                      <label className="block text-xs text-[#F5D76E] mb-1">
                        Key
                      </label>
                      <input
                        type="text"
                        value={item.key}
                        onChange={(e) =>
                          handleCollectionChange(index, "key", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#F5D76E] mb-1">
                        Link / Href
                      </label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) =>
                          handleCollectionChange(index, "href", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#F5D76E] mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) =>
                          handleCollectionChange(index, "image", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#F5D76E] mb-1">
                        Video URL
                      </label>
                      <input
                        type="text"
                        value={item.video}
                        onChange={(e) =>
                          handleCollectionChange(index, "video", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
                      />
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        imageInputRefs.current[index] = el;
                      }}
                      className="hidden"
                      onChange={(e) => handleMediaUpload(e, index, "image")}
                    />

                    <input
                      type="file"
                      accept="video/*"
                      ref={(el) => {
                        videoInputRefs.current[index] = el;
                      }}
                      className="hidden"
                      onChange={(e) => handleMediaUpload(e, index, "video")}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => imageInputRefs.current[index]?.click()}
                        disabled={imageUploading}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition disabled:opacity-60"
                      >
                        <Upload className="w-4 h-4" />
                        {imageUploading ? "Uploading..." : "Upload Image"}
                      </button>

                      <button
                        onClick={() => videoInputRefs.current[index]?.click()}
                        disabled={videoUploading}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 transition disabled:opacity-60"
                      >
                        <Upload className="w-4 h-4" />
                        {videoUploading ? "Uploading..." : "Upload Video"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={`${item.key}-${index}`}
                href={item.href}
                className="group"
              >
                {CardContent}
              </Link>
            );
          })}

          {editMode && (
            <button
              onClick={addCollection}
              className="min-h-[380px] rounded-2xl border-2 border-dashed border-[#D4AF37]/50 bg-black/30 text-[#F5D76E] flex flex-col items-center justify-center gap-3 hover:bg-[#D4AF37] hover:text-black transition"
            >
              <Plus className="w-8 h-8" />
              <span className="font-semibold">Add New Collection</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}