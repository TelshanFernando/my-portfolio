
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/portfolio/Navbar";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("site_name, site_title, site_description, favicon_url")
    .maybeSingle();

  const title = settings?.site_title || settings?.site_name || "Portfolio";
  const description = settings?.site_description || "Personal portfolio";

  return {
    title,
    description,
    ...(settings?.favicon_url ? { icons: { icon: settings.favicon_url } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function Home() {
  const supabase = await createClient();

  const [
    settingsResult,
    profileResult,
    educationResult,
    experienceResult,
    projectsResult,
    skillsResult,
    certificationsResult,
    servicesResult,
    socialLinksResult,
    resumeResult,
  ] = await Promise.all([
    supabase.from("site_settings").select("*").maybeSingle(),
    supabase.from("profiles").select("*").maybeSingle(),
    supabase.from("education").select("*").order("display_order", { ascending: true }),
    supabase.from("experience").select("*").order("display_order", { ascending: true }),
    supabase.from("projects").select("*").order("display_order", { ascending: true }),
    supabase.from("skills").select("*").order("display_order", { ascending: true }),
    supabase.from("certifications").select("*").order("display_order", { ascending: true }),
    supabase.from("services").select("*").order("display_order", { ascending: true }),
    supabase.from("social_links").select("*").order("display_order", { ascending: true }),
    supabase.from("resumes").select("file_url, title").eq("is_active", true).maybeSingle(),
  ]);

  const settings = settingsResult.data;
  const profile = profileResult.data;
  const education = educationResult.data ?? [];
  const experience = experienceResult.data ?? [];
  const projects = projectsResult.data ?? [];
  const skills = skillsResult.data ?? [];
  const certifications = certificationsResult.data ?? [];
  const services = servicesResult.data ?? [];
  const socialLinks = socialLinksResult.data ?? [];
  const resume = resumeResult.data;

  const visible = (item: Record<string, unknown>) => item.is_visible !== false;
  const active = (item: Record<string, unknown>) => item.is_active !== false;

  const visibleExperience = experience.filter(visible);
  const visibleProjects = projects.filter(visible);
  const visibleSkills = skills.filter(active);
  const visibleEducation = education.filter(visible);
  const visibleCertifications = certifications.filter(visible);
  const visibleServices = services.filter(active);
  const visibleSocialLinks = socialLinks.filter(active);

  const name = String(profile?.full_name ?? settings?.site_name ?? "Your Name");
  const description = String(
    settings?.site_description ?? profile?.bio ?? ""
  );
  const heroHeading = String(
    settings?.hero_heading ?? `Hi, I'm ${name}`
  );
  const heroSubheading = String(
    settings?.hero_subheading ?? description
  );

  return (
    <main id="top" className="relative isolate min-h-screen bg-zinc-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[500px] overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-3xl" />
      </div>

      <Navbar
        name={name}
        navigation={[
          { label: "About", href: "#about" },
          { label: "Experience", href: "#experience" },
          { label: "Projects", href: "#projects" },
          { label: "Skills", href: "#skills" },
          { label: "Education", href: "#education" },
          { label: "Certifications", href: "#certifications" },
          { label: "Services", href: "#services" },
          { label: "Contact", href: "#contact" },
        ]}
      />

      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-10rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl animate-pulse" />
          <div className="absolute left-[8%] top-40 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl animate-pulse [animation-delay:1.5s]" />
          <div className="absolute right-[5%] top-56 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl animate-pulse [animation-delay:3s]" />
          <div className="absolute left-1/2 top-20 h-[min(72vw,620px)] w-[min(72vw,620px)] -translate-x-1/2 rounded-full border border-white/[0.06] [animation:spin_32s_linear_infinite]" />
          <div className="absolute left-1/2 top-36 h-[min(52vw,440px)] w-[min(52vw,440px)] -translate-x-1/2 rounded-full border border-white/[0.05] [animation:spin_22s_linear_infinite_reverse]" />
          <div className="absolute left-1/2 top-52 h-2 w-2 -translate-x-1/2 rounded-full bg-white/70 shadow-[0_0_35px_rgba(255,255,255,0.7)] [animation:float_6s_ease-in-out_infinite]" />
          <div className="absolute left-[18%] top-72 h-1.5 w-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_25px_rgba(103,232,249,0.7)] [animation:float_7s_ease-in-out_infinite_reverse]" />
          <div className="absolute right-[18%] top-80 h-1.5 w-1.5 rounded-full bg-fuchsia-300/70 shadow-[0_0_25px_rgba(240,171,252,0.7)] [animation:float_8s_ease-in-out_infinite]" />
          <div className="absolute left-1/2 top-28 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 md:py-36">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="max-w-4xl [perspective:1200px]">
              {settings?.hero_badge && (
                <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
                  {String(settings.hero_badge)}
                </div>
              )}
              <div className="[transform-style:preserve-3d] [animation:heroFloat_7s_ease-in-out_infinite]">
                <h1 className="max-w-5xl text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                  <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                    {heroHeading}
                  </span>
                </h1>

                {heroSubheading && (
                  <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:mt-7 sm:text-xl sm:leading-8">
                    {heroSubheading}
                  </p>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
                  {settings?.primary_cta_text && settings?.primary_cta_url && (
                    <a
                      href={String(settings.primary_cta_url)}
                      className="group inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.12)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-zinc-100 hover:shadow-[0_0_55px_rgba(255,255,255,0.22)] focus:outline-none focus:ring-2 focus:ring-white/50 sm:px-7"
                    >
                      {String(settings.primary_cta_text)}
                      <span aria-hidden="true" className="ml-2 transition-transform duration-300 group-hover:translate-x-1">↗</span>
                    </a>
                  )}

                  {settings?.secondary_cta_text && settings?.secondary_cta_url && (
                    <a
                      href={String(settings.secondary_cta_url)}
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 sm:px-7"
                    >
                      {String(settings.secondary_cta_text)}
                    </a>
                  )}

                  {resume?.file_url && (
                    <a
                      href={String(resume.file_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 sm:px-7"
                    >
                      <span aria-hidden="true" className="mr-2">↓</span>
                      {String(resume.title ?? "View Resume")}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="hidden justify-center lg:flex [perspective:1200px]">
              <div className="relative h-80 w-80 [transform-style:preserve-3d] [animation:orbFloat_8s_ease-in-out_infinite]">
                <div className="absolute inset-10 rounded-full border border-white/10 bg-white/[0.025] shadow-[inset_0_0_70px_rgba(255,255,255,0.03),0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-sm" />
                <div className="absolute inset-16 rounded-full border border-cyan-300/20 [transform:rotateX(68deg)_rotateZ(20deg)] [animation:spin_12s_linear_infinite]" />
                <div className="absolute inset-24 rounded-full border border-fuchsia-300/20 [transform:rotateY(68deg)_rotateZ(-20deg)] [animation:spin_10s_linear_infinite_reverse]" />
                <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_45px_rgba(255,255,255,0.7)]" />
                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl justify-center px-4 pb-8 sm:px-6">
          <a href="#about" aria-label="Scroll to About section" className="group inline-flex flex-col items-center gap-2 text-zinc-600 transition hover:text-zinc-300">
            <span className="text-[10px] uppercase tracking-[0.35em]">Explore</span>
            <span className="h-8 w-px bg-gradient-to-b from-zinc-500 to-transparent transition group-hover:from-white" />
          </a>
        </div>
      </section>

      {profile && (
        <section id="about" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="flex justify-center lg:justify-start">
                {profile.profile_image_url ? (
                  <img
                    src={String(profile.profile_image_url)}
                    alt={name}
                    loading="lazy"
                  className="h-64 w-64 translate-y-0 rounded-3xl border border-white/10 object-cover shadow-2xl sm:h-80 sm:w-80"                  />
                ) : (
                  <div className="flex h-64 w-64 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-6xl font-bold text-zinc-500 sm:h-80 sm:w-80">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                  About me
                </p>
                <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                  A little about me
                </h2>

                {profile.bio && (
                  <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                    {String(profile.bio)}
                  </p>
                )}

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {profile.location && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Location</p>
                      <p className="mt-2 text-sm text-zinc-200">{String(profile.location)}</p>
                    </div>
                  )}

                  {profile.email && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Email</p>
                      <a
                        href={`mailto:${String(profile.email)}`}
                        className="mt-2 block truncate text-sm text-zinc-200 hover:text-white"
                      >
                        {String(profile.email)}
                      </a>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Phone</p>
                      <a
                        href={`tel:${String(profile.phone)}`}
                        className="mt-2 block text-sm text-zinc-200 hover:text-white"
                      >
                        {String(profile.phone)}
                      </a>
                    </div>
                  )}

                  {profile.website && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Website</p>
                      <a
                        href={String(profile.website)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block truncate text-sm text-zinc-200 hover:text-white"
                      >
                        Visit website
                      </a>
                    </div>
                  )}
                </div>

                {profile.available_for_work && (
                  <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    Available for work
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {visibleExperience.length > 0 && (
        <section id="experience" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Career</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Experience</h2>
              <p className="mt-4 text-zinc-400">My professional experience and the work I have done along the way.</p>
            </div>

            <div className="relative mt-12">
              <div className="absolute bottom-0 left-[7px] top-0 w-px bg-white/10" />
              <div className="space-y-10">
                {visibleExperience.map((item) => {
                  const jobTitle = String(item.job_title ?? item.title ?? "Experience");
                  const company = String(item.company ?? item.organization ?? "");
                  const startDate = item.start_date
                    ? new Date(String(item.start_date)).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                    : "";
                  const endDate = item.end_date
                    ? new Date(String(item.end_date)).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                    : "";
                  const dateRange = startDate || endDate ? `${startDate || "Start"} — ${endDate || "Present"}` : "";

                  return (
                    <article key={String(item.id)} className="relative pl-10 transform-gpu [transform-style:preserve-3d] hover:[transform:translateY(-4px)_rotateX(1deg)] hover:shadow-2xl">
                      <span className="absolute left-0 top-2 h-4 w-4 rounded-full border-4 border-zinc-950 bg-white" />
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04]">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{jobTitle}</h3>
                            {company && <p className="mt-1 text-zinc-400">{company}</p>}
                          </div>
                          {dateRange && <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{dateRange}</span>}
                        </div>
                        {item.description && <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-zinc-400">{String(item.description)}</p>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {visibleProjects.length > 0 && (
        <section id="projects" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Selected work</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Projects</h2>
              <p className="mt-4 text-zinc-400">A selection of projects, experiments, and work I&apos;ve built.</p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {visibleProjects.map((item) => {
                const title = String(item.title ?? "Project");
                const description = item.description ? String(item.description) : "";
                const projectUrl = item.project_url ? String(item.project_url) : "";
                const imageUrl = item.image_url ? String(item.image_url) : "";

                return (
                  <article key={String(item.id)} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] transform-gpu [transform-style:preserve-3d] hover:[transform:translateY(-6px)_rotateX(1deg)] hover:shadow-2xl">
                    {imageUrl ? (
                      <div className="overflow-hidden">
                        <img src={imageUrl} alt={title} loading="lazy" className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center border-b border-white/10 bg-white/[0.03]">
                        <span className="text-sm text-zinc-600">No project image</span>
                      </div>
                    )}
                    <div className="p-6 sm:p-7">
                      <h3 className="text-xl font-semibold text-white">{title}</h3>
                      {description && <p className="mt-3 leading-7 text-zinc-400">{description}</p>}
                      {projectUrl && (
                        <a href={projectUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
                          View project <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {visibleSkills.length > 0 && (
        <section id="skills" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Expertise</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Skills</h2>
              <p className="mt-4 text-zinc-400">Technologies and skills I use to build meaningful digital experiences.</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {visibleSkills.map((item) => (
                <span key={String(item.id)} className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white">
                  {String(item.name ?? item.title ?? "Skill")}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {visibleEducation.length > 0 && (
        <section id="education" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Background</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Education</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {visibleEducation.map((item) => {
                const degree = String(
                  item.degree ?? item.title ?? item.name ?? "Education"
                );
                const institution = String(
                  item.institution ?? item.school ?? item.organization ?? ""
                );

                const formatEducationDate = (value: unknown) => {
                  if (!value) return "";
                  const raw = String(value).trim();
                  if (!raw) return "";

                  const match = raw.match(/^(\\d{4})-(\\d{1,2})(?:-\\d{1,2})?$/);
                  if (match) {
                    const year = Number(match[1]);
                    const month = Number(match[2]);
                    if (month >= 1 && month <= 12) {
                      return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      });
                    }
                  }

                  const date = new Date(raw);
                  return Number.isNaN(date.getTime())
                    ? raw
                    : date.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      });
                };

                // Backend controls the displayed education end label.
                const startDate = formatEducationDate(item.start_date);
                const rawEndDate = item.end_date == null ? "" : String(item.end_date).trim();
                const normalizedEndDate = rawEndDate.toLowerCase();
                const rawStatus = item.current_status == null ? "" : String(item.current_status).trim().toLowerCase();

                const endLabel =
                  normalizedEndDate === "hold" || rawStatus === "hold"
                    ? "HOLD"
                    : normalizedEndDate === "present" || rawStatus === "present"
                      ? "PRESENT"
                      : rawEndDate
                        ? formatEducationDate(rawEndDate)
                        : "";

                const dateRange = startDate || endLabel
                  ? `${startDate || "Start"} — ${endLabel || "Present"}`
                  : "";

                return (
                  <article key={String(item.id)} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04] sm:p-7 transform-gpu [transform-style:preserve-3d] hover:[transform:translateY(-5px)_rotateX(1deg)] hover:shadow-2xl">
                    <h3 className="text-xl font-semibold text-white">{degree}</h3>
                    {institution && <p className="mt-2 text-zinc-400">{institution}</p>}
                    {dateRange && (
                      <p className="mt-4 text-xs uppercase tracking-wider text-zinc-400">
                        {dateRange}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-5 leading-7 text-zinc-400 whitespace-pre-line">
                        {String(item.description)}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {visibleCertifications.length > 0 && (
        <section id="certifications" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Credentials</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Certifications</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {visibleCertifications.map((item) => {
                const certificationName = String(item.name ?? "Certification");
                const organization = String(item.issuing_organization ?? "");
                const issueDate = item.issue_date
                  ? new Date(String(item.issue_date)).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                  : "";
                const expiryDate = item.expiry_date
                  ? new Date(String(item.expiry_date)).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                  : "";

                return (
                  <article key={String(item.id)} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04] sm:p-7 transform-gpu [transform-style:preserve-3d] hover:[transform:translateY(-5px)_rotateX(1deg)] hover:shadow-2xl">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg">✓</div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{certificationName}</h3>
                    {organization && <p className="mt-2 text-zinc-400">{organization}</p>}
                    {(issueDate || expiryDate) && <p className="mt-4 text-xs uppercase tracking-wider text-zinc-600">{issueDate || "Issued"}{expiryDate ? ` — ${expiryDate}` : ""}</p>}
                    {item.description && <p className="mt-4 leading-7 text-zinc-400">{String(item.description)}</p>}
                    {item.credential_url && (
                      <a href={String(item.credential_url)} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                        View credential <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {visibleServices.length > 0 && (
        <section id="services" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">What I do</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Services</h2>
              <p className="mt-4 text-zinc-400">Ways I can help turn ideas into useful digital products.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleServices.map((item) => (
                <article key={String(item.id)} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] sm:p-7 transform-gpu [transform-style:preserve-3d] hover:[transform:translateY(-5px)_rotateX(1deg)] hover:shadow-2xl">
                  <h3 className="text-xl font-semibold text-white">{String(item.title ?? item.name ?? "Service")}</h3>
                  {item.description && <p className="mt-4 leading-7 text-zinc-400">{String(item.description)}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Get in touch</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Let&apos;s work together</h2>
            <p className="mt-4 text-zinc-400">Have a project, opportunity, or question? Send me a message.</p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <ContactForm />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">Contact details</h3>

              {profile?.email && (
                <a href={`mailto:${String(profile.email)}`} className="mt-5 block break-all text-zinc-300 underline decoration-white/20 underline-offset-4 hover:text-white">
                  {String(profile.email)}
                </a>
              )}

              {profile?.phone && (
                <a href={`tel:${String(profile.phone)}`} className="mt-3 block text-zinc-300 hover:text-white">
                  {String(profile.phone)}
                </a>
              )}

              {profile?.location && (
                <p className="mt-3 text-zinc-500">{String(profile.location)}</p>
              )}

              {visibleSocialLinks.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {visibleSocialLinks.map((item) => (
                    <a
                      key={String(item.id)}
                      href={String(item.url ?? "#")}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                    >
                      {String(item.platform ?? item.name ?? "Social")}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-zinc-500 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p>{String(settings?.footer_text ?? `© ${new Date().getFullYear()} ${name}`)}</p>
            <p className="mt-1 text-xs text-zinc-600">Built with care and a little bit of code.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {visibleSocialLinks.map((item) => (
              <a
                key={String(item.id)}
                href={String(item.url ?? "#")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                {String(item.platform ?? item.name ?? "Social")}
              </a>
            ))}
            <a href="#top" className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.035),transparent_38%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>
    </main>
  );
}
