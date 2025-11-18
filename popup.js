// Popup script for bookmark organizer
let allBookmarks = [];
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup loaded');

  // Set up tab switching
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      renderContent();
    });
  });

  // Set up search
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', handleSearch);

  // Load bookmarks
  await loadBookmarks();
  renderContent();
});

async function loadBookmarks() {
  try {
    showLoading();
    const response = await chrome.runtime.sendMessage({ action: 'getAllBookmarks' });
    allBookmarks = response || [];
    console.log('Loaded bookmarks:', allBookmarks.length);
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    allBookmarks = [];
  }
}

async function handleSearch(e) {
  const query = e.target.value.trim();

  if (query.length === 0) {
    renderContent();
    return;
  }

  if (query.length < 2) return;

  try {
    const results = await chrome.runtime.sendMessage({
      action: 'searchBookmarks',
      query: query
    });

    renderBookmarks(results);
  } catch (error) {
    console.error('Search error:', error);
  }
}

function renderContent() {
  const content = document.getElementById('tabContent');

  switch (currentTab) {
    case 'all':
      renderBookmarks(allBookmarks);
      break;
    case 'uncategorized':
      const uncategorized = allBookmarks.filter(b => !b.enhanced || !b.enhanced.description);
      renderBookmarks(uncategorized);
      break;
    case 'stats':
      renderStats();
      break;
  }
}

function renderBookmarks(bookmarks) {
  const content = document.getElementById('tabContent');

  if (bookmarks.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>No bookmarks found</p>
      </div>
    `;
    return;
  }

  const html = bookmarks.map(bookmark => {
    const enhanced = bookmark.enhanced || {};
    const description = enhanced.description || 'No description available';
    const favicon = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`;

    return `
      <div class="bookmark-item" data-id="${bookmark.id}">
        <div class="bookmark-title">
          <img src="${favicon}" class="favicon" alt="">
          ${escapeHtml(bookmark.title || 'Untitled')}
        </div>
        <div class="bookmark-url">${escapeHtml(bookmark.url)}</div>
        <div class="bookmark-description">${escapeHtml(description)}</div>
      </div>
    `;
  }).join('');

  content.innerHTML = html;

  // Add click handlers
  document.querySelectorAll('.bookmark-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const id = item.dataset.id;
      const bookmark = bookmarks.find(b => b.id === id);
      if (bookmark) {
        chrome.tabs.create({ url: bookmark.url });
      }
    });
  });
}

function renderStats() {
  const content = document.getElementById('tabContent');

  const total = allBookmarks.length;
  const withDescriptions = allBookmarks.filter(b => b.enhanced?.description).length;
  const uncategorized = total - withDescriptions;

  content.innerHTML = `
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${total}</div>
        <div class="stat-label">Total Bookmarks</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${withDescriptions}</div>
        <div class="stat-label">Enhanced</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${uncategorized}</div>
        <div class="stat-label">Uncategorized</div>
      </div>
    </div>

    <div class="actions">
      <button class="btn" id="syncBtn">Sync All Bookmarks</button>
      <button class="btn btn-secondary" id="optionsBtn">Settings</button>
    </div>

    <div id="syncStatus"></div>
  `;

  document.getElementById('syncBtn').addEventListener('click', syncBookmarks);
  document.getElementById('optionsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

async function syncBookmarks() {
  const statusDiv = document.getElementById('syncStatus');
  statusDiv.innerHTML = '<div class="loading">Syncing bookmarks...</div>';

  try {
    const result = await chrome.runtime.sendMessage({ action: 'syncBookmarks' });

    if (result.success) {
      statusDiv.innerHTML = `
        <div style="background: #d4edda; color: #155724; padding: 10px; border-radius: 6px; margin-top: 10px;">
          Successfully synced ${result.count} bookmarks!
        </div>
      `;

      // Reload bookmarks
      await loadBookmarks();
      renderStats();
    } else {
      statusDiv.innerHTML = `
        <div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 6px; margin-top: 10px;">
          Error: ${result.error}
        </div>
      `;
    }
  } catch (error) {
    statusDiv.innerHTML = `
      <div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 6px; margin-top: 10px;">
        Error syncing: ${error.message}
      </div>
    `;
  }
}

function showLoading() {
  const content = document.getElementById('tabContent');
  content.innerHTML = '<div class="loading">Loading bookmarks...</div>';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
