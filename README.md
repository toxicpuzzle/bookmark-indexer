# 📚 Bookmark Organizer & Semantic Search

A powerful Chrome/Edge extension that helps you organize, search, and manage your bookmarks with AI-powered descriptions and semantic search capabilities.

## ✨ Features

- **📖 Smart Bookmark Scraping**: Automatically reads and indexes all your existing bookmarks
- **🤖 AI-Powered Descriptions**: Generate intelligent descriptions for bookmarks using OpenAI or Anthropic APIs
- **🔍 Semantic Search**: Find bookmarks by meaning, not just keywords (experimental)
- **📊 Statistics Dashboard**: Track your bookmark collection with detailed statistics
- **⚙️ Flexible Configuration**: Choose your preferred AI provider or use manual descriptions
- **🎨 Modern UI**: Clean, intuitive interface with gradient design
- **💾 Local Storage**: All data stored locally in your browser for privacy
- **🔄 Auto-Sync**: Automatically processes new bookmarks as you save them

## 🚀 Installation

### Chrome/Edge (Developer Mode)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/bookmark-organizer.git
   cd bookmark-organizer
   ```

2. **Install dependencies (optional, for development)**
   ```bash
   npm install
   ```

3. **Load the extension in Chrome/Edge**
   - Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `bookmark-organizer` directory

4. **Grant permissions**
   - The extension will request permission to access bookmarks and storage
   - Click "Allow" to enable all features

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

## 🏗️ Architecture

### File Structure

```
bookmark-organizer/
├── manifest.json           # Extension configuration
├── background.js           # Service worker for bookmark processing
├── popup.html             # Main popup interface
├── popup.js               # Popup logic and UI handling
├── options.html           # Settings page
├── options.js             # Settings page logic
├── semantic-search.js     # Semantic search implementation
├── package.json           # NPM dependencies
├── icons/                 # Extension icons
│   ├── icon16.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md
```

### Key Technologies

- **Manifest V3**: Latest Chrome extension standard
- **Chrome Bookmarks API**: Native bookmark access
- **Chrome Storage API**: Local and sync storage
- **Transformers.js**: Browser-based ML for semantic search (optional)
- **OpenAI/Anthropic APIs**: AI description generation

## 🔐 Privacy & Security

- **Local Storage**: All bookmark data and metadata stored locally
- **API Keys**: Stored in browser sync storage, never transmitted except to AI providers
- **No Tracking**: No analytics or data collection
- **Open Source**: Full source code available for inspection

## 🛠️ Development

### Prerequisites

- Node.js 16+ (for development dependencies)
- Chrome or Edge browser

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/bookmark-organizer.git
cd bookmark-organizer

# Install dependencies
npm install

# Build CSS (if using Tailwind)
npm run build:css

# Watch for changes
npm run watch:css
```

### Testing

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Adding New Features

The extension is designed to be modular:

- **Background Tasks**: Add to `background.js`
- **UI Components**: Modify `popup.html` and `popup.js`
- **Settings**: Update `options.html` and `options.js`
- **Search Logic**: Enhance `semantic-search.js`

## 📝 TODO / Roadmap

- [ ] Convert SVG icons to PNG format for better compatibility
- [ ] Implement advanced categorization using AI
- [ ] Add folder organization suggestions
- [ ] Export/import bookmark collections
- [ ] Tag management system
- [ ] Duplicate bookmark detection
- [ ] Bookmark health check (dead links)
- [ ] Firefox support
- [ ] Dark mode support
- [ ] Custom themes
- [ ] Browser-based embeddings (no API required)
- [ ] Collaborative bookmark collections

## 🐛 Known Issues

- **Icon Format**: Currently using SVG icons; Chrome prefers PNG format
- **Semantic Search**: Requires transformers.js library (not yet integrated)
- **Rate Limiting**: AI description generation may hit API rate limits with large collections
- **Performance**: Processing thousands of bookmarks may take time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons and design inspired by modern UI/UX principles
- Built with Chrome Extension Manifest V3
- Semantic search powered by Transformers.js
- AI descriptions by OpenAI and Anthropic

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Known Issues](#-known-issues) section
2. Search existing GitHub issues
3. Create a new issue with detailed information

## 🌟 Show Your Support

If you find this extension helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📢 Sharing with others

---

**Happy Bookmarking! 📚✨**
