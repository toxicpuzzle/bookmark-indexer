import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  escapeHtml,
  formatDate,
  formatRelativeTime,
  truncate,
  debounce,
  getDomain,
  isValidUrl,
  groupBy,
} from './utils';

describe('Utils', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const output = escapeHtml(input);
      expect(output).not.toContain('<script>');
      expect(output).toContain('&lt;script&gt;');
    });

    it('should handle quotes', () => {
      const input = 'He said "hello"';
      const output = escapeHtml(input);
      expect(output).toContain('&quot;');
    });

    it('should return same string for safe text', () => {
      const input = 'Hello World';
      const output = escapeHtml(input);
      expect(output).toBe('Hello World');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const formatted = formatDate(timestamp);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "Just now" for recent timestamps', () => {
      const now = Date.now();
      const result = formatRelativeTime(now);
      expect(result).toBe('Just now');
    });

    it('should return minutes ago', () => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toBe('5 minutes ago');
    });

    it('should return hours ago', () => {
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
      const result = formatRelativeTime(twoHoursAgo);
      expect(result).toBe('2 hours ago');
    });

    it('should return days ago', () => {
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
      const result = formatRelativeTime(threeDaysAgo);
      expect(result).toBe('3 days ago');
    });

    it('should handle singular forms', () => {
      const oneHourAgo = Date.now() - 1 * 60 * 60 * 1000;
      const result = formatRelativeTime(oneHourAgo);
      expect(result).toBe('1 hour ago');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncate(text, 20);
      expect(result).toHaveLength(20);
      expect(result).toContain('...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      const result = truncate(text, 20);
      expect(result).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = '12345678901234567890';
      const result = truncate(text, 20);
      expect(result).toBe(text);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should debounce function calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('arg1', 'arg2');

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('getDomain', () => {
    it('should extract domain from URL', () => {
      const url = 'https://www.example.com/path/to/page';
      const domain = getDomain(url);
      expect(domain).toBe('www.example.com');
    });

    it('should handle URLs without www', () => {
      const url = 'https://example.com';
      const domain = getDomain(url);
      expect(domain).toBe('example.com');
    });

    it('should return empty string for invalid URL', () => {
      const url = 'not a url';
      const domain = getDomain(url);
      expect(domain).toBe('');
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('groupBy', () => {
    it('should group items by key', () => {
      const items = [
        { name: 'apple', type: 'fruit' },
        { name: 'banana', type: 'fruit' },
        { name: 'carrot', type: 'vegetable' },
      ];

      const grouped = groupBy(items, (item) => item.type);

      expect(grouped).toHaveProperty('fruit');
      expect(grouped).toHaveProperty('vegetable');
      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
    });

    it('should handle empty array', () => {
      const grouped = groupBy([], (item: any) => item.key);
      expect(grouped).toEqual({});
    });

    it('should handle single group', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const grouped = groupBy(items, () => 'same');
      expect(Object.keys(grouped)).toHaveLength(1);
      expect(grouped.same).toHaveLength(2);
    });
  });
});
