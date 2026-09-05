import type { TemplateMeta } from '../services/api';

/**
 * Renders the actual visual design of a CV template.
 *
 * Each template `id` (backend slug) maps to a genuinely distinct layout.
 * This is the single source of truth for template previews — used by both
 * the Home page featured section and the Dashboard → Templates library so
 * the admin-selected designs always look the same in both places.
 *
 * `large` switches from the compact card thumbnail to the full-size preview
 * used inside the modal.
 */
export function TemplatePaper({
  template,
  large = false,
}: {
  template: TemplateMeta;
  large?: boolean;
}) {
  const id = template.id;

  /* MINIMAL ATS */
  if (id === 'minimal') {
    return (
      <div
        className={`bg-white text-slate-900 ${
          large ? 'min-h-[1050px] p-10 sm:p-12' : 'h-full p-5'
        }`}
      >
        <div className={`text-center ${large ? 'pb-7' : 'pb-4'}`}>
          <div
            className={`mx-auto font-black tracking-tight text-slate-950 ${
              large ? 'text-4xl' : 'text-[13px]'
            }`}
          >
            MICHAEL HARRIS
          </div>

          <div
            className={`font-bold text-slate-800 ${
              large ? 'mt-3 text-base' : 'mt-1.5 text-[7px]'
            }`}
          >
            Digital Marketing | SEO | SEM | Content Marketing
          </div>

          <div
            className={`text-slate-600 ${
              large ? 'mt-3 text-xs' : 'mt-1.5 text-[5px]'
            }`}
          >
            Sydney, Australia | michael.harris@email.com |
            +61 412 345 678 | linkedin.com/in/michaelharris
          </div>
        </div>

        {[
          {
            title: 'PROFESSIONAL SUMMARY',
            content:
              'Results-oriented marketing professional with over 5 years of experience in digital marketing, brand strategy, and content creation. Proven ability to drive brand growth, increase online engagement, and deliver data-driven results.',
          },
          {
            title: 'WORK EXPERIENCE',
            content: 'Marketing Manager — XYZ Corporation, Sydney, NSW',
          },
          {
            title: 'EDUCATION',
            content: 'Bachelor of Marketing — University of Sydney, Sydney, NSW',
          },
          {
            title: 'SKILLS',
            content:
              'Digital Marketing Strategy, SEO & SEM, Google Analytics, Social Media Marketing, Content Creation',
          },
          {
            title: 'CERTIFICATIONS',
            content:
              'Google Analytics Certified, Facebook Blueprint Certification, HubSpot Inbound Marketing',
          },
        ].map((section) => (
          <div key={section.title} className={large ? 'mt-7' : 'mt-4'}>
            <div
              className={`border-b border-slate-400 font-black ${
                large ? 'pb-2 text-xl' : 'pb-1 text-[7px]'
              }`}
            >
              {section.title}
            </div>

            <p
              className={`leading-relaxed text-slate-700 ${
                large ? 'mt-3 text-xs' : 'mt-1.5 text-[5px]'
              }`}
            >
              {section.content}
            </p>

            {section.title === 'WORK EXPERIENCE' && (
              <div className={`space-y-2 ${large ? 'mt-3' : 'mt-1.5'}`}>
                {[
                  'Lead a team of 5 in creating and executing digital marketing strategies.',
                  'Achieved a 35% increase in website traffic and 50% boost in engagement.',
                  'Managed marketing budgets while maximizing ROI.',
                ].map((text) => (
                  <div
                    key={text}
                    className={`flex gap-2 text-slate-700 ${
                      large ? 'text-xs' : 'text-[5px]'
                    }`}
                  >
                    <span>•</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  /* CREATIVE DEVELOPER */
  if (id === 'creative-developer') {
    return (
      <div
        className={`bg-[#f7f7fb] text-slate-900 ${
          large ? 'min-h-[1050px]' : 'h-full'
        }`}
      >
        <div className={large ? 'p-7' : 'p-3'}>
          <div className="relative overflow-hidden rounded-[24px] bg-slate-950 text-white">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/30 blur-2xl" />
            <div className="absolute -bottom-12 left-1/3 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
            <div className={large ? 'relative p-7' : 'relative p-3'}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`font-black tracking-tight ${large ? 'text-2xl' : 'text-[11px]'}`}>
                    ALEX MORGAN
                  </div>
                  <div className={`mt-1 font-semibold text-violet-300 ${large ? 'text-sm' : 'text-[6px]'}`}>
                    Product Designer &amp; Frontend Developer
                  </div>
                </div>
                <div className={`rounded-full border border-white/15 bg-white/10 font-black ${large ? 'px-3 py-1.5 text-[8px]' : 'px-1.5 py-0.5 text-[4px]'}`}>
                  CREATIVE
                </div>
              </div>
              <div className={`mt-4 flex flex-wrap gap-x-3 gap-y-1 text-slate-300 ${large ? 'text-[8px]' : 'text-[4px]'}`}>
                <span>hello@alex.dev</span><span>+1 555 0148</span><span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-[32%_1fr] gap-4 ${large ? 'mt-6' : 'mt-2'}`}>
            <aside className="rounded-[20px] border border-violet-100 bg-white p-3 shadow-sm">
              <div className={`font-black uppercase tracking-[0.16em] text-violet-600 ${large ? 'text-[8px]' : 'text-[4px]'}`}>Skills</div>
              <div className={`mt-2 space-y-1.5 text-slate-700 ${large ? 'text-[8px]' : 'text-[4px]'}`}>
                <div>React / TypeScript</div><div>UI/UX Design</div><div>Node.js</div><div>Figma</div><div>Design Systems</div>
              </div>
              <div className={`mt-5 font-black uppercase tracking-[0.16em] text-violet-600 ${large ? 'text-[8px]' : 'text-[4px]'}`}>Education</div>
              <div className={`mt-2 text-slate-600 ${large ? 'text-[8px]' : 'text-[4px]'}`}>B.Sc. Computer Science<br/>University of California</div>
            </aside>
            <main className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm">
              {['PROFILE','EXPERIENCE','SELECTED PROJECTS'].map((title) => (
                <div key={title} className={large ? 'mb-5' : 'mb-2.5'}>
                  <div className={`font-black tracking-[0.15em] text-slate-900 ${large ? 'text-[8px]' : 'text-[4px]'}`}>{title}</div>
                  <div className={`mt-1.5 h-1 rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 ${large ? 'w-10' : 'w-5'}`} />
                  <p className={`mt-2 leading-relaxed text-slate-600 ${large ? 'text-[8px]' : 'text-[4px]'}`}>
                    Designed polished digital products and shipped accessible interfaces for fast-moving teams.
                  </p>
                </div>
              ))}
            </main>
          </div>
        </div>
      </div>
    );
  }

  /* MODERN ATS */
  if (id === 'modern') {
    return (
      <div
        className={`bg-white text-slate-800 ${large ? 'min-h-[1050px]' : 'h-full'}`}
      >
        <div className="flex h-full">
          <div className={`w-[32%] bg-slate-900 text-white ${large ? 'p-7' : 'p-3'}`}>
            <div
              className={`rounded-full bg-indigo-500 text-center font-black ${
                large
                  ? 'mx-auto flex h-20 w-20 items-center justify-center text-2xl'
                  : 'mx-auto flex h-9 w-9 items-center justify-center text-[8px]'
              }`}
            >
              MH
            </div>

            <div className={large ? 'mt-8' : 'mt-4'}>
              <div className={`font-black uppercase tracking-wider ${large ? 'text-xs' : 'text-[5px]'}`}>
                Contact
              </div>

              <div className={`mt-2 leading-5 text-slate-300 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
                Sydney, Australia
                <br />
                michael@email.com
                <br />
                +61 412 345 678
                <br />
                linkedin.com
              </div>
            </div>

            <div className={large ? 'mt-8' : 'mt-4'}>
              <div className={`font-black uppercase tracking-wider ${large ? 'text-xs' : 'text-[5px]'}`}>
                Skills
              </div>

              <div className={`mt-2 space-y-1.5 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
                <div>React</div>
                <div>TypeScript</div>
                <div>Node.js</div>
                <div>UI/UX</div>
                <div>Leadership</div>
              </div>
            </div>

            <div className={large ? 'mt-8' : 'mt-4'}>
              <div className={`font-black uppercase tracking-wider ${large ? 'text-xs' : 'text-[5px]'}`}>
                Languages
              </div>

              <div className={`mt-2 text-slate-300 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
                English
                <br />
                Spanish
              </div>
            </div>
          </div>

          <div className={`flex-1 ${large ? 'p-8' : 'p-4'}`}>
            <div className={`font-black text-slate-950 ${large ? 'text-3xl' : 'text-[14px]'}`}>
              MICHAEL HARRIS
            </div>

            <div className={`font-semibold text-indigo-600 ${large ? 'mt-2 text-sm' : 'mt-1 text-[6px]'}`}>
              Senior Software Engineer
            </div>

            {['Professional Summary', 'Experience', 'Education', 'Projects'].map((title) => (
              <div key={title} className={large ? 'mt-8' : 'mt-4'}>
                <div className={`font-black uppercase tracking-wide text-slate-900 ${large ? 'text-xs' : 'text-[6px]'}`}>
                  {title}
                </div>

                <div className={`mt-2 space-y-1.5 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
                  <div className="font-bold">Senior Software Engineer</div>

                  <div className="text-slate-500">
                    Built scalable products and delivered measurable business impact.
                  </div>

                  <div className="h-1 rounded bg-slate-100" />
                  <div className="h-1 w-[90%] rounded bg-slate-100" />
                  <div className="h-1 w-[78%] rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* SOFTWARE ENGINEER */
  if (id === 'software-engineer') {
    return (
      <div
        className={`bg-white text-slate-800 ${large ? 'min-h-[1050px] p-9' : 'h-full p-5'}`}
      >
        <div className="border-l-4 pl-4" style={{ borderColor: template.accent }}>
          <div className={`font-black text-slate-950 ${large ? 'text-3xl' : 'text-[13px]'}`}>
            JOHN CARTER
          </div>

          <div
            className={`font-semibold ${large ? 'mt-1 text-sm' : 'mt-0.5 text-[6px]'}`}
            style={{ color: template.accent }}
          >
            SOFTWARE ENGINEER
          </div>

          <div className={`text-slate-500 ${large ? 'mt-2 text-[9px]' : 'mt-1 text-[4px]'}`}>
            React · TypeScript · Node.js · AWS · Docker
          </div>
        </div>

        {['PROFILE', 'TECHNICAL SKILLS', 'EXPERIENCE', 'PROJECTS', 'EDUCATION'].map((title) => (
          <div key={title} className={large ? 'mt-7' : 'mt-4'}>
            <div
              className={`font-black tracking-wide ${large ? 'text-xs' : 'text-[6px]'}`}
              style={{ color: template.accent }}
            >
              {title}
            </div>

            <div className={`mt-2 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
              <div className="font-bold text-slate-900">Software Engineer</div>

              <div className="mt-1 text-slate-600">
                Developed scalable web applications, APIs and modern cloud-based solutions.
              </div>

              <div className="mt-2 space-y-1.5">
                <div className="h-1 rounded bg-slate-100" />
                <div className="h-1 w-[90%] rounded bg-slate-100" />
                <div className="h-1 w-[80%] rounded bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* STUDENT */
  if (id === 'student') {
    return (
      <div
        className={`bg-white ${large ? 'min-h-[1050px] p-9' : 'h-full p-5'}`}
      >
        <div className={`rounded-2xl bg-emerald-50 ${large ? 'p-6' : 'p-3'}`}>
          <div className={`font-black text-slate-950 ${large ? 'text-3xl' : 'text-[13px]'}`}>
            JATHURSHAN YOGESWAREN
          </div>

          <div className={`font-semibold text-emerald-600 ${large ? 'mt-2 text-sm' : 'mt-1 text-[6px]'}`}>
            ICT STUDENT · FULL STACK DEVELOPER
          </div>

          <div className={`text-slate-500 ${large ? 'mt-2 text-[9px]' : 'mt-1 text-[4px]'}`}>
            Sri Lanka · email@example.com · GitHub · LinkedIn
          </div>
        </div>

        {['PROFILE', 'EDUCATION', 'PROJECTS', 'TECHNICAL SKILLS', 'CERTIFICATIONS', 'ACHIEVEMENTS'].map(
          (title) => (
            <div key={title} className={large ? 'mt-7' : 'mt-4'}>
              <div
                className={`border-b border-emerald-200 pb-1 font-black text-slate-900 ${
                  large ? 'text-xs' : 'text-[6px]'
                }`}
              >
                {title}
              </div>

              <div className={`mt-2 leading-relaxed text-slate-600 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
                <strong className="text-slate-900">
                  Bachelor of Information and Communication Technology
                </strong>

                <br />

                Rajarata University of Sri Lanka

                <br />

                Developed academic and personal projects using modern web technologies.
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  /* PROFESSIONAL */
  if (id === 'professional') {
    return (
      <div
        className={`bg-white text-slate-800 ${large ? 'min-h-[1050px] p-10' : 'h-full p-5'}`}
      >
        <div className="flex items-end justify-between border-b-2 border-slate-800 pb-5">
          <div>
            <div className={`font-serif font-black ${large ? 'text-3xl' : 'text-[14px]'}`}>
              MICHAEL HARRIS
            </div>

            <div className={`font-medium text-slate-500 ${large ? 'mt-2 text-sm' : 'mt-1 text-[6px]'}`}>
              Senior Professional
            </div>
          </div>

          <div className={`text-right text-slate-500 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
            Sydney, Australia
            <br />
            email@email.com
            <br />
            +61 412 345 678
          </div>
        </div>

        {['EXECUTIVE SUMMARY', 'PROFESSIONAL EXPERIENCE', 'EDUCATION', 'CORE COMPETENCIES', 'CERTIFICATIONS'].map(
          (title) => (
            <div key={title} className={large ? 'mt-8' : 'mt-4'}>
              <div className={`font-serif font-black text-slate-900 ${large ? 'text-sm' : 'text-[7px]'}`}>
                {title}
              </div>

              <div className={`mt-2 text-slate-600 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
                Results-driven professional with a proven track record of delivering strategic
                initiatives and measurable business outcomes.

                <div className="mt-2 space-y-1.5">
                  <div className="h-1 rounded bg-slate-100" />
                  <div className="h-1 w-[94%] rounded bg-slate-100" />
                  <div className="h-1 w-[82%] rounded bg-slate-100" />
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  /* EXECUTIVE (default) */
  return (
    <div
      className={`bg-[#faf9f7] text-slate-800 ${large ? 'min-h-[1050px] p-10' : 'h-full p-5'}`}
    >
      <div className="text-center">
        <div
          className={`font-serif font-black tracking-[0.12em] text-slate-950 ${
            large ? 'text-3xl' : 'text-[14px]'
          }`}
        >
          MICHAEL HARRIS
        </div>

        <div
          className={`uppercase tracking-[0.18em] text-slate-500 ${
            large ? 'mt-3 text-xs' : 'mt-1.5 text-[5px]'
          }`}
        >
          Chief Technology Executive
        </div>

        <div className="mx-auto mt-4 h-px w-1/2 bg-slate-300" />

        <div className={`mt-3 text-slate-500 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
          Sydney · Australia · email@email.com · +61 412 345 678
        </div>
      </div>

      {['EXECUTIVE PROFILE', 'LEADERSHIP EXPERIENCE', 'SELECTED ACHIEVEMENTS', 'EDUCATION', 'EXPERTISE'].map(
        (title) => (
          <div key={title} className={large ? 'mt-8' : 'mt-4'}>
            <div
              className={`text-center font-serif font-black tracking-widest text-slate-900 ${
                large ? 'text-xs' : 'text-[6px]'
              }`}
            >
              {title}
            </div>

            <div className="mx-auto mt-2 h-px w-20 bg-slate-300" />

            <div className={`mt-3 text-center leading-relaxed text-slate-600 ${large ? 'text-[9px]' : 'text-[4px]'}`}>
              Strategic leader with extensive experience building high-performing teams, driving
              transformation and delivering business growth.
            </div>
          </div>
        ),
      )}
    </div>
  );
}
