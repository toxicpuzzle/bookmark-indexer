# Known Limitations

This document outlines the current limitations and areas for improvement in the Bookmark Organizer extension.

## 🚧 Technical Limitations

### 1. Semantic Search Not Fully Implemented
- **Status**: Placeholder only
- **Issue**: Transformers.js is declared as a dependency but not actually integrated
- **Impact**: Search is currently text-based only, not truly semantic
- **Workaround**: Use keyword-based search
- **TODO**: Integrate @xenova/transformers and implement browser-based embeddings

### 2. AI Description Generation Requires External APIs
- **Status**: Requires API keys
- **Issue**: Depends on OpenAI or Anthropic API (costs money)
- **Impact**: Users need to provide their own API keys
- **Workaround**: Manual descriptions or no descriptions
- **TODO**: Consider adding free alternatives or local models

### 3. No Rate Limiting Protection
- **Status**: Missing
- **Issue**: No throttling for API calls when generating descriptions
- **Impact**: Could hit API rate limits with large bookmark collections
- **Risk**: API costs could spike unexpectedly
- **TODO**: Add rate limiting and batch processing with delays

### 4. No Pagination
- **Status**: Missing
- **Issue**: All bookmarks loaded at once
- **Impact**: Performance issues with 1000+ bookmarks
- **Memory**: Could cause high memory usage
- **TODO**: Implement virtual scrolling or pagination

### 5. No Offline Support
- **Status**: Partial
- **Issue**: Search requires background script communication
- **Impact**: May not work if service worker is inactive
- **TODO**: Consider indexedDB caching

### 6. No Data Backup/Export
- **Status**: Missing
- **Issue**: No way to backup enhanced bookmark data
- **Impact**: Data loss if extension is uninstalled
- **TODO**: Add export to JSON functionality

### 7. Cross-Origin Fetch Limitations
- **Status**: Known issue
- **Issue**: Cannot fetch page content from many sites due to CORS
- **Impact**: AI description generation may fail for many bookmarks
- **Workaround**: Use title and URL only
- **TODO**: Consider using content scripts to extract page content

### 8. No Duplicate Detection
- **Status**: Missing
- **Issue**: Same URL can be bookmarked multiple times
- **Impact**: Cluttered bookmark list
- **TODO**: Add duplicate detection and merging

### 9. No Dead Link Checking
- **Status**: Missing
- **Issue**: No validation of bookmark URLs
- **Impact**: Broken bookmarks remain unnoticed
- **TODO**: Add periodic link validation

### 10. Icon Format
- **Status**: Using SVG
- **Issue**: Chrome prefers PNG for extension icons
- **Impact**: Icons may not display correctly in some contexts
- **TODO**: Convert SVG icons to PNG

## 🔐 Privacy & Security Limitations

### 1. API Keys Stored in Sync Storage
- **Status**: Encrypted by browser
- **Issue**: API keys stored in Chrome sync storage
- **Impact**: Keys synced across devices (could be a privacy concern)
- **Mitigation**: Chrome encrypts sync data
- **TODO**: Add option to use local storage only

### 2. Full Page Content Fetch
- **Status**: Required for AI descriptions
- **Issue**: Fetches entire page HTML
- **Impact**: Privacy concern - pages are sent to AI providers
- **Mitigation**: User must opt-in with API key
- **TODO**: Add clear privacy warnings

## 📊 Performance Limitations

### 1. No Caching for AI Responses
- **Status**: Missing
- **Issue**: Same page fetched multiple times if description generation fails
- **Impact**: Unnecessary API costs and delays
- **TODO**: Add response caching

### 2. Blocking Operations
- **Status**: Some operations block
- **Issue**: Sync all bookmarks is synchronous
- **Impact**: UI freezes during bulk operations
- **TODO**: Add progress indicators and chunked processing

### 3. No Database Indexes
- **Status**: Using chrome.storage
- **Issue**: chrome.storage.local has no indexes
- **Impact**: Slow search with many bookmarks
- **TODO**: Consider IndexedDB for better performance

## 🎨 UI/UX Limitations

### 1. No Dark Mode
- **Status**: Missing
- **Issue**: Light theme only
- **Impact**: Poor UX for dark mode users
- **TODO**: Add dark mode support

### 2. Fixed Popup Size
- **Status**: 600x500px
- **Issue**: Cannot resize popup
- **Impact**: Limited viewport for large collections
- **TODO**: Consider making popup resizable or add full-page view

### 3. No Keyboard Shortcuts
- **Status**: Missing
- **Issue**: No keyboard navigation
- **Impact**: Accessibility concern
- **TODO**: Add keyboard shortcuts for common actions

### 4. No Bookmark Folders Support
- **Status**: Partial
- **Issue**: Folders are read but not displayed hierarchically
- **Impact**: Loses folder organization
- **TODO**: Add folder tree view

## 🧪 Testing Limitations

### 1. No Automated Tests (Until Now)
- **Status**: Being addressed
- **Issue**: No unit or integration tests
- **Impact**: Regression risks
- **TODO**: Add Vitest and Playwright tests (in progress)

### 2. No Type Checking in Build
- **Status**: Partial
- **Issue**: Build doesn't fail on type errors
- **Impact**: Type errors might slip through
- **TODO**: Add type checking to build process

## 🌐 Browser Compatibility

### 1. Chrome/Edge Only
- **Status**: Chrome Manifest V3
- **Issue**: Not compatible with Firefox
- **Impact**: Limited browser support
- **TODO**: Add Firefox support (Manifest V2)

### 2. No Safari Support
- **Status**: Not supported
- **Issue**: Safari has different extension system
- **Impact**: Apple users cannot use extension
- **TODO**: Consider Safari version

## 📦 Build & Development Limitations

### 1. No Hot Module Reload for Extension
- **Status**: Build-only
- **Issue**: Must rebuild and reload extension for each change
- **Impact**: Slower development workflow
- **Workaround**: Use `npm run dev` for auto-rebuild
- **Limitation**: Still need to manually reload extension

### 2. No Source Maps in Production
- **Status**: Missing
- **Issue**: Debugging production builds is harder
- **Impact**: Harder to diagnose user issues
- **TODO**: Add source maps option

## 🔄 Data Sync Limitations

### 1. No Conflict Resolution
- **Status**: Missing
- **Issue**: No handling of sync conflicts across devices
- **Impact**: Data might be overwritten
- **TODO**: Add conflict resolution strategy

### 2. Storage Quota Limits
- **Status**: Subject to Chrome limits
- **Issue**: chrome.storage.local has quota limits (~10MB)
- **Impact**: Cannot store embeddings for very large collections
- **TODO**: Add storage quota monitoring

## 🎯 Feature Gaps

### 1. No Tagging System
- **Status**: Schema exists but not implemented
- **Issue**: Tags array exists but no UI to manage tags
- **Impact**: Cannot categorize bookmarks manually
- **TODO**: Add tag management UI

### 2. No Smart Categorization
- **Status**: Missing
- **Issue**: No automatic categorization
- **Impact**: All organization is manual
- **TODO**: Use AI to suggest categories

### 3. No Sharing/Collaboration
- **Status**: Missing
- **Issue**: Cannot share bookmark collections
- **Impact**: Each user works in isolation
- **TODO**: Add export/import functionality at minimum

### 4. No Statistics/Analytics
- **Status**: Basic stats only
- **Issue**: No insights into bookmark usage
- **Impact**: Cannot identify most/least used bookmarks
- **TODO**: Add bookmark access tracking

## 📝 Documentation Limitations

### 1. No API Documentation
- **Status**: Missing
- **Issue**: No JSDoc or API reference
- **Impact**: Harder for contributors to understand code
- **TODO**: Add comprehensive JSDoc comments

### 2. No User Guide
- **Status**: Basic README only
- **Issue**: No detailed user documentation
- **Impact**: Users might miss features
- **TODO**: Create user guide with screenshots

## Priority Rankings

### High Priority (Should Fix Soon)
1. Add semantic search implementation
2. Add rate limiting for API calls
3. Add tests (in progress)
4. Add pagination or virtual scrolling
5. Add proper error handling

### Medium Priority
1. Add dark mode
2. Add keyboard shortcuts
3. Add folder hierarchy view
4. Add duplicate detection
5. Add data export/backup

### Low Priority (Nice to Have)
1. Firefox/Safari support
2. Dead link checking
3. Sharing/collaboration
4. Advanced analytics
5. Custom themes

## Workarounds for Known Issues

### Working with Large Collections
- Sync bookmarks in batches manually
- Don't enable auto-description generation for all bookmarks
- Use folder organization before syncing

### API Rate Limits
- Use a slower sync process (manually sync folders one at a time)
- Only generate descriptions for important bookmarks
- Consider using cheaper API tiers

### Memory Issues
- Close and reopen popup periodically
- Use browser's task manager to monitor memory
- Consider splitting bookmarks into multiple folders

## Contributing

If you'd like to help address any of these limitations, please see CONTRIBUTING.md (TODO) or open an issue on GitHub to discuss your approach.
