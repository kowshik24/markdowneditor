// Markdown Live Preview Application

// Initialize marked.js with options
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

// Get DOM elements
const markdownEditor = document.getElementById('markdownEditor');
const previewContent = document.getElementById('previewContent');
const lineNumbers = document.getElementById('lineNumbers');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const openFileBtn = document.getElementById('openFileBtn');
const saveFileBtn = document.getElementById('saveFileBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const syncScrollCheckbox = document.getElementById('syncScroll');
const darkModeCheckbox = document.getElementById('darkMode');
const markdownFileInput = document.getElementById('markdownFileInput');

// Default markdown content
const defaultMarkdown = markdownEditor.value;
let currentFileName = 'markdown-preview.md';

const copyBtnDefaultContent = copyBtn.innerHTML;

// Update line numbers
function updateLineNumbers() {
  const lines = markdownEditor.value.split('\n');
  const lineCount = lines.length;
  let lineNumbersHTML = '';
  
  for (let i = 1; i <= lineCount; i++) {
    lineNumbersHTML += `<div>${i}</div>`;
  }
  
  lineNumbers.innerHTML = lineNumbersHTML;
}

// Update preview
function updatePreview() {
  const markdown = markdownEditor.value;
  const html = marked.parse(markdown);
  const safeHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }
  });
  previewContent.innerHTML = safeHtml;
  
  // Highlight code blocks
  previewContent.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

function triggerDownload(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function saveMarkdownFile() {
  triggerDownload(currentFileName, markdownEditor.value);
}

function openMarkdownFile() {
  markdownFileInput.click();
}

// Sync scroll between editor and preview
let isScrolling = false;

function syncScroll(source, target) {
  if (isScrolling) return;
  isScrolling = true;
  
  const sourceScrollTop = source.scrollTop;
  const sourceScrollHeight = source.scrollHeight;
  const sourceClientHeight = source.clientHeight;
  
  const targetScrollHeight = target.scrollHeight;
  const targetClientHeight = target.clientHeight;
  
  const scrollRatio = sourceScrollTop / (sourceScrollHeight - sourceClientHeight);
  const targetScrollTop = scrollRatio * (targetScrollHeight - targetClientHeight);
  
  target.scrollTop = targetScrollTop;
  
  setTimeout(() => {
    isScrolling = false;
  }, 10);
}

// Event listeners
markdownEditor.addEventListener('input', () => {
  updateLineNumbers();
  updatePreview();
  
  // Sync scroll if enabled
  if (syncScrollCheckbox.checked) {
    syncScroll(markdownEditor, previewContent);
  }
});

markdownEditor.addEventListener('scroll', () => {
  if (syncScrollCheckbox.checked && !isScrolling) {
    syncScroll(markdownEditor, previewContent);
  }
});

previewContent.addEventListener('scroll', () => {
  if (syncScrollCheckbox.checked && !isScrolling) {
    syncScroll(previewContent, markdownEditor);
  }
});

// Reset button
resetBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset? This will clear all your content.')) {
    markdownEditor.value = defaultMarkdown;
    updateLineNumbers();
    updatePreview();
  }
});

// Copy button
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(markdownEditor.value);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = copyBtnDefaultContent;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    markdownEditor.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = copyBtnDefaultContent;
    }, 2000);
  }
});

// Open file button
openFileBtn.addEventListener('click', openMarkdownFile);

// Save file button
saveFileBtn.addEventListener('click', saveMarkdownFile);

// File input change
markdownFileInput.addEventListener('change', (event) => {
  const [file] = event.target.files;

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    const content = typeof loadEvent.target.result === 'string' ? loadEvent.target.result : '';
    markdownEditor.value = content;
    currentFileName = file.name || 'markdown-preview.md';
    updateLineNumbers();
    updatePreview();
    localStorage.setItem('markdownContent', markdownEditor.value);
  };

  reader.onerror = () => {
    alert('Failed to open file. Please try another Markdown file.');
  };

  reader.readAsText(file);
  event.target.value = '';
});

// Export PDF button
exportPdfBtn.addEventListener('click', () => {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get preview content
    const content = previewContent.innerText || previewContent.textContent;
    
    // Split content into pages
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const lineHeight = 7;
    const maxWidth = pageWidth - 2 * margin;
    
    // Split text into lines that fit the page width
    const lines = doc.splitTextToSize(content, maxWidth);
    let y = margin;
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    
    lines.forEach((line, index) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(12);
      doc.text(line, margin, y);
      y += lineHeight;
    });
    
    doc.save('markdown-preview.pdf');
  } catch (err) {
    console.error('Failed to export PDF:', err);
    alert('PDF export failed. Please try again or use the browser\'s print function.');
  }
});

// Dark mode toggle
function updateHighlightTheme(isDark) {
  const highlightTheme = document.getElementById('highlight-theme');

  if (isDark) {
    highlightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
    highlightTheme.integrity = 'sha384-wH75j6z1lH97ZOpMOInqhgKzFkAInZPPSPlZpYKYTOqsaizPvhQZmAtLcPKXpLyH';
  } else {
    highlightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    highlightTheme.integrity = 'sha384-eFTL69TLRZTkNfYZOLM+G04821K1qZao/4QLJbet1pP4tcF+fdXq/9CdqAbWRl/L';
  }

  highlightTheme.crossOrigin = 'anonymous';
}

darkModeCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    updateHighlightTheme(true);
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
    updateHighlightTheme(false);
  }
  // Re-highlight code blocks with new theme
  setTimeout(() => {
    previewContent.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, 100);
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  darkModeCheckbox.checked = true;
  document.body.classList.add('dark-mode');
  updateHighlightTheme(true);
} else {
  updateHighlightTheme(false);
}

// Sync scroll checkbox
syncScrollCheckbox.addEventListener('change', (e) => {
  localStorage.setItem('syncScroll', e.target.checked);
});

// Load sync scroll preference
if (localStorage.getItem('syncScroll') === 'false') {
  syncScrollCheckbox.checked = false;
}

// Initialize
updateLineNumbers();
updatePreview();

// Handle window resize
window.addEventListener('resize', () => {
  updateLineNumbers();
});

// Auto-save to localStorage
markdownEditor.addEventListener('input', () => {
  localStorage.setItem('markdownContent', markdownEditor.value);
});

// Load saved content
const savedContent = localStorage.getItem('markdownContent');
if (savedContent) {
  markdownEditor.value = savedContent;
  updateLineNumbers();
  updatePreview();
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
  const isModifierPressed = event.metaKey || event.ctrlKey;

  if (!isModifierPressed) {
    return;
  }

  const key = event.key.toLowerCase();

  if (key === 's') {
    event.preventDefault();
    if (event.shiftKey) {
      exportPdfBtn.click();
      return;
    }
    saveMarkdownFile();
    return;
  }

  if (key === 'o') {
    event.preventDefault();
    openMarkdownFile();
    return;
  }

  if (key === 'c' && event.shiftKey) {
    event.preventDefault();
    copyBtn.click();
    return;
  }

  if (key === 'r' && event.shiftKey) {
    event.preventDefault();
    resetBtn.click();
  }
});
