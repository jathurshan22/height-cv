import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion';
import {
  Sparkles,
  ScanSearch,
  Target,
  LayoutTemplate,
  Eye,
  Download,
  ArrowRight,
  CheckCircle2,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  Mail,
  MapPin,
  Linkedin,

  
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { useTemplates } from '../hooks/useTemplates';
import { TemplatePaper } from '../components/TemplatePaper';
import { api } from '../services/api';

type HomeStats = {
  users: number;
  cvs: number;
  atsScore: number | null;
  totalTemplates: number;
};

type HomeCV = {
  personalInfo?: {
    fullName?: string;
    professionalTitle?: string;
    email?: string;
    location?: string;
    linkedin?: string;
  };
  summary?: string;
  workExperience?: Array<{
    jobTitle?: string;
    title?: string;
    company?: string;
    description?: string;
    bullets?: string[];
  }>;
  skills?: string[];
  atsScore?: number;
};

const emptyHomeStats: HomeStats = {
  users: 0,
  cvs: 0,
  atsScore: null,
  totalTemplates: 0,
};

const features = [
  {
    icon: Sparkles,
    title: 'AI CV Assistant',
    desc: 'Generate professional summaries and impactful bullet points in seconds.',
  },
  {
    icon: ScanSearch,
    title: 'ATS Analyzer',
    desc: 'Analyze your CV and identify ATS problems before you apply.',
  },
  {
    icon: Target,
    title: 'Job Match',
    desc: 'Compare your CV against any job description and close the gaps.',
  },
  {
    icon: LayoutTemplate,
    title: 'Professional Templates',
    desc: 'Choose from clean, ATS-friendly templates built for every role.',
  },
  {
    icon: Eye,
    title: 'Live Preview',
    desc: 'See your CV update instantly while you edit — no surprises.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    desc: 'Download a polished, submission-ready PDF in one click.',
  },
];


const atsMetrics = [
  { label: 'Keyword Match', value: 91 },
  { label: 'Formatting', value: 100 },
  { label: 'Skills Match', value: 84 },
  { label: 'Experience', value: 88 },
];

const matchedSkills = ['React', 'Node.js', 'MongoDB', 'REST API'];
const missingSkills = ['Docker', 'AWS'];

/* =========================================================
   Reusable mouse-follow 3D card effect
   Keeps the existing hover/entrance animations. The card itself follows
   the pointer, while its contents stay as normal 2D layers so Chromium
   does not keep text rasterized/soft after mouse-out.
========================================================= */
function TiltCard({ children, onMouseMove, onMouseLeave, style, ...props }: HTMLMotionProps<'div'>) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltScale = useMotionValue(1);

  const rotateX = useSpring(tiltX, { stiffness: 280, damping: 18, mass: 0.28 });
  const rotateY = useSpring(tiltY, { stiffness: 280, damping: 18, mass: 0.28 });
  const scale = useSpring(tiltScale, { stiffness: 260, damping: 20, mass: 0.3 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(e);
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    tiltY.set((px - 0.5) * 14);
    tiltX.set((0.5 - py) * 14);
    const distanceFromCenter = Math.min(
      Math.sqrt((px - 0.5) ** 2 + (py - 0.5) ** 2) * 2,
      1,
    );
    tiltScale.set(1 + distanceFromCenter * 0.008);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);
    tiltX.set(0);
    tiltY.set(0);
    tiltScale.set(1);
  };

  return (
    <motion.div
      {...props}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: 'flat',
        backfaceVisibility: 'hidden',
        scale,
      }}
    >
      {children}
    </motion.div>
  );
}

function TiltArticle({ children, onMouseMove, onMouseLeave, style, ...props }: HTMLMotionProps<'article'>) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltScale = useMotionValue(1);

  const rotateX = useSpring(tiltX, { stiffness: 280, damping: 18, mass: 0.28 });
  const rotateY = useSpring(tiltY, { stiffness: 280, damping: 18, mass: 0.28 });
  const scale = useSpring(tiltScale, { stiffness: 260, damping: 20, mass: 0.3 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    onMouseMove?.(e);
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    tiltY.set((px - 0.5) * 14);
    tiltX.set((0.5 - py) * 14);
    const distanceFromCenter = Math.min(
      Math.sqrt((px - 0.5) ** 2 + (py - 0.5) ** 2) * 2,
      1,
    );
    tiltScale.set(1 + distanceFromCenter * 0.008);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
    onMouseLeave?.(e);
    tiltX.set(0);
    tiltY.set(0);
    tiltScale.set(1);
  };

  return (
    <motion.article
      {...props}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: 'flat',
        backfaceVisibility: 'hidden',
        scale,
      }}
    >
      {children}
    </motion.article>
  );
}

type AnimatedCountProps = {
  value: number | null;
  suffix?: string;
  duration?: number;
};

function AnimatedCount({ value, suffix = '', duration = 850 }: AnimatedCountProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (value === null || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, started]);

  useEffect(() => {
    if (!started || value === null) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, duration]);

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {value === null ? '—' : `${count}${suffix}`}
    </span>
  );
}

export function Home() {
  const { templates } = useTemplates('featured');
  const [homeStats, setHomeStats] = useState<HomeStats>(emptyHomeStats);
  const [heroCV, setHeroCV] = useState<HomeCV | null>(null);

  useEffect(() => {
    let active = true;
    api.homeStats()
      .then((response) => {
        if (!active) return;

        const stats = response.stats;

        setHomeStats({
          users: Number(stats?.users ?? 0),
          cvs: Number(stats?.cvs ?? 0),
          atsScore:
            stats?.atsScore === null || stats?.atsScore === undefined
              ? null
              : Number(stats.atsScore),
          totalTemplates: Number(stats?.totalTemplates ?? 0),
        });
      })
      .catch(() => {
        if (active) setHomeStats(emptyHomeStats);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    api.listCVs()
      .then(async (response) => {
        const latest = response.cvs?.[0];
        if (!latest) return;
        const detail = await api.getCV(latest._id);
        if (active) setHeroCV((detail.cv || null) as HomeCV | null);
      })
      .catch(() => {
        if (active) setHeroCV(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const heroInfo = heroCV?.personalInfo || {};
  const heroExperience = heroCV?.workExperience?.[0];
  const heroSkills = heroCV?.skills?.filter(Boolean).slice(0, 6) || [];
  const heroName = heroInfo.fullName || 'Your Name';
  const heroTitle = heroInfo.professionalTitle || 'Your Professional Title';
  const heroEmail = heroInfo.email || 'your@email.com';
  const heroLocation = heroInfo.location || 'Your location';
  const heroLinkedin = heroInfo.linkedin || 'linkedin.com/in/your-profile';
  const heroSummary = heroCV?.summary || 'Create your first CV to see your real profile data here.';
  const heroJobTitle = heroExperience?.jobTitle || heroExperience?.title || 'Add your experience in the CV Builder';
  const heroCompany = heroExperience?.company || 'Your latest company';
  const heroDescription = heroExperience?.description || heroExperience?.bullets?.[0] || 'Your latest experience description will appear here.';

  const stats = [
    { value: homeStats.cvs, label: 'CVs Created', suffix: '' },
    { value: homeStats.atsScore, label: 'ATS Score', suffix: '%' },
    { value: homeStats.totalTemplates, label: 'Templates', suffix: '' },
    { value: homeStats.users, label: 'User IDs', suffix: '' },
  ];


  // Minimal 3D tilt for the hero CV card (pointer-driven, spring-smoothed).
  const MAX_TILT = 18;

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const rotateX = useSpring(tiltX, { stiffness: 200, damping: 16, mass: 0.32 });
  const rotateY = useSpring(tiltY, { stiffness: 200, damping: 16, mass: 0.32 });

  const handleTilt = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    tiltY.set((px - 0.5) * MAX_TILT * 2);
    tiltX.set((0.5 - py) * MAX_TILT * 2);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };
  return (
    <div className="min-h-screen bg-surface-page">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden">
        {/* Soft background glow */}
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl" />

        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
           

            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Build an ATS-Friendly CV That Gets Noticed.
            </h1>

            <p className="mt-5 max-w-lg text-base text-ink-muted sm:text-lg">
              Create a professional CV, optimize it for ATS systems, and
              tailor it to any job using AI.
            </p>

            <div className="mt-8 max-w-xl">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Primary CTA */}
                <Link
                  to="/create-cv"
                  className="group relative w-full"
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-0 blur-lg transition duration-300 group-hover:opacity-40" />

                  <Button
                    variant="accent"
                    size="lg"
                    className="relative h-[60px] w-full justify-between overflow-hidden rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 text-white shadow-[0_12px_30px_rgba(79,70,229,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,70,229,0.35)] active:translate-y-0"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <FileText className="h-[18px] w-[18px]" />
                      </span>

                      <span className="font-semibold">Create My CV</span>
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/20">
                      <ArrowRight className="h-[18px] w-[18px]" />
                    </span>
                  </Button>
                </Link>

                {/* Secondary CTA */}
                <a href="#templates" className="group relative w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="relative h-[60px] w-full justify-between rounded-2xl border border-slate-200 bg-white/80 px-5 text-slate-900 shadow-[0_8px_25px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-[0_16px_35px_rgba(79,70,229,0.10)] active:translate-y-0"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-100">
                        <LayoutTemplate className="h-[18px] w-[18px]" />
                      </span>

                      <span className="font-semibold"> CV Templates</span>
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600">
                      <ArrowRight className="h-[18px] w-[18px]" />
                    </span>
                  </Button>
                </a>
              </div>

              
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-slate-600 shadow-sm backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                No credit card
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-slate-600 shadow-sm backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Free to start
              </span>
            </div>
          </motion.div>

          {/* =====================================================
              MODERN CV MOCKUP
          ===================================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl" />

            {/* CV card — gentle float + minimal 3D tilt */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
              style={{ perspective: 1100 }}
            >
              <motion.div
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                whileHover={{ y: -8, scale: 1.025 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'flat',
                  backfaceVisibility: 'hidden',
                          }}
                className="relative cursor-default"
              >
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[26px]
                    border border-white/70
                    bg-white/95
                    p-6
                    shadow-[0_30px_80px_rgba(15,23,42,0.12)]
                    [transform-style:flat]
                  "
                  style={{ transformStyle: 'flat', backfaceVisibility: 'hidden' }}
                >
                {/* Top gradient line */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

                {/* CV Header */}
                <div className="pt-1" >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Professional CV
                  </p>

                  <h3 className="mt-1.5 font-display text-[20px] font-bold tracking-tight text-slate-950">
                    {heroName}
                  </h3>

                  <p className="mt-0.5 text-[12px] font-semibold text-indigo-600">
                    {heroTitle}
                  </p>
                </div>

                {/* Contact row */}
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5" />
                    {heroEmail}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5" />
                    {heroLocation}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <Linkedin className="h-2.5 w-2.5" />
                    {heroLinkedin}
                  </span>
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-gradient-to-r from-indigo-500 via-violet-400 to-transparent" />

                {/* Summary */}
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-600">
                      Summary
                    </p>
                  </div>

                  <p className="text-[9.5px] leading-[1.6] text-slate-600">
                   {heroSummary}
                  </p>
                </div>

                {/* Experience */}
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-600">
                      Experience
                    </p>
                  </div>

                  <div className="border-l-2 border-indigo-100 pl-3">
                    <p className="text-[9.5px] font-bold text-slate-900">
                      {heroJobTitle}
                    </p>

                    <p className="text-[8.5px] font-semibold text-indigo-600">
                      {heroCompany}
                    </p>

                    <ul className="mt-1.5 space-y-1 text-[8.5px] leading-[1.5] text-slate-600">
                      <li className="flex gap-1.5">
                        <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                        {heroDescription}
                      </li>

                      {(heroExperience?.bullets?.[1] || heroExperience?.description) && (
                        <li className="flex gap-1.5">
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                          {heroExperience?.bullets?.[1] || heroExperience?.description}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4" >
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-600">
                      Skills
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(heroSkills.length ? heroSkills : ['Add skills in CV Builder']).map(
                      (skill) => (
                        <span
                          key={skill}
                          className="
                            rounded-lg
                            border border-slate-200
                            bg-slate-50
                            px-2
                            py-1
                            text-[8px]
                            font-medium
                            text-slate-600
                          "
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* Bottom subtle indicator */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[8px] font-medium text-slate-400">
                    ATS-ready format
                  </span>

                  <span className="inline-flex items-center gap-1 text-[8px] font-semibold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Optimized
                  </span>
                </div>
              </div>
              </motion.div>
            </motion.div>

            {/* =================================================
                FLOATING ATS SCORE
            ================================================= */}
            <TiltCard
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -6, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="
                absolute
                -bottom-6
                -left-6
                flex
                items-center
                gap-2.5
                rounded-2xl
                border
                border-white/80
                bg-white/90
                px-3
                py-2.5
                shadow-[0_15px_40px_rgba(15,23,42,0.12)]
              "
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] font-bold text-slate-900">
                    ATS Score
                  </p>

                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-bold text-emerald-600">
                    GOOD
                  </span>
                </div>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <p className="text-sm font-bold text-slate-900">
                    87 / 100
                  </p>

                  <span className="text-[8px] text-slate-400">
                    optimized
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* Floating AI badge */}
           
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="border-y border-line bg-surface">
        <div className="container-page grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-ink sm:text-4xl">
                <AnimatedCount value={s.value} suffix={s.suffix} />
              </p>

              <p className="mt-1 text-sm text-ink-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section id="features" className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Features</p>

          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Everything You Need to Build a Better CV
          </h2>

          <p className="mt-3 text-ink-muted">
            Powerful tools designed to help you land more interviews.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <TiltCard
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.025 }}
              className="card group p-6 transition-shadow duration-300 hover:shadow-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-ink">
                {f.title}
              </h3>

              <p className="mt-1.5 text-sm text-ink-muted">
                {f.desc}
              </p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section
        id="how"
        className="relative overflow-hidden border-y border-line bg-white"
      >
        {/* Decorative dots */}
        <div className="pointer-events-none absolute right-8 top-24 hidden opacity-70 lg:block">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 35 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-violet-200"
              />
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-20 left-8 hidden opacity-70 lg:block">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-violet-200"
              />
            ))}
          </div>
        </div>

        <div className="container-page relative py-24 sm:py-28">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
              How It Works
            </span>

            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Build. Optimize.{' '}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Get Hired.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Everything you need to create a CV that gets noticed.
            </p>
          </motion.div>

          {/* Journey */}
          <div className="relative mx-auto mt-20 max-w-6xl">
            {/* Animated connecting line */}
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-[50%] hidden h-1 -translate-y-1/2 md:block">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                className="h-full origin-left rounded-full bg-gradient-to-r from-violet-300 via-indigo-500 to-blue-400"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="absolute left-[32%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.45)]"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.4 }}
                className="absolute left-[68%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.45)]"
              />
            </div>

            <div className="grid gap-8 md:grid-cols-3 md:items-start">
              {/* Step 01 */}
              <TiltArticle
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative z-10 md:mt-10"
              >
                <div className="absolute -top-14 left-3 select-none font-display text-7xl font-black leading-none text-violet-100">
                  01
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-violet-100 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition-all duration-500 group-hover:border-violet-200 group-hover:shadow-[0_25px_60px_rgba(124,58,237,0.14)] sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <FileText className="h-7 w-7" />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-violet-300">
                      Step 01
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-bold tracking-tight text-slate-950">
                    Build Your CV
                  </h3>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                    Add your education, experience, skills, projects, and
                    achievements with simple guided sections.
                  </p>

                  <div className="mt-7 border-t border-slate-100 pt-5">
                    <Link
                      to="/create-cv"
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-violet-600 transition-colors hover:text-violet-700"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </TiltArticle>

              {/* Step 02 */}
              <TiltArticle
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: 0.25 }}
                whileHover={{ y: -10 }}
                className="group relative z-10"
              >
                <div className="absolute -top-14 left-3 select-none font-display text-7xl font-black leading-none text-indigo-100">
                  02
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white p-7 shadow-[0_22px_65px_rgba(79,70,229,0.12)] transition-all duration-500 group-hover:border-indigo-200 group-hover:shadow-[0_30px_75px_rgba(79,70,229,0.18)] sm:p-8">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl transition-all duration-700 group-hover:bg-violet-200/70" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm transition-transform duration-500 group-hover:scale-110">
                      <Sparkles className="h-7 w-7" />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                      Step 02
                    </span>
                  </div>

                  <h3 className="relative mt-8 text-2xl font-bold tracking-tight text-slate-950">
                    Optimize With AI
                  </h3>

                  <p className="relative mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                    Improve your content, strengthen keywords, and optimize
                    your CV for Applicant Tracking Systems automatically.
                  </p>

                  <div className="relative mt-7 border-t border-slate-100 pt-5">
                    <Link
                      to="/dashboard"
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700"
                    >
                      Optimize Now
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </TiltArticle>

              {/* Step 03 */}
              <TiltArticle
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: 0.4 }}
                whileHover={{ y: -8 }}
                className="group relative z-10 md:mt-20"
              >
                <div className="absolute -top-14 left-3 select-none font-display text-7xl font-black leading-none text-blue-100">
                  03
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition-all duration-500 group-hover:border-blue-200 group-hover:shadow-[0_25px_60px_rgba(37,99,235,0.14)] sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      <Download className="h-7 w-7" />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                      Step 03
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-bold tracking-tight text-slate-950">
                    Download & Apply
                  </h3>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                    Export your polished CV as a professional PDF and start
                    applying to your dream opportunities with confidence.
                  </p>

                  <div className="mt-7 border-t border-slate-100 pt-5">
                    <Link
                      to="/dashboard"
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
                    >
                      Download CV
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </TiltArticle>
            </div>

            {/* Mobile connector */}
            <div className="mx-auto mt-8 h-10 w-px bg-gradient-to-b from-violet-300 to-indigo-300 md:hidden" />
          </div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mt-16 flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>

            <p className="text-sm font-medium text-slate-600">
              Everything you need to build a{' '}
              <span className="font-bold text-slate-900">job-ready CV</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          TEMPLATES
      ========================================================= */}
      <section id="templates" className="container-page py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">Templates</p>

          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Professional Templates Designed for ATS
          </h2>

          <p className="mt-3 text-ink-muted">
            These are the six templates currently selected by the admin for the Home page.
          </p>
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {templates.slice(0, 6).map((t, i) => (
            <TiltArticle
              key={t.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.025 }}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]"
            >
              <div className="relative overflow-hidden bg-slate-100 p-5">
                <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  ATS-friendly
                </span>

                <div className="relative mx-auto aspect-[0.707] w-full max-w-[330px] overflow-hidden rounded-xl bg-white shadow-[0_12px_35px_rgba(15,23,42,0.12)] transition-transform duration-500 group-hover:scale-[1.015]">
                  <div className="h-full w-full overflow-hidden">
                    <TemplatePaper template={t} />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold text-slate-950">
                      {t.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                      {t.description}
                    </p>
                  </div>

                  <span
                    className="mt-1 h-8 w-8 shrink-0 rounded-xl p-2"
                    style={{ backgroundColor: `${t.accent}12` }}
                  >
                    <span
                      className="block h-full w-full rounded-full"
                      style={{ backgroundColor: t.accent }}
                    />
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      ATS
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">
                      Professional
                    </span>
                  </div>

                  <Link to="/templates">
                    <Button variant="outline" size="sm">
                      Use Template
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </TiltArticle>
          ))}
        </div>
      </section>

      {/* =========================================================
          ATS ANALYZER
      ========================================================= */}
      <section id="ats" className="border-y border-slate-200 bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                ATS Analyzer
              </div>

              <h2 className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl">
                Is Your CV
                <span className="block text-violet-600">ATS-Ready?</span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                Analyze your CV and quickly find the keywords, formatting, and
                skills that can improve your chances of getting noticed.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  [Target, 'ATS Compatibility', 'Check how well your CV follows ATS standards.'],
                  [ScanSearch, 'Keyword Match', 'Find important keywords recruiters look for.'],
                  [FileText, 'AI Suggestions', 'Get simple recommendations to improve your CV.'],
                ].map(([Icon, title, text], index) => {
                  const I = Icon as typeof Target;
                  return (
                    <motion.div
                      key={title as string}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.07, duration: 0.35 }}
                      className="flex items-center gap-3.5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600">
                        <I className="h-[18px] w-[18px]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{title as string}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{text as string}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <Link to="/ats-analyzer" className="mt-7 inline-flex">
                <Button variant="accent" className="rounded-xl px-6 py-3 text-sm">
                  <ScanSearch className="h-4 w-4" />
                  Analyze My CV
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <p className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-500" />
                Your data is secure and private
              </p>
            </motion.div>

            {/* Right — compact ATS card */}
            <TiltCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: 0.08 }}
              whileHover={{ y: -8, scale: 1.025 }}
            >
              {(() => {
                const score = homeStats.atsScore ?? 57;
                const label = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Work';
                const copy = score >= 85
                  ? 'Your CV is strongly optimized for ATS systems.'
                  : score >= 70
                    ? 'Your CV has a good ATS foundation.'
                    : score >= 50
                      ? 'A few improvements can make your CV stronger.'
                      : 'Your CV needs some improvements before applying.';
                const radius = 45;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (score / 100) * circumference;

                return (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
                    <div className="border-b border-slate-100 pb-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                        ATS Analysis
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-slate-950">
                        Your CV Score
                      </h3>
                    </div>

                    <div className="flex items-center gap-6 py-5">
                      <div className="relative h-[108px] w-[108px] shrink-0">
                        <svg
                          viewBox="0 0 108 108"
                          className="h-full w-full -rotate-90"
                          aria-hidden="true"
                        >
                          <circle
                            cx="54"
                            cy="54"
                            r={radius}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                          />
                          <motion.circle
                            cx="54"
                            cy="54"
                            r={radius}
                            fill="none"
                            stroke="#6D3DF5"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            whileInView={{ strokeDashoffset: offset }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-display text-2xl font-extrabold leading-none text-violet-600">
                            {score}%
                          </span>
                          <span className="mt-1 text-[8px] font-bold uppercase tracking-wide text-slate-400">
                            ATS Score
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          score >= 85
                            ? 'bg-emerald-50 text-emerald-600'
                            : score >= 70
                              ? 'bg-blue-50 text-blue-600'
                              : score >= 50
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-rose-50 text-rose-600'
                        }`}>
                          {label}
                        </span>
                        <p className="mt-2 max-w-xs text-sm leading-5 text-slate-500">
                          {copy}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {atsMetrics.map((metric, index) => (
                        <div key={metric.label}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700">{metric.label}</span>
                            <span className="text-xs font-bold text-slate-900">{metric.value}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${metric.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.65, delay: index * 0.07 }}
                              className="h-full rounded-full bg-violet-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-emerald-50 p-3.5">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                          Strong Keywords
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {matchedSkills.slice(0, 4).map((skill) => (
                            <span key={skill} className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-emerald-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl bg-amber-50 p-3.5">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
                          Missing Keywords
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {missingSkills.slice(0, 3).map((skill) => (
                            <span key={skill} className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-amber-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </TiltCard>
          </div>
        </div>
      </section>

      {/* =========================================================
          JOB MATCH
      ========================================================= */}
      <section className="relative overflow-hidden border-y border-line bg-surface/40">
        <div className="container-page py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="section-eyebrow">Job Match</p>

            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Match Your CV With The Right Job
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
              Paste a job description and see how closely your CV matches the role.
            </p>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-[1fr_0.92fr]">
            {/* Job description */}
            <TiltCard
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-ink">
                    Job Description
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted">
                    Paste the role you want to apply for.
                  </p>
                </div>

                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  Compare
                </span>
              </div>

              <textarea
                className="input mt-5 min-h-[165px] resize-none"
                placeholder="Paste a job description here…"
                defaultValue={
                  'Software Engineering Student with hands-on experience in React, Node.js, and REST API development. Skilled in building responsive full-stack applications with modern web technologies.'
                }
              />

              <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
                <span>Use a complete job description for better results.</span>
                <span>Ready to analyze</span>
              </div>

              <Button variant="accent" className="mt-5 w-full">
                Analyze Job
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TiltCard>

            {/* Match result */}
            <TiltCard
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    Match Result
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink">
                    Your CV Match
                  </h3>
                </div>

                <div className="text-right">
                  <span className="font-display text-3xl font-bold text-success">
                    91%
                  </span>
                  <p className="text-xs font-medium text-success">Strong Match</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
                  <span>Overall match</span>
                  <span>91%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '91%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full rounded-full bg-success"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-success/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-success">
                    Matched Skills
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {matchedSkills.map((s) => (
                      <span key={s} className="badge bg-success/10 text-success">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-warning/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-warning">
                    Missing Skills
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {missingSkills.map((s) => (
                      <span key={s} className="badge bg-warning/10 text-warning">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-line bg-surface/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Recommended Actions
                </p>

                <ul className="mt-3 space-y-2.5 text-sm text-ink-soft">
                  <li className="flex gap-2.5">
                    <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    Add Docker and AWS to your skills if you have experience.
                  </li>
                  <li className="flex gap-2.5">
                    <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    Mirror relevant wording from the job description.
                  </li>
                  <li className="flex gap-2.5">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    Add measurable achievements related to the role.
                  </li>
                </ul>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA + FOOTER
      ========================================================= */}
      <section className="border-t border-slate-200 bg-white">
        <div className="container-page py-20 sm:py-24">
          <TiltCard
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.022 }}
            className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-14 text-center shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:px-12 sm:py-16"
          >
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:34px_34px]" />

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
                Ready when you are
              </span>

              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to build a better CV?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Create a professional, ATS-friendly CV in minutes with HeightCV.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/create-cv">
                  <Button variant="accent" size="lg" className="w-full sm:w-auto">
                    Create Your CV
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/templates">
                  <Button
                    size="lg"
                    className="w-full border border-white/15 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
                  >
                    Explore Templates
                  </Button>
                </Link>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container-page py-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Link
                to="/"
                className="inline-block text-xl font-bold tracking-tight text-indigo-600"
              >
                Height<span className="text-violet-500">CV</span>
              </Link>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Build. Optimize. Get Hired. Create a professional CV that gets noticed.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">Quick Links</h3>
              <nav className="mt-4 grid gap-3 text-sm text-slate-500">
                <Link to="/templates" className="transition hover:text-indigo-600">
                  Templates
                </Link>
                <a href="#features" className="transition hover:text-indigo-600">
                  Features
                </a>
                <a href="#ats" className="transition hover:text-indigo-600">
                  ATS Analyzer
                </a>
                <a href="#how" className="transition hover:text-indigo-600">
                  How It Works
                </a>
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">Get Started</h3>
              <nav className="mt-4 grid gap-3 text-sm text-slate-500">
                <Link to="/register" className="transition hover:text-indigo-600">
                  Create Your CV
                </Link>
                <Link to="/login" className="transition hover:text-indigo-600">
                  Sign In
                </Link>
                <Link to="/help" className="transition hover:text-indigo-600">
                  Help & Support
                </Link>
              </nav>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 Height CV. All rights reserved.</p>

            <div className="flex items-center gap-5">
              <Link to="/" className="transition hover:text-slate-700">
                Privacy
              </Link>
              <Link to="/" className="transition hover:text-slate-700">
                Terms
              </Link>
              <span>Build. Optimize. Get Hired.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
