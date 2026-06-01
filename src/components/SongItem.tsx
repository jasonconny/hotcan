import type { ReactNode } from 'react';
import type { Song } from '../types';
import { highlight } from '../lib/highlight';

interface SongItemProps {
  song: Song;
  /** Prefix label rendered before the artist, e.g. "intro:". */
  label?: ReactNode;
  /** When set, occurrences of this term are highlighted across all fields. */
  searchTerm?: string;
}

/**
 * One track row: artist, title, album (linked when albumURL is present), label, year.
 * Used for both the intro track and the song list on the episode and search views.
 */
export default function SongItem({ song, label, searchTerm = '' }: SongItemProps) {
  const hl = (text: string) => highlight(text, searchTerm);

  return (
    <li className="song-list__item">
      {label}{' '}
      <strong>{hl(song.artist)}</strong>, "{hl(song.title)}",{' '}
      {song.albumURL ? (
        <a href={song.albumURL} target="_blank" rel="noopener noreferrer">
          {hl(song.album)}
        </a>
      ) : (
        <em>{hl(song.album)}</em>
      )}
      ; {hl(song.label)}, {hl(song.year)}
    </li>
  );
}
