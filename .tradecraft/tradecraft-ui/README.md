# Tradecraft UI

A collection of useful Alpine Plugins and other utilities for Shopify themes and other projects

[![ci](https://github.com/groupthought/tradecraft-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/groupthought/tradecraft-ui/actions/workflows/ci.yml)

## Integrating Tradecraft UI into a New Project

1. **.npmrc Configuration**

Set up your `.npmrc` file with:

```
@groupthought:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

> [!IMPORTANT]
> The `.npmrc` file should be gitignored to avoid checking tokens into the repo.

2. **Generating a GitHub Packages Token**

   - Visit [GitHub Tokens Page](https://github.com/settings/tokens/new).
   - Enter a name (e.g., `Read Private Packages`).
   - Set an expiration (90 days recommended).
   - Select scopes (`read:packages`, `write:packages`).
   - Replace `YOUR_TOKEN` in `.npmrc` with the generated token.

3. **Add permissions for new project**

   - Go to [tradecraft-ui package settings page](https://github.com/orgs/groupthought/packages/npm/tradecraft-ui/settings)
   - Click "Add Repository" under "Manage Actions access" heading
   - Add the repo you're adding tradecraft-ui to

4. **Adding Tradecraft UI to new project**

   - Add to `package.json`:
     ```sh
     pnpm add @groupthought/tradecraft-ui
     ```
   - Import required Alpine plugin(s):

     ```javascript
     import Alpine from 'alpinejs';
     import {rovingTab} from '@groupthought/tradecraft-ui/alpine';

     // Your existing Alpine setup...

     Alpine.plugin(rovingTab);

     // Continue with your Alpine setup...
     ```

     3. **Adding the Tailwind plugins**

   - The Tailwind plugins ship in the same package, so there is nothing else to add.
   - Import required Tailwind plugin(s) in tailwind.config.js:

     ```js
     import {animationsPlugin} from '@groupthought/tradecraft-ui/tailwind';

     export const plugins = [animationsPlugin];
     ```

## Local Development with Tradecraft UI

It's often helpful when building new plugins, modifying existing ones, or debugging to work on tradecraft-ui within the context of a theme. To do so, and to have your local changes to tradecraft-ui immediately reflected in your theme

1. **Setting Up**

   - Clone tradecraft-ui
   - Install [Yalc](https://github.com/wclr/yalc) (if not installed):
     Either run
     `pnpm add -g yalc`
   - In the tradecraft-ui repo:
     ```sh
     pnpm sync:watch
     ```
   - In your theme:
     ```sh
     yalc add @groupthought/tradecraft-ui
     pnpm start
     ```

2. **Development Process**

   - Make changes in Tradecraft UI.
   - Changes automatically propagate to your theme.

3. **When you're done**
   - Run `pnpm add @groupthought/tradecraft-ui` to revert to the github package. This will:
     - remove `"file:.yalc/..."` in your package.json
     - remove the symlink from your theme
     - force the package to refresh with the implicit `pnpm install` that runs with `pnpm add`

## Notes on Yalc

There's two main yalc commands, `yalc link` and `yalc add`. Both add symlinks from your theme node_modules folder to the mysterious yalc store deep in the bowels of your root user folder — `.yalc/packages/@groupthought/tradecraft-ui/[version]/dist`.

If you use yalc link it's easy to forget whether you are using the version in the local `yalc` store or the `github` published version.

This is the main reason why we use `yalc add` -- it's more explicit and obvious which version you are running.

It also seems to work better in practice. In theory `yalc link` should work perfectly but in practice we have seen cases where the yalc symlinks seem to get out of date. They are tied to a version in the yalc store and sometimes the version changes in package.json between bouts of working on the build process. My current theory is that this happens when there is no matching version in the yalc store.

Using `yalc add` fixes this by making the change explicit in the package json and forcing an update.

## Running Tests

- Run the Playwright component tests (`src/**/*.component.spec.ts`) with: `pnpm test:component`
- Run the Vitest unit tests (`*.unit.spec.ts`, in `src/` and `scripts/`) with: `pnpm test:unit`

## Publishing a new version

To publish a new version of tradecraft-ui:

1. Ensure tests are passing for the `main` branch on GitHub
1. Checkout `main` locally and pull down the latest changes
1. Run `pnpm publish`. This will compile TS in src/ to JS in dist/ then push to GitHub Packages and tag a new version.
1. Push your `main` branch up to GitHub so it's up to date
