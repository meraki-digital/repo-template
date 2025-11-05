#!/bin/bash

# Install pre-push hook for Obsidian sync

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
HOOK_FILE="$REPO_ROOT/.git/hooks/pre-push"

echo "Installing Obsidian sync pre-push hook..."

cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash

# Pre-push hook to sync to Obsidian vault before pushing

./agentic/obsidian/sync-obsidian.sh

exit 0
EOF

chmod +x "$HOOK_FILE"

echo "✅ Hook installed at .git/hooks/pre-push"
echo ""
echo "Next steps:"
echo "1. Update agentic/obsidian/.obsidian-sync.json with your Obsidian vault path"
echo "2. Test with: ./agentic/obsidian/sync-obsidian.sh"
