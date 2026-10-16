# theme-plus-dev-denislav

analog 1.1.0-beta.3 for theme-plus-dev-denislav.myshopify.com, kept with [Tradecraft](https://www.npmjs.com/package/tradecraft-cli).

Code lives in Git. Content lives in the store. Tradecraft moves changes between them and shows the plan before it changes the store.

```bash
pnpm install
tradecraft dev        # your own development theme, with live reload
tradecraft preview    # a preview theme for this branch, with a link to share
tradecraft sync       # bring the client's Admin edits into Git
tradecraft ship       # plan, confirm, then update the live theme
tradecraft status     # every theme and what changed where
```

## Where things are

- `theme/src/` is the theme's code. Edit it freely.
- `store/` is the store's content: the theme editor's settings and templates. `tradecraft sync` writes it, and the build puts it on top of the theme.
- `shopify.theme.toml` names the store and can hold a Theme Access password, so Git ignores it. `shopify.theme.toml.example` shows its shape.
- The `tradecraft/live` branch records every state of the live theme Tradecraft saw. Push it with your other branches, so the team shares it.
- `.tradecraft/` holds the packages the theme uses. `tradecraft merge` replaces them. `tradecraft eject <package>` makes one editable.
- `.agents/skills/` holds the skills Codex and Claude Code use, starting with tradecraft, which asks what the project needs and runs the others. `.claude/skills/` links to them.
