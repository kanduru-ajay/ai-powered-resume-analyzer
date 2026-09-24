// Verified Course Catalog from trusted platforms (Coursera, AWS, Google, edX, freeCodeCamp, IBM, etc.)
// DO NOT invent URLs. Only return real, verified course links from this catalog.

export const VERIFIED_COURSE_CATALOG = {
  "docker": {
    skill: "Docker",
    courseName: "Docker Container Essentials",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/docker-container-essentials",
    description: "Learn Docker containerization fundamentals, image building, and multi-container orchestration.",
    level: "Intermediate",
    whyRequired: "The Job Description requires containerization and Docker expertise for production deployments."
  },
  "aws": {
    skill: "AWS",
    courseName: "AWS Skill Builder Digital Training",
    platform: "AWS",
    url: "https://aws.amazon.com/training/digital/",
    description: "Official AWS digital learning path covering cloud fundamentals, EC2, S3, IAM, and cloud architecture.",
    level: "Beginner to Intermediate",
    whyRequired: "The Job Description lists AWS cloud deployment and infrastructure management as a key requirement."
  },
  "spring boot": {
    skill: "Spring Boot",
    courseName: "Spring and Spring Boot Development Specialization",
    platform: "Coursera",
    url: "https://www.coursera.org/specializations/spring-and-spring-boot-development",
    description: "Master Java backend development, Spring Boot microservices, REST APIs, and database integration.",
    level: "Intermediate",
    whyRequired: "The Job Description requires backend development and Spring Boot framework experience."
  },
  "react": {
    skill: "React",
    courseName: "Meta Front-End Developer Professional Certificate",
    platform: "Coursera",
    url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    description: "Learn modern React components, state management, hooks, and responsive UI design.",
    level: "Beginner to Intermediate",
    whyRequired: "Required for building interactive frontend interfaces specified in the Job Description."
  },
  "react.js": {
    skill: "React.js",
    courseName: "Meta Front-End Developer Professional Certificate",
    platform: "Coursera",
    url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    description: "Learn modern React components, state management, hooks, and responsive UI design.",
    level: "Beginner to Intermediate",
    whyRequired: "Required for building interactive frontend interfaces specified in the Job Description."
  },
  "node.js": {
    skill: "Node.js",
    courseName: "Developing Backend Apps with Node.js and Express",
    platform: "Coursera (IBM)",
    url: "https://www.coursera.org/learn/developing-backend-apps-with-nodejs-and-express",
    description: "Build scalable RESTful microservices and asynchronous backend applications using Node.js.",
    level: "Intermediate",
    whyRequired: "Essential for backend service architecture requested in the Job Description."
  },
  "express": {
    skill: "Express",
    courseName: "Developing Backend Apps with Node.js and Express",
    platform: "Coursera (IBM)",
    url: "https://www.coursera.org/learn/developing-backend-apps-with-nodejs-and-express",
    description: "Build scalable RESTful microservices and asynchronous backend applications using Node.js & Express.",
    level: "Intermediate",
    whyRequired: "Essential for building backend web APIs."
  },
  "python": {
    skill: "Python",
    courseName: "Python for Everybody Specialization",
    platform: "Coursera (University of Michigan)",
    url: "https://www.coursera.org/specializations/python",
    description: "Comprehensive Python programming, data structures, and web data processing.",
    level: "Beginner",
    whyRequired: "Requested in the Job Description for scripting, backend services, or data processing."
  },
  "java": {
    skill: "Java",
    courseName: "Java Programming and Software Engineering Fundamentals",
    platform: "Coursera (Duke University)",
    url: "https://www.coursera.org/specializations/java-programming",
    description: "Master core Java, object-oriented programming, and algorithm design.",
    level: "Beginner to Intermediate",
    whyRequired: "Primary enterprise language requested in the target Job Description."
  },
  "sql": {
    skill: "SQL",
    courseName: "SQL for Data Science",
    platform: "Coursera (UC Davis)",
    url: "https://www.coursera.org/learn/sql-for-data-science",
    description: "Master relational database design, complex SQL queries, indexing, and data modeling.",
    level: "Beginner to Intermediate",
    whyRequired: "Crucial for relational database management and backend data persistence."
  },
  "kubernetes": {
    skill: "Kubernetes",
    courseName: "Introduction to Kubernetes",
    platform: "edX (Linux Foundation)",
    url: "https://www.edx.org/learn/kubernetes/the-linux-foundation-introduction-to-kubernetes",
    description: "Learn container orchestration, cluster management, deployments, and scaling with Kubernetes.",
    level: "Intermediate to Advanced",
    whyRequired: "Required for managing containerized cloud infrastructure at scale."
  },
  "typescript": {
    skill: "TypeScript",
    courseName: "Learn TypeScript - Beginner's Guide",
    platform: "freeCodeCamp",
    url: "https://www.freecodecamp.org/news/learn-typescript-beginners-guide/",
    description: "Master static typing, interfaces, generics, and enterprise TypeScript application design.",
    level: "Intermediate",
    whyRequired: "Required for type-safe frontend and backend codebases requested in the JD."
  },
  "git": {
    skill: "Git",
    courseName: "Version Control with Git & GitHub",
    platform: "Coursera (Meta)",
    url: "https://www.coursera.org/learn/introduction-to-version-control",
    description: "Learn Git workflows, branching, pull requests, and automated continuous integration pipelines.",
    level: "Beginner",
    whyRequired: "Essential for team collaboration and DevOps continuous delivery."
  },
  "ci/cd": {
    skill: "CI/CD",
    courseName: "Continuous Integration & Continuous Delivery (CI/CD)",
    platform: "Coursera (IBM)",
    url: "https://www.coursera.org/learn/continuous-integration-continuous-delivery-ci-cd",
    description: "Learn automated testing, build pipelines, GitHub Actions, and deployment automation.",
    level: "Intermediate",
    whyRequired: "Required for modern DevOps delivery and build automation."
  },
  "system design": {
    skill: "System Design",
    courseName: "Microservices Architecture & System Design",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/microservices-architecture",
    description: "Architect distributed microservices, event-driven systems, and scalable cloud architectures.",
    level: "Advanced",
    whyRequired: "Required for senior engineering and distributed system architecture roles."
  },
  "microservices": {
    skill: "Microservices",
    courseName: "Microservices Architecture & System Design",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/microservices-architecture",
    description: "Architect distributed microservices, event-driven systems, and scalable cloud architectures.",
    level: "Advanced",
    whyRequired: "Required for building modular enterprise cloud applications."
  },
  "azure": {
    skill: "Azure",
    courseName: "Microsoft Azure Fundamentals (AZ-900)",
    platform: "Microsoft Learn",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
    description: "Official Microsoft Azure Cloud path covering cloud concepts, security, and enterprise infrastructure.",
    level: "Beginner",
    whyRequired: "Required for Microsoft cloud infrastructure management."
  },
  "gcp": {
    skill: "GCP",
    courseName: "Google Cloud Computing Foundations",
    platform: "Google Cloud Skills Boost",
    url: "https://www.cloudskillsboost.google/paths/11",
    description: "Official Google Cloud path for infrastructure, BigQuery, and app deployment.",
    level: "Beginner to Intermediate",
    whyRequired: "Required for Google Cloud Platform operations."
  }
};

/**
 * Find verified course for a skill key
 */
export function findVerifiedCourse(skill) {
  if (!skill) return null;
  const key = String(skill).toLowerCase().trim();
  
  // Exact lookup
  if (VERIFIED_COURSE_CATALOG[key]) {
    return VERIFIED_COURSE_CATALOG[key];
  }

  // Partial key matching (e.g., "docker containerization" -> "docker")
  for (const catalogKey of Object.keys(VERIFIED_COURSE_CATALOG)) {
    if (key.includes(catalogKey) || catalogKey.includes(key)) {
      return VERIFIED_COURSE_CATALOG[catalogKey];
    }
  }

  return null;
}
