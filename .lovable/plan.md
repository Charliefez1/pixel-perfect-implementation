

# Full Audit & Visual Overhaul Plan

## Audit Findings

### 1. Language Misalignment with Reference Project
The reference project ("Project Overview Hub") uses four session tiers: **Aware**, **Advocate**, **People Leaders**, **Executive**. The resource hub has inconsistencies:

| Current (Resource Hub) | Should Be (per Reference) |
|---|---|
| Tier 1 — Foundations | Tier 1 — Aware |
| Tier 4 — Strategic Leaders | Tier 4 — Executive |
| "# Manager" in content body (line 314) | "# People Leader" |
| "Manager Guide for Office Teams" (line 828) | "People Leader Guide for Office Teams" |
| "Manager Guidance" title (line 912) | "People Leader Guidance" |
| "Neuroinclusion Audit: Manager Capability" (line 864) | "Neuroinclusion Audit: People Leader Capability" |
| ~106 remaining instances of "manager/Manager" in content text | All should be "people leader/People Leader" |
| "What I want my manager to know" in self-assessment (line 908) | "What I want my people leader to know" |

### 2. Content is Still Too Wordy
The VisualMarkdown parser only catches 7 heading patterns for callouts. Many H2 headings that contain actionable content fall through as plain text:
- "Quick Reference" sections render as plain paragraphs
- "Reflection questions" render as plain text
- "Core content" sections render as walls of text
- "How to...", "What to do if...", "Practical strategies" sections render as plain paragraphs
- Long paragraph blocks with bold items (e.g., `**Step 1:...**`) are not parsed into visual steps
- Self-assessment sections with rating scales render as flat text

### 3. Formatting Issues
- Some resources have no H2 headings at all (Quick Reference guides), rendering as one long paragraph
- The `## Quick Reference` and `## Microlearning Module` headings aren't mapped to any callout variant
- Bold-prefixed lists (`**Fear of judgement.** Worrying that...`) render as paragraphs, not as structured callout cards
- Numbered steps embedded in paragraphs (Step 1, Step 2...) aren't extracted into visual step components
- Self-assessment templates (rating scales, fill-in blanks) render as plain text

---

## Implementation Plan

### Task 1: Fix All Remaining Language Misalignments
- Rename Tier 1 from "Foundations" to "Aware" and Tier 4 from "Strategic Leaders" to "Executive" in `SectionPage.tsx` tier metadata
- Replace all remaining ~106 instances of "manager/Manager" with "people leader/People Leader" in `sections.ts` content bodies, titles, and descriptions
- Update H1 titles in content that still say "# Manager" to "# People Leader"

### Task 2: Expand VisualMarkdown Callout System
Add new callout variants and heading classifiers to `VisualMarkdown.tsx`:
- **"quick-reference"** — for `## Quick Reference` headings (compact card with lightning bolt icon)
- **"microlearning"** — for `## Microlearning Module` headings (brain icon, learning-focused styling)
- **"reflection"** — for `## Reflection questions` (thought bubble icon, numbered question cards)
- **"scenario"** — for `## What is happening` / `## How it might feel` (drama/scenario styling)
- **"action"** — for `## Practical strategies` / `## What to do` / `## How to start` (action-oriented green cards)
- **"steps"** — for `## Intake process` / content with Step 1, Step 2 patterns (numbered step flow)
- **"template"** — for `## Template` / content with fill-in blanks (form-like card styling)
- **"core-content"** — for `## Core content` headings (book icon, structured summary)

### Task 3: Parse Bold-Prefixed Content into Visual Cards
Enhance the paragraph parser to detect patterns like `**Bold text.** Description...` and render them as icon+label card grids instead of plain paragraphs. This transforms the most common wordy pattern across ~80+ resources into scannable visual blocks.

### Task 4: Add Step Flow Component
Parse numbered steps embedded in paragraphs (`Step 1:`, `Step 2:`, etc.) into a vertical timeline/step-flow component with numbered circles and connector lines.

### Task 5: Visual Enhancements for Self-Assessment Templates
Detect rating scales (`Rate each statement from 1...5`) and fill-in fields (`___`) and render them as styled form-like components with visual input areas, making the templates look interactive rather than plain text.

### Task 6: Improve Quick Reference Guides Formatting
The ~30 Quick Reference guides are single-paragraph walls of text. Split them at sentence boundaries where colons introduce lists, and render as bullet-point cards with icons. This is the single biggest visual improvement since these guides are the most-used resources.

### Task 7: Dashboard and Section Page Polish
- Add the 4-tier session type badges to the dashboard (Aware, Advocate, People Leaders, Executive) matching the reference project's terminology
- Ensure section cards show visual previews of content types (icons for guides, templates, scenarios)

---

## Files Changed
- `src/data/sections.ts` — language fixes (~106 manager→people leader replacements, tier name updates)
- `src/pages/SectionPage.tsx` — tier label updates (Foundations→Aware, Strategic Leaders→Executive)
- `src/components/content/VisualMarkdown.tsx` — major expansion with new callout variants, bold-prefix parser, step flow, template styling, reflection cards
- `src/pages/Index.tsx` — minor updates to align session tier terminology

