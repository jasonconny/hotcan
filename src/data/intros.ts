import type { Song } from '../types';

/**
 * Resolve an episode's `intro` name key to a full Song. Faithful port of
 * `EpisodeService.getIntro` from the original AngularJS app: only three intros are
 * matched explicitly; everything else (including both the "Hip Hug-Her" and
 * "Hip-Hug Her" spellings in the data) falls through to the Booker T default.
 */
export function getIntro(intro: string): Song {
  switch (intro) {
    case 'Linus And Lucy':
      return {
        artist: 'The Vince Guaraldi Trio',
        title: 'Linus And Lucy',
        album: 'A Charlie Brown Christmas',
        albumURL: 'http://www.allmusic.com/album/a-charlie-brown-christmas-mw0000649547',
        label: 'Fantasy',
        year: '1965',
      };
    case "If You're Ready Come Go With Me":
      return {
        artist: 'Jimmy McGriff',
        title: "If You're Ready Come Go With Me",
        album: "If You're Ready Come Go With Me: The Super Funk Collection",
        albumURL: 'http://www.allmusic.com/album/if-youre-ready-mw0000882187',
        label: 'Groove Merchant',
        year: '1973',
      };
    case 'Blind Man, Blind Man':
      return {
        artist: 'Herbie Hancock',
        title: 'Blind Man, Blind Man',
        album: 'My Point Of View',
        albumURL: 'http://www.allmusic.com/album/my-point-of-view-mw0000247492',
        label: 'Blue Note',
        year: '1963',
      };
    default:
      return {
        artist: 'Booker T & The M.G.s',
        title: 'Hip Hug-Her',
        album: 'Hip Hug-Her',
        albumURL: 'http://www.allmusic.com/album/hip-hug-her-r2306',
        label: 'Stax',
        year: '1967',
      };
  }
}
