import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Layers,
  FileText,
  GraduationCap,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { sections, totalResources, categories } from "@/data/sections";

function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl px-6 py-16 md:px-12 md:py-20">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-violet-100/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-96 rounded-full bg-indigo-50/50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
          <Sparkles className="h-3 w-3" />
          Neurodiversity Global
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Neuroinclusion Resource Hub
        </h1>
        <p className="mt-2 text-sm font-medium tracking-wide text-primary/70">
          Be Seen. Be Valued. Be Supported. Be Empowered.
        </p>
        <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
          {totalResources} resources for neuroinclusive performance by design
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-8 mx-auto max-w-md">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full rounded-full border border-border/60 bg-white/80 backdrop-blur-sm py-3 pl-11 pr-4 text-sm shadow-sm transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

function StatsRow() {
  const categoryCount = categories.length;
  const stats = [
    { label: "Resources", value: totalResources, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Sections", value: sections.length, icon: Layers, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Categories", value: categoryCount, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-3 p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StartHereCallout() {
  const tiers = [
    { label: "Aware", color: "bg-blue-100 text-blue-700" },
    { label: "Advocate", color: "bg-emerald-100 text-emerald-700" },
    { label: "People Leaders", color: "bg-amber-100 text-amber-700" },
    { label: "Executive", color: "bg-violet-100 text-violet-700" },
  ];

  return (
    <Link
      to="/section/learning-pathways"
      className="group relative block overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/[0.03] to-transparent p-6 transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-center gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-base">
            New here? Start with the Learning Pathways
          </p>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Structured modules across four tiers — the recommended starting point for all teams.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tiers.map((tier) => (
              <span
                key={tier.label}
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tier.color}`}
              >
                {tier.label}
              </span>
            ))}
          </div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function SectionCard({
  section,
  delay,
}: {
  section: (typeof sections)[0];
  delay: number;
}) {
  const Icon = section.icon;
  return (
    <Link
      to={`/section/${section.id}`}
      className="group block opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <Card className="h-full border border-border/60 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">
        <CardContent className="p-5">
          <div className="flex items-start gap-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
              style={{ backgroundColor: section.color + "14", color: section.color }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground leading-snug">
                {section.title}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {section.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-primary">
                  {section.resourceCount} resources
                </p>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all group-hover:text-primary group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Index() {
  let cardIndex = 0;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pb-16 md:px-8">
        {/* Hero */}
        <div
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
        >
          <HeroSection />
        </div>

        <div className="mt-8 space-y-10">
          {/* Stats */}
          <div
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: "80ms", animationFillMode: "forwards" }}
          >
            <StatsRow />
          </div>

          {/* Start Here */}
          <div
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: "160ms", animationFillMode: "forwards" }}
          >
            <StartHereCallout />
          </div>

          {/* Sections by category */}
          {categories.map((category, catIdx) => {
            const catSections = sections.filter((s) => s.category === category);
            const baseDelay = 240 + catIdx * 60;

            return (
              <div
                key={category}
                className="opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${baseDelay}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-4">
                  {category}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catSections.map((section) => {
                    const delay = baseDelay + 40 + cardIndex * 40;
                    cardIndex++;
                    return (
                      <SectionCard
                        key={section.id}
                        section={section}
                        delay={delay}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
