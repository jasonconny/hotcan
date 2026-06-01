/**
 * Redirects for legacy WordPress URLs from the old hotcan.info site. Faithful port of the
 * `$urlRouterProvider.when(...)` rules and the general `/podcast/` rewrite in the original
 * AngularJS app (app.js). Old inbound links and search results still use these paths.
 */

/**
 * Explicitly mapped legacy paths whose trailing slug differs from (or is missing relative
 * to) the episode's derived routename, so the general rule below can't recover them.
 */
const EXPLICIT: Record<string, string> = {
  '/category/podcast': '/all',
  '/podcast/the-hot-can-all-vinyl-power-hour-episode-1': '/beginnings',
  '/podcast/the-hot-can-all-vinyl-power-hour-episode-2': '/groove-and-move',
  '/podcast/the-hot-can-all-vinyl-power-hour-episode-4': '/y-sharp',
  '/podcast/the-hot-can-all-vinyl-power-hour-episode-7': '/funky-doo',
  '/podcast/the-hot-can-all-vinyl-power-hour-episode-10': '/lotus-flower',
  '/podcast/the-hot-can-all-vinyl-power-hour-episode-11': '/do-your-thing',
  '/podcast/the-hot-can-all-vinyl-power-hour-episode-12': '/open-country-joy',
  '/podcast/the-hot-can-all-vinyl-power-hour-episode-35': '/cold-duck-time',
  '/podcast/the-hot-can-all-vinyl-power-hour-episode-100--never-ending-melody':
    '/never-ending-melody',
};

/**
 * Resolve a legacy pathname to its modern target, or null if it isn't a legacy URL.
 *
 * For a generic `/podcast/the-hot-can-all-vinyl-power-hour-episode-<n>-<slug>` URL, the
 * original app sliced the fixed prefix off to recover the episode slug. The prefix
 * "the-hot-can-all-vinyl-power-hour-episode-" is 41 chars; add the episode number's digits
 * plus the separating dash (43 for a single digit, 44 for two+ digits).
 */
export function resolveLegacyPath(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path in EXPLICIT) return EXPLICIT[path];

  if (path.includes('/podcast/')) {
    const segment = path.split('/')[2] ?? '';
    const episodeNumber = segment.split('-')[8];
    const sliceAt = Number(episodeNumber) > 9 ? 44 : 43;
    const slug = segment.slice(sliceAt);
    return slug ? `/${slug}` : '/';
  }

  return null;
}
