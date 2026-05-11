#!/usr/bin/env bash
set -e

echo "CommercePulse 360 Kit - basic project check"

if [ ! -f "backend/package.json" ]; then
  echo "backend/package.json not found"
  exit 1
fi

if [ ! -f "frontend/package.json" ]; then
  echo "frontend/package.json not found"
  exit 1
fi

echo "Project structure looks OK."
