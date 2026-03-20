import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Layers, FileText, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { sections, totalResources, categories } from "@/data/sections";

function StatsRow() {
  const contentTypes = new Set(sections.map((s) => s.category)).size;
  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: "Resources", value: totalResources, icon: FileText },
        { label: "Sections", value: sections.length, icon: Layers },
        { label: "Categories", value: contentTypes, icon: BookOpen },
      ].map((stat) => (
        <Card key={stat.label} className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StartHereCallout() {
  return (
    <Link
      to="/section/foundation-learning"
      className="group block rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 transition-colors hover:border-primary/50 hover:bg-primary/10"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">
            New here? Start with the Foundations
          </p>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Our Foundation Learning Pathway covers the core concepts of neurodiversity and
            neuroinclusion — the recommended starting point for all teams.
          </p>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}

function SectionCard({ section }: { section: (typeof sections)[0] }) {
  const Icon = section.icon;
  return (
    <Link to={`/section/${section.id}`} className="group block">
      <Card className="h-full border shadow-sm transition-shadow hover:shadow-md active:scale-[0.98]">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: section.color + "18", color: section.color }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground leading-snug">
                {section.title}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {section.description}
              </p>
              <p className="mt-2 text-[11px] font-medium text-primary">
                {section.resourceCount} resources
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Index() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div
        className="opacity-0 animate-fade-up"
        style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Neuroinclusion Resource Hub
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl leading-relaxed">
          Browse {totalResources} resources across {sections.length} sections to build a
          neuroinclusive workplace. Start with the foundations or jump to a specific toolkit.
        </p>
      </div>

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
        return (
          <div
            key={category}
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: `${240 + catIdx * 80}ms`,
              animationFillMode: "forwards",
            }}
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catSections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
