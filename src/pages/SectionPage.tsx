import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { getSectionById } from "@/data/sections";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? getSectionById(sectionId) : undefined;

  if (!section) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold">Section not found</h1>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
      </div>
    );
  }

  const Icon = section.icon;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
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

      {/* Header */}
      <div
        className="opacity-0 animate-fade-up"
        style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: section.color + "18", color: section.color }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{section.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-lg">
              {section.description}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{section.resourceCount}</span> resources
              {" · "}
              <span className="text-muted-foreground">{section.category}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Resources list */}
      <div className="space-y-2">
        {section.resources.map((resource, idx) => (
          <div
            key={resource.id}
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: `${80 + idx * 40}ms`,
              animationFillMode: "forwards",
            }}
          >
            <Card className="border shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{resource.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {resource.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
