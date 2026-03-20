import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { sections } from "@/data/sections";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = query
    ? sections
        .flatMap((section) =>
          section.resources
            .filter(
              (r) =>
                r.title.toLowerCase().includes(query.toLowerCase()) ||
                r.description.toLowerCase().includes(query.toLowerCase())
            )
            .map((r) => ({ ...r, section }))
        )
        .concat(
          sections
            .filter(
              (s) =>
                s.title.toLowerCase().includes(query.toLowerCase()) ||
                s.description.toLowerCase().includes(query.toLowerCase())
            )
            .map((s) => ({
              id: s.id,
              title: s.title,
              description: s.description,
              section: s,
            }))
        )
    : [];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Search results for "{query}"
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {results.length} result{results.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {results.length === 0 && query && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">
            No resources match "{query}". Try a different search term.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {results.map((result, idx) => (
          <Link key={`${result.id}-${idx}`} to={`/section/${result.section.id}`}>
            <Card className="border shadow-sm transition-shadow hover:shadow-md mb-2">
              <CardContent className="p-4">
                <p className="text-sm font-medium">{result.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.description}
                </p>
                <p className="text-[11px] text-primary mt-2">
                  in {result.section.title}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
