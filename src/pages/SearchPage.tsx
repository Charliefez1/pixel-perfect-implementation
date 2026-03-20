import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Search, FileText } from "lucide-react";
import { sections } from "@/data/sections";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const lowerQuery = query.toLowerCase();

  const results = query
    ? sections.flatMap((section) =>
        section.resources
          .filter(
            (r) =>
              r.title.toLowerCase().includes(lowerQuery) ||
              r.description.toLowerCase().includes(lowerQuery) ||
              r.content.toLowerCase().includes(lowerQuery)
          )
          .map((r) => ({ ...r, section }))
      )
    : [];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Search results for &ldquo;{query}&rdquo;
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {results.length} result{results.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {results.length === 0 && query && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">
            No resources match &ldquo;{query}&rdquo;. Try a different search term.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {results.map((result, idx) => {
          const Icon = result.section.icon;
          return (
            <Link
              key={`${result.id}-${idx}`}
              to={`/section/${result.section.id}/resource/${result.id}`}
            >
              <Card className="border border-border/60 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 mb-2">
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: result.section.color + "14",
                      color: result.section.color,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {result.description}
                    </p>
                    <p className="text-[11px] font-medium mt-1.5" style={{ color: result.section.color }}>
                      {result.section.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
