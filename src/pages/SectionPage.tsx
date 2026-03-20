import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, ChevronRight } from "lucide-react";
import { getSectionById } from "@/data/sections";
import type { ResourceItem } from "@/data/sections";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const tierMeta: Record<string, { label: string; description: string }> = {
  t1: { label: "Tier 1 — Foundations", description: "Core awareness for all employees" },
  t2: { label: "Tier 2 — Champions", description: "Deeper knowledge for neurodiversity champions" },
  t3: { label: "Tier 3 — Managers", description: "Practical skills for people leaders" },
  t4: { label: "Tier 4 — Strategic Leaders", description: "Organisational strategy and measurement" },
};

function getTier(resourceId: string): string | null {
  const match = resourceId.match(/--(t[1-4])-/);
  return match ? match[1] : null;
}

function ResourceCard({
  resource,
  index,
  sectionId,
  color,
  animationDelay,
}: {
  resource: ResourceItem;
  index: number;
  sectionId: string;
  color: string;
  animationDelay: number;
}) {
  return (
    <div
      className="opacity-0 animate-fade-up"
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: "forwards",
      }}
    >
      <Link
        to={`/section/${sectionId}/resource/${resource.id}`}
        className="block group"
      >
        <Card className="relative overflow-hidden border border-border/60 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.015] hover:border-border">
          <div
            className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
            style={{ backgroundColor: color }}
          />
          <CardContent className="flex items-center gap-4 p-4 pl-5">
            {/* Resource number badge */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors duration-300"
              style={{
                backgroundColor: color + "14",
                color: color,
              }}
            >
              {index + 1}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground group-hover:text-foreground/90 transition-colors truncate">
                {resource.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {resource.description}
              </p>
            </div>

            {/* Chevron */}
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:text-muted-foreground group-hover:translate-x-0.5" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

export default function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? getSectionById(sectionId) : undefined;

  if (!section) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold">Section not found</h1>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const Icon = section.icon;
  const isLearningPathways = section.id === "learning-pathways";

  // Group resources by tier for learning-pathways
  const tieredGroups: { tier: string; resources: ResourceItem[] }[] = [];
  if (isLearningPathways) {
    const tierMap = new Map<string, ResourceItem[]>();
    for (const resource of section.resources) {
      const tier = getTier(resource.id) ?? "other";
      if (!tierMap.has(tier)) tierMap.set(tier, []);
      tierMap.get(tier)!.push(resource);
    }
    for (const [tier, resources] of tierMap) {
      tieredGroups.push({ tier, resources });
    }
  }

  // Running index for staggered animation across all resources
  let globalIndex = 0;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{section.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back link */}
      <div
        className="opacity-0 animate-fade-up"
        style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Section header */}
      <div
        className="opacity-0 animate-fade-up"
        style={{ animationDelay: "40ms", animationFillMode: "forwards" }}
      >
        <div className="flex items-start gap-5">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm"
            style={{ backgroundColor: section.color + "18", color: section.color }}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {section.title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              {section.description}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: section.color + "14", color: section.color }}
              >
                <FileText className="h-3 w-3" />
                {section.resourceCount} resources
              </span>
              <span className="text-xs text-muted-foreground">{section.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div
        className="opacity-0 animate-fade-up"
        style={{ animationDelay: "80ms", animationFillMode: "forwards" }}
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">{section.resources.length}</span> of{" "}
            <span className="font-medium text-foreground">{section.resourceCount}</span> resources
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(section.resources.length / section.resourceCount) * 100}%`,
              backgroundColor: section.color,
            }}
          />
        </div>
      </div>

      {/* Resources */}
      {isLearningPathways ? (
        <div className="space-y-8">
          {tieredGroups.map((group) => {
            const meta = tierMeta[group.tier];
            const groupStartIndex = globalIndex;
            return (
              <div key={group.tier} className="space-y-3">
                {/* Tier heading */}
                <div
                  className="opacity-0 animate-fade-up"
                  style={{
                    animationDelay: `${100 + groupStartIndex * 40}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex items-center gap-3 pb-1">
                    <div
                      className="h-6 w-1 rounded-full"
                      style={{ backgroundColor: section.color }}
                    />
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        {meta?.label ?? group.tier}
                      </h2>
                      {meta?.description && (
                        <p className="text-xs text-muted-foreground">{meta.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tier resources */}
                <div className="space-y-2 pl-1">
                  {group.resources.map((resource, idx) => {
                    const cardIndex = globalIndex++;
                    return (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        index={idx}
                        sectionId={section.id}
                        color={section.color}
                        animationDelay={120 + cardIndex * 40}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {section.resources.map((resource, idx) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              index={idx}
              sectionId={section.id}
              color={section.color}
              animationDelay={120 + idx * 40}
            />
          ))}
        </div>
      )}
    </div>
  );
}
