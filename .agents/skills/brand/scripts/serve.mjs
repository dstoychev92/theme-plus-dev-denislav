#!/usr/bin/env node
// Serves brand/sandbox on http://localhost:4747. The theme's scripts are ES modules, and browsers
// do not load modules from file://. Run it from the project root.
//
//   node .agents/skills/brand/scripts/serve.mjs [--port 4747] [--root <dir>]

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {option} from './lib/project.mjs';

const args = process.argv.slice(2);
const root = path.join(path.resolve(option(args, '--root') ?? process.cwd()), 'brand/sandbox');
const port = Number(option(args, '--port') ?? 4747);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

http
  .createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (!file.startsWith(root)) {
      response.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, {'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store'});
    fs.createReadStream(file).pipe(response);
  })
  .listen(port, () => console.log(`Brand sandbox on http://localhost:${port}`));
