#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then echo "Please install Node.js 18+ first."; exit 1; fi
printf 'Starting ProRack Move at http://localhost:5173\n'
exec node server.mjs
