import { Fragment, type ReactNode } from 'react';

/** Escape regex metacharacters so a raw search term is matched literally. */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlight case-insensitive occurrences of `phrase` within `text`, wrapping matches in
 * <mark className="highlighted">. Replaces the original app's HighlightFilter, which used
 * dangerouslySetInnerHTML; this returns React nodes instead (no raw HTML injection).
 */
export function highlight(text: string, phrase: string): ReactNode {
  if (!phrase) return text;

  const re = new RegExp(`(${escapeRegExp(phrase)})`, 'gi');
  const parts = text.split(re);

  return parts.map((part, i) =>
    // Odd-indexed parts are the captured matches.
    i % 2 === 1 ? (
      <mark className="highlighted" key={i}>
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
