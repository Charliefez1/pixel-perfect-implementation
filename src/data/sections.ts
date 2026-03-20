import {
  Briefcase,
  Users,
  UserPlus,
  MessageSquare,
  Settings,
  FileText,
  CheckSquare,
  GraduationCap,
  BookOpen,
  Drama,
  Heart,
  Shield,
  BookMarked,
  Play,
  type LucideIcon,
} from "lucide-react";

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  content?: string;
}

export interface Section {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  category: string;
  resourceCount: number;
  resources: ResourceItem[];
  color: string;
}

export const categories = [
  "Toolkits",
  "Quick Reference",
  "Learning",
  "Scenarios",
  "Support",
  "Media",
] as const;

export const sections: Section[] = [
  {
    id: "neuroinclusion-strategy",
    title: "Neuroinclusion Strategy Toolkit",
    shortTitle: "Strategy",
    description: "Organisation-wide frameworks for building neuroinclusive workplaces, including policy templates and implementation guides.",
    icon: Briefcase,
    category: "Toolkits",
    color: "hsl(221, 83%, 53%)",
    resourceCount: 14,
    resources: Array.from({ length: 14 }, (_, i) => ({
      id: `ns-${i + 1}`,
      title: `Strategy Resource ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "managers-quick-start",
    title: "Manager's Quick-Start Toolkit",
    shortTitle: "Managers",
    description: "Practical, action-oriented guides to help managers support neurodivergent team members from day one.",
    icon: Users,
    category: "Toolkits",
    color: "hsl(173, 58%, 39%)",
    resourceCount: 12,
    resources: Array.from({ length: 12 }, (_, i) => ({
      id: `mq-${i + 1}`,
      title: `Manager Resource ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "hiring-onboarding",
    title: "Hiring & Onboarding Toolkit",
    shortTitle: "Hiring",
    description: "Inclusive recruitment and onboarding processes that remove barriers and attract neurodivergent talent.",
    icon: UserPlus,
    category: "Toolkits",
    color: "hsl(38, 92%, 50%)",
    resourceCount: 10,
    resources: Array.from({ length: 10 }, (_, i) => ({
      id: `ho-${i + 1}`,
      title: `Hiring Resource ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "meeting-communication",
    title: "Meeting & Communication Toolkit",
    shortTitle: "Meetings",
    description: "Templates and guides for running neuroinclusive meetings, presentations, and team communication.",
    icon: MessageSquare,
    category: "Toolkits",
    color: "hsl(262, 52%, 47%)",
    resourceCount: 11,
    resources: Array.from({ length: 11 }, (_, i) => ({
      id: `mc-${i + 1}`,
      title: `Meeting Resource ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "workplace-adjustments",
    title: "Workplace Adjustments Toolkit",
    shortTitle: "Adjustments",
    description: "Comprehensive guides for implementing reasonable adjustments and creating supportive work environments.",
    icon: Settings,
    category: "Toolkits",
    color: "hsl(347, 77%, 50%)",
    resourceCount: 13,
    resources: Array.from({ length: 13 }, (_, i) => ({
      id: `wa-${i + 1}`,
      title: `Adjustments Resource ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "quick-reference-guides",
    title: "Quick Reference Guides",
    shortTitle: "Guides",
    description: "One-page reference cards and cheat sheets for immediate, practical guidance on neuroinclusion topics.",
    icon: FileText,
    category: "Quick Reference",
    color: "hsl(221, 83%, 53%)",
    resourceCount: 15,
    resources: Array.from({ length: 15 }, (_, i) => ({
      id: `qr-${i + 1}`,
      title: `Quick Reference ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "checklists-action-plans",
    title: "Checklists & Action Plans",
    shortTitle: "Checklists",
    description: "Step-by-step checklists and action plans for implementing neuroinclusion initiatives.",
    icon: CheckSquare,
    category: "Quick Reference",
    color: "hsl(173, 58%, 39%)",
    resourceCount: 10,
    resources: Array.from({ length: 10 }, (_, i) => ({
      id: `ca-${i + 1}`,
      title: `Checklist ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "foundation-learning",
    title: "Foundation Learning Pathway",
    shortTitle: "Foundations",
    description: "Core learning modules covering the fundamentals of neurodiversity and neuroinclusion in the workplace.",
    icon: GraduationCap,
    category: "Learning",
    color: "hsl(38, 92%, 50%)",
    resourceCount: 8,
    resources: Array.from({ length: 8 }, (_, i) => ({
      id: `fl-${i + 1}`,
      title: `Foundation Module ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "deep-dive-modules",
    title: "Deep-Dive Learning Modules",
    shortTitle: "Deep Dives",
    description: "In-depth modules exploring specific aspects of neurodivergence, research, and workplace strategies.",
    icon: BookOpen,
    category: "Learning",
    color: "hsl(262, 52%, 47%)",
    resourceCount: 12,
    resources: Array.from({ length: 12 }, (_, i) => ({
      id: `dd-${i + 1}`,
      title: `Deep Dive Module ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "scenario-based-learning",
    title: "Scenario-Based Learning",
    shortTitle: "Scenarios",
    description: "Real-world workplace scenarios with guided reflection questions and suggested approaches.",
    icon: Drama,
    category: "Scenarios",
    color: "hsl(347, 77%, 50%)",
    resourceCount: 14,
    resources: Array.from({ length: 14 }, (_, i) => ({
      id: `sb-${i + 1}`,
      title: `Scenario ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "self-advocacy",
    title: "Self-Advocacy Resources",
    shortTitle: "Self-Advocacy",
    description: "Tools and guides to help neurodivergent individuals advocate for their needs and thrive at work.",
    icon: Heart,
    category: "Support",
    color: "hsl(221, 83%, 53%)",
    resourceCount: 10,
    resources: Array.from({ length: 10 }, (_, i) => ({
      id: `sa-${i + 1}`,
      title: `Self-Advocacy Resource ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "wellbeing-support",
    title: "Wellbeing & Support",
    shortTitle: "Wellbeing",
    description: "Mental health, wellbeing strategies, and support resources for neurodivergent employees.",
    icon: Shield,
    category: "Support",
    color: "hsl(173, 58%, 39%)",
    resourceCount: 9,
    resources: Array.from({ length: 9 }, (_, i) => ({
      id: `ws-${i + 1}`,
      title: `Wellbeing Resource ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "glossary-key-terms",
    title: "Glossary & Key Terms",
    shortTitle: "Glossary",
    description: "Definitions and explanations of neurodiversity terminology and key concepts.",
    icon: BookMarked,
    category: "Media",
    color: "hsl(38, 92%, 50%)",
    resourceCount: 6,
    resources: Array.from({ length: 6 }, (_, i) => ({
      id: `gk-${i + 1}`,
      title: `Glossary Entry ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
  {
    id: "multimedia-visual-guides",
    title: "Multimedia & Visual Guides",
    shortTitle: "Multimedia",
    description: "Infographics, video guides, and visual resources for diverse learning preferences.",
    icon: Play,
    category: "Media",
    color: "hsl(262, 52%, 47%)",
    resourceCount: 14,
    resources: Array.from({ length: 14 }, (_, i) => ({
      id: `mv-${i + 1}`,
      title: `Multimedia Resource ${i + 1}`,
      description: "Placeholder resource — upload .md files to populate.",
    })),
  },
];

export const totalResources = sections.reduce((sum, s) => sum + s.resourceCount, 0);

export function getSectionById(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

export function getSectionsByCategory(category: string): Section[] {
  return sections.filter((s) => s.category === category);
}
