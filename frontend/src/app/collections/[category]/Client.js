"use client";

// This component renders the collection listing for a given category.
// It integrates with the LanguageContext to translate all user-facing
// strings at runtime. Data is fetched from /home/cards/.

import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productSlug } from "@/lib/collectionsData";
import { FaChevronRight, FaWhatsapp } from "react-icons/fa";
import useEditableContent from "@/hooks/useEditableContent";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
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
import { useAuth } from "@/contexts/AuthContext";

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
        "Hello, I would like a quotation for this curtain:",
      // Label on the per-product WhatsApp button. This site is a catalogue, not
      // a shop — the button replaces what used to be a price.
      whatsappCta: "WhatsApp",
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

  const apiTranslations = apiData.translations || {};

  // Merge language-by-language rather than replacing each block wholesale.
  // Stored content predates any key added to DEFAULT_DATA later, so a shallow
  // top-level merge would drop new labels (e.g. `whatsappCta`) and render empty
  // buttons. Per-language spread keeps API arrays authoritative — `products`
  // and `categories` still replace the defaults — while letting new string keys
  // fall back. Languages the API knows about but the defaults do not are kept.
  const languages = new Set([
    ...Object.keys(DEFAULT_DATA.translations),
    ...Object.keys(apiTranslations),
  ]);

  const translations = {};
  for (const language of languages) {
    translations[language] = {
      ...(DEFAULT_DATA.translations[language] || DEFAULT_DATA.translations.EN),
      ...(apiTranslations[language] || {}),
    };
  }

  return { ...DEFAULT_DATA, ...apiData, translations };
};

const readJsonOrFallback = async (response, fallback) => {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Busts the server's cached `/home/cards/` fetch (see
 * `lib/collectionsData.js`'s `tags: ["collections-content"]`) right after a
 * save. Without this, a category or product added just now can stay invisible
 * to the next server-rendered navigation for up to the fetch's 5-minute
 * revalidate window — which is what made "add category" look like it
 * randomly failed and then started working again later.
 */
const revalidateCollectionsContent = async () => {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: "collections-content" }),
    });
  } catch (error) {
    console.error("Error revalidating collections content:", error);
  }
};

export default function CollectionsCategoryClient({
  categoryKey,
  categories: fallbackCategories = [],
  products: fallbackProducts = [],
  // Raw /home/cards/ payload fetched on the server. Lets the catalogue render
  // into the server HTML so crawlers see the products, rather than an empty
  // grid that only fills in after hydration.
  initialContent = null,
}) {
  const { lang } = useLanguage();
  const router = useRouter();

  // Every category now uses its own clean path:
  // /collections/home
  // /collections/medical-clinic
  // /collections/category-123
  const requestedCategoryKey = categoryKey;

  const { isAuthenticated: isAdmin } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const fileInputRefs = useRef({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const ENDPOINT = `${apiUrl}/home/cards/`;

  // Seeded from the static product/category lists the server component passes
  // down, so a failed request still renders a populated page.
  const buildFallback = () => {
    const fallbackData = cloneData(DEFAULT_DATA);

    if (fallbackCategories.length > 0) {
      fallbackData.translations.EN.categories = fallbackCategories.map((c) => ({
        key: c.key,
        label: c.key
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      }));
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

    return fallbackData;
  };

  const { data, setData, tempData, setTempData, isLoading } = useEditableContent(
    ENDPOINT,
    { normalize: normalizeData, buildFallback, initialContent }
  );

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

  // Deliberately checked against `data` (the last saved state), never
  // `tempData`. Renaming the currently-open category's key mid-edit makes the
  // *edited* list momentarily not contain the URL's key — that is expected and
  // fine, not an invalid route. Checking the saved data means this guard only
  // fires for a genuinely bad URL (deleted/mistyped category), and never
  // interrupts an in-progress edit and drops you out of edit mode.
  const savedCopy =
    data?.translations?.[lang] ||
    data?.translations?.EN ||
    DEFAULT_DATA.translations.EN;

  const savedCategories = Array.isArray(savedCopy.categories)
    ? savedCopy.categories
    : DEFAULT_DATA.translations.EN.categories;

  // Resolved by POSITION in the saved list, not by matching the live key.
  // Matching by key broke mid-rename: as soon as the key you were typing into
  // no longer equalled the URL's (saved) key, this silently fell back to
  // category 0 — which made that category's products look like they had
  // vanished while you were still typing, even though nothing was lost.
  //
  // The fallback itself must never be a bare `0`. Right after saving a
  // rename, `data` updates to the new key before the URL has caught up (the
  // navigation below is still in flight), so this lookup briefly finds
  // nothing — and defaulting to 0 flashed (or on a slow redirect, held
  // steady on) category 0's ("home") products instead of the renamed
  // category's. Remembering the last position that DID match and reusing it
  // keeps this pointed at the right category through that gap.
  const lastKnownCategoryIndexRef = useRef(0);

  const activeCategoryIndex = useMemo(() => {
    const index = savedCategories.findIndex(
      (c) => c.key === requestedCategoryKey
    );
    if (index >= 0) {
      lastKnownCategoryIndexRef.current = index;
      return index;
    }
    return lastKnownCategoryIndexRef.current;
  }, [savedCategories, requestedCategoryKey]);

  const activeCategory = useMemo(() => {
    return (
      activeCategories[activeCategoryIndex] ||
      activeCategories[0] ||
      DEFAULT_DATA.translations.EN.categories[0]
    );
  }, [activeCategories, activeCategoryIndex]);

  const validCategory = useMemo(() => {
    return savedCategories.some((c) => c.key === requestedCategoryKey);
  }, [savedCategories, requestedCategoryKey]);

  // The single place that ever redirects for an invalid URL. Previously
  // `saveChanges` also issued its own `router.replace` to follow a rename,
  // which raced this effect: both fired in the same tick (this one sees the
  // URL is stale the instant `data` updates, before the other redirect's
  // navigation has actually landed), and whichever completed last silently
  // won — sometimes leaving you on /collections/home instead of the renamed
  // category. Doing it only here, and following the category by its
  // preserved position rather than defaulting straight to home, removes that
  // race: a genuinely deleted/mistyped category still falls through to
  // savedCategories[0], but a renamed one is followed to its real new URL.
  useEffect(() => {
    if (editMode) return;
    if (isLoading || savedCategories.length === 0 || validCategory) return;

    const fallbackCategory =
      savedCategories[activeCategoryIndex] || savedCategories[0];

    router.replace(`/collections/${encodeURIComponent(fallbackCategory.key)}`);
  }, [
    isLoading,
    validCategory,
    savedCategories,
    activeCategoryIndex,
    editMode,
    router,
  ]);

  const goToCategory = (nextCategoryKey) => {
    router.push(`/collections/${encodeURIComponent(nextCategoryKey)}`);
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

      const categories = newData.translations[lang].categories;
      const oldKey = categories[index]?.key;

      // Products are reassigned by matching this string against `oldKey` —
      // safe only when `oldKey` belongs to exactly one category. If another
      // category currently shares it (leftover duplicate data, or the key
      // you're mid-typing has transiently collided with an unrelated
      // category's key), that match can't tell the two apart and would
      // silently steal the OTHER category's products. Skip the remap in that
      // case — nothing moves for either category until this key is unique
      // again, which is one keystroke away as you keep typing past the
      // collision, rather than mixing their products together.
      const oldKeyIsUnique =
        field === "key" &&
        oldKey !== undefined &&
        categories.filter((c) => c.key === oldKey).length === 1;

      categories[index][field] = value;

      if (field === "key" && oldKey && oldKeyIsUnique) {
        newData.translations[lang].products = newData.translations[
          lang
        ].products.map((product) =>
          product.category === oldKey ? { ...product, category: value } : product
        );
      }

      return newData;
    });
  };

  const addCategory = async () => {
    if (!isAdmin) {
      alert("Admin access required. Please log in.");
      return;
    }

    const newKey = `category-${Date.now()}`;

    const newData = cloneData(tempData);
    ensureCurrentLanguageExists(newData);
    newData.translations[lang].categories.push({
      key: newKey,
      label: "New Category",
    });

    // The category route this is about to navigate to fetches its own data
    // from the server, so an in-memory-only update would not be there yet —
    // the redirect-on-invalid-category effect would immediately bounce back
    // to /collections/home. Persist first, then navigate once it is real.
    setIsSaving(true);

    try {
      const response = await fetch(ENDPOINT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error("Failed to save new category");
      }

      const updatedData = await readJsonOrFallback(response, newData);
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      await revalidateCollectionsContent();

      // Open the newly created category on its own clean URL so products
      // can be added directly under it while edit mode remains enabled.
      router.push(`/collections/${encodeURIComponent(newKey)}`);
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    } finally {
      setIsSaving(false);
    }
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

        if (field === "rating" || field === "reviews") {
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

    if (!isAdmin) {
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
        body: formData,
        credentials: "include",
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

    // A duplicate key makes product reassignment ambiguous for as long as it
    // exists (see handleCategoryChange), so it must never actually be saved —
    // catch it here rather than let two categories silently share products.
    const keyCounts = {};
    for (const cat of tempData.translations[lang]?.categories || []) {
      keyCounts[cat.key] = (keyCounts[cat.key] || 0) + 1;
    }
    const duplicateKey = Object.keys(keyCounts).find((key) => keyCounts[key] > 1);

    if (duplicateKey) {
      alert(
        `Two categories both use the key "${duplicateKey}". Give each category a unique key before saving.`
      );
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
        throw new Error("Failed to save collections cards data");
      }

      const updatedData = await readJsonOrFallback(response, tempData);
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);
      await revalidateCollectionsContent();

      // If the category being viewed was renamed, its URL (still the old key)
      // is now stale. The invalid-category effect above follows it to the new
      // URL automatically once `editMode` flips to false — no separate
      // redirect needed here (a second one racing that effect is what used to
      // intermittently strand this on /collections/home instead).

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
      <section
        className="bg-[#f3f0eb] min-h-screen pb-10 relative"
        style={{ paddingTop: "var(--navbar-h)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 bg-black bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url(/curtains-hero.png)", height: "var(--navbar-h)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/80" />
        </div>

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
      <section
        className="bg-[#f3f0eb] min-h-screen pb-10 relative"
        style={{ paddingTop: "var(--navbar-h)" }}
      >
        {/* Matches the dark backdrop behind the navbar on the home page hero,
            so the fixed nav reads the same way across routes. Sized from the
            navbar's own measured height (see Navbar.js) so it lines up with
            zero gap regardless of viewport width or nav content wrapping. */}
        <div
          className="absolute top-0 left-0 right-0 bg-black bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url(/curtains-hero.png)", height: "var(--navbar-h)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 mt-6 md:mt-8">
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
                            key={index}
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

                            <button
                              type="button"
                              onClick={() => goToCategory(cat.key)}
                              className={`w-full mt-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                                isActive
                                  ? "bg-[#8f744e] text-white"
                                  : "bg-white text-[#8f744e] border border-[#8f744e]/30 hover:bg-[#eee8df]"
                              }`}
                            >
                              {isActive ? "Managing Products" : "Manage Products"}
                            </button>
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
                        disabled={isSaving}
                        className="w-full rounded-xl border-2 border-dashed border-[#8f744e]/40 text-[#8f744e] py-3 flex items-center justify-center gap-2 hover:bg-[#f3f0eb] transition disabled:opacity-50"
                      >
                        <FiPlus />
                        {isSaving ? "Adding..." : "Add Category"}
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
                                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
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

                                <div className="grid grid-cols-2 gap-2">
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
                                {/* A real crawlable link to the product's own
                                    page. The card's click-to-open-modal stays
                                    for quick browsing, but without this anchor
                                    the product routes would be orphans
                                    reachable only via the sitemap. */}
                                <h3 className="font-semibold text-[#2d3142] group-hover:text-[#8f744e] truncate">
                                  <Link
                                    href={`/collections/${activeCategory.key}/${productSlug(
                                      p
                                    )}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {p.name}
                                  </Link>
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

                                <div className="mt-3">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      // The card itself opens the detail modal;
                                      // this button must not trigger that too.
                                      e.stopPropagation();
                                      handleWhatsAppClick(p.name);
                                    }}
                                    aria-label={`${copy.whatsappCta} — ${p.name}`}
                                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-white font-semibold bg-[#25D366] hover:bg-[#1ebe5b] transition"
                                  >
                                    <FaWhatsapp className="w-5 h-5" />
                                    <span>{copy.whatsappCta}</span>
                                  </button>
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
                sizes="(max-width: 640px) 100vw, 512px"
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

              <button
                onClick={() => handleWhatsAppClick(selectedProduct.name)}
                aria-label={`${copy.whatsappCta} — ${selectedProduct.name}`}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white font-semibold bg-[#25D366] hover:bg-[#1ebe5b] transition"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{copy.whatsappCta}</span>
              </button>

              <Link
                href={`/collections/${activeCategory.key}/${productSlug(
                  selectedProduct
                )}`}
                className="mt-3 block text-center text-sm font-medium text-[#8f744e] hover:underline"
              >
                View full details
              </Link>
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
              sizes="(max-width: 896px) 100vw, 896px"
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

      <FloatingWhatsApp />
    </>
  );
}