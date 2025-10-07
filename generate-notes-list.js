// Simple script to generate a notes list for the homepage
// This can be run manually or via GitHub Actions

const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, baseDir = '') {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            // Recursively scan subdirectories
            files.push(...findHtmlFiles(fullPath, path.join(baseDir, item)));
        } else if (item.endsWith('.html') && item !== 'index.html') {
            // Skip certain utility files
            if (item.includes('speaker-view') || fullPath.includes('plugin')) {
                continue;
            }
            
            const relativePath = path.join(baseDir, item);
            const title = extractTitle(fullPath) || formatTitle(item);
            const type = detectFileType(fullPath);
            
            files.push({
                title,
                path: relativePath.replace(/\\/g, '/'), // Normalize path separators
                folder: baseDir || 'Root',
                type
            });
        }
    }
    
    return files;
}

function extractTitle(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1].trim() && !titleMatch[1].includes('{{')) {
            return titleMatch[1].trim();
        }
    } catch (e) {
        // If we can't read the file, just use the filename
    }
    return null;
}

function formatTitle(filename) {
    return filename
        .replace('.html', '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function detectFileType(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('marimo') || content.includes('@marimo-team')) {
            return 'marimo';
        }
        if (content.includes('reveal.js') || content.includes('Reveal.initialize')) {
            return 'presentation';
        }
    } catch (e) {
        // If we can't read the file, default to html
    }
    return 'html';
}

function generateNotesArray() {
    const notesDir = path.join(__dirname, 'Notes');
    if (!fs.existsSync(notesDir)) {
        return [];
    }
    
    return findHtmlFiles(notesDir, 'Notes');
}

function updateIndexHtml() {
    const notes = generateNotesArray();
    const indexPath = path.join(__dirname, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
        console.error('index.html not found');
        return;
    }
    
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Replace the knownNotes array in the JavaScript
    const notesArrayString = JSON.stringify(notes, null, 12);
    const pattern = /const knownNotes = \[[^\]]*\];/s;
    const replacement = `const knownNotes = ${notesArrayString};`;
    
    content = content.replace(pattern, replacement);
    
    fs.writeFileSync(indexPath, content);
    console.log(`Updated index.html with ${notes.length} notes`);
}

// If run directly
if (require.main === module) {
    updateIndexHtml();
}

module.exports = { generateNotesArray, updateIndexHtml };