import { useEffect } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { episodes } from './data/episodes';
import { resolveLegacyPath } from './lib/legacyRedirects';
import EpisodePage from './pages/EpisodePage';
import AllEpisodesPage from './pages/AllEpisodesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ForContentOwnersPage from './pages/ForContentOwnersPage';
import NotFoundPage from './pages/NotFoundPage';

const HOME = `/${episodes[0].routename}`;

/** Scroll to the top of the page on every navigation (replaces the original pushState hack). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Resolve a legacy WordPress URL to its modern target, or show the not-found page. */
function LegacyRedirect() {
  const { pathname } = useLocation();
  const target = resolveLegacyPath(pathname);
  return target ? <Navigate to={target} replace /> : <NotFoundPage />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />

      <header className="logo">
        <h1 className="logo__text">
          <Link to="/">Hot Can</Link>
        </h1>
      </header>

      <nav className="main-nav" aria-label="Main">
        <ul className="main-nav__list">
          <li className="main-nav__list-item">
            <Link to="/about">About</Link>
          </li>
          <li className="main-nav__list-item">
            <Link to="/all">All Episodes</Link>
          </li>
          <li className="main-nav__list-item">
            <a href="http://www.facebook.com/hotcandj">Facebook</a>
          </li>
        </ul>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to={HOME} replace />} />
          <Route path="/all" element={<AllEpisodesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/for-content-owners" element={<ForContentOwnersPage />} />
          <Route path="/uhoh" element={<NotFoundPage />} />
          <Route path="/category/podcast/*" element={<LegacyRedirect />} />
          <Route path="/podcast/*" element={<LegacyRedirect />} />
          <Route path="/:episodeName" element={<EpisodePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="footer">
        &copy; Copyright Hot Can 2012-2014 |{' '}
        <Link to="/for-content-owners">For Content Owners</Link>
      </footer>
    </>
  );
}
