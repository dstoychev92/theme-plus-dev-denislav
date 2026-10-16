// Finds the project, theme, store settings, and brand folder the brand scripts work on.
//
//   --root <dir>       the project root, defaults to the current directory
//   --theme <dir>      the theme, defaults to the theme tradecraft.json names, or the only themes/* folder
//   --env <name>       the environment whose settings_data.json to read, defaults to the only one,
//                      then production, then the theme's own src/config/settings_data.json
//   --settings <file>  a settings_data.json to read instead
//   --store <domain>   the store the page names, defaults to the environment's store in shopify.theme.toml
//   --shop-name <name> the shop name the page shows, defaults to the store's handle in title case

import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

export function option(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

export function resolveProject(args = process.argv.slice(2)) {
  const root = path.resolve(option(args, '--root') ?? process.cwd());

  let themeDir = option(args, '--theme');
  const tradecraftFile = path.join(root, 'tradecraft.json');
  const tradecraft = fs.existsSync(tradecraftFile) ? JSON.parse(fs.readFileSync(tradecraftFile, 'utf8')) : {};
  if (!themeDir) themeDir = tradecraft.packages?.[tradecraft.theme]?.path;
  if (!themeDir) {
    const themes = fs.existsSync(path.join(root, 'themes')) ? fs.readdirSync(path.join(root, 'themes')) : [];
    if (themes.length === 1) themeDir = path.join('themes', themes[0]);
  }
  if (!themeDir) throw new Error('Cannot tell which theme to use. Pass --theme <dir>.');
  const themeRoot = path.resolve(root, themeDir);
  const distRoot = path.join(themeRoot, 'dist');

  // A project with "store" in tradecraft.json keeps the store's settings in that folder, and the toml at its root
  const storeFolder = tradecraft.store ? path.join(root, tradecraft.store) : null;
  const tomlFile = ['shopify.theme.toml', 'shopify.theme.toml.example']
    .map((name) => path.join(storeFolder ? root : themeRoot, name))
    .find((file) => fs.existsSync(file));
  const environments = path.join(themeRoot, 'environments');
  const names = storeFolder
    ? environmentsInToml(tomlFile)
    : fs.existsSync(environments)
      ? fs.readdirSync(environments).filter((name) => fs.existsSync(path.join(environments, name, 'config/settings_data.json')))
      : [];
  const env = option(args, '--env') ?? (names.length === 1 ? names[0] : names.includes('production') ? 'production' : undefined);

  let dataFile = option(args, '--settings');
  // Where an export writes: the store's settings, never the theme's own preset
  let writeFile = dataFile ? path.resolve(dataFile) : null;
  if (dataFile) {
    dataFile = path.resolve(dataFile);
  } else if (storeFolder) {
    writeFile = path.join(storeFolder, 'config/settings_data.json');
    dataFile = fs.existsSync(writeFile) ? writeFile : path.join(themeRoot, 'src/config/settings_data.json');
  } else {
    dataFile = env
      ? path.join(environments, env, 'config/settings_data.json')
      : path.join(themeRoot, 'src/config/settings_data.json');
    writeFile = dataFile;
  }

  let store = option(args, '--store') ?? (env && storeFromToml(tomlFile, env));
  if (store && !store.includes('.')) store = `${store}.myshopify.com`;
  const handle = store?.split('.')[0];
  const shopName =
    option(args, '--shop-name') ??
    (handle ? handle.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Store');

  const brandRoot = path.join(root, 'brand');
  return {
    root,
    themeRoot,
    distRoot,
    env,
    dataFile,
    writeFile,
    store,
    shopName,
    brandRoot,
    sandbox: path.join(brandRoot, 'sandbox'),
    visual: path.join(brandRoot, 'visual'),
    // The theme's own dependencies: liquidjs and jsonc-parser come with every Tradecraft theme
    require: createRequire(path.join(themeRoot, 'package.json')),
  };
}

// The environment names in a shopify.theme.toml
function environmentsInToml(file) {
  if (!file) return [];
  return [...fs.readFileSync(file, 'utf8').matchAll(/^\s*\[environments\.([^\]]+)\]/gm)].map((match) => match[1].trim());
}

// The store an environment names in the Shopify CLI's shopify.theme.toml
function storeFromToml(file, env) {
  if (!file || !fs.existsSync(file)) return undefined;
  let inSection = false;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const header = /^\s*\[(.+)\]\s*$/.exec(line);
    if (header) {
      inSection = header[1].trim() === `environments.${env}`;
      continue;
    }
    const store = inSection && /^\s*store\s*=\s*["']([^"']+)["']/.exec(line);
    if (store) return store[1];
  }
  return undefined;
}
