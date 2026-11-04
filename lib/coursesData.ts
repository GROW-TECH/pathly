/** Course and learning mock data */

export interface CourseItem {
  id: string;
  title: string;
  provider: string;
  rating: number;
  reviewCount: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: string;
  category: string;
  skills: string[];
  description: string;
  thumbnail?: string;
  modules: CourseModule[];
  whatYouLearn: string[];
  isEnrolled?: boolean;
  progress?: number;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: number;
  isCompleted?: boolean;
}

export const COURSE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "webdev", label: "WebDev" },
  { id: "data", label: "Data" },
  { id: "design", label: "Design" },
  { id: "softskills", label: "Soft Skills" },
  { id: "mobile", label: "Mobile" },
  { id: "cloud", label: "Cloud" },
  { id: "government", label: "Govt Exam" },
];

export const COURSES_DATA: CourseItem[] = [
  {
    id: "course-1",
    title: "Web Development Bootcamp",
    provider: "Pathly Academy",
    rating: 4.8,
    reviewCount: 2340,
    duration: "12h 30m",
    level: "Beginner",
    price: "Free",
    category: "webdev",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    description:
      "Master the fundamentals of modern web development from HTML and CSS to JavaScript and React. Build real-world projects and deploy your first web application.",
    modules: [
      { id: "m1", title: "Introduction to Web Development", duration: "45m", lessons: 5, isCompleted: true },
      { id: "m2", title: "HTML & CSS Basics", duration: "2h 15m", lessons: 12, isCompleted: true },
      { id: "m3", title: "JavaScript Fundamentals", duration: "3h 30m", lessons: 18 },
      { id: "m4", title: "Building with React", duration: "4h", lessons: 15 },
      { id: "m5", title: "Responsive Design & Deployment", duration: "2h", lessons: 8 },
    ],
    whatYouLearn: [
      "HTML, CSS, JavaScript fundamentals",
      "React & popular framework basics",
      "Build responsive layouts",
      "TypeScript (optional but useful)",
      "UX/UI basics",
      "Git & Demo",
    ],
    isEnrolled: true,
    progress: 35,
  },
  {
    id: "course-2",
    title: "Python for Data Analysis",
    provider: "DataCamp",
    rating: 4.6,
    reviewCount: 1890,
    duration: "10h 15m",
    level: "Beginner",
    price: "₹499",
    category: "data",
    skills: ["Python", "Pandas", "NumPy", "Data Analysis"],
    description:
      "Learn Python programming for data analysis. Explore data manipulation with Pandas, numerical computation with NumPy, and create data visualizations.",
    modules: [
      { id: "m1", title: "Python Basics", duration: "2h", lessons: 10 },
      { id: "m2", title: "Working with Pandas", duration: "3h", lessons: 14 },
      { id: "m3", title: "NumPy Essentials", duration: "2h 30m", lessons: 12 },
      { id: "m4", title: "Data Visualization", duration: "2h 45m", lessons: 10 },
    ],
    whatYouLearn: [
      "Python programming fundamentals",
      "Data manipulation with Pandas",
      "Numerical computation with NumPy",
      "Create compelling data visualizations",
    ],
  },
  {
    id: "course-3",
    title: "UX/UI Design Fundamentals",
    provider: "Design Academy",
    rating: 4.7,
    reviewCount: 1230,
    duration: "8h 45m",
    level: "Beginner",
    price: "₹399",
    category: "design",
    skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
    description:
      "Understand user experience design principles, learn to use Figma for creating beautiful interfaces, and build interactive prototypes.",
    modules: [
      { id: "m1", title: "Introduction to UX/UI", duration: "1h 30m", lessons: 8 },
      { id: "m2", title: "User Research Methods", duration: "2h", lessons: 10 },
      { id: "m3", title: "Figma Mastery", duration: "3h 15m", lessons: 15 },
      { id: "m4", title: "Prototyping & Testing", duration: "2h", lessons: 8 },
    ],
    whatYouLearn: [
      "User experience principles",
      "Wireframing and prototyping",
      "Figma design tool mastery",
      "User testing methodologies",
    ],
  },
  {
    id: "course-4",
    title: "Full Stack Developer Path",
    provider: "Pathly Academy",
    rating: 4.9,
    reviewCount: 3200,
    duration: "40h",
    level: "Intermediate",
    price: "₹1,999",
    category: "webdev",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "Next.js"],
    description:
      "Become a full-stack developer. Master frontend with React/Next.js, build backend APIs with Node.js, and work with MongoDB databases.",
    modules: [
      { id: "m1", title: "Advanced React Patterns", duration: "5h", lessons: 20 },
      { id: "m2", title: "Next.js & Server Components", duration: "6h", lessons: 18 },
      { id: "m3", title: "Node.js & Express APIs", duration: "8h", lessons: 25 },
      { id: "m4", title: "MongoDB & Database Design", duration: "6h", lessons: 15 },
      { id: "m5", title: "Authentication & Deployment", duration: "5h", lessons: 12 },
      { id: "m6", title: "Capstone Project", duration: "10h", lessons: 5 },
    ],
    whatYouLearn: [
      "Advanced React & Next.js patterns",
      "RESTful API design with Node.js",
      "MongoDB database design",
      "Authentication & authorization",
      "CI/CD and deployment",
    ],
  },
  {
    id: "course-5",
    title: "Communication & Soft Skills",
    provider: "SkillUp India",
    rating: 4.5,
    reviewCount: 980,
    duration: "6h",
    level: "Beginner",
    price: "Free",
    category: "softskills",
    skills: ["Communication", "Leadership", "Teamwork", "Problem Solving"],
    description:
      "Develop essential workplace soft skills. Learn effective communication, leadership principles, and collaborative problem-solving techniques.",
    modules: [
      { id: "m1", title: "Effective Communication", duration: "2h", lessons: 10 },
      { id: "m2", title: "Leadership Foundations", duration: "2h", lessons: 8 },
      { id: "m3", title: "Teamwork & Collaboration", duration: "2h", lessons: 8 },
    ],
    whatYouLearn: [
      "Clear professional communication",
      "Leadership and initiative",
      "Team collaboration strategies",
      "Problem-solving frameworks",
    ],
    isEnrolled: true,
    progress: 70,
  },
  {
    id: "course-6",
    title: "React Native Mobile Development",
    provider: "AppDev Pro",
    rating: 4.6,
    reviewCount: 756,
    duration: "15h",
    level: "Intermediate",
    price: "₹899",
    category: "mobile",
    skills: ["React Native", "JavaScript", "Mobile UI", "API Integration"],
    description:
      "Build cross-platform mobile apps with React Native. Create beautiful native experiences for iOS and Android from a single codebase.",
    modules: [
      { id: "m1", title: "React Native Basics", duration: "3h", lessons: 12 },
      { id: "m2", title: "Navigation & State", duration: "4h", lessons: 15 },
      { id: "m3", title: "Native APIs & Modules", duration: "4h", lessons: 12 },
      { id: "m4", title: "Publishing Your App", duration: "4h", lessons: 10 },
    ],
    whatYouLearn: [
      "React Native fundamentals",
      "Cross-platform mobile development",
      "Native device APIs",
      "App store publishing",
    ],
  },
  {
    id: "course-7",
    title: "TNPSC Group 4 Complete Preparation",
    provider: "GovtExam Academy",
    rating: 4.4,
    reviewCount: 4500,
    duration: "50h",
    level: "Beginner",
    price: "₹799",
    category: "government",
    skills: ["General Studies", "Tamil", "Aptitude", "Current Affairs"],
    description:
      "Complete preparation guide for TNPSC Group 4 exam. Covers all subjects including General Studies, Tamil, Aptitude, and Current Affairs with practice tests.",
    modules: [
      { id: "m1", title: "General Studies – History", duration: "8h", lessons: 30 },
      { id: "m2", title: "General Studies – Geography", duration: "6h", lessons: 20 },
      { id: "m3", title: "General Studies – Polity", duration: "6h", lessons: 20 },
      { id: "m4", title: "Tamil Language", duration: "10h", lessons: 25 },
      { id: "m5", title: "Aptitude & Reasoning", duration: "10h", lessons: 30 },
      { id: "m6", title: "Current Affairs & Practice Tests", duration: "10h", lessons: 40 },
    ],
    whatYouLearn: [
      "Complete TNPSC Group 4 syllabus",
      "Tamil literature and grammar",
      "Quantitative aptitude techniques",
      "Current affairs analysis",
      "Mock test strategies",
    ],
  },
];

export function getCourseById(id: string): CourseItem | undefined {
  return COURSES_DATA.find((c) => c.id === id);
}

export function getCoursesByCategory(category: string): CourseItem[] {
  if (category === "all") return COURSES_DATA;
  return COURSES_DATA.filter((c) => c.category === category);
}

export function getEnrolledCourses(): CourseItem[] {
  return COURSES_DATA.filter((c) => c.isEnrolled);
}

export function getRecommendedCourses(): CourseItem[] {
  return COURSES_DATA.filter((c) => !c.isEnrolled).slice(0, 4);
}
