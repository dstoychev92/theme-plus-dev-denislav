#!/usr/bin/env node
const {run} = require('../dist/cli.js');

run(process.argv.slice(2)).catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
