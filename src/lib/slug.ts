/**
 * Convert a string to a URL slug. Faithful port of `transformStringToParameter`
 * from the original AngularJS app (app.js): lowercase, spaces -> dashes, then strip
 * everything except a-z, dashes, commas and digits.
 *
 * Note: commas are intentionally preserved to match the original behavior, so a title
 * containing a comma produces a slug containing a comma.
 */
export function slug(str: string): string {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z\-,0-9]/gi, '');
}
