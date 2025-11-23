// Semantic search implementation using local embeddings
import type { BookmarkWithEnhanced } from '../types';

export class SemanticSearch {
  private model: any = null;
  private initialized: boolean = false;

  // Initialize the semantic search model
  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      console.log('Initializing semantic search...');

      // Check if transformers.js is available
      // @ts-ignore - Dynamic import from CDN
      if (typeof transformers === 'undefined') {
        console.warn('Transformers.js not loaded, semantic search unavailable');
        return false;
      }

      // Load a lightweight embedding model
      // Using all-MiniLM-L6-v2 for fast, efficient embeddings
      // @ts-ignore - Dynamic import
      const { pipeline } = transformers;
      this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

      this.initialized = true;
      console.log('Semantic search initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing semantic search:', error);
      return false;
    }
  }

  // Generate embedding for text
  async embed(text: string): Promise<number[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.model) {
      throw new Error('Semantic search model not available');
    }

    try {
      const output = await this.model(text, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  // Calculate cosine similarity between two embeddings
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Search bookmarks using semantic similarity
  async search(
    query: string,
    bookmarks: BookmarkWithEnhanced[],
    topK: number = 10
  ): Promise<BookmarkWithEnhanced[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.model) {
      // Fallback to simple text search
      return this.fallbackSearch(query, bookmarks, topK);
    }

    try {
      // Generate embedding for query
      const queryEmbedding = await this.embed(query);

      // Calculate similarity for each bookmark
      const results: Array<{ bookmark: BookmarkWithEnhanced; similarity: number }> = [];

      for (const bookmark of bookmarks) {
        // Create searchable text from bookmark
        const searchText = [
          bookmark.title || '',
          bookmark.enhanced?.description || '',
          bookmark.url || '',
        ].join(' ');

        // Generate embedding for bookmark if not cached
        let bookmarkEmbedding: number[];
        if (bookmark.enhanced?.embedding) {
          bookmarkEmbedding = bookmark.enhanced.embedding;
        } else {
          bookmarkEmbedding = await this.embed(searchText);

          // Cache the embedding
          if (bookmark.enhanced) {
            bookmark.enhanced.embedding = bookmarkEmbedding;
            const key = `bookmark_${bookmark.id}`;
            await chrome.storage.local.set({ [key]: bookmark.enhanced });
          }
        }

        // Calculate similarity
        const similarity = this.cosineSimilarity(queryEmbedding, bookmarkEmbedding);

        results.push({
          bookmark,
          similarity,
        });
      }

      // Sort by similarity and return top K
      results.sort((a, b) => b.similarity - a.similarity);
      return results.slice(0, topK).map((r) => r.bookmark);
    } catch (error) {
      console.error('Error in semantic search:', error);
      return this.fallbackSearch(query, bookmarks, topK);
    }
  }

  // Fallback to simple text search
  private fallbackSearch(
    query: string,
    bookmarks: BookmarkWithEnhanced[],
    topK: number
  ): BookmarkWithEnhanced[] {
    const lowerQuery = query.toLowerCase();

    const results = bookmarks.filter((bookmark) => {
      const title = (bookmark.title || '').toLowerCase();
      const url = (bookmark.url || '').toLowerCase();
      const description = (bookmark.enhanced?.description || '').toLowerCase();

      return (
        title.includes(lowerQuery) ||
        url.includes(lowerQuery) ||
        description.includes(lowerQuery)
      );
    });

    return results.slice(0, topK);
  }

  // Batch generate embeddings for multiple bookmarks
  async batchEmbed(
    bookmarks: BookmarkWithEnhanced[],
    progressCallback?: (processed: number, total: number) => void
  ): Promise<Array<{ id: string; embedding: number[] }>> {
    const results: Array<{ id: string; embedding: number[] }> = [];
    let processed = 0;

    for (const bookmark of bookmarks) {
      try {
        const searchText = [
          bookmark.title || '',
          bookmark.enhanced?.description || '',
          bookmark.url || '',
        ].join(' ');

        const embedding = await this.embed(searchText);

        // Store embedding
        if (bookmark.enhanced) {
          bookmark.enhanced.embedding = embedding;
          const key = `bookmark_${bookmark.id}`;
          await chrome.storage.local.set({ [key]: bookmark.enhanced });
        }

        results.push({ id: bookmark.id, embedding });
        processed++;

        if (progressCallback) {
          progressCallback(processed, bookmarks.length);
        }
      } catch (error) {
        console.error(`Error embedding bookmark ${bookmark.id}:`, error);
      }
    }

    return results;
  }
}
