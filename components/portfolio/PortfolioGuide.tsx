"use client";

import { useEffect, useRef, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

type QuestKey = "skills" | "projects" | "qualifications" | "resume" | "contact";
type QuestState = Record<QuestKey, boolean>;

const ONBOARDING_KEY = "portfolio_onboarding_state";
const QUEST_KEY = "portfolio_quests";

const emptyQuests: QuestState = {
  skills: false,
  projects: false,
  qualifications: false,
  resume: false,
  contact: false,
};

const questDetails: Array<{ key: QuestKey; title: string; reward: string; target: string; selector: string }> = [
  { key: "skills", title: "Discover my expertise", reward: "Expertise discovered", target: "Visit the Skills section", selector: "#skills" },
  { key: "projects", title: "Explore my work", reward: "Project explored", target: "Open a project", selector: "#projects" },
  { key: "qualifications", title: "Verify my qualifications", reward: "Qualifications reviewed", target: "Visit Education or Certifications", selector: "#education, #certifications" },
  { key: "resume", title: "View my resume", reward: "Resume viewed", target: "Open the resume", selector: "#resume-button" },
  { key: "contact", title: "Start a conversation", reward: "Connection started", target: "Open the Contact section", selector: "#contact" },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Blocked storage must never affect the portfolio.
  }
}

export default function PortfolioGuide() {
  const [onboarding, setOnboarding] = useState<"not_started" | "in_progress" | "skipped" | "completed">("not_started");
  const [quests, setQuests] = useState<QuestState>(emptyQuests);
  const [panelOpen, setPanelOpen] = useState(false);
  const tourRef = useRef<ReturnType<typeof driver> | null>(null);

  useEffect(() => {
    const savedOnboarding = readStorage<string>(ONBOARDING_KEY, "not_started");
    const storedQuests = readStorage<Partial<QuestState>>(QUEST_KEY, {});
    const savedQuests = questDetails.reduce<QuestState>((result, quest) => {
      result[quest.key] = storedQuests[quest.key] === true;
      return result;
    }, { ...emptyQuests });
    const validOnboarding = ["not_started", "in_progress", "skipped", "completed"].includes(savedOnboarding)
      ? savedOnboarding === "in_progress"
        ? "not_started"
        : (savedOnboarding as typeof onboarding)
      : "not_started";

    const hydrationTimer = window.setTimeout(() => {
      setOnboarding(validOnboarding);
      setQuests(savedQuests);
      setPanelOpen(validOnboarding !== "not_started");
    }, 0);

    const markQuest = (key: QuestKey) => {
      setQuests((current) => {
        if (current[key]) return current;
        const next = { ...current, [key]: true };
        writeStorage(QUEST_KEY, next);
        return next;
      });
    };

    const observedSections: Array<[QuestKey, string]> = [
      ["skills", "#skills"],
      ["qualifications", "#education, #certifications"],
      ["contact", "#contact"],
    ];
    const observers = observedSections.flatMap(([key, selector]) => {
      const element = document.querySelector(selector);
      if (!element) return [];
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) markQuest(key);
      }, { threshold: 0.2 });
      observer.observe(element);
      return [observer];
    });

    const handleAction = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest("[data-quest-project]")) markQuest("projects");
      if (target.closest("[data-quest-resume]")) markQuest("resume");
    };
    document.addEventListener("click", handleAction);

    return () => {
      window.clearTimeout(hydrationTimer);
      observers.forEach((observer) => observer.disconnect());
      document.removeEventListener("click", handleAction);
    };
  }, []);

  function startTour() {
    const availableSteps = [
      { element: "#top", popover: { title: "Welcome, Sir/Madam.", description: "This brief guided tour introduces my professional profile, technical expertise, selected projects, and experience.", nextBtnText: "Begin tour" } },
      { element: "#resume-button", popover: { title: "Your resume access", description: "You may open my current resume here for a concise overview of my experience, skills, and qualifications." } },
      { element: "#about", popover: { title: "Professional profile", description: "Explore my background, career interests, and professional focus here." } },
      { element: "#skills", popover: { title: "Technical expertise", description: "This section highlights the technologies, tools, and capabilities I use to build digital experiences." } },
      { element: "#projects", popover: { title: "Selected projects", description: "Review selected work, project context, and available GitHub repositories or live demonstrations." } },
      { element: "#experience", popover: { title: "Professional background", description: "Experience, education, and certifications together provide a concise view of my qualifications." } },
      { element: "#contact", popover: { title: "Continue the conversation", description: "Thank you for taking the time to explore my portfolio, Sir/Madam. You are welcome to review my resume or contact me directly.", doneBtnText: "Finish tour" } },
    ].filter((step) => document.querySelector(step.element));

    if (!availableSteps.length) return;
    setOnboarding("in_progress");
    writeStorage(ONBOARDING_KEY, "in_progress");
    tourRef.current?.destroy();
    tourRef.current = driver({
      showProgress: true,
      allowClose: true,
      overlayColor: "#050505",
      overlayOpacity: 0.72,
      smoothScroll: true,
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      steps: availableSteps,
      onNextClick: (_element, _step, options) => {
        if (options.state.activeIndex === availableSteps.length - 1) {
          setOnboarding("completed");
          writeStorage(ONBOARDING_KEY, "completed");
          options.driver.destroy();
          setPanelOpen(true);
          return;
        }
        options.driver.moveNext();
      },
      onDestroyed: () => {
        setOnboarding((previous) => {
          const next = previous === "in_progress" ? "skipped" : previous;
          writeStorage(ONBOARDING_KEY, next);
          setPanelOpen(true);
          return next;
        });
      },
    });
    tourRef.current.drive();
  }

  function resetExploration() {
    setQuests(emptyQuests);
    writeStorage(QUEST_KEY, emptyQuests);
    setPanelOpen(true);
  }

  function completeQuest(key: QuestKey) {
    setQuests((current) => {
      if (current[key]) return current;
      const next = { ...current, [key]: true };
      writeStorage(QUEST_KEY, next);
      return next;
    });
  }

  function guideToQuest(selector: string, key: QuestKey) {
    const target = document.querySelector(selector);
    if (!target) return;

    completeQuest(key);
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    if (selector === "#resume-button") {
      window.setTimeout(() => {
        if (!document.querySelector(selector)) return;
        driver({
          allowClose: true,
          smoothScroll: true,
          animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          steps: [{
            element: selector,
            popover: {
              title: "View my resume",
              description: "The resume button is here in the introduction area. Select it to open the current resume in a new tab.",
              doneBtnText: "Got it",
            },
          }],
        }).drive();
      }, 500);
    }
  }

  const completedCount = Object.values(quests).filter(Boolean).length;
  const allComplete = completedCount === questDetails.length;

  if (onboarding === "not_started" && !panelOpen) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="portfolio-tour-title">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-7 text-center shadow-2xl shadow-black/50 sm:p-9">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Professional portfolio</p>
          <h1 id="portfolio-tour-title" className="mt-3 text-2xl font-semibold tracking-tight text-white">Welcome, Sir/Madam.</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400">Please take the brief guided tour to explore my professional profile, technical expertise, selected projects, and experience.</p>
          <button type="button" onClick={startTour} autoFocus className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-zinc-950">Take the tour</button>
        </div>
      </div>
    );
  }

  return (
    <aside className="fixed bottom-5 right-5 z-[60] w-[min(22rem,calc(100vw-2rem))]" aria-label="Professional portfolio exploration">
      {!panelOpen ? (
        <button type="button" onClick={() => setPanelOpen(true)} className="ml-auto flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900/90 px-4 py-3 text-sm font-medium text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"><span aria-hidden="true">✓</span> Exploration {completedCount}/{questDetails.length}</button>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-start justify-between border-b border-white/10 p-5"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Professional journey</p><h2 className="mt-1 text-lg font-semibold text-white">Portfolio exploration</h2></div><button type="button" onClick={() => setPanelOpen(false)} aria-label="Minimize exploration panel" className="rounded-full p-1 text-zinc-500 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">×</button></div>
          <div className="p-5">
            {allComplete ? (
              <div><p className="text-sm font-medium text-emerald-300">Portfolio exploration complete, Sir/Madam.</p><p className="mt-2 text-sm leading-6 text-zinc-400">You have reviewed the key evidence across my professional profile. If my background aligns with your requirements, I would be pleased to hear from you.</p><div className="mt-4 flex flex-wrap gap-2"><a href="#contact" onClick={() => setPanelOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200">Contact me</a><button type="button" onClick={resetExploration} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10">Restart</button></div></div>
            ) : (
              <><div className="flex items-center justify-between text-xs text-zinc-400"><span>Career discovery journey</span><span>{completedCount} of {questDetails.length}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10" aria-label={`${completedCount} of ${questDetails.length} quests completed`} role="progressbar" aria-valuemin={0} aria-valuemax={questDetails.length} aria-valuenow={completedCount}><div className="h-full rounded-full bg-emerald-300 transition-all duration-500" style={{ width: `${(completedCount / questDetails.length) * 100}%` }} /></div><ul className="mt-4 space-y-2">{questDetails.filter((quest) => !quests[quest.key]).map((quest) => <li key={quest.key}><button type="button" onClick={() => guideToQuest(quest.selector, quest.key)} className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 text-left transition hover:border-white/25 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/40"><div className="flex items-start gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-transparent" aria-hidden="true">✓</span><div><p className="text-sm text-zinc-200">{quest.title}</p><p className="mt-0.5 text-xs text-zinc-500">{quest.target}</p></div></div></button></li>)}</ul><div className="mt-4 flex items-center justify-between gap-3"><button type="button" onClick={startTour} className="text-sm text-zinc-400 underline decoration-white/20 underline-offset-4 hover:text-white">Restart tour</button><button type="button" onClick={resetExploration} className="text-xs text-zinc-600 hover:text-zinc-300">Reset progress</button></div></>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}