"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiFilter,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiUser,
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PageBackdrop from "@/components/PageBackdrop";
import { useAuth } from "@/contexts/AuthContext";

const formatDateTime = (value) => {
  if (!value) return "N/A";

  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const getToday = () => {
  const date = new Date();
  return date.toISOString().slice(0, 10);
};

const getThirtyDaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().slice(0, 10);
};

const cleanWhatsAppNumber = (phone) => {
  const rawPhone = String(phone || "").trim();

  if (!rawPhone) return "";

  const digitsOnly = rawPhone.replace(/[^\d]/g, "");

  if (!digitsOnly) return "";

  if (digitsOnly.startsWith("00")) {
    return digitsOnly.slice(2);
  }

  return digitsOnly;
};

export default function ContactSubmissionsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const { logout } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [meta, setMeta] = useState({
    count: 0,
    unread_count: 0,
    total_pages: 1,
    current_page: 1,
    has_next: false,
    has_previous: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [error, setError] = useState("");

  const endpoint = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("page_size", String(pageSize));

    if (appliedFilters.startDate) {
      params.set("start_date", appliedFilters.startDate);
    }

    if (appliedFilters.endDate) {
      params.set("end_date", appliedFilters.endDate);
    }

    return `${apiUrl}/contact/submissions/?${params.toString()}`;
  }, [apiUrl, page, pageSize, appliedFilters]);

  // No Authorization header — the session is an httpOnly cookie the browser
  // attaches automatically as long as `credentials: "include"` is set on the
  // request (see AuthContext); the token itself is never readable here.
  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
    };
  }, []);

  const fetchSubmissions = useCallback(
    async (signal) => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: getHeaders(),
          credentials: "include",
          signal,
        });

        if (response.status === 401) {
          // Token expired/invalidated server-side — drop back to the login
          // form rather than show a bare fetch-failed error.
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch contact submissions.");
        }

        const result = await response.json();

        setSubmissions(Array.isArray(result.results) ? result.results : []);

        setMeta({
          count: result.count || 0,
          unread_count: result.unread_count || 0,
          total_pages: result.total_pages || 1,
          current_page: result.current_page || 1,
          has_next: !!result.has_next,
          has_previous: !!result.has_previous,
        });
      } catch (err) {
        // An abort means the filters/page changed or the view unmounted; the
        // newer request owns the state now, so leave it alone.
        if (err?.name === "AbortError") return;

        console.error(err);
        setError("Could not load submitted forms. Please check your backend endpoint.");
        setSubmissions([]);
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [endpoint, getHeaders, logout]
  );

  useEffect(() => {
    // Aborting on change is what makes filter/page switches safe: a slow
    // earlier response can no longer overwrite the results for the filter the
    // user is actually looking at.
    const controller = new AbortController();
    fetchSubmissions(controller.signal);
    return () => controller.abort();
  }, [fetchSubmissions]);

  const applyFilters = () => {
    setPage(1);
    setAppliedFilters({
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
  };

  const resetFilters = () => {
    setPage(1);
    setFilters({
      startDate: "",
      endDate: "",
    });
    setAppliedFilters({
      startDate: "",
      endDate: "",
    });
  };

  const applyLast30Days = () => {
    const startDate = getThirtyDaysAgo();
    const endDate = getToday();

    setPage(1);

    setFilters({
      startDate,
      endDate,
    });

    setAppliedFilters({
      startDate,
      endDate,
    });
  };

  const openDetails = (submission) => {
    setSelectedSubmission(submission);
    setWhatsappNumber(cleanWhatsAppNumber(submission.phone));
    setWhatsappMessage(
      `Hello ${submission.name}, thank you for contacting SKF Curtains. We received your quotation request and will assist you shortly.`
    );
  };

  const closeDetails = () => {
    setSelectedSubmission(null);
    setWhatsappMessage("");
    setWhatsappNumber("");
  };

  const openEmailReply = () => {
    if (!selectedSubmission?.email) {
      alert("This submission does not have a valid email address.");
      return;
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      selectedSubmission.email
    )}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const openWhatsAppReply = () => {
    const phone = cleanWhatsAppNumber(whatsappNumber);

    if (!phone) {
      alert("Please enter a valid WhatsApp number with country code.");
      return;
    }

    if (phone.startsWith("0")) {
      alert(
        "WhatsApp requires country code. Please replace the starting 0 with the correct country code, for example 8801..., 9715..., 1..., etc."
      );
      return;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      whatsappMessage || ""
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const markAsRead = async (submissionId) => {
    if (!submissionId) return;

    setIsMarkingRead(true);

    try {
      const response = await fetch(
        `${apiUrl}/contact/submissions/${submissionId}/read/`,
        {
          method: "PATCH",
          headers: getHeaders(),
          credentials: "include",
        }
      );

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to mark submission as read.");
      }

      const result = await response.json();
      const updatedSubmission = result.data;

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === submissionId ? { ...item, ...updatedSubmission } : item
        )
      );

      setSelectedSubmission((prev) =>
        prev && prev.id === submissionId
          ? { ...prev, ...updatedSubmission }
          : prev
      );

      setMeta((prev) => ({
        ...prev,
        unread_count: Math.max(0, Number(prev.unread_count || 0) - 1),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to mark this submission as read.");
    } finally {
      setIsMarkingRead(false);
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
      <PageBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm border border-[#e6e0d8]">
              <span className="h-2 w-2 rounded-full bg-[#8f744e]" />
              <span className="text-sm font-semibold text-[#8f744e]">
                Admin Panel
              </span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#8f744e]">
              Form Submissions
            </h1>

            <p className="mt-3 max-w-2xl text-[#8f744e]/80 leading-relaxed">
              View all submitted quotation requests, filter them by date, and manage customer inquiries from one beautiful dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSubmissions}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8f744e] px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#7c6544]"
            >
              <FiRefreshCw />
              Refresh
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#8f744e]/30 bg-white/90 px-5 py-3 font-semibold text-[#8f744e] shadow-sm transition hover:bg-[#f3f0eb]"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white/90 backdrop-blur-xl p-6 shadow-xl border border-[#e6e0d8]"
          >
            <p className="text-sm font-semibold text-[#b4a389]">
              Total Requests
            </p>
            <h2 className="mt-2 text-4xl font-bold text-[#8f744e]">
              {meta.count}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl bg-white/90 backdrop-blur-xl p-6 shadow-xl border border-[#e6e0d8]"
          >
            <p className="text-sm font-semibold text-[#b4a389]">
              Unread Requests
            </p>
            <h2 className="mt-2 text-4xl font-bold text-[#8f744e]">
              {meta.unread_count}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white/90 backdrop-blur-xl p-6 shadow-xl border border-[#e6e0d8]"
          >
            <p className="text-sm font-semibold text-[#b4a389]">
              Current Page
            </p>
            <h2 className="mt-2 text-4xl font-bold text-[#8f744e]">
              {meta.current_page}
              <span className="text-lg text-[#b4a389]">
                {" "}
                / {meta.total_pages}
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-3xl bg-white/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl border border-[#e6e0d8]">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6e0d8] text-[#8f744e]">
              <FiFilter />
            </div>

            <div>
              <h3 className="font-bold text-[#8f744e]">Date Filters</h3>
              <p className="text-sm text-[#b4a389]">
                Filter submissions datewise.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#8f744e]">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e6e0d8] bg-[#f3f0eb] px-4 py-3 text-[#8f744e] outline-none transition focus:ring-2 focus:ring-[#8f744e]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#8f744e]">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e6e0d8] bg-[#f3f0eb] px-4 py-3 text-[#8f744e] outline-none transition focus:ring-2 focus:ring-[#8f744e]"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 rounded-2xl bg-[#8f744e] px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-[#7c6544]"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={applyLast30Days}
              className="inline-flex items-center gap-2 rounded-full bg-[#f3f0eb] px-4 py-2 text-sm font-semibold text-[#8f744e] transition hover:bg-[#e6e0d8]"
            >
              <FiCalendar />
              Last 30 Days
            </button>

            <button
              onClick={resetFilters}
              className="rounded-full bg-[#f3f0eb] px-4 py-2 text-sm font-semibold text-[#8f744e] transition hover:bg-[#e6e0d8]"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table / Cards */}
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-[#e6e0d8] overflow-hidden">
          {error && (
            <div className="border-b border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#8f744e]" />
                <p className="mt-4 text-[#b4a389]">Loading submissions...</p>
              </div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e6e0d8]">
                  <FiMail className="h-8 w-8 text-[#8f744e]" />
                </div>

                <h3 className="text-xl font-bold text-[#8f744e]">
                  No submissions found
                </h3>

                <p className="mt-2 text-[#b4a389]">
                  Try changing the date filters or refresh the page.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e6e0d8] bg-[#f3f0eb] text-left">
                      <th className="px-6 py-4 text-sm font-bold text-[#8f744e]">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-[#8f744e]">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-[#8f744e]">
                        Message
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-[#8f744e]">
                        Date
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-[#8f744e]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-[#8f744e]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {submissions.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#f3f0eb] transition hover:bg-[#f9f7f3]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6e0d8] text-[#8f744e]">
                              <FiUser />
                            </div>

                            <div>
                              <p className="font-bold text-[#8f744e]">
                                {item.name}
                              </p>
                              <p className="text-sm text-[#b4a389]">
                                #{item.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2 text-sm text-[#8f744e]">
                              <FiPhone /> {item.phone}
                            </p>

                            <p className="flex items-center gap-2 text-sm text-[#b4a389]">
                              <FiMail /> {item.email}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="max-w-sm line-clamp-2 text-sm text-[#6f5b3e]">
                            {item.description}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-[#8f744e]">
                          {formatDateTime(item.created_at)}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              item.is_read
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.is_read ? "Read" : "Unread"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => openDetails(item)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#8f744e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7c6544]"
                          >
                            <FiEye />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-[#f3f0eb]">
                {submissions.map((item) => (
                  <div key={item.id} className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[#8f744e]">
                          {item.name}
                        </h3>

                        <p className="text-sm text-[#b4a389]">
                          {formatDateTime(item.created_at)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.is_read
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.is_read ? "Read" : "Unread"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-[#8f744e]">
                        <FiPhone /> {item.phone}
                      </p>

                      <p className="flex items-center gap-2 text-[#b4a389]">
                        <FiMail /> {item.email}
                      </p>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#6f5b3e]">
                      {item.description}
                    </p>

                    <button
                      onClick={() => openDetails(item)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8f744e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#7c6544]"
                    >
                      <FiEye />
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white/90 backdrop-blur-xl p-5 shadow-xl border border-[#e6e0d8] sm:flex-row">
          <p className="text-sm font-semibold text-[#8f744e]">
            Showing page {meta.current_page} of {meta.total_pages}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={!meta.has_previous || isLoading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="inline-flex items-center gap-2 rounded-xl bg-[#f3f0eb] px-4 py-2 font-semibold text-[#8f744e] transition hover:bg-[#e6e0d8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiChevronLeft />
              Previous
            </button>

            <div className="rounded-xl bg-[#8f744e] px-4 py-2 font-bold text-white">
              {meta.current_page}
            </div>

            <button
              disabled={!meta.has_next || isLoading}
              onClick={() => setPage((prev) => prev + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#f3f0eb] px-4 py-2 font-semibold text-[#8f744e] transition hover:bg-[#e6e0d8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDetails}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={closeDetails}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0eb] text-[#8f744e] transition hover:bg-[#e6e0d8]"
              >
                <FiX />
              </button>

              <div className="mb-6 pr-12">
                <div className="mb-4 inline-flex rounded-full bg-[#e6e0d8] px-4 py-2 text-sm font-bold text-[#8f744e]">
                  Submission #{selectedSubmission.id}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#8f744e]">
                  {selectedSubmission.name}
                </h2>

                <p className="mt-2 text-[#b4a389]">
                  Submitted on {formatDateTime(selectedSubmission.created_at)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl bg-[#f3f0eb] p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#b4a389]">
                    Phone
                  </p>

                  <p className="flex items-center gap-2 font-semibold text-[#8f744e]">
                    <FiPhone /> {selectedSubmission.phone}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f3f0eb] p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#b4a389]">
                    Email
                  </p>

                  <p className="flex items-center gap-2 break-all font-semibold text-[#8f744e]">
                    <FiMail /> {selectedSubmission.email}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#f3f0eb] p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#b4a389]">
                  Project Description
                </p>

                <p className="whitespace-pre-wrap leading-relaxed text-[#6f5b3e]">
                  {selectedSubmission.description}
                </p>
              </div>

              <div className="mt-5 rounded-2xl bg-[#f3f0eb] p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#b4a389]">
                  WhatsApp Number With Country Code
                </p>

                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(cleanWhatsAppNumber(e.target.value))}
                  placeholder="Example: 8801712345678, 971547219791, 15551234567"
                  className="mb-4 w-full rounded-xl border border-[#e6e0d8] bg-white px-4 py-3 text-[#8f744e] outline-none transition focus:ring-2 focus:ring-[#8f744e]"
                />

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#b4a389]">
                  WhatsApp Reply Message
                </p>

                <textarea
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  rows={4}
                  placeholder="Write your WhatsApp reply here..."
                  className="w-full rounded-xl border border-[#e6e0d8] bg-white px-4 py-3 text-[#8f744e] outline-none transition focus:ring-2 focus:ring-[#8f744e] resize-none"
                />

                <p className="mt-2 text-xs text-[#b4a389]">
                  WhatsApp will open chat with:{" "}
                  <span className="font-semibold text-[#8f744e]">
                    {cleanWhatsAppNumber(whatsappNumber) || "Invalid number"}
                  </span>
                </p>

                {cleanWhatsAppNumber(whatsappNumber).startsWith("0") && (
                  <p className="mt-2 text-xs font-semibold text-red-600">
                    This number starts with 0. Replace it with the country code
                    before opening WhatsApp.
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                {!selectedSubmission.is_read && (
                  <button
                    onClick={() => markAsRead(selectedSubmission.id)}
                    disabled={isMarkingRead}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                  >
                    <FiCheckCircle />
                    {isMarkingRead ? "Updating..." : "Mark as Read"}
                  </button>
                )}

                <button
                  onClick={openEmailReply}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8f744e] px-5 py-3 font-semibold text-white transition hover:bg-[#7c6544]"
                >
                  <FiMail />
                  Reply by Email
                </button>

                <button
                  onClick={openWhatsAppReply}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white transition hover:bg-[#1fb85a]"
                >
                  <FaWhatsapp />
                  Reply on WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}