#!/bin/bash

# ./agentic/obsidian/sync-obsidian.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.obsidian-sync.json"

cd "$REPO_ROOT"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: $CONFIG_FILE not found"
  exit 1
fi

OBSIDIAN_BASE=$(jq -r '.obsidianBasePath' "$CONFIG_FILE")
OBSIDIAN_PROJECT=$(jq -r '.obsidianProject' "$CONFIG_FILE")
SYNC_ITEMS=$(jq -r '.sync[]' "$CONFIG_FILE")

BRANCH=$(git branch --show-current)
TARGET_DIR="$OBSIDIAN_BASE/$OBSIDIAN_PROJECT/$BRANCH"

echo "Syncing to Obsidian vault..."
echo "Branch: $BRANCH"
echo "Target: $TARGET_DIR"
echo ""

mkdir -p "$TARGET_DIR"

while IFS= read -r pattern; do
  if [[ "$pattern" == *"*"* ]]; then
    for item in $pattern; do
      if [ -e "$item" ]; then
        if [ -d "$item" ]; then
          echo "Syncing folder: $item"
          rsync -av --delete "$item" "$TARGET_DIR/"
        else
          echo "Syncing file: $item"
          mkdir -p "$TARGET_DIR/$(dirname "$item")"
          cp "$item" "$TARGET_DIR/$item"
        fi
      fi
    done
  else
    if [ -d "$pattern" ]; then
      echo "Syncing folder: $pattern"
      rsync -av --delete "$pattern" "$TARGET_DIR/"
    elif [ -f "$pattern" ]; then
      echo "Syncing file: $pattern"
      mkdir -p "$TARGET_DIR/$(dirname "$pattern")"
      cp "$pattern" "$TARGET_DIR/$pattern"
    else
      echo "Warning: $pattern not found, skipping"
    fi
  fi
done <<< "$SYNC_ITEMS"

echo ""
echo "✅ Sync complete: $TARGET_DIR"
