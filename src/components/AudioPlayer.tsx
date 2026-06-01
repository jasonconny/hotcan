import type { Episode } from '../types';

interface AudioPlayerProps {
  episode: Episode;
}

/**
 * HTML5 audio player with mp3 + ogg sources plus a download link. Audio is served from
 * Cloudflare R2 in production via the _redirects 301 rule on /_res/audio/*.
 */
export default function AudioPlayer({ episode }: AudioPlayerProps) {
  return (
    <>
      <audio
        // Keyed on the source so navigating between episodes remounts a fresh <audio>
        // element. Without this, React reuses the node and only swaps the <source> src,
        // which the media element ignores until audio.load() is called — so it would keep
        // playing the previous episode's file and duration.
        key={episode.mp3Path}
        className="episode__audio"
        controls
        aria-label={`Audio player for episode ${episode.number}: ${episode.title}`}
      >
        <source src={episode.mp3Path} type="audio/mp3" />
        <source src={episode.oggPath} type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>

      <a
        href={episode.mp3Path}
        className="episode__link-download"
        target="_blank"
        rel="noopener noreferrer"
        title="download this episode"
      >
        download this episode
      </a>
    </>
  );
}
