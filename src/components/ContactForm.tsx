"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      showToast("Message sent successfully! 🎉", "success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send email:", error);
      showToast("Failed to send message. Please try again. ❌", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span className="text-xl">
            {toast.type === "success" ? "✓" : "✗"}
          </span>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 bg-black/40 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl shadow-lg text-white w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-500">
          Get in Touch 👋
        </h2>

        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          disabled={isLoading}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 disabled:opacity-50"
        />

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          disabled={isLoading}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 disabled:opacity-50"
        />

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows={5}
          required
          disabled={isLoading}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 disabled:opacity-50"
        ></textarea>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-2 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 py-3 rounded-lg font-semibold text-white transition-transform transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </>
  );
}