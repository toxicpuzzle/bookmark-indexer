<script lang="ts">
  import type { BookmarkWithEnhanced } from '../types';

  interface Props {
    bookmark: BookmarkWithEnhanced;
    onclick: () => void;
  }

  let { bookmark, onclick }: Props = $props();

  const favicon = $derived(
    bookmark.url
      ? `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`
      : ''
  );

  const description = $derived(
    bookmark.enhanced?.description || 'No description available'
  );
</script>

<div class="bookmark-item" onclick={onclick} role="button" tabindex="0">
  <div class="bookmark-title">
    {#if favicon}
      <img src={favicon} class="favicon" alt="" />
    {/if}
    {bookmark.title || 'Untitled'}
  </div>
  <div class="bookmark-url">{bookmark.url || ''}</div>
  <div class="bookmark-description">{description}</div>
</div>

<style>
  .bookmark-item {
    background: white;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    cursor: pointer;
  }

  .bookmark-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .bookmark-title {
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bookmark-url {
    font-size: 12px;
    color: #999;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bookmark-description {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }

  .favicon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
</style>
