"use client";

import React, { useState } from "react";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiFileText,
  FiSend,
  FiCheckCircle,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import useEditableContent from "@/hooks/useEditableContent";
import PageBackdrop from "@/components/PageBackdrop";

const COUNTRY_OPTIONS = [
  { code: "AE", name: "United Arab Emirates", dialCode: "971", flag: "🇦🇪" },
  { code: "BD", name: "Bangladesh", dialCode: "880", flag: "🇧🇩" },
  { code: "IN", name: "India", dialCode: "91", flag: "🇮🇳" },
  { code: "SA", name: "Saudi Arabia", dialCode: "966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dialCode: "974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", dialCode: "965", flag: "🇰🇼" },
  { code: "OM", name: "Oman", dialCode: "968", flag: "🇴🇲" },
  { code: "BH", name: "Bahrain", dialCode: "973", flag: "🇧🇭" },
  { code: "US", name: "United States", dialCode: "1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "44", flag: "🇬🇧" },
  { code: "DE", name: "Germany", dialCode: "49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dialCode: "39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dialCode: "34", flag: "🇪🇸" },
  { code: "PK", name: "Pakistan", dialCode: "92", flag: "🇵🇰" },
];

const cleanPhoneInput = (phone) => {
  return String(phone || "").replace(/[^\d]/g, "");
};

const buildPhoneWithCountryCode = (phone, dialCode) => {
  const rawPhone = String(phone || "").trim();
  const digitsOnly = cleanPhoneInput(rawPhone);

  if (!digitsOnly) return "";

  if (rawPhone.startsWith("+")) {
    return digitsOnly;
  }

  if (digitsOnly.startsWith("00")) {
    return digitsOnly.slice(2);
  }

  if (digitsOnly.startsWith(dialCode)) {
    return digitsOnly;
  }

  if (digitsOnly.startsWith("0")) {
    return `${dialCode}${digitsOnly.slice(1)}`;
  }

  return `${dialCode}${digitsOnly}`;
};

const DEFAULT_DATA = {
  whatsappNumber: "971547219791",
  displayPhone: "+971 54 721 9791",
  translations: {
    EN: {
      badge: "Get A Quote",
      title: "Request Your Quotation",
      description:
        "Tell us about your curtain requirements and our team will contact you with the best solution.",
      whatsappMessage: "Hello, I would like to request a curtain quotation.",
      successTitle: "Request Submitted!",
      successMessage:
        "Thank you. Our team will contact you shortly with your quotation details.",
      nameLabel: "Full Name",
      namePlaceholder: "Enter your full name",
      phoneLabel: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email address",
      descriptionLabel: "Project Description",
      descriptionPlaceholder:
        "Tell us about your curtain needs, measurements, preferred style, room type, or any special requirements.",
      submitButton: "Submit Request",
      requiredText:
        "* Required fields. Your information will be kept confidential.",
      immediateAssistance: "Need immediate assistance?",
      cards: [
        {
          title: "Quick Response",
          description: "Our team responds quickly to quotation requests.",
        },
        {
          title: "Free Consultation",
          description: "Get expert advice before choosing your curtains.",
        },
        {
          title: "Custom Solutions",
          description: "Curtain solutions tailored to your space and style.",
        },
      ],
      errors: {
        nameRequired: "Name is required.",
        phoneRequired: "Phone number is required.",
        phoneInvalid: "Please enter a valid phone number.",
        emailRequired: "Email address is required.",
        emailInvalid: "Please enter a valid email address.",
        descriptionRequired: "Project description is required.",
      },
    },
    DE: {
      badge: "Angebot erhalten",
      title: "Fordern Sie Ihr Angebot an",
      description:
        "Teilen Sie uns Ihre Vorhanganforderungen mit und unser Team kontaktiert Sie mit der besten Lösung.",
      whatsappMessage: "Hallo, ich möchte ein Angebot für Vorhänge anfordern.",
      successTitle: "Anfrage gesendet!",
      successMessage:
        "Vielen Dank. Unser Team wird Sie in Kürze mit den Angebotsdetails kontaktieren.",
      nameLabel: "Vollständiger Name",
      namePlaceholder: "Geben Sie Ihren vollständigen Namen ein",
      phoneLabel: "Telefonnummer",
      phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
      descriptionLabel: "Projektbeschreibung",
      descriptionPlaceholder:
        "Beschreiben Sie Ihre Vorhanganforderungen, Maße, bevorzugten Stil, Raumtyp oder besondere Wünsche.",
      submitButton: "Anfrage senden",
      requiredText:
        "* Pflichtfelder. Ihre Informationen werden vertraulich behandelt.",
      immediateAssistance: "Benötigen Sie sofortige Unterstützung?",
      cards: [
        {
          title: "Schnelle Antwort",
          description: "Unser Team reagiert schnell auf Angebotsanfragen.",
        },
        {
          title: "Kostenlose Beratung",
          description:
            "Erhalten Sie fachkundige Beratung, bevor Sie Ihre Vorhänge auswählen.",
        },
        {
          title: "Individuelle Lösungen",
          description:
            "Vorhanglösungen, die auf Ihren Raum und Stil zugeschnitten sind.",
        },
      ],
      errors: {
        nameRequired: "Name ist erforderlich.",
        phoneRequired: "Telefonnummer ist erforderlich.",
        phoneInvalid: "Bitte geben Sie eine gültige Telefonnummer ein.",
        emailRequired: "E-Mail-Adresse ist erforderlich.",
        emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        descriptionRequired: "Projektbeschreibung ist erforderlich.",
      },
    },
    AR: {
      badge: "احصل على عرض سعر",
      title: "اطلب عرض السعر الخاص بك",
      description:
        "أخبرنا بمتطلبات الستائر الخاصة بك وسيتواصل معك فريقنا بأفضل حل مناسب.",
      whatsappMessage: "مرحبًا، أود طلب عرض سعر للستائر.",
      successTitle: "تم إرسال الطلب!",
      successMessage:
        "شكرًا لك. سيتواصل معك فريقنا قريبًا بتفاصيل عرض السعر.",
      nameLabel: "الاسم الكامل",
      namePlaceholder: "أدخل اسمك الكامل",
      phoneLabel: "رقم الهاتف",
      phonePlaceholder: "أدخل رقم هاتفك",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      descriptionLabel: "وصف المشروع",
      descriptionPlaceholder:
        "أخبرنا عن احتياجاتك من الستائر، القياسات، النمط المفضل، نوع الغرفة، أو أي متطلبات خاصة.",
      submitButton: "إرسال الطلب",
      requiredText: "* الحقول مطلوبة. سيتم الحفاظ على سرية معلوماتك.",
      immediateAssistance: "هل تحتاج إلى مساعدة فورية؟",
      cards: [
        {
          title: "استجابة سريعة",
          description: "يتعامل فريقنا بسرعة مع طلبات عروض الأسعار.",
        },
        {
          title: "استشارة مجانية",
          description: "احصل على نصيحة متخصصة قبل اختيار الستائر.",
        },
        {
          title: "حلول مخصصة",
          description: "حلول ستائر مصممة حسب مساحتك وذوقك.",
        },
      ],
      errors: {
        nameRequired: "الاسم مطلوب.",
        phoneRequired: "رقم الهاتف مطلوب.",
        phoneInvalid: "يرجى إدخال رقم هاتف صحيح.",
        emailRequired: "البريد الإلكتروني مطلوب.",
        emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
        descriptionRequired: "وصف المشروع مطلوب.",
      },
    },
    FR: {
      badge: "Obtenir un devis",
      title: "Demandez votre devis",
      description:
        "Parlez-nous de vos besoins en rideaux et notre équipe vous contactera avec la meilleure solution.",
      whatsappMessage: "Bonjour, je souhaite demander un devis pour des rideaux.",
      successTitle: "Demande envoyée !",
      successMessage:
        "Merci. Notre équipe vous contactera bientôt avec les détails du devis.",
      nameLabel: "Nom complet",
      namePlaceholder: "Entrez votre nom complet",
      phoneLabel: "Numéro de téléphone",
      phonePlaceholder: "Entrez votre numéro de téléphone",
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "Entrez votre adresse e-mail",
      descriptionLabel: "Description du projet",
      descriptionPlaceholder:
        "Parlez-nous de vos besoins en rideaux, mesures, style préféré, type de pièce ou exigences particulières.",
      submitButton: "Envoyer la demande",
      requiredText:
        "* Champs obligatoires. Vos informations resteront confidentielles.",
      immediateAssistance: "Besoin d’une assistance immédiate ?",
      cards: [
        {
          title: "Réponse rapide",
          description: "Notre équipe répond rapidement aux demandes de devis.",
        },
        {
          title: "Consultation gratuite",
          description:
            "Obtenez des conseils d’experts avant de choisir vos rideaux.",
        },
        {
          title: "Solutions personnalisées",
          description:
            "Des solutions de rideaux adaptées à votre espace et à votre style.",
        },
      ],
      errors: {
        nameRequired: "Le nom est requis.",
        phoneRequired: "Le numéro de téléphone est requis.",
        phoneInvalid: "Veuillez entrer un numéro de téléphone valide.",
        emailRequired: "L’adresse e-mail est requise.",
        emailInvalid: "Veuillez entrer une adresse e-mail valide.",
        descriptionRequired: "La description du projet est requise.",
      },
    },
    IT: {
      badge: "Richiedi un preventivo",
      title: "Richiedi il tuo preventivo",
      description:
        "Raccontaci le tue esigenze per le tende e il nostro team ti contatterà con la soluzione migliore.",
      whatsappMessage: "Ciao, vorrei richiedere un preventivo per le tende.",
      successTitle: "Richiesta inviata!",
      successMessage:
        "Grazie. Il nostro team ti contatterà presto con i dettagli del preventivo.",
      nameLabel: "Nome completo",
      namePlaceholder: "Inserisci il tuo nome completo",
      phoneLabel: "Numero di telefono",
      phonePlaceholder: "Inserisci il tuo numero di telefono",
      emailLabel: "Indirizzo email",
      emailPlaceholder: "Inserisci il tuo indirizzo email",
      descriptionLabel: "Descrizione del progetto",
      descriptionPlaceholder:
        "Raccontaci le tue esigenze per le tende, misure, stile preferito, tipo di stanza o richieste speciali.",
      submitButton: "Invia richiesta",
      requiredText:
        "* Campi obbligatori. Le tue informazioni saranno mantenute riservate.",
      immediateAssistance: "Hai bisogno di assistenza immediata?",
      cards: [
        {
          title: "Risposta rapida",
          description:
            "Il nostro team risponde rapidamente alle richieste di preventivo.",
        },
        {
          title: "Consulenza gratuita",
          description:
            "Ricevi consigli esperti prima di scegliere le tue tende.",
        },
        {
          title: "Soluzioni personalizzate",
          description:
            "Soluzioni per tende su misura per il tuo spazio e stile.",
        },
      ],
      errors: {
        nameRequired: "Il nome è obbligatorio.",
        phoneRequired: "Il numero di telefono è obbligatorio.",
        phoneInvalid: "Inserisci un numero di telefono valido.",
        emailRequired: "L’indirizzo email è obbligatorio.",
        emailInvalid: "Inserisci un indirizzo email valido.",
        descriptionRequired: "La descrizione del progetto è obbligatoria.",
      },
    },
    ES: {
      badge: "Obtener cotización",
      title: "Solicita tu cotización",
      description:
        "Cuéntanos tus necesidades de cortinas y nuestro equipo te contactará con la mejor solución.",
      whatsappMessage: "Hola, me gustaría solicitar una cotización de cortinas.",
      successTitle: "¡Solicitud enviada!",
      successMessage:
        "Gracias. Nuestro equipo se pondrá en contacto contigo pronto con los detalles de la cotización.",
      nameLabel: "Nombre completo",
      namePlaceholder: "Ingresa tu nombre completo",
      phoneLabel: "Número de teléfono",
      phonePlaceholder: "Ingresa tu número de teléfono",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "Ingresa tu correo electrónico",
      descriptionLabel: "Descripción del proyecto",
      descriptionPlaceholder:
        "Cuéntanos sobre tus necesidades de cortinas, medidas, estilo preferido, tipo de habitación o requisitos especiales.",
      submitButton: "Enviar solicitud",
      requiredText:
        "* Campos obligatorios. Tu información se mantendrá confidencial.",
      immediateAssistance: "¿Necesitas asistencia inmediata?",
      cards: [
        {
          title: "Respuesta rápida",
          description:
            "Nuestro equipo responde rápidamente a las solicitudes de cotización.",
        },
        {
          title: "Consulta gratuita",
          description:
            "Recibe asesoramiento experto antes de elegir tus cortinas.",
        },
        {
          title: "Soluciones personalizadas",
          description:
            "Soluciones de cortinas adaptadas a tu espacio y estilo.",
        },
      ],
      errors: {
        nameRequired: "El nombre es obligatorio.",
        phoneRequired: "El número de teléfono es obligatorio.",
        phoneInvalid: "Ingresa un número de teléfono válido.",
        emailRequired: "El correo electrónico es obligatorio.",
        emailInvalid: "Ingresa un correo electrónico válido.",
        descriptionRequired: "La descripción del proyecto es obligatoria.",
      },
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

const readJsonOrFallback = async (response, fallback) => {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
};

// `initialContent` is the payload the server already fetched; seeding the hook
// with it puts the real copy in the server HTML instead of a spinner.
const QuotationPage = ({ initialContent = null }) => {
  const { lang } = useLanguage();

  const { isAuthenticated: isAdmin } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCountryCode, setSelectedCountryCode] = useState("AE");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const ENDPOINT = `${apiUrl}/contact/contact1/`;
  const SUBMIT_ENDPOINT = `${apiUrl}/contact/contact5/`;

  const selectedCountry =
    COUNTRY_OPTIONS.find((country) => country.code === selectedCountryCode) ||
    COUNTRY_OPTIONS[0];

  const fullPhoneNumber = buildPhoneWithCountryCode(
    formData.phone,
    selectedCountry.dialCode
  );

  const { data, setData, tempData, setTempData, isLoading } = useEditableContent(
    ENDPOINT,
    {
      normalize: normalizeData,
      buildFallback: () => DEFAULT_DATA,
      initialContent,
    }
  );

  const activeData = editMode ? tempData : data;

  const copy =
    activeData?.translations?.[lang] ||
    activeData?.translations?.EN ||
    DEFAULT_DATA.translations.EN;

  const cards = Array.isArray(copy.cards) ? copy.cards : [];

  const inputClasses =
    "w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300";
  const labelClasses = "block text-sm font-medium mb-2";

  const ensureCurrentLanguageExists = (newData) => {
    if (!newData.translations) {
      newData.translations = {};
    }

    if (!newData.translations[lang]) {
      newData.translations[lang] =
        cloneData(newData.translations.EN) ||
        cloneData(DEFAULT_DATA.translations.EN);
    }

    if (!Array.isArray(newData.translations[lang].cards)) {
      newData.translations[lang].cards = [];
    }

    if (!newData.translations[lang].errors) {
      newData.translations[lang].errors =
        cloneData(DEFAULT_DATA.translations.EN.errors) || {};
    }

    return newData;
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      copy.whatsappMessage ||
        "Hello, I would like to request a curtain quotation."
    );

    window.open(
      `https://wa.me/${activeData.whatsappNumber}?text=${message}`,
      "_blank"
    );
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setIsSubmitted(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "nameRequired";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "phoneRequired";
    } else if (fullPhoneNumber.length < 8 || fullPhoneNumber.length > 15) {
      newErrors.phone = "phoneInvalid";
    }

    if (!formData.email.trim()) {
      newErrors.email = "emailRequired";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "emailInvalid";
    }

    if (!formData.description.trim()) {
      newErrors.description = "descriptionRequired";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: `+${fullPhoneNumber}`,
        email: formData.email.trim(),
        description: formData.description.trim(),
      };

      const response = await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quotation request");
      }

      setIsSubmitted(true);
      setShowSuccessModal(true);
      setErrors({});
      setFormData({
        name: "",
        phone: "",
        email: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting quotation request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  const handleErrorChange = (field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].errors[field] = value;
      return newData;
    });
  };

  const handleCardChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);
      newData.translations[lang].cards[index][field] = value;
      return newData;
    });
  };

  const addCard = () => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      newData.translations[lang].cards.push({
        title: "New Info Card",
        description: "Card description goes here.",
      });

      return newData;
    });
  };

  const removeCard = (index) => {
    setTempData((prev) => {
      const newData = cloneData(prev);
      ensureCurrentLanguageExists(newData);

      if (newData.translations[lang].cards.length <= 1) {
        alert("You must keep at least one info card.");
        return prev;
      }

      newData.translations[lang].cards = newData.translations[
        lang
      ].cards.filter((_, i) => i !== index);

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
        throw new Error("Failed to save quotation data");
      }

      const updatedData = await readJsonOrFallback(response, tempData);
      const normalizedData = normalizeData(updatedData);

      setData(normalizedData);
      setTempData(normalizedData);
      setEditMode(false);

      alert("Quotation page updated successfully!");
    } catch (error) {
      console.error("Error saving quotation data:", error);
      alert("Failed to save quotation page.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderAdminControls = () => {
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
  };

  if (isLoading) {
    return (
      <section
        className="min-h-screen pb-16 lg:pb-20 bg-lightBg relative flex items-center justify-center"
        style={{ paddingTop: "var(--navbar-h)" }}
      >
        <PageBackdrop />
      {/* Matches the dark backdrop behind the navbar on the home page hero,
          so the fixed nav reads the same way across routes. Sized from the
          navbar's own measured height (see Navbar.js), so there's zero gap
          regardless of viewport width or nav content wrapping. */}
      <div className="absolute top-0 left-0 right-0 z-[1] bg-black bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url(/curtains-hero.png)", height: "var(--navbar-h)" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/80" />
      </div>
        <div className="relative z-10 inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8f744e]"></div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen pb-16 lg:pb-20 bg-lightBg relative"
      style={{ paddingTop: "var(--navbar-h)" }}
    >
      <PageBackdrop />
      {/* Matches the dark backdrop behind the navbar on the home page hero,
          so the fixed nav reads the same way across routes. Sized from the
          navbar's own measured height (see Navbar.js), so there's zero gap
          regardless of viewport width or nav content wrapping. */}
      <div className="absolute top-0 left-0 right-0 z-[1] bg-black bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url(/curtains-hero.png)", height: "var(--navbar-h)" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/80" />
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {editMode && (
            <div className="mb-6 text-center">
              <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow">
                EDIT MODE ENABLED - Editing {lang}
              </span>
            </div>
          )}

          {/* Header */}
          <div className="text-center mt-5 mb-12">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center justify-center gap-3"
            >
              {editMode ? (
                <input
                  type="text"
                  value={copy.badge || ""}
                  onChange={(e) => handleTextChange("badge", e.target.value)}
                  className="px-4 py-2 rounded-full text-sm font-semibold shadow-lg text-center outline-none focus:ring-2 focus:ring-[#8f744e]"
                  style={{
                    backgroundColor: "#8f744e",
                    color: "#f3f0eb",
                  }}
                />
              ) : (
                <span
                  className="px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  style={{
                    backgroundColor: "#8f744e",
                    color: "#f3f0eb",
                  }}
                >
                  {copy.badge}
                </span>
              )}

              {renderAdminControls()}
            </motion.div>

            {editMode ? (
              <input
                type="text"
                value={copy.title || ""}
                onChange={(e) => handleTextChange("title", e.target.value)}
                className="w-full text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-white/80 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e]"
                style={{ color: "#8f744e" }}
              />
            ) : (
              // The page's one and only h1. It was an h2, which left the route
              // with no top-level heading at all.
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
                style={{ color: "#8f744e" }}
              >
                {copy.title}
              </h1>
            )}

            <div
              className="w-24 h-[5px] mx-auto"
              style={{
                background: "linear-gradient(to right, #8f744e, #b4a389)",
              }}
            />

            {editMode ? (
              <textarea
                value={copy.description || ""}
                onChange={(e) =>
                  handleTextChange("description", e.target.value)
                }
                rows="3"
                className="w-full text-lg mt-6 bg-white/80 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8f744e] resize-none text-center"
                style={{ color: "#b4a389" }}
              />
            ) : (
              <p className="text-lg mt-6" style={{ color: "#b4a389" }}>
                {copy.description}
              </p>
            )}
          </div>

          {editMode && (
            <div className="mb-8 rounded-2xl shadow-xl overflow-hidden bg-white p-6 sm:p-8">
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: "#8f744e" }}
              >
                Edit Page Content
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={activeData.whatsappNumber || ""}
                  onChange={(e) =>
                    handleRootChange("whatsappNumber", e.target.value)
                  }
                  placeholder="WhatsApp Number"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={activeData.displayPhone || ""}
                  onChange={(e) =>
                    handleRootChange("displayPhone", e.target.value)
                  }
                  placeholder="Display Phone"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.nameLabel || ""}
                  onChange={(e) =>
                    handleTextChange("nameLabel", e.target.value)
                  }
                  placeholder="Name Label"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.namePlaceholder || ""}
                  onChange={(e) =>
                    handleTextChange("namePlaceholder", e.target.value)
                  }
                  placeholder="Name Placeholder"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.phoneLabel || ""}
                  onChange={(e) =>
                    handleTextChange("phoneLabel", e.target.value)
                  }
                  placeholder="Phone Label"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.phonePlaceholder || ""}
                  onChange={(e) =>
                    handleTextChange("phonePlaceholder", e.target.value)
                  }
                  placeholder="Phone Placeholder"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.emailLabel || ""}
                  onChange={(e) =>
                    handleTextChange("emailLabel", e.target.value)
                  }
                  placeholder="Email Label"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.emailPlaceholder || ""}
                  onChange={(e) =>
                    handleTextChange("emailPlaceholder", e.target.value)
                  }
                  placeholder="Email Placeholder"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.descriptionLabel || ""}
                  onChange={(e) =>
                    handleTextChange("descriptionLabel", e.target.value)
                  }
                  placeholder="Description Label"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.submitButton || ""}
                  onChange={(e) =>
                    handleTextChange("submitButton", e.target.value)
                  }
                  placeholder="Submit Button"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.successTitle || ""}
                  onChange={(e) =>
                    handleTextChange("successTitle", e.target.value)
                  }
                  placeholder="Success Title"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <input
                  type="text"
                  value={copy.immediateAssistance || ""}
                  onChange={(e) =>
                    handleTextChange("immediateAssistance", e.target.value)
                  }
                  placeholder="Immediate Assistance Text"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />
              </div>

              <div className="mt-4 space-y-4">
                <textarea
                  value={copy.descriptionPlaceholder || ""}
                  onChange={(e) =>
                    handleTextChange("descriptionPlaceholder", e.target.value)
                  }
                  rows="2"
                  placeholder="Description Placeholder"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2 resize-none"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <textarea
                  value={copy.whatsappMessage || ""}
                  onChange={(e) =>
                    handleTextChange("whatsappMessage", e.target.value)
                  }
                  rows="2"
                  placeholder="WhatsApp Message"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2 resize-none"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <textarea
                  value={copy.successMessage || ""}
                  onChange={(e) =>
                    handleTextChange("successMessage", e.target.value)
                  }
                  rows="2"
                  placeholder="Success Message"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2 resize-none"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />

                <textarea
                  value={copy.requiredText || ""}
                  onChange={(e) =>
                    handleTextChange("requiredText", e.target.value)
                  }
                  rows="2"
                  placeholder="Required Text"
                  className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2 resize-none"
                  style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                />
              </div>

              <h4
                className="text-md font-bold mt-6 mb-3"
                style={{ color: "#8f744e" }}
              >
                Edit Error Messages
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(copy.errors || {}).map((key) => (
                  <input
                    key={key}
                    type="text"
                    value={copy.errors?.[key] || ""}
                    onChange={(e) => handleErrorChange(key, e.target.value)}
                    placeholder={key}
                    className="w-full px-4 py-3 rounded-lg border border-[#e6e0d8] outline-none focus:ring-2"
                    style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl shadow-xl overflow-hidden"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="p-6 sm:p-8">
              {/* Success Message */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 rounded-lg flex items-center"
                    style={{
                      backgroundColor: "#e6e0d8",
                      borderLeft: `4px solid #8f744e`,
                    }}
                  >
                    <FiCheckCircle
                      className="w-6 h-6 mr-3"
                      style={{ color: "#8f744e" }}
                    />
                    <div>
                      <h4
                        className="font-semibold"
                        style={{ color: "#8f744e" }}
                      >
                        {copy.successTitle}
                      </h4>
                      <p style={{ color: "#b4a389" }}>
                        {copy.successMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className={labelClasses} style={{ color: "#8f744e" }}>
                    <FiUser className="inline-block w-4 h-4 mr-2" />
                    {copy.nameLabel}
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={copy.namePlaceholder}
                    required
                    className={inputClasses}
                    style={{
                      backgroundColor: "#f3f0eb",
                      border: errors.name
                        ? "2px solid #dc2626"
                        : "1px solid #e6e0d8",
                      color: "#8f744e",
                    }}
                  />

                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {copy.errors?.[errors.name]}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className={labelClasses} style={{ color: "#8f744e" }}>
                    <FiPhone className="inline-block w-4 h-4 mr-2" />
                    {copy.phoneLabel}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-3">
                    <select
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className={inputClasses}
                      style={{
                        backgroundColor: "#f3f0eb",
                        border: "1px solid #e6e0d8",
                        color: "#8f744e",
                      }}
                    >
                      {COUNTRY_OPTIONS.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name} (+{country.dialCode})
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={copy.phonePlaceholder}
                      required
                      className={inputClasses}
                      style={{
                        backgroundColor: "#f3f0eb",
                        border: errors.phone
                          ? "2px solid #dc2626"
                          : "1px solid #e6e0d8",
                        color: "#8f744e",
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs" style={{ color: "#b4a389" }}>
                    Full WhatsApp number will be saved as:{" "}
                    <span className="font-semibold" style={{ color: "#8f744e" }}>
                      {fullPhoneNumber ? `+${fullPhoneNumber}` : `+${selectedCountry.dialCode}`}
                    </span>
                  </p>

                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {copy.errors?.[errors.phone]}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className={labelClasses} style={{ color: "#8f744e" }}>
                    <FiMail className="inline-block w-4 h-4 mr-2" />
                    {copy.emailLabel}
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={copy.emailPlaceholder}
                    required
                    className={inputClasses}
                    style={{
                      backgroundColor: "#f3f0eb",
                      border: errors.email
                        ? "2px solid #dc2626"
                        : "1px solid #e6e0d8",
                      color: "#8f744e",
                    }}
                  />

                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {copy.errors?.[errors.email]}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <label className={labelClasses} style={{ color: "#8f744e" }}>
                    <FiFileText className="inline-block w-4 h-4 mr-2" />
                    {copy.descriptionLabel}
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={copy.descriptionPlaceholder}
                    rows="5"
                    required
                    className={inputClasses}
                    style={{
                      backgroundColor: "#f3f0eb",
                      border: errors.description
                        ? "2px solid #dc2626"
                        : "1px solid #e6e0d8",
                      color: "#8f744e",
                      resize: "vertical",
                    }}
                  />

                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {copy.errors?.[errors.description]}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #8f744e 0%, #b4a389 100%)",
                    color: "#f3f0eb",
                  }}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <FiSend className="w-5 h-5 mr-2" />
                  )}
                  {copy.submitButton}
                </motion.button>

                <p
                  className="text-xs text-center mt-4"
                  style={{ color: "#b4a389" }}
                >
                  {copy.requiredText}
                </p>
              </form>
            </div>

            {/* Footer Info */}
            <div
              className="px-6 sm:px-8 py-4"
              style={{
                backgroundColor: "#e6e0d8",
                borderTop: `1px solid #b4a389`,
              }}
            >
              <p className="text-sm text-center" style={{ color: "#8f744e" }}>
                {copy.immediateAssistance}{" "}
                <span className="font-semibold">{activeData.displayPhone}</span>
              </p>
            </div>
          </motion.div>

          {/* Additional Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
          >
            {cards.map((item, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl relative"
                style={{ backgroundColor: "#ffffff" }}
              >
                {editMode && (
                  <button
                    onClick={() => removeCard(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg"
                    title="Remove Card"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}

                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleCardChange(index, "title", e.target.value)
                      }
                      className="w-full text-center font-semibold mb-2 rounded-lg px-2 py-1 outline-none focus:ring-2"
                      style={{ color: "#8f744e", backgroundColor: "#f3f0eb" }}
                    />

                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        handleCardChange(index, "description", e.target.value)
                      }
                      rows="3"
                      className="w-full text-center text-sm rounded-lg px-2 py-1 outline-none focus:ring-2 resize-none"
                      style={{ color: "#b4a389", backgroundColor: "#f3f0eb" }}
                    />
                  </>
                ) : (
                  <>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: "#8f744e" }}
                    >
                      {item.title}
                    </h4>

                    <p className="text-sm" style={{ color: "#b4a389" }}>
                      {item.description}
                    </p>
                  </>
                )}
              </div>
            ))}

            {editMode && (
              <button
                onClick={addCard}
                className="text-center p-4 rounded-xl border-2 border-dashed border-[#8f744e]/40 flex flex-col items-center justify-center min-h-[120px]"
                style={{ backgroundColor: "#ffffff", color: "#8f744e" }}
              >
                <FiPlus className="w-6 h-6 mb-2" />
                Add Info Card
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSuccessModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <button
                onClick={closeSuccessModal}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f0eb] text-[#8f744e] transition hover:bg-[#e6e0d8]"
                aria-label="Close success modal"
              >
                <FiX className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#e6e0d8]">
                <FiCheckCircle className="h-11 w-11 text-[#8f744e]" />
              </div>

              <h3 className="mb-3 text-2xl font-bold text-[#8f744e]">
                {copy.successTitle}
              </h3>

              <p className="mb-6 leading-relaxed text-[#b4a389]">
                {copy.successMessage}
              </p>

              <button
                onClick={closeSuccessModal}
                className="w-full rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #8f744e 0%, #b4a389 100%)",
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="
          fixed bottom-6 right-6 z-50
          w-16 h-16
          rounded-full
          bg-[#25D366]
          text-white
          flex items-center justify-center
          shadow-2xl
          hover:scale-110
          hover:shadow-[0_15px_40px_rgba(37,211,102,0.5)]
          transition-all duration-300
        "
      >
        <FaWhatsapp size={28} />
      </button>
    </section>
  );
};

export default QuotationPage;