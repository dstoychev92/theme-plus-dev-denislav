# Tradecraft Build

The build tooling behind Groupthought's Shopify themes. It bundles the theme's JavaScript with
Rolldown, compiles the Liquid and the CSS, copies the icons and the settings files, and drives the
Shopify CLI.

The package installs one command, `tradecraft-build`, with three subcommands:

- `tradecraft-build build` — compile the theme into `dist`
- `tradecraft-build watch` — compile, rebuild on every save, and run `shopify theme dev`
- `tradecraft-build pull` — run `shopify theme pull`, then write the store's JSON into its settings folder

A store's settings folder goes on top of the theme in each build: `-s <name>` for
`environments/<name>/`, or `--settings-path <folder>` for a folder anywhere, such as a
Tradecraft project's `../store`. `shopify.theme.toml` can sit in the theme folder or above it;
the engine and Shopify CLI look up from the theme.

`deploy`, `zip`, `-l`/`--listing`, and `--index=false` are Groupthought release tools in
`packages/method-tools/build/internal.mjs`. Inside this monorepo, `tradecraft-build` hands them
to method-tools, so the themes' scripts work as before. Outside it, the engine names
`tradecraft preview` and `tradecraft ship` instead.

One process owns a theme at a time. A second command exits with code 3 and names
the owner. Keep editing source and let the watcher rebuild. Read
`.tradecraft-build/build.log` for timestamped `START`, `OK`, and `ERROR` entries with
the builder's PID. Wait for an `OK` from a build started after your edit; if another
edit lands during that build, wait for the following build. Shopify upload results
remain in the watcher's terminal or preview log.

Ownership lives in `.tradecraft-build/owner/`. The build publishes a populated lock
directory atomically. It reclaims only a dead process's unique owner file, so stale
cleanup cannot delete a replacement owner. A watcher holds ownership until exit;
the next command reclaims it after an ordinary exit or a crash. On macOS and Linux,
the tool also checks for existing build and Shopify development processes in the
same theme directory, including watchers started before locking was added. Those
older watchers keep their existing terminal output; they do not gain logging until
restarted normally.

Each build uses its own staging folder and refuses output without a Liquid layout
before syncing to `dist/`. This prevents staging cleanup from erasing another
build's input. The owner lock also prevents competing settings from reaching `dist/`.

Inside this monorepo, use the theme's pnpm scripts (`pnpm pipeline build`,
`pnpm analog start`, or `pnpm run build` from a theme directory). These enter
Turbo so shared packages build first. The commands above are the underlying
compiler interface and assume dependencies are already built.

Run `tradecraft-build help` for the full list of options.

## Optional compilation on any theme

Set `"tradecraft": {"build": "copy"}` in the theme package to preserve its vendor files.
Add a `postcss.config.js`, `.cjs`, or `.mjs` file to compile `src/css/theme.css` into
`assets/theme.css`. Add a Rollup configuration in one of the same formats when
JavaScript needs compilation. Each compiler is optional. Compiled assets replace
their copied counterpart after the vendor files are copied. Existing Liquid and JSON
stay byte for byte in copy mode.

Tailwind v4 uses its own PostCSS plugin. Install `tailwindcss@4`,
`@tailwindcss/postcss@4`, and `postcss` in the theme package and keep the lockfile.
Use a theme-local config, for example:

```js
// postcss.config.mjs
import tailwindcss from '@tailwindcss/postcss';
import {fileURLToPath} from 'node:url';
export default {plugins: [tailwindcss({base: fileURLToPath(new URL('.', import.meta.url))})]};
```

Import `tailwindcss` in `src/css/theme.css` and declare the theme's source files with
Tailwind's `@source` directives. Existing themes can keep their v3 PostCSS config.
The build does not select or upgrade a theme's Tailwind version. See the
[Tailwind PostCSS instructions](https://tailwindcss.com/docs/installation/using-postcss).

Agency projects upload with the Tradecraft CLI: `tradecraft preview`, `tradecraft ship`, and
`tradecraft launch`.

## Pulling a Store's Settings

```sh
tradecraft-build pull -e <environment> [-s <settings folder>] [shopify theme pull flags]
```

`pull` downloads the theme editor JSON of the store that the `shopify.theme.toml`
environment names. It writes the files into `environments/<settings folder>/`. The
folder name defaults to the environment name. The command reads `-e` and `-s` only.
It passes every other flag to `shopify theme pull`, for example `--theme=<id>` or
`--live`.

The command pulls `config/settings_data.json`, `sections/*.json`, `templates/*.json`,
and `templates/customers/*.json` into a temporary folder under `.tradecraft-build/`.
The Shopify CLI also returns templates one folder down, such as
`templates/metaobject/*.json`, so the command keeps those too. It passes
`--ignore=false`, because a command-line `--ignore` replaces the environment's
`ignore` list, and those lists often skip exactly these files.

Then the command changes each pulled file:

- It removes the comment banner that Shopify puts at the top of the file.
- In `settings_data.json`, it removes `presets`. When `current` is a preset name, the
  presets hold the store's values, so the command keeps them.
- In every other file, it removes each empty `"settings": {}`.
- It drops a file whose values match the same file in `src/`, after the same
  cleanup of the `src/` file. It always keeps `settings_data.json`.
- It formats each file with the theme's own Prettier and Prettier config.

The repository is the only record of the store, so the pulled files replace the old
ones. The command deletes a settings file that the store no longer has, or that now
matches `src/`. It does not change other files in the folder, such as a
`method-listing/` folder. The command writes nothing and exits with a non-zero code
when the Shopify CLI fails, when the pull returns no settings files, or when a
pulled file is not valid JSON.

A pull writes only into `environments/`, so it does not take the build lock. A
running watcher rebuilds from the new files the same as from a source edit.

## Integrating Tradecraft Build into a New Project

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

3. **Add permissions for new repo**

   - Go to [tradecraft-build package settings page](https://github.com/orgs/groupthought/packages/npm/tradecraft-build/settings)
   - Click "Add Repository" under "Manage Actions access" heading
   - Add the repo you're adding tradecraft-build to

4. **Adding Tradecraft Build**

   - Add to `package.json`:
     ```
     pnpm add @groupthought/tradecraft-build
     ```
   - TODO describe rest of steps for usage

## Local Development with Tradecraft Build

1. **Setting Up**
   - Install Yalc (if not installed):
     ```
     pnpm add -g yalc
     ```
   - In the tradecraft-build repo:
     ```
     pnpm sync:watch
     ```
   - In your theme:
     ```
     yalc add --dev @groupthought/tradecraft-build
     pnpm start
     ```

2. **Development Process**
   - Make changes in tradecraft-build.
   - Changes automatically propagate to your theme.

3. **When you're done**
   - Run `pnpm add -D @groupthought/tradecraft-build` to revert to the github package. This will:
     - remove `"file:.yalc/..."` in your package.json
     - remove the symlink from your theme
     - force the package to refresh with the implicit `pnpm install` that runs with `pnpm add`

## Building a Listing Variant for Store Testing

This is a Groupthought release tool, in method-tools. It works only inside this monorepo.

Themes can carry listing-specific variants under `src/listings/<name>/{templates,sections,config}/` (e.g. `analog`, `anthem`). Pass `-l` / `--listing=<name>` to overlay that listing's JSON files onto `dist/` so its `templates/`, `sections/`, and `config/settings_data.json` **replace** the matching defaults. Useful for visually testing a listing in a real Shopify store before submitting it to the Theme Store.

```sh
# Build dist with the analog listing's files overlaying defaults
tradecraft-build build --listing=analog

# Push that dist to a dev store for visual testing
shopify theme push --path=dist --environment=<your-dev-store>
```

For a live development loop against a store:

```sh
tradecraft-build watch --listing=analog --env=<your-dev-store>
```

Notes:
- method-tools turns `--listing=<name>` into the engine's `--settings-path=src/listings/<name>`, so `--listing` replaces `--settings`.
- Don't combine `--listing` with `tradecraft-build zip`. `zip` is for Theme Store submission and preserves the `dist/listings/<name>/...` layout that Shopify expects.
- `tradecraft-build deploy` is intentionally not part of this flow; deploy is for live demos not listings.

## Notes on Yalc

   There's two main yalc commands, `yalc link` and `yalc add`. Both add symlinks from your theme node_modules folder to the mysterious yalc store deep in the bowels of your root user folder — `.yalc/packages/@groupthought/tradecraft-build/[version]/dist`.

   If you use yalc link it's easy to forget whether you are using the version in the local `yalc` store or the `github` published version.

   This is the main reason why we use `yalc add` -- it's more explicit and obvious which version you are running.

   It also seems to work better in practice. In theory `yalc link` should work perfectly but in practice we have seen cases where the yalc symlinks seem to get out of date. They are tied to a version in the yalc store and sometimes the version changes in package.json between bouts of working on the build process.  My current theory is that this happens when there is no matching version in the yalc store.

   Using `yalc add` fixes this by making the change explicit in the package json and forcing an update.

## Running Tests

- Run the tests with: `pnpm test`. It builds the package first, then runs the engine tests
  (`src/engine/*.test.mjs`) with Node's own test runner.

## Publishing a new version

To publish a new version of tradecraft-build:

1. Checkout `main` locally and pull down the latest changes
1. Run `pnpm publish`. This will compile TS in src/ to JS in dist/ then push to GitHub Packages and tag a new version.
1. Push your `main` branch up to GitHub so it's up to date
