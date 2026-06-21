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
  {
    id: 1,
    title: "Phi-3 Mini Marketing AI Assistant",
    category: "ai",
    description:
      "A fine-tuned Phi-3 Mini model using QLoRA to generate engaging ad copy, product descriptions, and social media captions efficiently.",
    image: "Marketing_chatbot.jpg",
    codeLink: "https://github.com/MujtabaIT2002/Marketing_bot",
    demoLink: "",
    caseStudy: {
      overview:
        "An AI-powered content generator that produces brand-consistent marketing material using Microsoft's Phi-3 Mini model fine-tuned with QLoRA on a curated 400-sample marketing dataset.",
      techStack: [
        "Python",
        "Hugging Face Transformers",
        "PEFT (QLoRA)",
        "4-bit NF4 Quantization",
        "CUDA",
      ],
      problem:
        "Manual content creation is repetitive and inconsistent, making it difficult for businesses to maintain brand tone and efficiency.",
      solution:
        "Applied 4-bit NF4 quantization, QLoRA, PEFT, gradient checkpointing, and paged AdamW to fine-tune Phi-3 Mini locally on a GTX 1650 4GB GPU, enabling small businesses to auto-generate creative, platform-specific marketing content with improved tone control and brand-specific phrasing.",
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
        "Solace Pixel is an AI-driven content automation system that converts simple text prompts and assets into complete, visually appealing Instagram posts. The system is currently used to manage the live Instagram account @solace.in.pixel, showcasing how AI can handle consistent brand aesthetics and scheduling.",
      techStack: ["Python", "Streamlit", "Cloudinary API", "Meta Graph API", "Pillow", "dotenv"],
      problem:
        "Content creators and small brands spend hours designing, captioning, and uploading posts manually — making it difficult to maintain a consistent posting schedule and brand tone.",
      solution:
        "Built an automated pipeline that takes text and images as input, generates stylized designs, crafts creative captions and hashtags, and uploads the posts directly to Instagram via the Meta Graph API. The live account @solace.in.pixel demonstrates the results generated entirely through this AI-powered workflow.",
    },
  },
  {
    id: 4,
    title: "Terminal-Based Daraz Scraper",
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
        "Built a CLI scraper that searches for items, extracts structured details (titles, prices, ratings, reviews, screenshots), and exports datasets in JSON format for market research and price comparison.",
    },
  },
  {
    id: 5,
    title: "Smart Construction Model",
    category: "fullstack",
    description:
      "An intelligent real estate system integrating web development and ML for construction cost estimation, society analysis, and property price prediction.",
    image: "Smart_construction.jpg",
    codeLink: "https://github.com/MujtabaIT2002/Smart_Construction_Model",
    demoLink: "https://www.youtube.com/watch?v=QcEYbaHG06I",
    caseStudy: {
      overview:
        "A hybrid AI + web solution for real estate analytics — combining machine learning with full-stack development to estimate construction costs, recommend societies, and predict house/plot price trends.",
      techStack: [
        "React.js",
        "Node.js",
        "Flask",
        "PostgreSQL",
        "Prisma",
        "XGBoost",
        "K-means",
        "KNN",
        "Google Maps API",
        "JWT",
      ],
      problem:
        "Manual cost estimation and site selection in real estate is unreliable and lacks data-driven insights.",
      solution:
        "Built a cost estimation module using area, material category, labor, and cost-tier inputs; a society search and recommendation system using Google Maps, geolocation data, K-means clustering, and KNN; and XGBoost-based prediction models for house and plot price trends — all behind secure JWT authentication, an admin panel, and a PostgreSQL database via Prisma ORM.",
    },
  },
  {
    id: 6,
    title: "Medical AI Assistant Bot",
    category: "ai",
    description:
      "An AI-powered medical assistant that collects symptoms, asks severity-based follow-up questions, and guides users toward relevant medical support and doctor recommendations.",
    image: "medical_assistant.jpg",
    codeLink: "",
    demoLink: "",
    caseStudy: {
      overview:
        "A practical healthcare assistant focused on symptom understanding, doctor matching, and user-friendly interaction, built with a structured triage-style conversation flow.",
      techStack: ["Python", "Web Scraping", "LLM Integration", "REST APIs", "Healthcare Automation"],
      problem:
        "Users often struggle to gauge how urgent a symptom is or which specialist to consult, especially without easy access to structured medical guidance.",
      solution:
        "Designed a triage-style conversation flow separating general guidance, urgent symptoms, and doctor recommendation scenarios, paired with a scraping workflow that collects top doctor data from Marham for doctor discovery and recommendation.",
    },
  },
  {
    id: 7,
    title: "X-ray Image Classification",
    category: "ai",
    description:
      "A web application for classifying X-ray images as Normal or COVID-19 using a computer vision and machine learning pipeline.",
    image: "xray.jpg",
    codeLink: "",
    demoLink: "",
    caseStudy: {
      overview:
        "A computer vision web app that classifies chest X-ray images, displaying model evaluation outputs including accuracy, confusion matrix, and ROC curve through the application interface.",
      techStack: ["Python", "Flask", "OpenCV", "Scikit-learn", "KNN"],
      problem:
        "Manually screening X-ray images for signs of COVID-19 is slow and depends heavily on specialist availability.",
      solution:
        "Preprocessed X-ray images with OpenCV (RGB-to-grayscale conversion, resizing, normalization) and trained a KNN classifier integrated into a Flask backend for real-time image classification.",
    },
  },
  {
    id: 8,
    title: "Prayer Time Calculation Engine",
    category: "fullstack",
    description:
      "A command-line prayer time engine that calculates Fajr, Dhuhr, Asr, Maghrib, and Isha timings from location-based inputs.",
    image: "prayer.jpg",
    codeLink: "",
    demoLink: "",
    caseStudy: {
      overview:
        "A lightweight CLI workflow for quick local prayer-time calculation without depending on external scraping services.",
      techStack: ["Node.js", "Python", "CLI Development", "Astronomical Algorithms"],
      problem:
        "Many prayer time tools rely on external APIs or scraping, which can be slow or unreliable for quick local use.",
      solution:
        "Implemented astronomical calculations including solar declination, equation of time, solar noon, hour angles, and angle-based prayer rules to compute accurate timings entirely offline.",
    },
  },
];

export default projects;
