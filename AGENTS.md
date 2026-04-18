# AGENTS.md

## Figma (RTL Source)

- Figma is RTL-only. NEVER treat it as LTR.
- Arabic = exact match to Figma.
- English = full RTL → LTR translation (NOT a copy).

## RTL → LTR Rule (Critical)

- For English (`dir="ltr"`), EVERY section must be mirrored:
  - element order
  - alignment
  - spacing (start/end)
  - icon positions
  - actions/buttons placement
- If English looks like RTL with English text → WRONG.

## Direction

- Direction comes ONLY from `<html dir="...">`.
- NO custom direction logic.
- Use ONLY logical utilities:
  - `start/end`, `ps/pe`, `text-start/end`
- NEVER use:
  - `left/right`, `ml/mr`, `pl/pr`, `flex-row-reverse`

## DOM Structure

- DOM order MUST match reading direction:
  - LTR → left to right flow
  - RTL → right to left flow
- NO CSS hacks to fake direction.
- Fix structure, not styling.

## Styling

- Use ONLY tokens from `tokens.css`.
- NO hardcoded values (color, spacing, font, radius).
- Missing token → STOP and flag.

## HTML (Strict)

- Use semantic elements (`button`, `a`, etc.).
- NO span-inside-span layouts.
- NO icon stacking hacks.
- Icons = separate elements, aligned with flex/grid.

## Components

- Reuse existing components FIRST.
- One component = one responsibility.
- No duplication.

## Assets

- Export from Figma only.
- SVG = `currentColor`.
- Must support light/dark.

## UX

- Must be clear instantly.
- Always handle:
  - loading
  - empty
  - error

## Accessibility

- Buttons, inputs, labels required.
- Icon-only → aria-label.
- Keep focus visible.

## Hard Fail Rules

- Copying RTL layout directly into LTR → FAIL
- Using left/right instead of logical props → FAIL
- Using CSS to fake direction → FAIL
- Hardcoded styles instead of tokens → FAIL
- Messy HTML structure → FAIL

## Agent Behavior

- Interpret → THEN implement (never copy).
- Arabic follows Figma.
- English mirrors Figma logically.
- Clean structure > visual hacks.
