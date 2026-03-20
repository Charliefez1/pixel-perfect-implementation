import {
  Target,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  BookOpen,
  Brain,
  HandHelping,
  XCircle,
  CircleDot,
  ListChecks,
  MessageCircle,
  Drama,
  Rocket,
  FileText,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Block types produced by the parser
// ---------------------------------------------------------------------------

interface TextBlock {
  type: "paragraph";
  html: string;
}
interface HeadingBlock {
  type: "heading";
  level: 2 | 3;
  text: string;
  html: string;
}
interface ListBlock {
  type: "list";
  ordered: boolean;
  items: string[];
}
interface BoldCardBlock {
  type: "bold-cards";
  items: { label: string; description: string }[];
}
interface StepFlowBlock {
  type: "step-flow";
  steps: { label: string; description: string }[];
}
interface CalloutBlock {
  type: "callout";
  variant: CalloutVariant;
  title: string;
  children: ParsedBlock[];
}
interface TwoColumnBlock {
  type: "two-column";
  left: { title: string; children: ParsedBlock[] };
  right: { title: string; children: ParsedBlock[] };
}

type CalloutVariant =
  | "objectives"
  | "takeaways"
  | "helps"
  | "not"
  | "strengths"
  | "challenges"
  | "tip"
  | "info"
  | "quick-reference"
  | "reflection"
  | "scenario"
  | "action"
  | "template"
  | "core-content"
  | "assessment";

type ParsedBlock =
  | TextBlock
  | HeadingBlock
  | ListBlock
  | BoldCardBlock
  | StepFlowBlock
  | CalloutBlock
  | TwoColumnBlock;

// ---------------------------------------------------------------------------
// Inline markdown → HTML
// ---------------------------------------------------------------------------

function processInline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="inline-code">$1</code>');
}

// ---------------------------------------------------------------------------
// Classify H2 headings into callout types
// ---------------------------------------------------------------------------

function classifyHeading(text: string): CalloutVariant | null {
  const lower = text.toLowerCase();
  if (lower.includes("learning objective")) return "objectives";
  if (lower.includes("key takeaway")) return "takeaways";
  if (lower.includes("what helps") || lower.includes("what you can do") || lower.includes("practical action") || lower.includes("practical strategies") || lower.includes("what to do") || lower.includes("how to start") || lower.includes("how to identify") || lower.includes("how to use")) return "helps";
  if (lower.includes("is not") || lower.includes("what allyship is not") || lower.includes("what neurodivergence is not")) return "not";
  if (lower.includes("strength")) return "strengths";
  if (lower.includes("challenge")) return "challenges";
  if (lower.includes("tip") || lower.includes("best practice") || lower.includes("recommendation")) return "tip";
  if (lower.includes("quick reference")) return "quick-reference";
  if (lower.includes("reflection")) return "reflection";
  if (lower.includes("what is happening") || lower.includes("how it might feel") || lower.includes("scenario") || lower.includes("what you are experiencing")) return "scenario";
  if (lower.includes("immediate step") || lower.includes("strategies for recovery") || lower.includes("processing")) return "action";
  if (lower.includes("template") || lower.includes("alignment plan")) return "template";
  if (lower.includes("core content") || lower.includes("core principle") || lower.includes("further reading")) return "core-content";
  if (lower.includes("assessment criteria") || lower.includes("domain score") || lower.includes("scoring")) return "assessment";
  if (lower.includes("overview") || lower.includes("before you") || lower.includes("who to") || lower.includes("your rights") || lower.includes("longer term") || lower.includes("why ")) return "info";
  return null;
}

// ---------------------------------------------------------------------------
// Detect bold-prefixed paragraphs → card blocks
// ---------------------------------------------------------------------------

function tryParseBoldCards(block: string): BoldCardBlock | null {
  const boldPattern = /^\*\*(.+?)\*\*\s*(.+)$/;
  const lines = block.split("\n").filter(Boolean);
  if (lines.length < 2) return null;

  const matches = lines.map((l) => l.match(boldPattern)).filter(Boolean);
  if (matches.length < 2 || matches.length < lines.length * 0.6) return null;

  return {
    type: "bold-cards",
    items: matches.map((m) => ({
      label: m![1],
      description: m![2],
    })),
  };
}

// ---------------------------------------------------------------------------
// Detect Step patterns → step flow blocks
// ---------------------------------------------------------------------------

function tryParseStepFlow(block: string): StepFlowBlock | null {
  const stepPattern = /^(?:Step\s+(\d+)[:.]?\s*)(.*)/i;
  const lines = block.split("\n").filter(Boolean);
  const matches = lines.map((l) => l.match(stepPattern)).filter(Boolean);
  if (matches.length < 2) return null;

  return {
    type: "step-flow",
    steps: matches.map((m) => ({
      label: `Step ${m![1]}`,
      description: m![2],
    })),
  };
}

// ---------------------------------------------------------------------------
// Parse raw markdown into blocks
// ---------------------------------------------------------------------------

function parseMarkdown(content: string): ParsedBlock[] {
  const rawBlocks = content.split("\n\n").map((b) => b.trim()).filter(Boolean);
  const blocks: ParsedBlock[] = [];
  let skippedFirstH1 = false;

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i];

    // Skip first H1 (page title)
    if (block.startsWith("# ") && !block.startsWith("## ") && !block.startsWith("### ")) {
      if (!skippedFirstH1) {
        skippedFirstH1 = true;
        continue;
      }
    }

    // H3
    if (block.startsWith("### ")) {
      blocks.push({
        type: "heading",
        level: 3,
        text: block.slice(4),
        html: processInline(block.slice(4)),
      });
      continue;
    }

    // H2 — check if it should be a callout
    if (block.startsWith("## ")) {
      const headingText = block.slice(3);
      const variant = classifyHeading(headingText);

      if (variant) {
        const children: ParsedBlock[] = [];
        let j = i + 1;
        while (j < rawBlocks.length && !rawBlocks[j].startsWith("## ")) {
          const child = parseSingleBlock(rawBlocks[j]);
          if (child) children.push(child);
          j++;
        }
        blocks.push({
          type: "callout",
          variant,
          title: headingText,
          children,
        });
        i = j - 1;
        continue;
      }

      blocks.push({
        type: "heading",
        level: 2,
        text: headingText,
        html: processInline(headingText),
      });
      continue;
    }

    const parsed = parseSingleBlock(block);
    if (parsed) blocks.push(parsed);
  }

  // Post-process: merge adjacent strengths + challenges into two-column
  const merged: ParsedBlock[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const curr = blocks[i];
    const next = blocks[i + 1];
    if (
      curr.type === "callout" &&
      next?.type === "callout" &&
      ((curr.variant === "strengths" && next.variant === "challenges") ||
        (curr.variant === "challenges" && next.variant === "strengths"))
    ) {
      const left = curr.variant === "strengths" ? curr : next;
      const right = curr.variant === "challenges" ? curr : next;
      merged.push({
        type: "two-column",
        left: { title: left.title, children: left.children },
        right: { title: right.title, children: right.children },
      });
      i++;
    } else {
      merged.push(curr);
    }
  }

  return merged;
}

function parseSingleBlock(block: string): ParsedBlock | null {
  if (!block.trim()) return null;

  // Skip H1s
  if (block.startsWith("# ") && !block.startsWith("## ")) return null;

  // H3
  if (block.startsWith("### ")) {
    return {
      type: "heading",
      level: 3,
      text: block.slice(4),
      html: processInline(block.slice(4)),
    };
  }

  // H2
  if (block.startsWith("## ")) {
    return {
      type: "heading",
      level: 2,
      text: block.slice(3),
      html: processInline(block.slice(3)),
    };
  }

  const lines = block.split("\n");

  // Unordered list
  if (lines.every((l) => l.trim().startsWith("- ") || l.trim() === "")) {
    return {
      type: "list",
      ordered: false,
      items: lines.filter((l) => l.trim().startsWith("- ")).map((l) => l.trim().slice(2)),
    };
  }

  // Ordered list
  if (lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === "")) {
    return {
      type: "list",
      ordered: true,
      items: lines
        .filter((l) => /^\d+\.\s/.test(l.trim()))
        .map((l) => l.trim().replace(/^\d+\.\s/, "")),
    };
  }

  // Try bold-card pattern
  const boldCards = tryParseBoldCards(block);
  if (boldCards) return boldCards;

  // Try step flow pattern
  const stepFlow = tryParseStepFlow(block);
  if (stepFlow) return stepFlow;

  // Paragraph
  return {
    type: "paragraph",
    html: processInline(block.replace(/\n/g, " ")),
  };
}

// ---------------------------------------------------------------------------
// Callout config
// ---------------------------------------------------------------------------

const calloutConfig: Record<
  CalloutVariant,
  { icon: LucideIcon; bg: string; border: string; iconColor: string; titleColor: string }
> = {
  objectives: {
    icon: Target,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-200",
  },
  takeaways: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    titleColor: "text-emerald-900 dark:text-emerald-200",
  },
  helps: {
    icon: Lightbulb,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-900 dark:text-amber-200",
  },
  not: {
    icon: XCircle,
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800",
    iconColor: "text-rose-600 dark:text-rose-400",
    titleColor: "text-rose-900 dark:text-rose-200",
  },
  strengths: {
    icon: Sparkles,
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    iconColor: "text-violet-600 dark:text-violet-400",
    titleColor: "text-violet-900 dark:text-violet-200",
  },
  challenges: {
    icon: AlertTriangle,
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-600 dark:text-orange-400",
    titleColor: "text-orange-900 dark:text-orange-200",
  },
  tip: {
    icon: Zap,
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-800",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    titleColor: "text-cyan-900 dark:text-cyan-200",
  },
  info: {
    icon: BookOpen,
    bg: "bg-slate-50 dark:bg-slate-800/30",
    border: "border-slate-200 dark:border-slate-700",
    iconColor: "text-slate-600 dark:text-slate-400",
    titleColor: "text-slate-900 dark:text-slate-200",
  },
  "quick-reference": {
    icon: Zap,
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    titleColor: "text-indigo-900 dark:text-indigo-200",
  },
  reflection: {
    icon: MessageCircle,
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
    titleColor: "text-purple-900 dark:text-purple-200",
  },
  scenario: {
    icon: Drama,
    bg: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-200 dark:border-pink-800",
    iconColor: "text-pink-600 dark:text-pink-400",
    titleColor: "text-pink-900 dark:text-pink-200",
  },
  action: {
    icon: Rocket,
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200 dark:border-teal-800",
    iconColor: "text-teal-600 dark:text-teal-400",
    titleColor: "text-teal-900 dark:text-teal-200",
  },
  template: {
    icon: FileText,
    bg: "bg-stone-50 dark:bg-stone-900/30",
    border: "border-stone-300 dark:border-stone-700",
    iconColor: "text-stone-600 dark:text-stone-400",
    titleColor: "text-stone-900 dark:text-stone-200",
  },
  "core-content": {
    icon: BookOpen,
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800",
    iconColor: "text-sky-600 dark:text-sky-400",
    titleColor: "text-sky-900 dark:text-sky-200",
  },
  assessment: {
    icon: ClipboardList,
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    titleColor: "text-yellow-900 dark:text-yellow-200",
  },
};

// ---------------------------------------------------------------------------
// Renderers
// ---------------------------------------------------------------------------

function RenderCallout({ block }: { block: CalloutBlock }) {
  const config = calloutConfig[block.variant];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-5 md:p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <h3 className={`text-sm font-semibold uppercase tracking-wide ${config.titleColor}`}>
          {block.title}
        </h3>
      </div>
      <div className="space-y-3 pl-11">
        {block.children.map((child, i) => (
          <RenderBlock key={i} block={child} nested />
        ))}
      </div>
    </div>
  );
}

function RenderBoldCards({ block }: { block: BoldCardBlock }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {block.items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-border/60 bg-card p-4 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <CircleDot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RenderStepFlow({ block }: { block: StepFlowBlock }) {
  return (
    <div className="relative ml-4 border-l-2 border-primary/20 pl-6 space-y-6">
      {block.steps.map((step, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-[calc(1.5rem+1px)] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
            {i + 1}
          </div>
          <div className="pt-1">
            <p className="text-sm font-semibold text-foreground">{step.label}</p>
            <p
              className="mt-1 text-sm leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: processInline(step.description) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RenderList({ block, nested }: { block: ListBlock; nested?: boolean }) {
  const iconForItem = (text: string): LucideIcon => {
    const lower = text.toLowerCase();
    if (lower.includes("strength") || lower.includes("creative") || lower.includes("focus"))
      return Sparkles;
    if (lower.includes("challenge") || lower.includes("difficult") || lower.includes("barrier"))
      return AlertTriangle;
    if (lower.includes("help") || lower.includes("support"))
      return HandHelping;
    if (lower.includes("listen") || lower.includes("empathy") || lower.includes("trust"))
      return Heart;
    if (lower.includes("action") || lower.includes("do") || lower.includes("advocate"))
      return ArrowRight;
    if (lower.includes("avoid") || lower.includes("not") || lower.includes("never"))
      return Shield;
    return CircleDot;
  };

  return (
    <ul className={`space-y-2.5 ${nested ? "" : "my-2"}`}>
      {block.items.map((item, i) => {
        const ItemIcon = block.ordered ? ListChecks : iconForItem(item);
        return (
          <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90">
            <span className="mt-0.5 shrink-0">
              {block.ordered ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
              ) : (
                <ItemIcon className="h-4 w-4 text-muted-foreground/60" />
              )}
            </span>
            <span dangerouslySetInnerHTML={{ __html: processInline(item) }} />
          </li>
        );
      })}
    </ul>
  );
}

function RenderTwoColumn({ block }: { block: TwoColumnBlock }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={`rounded-xl border ${calloutConfig.strengths.border} ${calloutConfig.strengths.bg} p-5`}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={`h-5 w-5 ${calloutConfig.strengths.iconColor}`} />
          <h4 className={`text-sm font-semibold ${calloutConfig.strengths.titleColor}`}>
            {block.left.title}
          </h4>
        </div>
        <div className="space-y-2">
          {block.left.children.map((child, i) => (
            <RenderBlock key={i} block={child} nested />
          ))}
        </div>
      </div>
      <div className={`rounded-xl border ${calloutConfig.challenges.border} ${calloutConfig.challenges.bg} p-5`}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className={`h-5 w-5 ${calloutConfig.challenges.iconColor}`} />
          <h4 className={`text-sm font-semibold ${calloutConfig.challenges.titleColor}`}>
            {block.right.title}
          </h4>
        </div>
        <div className="space-y-2">
          {block.right.children.map((child, i) => (
            <RenderBlock key={i} block={child} nested />
          ))}
        </div>
      </div>
    </div>
  );
}

function RenderBlock({ block, nested }: { block: ParsedBlock; nested?: boolean }) {
  switch (block.type) {
    case "heading":
      if (block.level === 2) {
        return (
          <div className="flex items-center gap-3 mt-10 mb-4">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <h2
              className="text-lg font-semibold tracking-tight text-foreground"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          </div>
        );
      }
      return (
        <h3
          className="text-base font-semibold text-foreground mt-6 mb-2"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case "paragraph":
      return (
        <p
          className={`text-sm leading-relaxed text-foreground/80 ${nested ? "" : "my-3"}`}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case "list":
      return <RenderList block={block} nested={nested} />;

    case "bold-cards":
      return <RenderBoldCards block={block} />;

    case "step-flow":
      return <RenderStepFlow block={block} />;

    case "callout":
      return <RenderCallout block={block} />;

    case "two-column":
      return <RenderTwoColumn block={block} />;

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface VisualMarkdownProps {
  content: string;
  sectionColor?: string;
}

export default function VisualMarkdown({ content, sectionColor }: VisualMarkdownProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {blocks.map((block, i) => (
        <RenderBlock key={i} block={block} />
      ))}
    </div>
  );
}
