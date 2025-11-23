UNDER CONSTRUCTION - VIBE CODED ATM

# 📚 Bookmark Organizer & Semantic Search

A powerful Chrome/Edge extension built with **TypeScript** and **Svelte 5** that helps you organize, search, and manage your bookmarks with AI-powered descriptions and semantic search capabilities.

## ✨ Features

- **📖 Smart Bookmark Scraping**: Automatically reads and indexes all your existing bookmarks
- **🤖 AI-Powered Descriptions**: Generate intelligent descriptions for bookmarks using OpenAI or Anthropic APIs
- **🔍 Semantic Search**: Find bookmarks by meaning, not just keywords (experimental)
- **📊 Statistics Dashboard**: Track your bookmark collection with detailed statistics
- **⚙️ Flexible Configuration**: Choose your preferred AI provider or use manual descriptions
- **🎨 Modern UI**: Clean, intuitive interface built with Svelte 5 and gradient design
- **💾 Local Storage**: All data stored locally in your browser for privacy
- **🔄 Auto-Sync**: Automatically processes new bookmarks as you save them
- **🔒 Type-Safe**: Built with TypeScript for reliability and better developer experience

## 🏗️ Tech Stack

- **TypeScript**: Type-safe development
- **Svelte 5**: Modern reactive UI framework with runes
- **Vite**: Fast build tool and development server
- **Chrome Extension Manifest V3**: Latest extension standard
- **Chrome APIs**: Bookmarks API, Storage API, Runtime API

## 🚀 Installation

### For Users (Pre-built)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bookmark-organizer.git
   cd bookmark-organizer
   ```

2. **Install dependencies and build**
   ```bash
   npm install
   npm run build
   ```

3. **Load the extension in Chrome/Edge**
   - Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist` directory (not the root!)

4. **Grant permissions**
   - The extension will request permission to access bookmarks and storage
   - Click "Allow" to enable all features

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Chrome or Edge browser

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/bookmark-organizer.git
cd bookmark-organizer

# Install dependencies
npm install

# Build for production
npm run build

# Build in watch mode (auto-rebuild on changes)
npm run dev

# Type checking
npm run type-check

# Svelte check
npm run check

# Run unit tests
npm test

# Run E2E tests (requires build first)
npm run build && npm run test:e2e
```

### Project Structure

```
bookmark-organizer/
├── src/
│   ├── background/
│   │   └── background.ts        # Service worker
│   ├── popup/
│   │   ├── Popup.svelte         # Main popup component
│   │   ├── index.html           # Popup HTML entry
│   │   ├── main.ts              # Popup entry point
│   │   └── popup.css            # Popup styles
│   ├── options/
│   │   ├── Options.svelte       # Settings page component
│   │   ├── index.html           # Options HTML entry
│   │   ├── main.ts              # Options entry point
│   │   └── options.css          # Options styles
│   ├── components/
│   │   ├── BookmarkItem.svelte  # Bookmark display component
│   │   └── Stats.svelte         # Statistics component
│   ├── lib/
│   │   └── semantic-search.ts   # Semantic search implementation
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── public/
│   └── manifest.json            # Extension manifest (copied to dist)
├── dist/                        # Build output (load this in browser)
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── svelte.config.js             # Svelte configuration
└── package.json
```

### Making Changes

1. **Edit source files** in the `src/` directory
2. **Run build** with `npm run build` or `npm run dev` (watch mode)
3. **Reload extension** in Chrome:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the extension card
4. **Test your changes**

### Creating New Components

```typescript
// src/components/MyComponent.svelte
<script lang="ts">
  import type { BookmarkWithEnhanced } from '../types';

  interface Props {
    data: BookmarkWithEnhanced[];
  }

  let { data }: Props = $props();

  // Use Svelte 5 runes
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<div>
  <p>Count: {count}</p>
  <p>Doubled: {doubled}</p>
  <button onclick={() => count++}>Increment</button>
</div>
```

## 🔧 Setup & Configuration

### 1. Initial Setup

After installation, click the extension icon in your browser toolbar to open the popup interface.

### 2. Configure AI Descriptions (Optional)

To enable automatic description generation:

1. Click the extension icon and go to the **Statistics** tab
2. Click **Settings** button
3. Configure your preferences:
   - **AI Provider**: Choose between OpenAI, Anthropic, or None
   - **API Key**: Enter your API key from your chosen provider
   - **Auto-generate**: Toggle automatic description generation

#### Getting API Keys

**OpenAI:**
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste into the extension settings

**Anthropic:**
1. Visit https://console.anthropic.com/
2. Generate an API key
3. Copy and paste into the extension settings

**Note**: API keys are stored locally in your browser and are only sent to the respective AI provider.

### 3. Sync Your Bookmarks

1. Open the extension popup
2. Navigate to the **Statistics** tab
3. Click **Sync All Bookmarks**
4. Wait for the sync to complete

This will process all your existing bookmarks and create enhanced metadata for them.

## 📖 Usage

### Viewing Bookmarks

- **All Bookmarks**: View your complete bookmark collection with descriptions
- **Uncategorized**: See bookmarks that don't have AI-generated descriptions yet
- **Statistics**: View stats and sync information

### Searching Bookmarks

1. Type in the search box at the top of the popup
2. Results appear as you type
3. Click any bookmark to open it in a new tab

### Semantic Search (Experimental)

When enabled, semantic search understands the meaning of your query:

- Instead of "javascript tutorial", try "learn web programming"
- Instead of "recipe website", try "how to cook pasta"

The AI will find relevant bookmarks based on meaning, not just exact keyword matches.

## 🔐 Privacy & Security

- **Local Storage**: All bookmark data and metadata stored locally
- **API Keys**: Stored in browser sync storage, never transmitted except to AI providers
- **No Tracking**: No analytics or data collection
- **Open Source**: Full source code available for inspection
- **Type Safety**: TypeScript ensures code reliability

## 📝 Adding New Features

### Background Script Tasks

Edit `src/background/background.ts` to add new background processing:

```typescript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'myNewAction') {
    // Handle your new action
    myNewFunction().then(sendResponse);
    return true;
  }
});
```

### UI Components

Create new Svelte components in `src/components/`:

```svelte
<script lang="ts">
  // Your component logic
</script>

<div>
  <!-- Your component HTML -->
</div>

<style>
  /* Component-scoped styles */
</style>
```

### Type Definitions

Add new types to `src/types/index.ts`:

```typescript
export interface MyNewType {
  id: string;
  data: string;
}
```

## 🧪 Testing

This project includes comprehensive unit and E2E tests.

### Quick Start

```bash
# Run unit tests
npm test

# Run unit tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run E2E tests (requires build first!)
npm run build && npm run test:e2e

# Run E2E tests with UI mode
npm run test:e2e:ui
```

### Test Coverage

**Unit Tests (Vitest):**
- ✅ Semantic search utilities (cosine similarity, fallback search)
- ✅ HTML escaping and XSS prevention
- ✅ Date formatting and relative time
- ✅ Text truncation and debouncing
- ✅ URL validation and domain extraction
- ✅ Array grouping utilities

**E2E Tests (Playwright):**
- ✅ Extension loading and manifest validation
- ✅ Popup UI rendering and interactions
- ✅ Tab switching functionality
- ✅ Search with debouncing
- ✅ Settings page UI and persistence
- ✅ API key visibility toggle

### Documentation

For detailed testing guide, see [TESTING.md](./TESTING.md)

## 📦 Building for Production

```bash
# Clean build
npm run build

# The dist/ folder contains the complete extension
# Zip it for distribution:
cd dist
zip -r ../bookmark-organizer.zip .
```

## 📝 TODO / Roadmap

- [ ] Add unit tests with Vitest
- [ ] Implement browser-based embeddings (no API required)
- [ ] Add advanced categorization using AI
- [ ] Folder organization suggestions
- [ ] Export/import bookmark collections
- [ ] Tag management system
- [ ] Duplicate bookmark detection
- [ ] Bookmark health check (dead links)
- [ ] Firefox support
- [ ] Dark mode support
- [ ] Custom themes

## 🐛 Known Issues

- **Semantic Search**: Requires transformers.js library integration
- **Rate Limiting**: AI description generation may hit API rate limits with large collections
- **Performance**: Processing thousands of bookmarks may take time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes in the `src/` directory
4. Build and test (`npm run build`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Add types for all new interfaces
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Svelte 5 and TypeScript
- Icons and design inspired by modern UI/UX principles
- Chrome Extension Manifest V3
- Semantic search powered by Transformers.js
- AI descriptions by OpenAI and Anthropic

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Known Issues](#-known-issues) section
2. Review the build output for errors
3. Ensure you're loading the `dist` folder (not root)
4. Search existing GitHub issues
5. Create a new issue with detailed information

## 🌟 Show Your Support

If you find this extension helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📢 Sharing with others
- 🤝 Contributing code

---

**Happy Bookmarking! 📚✨**

Built with ❤️ using TypeScript & Svelte 5
