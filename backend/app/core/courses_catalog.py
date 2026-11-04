"""
Pathly Courses Catalog & Matching Engine.
Synced with lib/coursesData.ts.
Provides course details, skills matching, and retrieval for the AI Career Assistant.
"""

from typing import List, Dict, Any, Optional

PATHLY_COURSES: List[Dict[str, Any]] = [
    {
        "id": "course-1",
        "title": "Web Development Bootcamp",
        "provider": "Pathly Academy",
        "rating": 4.8,
        "reviewCount": 2340,
        "duration": "12h 30m",
        "level": "Beginner",
        "price": "Free",
        "category": "webdev",
        "skills": ["HTML", "CSS", "JavaScript", "React"],
        "description": "Master the fundamentals of modern web development from HTML and CSS to JavaScript and React. Build real-world projects and deploy your first web application.",
        "whatYouLearn": [
            "HTML, CSS, JavaScript fundamentals",
            "React & popular framework basics",
            "Build responsive layouts",
            "UX/UI basics",
            "Git & Demo",
        ],
    },
    {
        "id": "course-2",
        "title": "Python for Data Analysis",
        "provider": "DataCamp",
        "rating": 4.6,
        "reviewCount": 1890,
        "duration": "10h 15m",
        "level": "Beginner",
        "price": "₹499",
        "category": "data",
        "skills": ["Python", "Pandas", "NumPy", "Data Analysis"],
        "description": "Learn Python programming for data analysis. Explore data manipulation with Pandas, numerical computation with NumPy, and create data visualizations.",
        "whatYouLearn": [
            "Python programming fundamentals",
            "Data manipulation with Pandas",
            "Numerical computation with NumPy",
            "Create compelling data visualizations",
        ],
    },
    {
        "id": "course-3",
        "title": "UX/UI Design Fundamentals",
        "provider": "Design Academy",
        "rating": 4.7,
        "reviewCount": 1230,
        "duration": "8h 45m",
        "level": "Beginner",
        "price": "₹399",
        "category": "design",
        "skills": ["UI Design", "UX Research", "Figma", "Prototyping"],
        "description": "Understand user experience design principles, learn to use Figma for creating beautiful interfaces, and build interactive prototypes.",
        "whatYouLearn": [
            "User experience principles",
            "Wireframing and prototyping",
            "Figma design tool mastery",
            "User testing methodologies",
        ],
    },
    {
        "id": "course-4",
        "title": "Full Stack Developer Path",
        "provider": "Pathly Academy",
        "rating": 4.9,
        "reviewCount": 3200,
        "duration": "40h",
        "level": "Intermediate",
        "price": "₹1,999",
        "category": "webdev",
        "skills": ["React", "Node.js", "MongoDB", "TypeScript", "Next.js"],
        "description": "Become a full-stack developer. Master frontend with React/Next.js, build backend APIs with Node.js, and work with MongoDB databases.",
        "whatYouLearn": [
            "Advanced React & Next.js patterns",
            "RESTful API design with Node.js",
            "MongoDB database design",
            "Authentication & authorization",
            "CI/CD and deployment",
        ],
    },
    {
        "id": "course-5",
        "title": "Communication & Soft Skills",
        "provider": "SkillUp India",
        "rating": 4.5,
        "reviewCount": 980,
        "duration": "6h",
        "level": "Beginner",
        "price": "Free",
        "category": "softskills",
        "skills": ["Communication", "Leadership", "Teamwork", "Problem Solving"],
        "description": "Develop essential workplace soft skills. Learn effective communication, leadership principles, and collaborative problem-solving techniques.",
        "whatYouLearn": [
            "Clear professional communication",
            "Leadership and initiative",
            "Team collaboration strategies",
            "Problem-solving frameworks",
        ],
    },
    {
        "id": "course-6",
        "title": "React Native Mobile Development",
        "provider": "AppDev Pro",
        "rating": 4.6,
        "reviewCount": 756,
        "duration": "15h",
        "level": "Intermediate",
        "price": "₹899",
        "category": "mobile",
        "skills": ["React Native", "JavaScript", "Mobile UI", "API Integration"],
        "description": "Build cross-platform mobile apps with React Native. Create beautiful native experiences for iOS and Android from a single codebase.",
        "whatYouLearn": [
            "React Native fundamentals",
            "Cross-platform mobile development",
            "Native device APIs",
            "App store publishing",
        ],
    },
    {
        "id": "course-7",
        "title": "TNPSC Group 4 Complete Preparation",
        "provider": "GovtExam Academy",
        "rating": 4.4,
        "reviewCount": 4500,
        "duration": "50h",
        "level": "Beginner",
        "price": "₹799",
        "category": "government",
        "skills": ["General Studies", "Tamil", "Aptitude", "Current Affairs"],
        "description": "Complete preparation guide for TNPSC Group 4 exam. Covers all subjects including General Studies, Tamil, Aptitude, and Current Affairs with practice tests.",
        "whatYouLearn": [
            "Complete TNPSC Group 4 syllabus",
            "Tamil literature and grammar",
            "Quantitative aptitude techniques",
            "Current affairs analysis",
            "Mock test strategies",
        ],
    },
]

def get_course_by_id(course_id: str) -> Optional[Dict[str, Any]]:
    for c in PATHLY_COURSES:
        if c["id"] == course_id:
            return dict(c)
    return None

def find_courses_for_skills_or_query(query_or_skills: List[str]) -> List[Dict[str, Any]]:
    """Match courses based on skills, title, or keywords."""
    matched = []
    seen_ids = set()
    normalized_queries = [q.lower().strip() for q in query_or_skills if q.strip()]

    for course in PATHLY_COURSES:
        course_skills = [s.lower() for s in course["skills"]]
        course_title = course["title"].lower()
        course_desc = course["description"].lower()

        score = 0
        for q in normalized_queries:
            if any(q in s or s in q for s in course_skills):
                score += 3
            if q in course_title:
                score += 2
            if q in course_desc:
                score += 1

        if score > 0 and course["id"] not in seen_ids:
            seen_ids.add(course["id"])
            matched.append((score, course))

    matched.sort(key=lambda x: x[0], reverse=True)
    return [m[1] for m in matched]

def format_courses_for_prompt() -> str:
    """Format Pathly catalog as a concise reference text for the AI system prompt."""
    lines = ["Available Pathly Course Catalog (ONLY recommend real course IDs from this list):"]
    for c in PATHLY_COURSES:
        skills_str = ", ".join(c["skills"])
        lines.append(
            f"- ID: {c['id']} | Title: \"{c['title']}\" | Level: {c['level']} | Duration: {c['duration']} | Skills: {skills_str} | Price: {c['price']}"
        )
    return "\n".join(lines)
