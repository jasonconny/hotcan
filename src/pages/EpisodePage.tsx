import { useParams } from 'react-router-dom';
import { episodes, getEpisodeByRoutename } from '../data/episodes';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import AudioPlayer from '../components/AudioPlayer';
import SongItem from '../components/SongItem';
import EpisodeNav from '../components/EpisodeNav';
import NotFoundPage from './NotFoundPage';

const longDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });

export default function EpisodePage() {
  const { episodeName } = useParams<{ episodeName: string }>();
  const episode = episodeName ? getEpisodeByRoutename(episodeName) : undefined;

  // No matching episode -> render the not-found page, mirroring the original redirect.
  useDocumentTitle(episode ? `Episode ${episode.number}: ${episode.title}` : undefined);

  if (!episode) return <NotFoundPage />;

  // Episodes are sorted by number, so the array index is number - 1.
  const previous = episodes[episode.number - 2];
  const next = episodes[episode.number];

  return (
    <div>
      <article className="episode">
        <h1 className="episode__title">
          The Hot Can All Vinyl Power Hour, episode {episode.number}:{' '}
          <strong>"{episode.title}"</strong>
        </h1>

        <p className="episode__date">posted on: {longDate.format(episode.postDate)}</p>

        <AudioPlayer episode={episode} />

        <ul className="song-list">
          <SongItem song={episode.intro} label="intro:" />
          {episode.songs.map((song, i) => (
            <SongItem key={i} song={song} />
          ))}
        </ul>
      </article>

      <EpisodeNav previous={previous} next={next} />
    </div>
  );
}
