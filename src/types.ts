/** A single track as stored in hotcan.json (intro is referenced by name, see intros.ts). */
export interface Song {
  artist: string;
  title: string;
  album: string;
  albumURL: string;
  label: string;
  year: string;
}

/** An episode exactly as stored in hotcan.json. `intro` is a string key, not an object. */
export interface RawEpisode {
  number: string;
  title: string;
  date: string;
  filename: string;
  intro: string;
  songs: Song[];
}

/** An episode after derivation: intro resolved to a Song, routing + audio paths added. */
export interface Episode {
  number: number;
  title: string;
  date: string;
  postDate: Date;
  filename: string;
  /** URL slug derived from the title (e.g. "Cold Duck Time" -> "cold-duck-time"). */
  routename: string;
  mp3Path: string;
  oggPath: string;
  /** The intro track, resolved from the intro name key. */
  intro: Song;
  songs: Song[];
}
