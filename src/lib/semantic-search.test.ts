import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SemanticSearch } from './semantic-search';
import type { BookmarkWithEnhanced } from '../types';

// Mock chrome API
global.chrome = {
  storage: {
    local: {
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue({}),
    },
  },
} as any;

describe('SemanticSearch', () => {
  let semanticSearch: SemanticSearch;

  beforeEach(() => {
    semanticSearch = new SemanticSearch();
  });

  describe('cosineSimilarity', () => {
    it('should return 1 for identical vectors', () => {
      const vector = [1, 2, 3, 4];
      const similarity = semanticSearch.cosineSimilarity(vector, vector);
      expect(similarity).toBe(1);
    });

    it('should return 0 for orthogonal vectors', () => {
      const vector1 = [1, 0];
      const vector2 = [0, 1];
      const similarity = semanticSearch.cosineSimilarity(vector1, vector2);
      expect(similarity).toBe(0);
    });

    it('should return -1 for opposite vectors', () => {
      const vector1 = [1, 2, 3];
      const vector2 = [-1, -2, -3];
      const similarity = semanticSearch.cosineSimilarity(vector1, vector2);
      expect(similarity).toBe(-1);
    });

    it('should throw error for vectors of different lengths', () => {
      const vector1 = [1, 2, 3];
      const vector2 = [1, 2];
      expect(() => semanticSearch.cosineSimilarity(vector1, vector2)).toThrow(
        'Embeddings must have the same length'
      );
    });

    it('should handle normalized vectors correctly', () => {
      // Normalized vectors at 60 degrees should have similarity of 0.5
      const vector1 = [1, 0];
      const vector2 = [0.5, Math.sqrt(3) / 2];
      const similarity = semanticSearch.cosineSimilarity(vector1, vector2);
      expect(similarity).toBeCloseTo(0.5, 5);
    });
  });

  describe('fallbackSearch', () => {
    const mockBookmarks: BookmarkWithEnhanced[] = [
      {
        id: '1',
        title: 'JavaScript Tutorial',
        url: 'https://example.com/js',
        enhanced: {
          id: '1',
          url: 'https://example.com/js',
          title: 'JavaScript Tutorial',
          dateAdded: Date.now(),
          description: 'Learn JavaScript programming',
          tags: [],
          category: '',
          embedding: null,
          lastProcessed: Date.now(),
        },
      },
      {
        id: '2',
        title: 'Python Guide',
        url: 'https://example.com/python',
        enhanced: {
          id: '2',
          url: 'https://example.com/python',
          title: 'Python Guide',
          dateAdded: Date.now(),
          description: 'Learn Python programming',
          tags: [],
          category: '',
          embedding: null,
          lastProcessed: Date.now(),
        },
      },
      {
        id: '3',
        title: 'TypeScript Docs',
        url: 'https://example.com/ts',
        enhanced: null,
      },
    ];

    it('should find bookmarks by title', () => {
      const results = (semanticSearch as any).fallbackSearch(
        'javascript',
        mockBookmarks,
        10
      );
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript Tutorial');
    });

    it('should find bookmarks by URL', () => {
      const results = (semanticSearch as any).fallbackSearch(
        'python',
        mockBookmarks,
        10
      );
      expect(results).toHaveLength(1);
      expect(results[0].url).toContain('python');
    });

    it('should find bookmarks by description', () => {
      const results = (semanticSearch as any).fallbackSearch(
        'programming',
        mockBookmarks,
        10
      );
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('should be case insensitive', () => {
      const results = (semanticSearch as any).fallbackSearch(
        'JAVASCRIPT',
        mockBookmarks,
        10
      );
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript Tutorial');
    });

    it('should respect topK limit', () => {
      const results = (semanticSearch as any).fallbackSearch(
        'programming',
        mockBookmarks,
        1
      );
      expect(results).toHaveLength(1);
    });

    it('should return empty array for no matches', () => {
      const results = (semanticSearch as any).fallbackSearch(
        'rust',
        mockBookmarks,
        10
      );
      expect(results).toHaveLength(0);
    });
  });

  describe('initialize', () => {
    it('should return true if already initialized', async () => {
      (semanticSearch as any).initialized = true;
      const result = await semanticSearch.initialize();
      expect(result).toBe(true);
    });

    it('should return false if transformers.js is not available', async () => {
      const result = await semanticSearch.initialize();
      expect(result).toBe(false);
    });
  });
});
