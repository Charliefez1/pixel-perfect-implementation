import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ChevronLeft, FileQuestion } from "lucide-react";
import { getSectionById } from "@/data/sections";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// ---------------------------------------------------------------------------
// Markdown helpers
// ---------------------------------------------------------------------------

function processInline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderMarkdown(content: string): string {
  let skippedFirstH1 = false;
  return content
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";

      // Headings — skip the first h1 since it duplicates the page title
      if (block.startsWith("### "))
        return `<h3>${processInline(block.slice(4))}</h3>`;
      if (block.startsWith("## "))
        return `<h2>${processInline(block.slice(3))}</h2>`;
      if (block.startsWith("# ")) {
        if (!skippedFirstH1) {
          skippedFirstH1 = true;
          return "";
        }
        return `<h1>${processInline(block.slice(2))}</h1>`;
      }

      // Unordered list blocks
      const lines = block.split("\n");
      if (lines.every((l) => l.trim().startsWith("- ") || l.trim() === "")) {
        const items = lines
          .filter((l) => l.trim().startsWith("- "))
          .map((l) => `<li>${processInline(l.trim().slice(2))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      // Ordered list blocks
      if (
        lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === "")
      ) {
        const items = lines
          .filter((l) => /^\d+\.\s/.test(l.trim()))
          .map(
            (l) =>
              `<li>${processInline(l.trim().replace(/^\d+\.\s/, ""))}</li>`,
          )
          .join("");
        return `<ol>${items}</ol>`;
      }

      // Default: paragraph (collapse internal newlines into spaces)
      return `<p>${processInline(block.replace(/\n/g, " "))}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

// ---------------------------------------------------------------------------
// Not-found state
// ---------------------------------------------------------------------------

function ResourceNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-2xl font-semibold tracking-tight">
        Resource not found
      </h1>
      <p className="max-w-md text-muted-foreground">
        The resource you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResourcePage
// ---------------------------------------------------------------------------

export default function ResourcePage() {
  const { sectionId, resourceId } = useParams<{
    sectionId: string;
    resourceId: string;
  }>();

  // ---- Data resolution ----
  const section = sectionId ? getSectionById(sectionId) : undefined;

  const resourceIndex =
    section?.resources.findIndex((r) => r.id === resourceId) ?? -1;
  const resource =
    section && resourceIndex !== -1
      ? section.resources[resourceIndex]
      : undefined;

  const prevResource =
    section && resourceIndex > 0
      ? section.resources[resourceIndex - 1]
      : undefined;
  const nextResource =
    section && resourceIndex < (section?.resources.length ?? 0) - 1
      ? section.resources[resourceIndex + 1]
      : undefined;

  // ---- 404 ----
  if (!section || !resource) {
    return <ResourceNotFound />;
  }

  // Resolve the section icon component
  const SectionIcon = section.icon;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back link */}
      <Link
        to={`/section/${section.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {section.title}
      </Link>

      {/* Breadcrumbs */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/section/${section.id}`}>{section.title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>{resource.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-10 flex items-start gap-4">
        {/* Section icon badge */}
        <div
          className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: section.color ?? "var(--primary)" }}
        >
          <SectionIcon className="h-6 w-6 text-white" />
        </div>

        {/* Colored accent bar + title */}
        <div className="flex items-center gap-4">
          <div
            className="w-1 self-stretch rounded-full"
            style={{ backgroundColor: section.color ?? "var(--primary)" }}
          />
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            {resource.title}
          </h1>
        </div>
      </div>

      {/* Visual content */}
      <VisualMarkdown content={resource.content} sectionColor={section.color} />

      {/* Previous / Next navigation */}
      <nav className="mx-auto mt-16 flex max-w-3xl items-center justify-between border-t pt-8">
        {prevResource ? (
          <Link
            to={`/section/${section.id}/resource/${prevResource.id}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                Previous
              </span>
              <span className="font-medium text-foreground">
                {prevResource.title}
              </span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextResource ? (
          <Link
            to={`/section/${section.id}/resource/${nextResource.id}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <div className="text-left">
              <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                Next
              </span>
              <span className="font-medium text-foreground">
                {nextResource.title}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
