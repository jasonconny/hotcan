import type { Episode, RawEpisode } from '../types';
import { slug } from '../lib/slug';
import { getIntro } from './intros';
import rawData from './hotcan.json';

/**
 * The full episode list, derived once at module load from hotcan.json and sorted by
 * episode number ascending (so array index === number - 1, matching the original app's
 * prev/next navigation).
 */
export const episodes: Episode[] = (rawData as RawEpisode[])
  .map((raw): Episode => ({
    number: parseInt(raw.number, 10),
    title: raw.title,
    date: raw.date,
    postDate: new Date(raw.date),
    filename: raw.filename,
    routename: slug(raw.title),
    mp3Path: `/_res/audio/mp3/${raw.filename}.mp3`,
    oggPath: `/_res/audio/ogg/${raw.filename}.ogg`,
    intro: getIntro(raw.intro),
    songs: raw.songs,
  }))
  .sort((a, b) => a.number - b.number);

const byRoutename = new Map(episodes.map((e) => [e.routename, e]));

/** Look up an episode by its URL slug, or undefined if no match. */
export function getEpisodeByRoutename(routename: string): Episode | undefined {
  return byRoutename.get(routename);
}
