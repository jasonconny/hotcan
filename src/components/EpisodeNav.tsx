import { Link } from 'react-router-dom';
import type { Episode } from '../types';

interface EpisodeNavProps {
  previous?: Episode;
  next?: Episode;
}

/**
 * Previous / next episode navigation. Rendered as the fixed circular arrow buttons on the
 * left and right edges. The visible label is hidden via CSS text-indent, so each link
 * carries an aria-label and title naming the target episode for accessibility.
 */
export default function EpisodeNav({ previous, next }: EpisodeNavProps) {
  return (
    <nav className="episode-nav" aria-label="Episode navigation">
      {previous && (
        <Link
          to={`/${previous.routename}`}
          className="episode-nav__link episode-nav__link--previous"
          title={`Previous Episode: ${previous.title}`}
          aria-label={`Previous Episode: ${previous.title}`}
        >
          <span className="visually-hidden">Previous Episode: {previous.title}</span>
        </Link>
      )}

      {next && (
        <Link
          to={`/${next.routename}`}
          className="episode-nav__link episode-nav__link--next"
          title={`Next Episode: ${next.title}`}
          aria-label={`Next Episode: ${next.title}`}
        >
          <span className="visually-hidden">Next Episode: {next.title}</span>
        </Link>
      )}
    </nav>
  );
}
