#!/usr/bin/env node
/**
 * Read and write the engagement state: .tradecraft/engagement.json in a project, or
 * <handle>.engagement.json in the working folder before the project exists.
 *
 *   state.mjs show
 *   state.mjs next
 *   state.mjs decide <ID> <value> --by developer|client|default|agent [--evidence "…"]
 *   state.mjs guess <ID> <value> --evidence "…"   a best guess the client sees at review
 *   state.mjs review                     the guesses for the review page
 *   state.mjs undo <ID> --why "…"        clear a decision that was recorded wrongly
 *   state.mjs command "<command>"        prints a command for the developer that works from any folder
 *   state.mjs ask <ID> --to developer|client --text "…"
 *   state.mjs stage <stage>
 *   state.mjs facts <file.json>        merges a JSON object into facts
 *   state.mjs plan --file PLAN.md [--approved]
 *   state.mjs init --store <domain>    before the project exists
 *   state.mjs path
 */
import {existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, renameSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {check} from './ste-check.mjs';

export const STAGES = ['engage', 'setup', 'discover', 'plan', 'brand', 'build', 'review', 'launch', 'care', 'retain'];
// A state file from before the plan replaced intake
const OLD_STAGES = {intake: 'plan'};
const here = path.dirname(fileURLToPath(import.meta.url));

/** The decision table, read from references/decisions.md so the two never disagree */
export function decisionTable() {
  const text = readFileSync(path.join(here, '..', 'references', 'decisions.md'), 'utf8');
  const rows = [];
  let header = null;
  for (const line of text.split('\n')) {
    if (!line.startsWith('|')) {
      header = null;
      continue;
    }
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells[0] === 'ID') {
      header = cells;
      continue;
    }
    if (!header || /^-+$/.test(cells[0]) || !/^[A-Z]\d+$/.test(cells[0])) continue;
    const row = Object.fromEntries(header.map((name, index) => [name.toLowerCase(), cells[index]]));
    rows.push({id: row.id, decision: row.decision ?? row.fact, how: row.how ?? 'find', ask: row.ask ?? '–', default: row.default ?? row.where, by: row.by ?? 'discover'});
  }
  return rows;
}

function findProject(start) {
  for (let folder = path.resolve(start); ; folder = path.dirname(folder)) {
    if (existsSync(path.join(folder, 'tradecraft.json'))) return folder;
    if (path.dirname(folder) === folder) return null;
  }
}

function handleOf(store) {
  return store.replace(/^https?:\/\//, '').replace(/\.myshopify\.com.*$/, '').replace(/[^a-z0-9-]/gi, '');
}

/** The state file for this folder. A file made before the project moves into it once the project exists. */
export function statePath(cwd = process.cwd()) {
  const project = findProject(cwd);
  if (project) {
    const file = path.join(project, '.tradecraft', 'engagement.json');
    if (!existsSync(file)) {
      for (const folder of [path.dirname(project), project]) {
        const early = readdirSync(folder).find((name) => name.endsWith('.engagement.json'));
        if (!early) continue;
        const state = JSON.parse(readFileSync(path.join(folder, early), 'utf8'));
        const manifestStore = (() => {
          try {
            return readFileSync(path.join(project, 'shopify.theme.toml.example'), 'utf8');
          } catch {
            return '';
          }
        })();
        if (!manifestStore || manifestStore.includes(state.store)) {
          mkdirSync(path.dirname(file), {recursive: true});
          renameSync(path.join(folder, early), file);
          break;
        }
      }
    }
    return file;
  }
  const early = readdirSync(cwd).find((name) => name.endsWith('.engagement.json'));
  return early ? path.join(cwd, early) : null;
}

export function load(cwd) {
  const file = statePath(cwd);
  if (!file || !existsSync(file)) return {file, state: null};
  return {file, state: JSON.parse(readFileSync(file, 'utf8'))};
}

function save(file, state) {
  mkdirSync(path.dirname(file), {recursive: true});
  writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`);
}

function option(args, name) {
  const index = args.indexOf(`--${name}`);
  if (index < 0) return undefined;
  const value = args[index + 1];
  args.splice(index, 2);
  return value;
}

function flag(args, name) {
  const index = args.indexOf(`--${name}`);
  if (index < 0) return false;
  args.splice(index, 1);
  return true;
}

function parseValue(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const now = () => new Date().toISOString();

function due(state, table) {
  const current = STAGES.indexOf(state.stage);
  // Store facts (F rows) are settled once discover has read the store
  return table.filter((row) => !state.decisions[row.id] && !(row.id.startsWith('F') && state.facts.readAt) && STAGES.indexOf(row.by) !== -1 && STAGES.indexOf(row.by) <= current);
}

// A default that depends on another decision, so the table's single default never misleads
function defaultFor(row, state) {
  if (row.id === 'B1' && /redesign/i.test(String(state.decisions.E1?.value ?? ''))) return 'Define a new brand: this is a redesign';
  return row.default;
}

const guesses = (state) => Object.entries(state.decisions).filter(([, entry]) => entry.by === 'guess');

function main(argv) {
  const args = [...argv];
  const command = args.shift();
  const table = decisionTable();
  if (command === 'init') {
    const store = option(args, 'store');
    if (!store) throw new Error('init needs --store <domain>');
    const domain = store.includes('.') ? store.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : `${store}.myshopify.com`;
    const existing = load(process.cwd());
    if (existing.state) return console.log(`State exists: ${existing.file}`);
    const file = path.join(process.cwd(), `${handleOf(domain)}.engagement.json`);
    save(file, {schemaVersion: 1, store: domain, stage: 'engage', reviewPage: null, decisions: {}, questions: {}, facts: {}, plan: {file: null, approvedAt: null}, history: [{at: now(), event: 'init'}]});
    return console.log(`Started ${file}`);
  }
  // A command for the developer starts from the project's absolute path, so it runs from any folder
  if (command === 'command') {
    const line = args.join(' ').trim();
    if (!line) throw new Error('command needs "<command>"');
    const folder = realpathSync(findProject(process.cwd()) ?? process.cwd());
    return console.log(`cd '${folder.replace(/'/g, "'\\''")}' && ${line}`);
  }
  const {file, state} = load(process.cwd());
  if (command === 'path') return console.log(file ?? '(none: run state.mjs init --store <domain>)');
  if (!state) throw new Error('No engagement state here. Run: state.mjs init --store <domain>');
  state.stage = OLD_STAGES[state.stage] ?? state.stage;
  // Only IDs from decisions.md, so a decision is never filed where no skill looks for it
  if (['decide', 'guess', 'ask', 'undo'].includes(command)) {
    const id = args.find((arg, index) => !arg.startsWith('--') && !(index > 0 && args[index - 1].startsWith('--')));
    if (id && !table.some((row) => row.id === id)) {
      console.log(`${id} is not a decision. Use an ID from references/decisions.md: ${table.map((row) => row.id).join(', ')}.`);
      process.exitCode = 2;
      return;
    }
  }

  if (command === 'show') {
    const decided = Object.entries(state.decisions).filter(([, entry]) => entry.by !== 'guess').map(([id, entry]) => `  ${id.padEnd(5)} ${JSON.stringify(entry.value)}  (${entry.by}${entry.evidence ? `: ${String(entry.evidence).slice(0, 80)}` : ''})`);
    const open = Object.entries(state.questions).filter(([, entry]) => !entry.answeredAt).map(([id, entry]) => `  ${id} ${entry.decision} to ${entry.to}: ${entry.text.slice(0, 100)}`);
    console.log([`Store: ${state.store}`, `Stage: ${state.stage}`, `Facts read: ${state.facts.readAt ?? 'never'}`, `Plan: ${state.plan.file ?? 'none'}${state.plan.approvedAt ? ', approved' : ''}`, '', 'Decided:', ...(decided.length ? decided : ['  none']), '', 'Best guesses for the review page:', ...(guesses(state).length ? guesses(state).map(([id, entry]) => `  ${id.padEnd(5)} ${JSON.stringify(entry.value)}`) : ['  none']), '', 'Waiting for an answer:', ...(open.length ? open : ['  none'])].join('\n'));
    return;
  }
  if (command === 'next') {
    const rows = due(state, table);
    if (!rows.length) return console.log(`Nothing due at ${state.stage}. Move to the next stage: ${STAGES[STAGES.indexOf(state.stage) + 1] ?? 'none'}.`);
    console.log(`Due by ${state.stage}. Find first. Guess what the client owns. Ask the developer only what an agency knows:`);
    for (const row of rows) console.log(`  ${row.id.padEnd(4)} ${row.how.padEnd(11)} ask: ${row.ask.padEnd(9)} by: ${row.by.padEnd(8)} ${row.decision}\n        default: ${defaultFor(row, state)}`);
    return;
  }
  if (command === 'undo') {
    const why = option(args, 'why');
    const [id] = args;
    if (!why) throw new Error('undo needs --why "…"');
    if (!state.decisions[id]) return console.log(`${id} has no decision to undo.`);
    state.history.push({at: now(), event: `undo ${id}`, was: state.decisions[id], why});
    delete state.decisions[id];
    save(file, state);
    return console.log(`Cleared ${id}. It is open again.`);
  }
  if (command === 'review') {
    const rows = guesses(state);
    if (!rows.length) return console.log('No guesses to show the client.');
    for (const [id, entry] of rows) console.log(`${id.padEnd(5)} ${table.find((row) => row.id === id)?.decision ?? ''}\n      guess: ${JSON.stringify(entry.value)}${entry.evidence ? `\n      from:  ${entry.evidence}` : ''}`);
    return;
  }
  if (command === 'decide' || command === 'guess') {
    const by = command === 'guess' ? 'guess' : (option(args, 'by') ?? 'agent');
    if (command === 'guess' && !args.includes('--evidence')) throw new Error('A guess needs --evidence "<the fact it comes from>"');
    const evidence = option(args, 'evidence');
    const [id, ...rest] = args;
    if (!id || !rest.length) throw new Error('decide needs <ID> <value>');
    // A theme the store already runs is a target to keep, never a move to it
    const value = String(rest.join(' '));
    const kind = id === 'E1' ? value : String(state.decisions.E1?.value ?? '');
    const target = id === 'E2' ? value : `${state.decisions.E2?.value ?? ''} ${id === 'E1' ? value : ''}`;
    const running = state.facts.liveTheme?.theme;
    if ((id === 'E1' || id === 'E2') && /\bmove/i.test(kind) && running && target.toLowerCase().includes(String(running).toLowerCase())) {
      console.log(`Not a move: the live theme already runs ${running}. Record the project kind as keep, or ask which other theme is the target.`);
      process.exitCode = 3;
      return;
    }
    state.decisions[id] = {value: parseValue(rest.join(' ')), by, at: now(), ...(evidence ? {evidence} : {})};
    // Keeping the live theme names the target too
    if (id === 'E1' && /^keep\b/i.test(value) && !state.decisions.E2 && state.facts.liveTheme?.theme) {
      state.decisions.E2 = {value: state.facts.liveTheme.theme, by, at: now(), evidence: 'Keeping the live theme, which runs this theme'};
    }
    for (const entry of Object.values(state.questions)) if (entry.decision === id && !entry.answeredAt) entry.answeredAt = now();
    save(file, state);
    return console.log(`Recorded ${id}.`);
  }
  if (command === 'ask') {
    const to = option(args, 'to') ?? 'developer';
    const text = option(args, 'text');
    const [id] = args;
    if (!id || !text) throw new Error('ask needs <ID> --text "…"');
    // Refuse what the person must never read: internal names, and several questions at once
    const shown = check(text).filter((problem) => /^Internal /.test(problem));
    const asked = Math.max((text.replace(/`[^`]*`|https?:\/\/\S+/g, '').match(/\?/g) ?? []).length, (text.match(/^\s*\d+[.)]\s/gm) ?? []).length);
    if (asked > 1) shown.push(`${asked} questions in one. Ask one decision, and wait for the answer`);
    // A theme goes by its name; its ID helps only when two themes share the name
    const themes = state.facts.themes ?? [];
    for (const [, themeId] of text.matchAll(/#(\d{6,})/g)) {
      const theme = themes.find((entry) => String(entry.id) === themeId);
      if (theme && themes.filter((entry) => entry.name === theme.name).length === 1) shown.push(`Theme ID #${themeId}: "${theme.name}" is the only theme with that name, so name it instead`);
    }
    const command = /`?\b(?:tradecraft|tdc|shopify|pnpm|npm|git)\s+[a-z][a-z-]*/.exec(text);
    if (command) shown.push(`CLI command "${command[0].replace(/`/g, '')}": ask about the store in plain words, and run the command yourself`);
    if (shown.length) {
      console.log(['Rewrite the question before you ask it:', ...shown.map((problem) => `- ${problem}`)].join('\n'));
      process.exitCode = 4;
      return;
    }
    if (state.decisions[id]) {
      console.log(`Do not ask: ${id} is already decided: ${JSON.stringify(state.decisions[id].value)} (${state.decisions[id].by}).`);
      process.exitCode = 3;
      return;
    }
    // The project kind and target rest on the store read, never on a theme list alone
    if ((id === 'E1' || id === 'E2') && !state.facts.readAt) {
      console.log('Run discover first, so the question names the live theme, its version, and the releases that exist.');
      process.exitCode = 3;
      return;
    }
    // The target is part of the project-kind question, so it is never asked on its own first
    if (id === 'E2' && !state.decisions.E1) {
      console.log('Ask the target as one question with the project kind (E1): "Do we keep <live theme>, or move to <theme>?"');
      process.exitCode = 3;
      return;
    }
    // The client sees the work first, so a client question waits for the review page
    if (to === 'client' && STAGES.indexOf(state.stage) < STAGES.indexOf('review')) {
      console.log(`Do not ask the client before review. Record a best guess: state.mjs guess ${id} "<value>" --evidence "…". The client sees it on the review page.`);
      process.exitCode = 3;
      return;
    }
    const pending = Object.entries(state.questions).find(([, entry]) => entry.decision === id && !entry.answeredAt);
    if (pending) {
      console.log(`Already asked as ${pending[0]} on ${pending[1].askedAt}. Wait for that answer.`);
      process.exitCode = 3;
      return;
    }
    const qid = `q${Object.keys(state.questions).length + 1}`;
    state.questions[qid] = {decision: id, to, text, askedAt: now(), answeredAt: null};
    save(file, state);
    return console.log(`Recorded ${qid}. Ask it now.`);
  }
  if (command === 'stage') {
    const [stage] = args;
    if (!STAGES.includes(stage)) throw new Error(`Unknown stage. Use one of: ${STAGES.join(', ')}`);
    state.stage = stage;
    state.history.push({at: now(), event: `stage ${stage}`});
    save(file, state);
    return console.log(`Stage: ${stage}`);
  }
  if (command === 'facts') {
    const [source] = args;
    const facts = JSON.parse(readFileSync(source, 'utf8'));
    state.facts = {...state.facts, ...facts, readAt: facts.readAt ?? now()};
    save(file, state);
    return console.log('Recorded the facts.');
  }
  if (command === 'plan') {
    const planFile = option(args, 'file');
    if (planFile) state.plan.file = planFile;
    if (flag(args, 'approved')) state.plan.approvedAt = now();
    save(file, state);
    return console.log(`Plan: ${state.plan.file ?? 'none'}${state.plan.approvedAt ? ', approved' : ''}`);
  }
  throw new Error('Commands: init, show, next, decide, guess, review, undo, ask, stage, facts, plan, command, path');
}

// realpath, since .claude/skills reaches this file through a link
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
