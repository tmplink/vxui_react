import { cx } from '../../lib/cx';

describe('cx', () => {
  it('joins multiple class names', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c');
  });

  it('filters out falsy values', () => {
    expect(cx('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns empty string with no truthy values', () => {
    expect(cx(false, null, undefined)).toBe('');
  });

  it('returns single class', () => {
    expect(cx('foo')).toBe('foo');
  });

  it('handles empty call', () => {
    expect(cx()).toBe('');
  });

  it('does not include empty string', () => {
    // empty string is falsy – filtered out
    expect(cx('a', '' as any, 'b')).toBe('a b');
  });
});
