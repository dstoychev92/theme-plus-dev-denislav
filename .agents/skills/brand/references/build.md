# Build on brand

Use the brand folder to make something new: a section, a page, a block of copy, or a mockup in the
sandbox. Then check it against the brand.

## Read first

1. `brand/readme.md`, `brand/delight.md`, `brand/facts.md`, then `brand/visual/signature.md`.
2. The visual files the work touches: `type.md` for anything with text, `color.md` for any new
   surface, `layout.md` for a page, `components.md` for controls.
3. `brand/verbal/voice.md` and `words.md` for any copy.
4. For theme code, the theme's `AGENTS.md` and `DESIGN.md`. They decide how the code is built; the
   brand decides how it looks and speaks.

Do not paste the brand into a prompt or summarize it for another agent. Point the agent at the
files: they are the brief.

## Say what the surface is doing before building it

A page built from a topic alone comes out generic in brand colors. Before building, settle:

- the job of the page and the one thing a visitor should do;
- the sequence of sections, one idea each, and which ones are pauses with little on them;
- which scheme each section sits on, so the page has the brand's rhythm of light and dark;
- where the signature appears, and where it does not;
- which delights the page carries, from `brand/delight.md`. A browse page, such as the homepage or a
  product page, usually carries one. A task page, such as the cart or search, carries one only when
  it helps the task. See the table in [delight.md](delight.md).

Then build a section at a time.

## Where to build

- **Theme sections and templates.** Use the theme's sections, blocks, and snippets. Values come
  from settings, never from inline styles.
- **Mockups and concepts.** Add a block to `brand/sandbox/index.html`, or a new page beside it that
  copies its `<head>`, so the work renders with the brand's real values and classes. Use only
  classes `theme.css` has, and copy component markup from the brand page's Code panels.
- **Copy.** Write it in the voice. Quote approved lines exactly.

## Fix the class of error

When something is off, point at the rule, not the pixel. "The headline should be `type-h2`, per
the level rule in `type.md`" fixes every headline. "Make the headline smaller" fixes one.

## Check

Walk `brand/visual/checklist.md` against the result, on desktop and phone. When the brand has no
checklist yet, ask these:

1. Does each section use a scheme class and token classes, with no raw colors?
2. Is there exactly one `type-h1`, and does every text element use a preset?
3. Is every space a step of the scale or a layout utility?
4. Do corners come from the role radii?
5. Does the signature appear where the brand says, and nowhere else?
6. Does each delight the page should carry appear, pass its own check, and stay out of the task's way?
7. Does the copy follow `voice.md`, using only facts in `brand/facts.md`?

Report each miss with the rule it breaks and the fix.
