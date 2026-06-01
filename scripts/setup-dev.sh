#!/usr/bin/env bash
set -euo pipefail

echo "== Dev setup script: configuring backend dev environment =="

# Ensure pnpm is installed
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found — installing globally via npm..."
  npm install -g pnpm
fi

echo "Installing backend dependencies..."
pnpm --prefix backend install

echo "Installing Husky hooks into backend/.husky (safe if already installed)..."
npx husky install backend/.husky || true

echo "Setting git hooks path to backend/.husky for this repo..."
git config core.hooksPath backend/.husky || true

echo "Ensure pre-commit hook is executable and staged..."
git update-index --add --chmod=+x backend/.husky/pre-commit || true

echo "Running a quick TypeScript build to verify setup..."
pnpm --prefix backend build

echo "Setup complete. If everything passed, you're ready to develop."
echo "If you want hooks at repo root instead, run: git config core.hooksPath .husky"
