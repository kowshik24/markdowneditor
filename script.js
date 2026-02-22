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
const exportPdfBtn = document.getElementById('exportPdfBtn');
const syncScrollCheckbox = document.getElementById('syncScroll');
const darkModeCheckbox = document.getElementById('darkMode');

// Default markdown content
const defaultMarkdown = markdownEditor.value;

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
  previewContent.innerHTML = html;
  
  // Highlight code blocks
  previewContent.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
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
      copyBtn.innerHTML = '<span>Copy</span>';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    markdownEditor.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = '<span>Copy</span>';
    }, 2000);
  }
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
  } else {
    highlightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
  }
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
