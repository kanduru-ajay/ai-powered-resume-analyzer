export const DEMO_RESUMES = [
  {
    _id: 'demo_resume_1',
    originalName: 'Alex_Dev_Resume.pdf',
    fileType: 'pdf',
    parsedData: {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      summary: 'Senior Full Stack Developer with 5+ years of experience building scalable web applications with React, Node.js, TypeScript, and MongoDB.',
      skills: ['React', 'Node.js', 'Express', 'TypeScript', 'JavaScript', 'MongoDB', 'REST API', 'Git', 'HTML', 'CSS', 'Redux'],
      education: ['B.S. in Computer Science, UC Berkeley (2019)'],
      experience: [
        'Senior Software Engineer at TechCorp (2022-Present): Led frontend architecture transition to React/TypeScript.',
        'Full Stack Developer at CloudInnovate (2019-2022): Built Node.js microservices and REST APIs.'
      ],
      projects: ['E-Commerce Engine', 'Real-time Chat App'],
      certifications: ['AWS Certified Cloud Practitioner'],
      technologies: ['React', 'Node.js', 'Express', 'TypeScript', 'MongoDB'],
      achievements: ['Reduced page load times by 45%', 'Mentored 4 junior developers'],
      keywords: ['React', 'Node.js', 'Full Stack', 'Microservices', 'REST API']
    }
  },
  {
    _id: 'demo_resume_2',
    originalName: 'Sarah_Backend_Resume.pdf',
    fileType: 'pdf',
    parsedData: {
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 987-6543',
      location: 'Seattle, WA',
      summary: 'Backend Engineer specializing in Java, Spring Boot, Microservices, Docker, Kubernetes, and AWS Cloud deployments.',
      skills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'Kafka', 'Git'],
      education: ['M.S. in Software Engineering, University of Washington (2020)'],
      experience: [
        'Backend Infrastructure Lead at EnterpriseSoft (2021-Present): Designed high-throughput microservices handling 2M requests/day.',
        'Software Engineer at DataFlow (2019-2021): Managed AWS Kubernetes clusters.'
      ],
      projects: ['Distributed Event Streaming Pipeline', 'Payment Processing Gateway'],
      certifications: ['AWS Certified Solutions Architect', 'Docker Certified Associate'],
      technologies: ['Java', 'Spring Boot', 'Docker', 'Kubernetes', 'AWS'],
      achievements: ['Maintained 99.99% service uptime across 12 microservices'],
      keywords: ['Java', 'Spring Boot', 'AWS', 'Docker', 'Kubernetes', 'Microservices']
    }
  }
];

export const DEMO_JD = {
  _id: 'demo_jd_1',
  jobTitle: 'Senior Full Stack Engineer',
  company: 'InnovateAI Systems',
  rawText: `Job Title: Senior Full Stack Engineer
Required Skills: React, Node.js, Express, TypeScript, SQL, Docker, AWS, REST API
Preferred Skills: GraphQL, Kubernetes, Redis
Experience: 4+ years of full stack web development
Education: Bachelor's degree in Computer Science or related STEM field
Responsibilities:
- Build modern, high-performance web user interfaces with React and Tailwind CSS.
- Architect resilient backend APIs in Node.js and Express.
- Containerize services with Docker and deploy to AWS cloud infrastructure.
- Collaborate closely with product managers and UI designers.`,
  parsedData: {
    jobTitle: 'Senior Full Stack Engineer',
    requiredSkills: ['React', 'Node.js', 'Express', 'TypeScript', 'SQL', 'Docker', 'AWS', 'REST API'],
    preferredSkills: ['GraphQL', 'Kubernetes', 'Redis'],
    experience: '4+ years of full stack experience',
    education: ['Bachelor\'s degree in Computer Science'],
    responsibilities: [
      'Build modern web interfaces with React',
      'Architect backend APIs in Node.js',
      'Deploy containerized services to AWS with Docker'
    ],
    technologies: ['React', 'Node.js', 'Express', 'TypeScript', 'Docker', 'AWS', 'SQL'],
    certifications: [],
    keywords: ['React', 'Node.js', 'Full Stack', 'AWS', 'Docker', 'TypeScript']
  }
};
