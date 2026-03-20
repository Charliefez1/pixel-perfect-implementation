import { readdir, readFile, writeFile } from "fs/promises";
import { join, basename } from "path";

const BASE = "/Users/macbook/Obsidian/NDG/Templates/Post workshop Resources";

const SECTIONS = [
  {
    folder: "Learning Pathways",
    id: "learning-pathways",
    title: "Learning Pathways",
    shortTitle: "Pathways",
    description: "Structured learning modules across four tiers — from foundations through to strategic leadership in neuroinclusion.",
    icon: "GraduationCap",
    category: "Learning",
    color: "hsl(221, 83%, 53%)",
  },
  {
    folder: "Learning Library",
    id: "learning-library",
    title: "Learning Library",
    shortTitle: "Library",
    description: "Topic-based reference articles covering key neurodiversity subjects including ADHD, autism, dyslexia, and workplace strategies.",
    icon: "BookOpen",
    category: "Learning",
    color: "hsl(262, 52%, 47%)",
  },
  {
    folder: "Microlearning",
    id: "microlearning",
    title: "Microlearning Modules",
    shortTitle: "Microlearning",
    description: "Bite-sized learning modules you can complete in under five minutes — practical tips for immediate application.",
    icon: "Zap",
    category: "Learning",
    color: "hsl(38, 92%, 50%)",
  },
  {
    folder: "Manager Toolkit",
    id: "manager-toolkit",
    title: "Manager Toolkit",
    shortTitle: "Managers",
    description: "Comprehensive guides to help managers support neurodivergent team members — from disclosure conversations to performance management.",
    icon: "Users",
    category: "Toolkits",
    color: "hsl(173, 58%, 39%)",
  },
  {
    folder: "Employee Toolkit",
    id: "employee-toolkit",
    title: "Employee Toolkit",
    shortTitle: "Employees",
    description: "Self-support resources for neurodivergent employees — understanding your patterns, managing energy, and advocating for your needs.",
    icon: "Heart",
    category: "Toolkits",
    color: "hsl(347, 77%, 50%)",
  },
  {
    folder: "Champions Hub",
    id: "champions-hub",
    title: "Champions Hub",
    shortTitle: "Champions",
    description: "Everything a neuroinclusion champion needs — role guides, boundaries, discussion prompts, and local launch resources.",
    icon: "Award",
    category: "Toolkits",
    color: "hsl(38, 92%, 50%)",
  },
  {
    folder: "Guides/Quick Use Manager",
    id: "quick-use-manager",
    title: "Quick Use Manager Guides",
    shortTitle: "Manager Guides",
    description: "Practical one-page guides for managers — ready to use in the moment when situations arise on shift or in the office.",
    icon: "ClipboardList",
    category: "Quick Guides",
    color: "hsl(221, 83%, 53%)",
  },
  {
    folder: "Guides/Quick Use Employee",
    id: "quick-use-employee",
    title: "Quick Use Employee Guides",
    shortTitle: "Employee Guides",
    description: "Immediate, practical guides for employees — what to do when you are overwhelmed, need a break, or want to ask for support.",
    icon: "FileText",
    category: "Quick Guides",
    color: "hsl(173, 58%, 39%)",
  },
  {
    folder: "Guides/Quick Use Support Office",
    id: "quick-use-office",
    title: "Support Office Guides",
    shortTitle: "Office Guides",
    description: "Neuroinclusion guides tailored for office and hybrid environments — open plan focus, meeting load, and office adjustments.",
    icon: "Building2",
    category: "Quick Guides",
    color: "hsl(262, 52%, 47%)",
  },
  {
    folder: "Guides/Neuroinclusion Audit",
    id: "neuroinclusion-audit",
    title: "Neuroinclusion Audit",
    shortTitle: "Audit",
    description: "Structured audit frameworks to assess your organisation across six key areas of neuroinclusion maturity.",
    icon: "ClipboardCheck",
    category: "Quick Guides",
    color: "hsl(347, 77%, 50%)",
  },
  {
    folder: "Guides/Support and Self Service",
    id: "support-self-service",
    title: "Support & Self Service",
    shortTitle: "Support",
    description: "Self-service support tools including personal support profiles, strengths mapping, alignment plans, and referral guidance.",
    icon: "LifeBuoy",
    category: "Support",
    color: "hsl(221, 83%, 53%)",
  },
  {
    folder: "Scenarios",
    id: "scenarios",
    title: "Scenario-Based Learning",
    shortTitle: "Scenarios",
    description: "Real-world workplace scenarios with guided reflection — from sensory overload to disclosure conversations and team dynamics.",
    icon: "Drama",
    category: "Scenarios & Practice",
    color: "hsl(38, 92%, 50%)",
  },
  {
    folder: "Guides/Video Scripts",
    id: "video-scripts",
    title: "Video Scripts",
    shortTitle: "Videos",
    description: "Scripts for short video guides covering neuroinclusion topics — from simple tools to scenario-based learning.",
    icon: "Play",
    category: "Media",
    color: "hsl(262, 52%, 47%)",
  },
  {
    folder: "Audio Scripts",
    id: "audio-scripts",
    title: "Audio Scripts",
    shortTitle: "Audio",
    description: "Scripts for audio guides and podcast-style content on neuroinclusion strategies and practical approaches.",
    icon: "Headphones",
    category: "Media",
    color: "hsl(173, 58%, 39%)",
  },
];

function extractDescription(content) {
  const lines = content.split("\n");
  // Skip the title line and any blank lines, get the first paragraph
  let desc = "";
  let started = false;
  for (const line of lines) {
    if (line.startsWith("# ")) continue;
    if (line.startsWith("## ")) {
      if (started) break;
      continue;
    }
    const trimmed = line.trim();
    if (!trimmed) {
      if (started) break;
      continue;
    }
    if (trimmed.startsWith("**") || trimmed.startsWith("-") || trimmed.startsWith("1.")) {
      if (started) break;
      // Skip list items for description
      continue;
    }
    started = true;
    desc += (desc ? " " : "") + trimmed;
  }
  // Truncate to ~200 chars
  if (desc.length > 200) {
    desc = desc.substring(0, 197) + "...";
  }
  return desc || "Explore this resource for practical neuroinclusion guidance.";
}

function extractTitle(content, filename) {
  const match = content.match(/^#\s+(.+)/m);
  if (match) return match[1].trim();
  // Fallback: use filename
  return filename.replace(/^\d+\s+/, "").replace(/\.md$/, "");
}

function makeId(sectionId, filename) {
  return sectionId + "--" + filename
    .replace(/\.md$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readFolder(folderPath) {
  try {
    const entries = await readdir(folderPath);
    const mdFiles = entries.filter(f => f.endsWith(".md")).sort();
    const resources = [];
    for (const file of mdFiles) {
      const content = await readFile(join(folderPath, file), "utf-8");
      const title = extractTitle(content, file);
      const description = extractDescription(content);
      resources.push({ file, title, description, content });
    }
    return resources;
  } catch (e) {
    console.error(`Error reading ${folderPath}:`, e.message);
    return [];
  }
}

async function main() {
  const allSections = [];

  for (const section of SECTIONS) {
    const folderPath = join(BASE, section.folder);
    const resources = await readFolder(folderPath);

    const resourceItems = resources.map(r => ({
      id: makeId(section.id, r.file),
      title: r.title,
      description: r.description,
      content: r.content,
    }));

    allSections.push({
      ...section,
      resourceCount: resourceItems.length,
      resources: resourceItems,
    });
  }

  // Generate TypeScript
  const totalResources = allSections.reduce((sum, s) => sum + s.resourceCount, 0);

  const icons = [...new Set(allSections.map(s => s.icon))];
  const categories = [...new Set(allSections.map(s => s.category))];

  let ts = `import {\n`;
  ts += icons.map(i => `  ${i},`).join("\n");
  ts += `\n  type LucideIcon,\n} from "lucide-react";\n\n`;

  ts += `export interface ResourceItem {\n  id: string;\n  title: string;\n  description: string;\n  content: string;\n}\n\n`;
  ts += `export interface Section {\n  id: string;\n  title: string;\n  shortTitle: string;\n  description: string;\n  icon: LucideIcon;\n  category: string;\n  resourceCount: number;\n  resources: ResourceItem[];\n  color: string;\n}\n\n`;
  ts += `export const categories = [\n${categories.map(c => `  "${c}",`).join("\n")}\n] as const;\n\n`;

  ts += `export const sections: Section[] = [\n`;
  for (const s of allSections) {
    ts += `  {\n`;
    ts += `    id: "${s.id}",\n`;
    ts += `    title: ${JSON.stringify(s.title)},\n`;
    ts += `    shortTitle: ${JSON.stringify(s.shortTitle)},\n`;
    ts += `    description: ${JSON.stringify(s.description)},\n`;
    ts += `    icon: ${s.icon},\n`;
    ts += `    category: "${s.category}",\n`;
    ts += `    color: "${s.color}",\n`;
    ts += `    resourceCount: ${s.resourceCount},\n`;
    ts += `    resources: [\n`;
    for (const r of s.resources) {
      ts += `      {\n`;
      ts += `        id: ${JSON.stringify(r.id)},\n`;
      ts += `        title: ${JSON.stringify(r.title)},\n`;
      ts += `        description: ${JSON.stringify(r.description)},\n`;
      ts += `        content: ${JSON.stringify(r.content)},\n`;
      ts += `      },\n`;
    }
    ts += `    ],\n`;
    ts += `  },\n`;
  }
  ts += `];\n\n`;

  ts += `export const totalResources = ${totalResources};\n\n`;
  ts += `export function getSectionById(id: string): Section | undefined {\n  return sections.find((s) => s.id === id);\n}\n\n`;
  ts += `export function getSectionsByCategory(category: string): Section[] {\n  return sections.filter((s) => s.category === category);\n}\n\n`;
  ts += `export function getResourceById(resourceId: string): { resource: ResourceItem; section: Section } | undefined {\n`;
  ts += `  for (const section of sections) {\n`;
  ts += `    const resource = section.resources.find((r) => r.id === resourceId);\n`;
  ts += `    if (resource) return { resource, section };\n`;
  ts += `  }\n`;
  ts += `  return undefined;\n`;
  ts += `}\n`;

  await writeFile(join("/tmp/pixel-perfect-implementation/src/data/sections.ts"), ts, "utf-8");
  console.log(`Generated sections.ts with ${allSections.length} sections and ${totalResources} total resources`);
  for (const s of allSections) {
    console.log(`  ${s.title}: ${s.resourceCount} resources`);
  }
}

main().catch(console.error);
