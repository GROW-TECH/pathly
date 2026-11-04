export interface CareerItem {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  type: "Government" | "Private" | "Banking" | "Healthcare" | "Education" | "Engineering" | "IT" | "Finance" | "Skilled" | "Defence" | "Railways" | "Business" | "Creative" | "Law" | "Logistics" | "Agriculture" | "Marketing" | "Sales";
  icon: string;
  keywords: string[];
  description: string;
  tags: string[];
  interestIds: string[];
}

export interface InterestOption {
  id: string;
  name: string;
  iconName: string;
}

export interface SkillOption {
  id: string;
  name: string;
  category: string;
  keywords: string[];
}

export const USER_INTEREST_OPTIONS: InterestOption[] = [
  { id: "government", name: "Government & Public Service", iconName: "Landmark" },
  { id: "technology", name: "Technology", iconName: "Laptop" },
  { id: "healthcare", name: "Healthcare", iconName: "HeartPulse" },
  { id: "education", name: "Education", iconName: "GraduationCap" },
  { id: "finance", name: "Finance & Banking", iconName: "Coins" },
  { id: "business", name: "Business & Management", iconName: "Briefcase" },
  { id: "engineering", name: "Engineering", iconName: "Cog" },
  { id: "design", name: "Design & Creative", iconName: "Palette" },
  { id: "marketing", name: "Marketing", iconName: "Megaphone" },
  { id: "sales", name: "Sales", iconName: "TrendingUp" },
  { id: "law", name: "Law", iconName: "Scale" },
  { id: "media", name: "Media & Communication", iconName: "Mic" },
  { id: "hospitality", name: "Hospitality", iconName: "Coffee" },
  { id: "manufacturing", name: "Manufacturing", iconName: "Factory" },
  { id: "agriculture", name: "Agriculture", iconName: "Sprout" },
  { id: "defence", name: "Defence & Public Safety", iconName: "Shield" },
  { id: "skilled", name: "Skilled & Technical Work", iconName: "Wrench" },
  { id: "logistics", name: "Logistics & Transport", iconName: "Truck" },
];

export const INITIAL_SUGGESTED_SKILLS: string[] = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teaching",
  "Management",
  "Customer Service",
  "Accounting",
  "Digital Skills",
];

export interface SkillCategoryExplore {
  id: string;
  name: string;
  iconName: string;
  color: string;
}

export const SKILL_EXPLORE_CATEGORIES: SkillCategoryExplore[] = [
  { id: "all", name: "All Skills", iconName: "Sparkles", color: "#635BFF" },
  { id: "people", name: "People", iconName: "Users", color: "#3B82F6" },
  { id: "business", name: "Business", iconName: "Briefcase", color: "#0EA5E9" },
  { id: "technical", name: "Technical", iconName: "Laptop", color: "#8B5CF6" },
  { id: "creative", name: "Creative", iconName: "Palette", color: "#EC4899" },
  { id: "healthcare", name: "Healthcare", iconName: "HeartPulse", color: "#EF4444" },
  { id: "government", name: "Government", iconName: "Landmark", color: "#6366F1" },
  { id: "education", name: "Education", iconName: "GraduationCap", color: "#A855F7" },
];

export interface SkillTheme {
  bg: string;
  text: string;
  border: string;
  accent: string;
}

export const SKILL_THEMES: Record<string, SkillTheme> = {
  education: { bg: "#FAF5FF", text: "#7E22CE", border: "#E9D5FF", accent: "#9333EA" },
  people: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", accent: "#2563EB" },
  communication: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0", accent: "#16A34A" },
  problem: { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA", accent: "#EA580C" },
  healthcare: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3", accent: "#E11D48" },
  finance: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A", accent: "#D97706" },
  government: { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE", accent: "#6366F1" },
  creative: { bg: "#FDF2F8", text: "#BE185D", border: "#FBCFE8", accent: "#DB2777" },
  technical: { bg: "#ECFEFF", text: "#0E7490", border: "#A5F3FC", accent: "#0891B2" },
  default: { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE", accent: "#635BFF" }
};

export function getSkillTheme(skillName: string): SkillTheme {
  const name = skillName.toLowerCase();
  if (name.includes("teach") || name.includes("mentor") || name.includes("class") || name.includes("lesson") || name.includes("train")) {
    return SKILL_THEMES.education;
  }
  if (name.includes("lead") || name.includes("team") || name.includes("manage") || name.includes("people")) {
    return SKILL_THEMES.people;
  }
  if (name.includes("comm") || name.includes("speaking") || name.includes("present") || name.includes("writing")) {
    return SKILL_THEMES.communication;
  }
  if (name.includes("prob") || name.includes("analytical") || name.includes("critical") || name.includes("logic")) {
    return SKILL_THEMES.problem;
  }
  if (name.includes("health") || name.includes("patient") || name.includes("medic") || name.includes("clinic") || name.includes("nurse")) {
    return SKILL_THEMES.healthcare;
  }
  if (name.includes("account") || name.includes("financ") || name.includes("tax") || name.includes("bookkeep") || name.includes("bank")) {
    return SKILL_THEMES.finance;
  }
  if (name.includes("govt") || name.includes("admin") || name.includes("civil") || name.includes("public") || name.includes("general knowledge")) {
    return SKILL_THEMES.government;
  }
  if (name.includes("design") || name.includes("figma") || name.includes("creative") || name.includes("visual")) {
    return SKILL_THEMES.creative;
  }
  if (name.includes("comp") || name.includes("prog") || name.includes("code") || name.includes("data") || name.includes("digital") || name.includes("tech")) {
    return SKILL_THEMES.technical;
  }
  return SKILL_THEMES.default;
}

export function getSkillsByCategory(category: string): string[] {
  switch (category) {
    case "people":
      return ["Communication", "Leadership", "Teamwork", "Customer Service", "Mentoring", "Public Speaking"];
    case "business":
      return ["Management", "Project Management", "Sales & Negotiation", "Customer Service", "Business Planning"];
    case "technical":
      return ["Computer Skills", "Programming", "Data Analysis", "Digital Literacy", "Technical Skills"];
    case "creative":
      return ["UI & Graphic Design", "Content Writing", "Creative Direction", "Digital Media", "Video Editing"];
    case "healthcare":
      return ["Patient Care", "Medical Knowledge", "Clinical Skills", "Communication", "Teamwork"];
    case "government":
      return ["Public Administration", "General Knowledge", "Communication", "Leadership", "Problem Solving"];
    case "education":
      return ["Teaching", "Mentoring", "Classroom Management", "Training", "Communication"];
    default:
      return INITIAL_SUGGESTED_SKILLS;
  }
}


export function getSuggestedSkillsForInterests(selectedInterestIds: string[]): string[] {
  if (!selectedInterestIds || selectedInterestIds.length === 0) {
    return INITIAL_SUGGESTED_SKILLS;
  }

  const pool: string[] = [];

  if (selectedInterestIds.includes("healthcare")) {
    pool.push("Patient Care", "Communication", "Medical Knowledge", "Teamwork", "Problem Solving");
  }
  if (selectedInterestIds.includes("education")) {
    pool.push("Teaching", "Communication", "Mentoring", "Classroom Management", "Leadership");
  }
  if (selectedInterestIds.includes("finance")) {
    pool.push("Accounting", "Financial Accounting", "Data Analysis", "Taxation", "Communication");
  }
  if (selectedInterestIds.includes("technology")) {
    pool.push("Computer Skills", "Programming", "Data Analysis", "Problem Solving", "Digital Literacy");
  }
  if (selectedInterestIds.includes("government")) {
    pool.push("Public Administration", "Communication", "General Knowledge", "Leadership", "Problem Solving");
  }
  if (selectedInterestIds.includes("business") || selectedInterestIds.includes("management")) {
    pool.push("Management", "Leadership", "Project Management", "Communication", "Problem Solving");
  }
  if (selectedInterestIds.includes("sales") || selectedInterestIds.includes("marketing")) {
    pool.push("Sales & Negotiation", "Communication", "Content Writing", "Customer Service");
  }
  if (selectedInterestIds.includes("engineering") || selectedInterestIds.includes("skilled")) {
    pool.push("Technical Skills", "Problem Solving", "Project Management", "Computer Skills");
  }

  // Deduplicate and fill to at least 6-8 items
  const uniquePool = Array.from(new Set(pool));
  for (const fallback of INITIAL_SUGGESTED_SKILLS) {
    if (uniquePool.length >= 8) break;
    if (!uniquePool.includes(fallback)) {
      uniquePool.push(fallback);
    }
  }

  return uniquePool.slice(0, 8);
}


export const ALL_CAREERS: CareerItem[] = [
  // GOVERNMENT & STATE EXAMS
  {
    id: "tnpsc-grp4",
    title: "TNPSC Group 4 (VAO / Junior Assistant)",
    category: "Government & Public Service",
    subCategory: "State Public Service Commission",
    type: "Government",
    icon: "🏛️",
    keywords: ["tnpsc", "tamil nadu", "vao", "village administrative officer", "junior assistant", "group 4", "gov exam", "clerk", "typist"],
    description: "State civil administration and village governance roles across Tamil Nadu.",
    tags: ["Government", "TNPSC", "State Exam"],
    interestIds: ["government", "social"]
  },
  {
    id: "tnpsc-grp2",
    title: "TNPSC Group 2 & 2A (Sub-Registrar / Municipal Commissioner)",
    category: "Government & Public Service",
    subCategory: "State Administrative Services",
    type: "Government",
    icon: "🏛️",
    keywords: ["tnpsc", "group 2", "group 2a", "sub registrar", "revenue", "municipal commissioner", "executive officer", "tnpsc exam"],
    description: "Mid-tier executive and administrative positions in Tamil Nadu state government.",
    tags: ["Government", "Executive", "TNPSC"],
    interestIds: ["government", "law"]
  },
  {
    id: "tnpsc-grp1",
    title: "TNPSC Group 1 (Deputy Collector / DSP)",
    category: "Government & Public Service",
    subCategory: "Top State Civil Services",
    type: "Government",
    icon: "🏛️",
    keywords: ["tnpsc", "group 1", "deputy collector", "dsp", "district registrar", "bdo", "top civil services", "state officer"],
    description: "Premier state administrative and law enforcement leadership positions.",
    tags: ["Government", "Gazetted Officer", "TNPSC"],
    interestIds: ["government", "defence"]
  },
  {
    id: "upsc-cse",
    title: "UPSC Civil Services (IAS / IPS / IFS / IRS)",
    category: "Government & Public Service",
    subCategory: "Union Public Service Commission",
    type: "Government",
    icon: "🏛️",
    keywords: ["upsc", "civil services", "ias", "ips", "ifs", "irs", "collector", "district magistrate", "all india services"],
    description: "Top central government and all-India civil administration services.",
    tags: ["Central Govt", "Civil Services", "UPSC"],
    interestIds: ["government", "law", "defence"]
  },
  {
    id: "ssc-cgl",
    title: "SSC CGL (Income Tax Inspector / ASO / Central Excise)",
    category: "Government & Public Service",
    subCategory: "Staff Selection Commission",
    type: "Government",
    icon: "🏛️",
    keywords: ["ssc", "cgl", "staff selection", "income tax inspector", "aso", "central excise", "cbi inspector", "customs", "central govt"],
    description: "Group B and C executive appointments across ministries and central departments.",
    tags: ["Central Govt", "SSC", "Inspector"],
    interestIds: ["government", "finance"]
  },

  // EDUCATION & TEACHING
  {
    id: "govt-teacher",
    title: "Government School Teacher (TET / TRB)",
    category: "Education",
    subCategory: "State & Central Schools",
    type: "Education",
    icon: "🎓",
    keywords: ["teacher", "govt teacher", "government teacher", "trb", "tet", "samagra shiksha", "school teacher", "b.ed", "d.ted"],
    description: "Primary and secondary educators across government schools with state certification.",
    tags: ["Education", "Government", "TRB / TET"],
    interestIds: ["education", "government"]
  },
  {
    id: "school-teacher",
    title: "School Teacher (Primary / TGT / PGT)",
    category: "Education",
    subCategory: "CBSE / Matriculation / ICSE",
    type: "Education",
    icon: "🎓",
    keywords: ["teacher", "school teacher", "primary teacher", "tgt teacher", "pgt teacher", "cbse teacher", "private school teacher", "subject teacher"],
    description: "Classroom instruction, curriculum design, student assessment, and academic mentoring.",
    tags: ["Education", "Teaching", "Schools"],
    interestIds: ["education"]
  },
  {
    id: "education-coordinator",
    title: "Education Coordinator & Academic Trainer",
    category: "Education",
    subCategory: "Curriculum & Training",
    type: "Education",
    icon: "📚",
    keywords: ["trainer", "academic coordinator", "curriculum designer", "educational consultant", "tutor", "training manager"],
    description: "Curriculum planning, educator training, instructional design, and student learning programs.",
    tags: ["Education", "Training", "Coordination"],
    interestIds: ["education", "business"]
  },

  // FINANCE & BANKING
  {
    id: "bank-po",
    title: "Bank Probationary Officer (SBI PO / IBPS PO)",
    category: "Finance & Banking",
    subCategory: "Public & Private Sector Banks",
    type: "Banking",
    icon: "🏦",
    keywords: ["bank", "bank po", "probationary officer", "sbi po", "ibps po", "banking exam", "scale 1 officer", "bank manager"],
    description: "Assistant managerial and operations lead role across commercial banks.",
    tags: ["Banking", "Officer", "Finance"],
    interestIds: ["finance", "business"]
  },
  {
    id: "accountant",
    title: "Accountant / Accounts Executive",
    category: "Finance & Banking",
    subCategory: "Corporate Accounting",
    type: "Finance",
    icon: "📑",
    keywords: ["accountant", "accounts executive", "senior accountant", "tally", "gst", "bookkeeping", "payroll", "junior accountant"],
    description: "Day-to-day balance sheets, ledger entries, GST filing, and invoicing management.",
    tags: ["Finance", "Corporate", "Accounts"],
    interestIds: ["finance", "business"]
  },
  {
    id: "financial-analyst",
    title: "Financial Analyst / Investment Specialist",
    category: "Finance & Banking",
    subCategory: "Investment & Corporate Finance",
    type: "Finance",
    icon: "📈",
    keywords: ["financial analyst", "investment analyst", "equity research", "valuation", "portfolio manager", "fintech", "wealth manager"],
    description: "Financial modeling, market forecasts, risk assessment, and investment strategies.",
    tags: ["Finance", "Analytics", "Corporate"],
    interestIds: ["finance", "business", "technology"]
  },

  // HEALTHCARE
  {
    id: "staff-nurse",
    title: "Staff Nurse / Registered Nurse (RN)",
    category: "Healthcare",
    subCategory: "Clinical Nursing Care",
    type: "Healthcare",
    icon: "🩺",
    keywords: ["nurse", "staff nurse", "registered nurse", "clinical nurse", "icu nurse", "hospital nurse", "gnm", "b.sc nursing"],
    description: "Patient care, clinical monitoring, medication administration, and emergency assistance.",
    tags: ["Healthcare", "Hospital", "Clinical"],
    interestIds: ["healthcare"]
  },
  {
    id: "healthcare-admin",
    title: "Healthcare Administrator & Hospital Coordinator",
    category: "Healthcare",
    subCategory: "Hospital Operations",
    type: "Healthcare",
    icon: "🏥",
    keywords: ["healthcare admin", "hospital manager", "health coordinator", "clinical administrator", "medical superintendent"],
    description: "Hospital administration, clinical workflows, patient services, and regulatory compliance.",
    tags: ["Healthcare", "Management", "Operations"],
    interestIds: ["healthcare", "business"]
  },
  {
    id: "medical-representative",
    title: "Medical Representative & Pharma Associate",
    category: "Healthcare",
    subCategory: "Pharma & Clinical Sales",
    type: "Healthcare",
    icon: "💊",
    keywords: ["medical representative", "mr", "pharma sales", "clinical coordinator", "drug representative"],
    description: "Product education with healthcare professionals, pharma distribution, and clinical liaison.",
    tags: ["Healthcare", "Sales", "Pharma"],
    interestIds: ["healthcare", "sales", "marketing"]
  },

  // TECHNOLOGY
  {
    id: "software-developer",
    title: "Software Developer / Engineer",
    category: "Technology",
    subCategory: "Software Engineering",
    type: "IT",
    icon: "💻",
    keywords: ["software developer", "software engineer", "programmer", "coder", "sde", "java", "python", "application developer"],
    description: "Building scalable backend, frontend, algorithms, and application architectures.",
    tags: ["IT", "Engineering", "Software"],
    interestIds: ["technology", "engineering"]
  },
  {
    id: "data-analyst",
    title: "Data Analyst & Business Intelligence (BI)",
    category: "Technology",
    subCategory: "Data & Insights",
    type: "IT",
    icon: "📊",
    keywords: ["data analyst", "business analyst", "sql", "power bi", "tableau", "excel", "data analytics", "python data"],
    description: "Data warehousing, query analysis, executive dashboards, and KPI forecasting.",
    tags: ["IT", "Analytics", "Data"],
    interestIds: ["technology", "business", "finance"]
  },
  {
    id: "it-support-specialist",
    title: "IT Support Specialist & Systems Administrator",
    category: "Technology",
    subCategory: "Infrastructure & Support",
    type: "IT",
    icon: "🖥️",
    keywords: ["it support", "system admin", "network admin", "hardware", "helpdesk", "troubleshooting", "it technician"],
    description: "Network configuration, system maintenance, employee tech support, and server monitoring.",
    tags: ["IT", "Support", "Infrastructure"],
    interestIds: ["technology", "skilled"]
  },

  // BUSINESS & MANAGEMENT
  {
    id: "business-operations-lead",
    title: "Operations Manager & Business Associate",
    category: "Business & Management",
    subCategory: "Operations Management",
    type: "Business",
    icon: "💼",
    keywords: ["operations", "business associate", "operations manager", "team lead", "process manager"],
    description: "Workflow optimization, KPI tracking, vendor coordination, and team management.",
    tags: ["Business", "Operations", "Management"],
    interestIds: ["business"]
  },
  {
    id: "hr-manager",
    title: "HR Executive / Talent Acquisition Lead",
    category: "Business & Management",
    subCategory: "Human Resources",
    type: "Business",
    icon: "👥",
    keywords: ["hr", "hr manager", "talent acquisition", "recruiter", "human resources", "payroll", "employee relations"],
    description: "Talent recruitment, onboarding pipelines, performance appraisal, and workplace policy.",
    tags: ["Business", "HR", "Corporate"],
    interestIds: ["business"]
  },

  // MARKETING & SALES
  {
    id: "digital-marketer",
    title: "Digital Marketing Specialist & SEO Lead",
    category: "Marketing",
    subCategory: "Growth & Online Advertising",
    type: "Marketing",
    icon: "📢",
    keywords: ["marketing", "digital marketing", "seo", "social media manager", "performance marketing", "google ads"],
    description: "Paid advertising campaigns, organic search optimization, social branding, and customer funnels.",
    tags: ["Marketing", "Digital", "Growth"],
    interestIds: ["marketing", "media"]
  },
  {
    id: "sales-executive",
    title: "Sales Executive / Business Development Representative",
    category: "Sales",
    subCategory: "Revenue & Client Acquisition",
    type: "Sales",
    icon: "🤝",
    keywords: ["sales", "sales executive", "bdr", "b2b sales", "business development", "field sales", "client relationship"],
    description: "Lead prospecting, product demonstrations, client deal closing, and revenue generation.",
    tags: ["Sales", "Commercial", "Revenue"],
    interestIds: ["sales", "business"]
  },

  // ENGINEERING & MANUFACTURING
  {
    id: "civil-engineer",
    title: "Civil Engineer & Site Supervisor",
    category: "Engineering",
    subCategory: "Infrastructure & Construction",
    type: "Engineering",
    icon: "🏗️",
    keywords: ["civil engineer", "civil", "construction", "site engineer", "autocad", "structural engineer", "pwd"],
    description: "Structural design, site supervision, material estimation, and building infrastructure.",
    tags: ["Engineering", "Construction", "Core"],
    interestIds: ["engineering"]
  },
  {
    id: "mechanical-engineer",
    title: "Mechanical Engineer & Plant Supervisor",
    category: "Engineering",
    subCategory: "Manufacturing & CAD/CAM",
    type: "Engineering",
    icon: "⚙️",
    keywords: ["mechanical engineer", "mechanical", "production", "maintenance", "solidworks", "automotive", "manufacturing"],
    description: "Mechanical assembly, plant maintenance, CAD component modeling, and quality systems.",
    tags: ["Engineering", "Manufacturing", "Core"],
    interestIds: ["engineering", "manufacturing"]
  },

  // DEFENCE & LAW
  {
    id: "police-sub-inspector",
    title: "Police Sub-Inspector / Constable (TNUSRB)",
    category: "Defence & Public Safety",
    subCategory: "State Police Services",
    type: "Defence",
    icon: "👮",
    keywords: ["police", "sub inspector", "constable", "tnusrb", "law and order", "cops", "police exam", "si exam"],
    description: "Public safety maintenance, crime investigation, vigilance, and community security.",
    tags: ["Government", "Police", "Law Enforcement"],
    interestIds: ["defence", "government", "law"]
  },
  {
    id: "advocate-legal-advisor",
    title: "Lawyer / Legal Advisor & Corporate Counsel",
    category: "Law",
    subCategory: "Legal Practice & Compliance",
    type: "Law",
    icon: "⚖️",
    keywords: ["lawyer", "advocate", "legal advisor", "corporate counsel", "bar council", "llb", "judiciary", "civil judge"],
    description: "Litigation handling, contract drafting, corporate compliance, and legal arbitration.",
    tags: ["Law", "Legal", "Professional"],
    interestIds: ["law", "government"]
  },

  // SKILLED TRADES & LOGISTICS
  {
    id: "electrician-tech",
    title: "Electrician / Electrical Technician (ITI)",
    category: "Skilled & Technical Work",
    subCategory: "Wiring & Power Systems",
    type: "Skilled",
    icon: "⚡",
    keywords: ["electrician", "wiring", "iti electrician", "panel board", "commercial electrician", "maintenance"],
    description: "Domestic and industrial circuit wiring, appliance repairs, solar inverter setup, and power diagnostics.",
    tags: ["Skilled", "Vocational", "Hands-on"],
    interestIds: ["skilled", "engineering"]
  },
  {
    id: "logistics-coordinator",
    title: "Supply Chain & Logistics Coordinator",
    category: "Logistics & Transport",
    subCategory: "Transport & Warehouse Operations",
    type: "Logistics",
    icon: "🚚",
    keywords: ["logistics", "supply chain", "warehouse", "fleet manager", "inventory coordinator", "freight"],
    description: "Fleet tracking, warehouse inventory, freight coordination, and dispatch management.",
    tags: ["Logistics", "Operations", "Transport"],
    interestIds: ["logistics", "business"]
  },
  {
    id: "agriculture-officer",
    title: "Agricultural Officer & Farm Consultant",
    category: "Agriculture",
    subCategory: "Agronomy & Rural Extension",
    type: "Agriculture",
    icon: "🌾",
    keywords: ["agriculture", "agri officer", "bsc agri", "farming technology", "horticulture", "rural development"],
    description: "Crop yield optimization, soil testing advisory, state subsidy extension, and farm management.",
    tags: ["Agriculture", "Government", "Sciences"],
    interestIds: ["agriculture", "government"]
  }
];

export const ALL_SKILLS_DATABASE: SkillOption[] = [
  { id: "comm", name: "Communication", category: "Core", keywords: ["comm", "verbal", "written", "presentation", "english", "speaking"] },
  { id: "lead", name: "Leadership", category: "Management", keywords: ["lead", "leadership", "team lead", "guidance", "supervision", "people management"] },
  { id: "prob", name: "Problem Solving", category: "Core", keywords: ["problem", "problem solving", "analytical", "critical thinking", "logic", "analytical thinking"] },
  { id: "teach", name: "Teaching", category: "Education", keywords: ["teach", "teaching", "tutor", "instructor", "pedagogy", "lesson planning"] },
  { id: "train", name: "Training", category: "Education", keywords: ["teach", "training", "coach", "workshop", "corporate trainer"] },
  { id: "class-mgt", name: "Classroom Management", category: "Education", keywords: ["teach", "classroom", "school", "students", "curriculum"] },
  { id: "mentor", name: "Mentoring", category: "Education", keywords: ["teach", "mentor", "guidance", "counseling"] },
  { id: "manage", name: "Management", category: "Operations", keywords: ["manage", "management", "operations", "administration", "planning", "people management"] },
  { id: "cust", name: "Customer Service", category: "Commercial", keywords: ["cust", "customer", "client", "support", "helpdesk", "relations"] },
  { id: "acct", name: "Accounting", category: "Finance", keywords: ["account", "accounting", "tally", "gst", "ledger", "balance sheet"] },
  { id: "fin-acct", name: "Financial Accounting", category: "Finance", keywords: ["account", "financial", "auditing", "taxation", "reporting", "financial analysis"] },
  { id: "bookkeeping", name: "Bookkeeping", category: "Finance", keywords: ["account", "bookkeeping", "invoicing", "payroll", "cashflow"] },
  { id: "tax-acct", name: "Taxation", category: "Finance", keywords: ["account", "tax", "gst", "income tax", "compliance", "taxation"] },
  { id: "comp", name: "Computer Skills", category: "Digital", keywords: ["computer", "pc", "typing", "ms office", "excel", "software"] },
  { id: "dig-lit", name: "Digital Literacy", category: "Digital", keywords: ["computer", "digital", "internet", "cloud", "online tools", "digital skills"] },
  { id: "prog", name: "Programming", category: "Digital", keywords: ["computer", "programming", "coding", "python", "javascript", "java", "c++", "software"] },
  { id: "data-an", name: "Data Analysis", category: "Digital", keywords: ["computer", "data", "sql", "power bi", "analytics", "statistics"] },
  { id: "write", name: "Content Writing", category: "Creative", keywords: ["write", "writing", "copywriting", "drafting", "documentation"] },
  { id: "design", name: "UI & Graphic Design", category: "Creative", keywords: ["design", "ui", "ux", "figma", "photoshop", "visual", "creative"] },
  { id: "sales", name: "Sales & Negotiation", category: "Commercial", keywords: ["sales", "selling", "b2b", "pitching", "deal closing"] },
  { id: "proj-mgt", name: "Project Management", category: "Management", keywords: ["project", "scrum", "agile", "delivery", "milestones", "timeline"] },
  { id: "health-care", name: "Patient Care", category: "Healthcare", keywords: ["health", "nurse", "patient", "clinical", "hospital", "first aid", "patient care", "medical knowledge"] },
  { id: "med-know", name: "Medical Knowledge", category: "Healthcare", keywords: ["health", "medical", "clinical", "pharma", "anatomy", "clinical skills"] },
  { id: "teamwork", name: "Teamwork", category: "Core", keywords: ["team", "collaboration", "teamwork", "cooperation"] },
  { id: "pub-admin", name: "Public Administration", category: "Government", keywords: ["govt", "public administration", "governance", "policy", "civil service"] },
  { id: "gen-study", name: "General Knowledge", category: "Government", keywords: ["govt", "gk", "general studies", "current affairs", "general knowledge", "aptitude", "tnpsc"] },
  { id: "tech-repair", name: "Technical Skills", category: "Engineering", keywords: ["tech", "tools", "repair", "hardware", "machinery", "electronics", "technical skills"] }
];

export function filterSkillsByQuery(query: string): SkillOption[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return ALL_SKILLS_DATABASE.filter((s) => INITIAL_SUGGESTED_SKILLS.includes(s.name));
  }
  return ALL_SKILLS_DATABASE.filter((skill) => {
    if (skill.name.toLowerCase().includes(q)) return true;
    if (skill.keywords.some((kw) => kw.includes(q) || q.includes(kw))) return true;
    return false;
  });
}

export interface EnrichedCareerMatch extends CareerItem {
  matchPercentage: number;
  matchingSkills: string[];
}

export function getAiRecommendedCareers(
  careerStatus: "fresher" | "experienced",
  selectedInterestIds: string[],
  selectedSkillNames: string[],
  categoryFilter?: string | null,
  searchQuery?: string
): EnrichedCareerMatch[] {
  const query = searchQuery?.trim().toLowerCase();

  // If user searched in Step 4
  let baseMatches: CareerItem[];
  if (query && query.length > 0) {
    baseMatches = ALL_CAREERS.filter((item) => {
      if (item.title.toLowerCase().includes(query)) return true;
      if (item.category.toLowerCase().includes(query)) return true;
      if (item.subCategory.toLowerCase().includes(query)) return true;
      if (item.keywords.some((kw) => kw.includes(query) || query.includes(kw))) return true;
      if (item.tags.some((tag) => tag.toLowerCase().includes(query))) return true;
      return false;
    });
  } else {
    // Filter based on user's selected interests
    baseMatches = ALL_CAREERS.filter((career) => {
      return career.interestIds.some((id) => selectedInterestIds.includes(id));
    });

    // If none matched directly, fallback
    if (baseMatches.length === 0) {
      baseMatches = ALL_CAREERS.slice(0, 8);
    }

    // If category tab is selected on Step 4
    if (categoryFilter && categoryFilter !== "all") {
      const filtered = baseMatches.filter(
        (m) =>
          m.interestIds.includes(categoryFilter) ||
          m.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
          m.type.toLowerCase() === categoryFilter.toLowerCase()
      );
      if (filtered.length > 0) baseMatches = filtered;
    }
  }

  // Calculate dynamic match percentage and matching skills for each career
  return baseMatches.map((career, index) => {
    // Score based on rank and skill alignment
    const baseScore = 95 - index * 4;
    const matchPercentage = Math.max(76, Math.min(98, baseScore));

    // Determine 2-3 matching skills
    const candidateSkills = selectedSkillNames.length > 0
      ? selectedSkillNames
      : ["Communication", "Problem Solving", "Leadership"];

    const matchingSkills = candidateSkills.slice(0, 3);

    return {
      ...career,
      matchPercentage,
      matchingSkills,
    };
  });
}

