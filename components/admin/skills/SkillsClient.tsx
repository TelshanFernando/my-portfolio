"use client";

import { useState } from "react";
import { Code2, Plus, Pencil, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import SkillForm from "./SkillForm";
import { deleteSkill } from "@/app/admin/skills/actions";

type Skill = {
  id: string;
  name: string;
  category: string;
  icon_name: string | null;
  proficiency: number | null;
  years_experience: number | null;
  display_order: number;
  visible: boolean;
};

function SkillIcon({ iconName }: { iconName: string | null }) {
  const aliases: Record<string, string> = {
    html: "Code2",
    css: "Palette",
    javascript: "Braces",
    js: "Braces",
    typescript: "Braces",
    ts: "Braces",
    react: "Atom",
    nextjs: "Layers",
    next: "Layers",
    nodejs: "Server",
    node: "Server",
    php: "Code2",
    sql: "Database",
    mysql: "Database",
    database: "Database",
    java: "Coffee",
    csharp: "Code2",
    "c#": "Code2",
    cpp: "Code2",
    "c++": "Code2",
    python: "Code2",
    ai: "Brain",
    "artificial intelligence": "Brain",
    "generative ai": "Sparkles",
    "prompt engineering": "MessageSquareCode",
    networking: "Network",
    network: "Network",
    windows: "Monitor",
    apple: "Apple",
    macos: "Laptop",
    github: "Github",
    vscode: "Code2",
    "visual studio code": "Code2",
    testing: "Bug",
    debugging: "Bug",
    support: "Headphones",
    "it support": "Headphones",
    troubleshooting: "Wrench",
    "microsoft office": "FileText",
    office: "FileText",
  };

  const normalizedName = iconName?.trim() ?? "";
  const lookupName = normalizedName.toLowerCase();
  const iconKey = aliases[lookupName] ?? normalizedName;

  const Icon = (
    LucideIcons as unknown as Record<string, React.ComponentType<any>>
  )[iconKey];

  if (!Icon) {
    return <Code2 className="h-5 w-5 text-zinc-400" />;
  }

  return <Icon className="h-5 w-5 text-zinc-400" />;
}

export default function SkillsClient({
  initialSkills,
}: {
  initialSkills: Skill[];
}) {
  const [skills, setSkills] = useState(initialSkills);
  const [editing, setEditing] = useState<Skill | undefined>();
  const [showForm, setShowForm] = useState(false);

  function openCreate() {
    setEditing(undefined);
    setShowForm(true);
  }

  function openEdit(skill: Skill) {
    setEditing(skill);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(undefined);
    window.location.reload();
  }

  async function handleDelete(skill: Skill) {
    if (
      !window.confirm(
        `Delete "${skill.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    const result = await deleteSkill(skill.id);

    if (!result.success) {
      window.alert(result.error ?? "Failed to delete skill.");
      return;
    }

    setSkills((current) =>
      current.filter((item) => item.id !== skill.id),
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Code2 className="h-7 w-7 text-zinc-400" />
            <h1 className="text-3xl font-bold">Skills</h1>
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            Manage the skills displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
          Add skill
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-6 text-xl font-semibold">
            {editing ? "Edit skill" : "Create skill"}
          </h2>

          <SkillForm skill={editing} onDone={closeForm} />
        </div>
      )}

      {skills.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-12 text-center">
          <Code2 className="mx-auto h-10 w-10 text-zinc-700" />

          <h2 className="mt-4 text-lg font-semibold">
            No skills yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Add your first skill to start building your portfolio.
          </p>

          <button
            type="button"
            onClick={openCreate}
            className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Add your first skill
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <article
              key={skill.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
                    <SkillIcon iconName={skill.icon_name} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-white">
                      {skill.name}
                    </h2>

                    <p className="text-xs text-zinc-500">
                      {skill.category}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                    skill.visible
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {skill.visible ? "Visible" : "Hidden"}
                </span>
              </div>

              {skill.proficiency !== null && (
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-zinc-500">Proficiency</span>
                    <span className="text-zinc-300">
                      {skill.proficiency}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{
                        width: `${Math.min(
                          Math.max(skill.proficiency, 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {skill.years_experience !== null && (
                <p className="mt-4 text-sm text-zinc-500">
                  {skill.years_experience}{" "}
                  {skill.years_experience === 1 ? "year" : "years"} experience
                </p>
              )}

              <div className="mt-5 flex justify-end gap-2 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => openEdit(skill)}
                  className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(skill)}
                  className="rounded-lg border border-red-950 p-2 text-red-400 hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
