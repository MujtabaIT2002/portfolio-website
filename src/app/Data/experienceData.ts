export interface ExperienceRole {
  id: number;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  bullets: string[];
}

const experience: ExperienceRole[] = [
  {
    id: 1,
    role: "Data Annotator",
    company: "Motive",
    location: "Islamabad, Pakistan",
    startDate: "Jan 2026",
    endDate: null,
    bullets: [
      "Annotate large-scale video datasets using bounding boxes for object detection, scene understanding, and motion tracking tasks.",
      "Perform frame-level quality checks to improve annotation consistency across dynamic visual scenes.",
      "Follow structured labeling guidelines to support computer vision model training and dataset reliability.",
      "Collaborate within a pod-based workflow to maintain annotation throughput, task accuracy, and SLA compliance.",
      "Designed an internal workflow optimization process to improve task allocation efficiency and overall pod performance.",
    ],
  },
  {
    id: 2,
    role: "AI Solutions Developer",
    company: "Rebiz (Oxiliry)",
    location: "Remote / Pakistan",
    startDate: "Jun 2025",
    endDate: "Sep 2025",
    bullets: [
      "Designed AI-driven automation systems for daily summaries, email organization, operational monitoring, and weekly reporting.",
      "Integrated external APIs including news feeds, uptime monitors, search sources, and Shopify Admin API into automated business workflows.",
      "Built a multi-source data pipeline combining Shopify data, search results, and local LLM inference for structured reporting.",
      "Developed competitor price matching, data normalization, and reporting logic for pricing intelligence use cases.",
      "Containerized automation workflows with Docker and exposed backend services through Flask REST APIs.",
      "Delivered dashboards and structured reports for compliance, pricing, and operational decision-making.",
    ],
  },
  {
    id: 3,
    role: "MERN Stack Developer",
    company: "Macro Soar",
    location: "Pakistan",
    startDate: "Mar 2025",
    endDate: "May 2025",
    bullets: [
      "Worked on ormo.ai, an AI-powered consultancy platform for consultant registration and custom AI chatbot deployment.",
      "Developed React.js interfaces for onboarding, consultant registration, chatbot setup, and user-facing workflows.",
      "Built and integrated Node.js and MongoDB backend services to manage users, consultancy sessions, and application data.",
      "Supported the organization's website, database operations, and day-to-day technical workflows.",
    ],
  },
  {
    id: 4,
    role: "Front-End Developer Intern",
    company: "Digital Empowerment",
    location: "Pakistan",
    startDate: "Sep 2024",
    endDate: "Feb 2025",
    bullets: [
      "Developed a React-based search engine using an external API with structured state management and reusable components.",
      "Used React hooks and Context API to manage global state, optimize data fetching, and improve application maintainability.",
      "Implemented dynamic form handling, controlled components, and client-side validation for user input workflows.",
    ],
  },
  {
    id: 5,
    role: "JavaScript Developer",
    company: "Insafdaar",
    location: "Pakistan",
    startDate: "Jul 2024",
    endDate: "Sep 2024",
    bullets: [
      "Led a small development team to design and deliver Google Workspace automation solutions.",
      "Developed Google Apps Script automations for Drive file management, Google Sheets workflows, Gmail alerts, and Calendar scheduling.",
      "Integrated third-party APIs with Google Apps Script to extend functionality across internal tools.",
      "Built dynamic web forms linked with Google Sheets for real-time data collection, tracking, and reporting.",
      "Automated repetitive administrative workflows, reducing manual effort and improving data consistency.",
    ],
  },
];

export default experience;
