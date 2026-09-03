import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Download,
  Eye,
  FileText,
  GripVertical,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Languages,
  Trophy,
  UsersRound,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { cvService } from '../services/cvService';
import { useTemplates } from '../hooks/useTemplates';
import { useToast } from '../context/ToastContext';

import type { CVData } from '../types';

type SectionKey =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'achievements'
  | 'references';

const sections: {
  id: SectionKey;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: <UserRound className="h-4 w-4" />,
  },
  {
    id: 'summary',
    label: 'Professional Summary',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 'experience',
    label: 'Work Experience',
    icon: <BriefcaseBusiness className="h-4 w-4" />,
  },
  {
    id: 'education',
    label: 'Education',
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: <Code2 className="h-4 w-4" />,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <FolderGit2 className="h-4 w-4" />,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: <Award className="h-4 w-4" />,
  },
  {
    id: 'languages',
    label: 'Languages',
    icon: <Languages className="h-4 w-4" />,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: <Trophy className="h-4 w-4" />,
  },
  {
    id: 'references',
    label: 'References',
    icon: <UsersRound className="h-4 w-4" />,
  },
];

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50';

const textareaClass =
  'w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50';

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.035)]">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-slate-950">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

export function CVBuilder() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { templates } = useTemplates('all');
  const toast = useToast();

  const [cv, setCv] = useState<CVData | null>(null);
  const [activeSection, setActiveSection] =
    useState<SectionKey>('personal');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [zoom, setZoom] = useState(82);
  const previewPaneRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(0.72);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);
  const exportPDF = useCallback(() => {
    if (!cv) return;

    const fileName = (cv.personalInfo.fullName || 'Height-AI-CV')
      .trim()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '');

    document.title = `${fileName || 'Height-AI-CV'}-CV`;
    window.print();
    window.setTimeout(() => {
      document.title = 'Height AI';
    }, 1000);
  }, [cv]);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    setLoading(true);
    cvService.get(id).then((data) => {
      if (!mounted) return;
      if (data) setCv(data);
      else toast('Unable to load this CV.', 'error');
    }).catch(() => {
      if (mounted) toast('Unable to load this CV. Please try again.', 'error');
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    const element = previewPaneRef.current;
    if (!element) return;

    const updateScale = () => {
      const availableWidth = Math.max(element.clientWidth - 32, 280);
      const a4WidthPx = 793.7;
      const fit = Math.min(1, availableWidth / a4WidthPx);
      setPreviewScale(fit * (zoom / 82));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [zoom]);

  useEffect(() => {
    if (!cv || searchParams.get('download') !== '1') return;

    setPreviewOpen(true);

    const timer = window.setTimeout(() => {
      exportPDF();
    }, 450);

    return () => window.clearTimeout(timer);
  }, [cv, searchParams]);

  const completion = useMemo(() => {
    if (!cv) return 0;

    const checks = [
      Boolean(cv.personalInfo.fullName),
      Boolean(cv.personalInfo.professionalTitle),
      Boolean(cv.personalInfo.email),
      Boolean(cv.summary),
      cv.workExperience.length > 0,
      cv.education.length > 0,
      cv.skills.length > 0,
      cv.projects.length > 0,
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );
  }, [cv]);

  const updateCv = (patch: Partial<CVData>) => {
    if (!cv) return;

    setCv({
      ...cv,
      ...patch,
      updatedAt: new Date().toISOString(),
    });

    setSaved(false);
  };

  const updatePersonal = (
    key: keyof CVData['personalInfo'],
    value: string,
  ) => {
    if (!cv) return;

    updateCv({
      personalInfo: {
        ...cv.personalInfo,
        [key]: value,
      },
    });
  };

  useEffect(() => {
    if (!cv || !id || !cv.updatedAt) return;
    const timer = window.setTimeout(async () => {
      setAutoSaving(true);
      try {
        await cvService.update(cv);
        setSaved(true);
      } catch {
        setSaved(false);
      } finally {
        setAutoSaving(false);
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [cv, id]);

  useEffect(() => {
    if (!cv || saved) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [cv, saved]);

  const save = async () => {
    if (!cv) return;

    setSaving(true);

    try {
      await cvService.update(cv);
      setSaved(true);
      toast('CV saved successfully.');
    } catch {
      setSaved(false);
      toast('Could not save your CV. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addReference = () => {
    if (!cv) return;
    updateCv({
      references: [
        ...cv.references,
        { id: crypto.randomUUID(), name: '', relationship: '', contact: '' },
      ],
    });
  };

  const removeReference = (referenceId: string) => {
    if (!cv) return;
    updateCv({ references: cv.references.filter((item) => item.id !== referenceId) });
  };

  const addExperience = () => {
    if (!cv) return;

    updateCv({
      workExperience: [
        ...cv.workExperience,
        {
          id: crypto.randomUUID(),
          jobTitle: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    });
  };

  const removeExperience = (experienceId: string) => {
    if (!cv) return;

    updateCv({
      workExperience: cv.workExperience.filter(
        (item) => item.id !== experienceId,
      ),
    });
  };

  const addEducation = () => {
    if (!cv) return;

    updateCv({
      education: [
        ...cv.education,
        {
          id: crypto.randomUUID(),
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    });
  };

  const removeEducation = (educationId: string) => {
    if (!cv) return;

    updateCv({
      education: cv.education.filter(
        (item) => item.id !== educationId,
      ),
    });
  };

  const addProject = () => {
    if (!cv) return;

    updateCv({
      projects: [
        ...cv.projects,
        {
          id: crypto.randomUUID(),
          name: '',
          link: '',
          description: '',
          technologies: '',
        },
      ],
    });
  };

  const removeProject = (projectId: string) => {
    if (!cv) return;

    updateCv({
      projects: cv.projects.filter(
        (item) => item.id !== projectId,
      ),
    });
  };

  const addCertification = () => {
    if (!cv) return;

    updateCv({
      certifications: [
        ...cv.certifications,
        {
          id: crypto.randomUUID(),
          name: '',
          issuer: '',
          date: '',
        },
      ],
    });
  };

  const removeCertification = (certificationId: string) => {
    if (!cv) return;

    updateCv({
      certifications: cv.certifications.filter(
        (item) => item.id !== certificationId,
      ),
    });
  };

  const updateSkill = (index: number, value: string) => {
    if (!cv) return;

    const skills = [...cv.skills];
    skills[index] = value;

    updateCv({ skills });
  };

  const addSkill = () => {
    if (!cv) return;

    updateCv({
      skills: [...cv.skills, ''],
    });
  };

  const removeSkill = (index: number) => {
    if (!cv) return;

    updateCv({
      skills: cv.skills.filter((_, i) => i !== index),
    });
  };

  const updateLanguage = (
    index: number,
    key: 'name' | 'proficiency',
    value: string,
  ) => {
    if (!cv) return;

    const languages = [...cv.languages];

    languages[index] = {
      ...languages[index],
      [key]: value,
    };

    updateCv({ languages });
  };

  const addLanguage = () => {
    if (!cv) return;

    updateCv({
      languages: [
        ...cv.languages,
        {
          id: crypto.randomUUID(),
          name: '',
          proficiency: '',
        },
      ],
    });
  };

  const removeLanguage = (index: number) => {
    if (!cv) return;

    updateCv({
      languages: cv.languages.filter((_, i) => i !== index),
    });
  };

  const addAchievement = () => {
    if (!cv) return;

    updateCv({
      achievements: [
        ...cv.achievements,
        {
          id: crypto.randomUUID(),
          title: '',
          description: '',
        },
      ],
    });
  };

  const removeAchievement = (id: string) => {
    if (!cv) return;

    updateCv({
      achievements: cv.achievements.filter(
        (item) => item.id !== id,
      ),
    });
  };

  const renderEditor = () => {
    if (!cv) return null;

    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-5">
            <SectionCard
              title="Personal Information"
              description="Add the contact details recruiters need."
              icon={<UserRound className="h-4 w-4" />}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  value={cv.personalInfo.fullName}
                  onChange={(v) =>
                    updatePersonal('fullName', v)
                  }
                  placeholder="Your full name"
                />

                <Field
                  label="Professional Title"
                  value={cv.personalInfo.professionalTitle}
                  onChange={(v) =>
                    updatePersonal('professionalTitle', v)
                  }
                  placeholder="Software Engineer"
                />

                <Field
                  label="Email"
                  value={cv.personalInfo.email}
                  onChange={(v) =>
                    updatePersonal('email', v)
                  }
                  placeholder="you@email.com"
                />

                <Field
                  label="Phone"
                  value={cv.personalInfo.phone}
                  onChange={(v) =>
                    updatePersonal('phone', v)
                  }
                  placeholder="+94 77 123 4567"
                />

                <Field
                  label="Location"
                  value={cv.personalInfo.location}
                  onChange={(v) =>
                    updatePersonal('location', v)
                  }
                  placeholder="Colombo, Sri Lanka"
                />

                <Field
                  label="LinkedIn"
                  value={cv.personalInfo.linkedin}
                  onChange={(v) =>
                    updatePersonal('linkedin', v)
                  }
                  placeholder="linkedin.com/in/username"
                />

                <Field
                  label="GitHub"
                  value={cv.personalInfo.github}
                  onChange={(v) =>
                    updatePersonal('github', v)
                  }
                  placeholder="github.com/username"
                />

                <Field
                  label="Portfolio"
                  value={cv.personalInfo.portfolio}
                  onChange={(v) =>
                    updatePersonal('portfolio', v)
                  }
                  placeholder="yourportfolio.dev"
                />
              </div>
            </SectionCard>

            <SectionCard
              title="CV Title"
              description="This is only visible inside your dashboard."
              icon={<FileText className="h-4 w-4" />}
            >
              <Field
                label="Document Name"
                value={cv.title}
                onChange={(v) =>
                  updateCv({ title: v })
                }
                placeholder="Software Engineer CV"
              />
            </SectionCard>
          </div>
        );

      case 'summary':
        return (
          <SectionCard
            title="Professional Summary"
            description="Create a concise introduction that highlights your strongest value."
            icon={<FileText className="h-4 w-4" />}
          >
            <textarea
              value={cv.summary}
              onChange={(e) =>
                updateCv({
                  summary: e.target.value,
                })
              }
              rows={12}
              placeholder="Write a strong professional summary..."
              className={textareaClass}
            />

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Recommended: 2–4 sentences</span>
              <span>{cv.summary.length} characters</span>
            </div>
          </SectionCard>
        );

      case 'experience':
        return (
          <div className="space-y-4">
            {cv.workExperience.map((item, index) => (
              <SectionCard
                key={item.id}
                title={`Experience ${index + 1}`}
                description="Show measurable impact, responsibilities and achievements."
                icon={
                  <BriefcaseBusiness className="h-4 w-4" />
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <GripVertical className="h-4 w-4" />
                      Drag to reorder
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeExperience(item.id)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Job Title"
                      value={item.jobTitle}
                      onChange={(v) =>
                        updateCv({
                          workExperience:
                            cv.workExperience.map((x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    jobTitle: v,
                                  }
                                : x,
                            ),
                        })
                      }
                      placeholder="Software Engineer"
                    />

                    <Field
                      label="Company"
                      value={item.company}
                      onChange={(v) =>
                        updateCv({
                          workExperience:
                            cv.workExperience.map((x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    company: v,
                                  }
                                : x,
                            ),
                        })
                      }
                      placeholder="Company name"
                    />

                    <Field
                      label="Location"
                      value={item.location}
                      onChange={(v) =>
                        updateCv({
                          workExperience:
                            cv.workExperience.map((x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    location: v,
                                  }
                                : x,
                            ),
                        })
                      }
                      placeholder="Colombo / Remote"
                    />

                    <label className="flex items-end gap-2 pb-3 text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={item.current}
                        onChange={(e) =>
                          updateCv({
                            workExperience:
                              cv.workExperience.map((x) =>
                                x.id === item.id
                                  ? {
                                      ...x,
                                      current:
                                        e.target.checked,
                                    }
                                  : x,
                              ),
                          })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                      />
                      Currently working here
                    </label>

                    <Field
                      label="Start Date"
                      value={item.startDate}
                      onChange={(v) =>
                        updateCv({
                          workExperience:
                            cv.workExperience.map((x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    startDate: v,
                                  }
                                : x,
                            ),
                        })
                      }
                      placeholder="2024-01"
                    />

                    <Field
                      label="End Date"
                      value={item.endDate}
                      onChange={(v) =>
                        updateCv({
                          workExperience:
                            cv.workExperience.map((x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    endDate: v,
                                  }
                                : x,
                            ),
                        })
                      }
                      placeholder="2026-06"
                    />
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-slate-600">
                      Description
                    </span>

                    <textarea
                      rows={7}
                      value={item.description}
                      onChange={(e) =>
                        updateCv({
                          workExperience:
                            cv.workExperience.map((x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    description:
                                      e.target.value,
                                  }
                                : x,
                            ),
                        })
                      }
                      placeholder="Describe responsibilities and measurable achievements..."
                      className={textareaClass}
                    />
                  </label>
                </div>
              </SectionCard>
            ))}

            <button
              type="button"
              onClick={addExperience}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4" />
              Add Work Experience
            </button>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            {cv.education.map((item, index) => (
              <SectionCard
                key={item.id}
                title={`Education ${index + 1}`}
                description="Add your academic background and relevant details."
                icon={
                  <GraduationCap className="h-4 w-4" />
                }
              >
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        removeEducation(item.id)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Degree"
                      value={item.degree}
                      onChange={(v) =>
                        updateCv({
                          education: cv.education.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    degree: v,
                                  }
                                : x,
                          ),
                        })
                      }
                      placeholder="BSc in Information Technology"
                    />

                    <Field
                      label="Institution"
                      value={item.institution}
                      onChange={(v) =>
                        updateCv({
                          education: cv.education.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    institution: v,
                                  }
                                : x,
                          ),
                        })
                      }
                      placeholder="University name"
                    />

                    <Field
                      label="Location"
                      value={item.location}
                      onChange={(v) =>
                        updateCv({
                          education: cv.education.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    location: v,
                                  }
                                : x,
                          ),
                        })
                      }
                      placeholder="Sri Lanka"
                    />

                    <Field
                      label="Start Date"
                      value={item.startDate}
                      onChange={(v) =>
                        updateCv({
                          education: cv.education.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    startDate: v,
                                  }
                                : x,
                          ),
                        })
                      }
                      placeholder="2024-01"
                    />

                    <Field
                      label="End Date"
                      value={item.endDate}
                      onChange={(v) =>
                        updateCv({
                          education: cv.education.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    endDate: v,
                                  }
                                : x,
                          ),
                        })
                      }
                      placeholder="2028-12"
                    />
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-slate-600">
                      Description
                    </span>

                    <textarea
                      rows={5}
                      value={item.description}
                      onChange={(e) =>
                        updateCv({
                          education: cv.education.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    description:
                                      e.target.value,
                                  }
                                : x,
                          ),
                        })
                      }
                      placeholder="Relevant coursework, achievements, GPA..."
                      className={textareaClass}
                    />
                  </label>
                </div>
              </SectionCard>
            ))}

            <button
              type="button"
              onClick={addEducation}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4" />
              Add Education
            </button>
          </div>
        );

      case 'skills':
        return (
          <SectionCard
            title="Skills"
            description="Add technical and professional skills relevant to your target role."
            icon={<Code2 className="h-4 w-4" />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {cv.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex gap-2"
                >
                  <input
                    value={skill}
                    onChange={(e) =>
                      updateSkill(
                        index,
                        e.target.value,
                      )
                    }
                    placeholder="React"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeSkill(index)
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSkill}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </button>
          </SectionCard>
        );

      case 'projects':
        return (
          <div className="space-y-4">
            {cv.projects.map((item, index) => (
              <SectionCard
                key={item.id}
                title={`Project ${index + 1}`}
                description="Showcase projects that prove your practical skills."
                icon={
                  <FolderGit2 className="h-4 w-4" />
                }
              >
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        removeProject(item.id)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Project Name"
                      value={item.name}
                      onChange={(v) =>
                        updateCv({
                          projects: cv.projects.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    name: v,
                                  }
                                : x,
                          ),
                        })
                      }
                      placeholder="My Portfolio"
                    />

                    <Field
                      label="Project Link"
                      value={item.link}
                      onChange={(v) =>
                        updateCv({
                          projects: cv.projects.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    link: v,
                                  }
                                : x,
                          ),
                        })
                      }
                      placeholder="github.com/username/project"
                    />

                    <div className="sm:col-span-2">
                      <Field
                        label="Technologies"
                        value={item.technologies}
                        onChange={(v) =>
                          updateCv({
                            projects:
                              cv.projects.map(
                                (x) =>
                                  x.id === item.id
                                    ? {
                                        ...x,
                                        technologies: v,
                                      }
                                    : x,
                              ),
                          })
                        }
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-slate-600">
                      Description
                    </span>

                    <textarea
                      rows={6}
                      value={item.description}
                      onChange={(e) =>
                        updateCv({
                          projects: cv.projects.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    description:
                                      e.target.value,
                                  }
                                : x,
                          ),
                        })
                      }
                      placeholder="Describe what you built, the problem it solved and the result..."
                      className={textareaClass}
                    />
                  </label>
                </div>
              </SectionCard>
            ))}

            <button
              type="button"
              onClick={addProject}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-4">
            {cv.certifications.map((item, index) => (
              <SectionCard
                key={item.id}
                title={`Certification ${index + 1}`}
                icon={
                  <Award className="h-4 w-4" />
                }
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field
                    label="Certification"
                    value={item.name}
                    onChange={(v) =>
                      updateCv({
                        certifications:
                          cv.certifications.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    name: v,
                                  }
                                : x,
                          ),
                      })
                    }
                    placeholder="AWS Certified..."
                  />

                  <Field
                    label="Issuer"
                    value={item.issuer}
                    onChange={(v) =>
                      updateCv({
                        certifications:
                          cv.certifications.map(
                            (x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    issuer: v,
                                  }
                                : x,
                          ),
                      })
                    }
                    placeholder="Amazon Web Services"
                  />

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Field
                        label="Date"
                        value={item.date}
                        onChange={(v) =>
                          updateCv({
                            certifications:
                              cv.certifications.map(
                                (x) =>
                                  x.id === item.id
                                    ? {
                                        ...x,
                                        date: v,
                                      }
                                    : x,
                              ),
                          })
                        }
                        placeholder="2026-08"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeCertification(
                          item.id,
                        )
                      }
                      className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </SectionCard>
            ))}

            <button
              type="button"
              onClick={addCertification}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4" />
              Add Certification
            </button>
          </div>
        );

      case 'languages':
        return (
          <SectionCard
            title="Languages"
            description="List languages and your proficiency level."
            icon={<Languages className="h-4 w-4" />}
          >
            <div className="space-y-3">
              {cv.languages.map(
                (language, index) => (
                  <div
                    key={language.id}
                    className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <input
                      value={language.name}
                      onChange={(e) =>
                        updateLanguage(
                          index,
                          'name',
                          e.target.value,
                        )
                      }
                      placeholder="English"
                      className={inputClass}
                    />

                    <input
                      value={
                        language.proficiency
                      }
                      onChange={(e) =>
                        updateLanguage(
                          index,
                          'proficiency',
                          e.target.value,
                        )
                      }
                      placeholder="Professional"
                      className={inputClass}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeLanguage(index)
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={addLanguage}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4" />
              Add Language
            </button>
          </SectionCard>
        );

      case 'achievements':
        return (
          <SectionCard
            title="Achievements"
            description="Highlight awards, leadership, publications or important accomplishments."
            icon={<Trophy className="h-4 w-4" />}
          >
            <div className="space-y-4">
              {cv.achievements.map(
                (item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        Achievement {index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeAchievement(
                            item.id,
                          )
                        }
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <Field
                        label="Title"
                        value={item.title}
                        onChange={(v) =>
                          updateCv({
                            achievements:
                              cv.achievements.map(
                                (x) =>
                                  x.id === item.id
                                    ? {
                                        ...x,
                                        title: v,
                                      }
                                    : x,
                              ),
                          })
                        }
                        placeholder="Hackathon Winner"
                      />

                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          updateCv({
                            achievements:
                              cv.achievements.map(
                                (x) =>
                                  x.id === item.id
                                    ? {
                                        ...x,
                                        description:
                                          e.target.value,
                                      }
                                    : x,
                              ),
                          })
                        }
                        rows={4}
                        placeholder="Describe the achievement..."
                        className={textareaClass}
                      />
                    </div>
                  </div>
                ),
              )}

              <button
                type="button"
                onClick={addAchievement}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600"
              >
                <Plus className="h-4 w-4" />
                Add Achievement
              </button>
            </div>
          </SectionCard>
        );

      case 'references':
        return (
          <div className="space-y-4">
            <SectionCard
              title="References"
              description="Add professional references only when requested by an employer."
              icon={<UsersRound className="h-4 w-4" />}
            >
              {cv.references.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <UsersRound className="mx-auto h-7 w-7 text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">No references added</p>
                  <p className="mt-1 text-xs text-slate-400">References are optional and can be added later.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cv.references.map((item, index) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Reference {index + 1}</span>
                        <button type="button" onClick={() => removeReference(item.id)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Name" value={item.name} onChange={(v) => updateCv({ references: cv.references.map((x) => x.id === item.id ? { ...x, name: v } : x) })} placeholder="John Smith" />
                        <Field label="Relationship" value={item.relationship} onChange={(v) => updateCv({ references: cv.references.map((x) => x.id === item.id ? { ...x, relationship: v } : x) })} placeholder="Former Manager" />
                        <div className="sm:col-span-2">
                          <Field label="Contact" value={item.contact} onChange={(v) => updateCv({ references: cv.references.map((x) => x.id === item.id ? { ...x, contact: v } : x) })} placeholder="email@example.com · +94..." />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={addReference} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600">
                <Plus className="h-4 w-4" /> Add Reference
              </button>
            </SectionCard>
          </div>
        );

      default:
        return null;
    }
  };

  /*
   * ============================================================
   * LIVE CV PREVIEW
   * ============================================================
   */

  const Preview = ({
    modal = false,
  }: {
    modal?: boolean;
  }) => {
    if (!cv) return null;

    const template = String(
      cv.template || 'minimal',
    ).toLowerCase();

    const name =
      cv.personalInfo.fullName || 'Your Name';

    const title =
      cv.personalInfo.professionalTitle ||
      'Professional Title';

    const contactItems = [
      cv.personalInfo.email,
      cv.personalInfo.phone,
      cv.personalInfo.location,
      cv.personalInfo.linkedin,
      cv.personalInfo.github,
      cv.personalInfo.portfolio,
    ].filter(Boolean);

    const isModern =
      template.includes('modern');

    const isStudent =
      template.includes('student');

    const isDeveloper =
      template.includes('software') ||
      template.includes('developer') ||
      template.includes('engineer');

    const isExecutive =
      template.includes('executive');

    const isCreative =
      template.includes('creative-developer') ||
      template.includes('creative');

    const dbAccent = templates.find(
      (t) => t.id === template,
    )?.accent;

    const accent =
      dbAccent ||
      (isStudent
        ? '#059669'
        : isModern || isDeveloper
          ? '#4f46e5'
          : '#111827');

    const SectionTitle = ({
      children,
    }: {
      children: React.ReactNode;
    }) => (
      <h2
        className="mb-2 border-b pb-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em]"
        style={{
          color: accent,
          borderColor: `${accent}30`,
        }}
      >
        {children}
      </h2>
    );

    const Experience = () => {
      if (!cv.workExperience.length) return null;

      return (
        <section className="mt-5">
          <SectionTitle>
            Experience
          </SectionTitle>

          <div className="space-y-4">
            {cv.workExperience.map((item) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-900">
                      {item.jobTitle ||
                        'Job Title'}
                    </h3>

                    <p className="text-[10px] font-semibold text-slate-600">
                      {item.company ||
                        'Company'}

                      {item.location
                        ? ` · ${item.location}`
                        : ''}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-[9px] text-slate-400">
                    {item.startDate ||
                      'Start'}{' '}
                    –{' '}
                    {item.current
                      ? 'Present'
                      : item.endDate ||
                        'End'}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-1.5 text-[9px] leading-4 text-slate-600">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    };

    const Education = () => {
      if (!cv.education.length) return null;

      return (
        <section className="mt-5">
          <SectionTitle>
            Education
          </SectionTitle>

          <div className="space-y-3">
            {cv.education.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-900">
                      {item.degree || 'Degree'}
                    </h3>

                    <p className="text-[9px] text-slate-600">
                      {item.institution ||
                        'Institution'}

                      {item.location
                        ? ` · ${item.location}`
                        : ''}
                    </p>
                  </div>

                  <span className="text-[9px] text-slate-400">
                    {item.startDate} –{' '}
                    {item.endDate}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-1 text-[9px] leading-4 text-slate-500">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    };

    const Skills = () => {
      const skills = cv.skills.filter(
        Boolean,
      );

      if (!skills.length) return null;

      return (
        <section className="mt-5">
          <SectionTitle>
            Skills
          </SectionTitle>

          <div className="flex flex-wrap gap-1.5">
            {skills.map(
              (skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-700"
                >
                  {skill}
                </span>
              ),
            )}
          </div>
        </section>
      );
    };

    const Projects = () => {
      if (!cv.projects.length) return null;

      return (
        <section className="mt-5">
          <SectionTitle>
            Projects
          </SectionTitle>

          <div className="space-y-3">
            {cv.projects.map((item) => (
              <div key={item.id}>
                <h3 className="text-[10px] font-bold text-slate-900">
                  {item.name ||
                    'Project Name'}
                </h3>

                {item.technologies && (
                  <p
                    className="text-[9px] font-semibold"
                    style={{
                      color: accent,
                    }}
                  >
                    {item.technologies}
                  </p>
                )}

                {item.description && (
                  <p className="mt-1 text-[9px] leading-4 text-slate-600">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    };

    const Certifications = () => {
      if (!cv.certifications.length)
        return null;

      return (
        <section className="mt-5">
          <SectionTitle>
            Certifications
          </SectionTitle>

          <div className="space-y-2">
            {cv.certifications.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3 text-[9px]"
                >
                  <span className="font-semibold text-slate-800">
                    {item.name}
                  </span>

                  <span className="text-slate-500">
                    {item.issuer}

                    {item.date &&
                      ` · ${item.date}`}
                  </span>
                </div>
              ),
            )}
          </div>
        </section>
      );
    };

    const Languages = () => {
      if (!cv.languages.length)
        return null;

      return (
        <section className="mt-5">
          <SectionTitle>
            Languages
          </SectionTitle>

          <div className="flex flex-wrap gap-3 text-[9px] text-slate-600">
            {cv.languages.map(
              (language) => (
                <span key={language.id}>
                  <strong className="text-slate-800">
                    {language.name}
                  </strong>{' '}
                  ·{' '}
                  {language.proficiency}
                </span>
              ),
            )}
          </div>
        </section>
      );
    };

    const Achievements = () => {
      if (!cv.achievements.length)
        return null;

      return (
        <section className="mt-5">
          <SectionTitle>
            Achievements
          </SectionTitle>

          <div className="space-y-2">
            {cv.achievements.map(
              (item) => (
                <div key={item.id}>
                  <p className="text-[9px] font-bold text-slate-800">
                    {item.title}
                  </p>

                  <p className="text-[9px] leading-4 text-slate-600">
                    {item.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>
      );
    };

    const References = () => {
      if (!cv.references.length) return null;

      return (
        <section className="mt-5">
          <SectionTitle>References</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {cv.references.map((item) => (
              <div key={item.id}>
                <p className="text-[9px] font-bold text-slate-800">{item.name}</p>
                {item.relationship && <p className="text-[9px] text-slate-600">{item.relationship}</p>}
                {item.contact && <p className="text-[9px] text-slate-500">{item.contact}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    };

    /*
     * CREATIVE DEVELOPER TEMPLATE
     */
    if (isCreative) {
      return (
        <div
          id={modal ? 'cv-print-target' : undefined}
          className={`mx-auto cv-a4-page w-full overflow-hidden bg-[#f7f7fb] text-slate-900 ${
            modal
              ? 'max-w-[850px] rounded-xl shadow-2xl'
              : 'rounded-xl shadow-[0_8px_35px_rgba(15,23,42,0.12)]'
          }`}
        >
          <div className="min-h-[1000px] p-7 sm:p-9">
            <header className="relative overflow-hidden rounded-[28px] bg-slate-950 p-7 text-white shadow-lg sm:p-9">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-500/25 blur-3xl" />
              <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-violet-200">
                    Creative Developer
                  </div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    {name}
                  </h1>
                  <p className="mt-2 text-sm font-bold text-violet-300">
                    {title}
                  </p>
                </div>
                {contactItems.length > 0 && (
                  <div className="max-w-[330px] rounded-2xl border border-white/10 bg-white/5 p-4 text-[9px] leading-5 text-slate-300">
                    {contactItems.map((item, index) => (
                      <div key={`${item}-${index}`}>{item}</div>
                    ))}
                  </div>
                )}
              </div>
            </header>

            <div className="mt-6 grid gap-6 md:grid-cols-[29%_1fr]">
              <aside className="space-y-5 rounded-[24px] border border-violet-100 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-violet-600">Skills</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cv.skills.filter(Boolean).map((skill, index) => (
                      <span key={`${skill}-${index}`} className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-[8px] font-bold text-violet-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {cv.languages.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-violet-600">Languages</p>
                    <div className="mt-3 space-y-2 text-[9px] text-slate-600">
                      {cv.languages.map((language) => (
                        <div key={language.id} className="flex justify-between gap-2">
                          <span className="font-semibold text-slate-800">{language.name}</span>
                          <span>{language.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cv.education.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-violet-600">Education</p>
                    <div className="mt-3 space-y-3">
                      {cv.education.map((item) => (
                        <div key={item.id}>
                          <p className="text-[9px] font-bold text-slate-900">{item.degree || 'Degree'}</p>
                          <p className="mt-0.5 text-[8px] leading-4 text-slate-500">{item.institution || 'Institution'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </aside>

              <main className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                {cv.summary && (
                  <section>
                    <SectionTitle>Profile</SectionTitle>
                    <p className="text-[10px] leading-5 text-slate-600">{cv.summary}</p>
                  </section>
                )}
                <Experience />
                <Projects />
                <Certifications />
                <Achievements />
                <References />
              </main>
            </div>
          </div>
        </div>
      );
    }

    /*
     * MODERN TEMPLATE
     */
    if (isModern) {
      return (
        <div
          id={modal ? 'cv-print-target' : undefined}
          className={`mx-auto flex w-full overflow-hidden bg-white ${
            modal
              ? 'max-w-[850px] rounded-xl shadow-2xl'
              : 'rounded-xl shadow-[0_8px_35px_rgba(15,23,42,0.12)]'
          }`}
        >
          <aside className="w-[31%] shrink-0 bg-slate-950 p-6 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-lg font-black">
              {name
                .split(' ')
                .map(
                  (word) =>
                    word[0],
                )
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>

            <div className="mt-7">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-400">
                Contact
              </p>

              <div className="mt-2 space-y-1.5 text-[9px] leading-4 text-slate-300">
                {contactItems.map(
                  (item, index) => (
                    <div
                      key={`${item}-${index}`}
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>

            {cv.skills.length > 0 && (
              <div className="mt-7">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-400">
                  Skills
                </p>

                <div className="mt-3 space-y-2 text-[9px] text-slate-300">
                  {cv.skills
                    .filter(Boolean)
                    .map(
                      (
                        skill,
                        index,
                      ) => (
                        <div
                          key={`${skill}-${index}`}
                        >
                          {skill}
                        </div>
                      ),
                    )}
                </div>
              </div>
            )}

            {cv.languages.length >
              0 && (
              <div className="mt-7">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-400">
                  Languages
                </p>

                <div className="mt-3 space-y-2 text-[9px] text-slate-300">
                  {cv.languages.map(
                    (language) => (
                      <div
                        key={
                          language.id
                        }
                      >
                        {language.name}
                        {language.proficiency
                          ? ` — ${language.proficiency}`
                          : ''}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </aside>

          <main className="min-h-[1000px] flex-1 p-8">
            <header className="border-b-2 border-indigo-600 pb-5">
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                {name}
              </h1>

              <p className="mt-1 text-sm font-bold text-indigo-600">
                {title}
              </p>
            </header>

            {cv.summary && (
              <section className="mt-5">
                <SectionTitle>
                  Professional Summary
                </SectionTitle>

                <p className="text-[10px] leading-5 text-slate-600">
                  {cv.summary}
                </p>
              </section>
            )}

            <Experience />
            <Education />
            <Projects />
            <Certifications />
            <Achievements />
            <References />
          </main>
        </div>
      );
    }

    /*
     * STUDENT TEMPLATE
     */
    if (isStudent) {
      return (
        <div
          id={modal ? 'cv-print-target' : undefined}
          className={`mx-auto cv-a4-page w-full overflow-hidden bg-white ${
            modal
              ? 'max-w-[850px] rounded-xl shadow-2xl'
              : 'rounded-xl shadow-[0_8px_35px_rgba(15,23,42,0.12)]'
          }`}
        >
          <div className="min-h-[1000px] p-8 sm:p-10">
            <header className="rounded-2xl bg-emerald-50 p-6">
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                {name}
              </h1>

              <p className="mt-1 text-sm font-bold text-emerald-600">
                {title}
              </p>

              {contactItems.length >
                0 && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
                  {contactItems.map(
                    (item, index) => (
                      <span
                        key={`${item}-${index}`}
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              )}
            </header>

            {cv.summary && (
              <section className="mt-6">
                <SectionTitle>
                  Profile
                </SectionTitle>

                <p className="text-[10px] leading-5 text-slate-600">
                  {cv.summary}
                </p>
              </section>
            )}

            <Education />
            <Projects />
            <Skills />
            <Experience />
            <Certifications />
            <Languages />
            <Achievements />
            <References />
          </div>
        </div>
      );
    }

    /*
     * SOFTWARE / DEVELOPER TEMPLATE
     */
    if (isDeveloper) {
      return (
        <div
          id={modal ? 'cv-print-target' : undefined}
          className={`mx-auto cv-a4-page w-full overflow-hidden bg-white ${
            modal
              ? 'max-w-[850px] rounded-xl shadow-2xl'
              : 'rounded-xl shadow-[0_8px_35px_rgba(15,23,42,0.12)]'
          }`}
        >
          <div className="min-h-[1000px] p-8 sm:p-10">
            <header className="border-l-4 border-indigo-600 pl-5">
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                {name}
              </h1>

              <p className="mt-1 text-sm font-black uppercase tracking-wide text-indigo-600">
                {title}
              </p>

              {contactItems.length >
                0 && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
                  {contactItems.map(
                    (item, index) => (
                      <span
                        key={`${item}-${index}`}
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              )}
            </header>

            {cv.summary && (
              <section className="mt-6">
                <SectionTitle>
                  Profile
                </SectionTitle>

                <p className="text-[10px] leading-5 text-slate-600">
                  {cv.summary}
                </p>
              </section>
            )}

            <Experience />
            <Skills />
            <Projects />
            <Education />
            <Certifications />
            <Achievements />
            <References />
          </div>
        </div>
      );
    }

    /*
     * DEFAULT / MINIMAL / PROFESSIONAL
     */
    return (
      <div
        id={modal ? 'cv-print-target' : undefined}
        className={`mx-auto cv-a4-page w-full overflow-hidden bg-white text-slate-900 ${
          modal
            ? 'max-w-[850px] rounded-xl shadow-2xl'
            : 'rounded-xl shadow-[0_8px_35px_rgba(15,23,42,0.12)]'
        }`}
      >
        <div className="min-h-[1000px] p-8 sm:p-10">
          <header
            className={`border-b-2 pb-5 ${
              isExecutive ? 'border-b-4 text-center' : ''
            }`}
            style={{
              borderColor: accent,
            }}
          >
            <h1
              className={`text-3xl font-extrabold tracking-tight text-slate-950 ${
                isExecutive
                  ? 'font-display uppercase tracking-[0.14em]'
                  : ''
              }`}
            >
              {name}
            </h1>

            <p
              className={`mt-1 text-sm font-semibold ${
                isExecutive
                  ? 'text-[11px] uppercase tracking-[0.22em]'
                  : ''
              }`}
              style={{
                color: accent,
              }}
            >
              {title}
            </p>

            {contactItems.length >
              0 && (
              <div
                className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 ${
                  isExecutive ? 'justify-center' : ''
                }`}
              >
                {contactItems.map(
                  (item, index) => (
                    <span
                      key={`${item}-${index}`}
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            )}
          </header>

          {cv.summary && (
            <section className="mt-5">
              <SectionTitle>
                Professional Summary
              </SectionTitle>

              <p className="text-[10px] leading-5 text-slate-600">
                {cv.summary}
              </p>
            </section>
          )}

          <Experience />
          <Education />
          <Skills />
          <Projects />
          <Certifications />
          <Languages />
          <Achievements />
        </div>
      </div>
    );
  };

  if (!cv) {
    return (
      <DashboardLayout
        title="Edit CV"
        subtitle="Loading your CV..."
      >
        <div className="flex min-h-[600px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading CV editor...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Edit CV"
      subtitle="Build a professional, ATS-friendly CV"
    >
      <div className="cv-builder-editor -mx-4 -mt-4 flex min-h-[calc(100vh-120px)] flex-col overflow-hidden bg-slate-50 lg:-mx-6 lg:-mt-6">
        {/* TOP BAR */}
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-xl lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate('/dashboard')
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-sm font-extrabold text-slate-950">
                    {cv.title ||
                      'Untitled CV'}
                  </h1>

                  {saved ? (
                    <span className="hidden items-center gap-1 text-[11px] font-semibold text-emerald-600 sm:flex">
                      <Check className="h-3.5 w-3.5" />
                      {autoSaving ? 'Saving…' : 'Saved'}
                    </span>
                  ) : (
                    <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                      Unsaved changes
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{
                        width: `${completion}%`,
                      }}
                    />
                  </div>

                  <span className="text-[10px] font-bold text-slate-400">
                    {completion}% complete
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 md:flex">
                <button
                  type="button"
                  onClick={() =>
                    setZoom((z) =>
                      Math.max(60, z - 5),
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>

                <span className="w-10 text-center text-[10px] font-bold text-slate-500">
                  {zoom}%
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setZoom((z) =>
                      Math.min(110, z + 5),
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewOpen(true)
                }
                className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 md:flex"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>

              <Button
                variant="accent"
                size="sm"
                onClick={save}
                disabled={saving}
                className="h-10 rounded-xl px-4"
              >
                {saving ? (
                  <>
                    <Save className="h-4 w-4 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* THREE COLUMN EDITOR */}
        <div className="grid flex-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(560px,1fr)_480px]">
          {/* LEFT */}
          <aside className="hidden border-r border-slate-200 bg-white lg:block">
            <div className="sticky top-[69px] p-4">
              <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2.5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                  CV Sections
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">Build your CV step by step</p>
              </div>

              <nav className="space-y-1">
                {sections.map(
                  (section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          section.id,
                        )
                      }
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition ${
                        activeSection ===
                        section.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span
                        className={
                          activeSection ===
                          section.id
                            ? 'text-indigo-600'
                            : 'text-slate-400'
                        }
                      >
                        {section.icon}
                      </span>

                      <span className="flex-1">
                        {section.label}
                      </span>

                      {activeSection ===
                        section.id && (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ),
                )}
              </nav>

              <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />

                  <p className="text-xs font-extrabold text-indigo-900">
                    ATS Score
                  </p>
                </div>

                <div className="mt-3 flex items-end gap-1">
                  <span className="text-3xl font-black text-indigo-700">
                    {cv.atsScore || 0}
                  </span>

                  <span className="pb-1 text-xs font-bold text-indigo-400">
                    / 100
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{
                      width: `${
                        cv.atsScore || 0
                      }%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] leading-4 text-indigo-600">
                  Complete your sections to improve your CV quality.
                </p>
              </div>
            </div>
          </aside>

          {/* CENTER EDITOR */}
          <main className="min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8fafc_42%,#f1f5f9_100%)]">
            <div className="mx-auto max-w-[820px] p-4 sm:p-6 lg:p-8 xl:p-9">
              {/* MOBILE SELECT */}
              <div className="mb-5 lg:hidden">
                <Select
                  ariaLabel="Jump to section"
                  value={activeSection}
                  onChange={(v) =>
                    setActiveSection(v as SectionKey)
                  }
                  options={sections.map((section) => ({
                    value: section.id,
                    label: section.label,
                  }))}
                />
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
                  {
                    sections.find(
                      (s) =>
                        s.id ===
                        activeSection,
                    )?.label
                  }
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  Customize your CV
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Make every section clear, professional and ATS-friendly.
                </p>
              </div>

              {renderEditor()}
            </div>
          </main>

          {/* RIGHT LIVE PREVIEW */}
          <aside className="hidden border-l border-slate-200/80 bg-[#eef2f7] xl:block">
            <div className="sticky top-[69px] flex h-[calc(100vh-69px)] flex-col overflow-hidden">
              <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                    <Eye className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Live Preview</p>
                    <p className="text-[9px] text-slate-400">A4 document preview</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="rounded-lg px-2.5 py-2 text-[10px] font-extrabold text-indigo-600 transition hover:bg-indigo-50"
                >
                  Full screen
                </button>
              </div>

              <div ref={previewPaneRef} className="min-h-0 flex-1 overflow-auto bg-[#eef2f7] px-4 py-6 sm:px-5">
                <div className="flex min-h-full justify-center">
                  <div
                    className="cv-a4-preview-shell relative shrink-0"
                    style={{
                      width: `${793.7 * previewScale}px`,
                      height: `${1122.5 * previewScale}px`,
                    }}
                  >
                    <div
                      className="absolute left-0 top-0"
                      style={{
                        width: '210mm',
                        height: '297mm',
                        transform: `scale(${previewScale})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      <Preview />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* MOBILE PREVIEW */}
        <button
          type="button"
          onClick={() =>
            setPreviewOpen(true)
          }
          className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl xl:hidden"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>

      {/* FULL SCREEN PREVIEW */}
      {previewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6">
          <div className="flex h-full w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-indigo-600" />

                <span className="text-sm font-extrabold text-slate-900">
                  CV Preview
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportPDF}
                  className="hidden h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 sm:flex"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export PDF
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewOpen(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-200/70 p-4 sm:p-8">
              <div className="flex min-h-full justify-center">
                <div className="cv-a4-preview-shell relative shrink-0" style={{ width: `${793.7 * Math.min(1, previewScale * 1.12)}px`, height: `${1122.5 * Math.min(1, previewScale * 1.12)}px` }}>
                  <div
                    className="absolute left-0 top-0"
                    style={{
                      width: '210mm',
                      height: '297mm',
                      transform: `scale(${Math.min(1, previewScale * 1.12)})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <Preview modal />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}