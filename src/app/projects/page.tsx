import Link from "next/link";
import Image from "next/image";
import projects from "@/app/Data/projectsData";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-black text-white py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-purple-400">
          All Projects
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden 
                         hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 
                         shadow-lg backdrop-blur-md flex flex-col justify-between"
            >
              {/* 🖼️ Image */}
              <div className="relative w-full h-48">
                <Image
                  src={`/${project.image}`}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* 📄 Content */}
              <div className="p-5 space-y-2 flex-1">
                <h2 className="text-lg font-semibold text-purple-300">
                  {project.title}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {project.description}
                </p>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {project.category}
                </span>
              </div>

              {/* 🔗 Action Buttons */}
              <div className="flex flex-wrap gap-3 p-4 pt-0 border-t border-white/10">
                {/* View Case Study */}
                {project.caseStudy && (
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex-1 text-center text-xs sm:text-sm px-4 py-2 
                               bg-purple-600/20 text-purple-300 rounded-lg border border-purple-500/30 
                               hover:bg-purple-600/30 hover:scale-105 transition-all"
                  >
                    📘 Case Study
                  </Link>
                )}

                {/* Live Demo */}
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs sm:text-sm px-4 py-2 
                               bg-green-600/20 text-green-300 rounded-lg border border-green-500/30 
                               hover:bg-green-600/30 hover:scale-105 transition-all"
                  >
                    🌐 Live Demo
                  </a>
                )}

                {/* Code */}
                {project.codeLink && (
                  <a
                    href={project.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs sm:text-sm px-4 py-2 
                               bg-blue-600/20 text-blue-300 rounded-lg border border-blue-500/30 
                               hover:bg-blue-600/30 hover:scale-105 transition-all"
                  >
                    💻 Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
