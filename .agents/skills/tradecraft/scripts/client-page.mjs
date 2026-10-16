#!/usr/bin/env node
/**
 * Write the client's question page from a questions file. It refuses to write the page while
 * any text fails the style check, so rewrite the flagged text and run it again.
 *
 *   client-page.mjs review-page.json [--out review-page.html]
 *
 * The file:
 *   {
 *     "title": "Questions about your new website",
 *     "intro": "…",
 *     "contact": "Sam at Acme Studio",
 *     "questions": [
 *       {"id": "P1", "question": "…?", "detail": "…" or ["…", "…"],
 *        "options": ["…", "…"], "default": 0, "more": "…"}
 *     ]
 *   }
 *
 * "id" is the decision ID. The page never shows it. Publish the page as it is, with the db
 * capability, and read the answers from the "answers" collection: one document per id.
 */
import {readFileSync, realpathSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {check, wordCount} from './ste-check.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const LIMITS = {title: 10, intro: 40, question: 20, detail: 40, option: 12, more: 60};

/** Every problem in the file: its shape, then the style check on each text a client reads */
export function problems(page) {
  const found = [];
  const add = (where, list) => found.push(...list.map((problem) => `${where}: ${problem}`));
  for (const key of ['title', 'intro']) {
    if (typeof page[key] !== 'string' || !page[key].trim()) found.push(`${key}: missing`);
    else add(key, check(page[key], {client: true, maxWords: LIMITS[key]}));
  }
  if (!Array.isArray(page.questions) || !page.questions.length) found.push('questions: missing');
  if ((page.questions ?? []).length > 5) found.push(`questions: ${page.questions.length}, ask at most 5 on one page`);
  const ids = new Set();
  for (const [index, q] of (page.questions ?? []).entries()) {
    const where = `question ${index + 1}${q.id ? ` (${q.id})` : ''}`;
    if (!q.id) found.push(`${where}: missing id`);
    else if (ids.has(q.id)) found.push(`${where}: the id is used twice`);
    ids.add(q.id);
    if (typeof q.question !== 'string' || !q.question.trim().endsWith('?')) found.push(`${where}: the question must end with "?"`);
    else add(where, check(q.question, {client: true, maxWords: LIMITS.question}));
    if (!Array.isArray(q.options) || q.options.length < 1 || q.options.length > 4) found.push(`${where}: give 1 to 4 options; the page adds "Something else"`);
    for (const option of q.options ?? []) add(`${where}, option "${option}"`, check(option, {client: true, maxWords: LIMITS.option}));
    if (q.default !== undefined && !(Number.isInteger(q.default) && q.default >= 0 && q.default < (q.options ?? []).length)) found.push(`${where}: default must be the index of an option`);
    for (const line of q.detail === undefined ? [] : [q.detail].flat()) add(`${where}, detail`, check(line, {client: true, maxWords: LIMITS.detail}));
    if (q.more !== undefined) add(`${where}, more info`, check(q.more, {client: true, maxWords: LIMITS.more}));
    const total = wordCount([q.question, ...[q.detail ?? []].flat(), ...(q.options ?? [])].join(' '));
    if (total > 50) found.push(`${where}: ${total} words without "More info", keep it to 50`);
  }
  return found;
}

export function render(page) {
  const template = readFileSync(path.join(here, '..', 'assets', 'client-questions.html'), 'utf8');
  const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  // A "</script>" inside the data would end the data block
  const data = JSON.stringify(page).replace(/</g, '\\u003c');
  return template.replace('__TITLE__', () => escapeHtml(page.title)).replace('__DATA__', () => data);
}

function main(argv) {
  const [source] = argv.filter((arg) => !arg.startsWith('--'));
  if (!source) throw new Error('Usage: client-page.mjs <questions.json> [--out <page.html>]');
  const outIndex = argv.indexOf('--out');
  const out = outIndex >= 0 ? argv[outIndex + 1] : source.replace(/\.json$/, '') + '.html';
  const page = JSON.parse(readFileSync(source, 'utf8'));
  const found = problems(page);
  if (found.length) {
    for (const problem of found) console.log(`- ${problem}`);
    console.log(`\n${found.length} problem(s). Rewrite the text in ${source} and run this again. No page was written.`);
    process.exitCode = 1;
    return;
  }
  writeFileSync(out, render(page));
  console.log(`Wrote ${out}. Publish it as it is, with the db capability. Do not restyle it.`);
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
