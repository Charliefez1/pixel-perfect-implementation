

# Targeted Language Fixes — Nuanced "Manager" Review

## Context
You're right — "manager" is sometimes correct when referring to someone's actual line manager. Here's each remaining instance categorised:

### Keep as "Manager" (refers to someone's actual manager)
- None of the remaining instances clearly need to stay. They're all in programme materials where "people leader" is the standard term.

### Change to "People Leader" (programme terminology)
1. **Line 920** — Alignment Plans signature block: `Manager: ___ Date: ___` → `People Leader: ___ Date: ___` (the rest of the document already says "people leader" throughout)
2. **Line 926** — Intake and Referrals: `Manager and/or HR to implement` → `People Leader and/or HR to implement`
3. **Lines 1133-1136** — Audio script ID, title, and H1: "Manager Disclosure Conversation Walkthrough" → "People Leader Disclosure Conversation Walkthrough"

### Other Fixes
4. **Line 926** — Grammar: `a advocate` → `an advocate`
5. **SectionPage.tsx line 17** — Tier 2 description: `"champions and advocates"` → `"advocates"` (remove "champions")
6. **SectionPage.tsx line 16** — Tier 1 description: The NDG tagline is used as the description; replace with `"Foundations of neurodiversity awareness for all employees"`

## Files Changed
- `src/data/sections.ts` — 4 targeted replacements (lines 920, 926, 1133-1136)
- `src/pages/SectionPage.tsx` — tier description fixes (lines 16-17)

