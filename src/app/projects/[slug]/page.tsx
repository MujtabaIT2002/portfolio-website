"use client";

import { use } from "react";
import projects from "@/app/Data/projectsData";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params); // ✅ unwrap params (Next.js 15+)

  const project = projects.find((p) => p.id === Number(slug));
  if (!project || !project.caseStudy) return notFound();

  const { title, description, caseStudy, image } = project;

  return (
    <main className="min-h-screen bg-black text-white py-16 px-6 md:px-16 relative overflow-hidden">
      {/* 🧭 Sticky Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto space-y-12 mt-10">
        {/* 🟣 Header Section (Bento style) */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-purple-400">{title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
          </div>

          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/10 shadow-inner">
            <Image
              src={`/${image}`}
              alt={title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* 🧩 Overview */}
        <section className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg shadow-md hover:shadow-purple-500/10 transition">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">Overview</h2>
          <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 font-semibold underline underline-offset-4 hover:text-purple-300 transition"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {caseStudy.overview}
            </ReactMarkdown>
          </div>
        </section>

        {/* 🧠 Problem */}
        <section className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg shadow-md hover:shadow-purple-500/10 transition">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">Problem</h2>
          <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
            <ReactMarkdown>
              {caseStudy.problem}
            </ReactMarkdown>
          </div>
        </section>

        {/* 💡 Solution */}
        <section className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg shadow-md hover:shadow-purple-500/10 transition">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">Solution</h2>
          <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 font-semibold underline underline-offset-4 hover:text-purple-300 transition"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {caseStudy.solution}
            </ReactMarkdown>
          </div>
        </section>

        {/* 🧬 Tech Stack */}
        {caseStudy.techStack && (
          <section className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg shadow-md hover:shadow-purple-500/10 transition">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {caseStudy.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="bg-purple-800/40 border border-purple-500/30 text-sm px-3 py-1 rounded-full shadow-sm hover:shadow-purple-400/30 transition"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
