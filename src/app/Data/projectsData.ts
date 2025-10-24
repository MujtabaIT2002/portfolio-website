export interface Project {
  id: number;
  title: string;
  category: "ai" | "fullstack";
  description: string;
  image: string;
  codeLink: string;
  demoLink?: string;
  caseStudy?: {
    overview: string;
    techStack: string[];
    problem: string;
    solution: string;
  };
}

const projects: Project[] = [
  // ⚡ ---------- AI AUTOMATION PROJECTS ----------
  {
    id: 1,
    title: "Marketing Assistant Bot",
    category: "ai",
    description:
      "A fine-tuned Phi-3 Mini model using QLoRA to generate engaging ad copy, product descriptions, and social media captions efficiently.",
    image: "Marketing_chatbot.jpg",
    codeLink: "https://github.com/MujtabaIT2002/Marketing_bot",
    demoLink: "",
    caseStudy: {
      overview:
        "An AI-powered content generator that produces brand-consistent marketing material using Microsoft’s Phi-3 Mini model fine-tuned with QLoRA.",
      techStack: ["Python", "Transformers", "PEFT (QLoRA)", "BitsAndBytes", "Hugging Face"],
      problem:
        "Manual content creation is repetitive and inconsistent, making it difficult for businesses to maintain brand tone and efficiency.",
      solution:
        "Implemented a lightweight fine-tuning pipeline for Phi-3 Mini using QLoRA, enabling small businesses to auto-generate creative, platform-specific marketing content efficiently.",
    },
  },

  {
    id: 2,
    title: "Protein Antigenicity Prediction System",
    category: "ai",
    description:
      "A deep learning web app that predicts protein antigenicity with 98.7% accuracy using UniRep embeddings and CNN-based models.",
    image: "Protein_antigenecity.jpg",
    codeLink: "https://github.com/MujtabaIT2002/ProteinSequence",
    demoLink: "https://huggingface.co/spaces/Mujju2002/protein-antigenicity-predictor",
    caseStudy: {
      overview:
        "A research-focused deep learning platform for predicting the immunogenic potential of protein sequences using UniRep-based embeddings.",
      techStack: ["Python", "Flask", "PyTorch", "TensorFlow", "TAPE UniRep", "Docker"],
      problem:
        "Traditional antigenicity testing in labs is time-consuming, limiting early vaccine development and analysis.",
      solution:
        "Developed a web-based system that processes protein FASTA sequences and predicts antigenicity instantly through a trained CNN ensemble, improving research efficiency.",
    },
  },

  {
  id: 3,
  title: "Solace Pixel — AI Instagram Post Generator",
  category: "ai",
  description:
    "An AI automation tool that generates, stylizes, and uploads Instagram posts with captions and hashtags automatically — currently powering a live account.",
  image: "Solace.jpg",
  codeLink: "https://github.com/MujtabaIT2002/solace-pixel",
  demoLink: "https://www.instagram.com/solace.in.pixel/",
  caseStudy: {
    overview:
      "Solace Pixel is an AI-driven content automation system that converts simple text prompts and assets into complete, visually appealing Instagram posts. The system is currently used to manage the live Instagram account [@solace.in.pixel](https://www.instagram.com/solace.in.pixel/), showcasing how AI can handle consistent brand aesthetics and scheduling.",
    techStack: [
      "Python",
      "Streamlit",
      "Cloudinary API",
      "Meta Graph API",
      "Pillow",
      "dotenv",
    ],
    problem:
      "Content creators and small brands spend hours designing, captioning, and uploading posts manually — making it difficult to maintain a consistent posting schedule and brand tone.",
    solution:
      "Built an automated pipeline that takes text and images as input, generates stylized designs, crafts creative captions and hashtags, and uploads the posts directly to Instagram via the Meta Graph API. The live account [@solace.in.pixel](https://www.instagram.com/solace.in.pixel/) demonstrates the results generated entirely through this AI-powered workflow.",
  },
},


  {
    id: 4,
    title: "E-Commerce Product Scraper",
    category: "ai",
    description:
      "A Playwright-based automation that extracts structured data from Daraz for research and market analysis.",
    image: "Scrapper.jpg",
    codeLink: "https://github.com/MujtabaIT2002/terminal_based_daraz_scrappe",
    demoLink: "",
    caseStudy: {
      overview:
        "Automated product data collection from e-commerce platforms to support analytics and price monitoring.",
      techStack: ["Node.js", "Playwright", "JavaScript", "File System (fs)"],
      problem:
        "Tracking product details manually from multiple pages is inefficient and prone to errors.",
      solution:
        "Built a scraper that searches for items, extracts structured details (titles, prices, ratings), and exports datasets in JSON format for further processing.",
    },
  },

  // ⚙️ ---------- FULLSTACK PROJECTS ----------
  {
    id: 5,
    title: "React Blog App",
    category: "fullstack",
    description:
      "A responsive React-based blog platform allowing users to create, edit, and delete posts in real time.",
    image: "Blog_app.jpg",
    codeLink: "https://github.com/MujtabaIT2002/BlogApp-React",
    demoLink: "https://blog-app-react-nine.vercel.app",
    caseStudy: {
      overview:
        "A clean, modern blogging platform that demonstrates CRUD operations, React state management, and responsive UI principles.",
      techStack: ["React", "Vite", "Tailwind CSS", "Local Storage"],
      problem:
        "Many blogging tools are heavy and require backend integration even for personal or small-scale projects.",
      solution:
        "Built a lightweight React app that handles posts entirely on the frontend while maintaining a structured, scalable architecture.",
    },
  },

  {
    id: 6,
    title: "WeatherApp",
    category: "fullstack",
    description:
      "A responsive weather dashboard built with React that fetches real-time weather data via API.",
    image: "Weather_app.jpg",
    codeLink: "https://github.com/MujtabaIT2002/weather-app",
    demoLink: "https://dep-task-4.vercel.app",
    caseStudy: {
      overview:
        "A simple, fast, and visually appealing weather app that provides real-time global weather updates.",
      techStack: ["React", "OpenWeatherMap API", "Tailwind CSS"],
      problem:
        "Users often struggle with cluttered or slow-loading weather apps filled with unnecessary data.",
      solution:
        "Developed a clean interface that instantly displays temperature, humidity, and forecast data in a compact and user-friendly layout.",
    },
  },

  {
    id: 7,
    title: "FitTrack",
    category: "fullstack",
    description:
      "A MERN-based fitness tracker with authentication, workout logs, and progress visualization.",
    image: "Fitness_app.jpg",
    codeLink: "https://github.com/MujtabaIT2002/Fitness_frontend",
    demoLink: "https://fitness-frontend-indol.vercel.app",
    caseStudy: {
      overview:
        "A complete fitness tracker for users to record workouts, track goals, and monitor progress visually.",
      techStack: ["MongoDB", "Express.js", "React", "Node.js", "JWT Auth"],
      problem:
        "Fitness enthusiasts lack simple tools to monitor workouts and progress trends securely.",
      solution:
        "Created a full-featured MERN stack app with secure authentication, daily progress logs, and dynamic data visualization using charts.",
    },
  },

  {
    id: 8,
    title: "Macrosoar Template",
    category: "fullstack",
    description:
      "A modern, responsive software company website template with a corporate design and fluid navigation.",
    image: "MacroSoar.jpg",
    codeLink: "https://github.com/MujtabaIT2002/software-company-template",
    demoLink: "https://software-company-template.vercel.app",
    caseStudy: {
      overview:
        "A professional web template built to help startups or software firms establish a clean digital presence quickly.",
      techStack: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
      problem:
        "Many startups struggle with creating modern, responsive websites that reflect their brand identity.",
      solution:
        "Designed a ready-to-deploy React template with smooth animations, responsive layouts, and customizable sections for service-based businesses.",
    },
  },

  {
    id: 9,
    title: "Smart Construction Model",
    category: "ai",
    description:
      "An intelligent real estate system integrating web development and ML for property cost estimation and recommendations.",
    image: "Smart_construction.jpg",
    codeLink: "https://github.com/MujtabaIT2002/Smart_Construction_Model",
    demoLink: "https://www.youtube.com/watch?v=QcEYbaHG06I",
    caseStudy: {
      overview:
        "A hybrid AI + web solution for real estate analytics — combining machine learning with fullstack development to predict costs and suggest investment areas.",
      techStack: [
        "React (Vite, Tailwind CSS)",
        "Node.js",
        "Flask",
        "Python (Scikit-learn)",
        "Prisma",
        "PostgreSQL",
      ],
      problem:
        "Manual cost estimation and site selection in real estate is unreliable and lacks data-driven insights.",
      solution:
        "Built a cross-integrated platform where AI models estimate costs and suggest locations while users interact through a clean React + Flask interface.",
    },
  },

  {
    id: 10,
    title: "Smart Construction Model — Web Interface",
    category: "fullstack",
    description:
      "A fullstack web interface for the Smart Construction Model, enabling real-time property analytics and AI integration.",
    image: "Smart_construction.jpg",
    codeLink: "https://github.com/MujtabaIT2002/Smart_Construction_Model",
    demoLink: "https://www.youtube.com/watch?v=QcEYbaHG06I",
    caseStudy: {
      overview:
        "The frontend system powering the Smart Construction Model’s interactive dashboard and data visualization layer.",
      techStack: ["React", "Node.js", "Flask", "Tailwind CSS"],
      problem:
        "AI-driven insights need intuitive dashboards to communicate data effectively to end-users.",
      solution:
        "Developed a fullstack React-based interface with Flask APIs, allowing seamless visualization of property cost predictions and comparisons.",
    },
  },
];

export default projects;
