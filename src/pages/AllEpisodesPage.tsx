import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { episodes } from '../data/episodes';
import type { Episode, Song } from '../types';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { highlight } from '../lib/highlight';
import SongItem from '../components/SongItem';

/** Fields searched by the filter, mirroring the original app's parsed episode shape. */
function searchHaystack(episode: Episode): string {
  const songFields = (s: Song) => [s.artist, s.title, s.album, s.label, s.year];
  return [
    String(episode.number),
    episode.title,
    episode.routename,
    ...songFields(episode.intro),
    ...episode.songs.flatMap(songFields),
  ]
    .join(' ')
    .toLowerCase();
}

// Precompute haystacks once; the data never changes.
const haystacks = new Map(episodes.map((e) => [e, searchHaystack(e)]));

export default function AllEpisodesPage() {
  useDocumentTitle('All Episodes');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return [];
    return episodes.filter((e) => haystacks.get(e)!.includes(term));
  }, [searchTerm]);

  const searching = searchTerm.length > 0;

  return (
    <div>
      <article className="all-episodes">
        <h1>All Episodes</h1>

        <div className="search">
          <label className="visually-hidden" htmlFor="episode-search">
            Search episodes
          </label>
          <input
            id="episode-search"
            type="text"
            className="search__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
          />

          <h3 aria-live="polite">
            {searching && filtered.length === 0 && `"${searchTerm}" produced no results`}
            {searching &&
              filtered.length > 0 &&
              `showing ${filtered.length} of ${episodes.length} episodes`}
          </h3>
        </div>

        {!searching && (
          <ul className="episode-list episode-list--all">
            {episodes.map((episode) => (
              <li key={episode.number} className="episode-list__item">
                episode {episode.number}:{' '}
                <Link to={`/${episode.routename}`}>{episode.title}</Link>
                <ul className="song-list">
                  <li className="song-list__item">
                    intro: <strong>{episode.intro.artist}</strong> "{episode.intro.title}";
                  </li>
                  {episode.songs.map((song, i) => (
                    <li key={i} className="song-list__item">
                      <strong>{song.artist}</strong> "{song.title}";
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        {searching && (
          <ul className="episode-list episode-list--results">
            {filtered.map((episode) => (
              <li key={episode.number} className="episode-list__item">
                <span>{highlight(`episode ${episode.number}`, searchTerm)}</span>:{' '}
                <Link to={`/${episode.routename}`}>
                  {highlight(episode.title, searchTerm)}
                </Link>
                <ul className="song-list">
                  <SongItem song={episode.intro} label="intro:" searchTerm={searchTerm} />
                  {episode.songs.map((song, i) => (
                    <SongItem key={i} song={song} searchTerm={searchTerm} />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}
