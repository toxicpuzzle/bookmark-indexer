<script lang="ts">
  import type { BookmarkWithEnhanced, SyncResult } from '../types';

  interface Props {
    allBookmarks: BookmarkWithEnhanced[];
    loadBookmarks: () => Promise<void>;
  }

  let { allBookmarks, loadBookmarks }: Props = $props();

  let syncing = $state(false);
  let syncStatus = $state<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const total = $derived(allBookmarks.length);
  const withDescriptions = $derived(
    allBookmarks.filter((b) => b.enhanced?.description).length
  );
  const uncategorized = $derived(total - withDescriptions);

  async function syncBookmarks() {
    syncing = true;
    syncStatus = null;

    try {
      const result: SyncResult = await chrome.runtime.sendMessage({
        action: 'syncBookmarks',
      });

      if (result.success) {
        syncStatus = {
          message: `Successfully synced ${result.count} bookmarks!`,
          type: 'success',
        };
        await loadBookmarks();
      } else {
        syncStatus = {
          message: `Error: ${result.error}`,
          type: 'error',
        };
      }
    } catch (error) {
      syncStatus = {
        message: `Error syncing: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
      };
    } finally {
      syncing = false;
    }
  }

  function openSettings() {
    chrome.runtime.openOptionsPage();
  }
</script>

<div class="stats">
  <div class="stat-card">
    <div class="stat-value">{total}</div>
    <div class="stat-label">Total Bookmarks</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">{withDescriptions}</div>
    <div class="stat-label">Enhanced</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">{uncategorized}</div>
    <div class="stat-label">Uncategorized</div>
  </div>
</div>

<div class="actions">
  <button class="btn" onclick={syncBookmarks} disabled={syncing}>
    {syncing ? 'Syncing...' : 'Sync All Bookmarks'}
  </button>
  <button class="btn btn-secondary" onclick={openSettings}>Settings</button>
</div>

{#if syncStatus}
  <div class="alert alert-{syncStatus.type}">
    {syncStatus.message}
  </div>
{/if}

<style>
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 15px;
  }

  .stat-card {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #667eea;
  }

  .stat-label {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }

  .btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;
  }

  .btn:hover:not(:disabled) {
    background: #5568d3;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #e0e0e0;
    color: #333;
  }

  .btn-secondary:hover {
    background: #d0d0d0;
  }

  .alert {
    padding: 12px 16px;
    border-radius: 6px;
    margin-top: 10px;
    font-size: 14px;
  }

  .alert-success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .alert-error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
</style>
