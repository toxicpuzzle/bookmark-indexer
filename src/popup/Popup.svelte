<script lang="ts">
  import { onMount } from 'svelte';
  import type { BookmarkWithEnhanced } from '../types';
  import BookmarkItem from '../components/BookmarkItem.svelte';
  import Stats from '../components/Stats.svelte';

  let allBookmarks = $state<BookmarkWithEnhanced[]>([]);
  let currentTab = $state<'all' | 'uncategorized' | 'stats'>('all');
  let searchQuery = $state('');
  let searchResults = $state<BookmarkWithEnhanced[] | null>(null);
  let loading = $state(true);
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

  // Use $derived for filtered bookmarks based on current tab
  let filteredBookmarks = $derived<BookmarkWithEnhanced[]>(() => {
    switch (currentTab) {
      case 'all':
        return allBookmarks;
      case 'uncategorized':
        return allBookmarks.filter((b) => !b.enhanced || !b.enhanced.description);
      default:
        return allBookmarks;
    }
  }());

  // Display either search results or filtered bookmarks
  let displayedBookmarks = $derived<BookmarkWithEnhanced[]>(
    searchResults !== null ? searchResults : filteredBookmarks
  );

  // Load bookmarks on mount
  onMount(() => {
    loadBookmarks();
  });

  async function loadBookmarks() {
    try {
      loading = true;
      const response = await chrome.runtime.sendMessage({ action: 'getAllBookmarks' });
      allBookmarks = response || [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      allBookmarks = [];
    } finally {
      loading = false;
    }
  }

  function handleSearchInput() {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // If search is empty, show filtered bookmarks
    if (searchQuery.trim().length === 0) {
      searchResults = null;
      return;
    }

    // If search is too short, don't search yet
    if (searchQuery.trim().length < 2) {
      return;
    }

    // Debounce search
    searchTimeout = setTimeout(() => {
      performSearch();
    }, 300);
  }

  async function performSearch() {
    try {
      const results = await chrome.runtime.sendMessage({
        action: 'searchBookmarks',
        query: searchQuery,
      });
      searchResults = results || [];
    } catch (error) {
      console.error('Search error:', error);
      searchResults = [];
    }
  }

  function switchTab(tab: 'all' | 'uncategorized' | 'stats') {
    currentTab = tab;
    searchQuery = '';
    searchResults = null;
  }

  function handleBookmarkClick(bookmark: BookmarkWithEnhanced) {
    if (bookmark.url) {
      chrome.tabs.create({ url: bookmark.url });
    }
  }
</script>

<div class="container">
  <div class="header">
    <h1>📚 Bookmark Organizer</h1>
    <div class="search-box">
      <input
        type="text"
        bind:value={searchQuery}
        oninput={handleSearchInput}
        placeholder="Search bookmarks..."
      />
    </div>
  </div>

  <div class="tabs">
    <button
      class="tab"
      class:active={currentTab === 'all'}
      onclick={() => switchTab('all')}
    >
      All Bookmarks
    </button>
    <button
      class="tab"
      class:active={currentTab === 'uncategorized'}
      onclick={() => switchTab('uncategorized')}
    >
      Uncategorized
    </button>
    <button
      class="tab"
      class:active={currentTab === 'stats'}
      onclick={() => switchTab('stats')}
    >
      Statistics
    </button>
  </div>

  <div class="content">
    {#if loading}
      <div class="loading">Loading bookmarks...</div>
    {:else if currentTab === 'stats'}
      <Stats {allBookmarks} {loadBookmarks} />
    {:else if displayedBookmarks.length === 0}
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>No bookmarks found</p>
      </div>
    {:else}
      {#each displayedBookmarks as bookmark (bookmark.id)}
        <BookmarkItem {bookmark} onclick={() => handleBookmarkClick(bookmark)} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .container {
    width: 600px;
    height: 500px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
  }

  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .header h1 {
    font-size: 20px;
    margin: 0 0 10px 0;
  }

  .search-box {
    position: relative;
  }

  .search-box input {
    width: 100%;
    padding: 10px 40px 10px 15px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
  }

  .search-box::after {
    content: '🔍';
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }

  .tabs {
    display: flex;
    background: white;
    border-bottom: 1px solid #e0e0e0;
  }

  .tab {
    flex: 1;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 14px;
    color: #666;
    transition: all 0.3s;
  }

  .tab.active {
    color: #667eea;
    border-bottom: 2px solid #667eea;
  }

  .tab:hover {
    background: #f9f9f9;
  }

  .content {
    padding: 15px;
    flex: 1;
    overflow-y: auto;
  }

  .loading,
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
  }

  .empty-state-icon {
    font-size: 48px;
    margin-bottom: 15px;
  }

  .empty-state p {
    color: #999;
    margin: 0;
  }
</style>
