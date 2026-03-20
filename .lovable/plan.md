
# NDG Neuroinclusion Resource Hub — Build Plan

## What We're Building
A branded, accessible resource hub for Neurodiversity Global where client teams can browse, search, and use 158 neuroinclusion resources across 14 sections. Based on the PRD and HTML prototype provided.

---

## Phase 1: Core Layout & Navigation
- **Sidebar navigation** with the 14 content sections grouped into categories (Toolkits, Quick Reference, Learning, Scenarios, Support, Media) using the Shadcn Sidebar component
- **Dark sidebar** matching the prototype's design (dark navy `#0F172A`)
- **Sidebar search** input for filtering sections
- **Collapsible sidebar** on mobile with hamburger trigger
- **NDG branding** in sidebar header ("NDG Neuroinclusion Resource Hub")

## Phase 2: Dashboard / Homepage
- **Welcome message** with organisation name placeholder
- **Section overview grid** showing 14 cards with icons, descriptions, and resource counts
- **Global search bar** in the main header area
- **Stats row** showing total resources (158), sections (14), and content types
- **"Start Here" callout** pointing to the Foundation learning pathway

## Phase 3: Content Display System
- **Section pages** — clicking a section card shows a list of resources in that section
- **Resource accordion/expandable view** — each resource expands to show its full content
- **Markdown rendering** — parse and display .md files as styled HTML preserving heading hierarchy (H1–H3)
- **Back navigation** and breadcrumbs showing current position
- **NDG-branded content styling** — clean layout, 16px+ body text, generous whitespace, high contrast

## Phase 4: Search
- **Full-text search** across all resource titles and body content using client-side search (Fuse.js)
- **Search results page** with highlighted matches
- **Search from both sidebar and main header**

## Phase 5: Accessibility & Neuroinclusive UX
- **WCAG 2.1 AA compliance** — keyboard navigation, screen reader support, colour contrast (4.5:1+), semantic HTML
- **Dark mode toggle**
- **Visible focus indicators**
- **Breadcrumbs** for navigation context
- **No autoplay, no flashing, no infinite scroll**
- **Responsive design** — desktop, tablet, and mobile

## Phase 6: Admin Panel & Analytics
- **Admin dashboard** — view all sections and resources, manage content
- **Usage analytics view** — page views, popular resources, search queries (stored locally for now, Supabase later)
- **Bookmarking** — users can save favourite resources
- **PDF export** — download individual resources as formatted PDFs

---

## Design Approach
- Colours: Dark navy sidebar (`#0F172A`), white cards, blue accent (`#1D4ED8`), slate text
- Typography: System font stack, 16px+ body, generous spacing
- Layout: Left sidebar + main content area matching the HTML prototype
- Neuroinclusive: Minimal cognitive load, predictable navigation, clear headings

## Content
- You'll upload the 158 .md files after the structure is built
- Content will be organised in 14 sections matching the PRD inventory
- Sample/placeholder content will be used initially to build and test the UI

## Auth (Later)
- Authentication will be added in a future phase
- The structure will be designed to easily accommodate per-organisation access
