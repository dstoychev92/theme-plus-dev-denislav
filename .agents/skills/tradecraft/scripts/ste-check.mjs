#!/usr/bin/env node
/**
 * Check text against the ASD-STE100 style rules this skill uses. Prints each problem and
 * exits 1 when there is one, so the agent rewrites and checks again until it passes.
 *
 *   ste-check.mjs "text"                one question or message to the developer
 *   ste-check.mjs --client "text"       text a client reads: also refuses technical words
 *   ste-check.mjs --file message.md     a file, such as a status message or PLAN.md
 */
import {readFileSync, realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const MAX_SENTENCE = 20;

// Words that make text read as machine-written or vague
const VAGUE = ['seamless', 'seamlessly', 'robust', 'leverage', 'utilize', 'streamline', 'elevate', 'delve', 'comprehensive', 'cutting-edge', 'empower', 'effortless', 'effortlessly', 'unlock', 'tailored', 'journey', 'holistic', 'synergy', 'best-in-class', 'world-class', 'game-changer', 'crucial', 'ensure'];
// Words a client does not need to know
const TECHNICAL = ['theme', 'themes', 'release', 'template', 'templates', 'section', 'sections', 'git', 'github', 'cli', 'repository', 'repo', 'liquid', 'metafield', 'metafields', 'metaobject', 'metaobjects', 'schema', 'json', 'deploy', 'push', 'merge', 'branch', 'commit', 'splice', 'tradecraft', 'workspace', 'pnpm', 'npm', 'api', 'graphql'];
// Words that belong to this skill, never to what a person reads
const INTERNAL = ['batch', 'engagement', 'state.mjs', 'intake'];
const PARTICIPLES = 'made|done|shown|given|built|kept|sent|set|taken|written|seen|found|known|held|run|put|read|told|left|paid|chosen|broken';
const PASSIVE = new RegExp(`\\b(is|are|was|were|be|been|being)\\s+(\\w+ed|${PARTICIPLES})\\b`, 'i');

export function sentences(text) {
  return text
    .replace(/`[^`]*`/g, 'CODE')
    .replace(/https?:\/\/\S+/g, 'LINK')
    .split(/\n+|(?<=[.?!:])\s+/)
    .map((sentence) => sentence.replace(/^[-*>\d.)\s]+/, '').trim())
    .filter((sentence) => /[a-z]/i.test(sentence));
}

export const wordCount = (text) => (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu) ?? []).length;

/** Problems in one piece of text. maxWords limits the whole piece, such as 50 for a question */
export function check(text, {client = false, maxWords} = {}) {
  const problems = [];
  for (const sentence of sentences(text)) {
    const count = wordCount(sentence);
    if (count > MAX_SENTENCE) problems.push(`${count} words, keep a sentence to ${MAX_SENTENCE}: "${sentence}"`);
    if (PASSIVE.test(sentence)) problems.push(`Passive voice, name who does it: "${sentence}"`);
  }
  if (maxWords && wordCount(text) > maxWords) problems.push(`${wordCount(text)} words, keep this to ${maxWords}`);
  const words = new Set((text.toLowerCase().match(/[a-z][a-z.-]*/g) ?? []).map((word) => word.replace(/[.-]+$/, '')));
  const used = (list) => list.filter((word) => words.has(word));
  for (const word of used(VAGUE)) problems.push(`Vague or machine-sounding word: "${word}". Say the fact`);
  for (const word of used(INTERNAL)) problems.push(`Internal word: "${word}"`);
  if (/\b[A-Z]\d{1,2}\b/.test(text)) problems.push(`Internal decision ID: "${text.match(/\b[A-Z]\d{1,2}\b/)[0]}"`);
  if (/—/.test(text)) problems.push('Em dash: use two sentences, or a comma');
  if (client) {
    for (const word of used(TECHNICAL)) problems.push(`Technical word a client does not need: "${word}"`);
    if (/#\d{6,}/.test(text)) problems.push('Theme ID: a client knows the theme by its name');
  }
  return problems;
}

function main(argv) {
  const args = [...argv];
  const client = args.includes('--client');
  const fileIndex = args.indexOf('--file');
  const text = fileIndex >= 0 ? readFileSync(args[fileIndex + 1], 'utf8') : args.filter((arg) => !arg.startsWith('--')).join(' ');
  if (!text.trim()) throw new Error('Usage: ste-check.mjs [--client] "text" | --file <file>');
  const problems = check(text, {client});
  for (const problem of problems) console.log(`- ${problem}`);
  if (problems.length) {
    console.log(`\n${problems.length} problem(s). Rewrite and check again.`);
    process.exitCode = 1;
  } else console.log('Passes.');
}

// realpath, since .claude/skills reaches this file through a link
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
