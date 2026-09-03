const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
const text = (value) => String(value ?? '').trim();
const normalize = (value) => text(value).toLowerCase().replace(/[^a-z0-9+#./-]+/g, ' ').replace(/\s+/g, ' ').trim();
const allCvText = (cv) => JSON.stringify(cv ?? {}).toLowerCase();

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Python', 'Java', 'C#', 'C++',
  'HTML', 'CSS', 'Tailwind CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'REST API', 'GraphQL',
  'Git', 'GitHub', 'Docker', 'AWS', 'Azure', 'Kubernetes', 'CI/CD', 'Jest', 'Figma', 'UI/UX',
  'Firebase', 'Redis', 'Linux', 'Agile', 'Scrum', 'Machine Learning', 'Artificial Intelligence'
];

function collectCvText(cv) {
  const chunks = [
    cv?.summary,
    cv?.personalInfo?.professionalTitle,
    ...(cv?.skills || []),
    ...(cv?.workExperience || []).flatMap((x) => [x.jobTitle, x.company, x.description]),
    ...(cv?.education || []).flatMap((x) => [x.degree, x.institution, x.description]),
    ...(cv?.projects || []).flatMap((x) => [x.name, x.description, x.technologies]),
    ...(cv?.certifications || []).flatMap((x) => [x.name, x.issuer]),
  ];
  return normalize(chunks.filter(Boolean).join(' '));
}

function extractJobSkills(jobDescription) {
  const jd = normalize(jobDescription);
  return COMMON_SKILLS.filter((skill) => jd.includes(normalize(skill)));
}

export function analyzeATS(cv = {}, jobDescription = '') {
  const p = cv.personalInfo || {};
  const cvText = collectCvText(cv);
  const requiredFields = [p.fullName, p.email, p.phone, p.location, cv.summary];
  const fieldScore = requiredFields.filter((x) => text(x)).length / requiredFields.length * 100;
  const sectionsPresent = [cv.summary, cv.workExperience?.length, cv.education?.length, cv.skills?.length, cv.projects?.length, cv.certifications?.length, cv.languages?.length].filter(Boolean).length;
  const sections = clamp(sectionsPresent / 7 * 100);
  const skillsCount = cv.skills?.length || 0;
  const skills = clamp(45 + Math.min(45, skillsCount * 5));
  const experience = clamp(cv.workExperience?.length ? (cv.workExperience.some((x) => text(x.description).length >= 100) ? 95 : 78) : 30);
  const education = clamp(cv.education?.length ? 95 : 35);
  const formatting = clamp(78 + (text(p.email).includes('@') ? 5 : 0) + (text(p.phone) ? 5 : 0) + (sections >= 85 ? 7 : 0));

  const targetSkills = extractJobSkills(jobDescription);
  const keywordPool = targetSkills.length ? targetSkills : COMMON_SKILLS;
  const matchedKeywords = keywordPool.filter((skill) => cvText.includes(normalize(skill)));
  const keywords = clamp(targetSkills.length ? matchedKeywords.length / targetSkills.length * 100 : Math.min(100, 35 + matchedKeywords.length * 7));

  const score = clamp(formatting * .18 + keywords * .27 + skills * .18 + experience * .18 + education * .09 + sections * .10);
  const strengths = [];
  if (formatting >= 85) strengths.push('Clean structure with readable ATS-friendly formatting');
  if (skills >= 80) strengths.push('Strong skills coverage');
  if (experience >= 80) strengths.push('Experience section has useful detail');
  if (sections >= 80) strengths.push('Most important CV sections are present');
  if (matchedKeywords.length) strengths.push(`${matchedKeywords.length} relevant keyword${matchedKeywords.length === 1 ? '' : 's'} detected`);
  if (!strengths.length) strengths.push('CV structure started — keep adding relevant detail');

  const improvements = [];
  if (keywords < 80) improvements.push(targetSkills.length ? 'Add relevant keywords from the target job description where truthful' : 'Add more role-relevant technical keywords');
  if (experience < 80) improvements.push('Strengthen experience bullets with actions, tools and measurable results');
  if (text(cv.summary).length < 60) improvements.push('Write a concise professional summary tailored to the target role');
  if (skillsCount < 8) improvements.push('Add more relevant skills you genuinely have');
  if (!p.email || !text(p.email).includes('@')) improvements.push('Add a valid professional email address');
  if (!improvements.length) improvements.push('Minor polish: tailor wording to each job application');

  const missingKeywords = (targetSkills.length ? targetSkills : COMMON_SKILLS)
    .filter((skill) => !cvText.includes(normalize(skill)))
    .slice(0, 8);

  return {
    score,
    breakdown: { formatting, keywords, skills, experience, education, sections },
    strengths,
    improvements,
    missingKeywords,
    suggestions: [
      'Mirror important wording from the target job description only when it accurately describes your experience.',
      'Quantify 2–3 achievements with percentages, time saved, users, revenue, or other real outcomes.',
      'Keep section headings simple and consistent for reliable ATS parsing.'
    ]
  };
}

export function improve(target, input = '') {
  const s = text(input);
  const rewrites = {
    summary: s ? `Results-driven professional with expertise in ${s}. Skilled at translating requirements into reliable solutions, collaborating across teams, and delivering measurable outcomes.` : 'Results-driven professional skilled at building reliable solutions, collaborating across teams, and delivering measurable outcomes.',
    experience: s ? `Delivered ${s}, improving reliability and user impact. Collaborated with cross-functional stakeholders to plan, implement, test, and ship the work efficiently.` : 'Delivered key initiatives that improved reliability and user impact while collaborating with cross-functional stakeholders to ship high-quality work.',
    project: s ? `Developed ${s} with responsive user experiences, structured workflows, and maintainable implementation. Focused on usability, performance, and reliable delivery.` : 'Developed a production-ready application with responsive user experiences, structured workflows, and maintainable implementation.',
    skills: s ? `${s}, React, TypeScript, Node.js, REST API, Git, CI/CD, Agile` : 'React, TypeScript, Node.js, REST API, Git, CI/CD, Agile',
    ats: s ? `Optimized ${s} for ATS compatibility by using clear section headings, relevant keywords, concise bullets, and measurable outcomes without adding unsupported claims.` : 'Optimized content for ATS compatibility with clear headings, relevant keywords, concise bullets, and measurable outcomes.'
  };
  return rewrites[target] || s;
}

function safeJobResult(value, local) {
  if (!value || typeof value !== 'object') return local;
  const score = clamp(value.matchScore);
  const arr = (v) => Array.isArray(v) ? v.map(text).filter(Boolean).slice(0, 20) : [];
  return {
    matchScore: score,
    matchedSkills: arr(value.matchedSkills),
    missingSkills: arr(value.missingSkills),
    recommendedSkills: arr(value.recommendedSkills),
    recommendations: arr(value.recommendations).slice(0, 8),
    analysisMode: 'ai',
    experienceMatch: Number.isFinite(Number(value.experienceMatch)) ? clamp(value.experienceMatch) : (local.experienceMatch || 0),
    educationMatch: Number.isFinite(Number(value.educationMatch)) ? clamp(value.educationMatch) : (local.educationMatch || 0),
    projectMatch: Number.isFinite(Number(value.projectMatch)) ? clamp(value.projectMatch) : (local.projectMatch || 0),
    responsibilityMatch: Number.isFinite(Number(value.responsibilityMatch)) ? clamp(value.responsibilityMatch) : (local.responsibilityMatch || 0),
    matchedResponsibilities: arr(value.matchedResponsibilities, 12).length ? arr(value.matchedResponsibilities, 12) : (local.matchedResponsibilities || []),
    missingResponsibilities: arr(value.missingResponsibilities, 12).length ? arr(value.missingResponsibilities, 12) : (local.missingResponsibilities || []),
  };
}

export function matchJob(cv = {}, jobDescription = '') {
  const jd = normalize(jobDescription);
  const cvText = collectCvText(cv);
  const targetSkills = extractJobSkills(jobDescription);
  const matchedSkills = targetSkills.filter((skill) => cvText.includes(normalize(skill)));
  const missingSkills = targetSkills.filter((skill) => !cvText.includes(normalize(skill)));
  const matchScore = targetSkills.length ? clamp(matchedSkills.length / targetSkills.length * 100) : clamp(35 + Math.min(50, (cv.skills?.length || 0) * 5));
  return {
    matchScore,
    matchedSkills,
    missingSkills,
    recommendedSkills: missingSkills.slice(0, 6),
    experienceMatch: cv.workExperience?.length ? 70 : 20,
    educationMatch: cv.education?.length ? 70 : 20,
    projectMatch: cv.projects?.length ? 70 : 20,
    responsibilityMatch: 50,
    matchedResponsibilities: [],
    missingResponsibilities: [],
    recommendations: [
      missingSkills.length ? `Prioritize ${missingSkills.slice(0, 3).join(', ')} if you genuinely have those skills.` : 'Your detected skills align well — emphasize them near the top of your CV.',
      'Mirror exact job-description terminology when it truthfully matches your experience.',
      'Tailor 2–3 experience or project bullets to the role responsibilities.'
    ]
  };
}

function safeATSResult(value, local) {
  if (!value || typeof value !== 'object') return local;
  const num = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? clamp(n) : fallback;
  };
  const arr = (v, max = 20) => Array.isArray(v) ? v.map(text).filter(Boolean).slice(0, max) : [];
  const b = value.breakdown && typeof value.breakdown === 'object' ? value.breakdown : {};
  return {
    score: num(value.score, local.score),
    breakdown: {
      formatting: num(b.formatting, local.breakdown.formatting),
      keywords: num(b.keywords, local.breakdown.keywords),
      skills: num(b.skills, local.breakdown.skills),
      experience: num(b.experience, local.breakdown.experience),
      education: num(b.education, local.breakdown.education),
      sections: num(b.sections, local.breakdown.sections),
    },
    strengths: arr(value.strengths, 8),
    improvements: arr(value.improvements, 8),
    missingKeywords: arr(value.missingKeywords, 12),
    suggestions: arr(value.suggestions, 8),
    analysisMode: 'ai'
  };
}

export async function analyzeATSWithAI(cv, jobDescription = '') {
  const local = analyzeATS(cv, jobDescription);
  if (!process.env.OPENAI_API_KEY) return { ...local, analysisMode: 'local-fallback' };
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', temperature: 0.1, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: `Analyze this CV for ATS compatibility. ${jobDescription.trim() ? 'Use the target job description to assess keyword and role relevance.' : 'Assess general ATS readiness without assuming a target role.'} Do not invent facts. Return valid JSON with score (0-100), breakdown {formatting,keywords,skills,experience,education,sections} each 0-100, strengths[], improvements[], missingKeywords[], suggestions[]. CV: ${JSON.stringify(cv)} TARGET JOB: ${jobDescription}` }] })
    });
    if (!response.ok) return { ...local, analysisMode: 'local-fallback' };
    const data = await response.json();
    return safeATSResult(JSON.parse(data.choices?.[0]?.message?.content || '{}'), local);
  } catch { return { ...local, analysisMode: 'local-fallback' }; }
}

export async function improveWithAI(target, input = '') {
  if (!process.env.OPENAI_API_KEY) return improve(target, input);
  const prompt = `You are a professional CV writer. Improve this ${target} content for a modern ATS-friendly resume. Keep every factual claim truthful, concise and action-oriented. Never invent employers, metrics, technologies, dates, degrees or achievements. Return only the improved text.\n\nInput:\n${text(input)}`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', temperature: 0.2, messages: [{ role: 'user', content: prompt }] }) });
    if (!response.ok) return improve(target, input);
    const data = await response.json();
    return text(data.choices?.[0]?.message?.content) || improve(target, input);
  } catch { return improve(target, input); }
}

export async function matchJobWithAI(cv, jobDescription = '') {
  const local = matchJob(cv, jobDescription);
  if (!process.env.OPENAI_API_KEY) return local;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', temperature: 0.1, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: `Compare this CV with this job description. Only use facts present in the CV. Return valid JSON with: matchScore (0-100), matchedSkills[], missingSkills[], recommendedSkills[], recommendations[], experienceMatch (0-100), educationMatch (0-100), projectMatch (0-100), responsibilityMatch (0-100), matchedResponsibilities[], missingResponsibilities[]. CV: ${JSON.stringify(cv)} JOB: ${jobDescription}` }] }) });
    if (!response.ok) return local;
    const data = await response.json();
    return safeJobResult(JSON.parse(data.choices?.[0]?.message?.content || '{}'), local);
  } catch { return local; }
}
