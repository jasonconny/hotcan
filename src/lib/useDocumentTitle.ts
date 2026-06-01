import { useEffect } from 'react';

const BASE_TITLE = 'The Hot Can All Vinyl Power Hour';

/** Set document.title to `<title> | Hot Can` for the duration of the page, for a11y/tabs. */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
}
