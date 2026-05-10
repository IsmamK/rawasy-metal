"use client";

// This component renders the collection listing for a given category.
// It integrates with the LanguageContext to translate all user-facing
// strings at runtime. Data is fetched from /home/cards/.

import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import {
  FiStar,
  FiX,
  FiMaximize2,
  FiEdit2,
  FiSave,
  FiPlus,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

const DEFAULT_DATA = {
  whatsappNumber: "971547219791",
  translations: {
    EN: {
      heading: "Collections",
      categoryTitle: "Categories",
      showing: "Showing",
      productsText: "products",
      needHelp: "Need Help?",
      noProducts: "No products found in this category.",
      productDescriptionFallback:
        "High-quality curtain perfect for your space. Made with premium materials and expert craftsmanship.",
      whatsappDefaultMessage:
        "Hello, I would like to know more about your curtain collections.",
      whatsappProductMessagePrefix:
        "Hello, I need help choosing this product:",
      categories: [
        { key: "home", label: "Home" },
        { key: "office", label: "Office" },
        { key: "medical-clinic", label: "Medical Clinic" },
        { key: "accessories", label: "Accessories" },
      ],
      products: [
        {
          id: 1,
          key: "luxuryVelvetCurtain1",
          name: "Luxury Velvet Curtain",
          price: 4500,
          image: "/curtain_home.png",
          category: "home",
          description:
            "A premium velvet curtain designed to add warmth, softness, and luxury to your home interior.",
          rating: 4.8,
          reviews: 245,
        },
        {
          id: 2,
          key: "minimalSheerCurtain1",
          name: "Minimal Sheer Curtain",
          price: 1800,
          image: "/curtain_home.png",
          category: "home",
          description:
            "A light and elegant sheer curtain that allows natural light while maintaining privacy.",
          rating: 4.6,
          reviews: 186,
        },
        {
          id: 9,
          key: "luxuryVelvetCurtain2",
          name: "Luxury Velvet Curtain",
          price: 4500,
          image: "/curtain_home.png",
          category: "home",
          description:
            "Elegant velvet curtain with a rich texture, perfect for living rooms and bedrooms.",
          rating: 4.8,
          reviews: 245,
        },
        {
          id: 10,
          key: "minimalSheerCurtain2",
          name: "Minimal Sheer Curtain",
          price: 1800,
          image: "/curtain_home.png",
          category: "home",
          description:
            "Soft sheer curtain crafted for a clean, modern, and airy home atmosphere.",
          rating: 4.6,
          reviews: 186,
        },
        {
          id: 11,
          key: "luxuryVelvetCurtain3",
          name: "Luxury Velvet Curtain",
          price: 4500,
          image: "/curtain_home.png",
          category: "home",
          description:
            "Premium velvet curtain that gives your room a refined and luxurious finish.",
          rating: 4.8,
          reviews: 245,
        },
        {
          id: 12,
          key: "minimalSheerCurtain3",
          name: "Minimal Sheer Curtain",
          price: 1800,
          image: "/curtain_home.png",
          category: "home",
          description:
            "Minimal sheer curtain for soft daylight, privacy, and a peaceful interior look.",
          rating: 4.6,
          reviews: 186,
        },
        {
          id: 3,
          key: "premiumOfficeBlind",
          name: "Premium Office Blind",
          price: 3200,
          image: "/curtain_office.png",
          category: "office",
          description:
            "A professional office blind designed for light control, privacy, and a modern workspace.",
          rating: 4.7,
          reviews: 318,
        },
        {
          id: 4,
          key: "executiveOfficeCurtain",
          name: "Executive Office Curtain",
          price: 5200,
          image: "/curtain_office.png",
          category: "office",
          description:
            "A refined office curtain solution for executive spaces, meeting rooms, and premium interiors.",
          rating: 4.9,
          reviews: 421,
        },
        {
          id: 5,
          key: "hospitalPrivacyCurtain",
          name: "Hospital Privacy Curtain",
          price: 2600,
          image: "/curtain_medical.png",
          category: "medical-clinic",
          description:
            "Durable privacy curtain suitable for hospitals, clinics, treatment rooms, and patient areas.",
          rating: 4.6,
          reviews: 276,
        },
        {
          id: 6,
          key: "clinicDividerCurtain",
          name: "Clinic Divider Curtain",
          price: 2100,
          image: "/curtain_medical.png",
          category: "medical-clinic",
          description:
            "Practical divider curtain for clinics and healthcare spaces requiring privacy and flexibility.",
          rating: 4.5,
          reviews: 198,
        },
        {
          id: 7,
          key: "industrialHeatResistantCurtain",
          name: "Industrial Heat Resistant Curtain",
          price: 7900,
          image: "/curtain_industry.png",
          category: "accessories",
          description:
            "A strong industrial curtain designed for heat resistance, durability, and workspace separation.",
          rating: 4.7,
          reviews: 352,
        },
        {
          id: 8,
          key: "warehousePartitionCurtain",
          name: "Warehouse Partition Curtain",
          price: 6400,
          image: "/curtain_industry.png",
          category: "accessories",
          description:
            "Heavy-duty warehouse partition curtain for organizing large spaces and improving workflow.",
          rating: 4.6,
          reviews: 287,
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

const formatPrice = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

const readJsonOrFallback = async (response, fallback) => {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
};

export default function CollectionsCategoryClient({
  categoryKey,
  categories: fallbackCategories = [],
  products: fallbackProducts = [],
}) {
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryCategoryKey = searchParams.get("category");
  const requestedCategoryKey = queryCategoryKey || categoryKey;

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
  const ENDPOINT = `${apiUrl}/home/cards/`;

  const staticRouteKeys = useMemo(() => {
    const keys = fallbackCategories.map((c) => c.key);

    if (keys.length === 0) {
      return ["home", "office", "medical-clinic", "accessories"];
    }

    return keys;
  }, [fallbackCategories]);

  const baseStaticRouteKey = staticRouteKeys.includes(categoryKey)
    ? categoryKey
    : "home";

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAdmin(!!authToken);
  }, []);

  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
          throw new Error("Failed to fetch collections cards data");
        }

        const jsonData = await response.json();
        const normalizedData = normalizeData(jsonData);

        setData(normalizedData);
        setTempData(normalizedData);
      } catch (error) {
        console.error("Error fetching collections cards data:", error);

        const fallbackData = cloneData(DEFAULT_DATA);

        if (fallbackCategories.length > 0) {
          fallbackData.translations.EN.categories = fallbackCategories.map(
            (c) => ({
              key: c.key,
              label: c.key
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
            })
          );
        }

        if (fallbackProducts.length > 0) {
          fallbackData.translations.EN.products = fallbackProducts.map((p) => ({
            ...p,
            key: `product${p.id}`,
            description: DEFAULT_DATA.translations.EN.productDescriptionFallback,
            rating: 4.7,
            reviews: 250,
          }));
        }

        setData(fallbackData);
        setTempData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardsData();
  }, [ENDPOINT, fallbackCategories, fallbackProducts]);

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

  const activeCategories = Array.isArray(copy.categories)
    ? copy.categories
    : DEFAULT_DATA.translations.EN.categories;

  const allProducts = Array.isArray(copy.products)
    ? copy.products
    : DEFAULT_DATA.translations.EN.products;

  const activeCategory = useMemo(() => {
    return (
      activeCategories.find((c) => c.key === requestedCategoryKey) ||
      activeCategories[0] ||
      DEFAULT_DATA.translations.EN.categories[0]
    );
  }, [activeCategories, requestedCategoryKey]);

  const validCategory = useMemo(() => {
    return activeCategories.some((c) => c.key === requestedCategoryKey);
  }, [activeCategories, requestedCategoryKey]);

  useEffect(() => {
    if (!isLoading && activeCategories.length > 0 && !validCategory) {
      router.replace(`/collections/${baseStaticRouteKey}`);
    }
  }, [
    isLoading,
    validCategory,
    activeCategories,
    router,
    baseStaticRouteKey,
  ]);

  const goToCategory = (nextCategoryKey) => {
    if (staticRouteKeys.includes(nextCategoryKey)) {
      router.push(`/collections/${nextCategoryKey}`);
      return;
    }

    router.push(
      `/collections/${baseStaticRouteKey}?category=${encodeURIComponent(
        nextCategoryKey
      )}`
    );
  };

  const categoryProducts = useMemo(() => {
    return allProducts.filter((p) => p.category === activeCategory.key);
  }, [allProducts, activeCategory.key]);

  const enhancedProducts = useMemo(() => {
    return categoryProducts.map((product) => ({
      ...product,
      description: product.description || copy.productDescriptionFallback,
      rating: product.rating ?? 4.7,
      reviews: product.reviews ?? 250,
      phone: product.phone || `+${activeData.whatsappNumber || "971547219791"}`,
      bgGradient: "bg-gradient-to-br from-[#8f744e] to-[#b4a389]",
      price: product.price,
    }));
  }, [
    categoryProducts,
    copy.productDescriptionFallback,
    activeData.whatsappNumber,
  ]);

  const ensureCurrentLanguageExists = (newData) => {
    if (!newData.translations) {
      newData.translations = {};
    }

    if (!newData.translations[lang]) {
      newData.translations[lang] =
        cloneData(newData.translations.EN) ||
        cloneData(DEFAULT_DATA.translations.EN);
    }

    if (!Array.isArray(newData.translations[lang].categories)) {
      newData.translations[lang].categories = [];
    }

    if (!Array.isArray(newData.translations[lang].products)) {
      newData.translations[lang].products = [];
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

  const handleCategoryChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      const oldKey = newData.translations[lang].categories[index]?.key;

      newData.translations[lang].categories[index][field] = value;

      if (field === "key" && oldKey) {
        newData.translations[lang].products = newData.translations[
          lang
        ].products.map((product) =>
          product.category === oldKey ? { ...product, category: value } : product
        );
      }

      return newData;
    });
  };

  const addCategory = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      const newKey = `category-${Date.now()}`;

      newData.translations[lang].categories.push({
        key: newKey,
        label: "New Category",
      });

      return newData;
    });
  };

  const removeCategory = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].categories.length <= 1) {
        alert("You must keep at least one category.");
        return prev;
      }

      const removedKey = newData.translations[lang].categories[index]?.key;

      newData.translations[lang].categories = newData.translations[
        lang
      ].categories.filter((_, i) => i !== index);

      newData.translations[lang].products = newData.translations[
        lang
      ].products.filter((product) => product.category !== removedKey);

      return newData;
    });
  };

  const handleProductChange = (productKey, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      newData.translations[lang].products = newData.translations[
        lang
      ].products.map((product) => {
        if (String(product.key || product.id) !== String(productKey)) {
          return product;
        }

        if (field === "price" || field === "rating" || field === "reviews") {
          return {
            ...product,
            [field]: Number(value),
          };
        }

        return {
          ...product,
          [field]: value,
        };
      });

      return newData;
    });
  };

  const addProduct = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      const newId = Date.now();

      newData.translations[lang].products.push({
        id: newId,
        key: `product-${newId}`,
        name: "New Product",
        price: 2500,
        image: "/curtain_home.png",
        category: activeCategory.key,
        description: "Product description goes here.",
        rating: 4.7,
        reviews: 100,
      });

      return newData;
    });
  };

  const removeProduct = (productKey) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].products.length <= 1) {
        alert("You must keep at least one product.");
        return prev;
      }

      newData.translations[lang].products = newData.translations[
        lang
      ].products.filter(
        (product) => String(product.key || product.id) !== String(productKey)
      );

      return newData;
    });
  };

  const handleImageUpload = async (event, productKey) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authentication required for image upload.");
      return;
    }

    setUploadingImages((prev) => ({ ...prev, [productKey]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "collection-card-images");

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
      handleProductChange(productKey, "image", result.image);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed.");
    } finally {
      setUploadingImages((prev) => ({ ...prev, [productKey]: false }));

      if (fileInputRefs.current[productKey]) {
        fileInputRefs.current[productKey].value = "";
      }
    }
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
        throw new Error("Failed to save collections cards data");
      }

      const updatedData = await readJsonOrFallback(response, tempData);
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);

      alert("Collections cards updated successfully!");
    } catch (error) {
      console.error("Error saving collections cards data:", error);
      alert("Failed to save collections cards data.");
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

  const handleWhatsAppClick = (productName = null) => {
    let message = copy.whatsappDefaultMessage;

    if (productName) {
      message = `${copy.whatsappProductMessagePrefix} ${productName}`;
    }

    const whatsappURL = `https://wa.me/${
      activeData.whatsappNumber || "971547219791"
    }?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
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

  const productCountMessage = `${copy.showing} ${categoryProducts.length} ${copy.productsText}`;

  if (isLoading) {
    return (
      <section className="bg-[#f3f0eb] min-h-screen pt-24 md:pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex justify-center items-center py-28">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8f744e]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[#f3f0eb] min-h-screen pt-24 md:pt-28 pb-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          {editMode && (
            <div className="mb-4 md:mb-5 text-center">
              <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow">
                EDIT MODE ENABLED - Editing {lang}
              </span>
            </div>
          )}

          {/* Header */}
          <div className="mb-4 md:mb-8 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {editMode ? (
                <div className="space-y-4 max-w-3xl">
                  <input
                    type="text"
                    value={copy.heading || ""}
                    onChange={(e) =>
                      handleTextChange("heading", e.target.value)
                    }
                    className="w-full text-3xl md:text-4xl font-bold text-[#8f744e] bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e]"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={activeData.whatsappNumber || ""}
                      onChange={(e) =>
                        handleRootChange("whatsappNumber", e.target.value)
                      }
                      placeholder="WhatsApp Number"
                      className="w-full text-sm bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e]"
                    />

                    <input
                      type="text"
                      value={copy.categoryTitle || ""}
                      onChange={(e) =>
                        handleTextChange("categoryTitle", e.target.value)
                      }
                      placeholder="Category Title"
                      className="w-full text-sm bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e]"
                    />

                    <input
                      type="text"
                      value={copy.showing || ""}
                      onChange={(e) =>
                        handleTextChange("showing", e.target.value)
                      }
                      placeholder="Showing Text"
                      className="w-full text-sm bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e]"
                    />

                    <input
                      type="text"
                      value={copy.productsText || ""}
                      onChange={(e) =>
                        handleTextChange("productsText", e.target.value)
                      }
                      placeholder="Products Text"
                      className="w-full text-sm bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e]"
                    />

                    <input
                      type="text"
                      value={copy.needHelp || ""}
                      onChange={(e) =>
                        handleTextChange("needHelp", e.target.value)
                      }
                      placeholder="Need Help Button Text"
                      className="w-full text-sm bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e]"
                    />

                    <input
                      type="text"
                      value={copy.noProducts || ""}
                      onChange={(e) =>
                        handleTextChange("noProducts", e.target.value)
                      }
                      placeholder="No Products Text"
                      className="w-full text-sm bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e]"
                    />
                  </div>

                  <textarea
                    value={copy.whatsappDefaultMessage || ""}
                    onChange={(e) =>
                      handleTextChange(
                        "whatsappDefaultMessage",
                        e.target.value
                      )
                    }
                    rows="2"
                    placeholder="Default WhatsApp Message"
                    className="w-full text-sm bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e] resize-none"
                  />

                  <textarea
                    value={copy.whatsappProductMessagePrefix || ""}
                    onChange={(e) =>
                      handleTextChange(
                        "whatsappProductMessagePrefix",
                        e.target.value
                      )
                    }
                    rows="2"
                    placeholder="Product WhatsApp Message Prefix"
                    className="w-full text-sm bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e] resize-none"
                  />
                </div>
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold text-[#8f744e]">
                  {copy.heading}
                </h1>
              )}
            </div>

            {isAdmin && (
              <div className="flex-shrink-0 pt-1">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4">
                  <h3 className="text-lg font-semibold text-[#8f744e] mb-4">
                    {copy.categoryTitle}
                  </h3>

                  <div className="space-y-2">
                    {activeCategories.map((cat, index) => {
                      const isActive = cat.key === activeCategory.key;

                      if (editMode) {
                        return (
                          <div
                            key={`${cat.key}-${index}`}
                            className="relative bg-[#f3f0eb] rounded-xl p-3 border border-black/5"
                          >
                            <button
                              onClick={() => removeCategory(index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg z-10"
                              title="Remove Category"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>

                            <label className="block text-xs text-[#8f744e] mb-1">
                              Category Key
                            </label>
                            <input
                              type="text"
                              value={cat.key}
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  "key",
                                  e.target.value
                                )
                              }
                              className="w-full mb-2 px-3 py-2 rounded-lg border border-black/10 text-sm outline-none focus:ring-2 focus:ring-[#8f744e]"
                            />

                            <label className="block text-xs text-[#8f744e] mb-1">
                              Category Label
                            </label>
                            <input
                              type="text"
                              value={cat.label}
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  "label",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm outline-none focus:ring-2 focus:ring-[#8f744e]"
                            />
                          </div>
                        );
                      }

                      return (
                        <button
                          key={cat.key}
                          onClick={() => goToCategory(cat.key)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                            isActive
                              ? "bg-[#8f744e] text-white shadow-md"
                              : "bg-[#f3f0eb] text-[#4b3f32] hover:bg-[#e6e0d8]"
                          }`}
                        >
                          <span className="font-medium">{cat.label}</span>
                          <FaChevronRight
                            className={`text-sm ${
                              isActive ? "opacity-100" : "opacity-50"
                            }`}
                          />
                        </button>
                      );
                    })}

                    {editMode && (
                      <button
                        onClick={addCategory}
                        className="w-full rounded-xl border-2 border-dashed border-[#8f744e]/40 text-[#8f744e] py-3 flex items-center justify-center gap-2 hover:bg-[#f3f0eb] transition"
                      >
                        <FiPlus />
                        Add Category
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="lg:col-span-9">
              <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
                <div className="flex items-end justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-[#2d3142]">
                      {activeCategory.label}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {productCountMessage}
                    </p>
                  </div>

                  <button
                    onClick={() => handleWhatsAppClick()}
                    className="px-5 py-2.5 rounded-xl text-white font-semibold hover:opacity-90 transition"
                    style={{
                      background: "linear-gradient(135deg, #8f744e, #b4a389)",
                      boxShadow: "0 10px 30px rgba(143,116,78,0.3)",
                    }}
                  >
                    {copy.needHelp}
                  </button>
                </div>

                {categoryProducts.length === 0 && !editMode ? (
                  <div className="py-14 text-center">
                    <p className="text-gray-600">{copy.noProducts}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {enhancedProducts.map((p) => {
                      const productKey = String(p.key || p.id);
                      const isUploading = uploadingImages[productKey];

                      return (
                        <div
                          key={productKey}
                          className="group rounded-2xl overflow-hidden border border-black/5 bg-[#f3f0eb] hover:shadow-lg transition relative"
                          onClick={(e) => handleProductClick(p, e)}
                        >
                          {editMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeProduct(productKey);
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg z-20"
                              title="Remove Product"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}

                          <div className="relative w-full aspect-[4/3] bg-[#e6e0d8]">
                            {isUploading ? (
                              <div className="w-full h-full flex items-center justify-center bg-black/20">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8f744e]"></div>
                              </div>
                            ) : (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            )}

                            {editMode && (
                              <>
                                <input
                                  ref={(el) => {
                                    fileInputRefs.current[productKey] = el;
                                  }}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageUpload(e, productKey)
                                  }
                                />

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRefs.current[productKey]?.click();
                                  }}
                                  disabled={isUploading}
                                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg disabled:opacity-60"
                                  title="Upload Image"
                                >
                                  <FiUpload className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>

                          <div className="p-4">
                            {editMode ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={p.name}
                                  onChange={(e) =>
                                    handleProductChange(
                                      productKey,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="w-full font-semibold text-[#2d3142] bg-white border border-black/10 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#8f744e]"
                                  placeholder="Product Name"
                                />

                                <textarea
                                  value={p.description}
                                  onChange={(e) =>
                                    handleProductChange(
                                      productKey,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  rows="2"
                                  className="w-full text-sm text-gray-600 bg-white border border-black/10 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#8f744e] resize-none"
                                  placeholder="Product Description"
                                />

                                <input
                                  type="text"
                                  value={p.image}
                                  onChange={(e) =>
                                    handleProductChange(
                                      productKey,
                                      "image",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-xs text-gray-600 bg-white border border-black/10 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#8f744e]"
                                  placeholder="Image URL"
                                />

                                <select
                                  value={p.category}
                                  onChange={(e) =>
                                    handleProductChange(
                                      productKey,
                                      "category",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-xs text-gray-700 bg-white border border-black/10 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#8f744e]"
                                >
                                  {activeCategories.map((category) => (
                                    <option
                                      key={category.key}
                                      value={category.key}
                                    >
                                      {category.label}
                                    </option>
                                  ))}
                                </select>

                                <div className="grid grid-cols-3 gap-2">
                                  <input
                                    type="number"
                                    value={p.price}
                                    onChange={(e) =>
                                      handleProductChange(
                                        productKey,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-xs bg-white border border-black/10 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#8f744e]"
                                    placeholder="Price"
                                  />

                                  <input
                                    type="number"
                                    step="0.1"
                                    value={p.rating}
                                    onChange={(e) =>
                                      handleProductChange(
                                        productKey,
                                        "rating",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-xs bg-white border border-black/10 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#8f744e]"
                                    placeholder="Rating"
                                  />

                                  <input
                                    type="number"
                                    value={p.reviews}
                                    onChange={(e) =>
                                      handleProductChange(
                                        productKey,
                                        "reviews",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-xs bg-white border border-black/10 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#8f744e]"
                                    placeholder="Reviews"
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <h3 className="font-semibold text-[#2d3142] group-hover:text-[#8f744e] truncate">
                                  {p.name}
                                </h3>

                                <div className="flex items-center mt-2 space-x-1">
                                  {renderRatingStars(p.rating)}
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({p.reviews})
                                  </span>
                                </div>

                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                  {p.description}
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                  <span className="text-lg font-bold text-[#8f744e]">
                                    {formatPrice(p.price)}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {editMode && (
                      <button
                        onClick={addProduct}
                        className="min-h-[260px] rounded-2xl border-2 border-dashed border-[#8f744e]/40 bg-[#f3f0eb] text-[#8f744e] flex flex-col items-center justify-center gap-2 hover:bg-[#e6e0d8] transition"
                      >
                        <FiPlus className="w-7 h-7" />
                        <span className="font-semibold">Add Product</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Product detail modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          onClick={closeProductModal}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-60 sm:h-80 bg-[#e6e0d8]">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                unoptimized
                className="object-cover cursor-pointer"
                onClick={(e) =>
                  handleImageClickInModal(selectedProduct.image, e)
                }
              />

              <button
                className="absolute top-3 right-3 text-white bg-black/50 rounded-full p-1"
                onClick={closeProductModal}
              >
                <FiX className="w-5 h-5" />
              </button>

              <button
                className="absolute top-3 right-10 text-white bg-black/50 rounded-full p-1"
                onClick={(e) =>
                  handleImageClickInModal(selectedProduct.image, e)
                }
              >
                <FiMaximize2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-[#2d3142]">
                {selectedProduct.name}
              </h3>

              <div className="flex items-center mb-4">
                {renderRatingStars(selectedProduct.rating)}
                <span className="ml-2 text-sm text-gray-500">
                  ({selectedProduct.reviews})
                </span>
              </div>

              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#8f744e]">
                  {formatPrice(selectedProduct.price)}
                </span>

                <button
                  onClick={() => handleWhatsAppClick(selectedProduct.name)}
                  className="px-4 py-2 rounded-xl text-white font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #8f744e, #b4a389)",
                    boxShadow: "0 10px 30px rgba(143,116,78,0.3)",
                  }}
                >
                  {copy.needHelp}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen image viewer */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={closeFullScreenImage}
        >
          <div className="relative w-full max-w-4xl h-[90vh]">
            <Image
              src={fullScreenImage}
              alt="Product image"
              fill
              unoptimized
              className="object-contain"
            />

            <button
              className="absolute top-3 right-3 text-white bg-black/50 rounded-full p-1"
              onClick={closeFullScreenImage}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}