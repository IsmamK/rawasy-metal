"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiCreditCard,
  FiGlobe,
  FiHeadphones,
  FiLayers,
  FiShoppingCart,
  FiTrendingUp,
  FiBox,
  FiUsers,
  FiStar,
  FiPhone,
  FiX,
  FiMaximize2,
  FiEdit2,
  FiSave,
  FiPlus,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const iconMap = {
  FiShoppingCart,
  FiLayers,
  FiGlobe,
  FiTrendingUp,
  FiCreditCard,
  FiHeadphones,
  FiBox,
  FiUsers,
};

const DEFAULT_DATA = {
  whatsappNumber: "971547219791",
  translations: {
    EN: {
      heading: "Featured Products",
      reviewsText: "reviews",
      clickForDetails: "Click for details",
      clickImageForFullScreen: "Click image for full screen",
      clickAnywhereOutside: "Click anywhere outside the image to close",
      productFullScreen: "Product full screen",
      callForMeasurement: "Call For Measurement",
      whatsappMessage: "Hello, I would like to book an appointment.",
      products: [
        {
          id: 1,
          key: "livingRoomCurtains",
          icon: "FiShoppingCart",
          title: "Living Room Curtains",
          description:
            "Experience crystal-clear sound with our premium noise-cancelling headphones. Perfect for music lovers and professionals. Features include 40-hour battery life, comfortable ear cushions, and foldable design for easy portability.",
          rating: 4.8,
          reviews: 1245,
          phone: "+971547219791",
          gradient: "from-purple-500 to-pink-500",
          bgGradient: "bg-gradient-to-br from-purple-500 to-pink-500",
          image: "/curtains_1.jpeg",
        },
        {
          id: 2,
          key: "blackoutCurtains",
          icon: "FiLayers",
          title: "Blackout Curtains",
          description:
            "Track your health and fitness goals with this advanced smartwatch. Features heart rate monitoring, GPS, sleep tracking, and 20+ sport modes. Water-resistant up to 50 meters.",
          rating: 4.7,
          reviews: 892,
          phone: "+971547219791",
          gradient: "from-blue-500 to-cyan-500",
          bgGradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
          image: "/curtains_2.jpeg",
        },
        {
          id: 3,
          key: "venetianBlind",
          icon: "FiGlobe",
          title: "Venetian Blind",
          description:
            "Premium organic coffee beans sourced from sustainable farms in Colombia. Rich aroma, smooth taste with notes of chocolate and caramel. Medium roast, perfect for any brewing method.",
          rating: 4.9,
          reviews: 2156,
          phone: "+971547219791",
          gradient: "from-green-500 to-emerald-500",
          bgGradient: "bg-gradient-to-br from-green-500 to-emerald-500",
          image: "/curtains_3.jpeg",
        },
        {
          id: 4,
          key: "bedCurtains",
          icon: "FiTrendingUp",
          title: "Bed Curtains",
          description:
            "Complete photography kit with 4K video capability, interchangeable lenses, and professional-grade sensor. Includes 24-70mm lens, carrying case, and 64GB memory card.",
          rating: 4.8,
          reviews: 567,
          phone: "+971547219791",
          gradient: "from-orange-500 to-red-500",
          bgGradient: "bg-gradient-to-br from-orange-500 to-red-500",
          image: "/curtains_4.jpeg",
        },
        {
          id: 5,
          key: "motorizedBlind",
          icon: "FiCreditCard",
          title: "Motorized Blind",
          description:
            "Handcrafted genuine leather wallets with RFID protection. Features multiple card slots, bill compartment, and coin pocket. Available in black, brown, and tan colors.",
          rating: 4.6,
          reviews: 734,
          phone: "+971547219791",
          gradient: "from-indigo-500 to-purple-500",
          bgGradient: "bg-gradient-to-br from-indigo-500 to-purple-500",
          image: "/curtains_5.jpeg",
        },
        {
          id: 6,
          key: "icuCurtains",
          icon: "FiHeadphones",
          title: "Icu Curtains",
          description:
            "True wireless earbuds with immersive sound, active noise cancellation, and long battery life. Includes charging case with wireless charging support. Sweat-resistant for workouts.",
          rating: 4.7,
          reviews: 1876,
          phone: "+971547219791",
          gradient: "from-teal-500 to-blue-500",
          bgGradient: "bg-gradient-to-br from-teal-500 to-blue-500",
          image: "/curtains_6.jpeg",
        },
        {
          id: 7,
          key: "cubicleCurtains",
          icon: "FiBox",
          title: "Cubicle Curtains",
          description:
            "Control all your smart home devices from one central hub. Compatible with major brands including Amazon Alexa, Google Home, and Apple HomeKit. Features voice control and automation.",
          rating: 4.5,
          reviews: 432,
          phone: "+971547219791",
          gradient: "from-amber-500 to-orange-500",
          bgGradient: "bg-gradient-to-br from-amber-500 to-orange-500",
          image: "/curtains_7.jpeg",
        },
        {
          id: 8,
          key: "romanBlind",
          icon: "FiUsers",
          title: "Roman Blind",
          description:
            "Eco-friendly non-slip yoga mat with carrying strap. Made from natural rubber with microfiber top layer. Perfect for hot yoga, with excellent grip and cushioning.",
          rating: 4.9,
          reviews: 3245,
          phone: "+971547219791",
          gradient: "from-rose-500 to-pink-500",
          bgGradient: "bg-gradient-to-br from-rose-500 to-pink-500",
          image: "/curtains_8.jpeg",
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

const Feature = () => {
  const { lang } = useLanguage();

  const [data, setData] = useState(DEFAULT_DATA);
  const [tempData, setTempData] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const fileInputRefs = useRef({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const ENDPOINT = `${apiUrl}/home/industry/`;

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAdmin(!!authToken);
  }, []);

  useEffect(() => {
    const fetchFeatureData = async () => {
      try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
          throw new Error("Failed to fetch feature data");
        }

        const jsonData = await response.json();
        const normalizedData = normalizeData(jsonData);

        setData(normalizedData);
        setTempData(normalizedData);
      } catch (error) {
        console.error("Error fetching feature data:", error);
        setData(DEFAULT_DATA);
        setTempData(DEFAULT_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatureData();
  }, [ENDPOINT]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProduct || fullScreenImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct, fullScreenImage]);

  const activeData = editMode ? tempData : data;

  const copy =
    activeData?.translations?.[lang] ||
    activeData?.translations?.EN ||
    DEFAULT_DATA.translations.EN;

  const products = copy?.products || DEFAULT_DATA.translations.EN.products;
  const whatsappNumber = activeData?.whatsappNumber || "971547219791";

  const ensureCurrentLanguageExists = (newData) => {
    if (!newData.translations) {
      newData.translations = {};
    }

    if (!newData.translations[lang]) {
      newData.translations[lang] =
        cloneData(newData.translations.EN) ||
        cloneData(DEFAULT_DATA.translations.EN);
    }

    if (!Array.isArray(newData.translations[lang].products)) {
      newData.translations[lang].products = [];
    }

    return newData;
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      copy.whatsappMessage || "Hello, I would like to book an appointment."
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
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

  const handleProductChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (field === "rating" || field === "reviews") {
        newData.translations[lang].products[index][field] = Number(value);
      } else {
        newData.translations[lang].products[index][field] = value;
      }

      return newData;
    });
  };

  const addNewProduct = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      newData.translations[lang].products.push({
        id: Date.now(),
        key: `newProduct${Date.now()}`,
        icon: "FiShoppingCart",
        title: "New Product",
        description: "Product description goes here.",
        rating: 4.7,
        reviews: 100,
        phone: "+971547219791",
        gradient: "from-purple-500 to-pink-500",
        bgGradient: "bg-gradient-to-br from-purple-500 to-pink-500",
        image: "/curtains_1.jpeg",
      });

      return newData;
    });
  };

  const removeProduct = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].products.length <= 1) {
        alert("You must keep at least one product.");
        return prev;
      }

      newData.translations[lang].products = newData.translations[
        lang
      ].products.filter((_, i) => i !== index);

      return newData;
    });
  };

  const handleImageUpload = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authentication required for image upload.");
      return;
    }

    setUploadingImages((prev) => ({ ...prev, [index]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "industry-images");

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
      handleProductChange(index, "image", result.image);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed.");
    } finally {
      setUploadingImages((prev) => ({ ...prev, [index]: false }));

      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index].value = "";
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
        throw new Error("Failed to save feature data");
      }

      const updatedData = await response.json();
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);

      alert("Featured products updated successfully!");
    } catch (error) {
      console.error("Error saving feature data:", error);
      alert("Failed to save featured products.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderRatingStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FiStar
          key={i}
          className={`w-3 h-3 sm:w-4 sm:h-4 ${
            i < Math.floor(Number(rating || 0))
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ));
  };

  const truncateDescription = (description, maxLength = 80) => {
    if (!description) return "";
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  const handleProductClick = (product, e) => {
    e.stopPropagation();
    if (editMode) return;
    setSelectedProduct(product);
  };

  const handleImageClickInModal = (image, e) => {
    e.stopPropagation();
    setFullScreenImage(image);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  if (isLoading) {
    return (
      <section id="features" className="py-16 lg:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="features" className="py-16 lg:py-20 relative">
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
            ) : (
              <button
                onClick={toggleEditMode}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
                title="Edit Content"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          {editMode && (
            <div className="mb-6 text-center">
              <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow">
                EDIT MODE ENABLED - Editing {lang}
              </span>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-16"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            ></motion.div>

            {editMode ? (
              <input
                type="text"
                value={copy.heading || ""}
                onChange={(e) => handleTextChange("heading", e.target.value)}
                className="w-full max-w-3xl mx-auto text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-white/80 border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-[#07619b] outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            ) : (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#07619b] to-[#279ccb] bg-clip-text text-transparent">
                {copy.heading}
              </h2>
            )}

            <div className="w-24 h-[5px] mx-auto mt-4 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]" />
          </motion.div>

          {editMode && (
            <div className="mb-8 max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-md p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={activeData.whatsappNumber || ""}
                  onChange={(e) =>
                    handleRootChange("whatsappNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  WhatsApp Message
                </label>
                <input
                  type="text"
                  value={copy.whatsappMessage || ""}
                  onChange={(e) =>
                    handleTextChange("whatsappMessage", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Reviews Text
                </label>
                <input
                  type="text"
                  value={copy.reviewsText || ""}
                  onChange={(e) =>
                    handleTextChange("reviewsText", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Call Button Text
                </label>
                <input
                  type="text"
                  value={copy.callForMeasurement || ""}
                  onChange={(e) =>
                    handleTextChange("callForMeasurement", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-700 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          )}

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {products.map((feature, index) => {
              const Icon = iconMap[feature.icon] || FiShoppingCart;

              return (
                <motion.div
                  key={`${feature.key}-${index}`}
                  variants={item}
                  className="relative h-64 sm:h-72 lg:h-88 perspective-1000 group"
                >
                  {editMode && (
                    <button
                      onClick={() => removeProduct(index)}
                      className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 z-30 shadow-lg"
                      title="Remove Product"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* 3D Rotating Card for All Devices */}
                  <div className="relative w-full h-full preserve-3d transition-transform duration-1000 ease-in-out group-hover:rotate-y-180">
                    {/* Front of Card - Background Image Only */}
                    <div className="absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                      {uploadingImages[index] ? (
                        <div className="h-full w-full bg-black/40 flex items-center justify-center">
                          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37]"></div>
                        </div>
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            backgroundImage: `url(${feature.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        />
                      )}
                    </div>

                    {/* Back of Card - Product Details */}
                    <div
                      className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer"
                      onClick={(e) => handleProductClick(feature, e)}
                    >
                      <div className="h-full p-3 sm:p-5 border border-gray-100 flex flex-col overflow-y-auto transition-transform duration-300 hover:scale-105">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${feature.bgGradient} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 text-white shadow-lg mx-auto`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        {editMode ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="w-full text-xs sm:text-lg font-bold text-gray-900 text-center border border-gray-200 rounded px-2 py-1"
                            />

                            <textarea
                              value={feature.description}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows="2"
                              className="w-full text-gray-600 text-[10px] sm:text-xs leading-relaxed text-center border border-gray-200 rounded px-2 py-1 resize-none"
                            />

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                step="0.1"
                                value={feature.rating}
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "rating",
                                    e.target.value
                                  )
                                }
                                className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                                placeholder="Rating"
                              />

                              <input
                                type="number"
                                value={feature.reviews}
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "reviews",
                                    e.target.value
                                  )
                                }
                                className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                                placeholder="Reviews"
                              />
                            </div>

                            <input
                              type="text"
                              value={feature.phone}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                              className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                              placeholder="Phone"
                            />

                            <select
                              value={feature.icon}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "icon",
                                  e.target.value
                                )
                              }
                              className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                            >
                              <option value="FiShoppingCart">
                                FiShoppingCart
                              </option>
                              <option value="FiLayers">FiLayers</option>
                              <option value="FiGlobe">FiGlobe</option>
                              <option value="FiTrendingUp">
                                FiTrendingUp
                              </option>
                              <option value="FiCreditCard">
                                FiCreditCard
                              </option>
                              <option value="FiHeadphones">
                                FiHeadphones
                              </option>
                              <option value="FiBox">FiBox</option>
                              <option value="FiUsers">FiUsers</option>
                            </select>

                            <input
                              type="text"
                              value={feature.image}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "image",
                                  e.target.value
                                )
                              }
                              className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                              placeholder="Image URL"
                            />

                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => {
                                fileInputRefs.current[index] = el;
                              }}
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, index)}
                            />

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRefs.current[index]?.click();
                              }}
                              disabled={uploadingImages[index]}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs rounded px-2 py-2 flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                              <FiUpload />
                              {uploadingImages[index]
                                ? "Uploading..."
                                : "Upload Image"}
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Product Title */}
                            <h3 className="text-xs sm:text-lg font-bold text-gray-900 text-center mb-1 sm:mb-2">
                              {feature.title}
                            </h3>

                            {/* Product Description - Truncated */}
                            <p className="text-gray-600 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-3 text-center flex-grow">
                              {truncateDescription(feature.description)}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center justify-center mb-1 sm:mb-2">
                              <div className="flex mr-1">
                                {renderRatingStars(feature.rating)}
                              </div>
                              <span className="text-[10px] sm:text-xs text-gray-600">
                                ({feature.reviews} {copy.reviewsText})
                              </span>
                            </div>

                            {/* Phone Number */}
                            <div className="flex items-center justify-center text-[#07619b] mt-auto pt-1 sm:pt-2 border-t border-gray-100">
                              <FiPhone className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                              <span className="text-[8px] sm:text-xs font-medium">
                                {feature.phone}
                              </span>
                            </div>

                            {/* Click Hint */}
                            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
                              <span className="text-[6px] sm:text-[8px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                                {copy.clickForDetails}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {editMode && (
              <button
                onClick={addNewProduct}
                className="h-64 sm:h-72 lg:h-88 rounded-xl sm:rounded-2xl border-2 border-dashed border-[#D4AF37]/50 bg-white/70 flex flex-col items-center justify-center gap-2 text-[#07619b] hover:bg-white transition"
              >
                <FiPlus className="w-8 h-8" />
                <span className="font-semibold">Add Product</span>
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm"
            onClick={closeProductModal}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-white/20 hover:bg-white/30 rounded-full p-2 sm:p-3 text-white transition-all duration-300 backdrop-blur-sm"
              onClick={closeProductModal}
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", damping: 25 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* Image Section - Clickable for Full Screen */}
                <div
                  className="relative h-64 md:h-auto cursor-pointer group"
                  onClick={(e) =>
                    handleImageClickInModal(selectedProduct.image, e)
                  }
                >
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <FiMaximize2 className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    {copy.clickImageForFullScreen}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 sm:p-8 overflow-y-auto">
                  <div
                    className={`w-12 h-12 ${selectedProduct.bgGradient} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg`}
                  >
                    {(() => {
                      const SelectedIcon =
                        iconMap[selectedProduct.icon] || FiShoppingCart;
                      return <SelectedIcon className="w-6 h-6" />;
                    })()}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {selectedProduct.title}
                  </h2>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderRatingStars(selectedProduct.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {selectedProduct.rating} ({selectedProduct.reviews}{" "}
                      {copy.reviewsText})
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-[#07619b] mb-4">
                    {selectedProduct.price}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <FiPhone className="w-5 h-5 mr-3 text-[#07619b]" />
                      <span className="text-sm sm:text-base">
                        {selectedProduct.phone}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={openWhatsApp}
                    className="w-full bg-gradient-to-r from-[#07619b] to-[#279ccb] text-white py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    {copy.callForMeasurement}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
            onClick={closeFullScreenImage}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 sm:p-3 text-white transition-all duration-300 backdrop-blur-sm"
              onClick={closeFullScreenImage}
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", damping: 25 }}
              className="w-screen h-screen flex items-center justify-center p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fullScreenImage}
                alt={copy.productFullScreen}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                style={{
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </motion.div>

            {/* Image Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-center text-white/80 text-xs sm:text-sm bg-black/50 backdrop-blur-sm rounded-lg py-2 px-4"
            >
              {copy.clickAnywhereOutside}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .group:hover .preserve-3d {
          transform: rotateY(180deg);
        }
        .h-88 {
          height: 22rem;
        }

        /* Mobile touch support */
        @media (max-width: 767px) {
          .group:active .preserve-3d {
            transform: rotateY(180deg);
          }
        }
      `}</style>

      {/* Add custom CSS for smooth rotation */}
      <style jsx global>{`
        .preserve-3d {
          transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Mobile touch support */
        @media (max-width: 767px) {
          .preserve-3d {
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      `}</style>
    </>
  );
};

export default Feature;