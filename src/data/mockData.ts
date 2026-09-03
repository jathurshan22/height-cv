import type { CVData, User } from '../types';

export const mockUser: User = {
  id: 'u1',
  name: 'John Carter',
  email: 'john.carter@email.com',
};

export const emptyCV = (): CVData => ({
  id: crypto.randomUUID(),
  title: 'Untitled CV',
  template: 'minimal',
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
  references: [],
  updatedAt: new Date().toISOString(),
  atsScore: 0,
});

export const sampleCV = (): CVData => ({
  id: 'cv-1',
  title: 'Software Engineer CV',
  template: 'minimal',
  personalInfo: {
    fullName: 'John Carter',
    professionalTitle: 'Senior Software Engineer',
    email: 'john.carter@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johncarter',
    github: 'github.com/johncarter',
    portfolio: 'johncarter.dev',
  },
  summary:
    'Senior Software Engineer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Proven track record of delivering high-impact features and mentoring engineering teams.',
  workExperience: [
    {
      id: 'we1',
      jobTitle: 'Senior Software Engineer',
      company: 'Lattice Labs',
      location: 'Remote',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description:
        'Led the migration of a monolith to a microservices architecture, reducing deploy time by 60%. Mentored 4 junior engineers and established the frontend testing strategy adopted across 3 teams.',
    },
    {
      id: 'we2',
      jobTitle: 'Software Engineer',
      company: 'Brightpath',
      location: 'Austin, TX',
      startDate: '2019-06',
      endDate: '2021-12',
      current: false,
      description:
        'Built customer-facing dashboards in React serving 200k+ monthly users. Introduced CI/CD pipelines and reduced production incidents by 40% through improved observability.',
    },
  ],
  education: [
    {
      id: 'ed1',
      degree: 'B.S. in Computer Science',
      institution: 'University of Texas at Austin',
      location: 'Austin, TX',
      startDate: '2015-08',
      endDate: '2019-05',
      description: 'Graduated with honors. Focus on distributed systems and algorithms.',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL', 'AWS', 'Docker', 'CI/CD', 'Jest'],
  projects: [
    {
      id: 'p1',
      name: 'DevPulse',
      link: 'github.com/johncarter/devpulse',
      description:
        'Open-source developer productivity dashboard tracking PR throughput and review latency across GitHub organizations. 1.2k stars on GitHub.',
      technologies: 'React, Node.js, PostgreSQL, Redis',
    },
  ],
  certifications: [
    { id: 'c1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023-04' },
  ],
  languages: [
    { id: 'l1', name: 'English', proficiency: 'Native' },
    { id: 'l2', name: 'Spanish', proficiency: 'Professional' },
  ],
  achievements: [
    { id: 'a1', title: 'Speaker', description: 'Spoke at React Summit 2023 on scalable state management.' },
  ],
  references: [],
  updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  atsScore: 87,
});

export const mockCVs: CVData[] = [
  sampleCV(),
  {
    ...sampleCV(),
    id: 'cv-2',
    title: 'Frontend Developer CV',
    template: 'modern',
    atsScore: 92,
    updatedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    personalInfo: {
      ...sampleCV().personalInfo,
      professionalTitle: 'Frontend Developer',
    },
  },
  {
    ...sampleCV(),
    id: 'cv-3',
    title: 'Full-Stack Engineer CV',
    template: 'software-engineer',
    atsScore: 74,
    updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
];
