#!/bin/bash
# Manual script to update notes list and commit changes

echo "🔍 Scanning for HTML files and updating notes list..."
node generate-notes-list.js

if [ -n "$(git status --porcelain index.html)" ]; then
    echo "📝 Changes detected in index.html"
    git add index.html
    git commit -m "🤖 Update notes list with latest HTML files"
    echo "✅ Notes list updated and committed!"
    echo "🚀 Run 'git push' to upload changes to GitHub"
else
    echo "✅ Notes list is already up to date!"
fi