import SocialBlob from "@/components/SocialBlob";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center px-4 md:px-8 py-16 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-6xl">
        {/* 🌈 Animated Blob + Social Icons */}
        <div className="order-2 md:order-1">
          <SocialBlob />
        </div>

        {/* 📬 Contact Form */}
        <div className="order-1 md:order-2">
          <ContactForm />
        </div>
      </div>

      {/* 💫 Floating Glow Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}
