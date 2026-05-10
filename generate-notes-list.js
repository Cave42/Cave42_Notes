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
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'reveal.js') {
            // Recursively scan subdirectories
            files.push(...findHtmlFiles(fullPath, path.join(baseDir, item)));
        } else if (item.endsWith('.html')) {
            // Skip the root index.html but allow index.html in subdirectories
            if (baseDir === '' && item === 'index.html') {
                continue;
            }
            
            // Skip certain utility files
            if (item.includes('speaker-view') || fullPath.includes('plugin') || item === '404.html') {
                continue;
            }
            
            const relativePath = path.join(baseDir, item);
            const title = extractTitle(fullPath) || formatTitle(item, baseDir);
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
        
        // Try to extract title from HTML <title> tag
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1].trim() && !titleMatch[1].includes('{{')) {
            let title = titleMatch[1].trim();
            // Strip common framework suffixes
            title = title.replace(/\s*-\s*Slidev$/, '').replace(/\s*-\s*reveal\.js$/, '').trim();
            // Skip generic titles
            if (title && title !== 'a marimo app') {
                return title;
            }
        }
        
        // For reveal.js presentations, try to find the first h1, h2, h3, or markdown heading
        if (content.includes('reveal.js') || content.includes('Reveal.initialize') || content.includes('class="reveal"')) {
            // Try markdown-style headings first (common in reveal.js)
            const markdownMatch = content.match(/###?\s+([^\n\r]+)/);
            if (markdownMatch && markdownMatch[1].trim()) {
                return markdownMatch[1].trim();
            }
            
            // Try HTML headings
            const h1Match = content.match(/<h[123][^>]*>([^<]+)<\/h[123]>/i);
            if (h1Match && h1Match[1].trim()) {
                return h1Match[1].trim();
            }
        }
        
        // For marimo notebooks, try to extract from content
        if (content.includes('marimo') || content.includes('@marimo-team')) {
            // Look for common patterns in marimo notebooks
            const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
            if (h1Match && h1Match[1].trim()) {
                return h1Match[1].trim();
            }
        }
        
    } catch (e) {
        // If we can't read the file, just use the filename
    }
    return null;
}

function formatTitle(filename, folderPath = '') {
    // If it's just "index.html", try to use the folder name
    if (filename === 'index.html' && folderPath) {
        const folderName = path.basename(folderPath);
        return folderName
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
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
        if (content.includes('slidev') || content.includes('@slidev')) {
            return 'presentation';
        }
    } catch (e) {
        // If we can't read the file, default to html
    }
    return 'html';
}

function generateNotesArray() {
    const results = [];

    const notesDir = path.join(__dirname, 'Notes');
    if (fs.existsSync(notesDir)) {
        results.push(...findHtmlFiles(notesDir, 'Notes'));
    }

    const slidesDir = path.join(__dirname, 'Slides');
    if (fs.existsSync(slidesDir)) {
        results.push(...findHtmlFiles(slidesDir, 'Slides'));
    }

    return results;
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