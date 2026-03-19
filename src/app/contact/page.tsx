"use client";

import React, { useState, useRef } from "react";
import Footer from "@/shared/components/Footer";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import { copyEmailToClipboard } from "@/services/contact/mail";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [emailCopyStatus, setEmailCopyStatus] = useState<{ success: boolean; message: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ""));
  };
  const validateRequired = (value: string): boolean => value.trim().length > 0;
  const validateMessage = (msg: string): boolean => msg.trim().length >= 10;

  const validateForm = (formData: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!validateRequired(formData.first_name)) errors.first_name = "First name is required";
    if (!validateRequired(formData.last_name)) errors.last_name = "Last name is required";
    if (!validateRequired(formData.email)) errors.email = "Email is required";
    else if (!validateEmail(formData.email)) errors.email = "Please enter a valid email address";
    if (!validateRequired(formData.inquiry_type)) errors.inquiry_type = "Please select an inquiry type";
    if (!validateRequired(formData.message)) errors.message = "Message is required";
    else if (!validateMessage(formData.message)) errors.message = "Message must be at least 10 characters long";
    if (formData.phone && !validatePhone(formData.phone)) errors.phone = "Please enter a valid phone number";
    return errors;
  };

  const handleInputChange = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => { const n = { ...prev }; delete n[fieldName]; return n; });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setValidationErrors({});

    const formData = new FormData(e.currentTarget);
    const data: FormData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      inquiry_type: formData.get("inquiry_type") as string,
      message: formData.get("message") as string,
    };

    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) { setValidationErrors(errors); setIsLoading(false); return; }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Thank you! Your message has been sent successfully. We'll get back to you soon." });
        formRef.current?.reset();
      } else {
        setMessage({ type: "error", text: result.error || "Sorry, there was an error sending your message. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Sorry, there was an error sending your message. Please try again or contact us directly using the email options below." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailCopy = async () => {
    const result = await copyEmailToClipboard("dailysatorg@gmail.com");
    setEmailCopyStatus(result);
    setTimeout(() => setEmailCopyStatus(null), 3000);
  };

  const inputBase = "w-full px-3.5 py-2.5 border rounded-xl bg-gray-50 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition disabled:bg-gray-100 disabled:cursor-not-allowed";
  const inputClass = (field: string) =>
    `${inputBase} ${validationErrors[field] ? "border-red-300 focus:border-red-400 focus:ring-red-400/10" : "border-gray-200 focus:border-blue-500"}`;

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}</style>

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-400" />

      {/* Page header */}
      <div className="w-full bg-white border-b border-gray-200 px-8 md:px-16 py-8">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-blue-500 mb-1">
          DailySAT · Contact
        </p>
        <h1
          className="text-4xl md:text-5xl text-gray-900 leading-tight"
          style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
        >
          Get in <span className="text-blue-500">touch.</span>
        </h1>
        <p className="text-sm text-gray-500 font-light mt-1">
          We'd love to hear from you — partnerships, questions, or just saying hello.
        </p>
      </div>

      {/* Body */}
      <div className="px-8 md:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form card — takes 2/3 */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-7">
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-1">
              Contact Form
            </p>
            <p className="text-sm text-gray-500 font-light mb-6">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>

            {/* Success / Error banner */}
            {message && (
              <div className={`mb-6 flex items-start gap-3 p-4 rounded-xl border text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}>
                {message.type === "success" ? (
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {message.text}
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">First Name <span className="text-blue-500">*</span></label>
                  <input
                    type="text" name="first_name" required disabled={isLoading}
                    onChange={() => handleInputChange("first_name")}
                    className={inputClass("first_name")}
                  />
                  {validationErrors.first_name && <p className="text-red-500 text-xs mt-1">{validationErrors.first_name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name <span className="text-blue-500">*</span></label>
                  <input
                    type="text" name="last_name" required disabled={isLoading}
                    onChange={() => handleInputChange("last_name")}
                    className={inputClass("last_name")}
                  />
                  {validationErrors.last_name && <p className="text-red-500 text-xs mt-1">{validationErrors.last_name}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email <span className="text-blue-500">*</span></label>
                <input
                  type="email" name="email" required disabled={isLoading}
                  onChange={() => handleInputChange("email")}
                  className={inputClass("email")}
                />
                {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Phone Number <span className="text-gray-400 font-light">(optional)</span>
                </label>
                <input
                  type="tel" name="phone" disabled={isLoading}
                  onChange={() => handleInputChange("phone")}
                  placeholder="(123) 456-7890"
                  className={inputClass("phone")}
                />
                {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
              </div>

              {/* Inquiry type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Inquiry Type <span className="text-blue-500">*</span></label>
                <select
                  name="inquiry_type" required disabled={isLoading}
                  onChange={() => handleInputChange("inquiry_type")}
                  className={inputClass("inquiry_type")}
                >
                  <option value="">Select an option</option>
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Support</option>
                  <option value="other">Other</option>
                </select>
                {validationErrors.inquiry_type && <p className="text-red-500 text-xs mt-1">{validationErrors.inquiry_type}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Message <span className="text-blue-500">*</span></label>
                <textarea
                  name="message" required disabled={isLoading}
                  onChange={() => handleInputChange("message")}
                  placeholder="Please provide details about your inquiry (minimum 10 characters)…"
                  className={`${inputClass("message")} resize-none min-h-[120px] leading-relaxed`}
                />
                {validationErrors.message && <p className="text-red-500 text-xs mt-1">{validationErrors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-px"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info card — 1/3 */}
          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-3">
                Email
              </p>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">dailysatorg@gmail.com</p>
                  {emailCopyStatus && (
                    <p className={`text-xs mt-0.5 ${emailCopyStatus.success ? "text-green-600" : "text-red-500"}`}>
                      {emailCopyStatus.message}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleEmailCopy}
                className="mt-3 w-full text-xs font-semibold text-blue-500 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 rounded-xl py-2 transition"
              >
                Copy email address
              </button>
            </div>

            {/* Instagram */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-3">
                Instagram
              </p>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Follow our journey</p>
                  <a
                    href="https://www.instagram.com/dailysatorg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium transition"
                  >
                    @dailysatorg
                  </a>
                </div>
              </div>
            </div>

            {/* Response time note */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-2">
                Response Time
              </p>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                We typically respond within <span className="font-semibold text-gray-800">1–2 business days</span>. For urgent matters, reach out directly via email.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const ContactPage = () => (
  <ErrorBoundary>
    <Contact />
  </ErrorBoundary>
);

export default ContactPage;
