# Markdown Live Preview

A beautiful, modern Markdown editor with live preview, inspired by PostHog's design system. Perfect for writing and previewing Markdown documents in real-time.

## Features

- ✨ **Live Preview** - See your Markdown rendered in real-time as you type
- 🎨 **PostHog-inspired Design** - Clean, modern UI with carefully crafted typography and colors
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📋 **Copy to Clipboard** - Quickly copy your Markdown content
- 📂 **Open Markdown Files** - Load local `.md`/`.markdown` files into the editor
- 💾 **Save Markdown Files** - Download your current editor content as a Markdown file
- 📄 **Export to PDF** - Export your rendered content as a PDF
- 🔄 **Sync Scroll** - Synchronize scrolling between editor and preview panes
- 🔗 **Quick Insert Actions** - Insert Markdown links, image URLs, and blockquotes from the toolbar
- 💾 **Auto-save** - Your content is automatically saved to browser localStorage
- 📱 **Responsive** - Works great on desktop and mobile devices
- 🎯 **Syntax Highlighting** - Code blocks are highlighted with syntax colors
- ⌨️ **Keyboard Shortcuts** - Fast actions for open, save, export, copy, and reset
- 🛡️ **Sanitized Preview** - Rendered Markdown HTML is sanitized before display

## Getting Started

### Local Preview

1. Clone this repository:
```bash
git clone <your-repo-url>
cd markdowneditor
```

2. Open `index.html` directly in your browser for a quick preview.

### GitHub Pages Deployment

This project is designed to work perfectly with GitHub Pages. Follow these steps:

1. **Push your code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings**
   - Scroll down to **Pages** section
   - Under **Source**, select **main** branch
   - Select **/ (root)** as the folder
   - Click **Save**

3. **Access your site:**
   - Your site will be available at: `https://<your-username>.github.io/<repository-name>/`
   - GitHub Pages may take a few minutes to build and deploy

## Usage

1. **Type Markdown** in the left pane
2. **Preview** appears instantly in the right pane
3. **Use the controls:**
    - **Reset**: Clear and restore default content
    - **Copy**: Copy Markdown to clipboard
    - **Link/Image/Quote**: Insert Markdown snippets at the cursor position
    - **Open**: Load a local Markdown file
    - **Save**: Download current Markdown as a file
   - **Export PDF**: Download rendered content as PDF
   - **Sync scroll**: Keep editor and preview in sync
   - **Dark mode**: Toggle dark theme

## Keyboard Shortcuts

- **Cmd/Ctrl + S**: Save Markdown file
- **Cmd/Ctrl + O**: Open Markdown file
- **Cmd/Ctrl + Shift + S**: Export PDF
- **Cmd/Ctrl + Shift + C**: Copy Markdown
- **Cmd/Ctrl + Shift + K**: Insert link snippet
- **Cmd/Ctrl + Shift + M**: Insert image snippet
- **Cmd/Ctrl + Shift + Q**: Insert quote snippet
- **Cmd/Ctrl + Shift + R**: Reset editor content

## Design System

This project uses a design system inspired by PostHog:

- **Typography**: IBM Plex Sans for UI, Source Code Pro for code
- **Colors**: Carefully selected palette with primary, secondary, and accent colors
- **Spacing**: 8px-based spacing system
- **Components**: Consistent button styles, inputs, and layout patterns

## Technologies Used

- **Marked.js** - Markdown parser
- **Highlight.js** - Syntax highlighting for code blocks
- **jsPDF** - PDF generation
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern styling with CSS variables

## Security Notes

- Runtime dependencies are vendored locally under `assets/vendor` to avoid third-party runtime fetches.
- A Content Security Policy (CSP) is defined via a meta tag in `index.html` for GitHub Pages compatibility.
- UI fonts are self-hosted from pinned package versions under `assets/fonts`, so runtime font requests do not depend on Google Fonts.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for your own purposes!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
