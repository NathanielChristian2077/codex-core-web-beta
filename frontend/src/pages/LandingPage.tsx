import {
    ArrowRight,
    BookOpenCheck,
    GitBranch,
    History,
    Network,
    ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../store/useSession";

export default function LandingPage() {
  const navigate = useNavigate();
  const isLogged = useSession((s) => s.isLogged);

  const primaryCta = () => {
    if (isLogged) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* HERO */}
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-6 pt-10 pb-12">
        <section className="flex flex-col items-center text-center">
          {/* Logo grande */}
          <div className="mb-6 inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
            <img
              src="/CodexCoreB.svg"
              alt="Codex Core logo"
              className="h-14 w-14"
            />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Narrative graph workspace
          </p>

          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Build consistent RPG campaigns using{" "}
            <span className="bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">
              graphs, timelines and entities
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-balance text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
            Organize events, characters, locations and objects in a single
            connected view. Catch plot holes before your players do and keep
            every session internally consistent.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={primaryCta}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            >
              {isLogged ? "Open dashboard" : "Get started"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href="https://github.com/NathanielChristian2077/trabalho-final-web-dev.git"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-5 py-2 text-xs font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              <BookOpenCheck className="h-4 w-4" />
              View source on GitHub
            </a>
          </div>

          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Self-hosted, focused on TTRPG campaigns, built with React + Nest.
          </p>
        </section>

        {/* FEATURES */}
        <section className="mt-14 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<History className="h-5 w-5" />}
            title="Timeline as truth"
            description="Events live in a chronological view, with markdown descriptions and internal links that jump to nodes and entities."
          />
          <FeatureCard
            icon={<Network className="h-5 w-5" />}
            title="Graph-first thinking"
            description="Visualize how characters, locations and objects relate. Hover, focus and edit nodes directly in the graph."
          />
          <FeatureCard
            icon={<GitBranch className="h-5 w-5" />}
            title="Clean campaign structure"
            description="Each campaign is isolated with its own entities, ready to duplicate, import and version as your story evolves."
          />
        </section>

        {/* SECOND ROW */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="JWT Auth & ownership"
            description="Every campaign is tied to a user. No shared state, no mystery data. Simple auth, clear permissions."
          />
          <FeatureCard
            icon={<ArrowRight className="h-5 w-5" />}
            title="Built for GMs who prep"
            description="Less spreadsheets, more structure. Use Codex Core as your prep brain and keep the table focused on the story."
          />
        </section>
      </main>

      {/* FOOTER */}
      <AppFooter />
    </div>
  );
}

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="text-xs text-zinc-600 dark:text-zinc-300">
        {description}
      </p>
    </div>
  );
}

function AppFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white/80 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            Codex Core
          </span>
          <span className="hidden text-zinc-400 sm:inline">•</span>
          <span>RPG campaign graph & timeline toolkit.</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/NathanielChristian2077/trabalho-final-web-dev.git"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            GitHub
          </a>
          <span className="hidden text-zinc-400 sm:inline">•</span>
          <span className="text-[11px]">
            Built with React, Tailwind, NestJS & Prisma.
          </span>
        </div>
      </div>
    </footer>
  );
}
